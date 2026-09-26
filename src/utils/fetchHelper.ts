/**
 * Helper to safely fetch and parse JSON responses.
 * Prevents "Unexpected end of JSON input" errors when server returns non-JSON or empty body.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  statusText: string;
  data: T | null;
  error?: string;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    let data: T | null = null;

    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        if (text && text.trim()) {
          try {
            data = JSON.parse(text);
          } catch {
            data = null;
          }
        }
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      const serverError =
        data && typeof data === 'object' && 'error' in data && typeof (data as any).error === 'string'
          ? (data as any).error
          : null;

      const fallbackMsg = response.status === 504
        ? 'The request timed out on the server (504). Please try again.'
        : response.status === 500
        ? 'The server encountered an internal error (500). Please try again.'
        : `Request failed with status ${response.status}${response.statusText ? ` (${response.statusText})` : ''}.`;

      return {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: serverError || fallbackMsg,
      };
    }

    if (data === null) {
      return {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        data: null,
        error: 'Server returned an empty or unparseable response.',
      };
    }

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      data,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network request failed.';
    return {
      ok: false,
      status: 0,
      statusText: '',
      data: null,
      error: message,
    };
  }
}
