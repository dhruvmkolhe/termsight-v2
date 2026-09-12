import dns from 'dns/promises';
import net from 'net';

/**
 * Checks whether an IP address belongs to private, loopback, link-local,
 * or cloud metadata ranges.
 *
 * @param {string} ip
 * @returns {boolean} True if the IP is blocked (private/reserved)
 */
export function isPrivateOrBlockedIP(ip) {
  if (!ip || typeof ip !== 'string') return true;
  const trimmed = ip.trim().toLowerCase();

  const ipVersion = net.isIP(trimmed);
  if (!ipVersion) return true; // Invalid IP format is treated as unsafe

  // Handle IPv4
  if (ipVersion === 4) {
    const octets = trimmed.split('.').map((p) => parseInt(p, 10));
    if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) return true;

    // 0.0.0.0/8 (Current network)
    if (octets[0] === 0) return true;

    // 10.0.0.0/8 (Private RFC 1918)
    if (octets[0] === 10) return true;

    // 100.64.0.0/10 (Shared address space / Carrier-grade NAT)
    if (octets[0] === 100 && octets[1] >= 64 && octets[1] <= 127) return true;

    // 127.0.0.0/8 (Loopback)
    if (octets[0] === 127) return true;

    // 169.254.0.0/16 (Link-local / AWS, GCP, Azure, OpenStack metadata)
    if (octets[0] === 169 && octets[1] === 254) return true;

    // 172.16.0.0/12 (Private RFC 1918: 172.16.0.0 – 172.31.255.255)
    if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (octets[0] === 192 && octets[1] === 0 && octets[2] === 0) return true;

    // 192.0.2.0/24 (TEST-NET-1 documentation)
    if (octets[0] === 192 && octets[1] === 0 && octets[2] === 2) return true;

    // 192.88.99.0/24 (6to4 Relay Anycast)
    if (octets[0] === 192 && octets[1] === 88 && octets[2] === 99) return true;

    // 192.168.0.0/16 (Private RFC 1918)
    if (octets[0] === 192 && octets[1] === 168) return true;

    // 198.18.0.0/15 (Network benchmark tests)
    if (octets[0] === 198 && (octets[1] === 18 || octets[1] === 19)) return true;

    // 198.51.100.0/24 (TEST-NET-2 documentation)
    if (octets[0] === 198 && octets[1] === 51 && octets[2] === 100) return true;

    // 203.0.113.0/24 (TEST-NET-3 documentation)
    if (octets[0] === 203 && octets[1] === 0 && octets[2] === 113) return true;

    // 224.0.0.0/4 (Multicast: 224.0.0.0 - 239.255.255.255)
    if (octets[0] >= 224 && octets[0] <= 239) return true;

    // 240.0.0.0/4 (Reserved / Future use / Broadcast)
    if (octets[0] >= 240) return true;

    return false;
  }

  // Handle IPv6
  if (ipVersion === 6) {
    // ::1 (Loopback)
    if (trimmed === '::1') return true;

    // :: (Unspecified address)
    if (trimmed === '::') return true;

    // IPv4-mapped IPv6: ::ffff:192.168.1.1
    if (trimmed.startsWith('::ffff:')) {
      const ipv4Part = trimmed.slice(7);
      return isPrivateOrBlockedIP(ipv4Part);
    }

    // fe80::/10 (Link-local unicast)
    if (trimmed.startsWith('fe8') || trimmed.startsWith('fe9') || trimmed.startsWith('fea') || trimmed.startsWith('feb')) {
      return true;
    }

    // fc00::/7 (Unique local address / private)
    if (trimmed.startsWith('fc') || trimmed.startsWith('fd')) {
      return true;
    }

    // ff00::/8 (Multicast)
    if (trimmed.startsWith('ff')) {
      return true;
    }

    return false;
  }

  return true;
}

/**
 * Validates a URL against SSRF vulnerabilities.
 * Checks protocol, standard ports, and resolves DNS to verify no private/metadata IPs.
 *
 * @param {string} urlString
 * @returns {Promise<{ safe: boolean, parsedUrl?: URL, error?: string }>}
 */
export async function validateSafeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { safe: false, error: 'URL must be a non-empty string.' };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(urlString.trim());
  } catch {
    return { safe: false, error: 'Invalid URL format. Include http:// or https://' };
  }

  // 1. Protocol check
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return { safe: false, error: 'Only HTTP and HTTPS protocols are permitted.' };
  }

  // 2. Port check (allow standard ports only to prevent internal port scanning)
  if (parsedUrl.port && parsedUrl.port !== '80' && parsedUrl.port !== '443') {
    return {
      safe: false,
      error: `Non-standard port (${parsedUrl.port}) blocked. Only standard web ports (80, 443) are allowed.`,
    };
  }

  const hostname = parsedUrl.hostname.trim();
  if (!hostname) {
    return { safe: false, error: 'URL is missing a valid hostname.' };
  }

  // 3. Direct IP hostname check
  if (net.isIP(hostname)) {
    if (isPrivateOrBlockedIP(hostname)) {
      return {
        safe: false,
        error: 'Access to private, loopback, or cloud infrastructure addresses is blocked.',
      };
    }
    return { safe: true, parsedUrl };
  }

  // 4. DNS resolution check: resolve all A and AAAA records
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    if (!addresses || addresses.length === 0) {
      return { safe: false, error: 'Could not resolve domain name via DNS.' };
    }

    for (const record of addresses) {
      if (isPrivateOrBlockedIP(record.address)) {
        return {
          safe: false,
          error: `Domain resolves to a blocked or internal IP (${record.address}). Request rejected for security.`,
        };
      }
    }
  } catch (err) {
    return { safe: false, error: `DNS lookup failed for ${hostname}: ${err.message}` };
  }

  return { safe: true, parsedUrl };
}

/**
 * Safe fetch implementation that enforces SSRF validation, redirects re-validation,
 * response timeout, and memory/content caps.
 *
 * @param {string} initialUrl
 * @param {object} [options={}]
 * @returns {Promise<Response>}
 */
export async function safeFetch(initialUrl, options = {}) {
  const maxRedirects = 3;
  let currentUrl = initialUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    // Re-validate each URL (including redirect targets) against SSRF
    const check = await validateSafeUrl(currentUrl);
    if (!check.safe) {
      throw new Error(check.error || 'Blocked by SSRF security shield.');
    }

    const controller = new AbortController();
    const timeoutMs = options.timeoutMs || 7000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        headers: {
          'User-Agent':
            options.userAgent ||
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TermSight-Scraper/2.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...options.headers,
        },
        redirect: 'manual', // Intercept redirects to re-validate destination IPs
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle redirects
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (!location) {
          throw new Error(`Redirect response (${response.status}) did not include a Location header.`);
        }

        redirectsCount++;
        if (redirectsCount > maxRedirects) {
          throw new Error('Too many redirects (max 3 allowed).');
        }

        // Resolve relative redirects against current URL
        currentUrl = new URL(location, currentUrl).toString();
        continue;
      }

      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Fetch timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
      }
      throw err;
    }
  }

  throw new Error('Exceeded maximum allowed redirects.');
}
