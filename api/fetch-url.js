import { applyCors, validatePayloadSize } from './_security.js';

function cleanHtmlToText(html) {
  let text = html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '');

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Scraped Legal Document';

  text = text
    .replace(/<(?:p|div|br|h[1-6]|li|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\r\n|\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();

  return { title, text };
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payloadCheck = validatePayloadSize(req, 10 * 1024);
  if (!payloadCheck.valid) {
    return res.status(413).json({ error: payloadCheck.error });
  }

  const { url } = req.body || {};
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Please provide a valid URL to analyze.' });
  }

  if (url.trim().length > 2048) {
    return res.status(400).json({ error: 'URL exceeds maximum length of 2,048 characters.' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Only HTTP and HTTPS URLs are supported.' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL format. Include http:// or https://' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 TermSight-Scraper/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(400).json({
        error: `Could not fetch this webpage (${response.status} ${response.statusText}). Try copy-pasting the text directly.`,
      });
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 2 * 1024 * 1024) {
      return res.status(413).json({
        error: 'The target webpage is too large (> 2 MB). Please copy and paste the legal text directly.',
      });
    }

    const rawHtml = await response.text();
    const html = rawHtml.slice(0, 2000000); // Guard against memory spikes
    const { title, text } = cleanHtmlToText(html);

    if (!text || text.length < 100) {
      return res.status(400).json({
        error: 'We could not extract readable legal text from this webpage. Try selecting and pasting the text.',
      });
    }

    const trimmedText = text.slice(0, 60000);

    return res.status(200).json({
      title,
      text: trimmedText,
      characterCount: trimmedText.length,
      url: parsedUrl.toString(),
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      return res.status(408).json({ error: 'Webpage fetch timed out after 9 seconds. Please copy and paste the text manually.' });
    }
    return res.status(500).json({ error: `Failed to fetch URL: ${err.message}` });
  }
}
