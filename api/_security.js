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
