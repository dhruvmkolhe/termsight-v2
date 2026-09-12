/**
 * Luhn checksum algorithm for validating Credit Card numbers.
 * Eliminates false positives on arbitrary 16-digit order IDs or timestamps.
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}

// Client-Side PII Masker (Privacy Shield)
export function maskSensitivePII(rawText: string): { maskedText: string; count: number } {
  let count = 0;
  let masked = rawText;

  // 1. Credit Cards with Luhn Checksum validation (Visa, Mastercard, Amex, Discover, etc.)
  const cardCandidateRegex = /\b(?:\d{4}[ -]?){3}\d{1,7}\b|\b\d{13,19}\b/g;
  masked = masked.replace(cardCandidateRegex, (match) => {
    if (isValidLuhn(match)) {
      count++;
      return '[REDACTED_CREDIT_CARD]';
    }
    return match;
  });

  // 2. International Bank Account Numbers (IBAN)
  const ibanRegex = /\b[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]{4}){2,7}(?:[ -]?[A-Z0-9]{1,4})?\b/g;
  masked = masked.replace(ibanRegex, (match) => {
    const clean = match.replace(/[\s-]/g, '');
    if (clean.length >= 14 && clean.length <= 34) {
      count++;
      return '[REDACTED_IBAN]';
    }
    return match;
  });

  // 3. Cryptocurrency Wallet Addresses (Ethereum, Bitcoin legacy, Bitcoin Bech32)
  const cryptoRegex = /\b0x[a-fA-F0-9]{40}\b|\b(?:[13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{38,62})\b/g;
  masked = masked.replace(cryptoRegex, () => {
    count++;
    return '[REDACTED_CRYPTO_ADDRESS]';
  });

  // 4. Email addresses
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  masked = masked.replace(emailRegex, () => {
    count++;
    return '[REDACTED_EMAIL]';
  });

  // 5. Phone numbers (e.g. +1 555-123-4567, (555) 123-4567, 555-123-4567)
  const phoneRegex = /(?<!\w)(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  masked = masked.replace(phoneRegex, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

  // 6. Social Security / Tax Identification Numbers
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  masked = masked.replace(ssnRegex, () => {
    count++;
    return '[REDACTED_TAX_ID]';
  });

  // 7. Financial Currency amounts (e.g. $50,000.00, $500, 10,000 USD)
  const currencyRegex = /\$\s?\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*(?:\.\d{2})?\s?(?:USD|EUR|GBP|CAD|AUD|INR)\b/gi;
  masked = masked.replace(currencyRegex, () => {
    count++;
    return '[REDACTED_AMOUNT]';
  });

  // 8. Physical Street addresses
  const addressRegex = /\b\d{1,5}\s+[A-Za-z0-9\s.,]{2,25}(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct)\b/gi;
  masked = masked.replace(addressRegex, () => {
    count++;
    return '[REDACTED_ADDRESS]';
  });

  return { maskedText: masked, count };
}
