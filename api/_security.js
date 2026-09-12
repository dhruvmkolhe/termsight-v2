/**
 * Security middleware & helpers for TermSight v2 Vercel Serverless Functions.
 */

const ALLOWED_ORIGIN_PATTERNS = [
  /^https:\/\/(www\.)?termsight\.app$/i,
  /^https:\/\/termsight-[a-z0-9-]+\.vercel\.app$/i,
  /^https:\/\/[a-z0-9-]+-dhruvmkolhe\.vercel\.app$/i,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
  /^chrome-extension:\/\/[a-z0-9]+$/i,
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i,
];

/**
 * Checks whether an origin is authorized to access TermSight API endpoints.
 * @param {string} origin
 * @returns {boolean}
 */
export function isAllowedOrigin(origin) {
  if (!origin || typeof origin !== 'string') return false;
  const trimmed = origin.trim();
  return ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/**
 * Applies domain-restricted CORS headers to the response.
 * Handles OPTIONS preflight automatically.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {boolean} True if the request was an OPTIONS preflight that was handled and completed.
 */
export function applyCors(req, res) {
  const origin = req.headers?.origin || req.headers?.Origin || '';
  
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the official production origin rather than wildcard '*'
    res.setHeader('Access-Control-Allow-Origin', 'https://termsight.app');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function') {
      res.status(204).end();
    } else {
      res.statusCode = 204;
      res.end();
    }
    return true;
  }

  return false;
}

/**
 * Validates that the request payload does not exceed safety thresholds.
 * @param {object} req
 * @param {number} [maxBytes=204800] - Default 200 KB
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePayloadSize(req, maxBytes = 200 * 1024) {
  // Check Content-Length header if sent by client
  const contentLength = req.headers?.['content-length'];
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return {
      valid: false,
      error: `Request payload too large (${Math.round(parseInt(contentLength, 10) / 1024)} KB). Maximum allowed is ${Math.round(maxBytes / 1024)} KB.`,
    };
  }

  // Check serialized req.body size if already parsed
  if (req.body) {
    try {
      const serialized = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (serialized.length > maxBytes) {
        return {
          valid: false,
          error: `Request payload too large (${Math.round(serialized.length / 1024)} KB). Maximum allowed is ${Math.round(maxBytes / 1024)} KB.`,
        };
      }
    } catch {
      // In case body cannot be serialized, proceed to handler validation
    }
  }

  return { valid: true };
}

// In-memory sliding-window rate limit store
export const _rateLimitStore = new Map();

/**
 * Extracts client IP from standard proxy headers or socket.
 * @param {object} req
 * @returns {string}
 */
export function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';
}

/**
 * Applies sliding-window rate limiting to the request.
 *
 * @param {object} req
 * @param {object} res
 * @param {object} [options={}]
 * @param {string} [options.endpoint='api'] - Logical namespace for rate limit (e.g., 'analyses', 'fetch-url')
 * @param {number} [options.maxRequests=20] - Maximum requests allowed within window
 * @param {number} [options.windowMs=60000] - Window duration in milliseconds (default 60s)
 * @returns {boolean} True if the request was blocked with 429 Too Many Requests, false otherwise.
 */
export function applyRateLimit(req, res, options = {}) {
  const {
    endpoint = 'api',
    maxRequests = 20,
    windowMs = 60 * 1000,
  } = options;

  const clientIp = getClientIp(req);
  const storeKey = `${endpoint}:${clientIp}`;
  const now = Date.now();

  let timestamps = _rateLimitStore.get(storeKey) || [];
  // Filter out timestamps outside the sliding window
  timestamps = timestamps.filter((t) => t > now - windowMs);

  if (timestamps.length >= maxRequests) {
    const oldest = timestamps[0];
    const resetInMs = Math.max(0, oldest + windowMs - now);
    const retryAfterSec = Math.max(1, Math.ceil(resetInMs / 1000));

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', '0');
    res.setHeader('X-RateLimit-Reset', String(Math.ceil((oldest + windowMs) / 1000)));
    res.setHeader('Retry-After', String(retryAfterSec));

    const payload = JSON.stringify({
      error: `Too many requests. Rate limit is ${maxRequests} requests per minute. Try again in ${retryAfterSec} second${retryAfterSec === 1 ? '' : 's'}.`,
    });

    if (typeof res.status === 'function') {
      res.status(429);
      if (typeof res.setHeader === 'function') res.setHeader('Content-Type', 'application/json');
      if (typeof res.json === 'function') {
        res.json(JSON.parse(payload));
      } else {
        res.end(payload);
      }
    } else {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.end(payload);
    }

    return true;
  }

  // Record this request
  timestamps.push(now);
  _rateLimitStore.set(storeKey, timestamps);

  // Set standard RateLimit response headers
  res.setHeader('X-RateLimit-Limit', String(maxRequests));
  res.setHeader('X-RateLimit-Remaining', String(maxRequests - timestamps.length));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil((now + windowMs) / 1000)));

  // Auto-prune stale keys if map exceeds 500 entries
  if (_rateLimitStore.size > 500) {
    for (const [key, list] of _rateLimitStore.entries()) {
      const active = list.filter((t) => t > now - windowMs);
      if (active.length === 0) {
        _rateLimitStore.delete(key);
      } else {
        _rateLimitStore.set(key, active);
      }
    }
  }

  return false;
}

