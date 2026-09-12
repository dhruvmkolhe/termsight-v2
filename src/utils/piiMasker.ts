// Client-Side PII Masker (Privacy Shield)
export function maskSensitivePII(rawText: string): { maskedText: string; count: number } {
  let count = 0;
  let masked = rawText;

  // 1. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  masked = masked.replace(emailRegex, () => {
    count++;
    return '[REDACTED_EMAIL]';
  });

  // 2. Phone numbers (e.g. +1 555-123-4567, (555) 123-4567, 555-123-4567)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  masked = masked.replace(phoneRegex, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

  // 3. Social Security / Tax Identification Numbers
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  masked = masked.replace(ssnRegex, () => {
    count++;
    return '[REDACTED_TAX_ID]';
  });

  // 4. Financial Currency amounts (e.g. $50,000.00, $500, 10,000 USD)
  const currencyRegex = /\$\s?\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|EUR|GBP|CAD|AUD|INR)\b/gi;
  masked = masked.replace(currencyRegex, () => {
    count++;
    return '[REDACTED_AMOUNT]';
  });

  // 5. Physical Street addresses
  const addressRegex = /\b\d{1,5}\s+[A-Za-z0-9\s.,]{2,25}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/gi;
  masked = masked.replace(addressRegex, () => {
    count++;
    return '[REDACTED_ADDRESS]';
  });

  return { maskedText: masked, count };
}
