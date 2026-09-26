import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { safeFetchJson } from '../fetchHelper';

describe('safeFetchJson', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('handles successful JSON response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true, message: 'analyzed' }),
    } as any);

    const res = await safeFetchJson('/api/analyses');
    expect(res.ok).toBe(true);
    expect(res.data).toEqual({ success: true, message: 'analyzed' });
  });

  it('handles 504 Gateway Timeout HTML page without throwing JSON parse error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 504,
      statusText: 'Gateway Timeout',
      headers: new Headers({ 'content-type': 'text/html' }),
      text: async () => '<html><body>Gateway Timeout</body></html>',
    } as any);

    const res = await safeFetchJson('/api/analyses');
    expect(res.ok).toBe(false);
    expect(res.data).toBeNull();
    expect(res.error).toContain('504');
    expect(res.error).not.toContain('Unexpected end of JSON input');
  });

  it('handles empty response body gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => {
        throw new SyntaxError('Unexpected end of JSON input');
      },
    } as any);

    const res = await safeFetchJson('/api/analyses');
    expect(res.ok).toBe(false);
    expect(res.data).toBeNull();
    expect(res.error).toBe('Server returned an empty or unparseable response.');
  });

  it('extracts server error message from JSON error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Paste at least 120 characters.' }),
    } as any);

    const res = await safeFetchJson('/api/analyses');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Paste at least 120 characters.');
  });

  it('handles network error (e.g. offline)', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    const res = await safeFetchJson('/api/analyses');
    expect(res.ok).toBe(false);
    expect(res.error).toBe('Failed to fetch');
  });
});
