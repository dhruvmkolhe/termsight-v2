import { describe, expect, it } from 'vitest';
import { maskSensitivePII } from '../piiMasker';

describe('maskSensitivePII (Privacy Shield)', () => {
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
