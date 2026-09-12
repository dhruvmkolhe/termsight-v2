import { describe, expect, it } from 'vitest';
import { isValidLuhn, maskSensitivePII } from '../piiMasker';

describe('isValidLuhn', () => {
  it('should validate genuine credit card checksums', () => {
    expect(isValidLuhn('4532 0151 1283 0366')).toBe(true);
    expect(isValidLuhn('5425-2334-3010-9903')).toBe(true);
  });

  it('should reject invalid card numbers', () => {
    expect(isValidLuhn('4532015112830367')).toBe(false);
    expect(isValidLuhn('1111222233334445')).toBe(false);
    expect(isValidLuhn('12345')).toBe(false);
  });
});

describe('maskSensitivePII (Privacy Shield)', () => {
  it('should mask valid credit card numbers and ignore invalid sequences', () => {
    const input = 'Client billed on card 4532 0151 1283 0366 with internal batch ID 1111222233334445.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_CREDIT_CARD]');
    expect(result.maskedText).not.toContain('4532 0151 1283 0366');
    expect(result.maskedText).toContain('1111222233334445'); // Failed Luhn check, preserved
  });

  it('should mask International Bank Account Numbers (IBAN)', () => {
    const input = 'Wire transfer to GB82WEST12345698765432 or DE89 3704 0044 0532 0130 00.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_IBAN]');
    expect(result.maskedText).not.toContain('GB82WEST12345698765432');
    expect(result.count).toBe(2);
  });

  it('should mask cryptocurrency wallet addresses', () => {
    const input = 'Settlement to ETH 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 or BTC 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa or bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_CRYPTO_ADDRESS]');
    expect(result.maskedText).not.toContain('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    expect(result.count).toBe(3);
  });

  it('should mask email addresses accurately', () => {
    const input = 'Contact john.doe@company.com or legal-ops@sub.domain.co.uk for inquiries.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_EMAIL]');
    expect(result.maskedText).not.toContain('john.doe@company.com');
    expect(result.maskedText).not.toContain('legal-ops@sub.domain.co.uk');
    expect(result.count).toBe(2);
  });

  it('should mask various phone number formats', () => {
    const input = 'Call +1 (555) 123-4567 or emergency 555-987-6543 immediately.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_PHONE]');
    expect(result.maskedText).not.toContain('123-4567');
    expect(result.count).toBeGreaterThanOrEqual(1);
  });

  it('should mask Social Security / Tax Identification Numbers', () => {
    const input = 'Contractor SSN is 123-45-6789 on the W-9 form.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toBe('Contractor SSN is [REDACTED_TAX_ID] on the W-9 form.');
    expect(result.count).toBe(1);
  });

  it('should mask financial currency figures', () => {
    const input = 'Liability is limited to $50.00 and contract value is 25,000 USD or $10,000,000.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_AMOUNT]');
    expect(result.maskedText).not.toContain('$50.00');
    expect(result.maskedText).not.toContain('25,000 USD');
    expect(result.count).toBeGreaterThanOrEqual(2);
  });

  it('should mask street addresses', () => {
    const input = 'Notices sent to 123 Main Street, Suite 400 or 500 Market Blvd.';
    const result = maskSensitivePII(input);

    expect(result.maskedText).toContain('[REDACTED_ADDRESS]');
    expect(result.count).toBeGreaterThanOrEqual(1);
  });

  it('should return unchanged text when no PII exists', () => {
    const cleanText = 'The quick brown fox jumps over the lazy dog in accordance with standard terms.';
    const result = maskSensitivePII(cleanText);

    expect(result.maskedText).toBe(cleanText);
    expect(result.count).toBe(0);
  });
});
