import { beforeEach, describe, expect, it } from 'vitest';
import {
  _rateLimitStore,
  applyCors,
  applyRateLimit,
  getClientIp,
  isAllowedOrigin,
  validatePayloadSize,
} from '../../../api/_security.js';

describe('API Security Middleware (_security.js)', () => {
  describe('isAllowedOrigin', () => {
    it('should allow legitimate TermSight production domains', () => {
      expect(isAllowedOrigin('https://termsight.app')).toBe(true);
      expect(isAllowedOrigin('https://www.termsight.app')).toBe(true);
    });

    it('should allow Vercel deployment preview URLs', () => {
      expect(isAllowedOrigin('https://termsight-v2.vercel.app')).toBe(true);
      expect(isAllowedOrigin('https://termsight-v2-git-main-dhruvmkolhe.vercel.app')).toBe(true);
      expect(isAllowedOrigin('https://custom-preview-123.vercel.app')).toBe(true);
    });

    it('should allow local development hosts', () => {
      expect(isAllowedOrigin('http://localhost:5173')).toBe(true);
      expect(isAllowedOrigin('http://localhost:4173')).toBe(true);
      expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
      expect(isAllowedOrigin('http://127.0.0.1:5173')).toBe(true);
    });

    it('should allow Chrome extension origins', () => {
      expect(isAllowedOrigin('chrome-extension://abcdefghijklmnopqrstuvwxyz123456')).toBe(true);
    });

    it('should strictly reject malicious and spoofed origins', () => {
      expect(isAllowedOrigin('https://malicious-site.com')).toBe(false);
      expect(isAllowedOrigin('https://termsight.app.attacker.com')).toBe(false);
      expect(isAllowedOrigin('http://termsight.app')).toBe(false); // HTTP rejected
      expect(isAllowedOrigin('null')).toBe(false);
      expect(isAllowedOrigin('')).toBe(false);
    });
  });

  describe('applyCors', () => {
    function createMockRes() {
      const headers: Record<string, string> = {};

      return {
        headers,
        statusCode: 200,
        ended: false,
        setHeader(name: string, value: string) {
          headers[name] = value;
        },
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        end() {
          this.ended = true;
          return this;
        },
      };
    }

    it('should reflect trusted origin in Access-Control-Allow-Origin', () => {
      const req = {
        headers: { origin: 'https://termsight.app' },
        method: 'POST',
      };
      const res = createMockRes();

      const handled = applyCors(req as unknown as Parameters<typeof applyCors>[0], res as unknown as Parameters<typeof applyCors>[1]);
      expect(handled).toBe(false);
      expect(res.headers['Access-Control-Allow-Origin']).toBe('https://termsight.app');
      expect(res.headers['Vary']).toBe('Origin');
    });

    it('should fall back to official production origin for untrusted origin', () => {
      const req = {
        headers: { origin: 'https://evil-phishing-site.xyz' },
        method: 'POST',
      };
      const res = createMockRes();

      applyCors(req as unknown as Parameters<typeof applyCors>[0], res as unknown as Parameters<typeof applyCors>[1]);
      expect(res.headers['Access-Control-Allow-Origin']).toBe('https://termsight.app');
    });

    it('should immediately handle OPTIONS preflight requests with 204 No Content', () => {
      const req = {
        headers: { origin: 'http://localhost:5173' },
        method: 'OPTIONS',
      };
      const res = createMockRes();

      const handled = applyCors(req as unknown as Parameters<typeof applyCors>[0], res as unknown as Parameters<typeof applyCors>[1]);
      expect(handled).toBe(true);
      expect(res.statusCode).toBe(204);
      expect(res.ended).toBe(true);
      expect(res.headers['Access-Control-Allow-Origin']).toBe('http://localhost:5173');
    });
  });

  describe('validatePayloadSize', () => {
    it('should accept payloads within the specified limit', () => {
      const req = {
        headers: { 'content-length': '1024' },
        body: { text: 'Valid legal agreement text' },
      };
      const result = validatePayloadSize(req, 10 * 1024);
      expect(result.valid).toBe(true);
    });

    it('should reject requests where Content-Length exceeds threshold', () => {
      const req = {
        headers: { 'content-length': '500000' },
        body: {},
      };
      const result = validatePayloadSize(req, 200 * 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('payload too large');
    });

    it('should reject requests where serialized body exceeds threshold', () => {
      const largeText = 'A'.repeat(300 * 1024);
      const req = {
        headers: {},
        body: { text: largeText },
      };
      const result = validatePayloadSize(req, 200 * 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('payload too large');
    });
  });

  describe('getClientIp & applyRateLimit', () => {
    function createMockRes() {
      const headers: Record<string, string> = {};

      return {
        headers,
        statusCode: 200,
        ended: false,
        jsonBody: null as unknown,
        setHeader(name: string, value: string) {
          headers[name] = value;
        },
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        json(body: unknown) {
          this.jsonBody = body;
          this.ended = true;
          return this;
        },
        end(data?: string) {
          this.ended = true;
          if (data && !this.jsonBody) {
            try { this.jsonBody = JSON.parse(data); } catch { /* ignore */ }
          }
          return this;
        },
      };
    }

    beforeEach(() => {
      _rateLimitStore.clear();
    });

    type Req = Parameters<typeof applyRateLimit>[0];
    type Res = Parameters<typeof applyRateLimit>[1];

    it('should extract client IP accurately from proxy headers', () => {
      const reqWithForwarded = {
        headers: { 'x-forwarded-for': '203.0.113.195, 70.41.3.18' },
      };
      expect(getClientIp(reqWithForwarded as unknown as Parameters<typeof getClientIp>[0])).toBe('203.0.113.195');

      const reqWithRealIp = {
        headers: { 'x-real-ip': '198.51.100.42' },
      };
      expect(getClientIp(reqWithRealIp as unknown as Parameters<typeof getClientIp>[0])).toBe('198.51.100.42');
    });

    it('should allow requests within rate limit and set headers', () => {
      const req = { headers: { 'x-real-ip': '104.28.10.5' } };
      const res = createMockRes();

      const blocked = applyRateLimit(req as unknown as Req, res as unknown as Res, {
        endpoint: 'test-api',
        maxRequests: 5,
        windowMs: 60000,
      });

      expect(blocked).toBe(false);
      expect(res.headers['X-RateLimit-Limit']).toBe('5');
      expect(res.headers['X-RateLimit-Remaining']).toBe('4');
    });

    it('should block requests that exceed threshold with 429 Too Many Requests', () => {
      const req = { headers: { 'x-real-ip': '104.28.10.99' } };
      const options = { endpoint: 'strict-api', maxRequests: 2, windowMs: 60000 };

      // 1st request
      expect(applyRateLimit(req as unknown as Req, createMockRes() as unknown as Res, options)).toBe(false);
      // 2nd request
      expect(applyRateLimit(req as unknown as Req, createMockRes() as unknown as Res, options)).toBe(false);

      // 3rd request should be blocked
      const res3 = createMockRes();
      const blocked = applyRateLimit(req as unknown as Req, res3 as unknown as Res, options);

      expect(blocked).toBe(true);
      expect(res3.statusCode).toBe(429);
      expect(res3.headers['Retry-After']).toBeDefined();
      expect(res3.headers['X-RateLimit-Remaining']).toBe('0');
      expect(res3.jsonBody).toHaveProperty('error');
    });
  });
});
