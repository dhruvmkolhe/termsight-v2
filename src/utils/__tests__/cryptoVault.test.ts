import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  _resetVaultKeyCache,
  decryptData,
  encryptData,
  getOrCreateVaultKey,
  isWebCryptoAvailable,
  rawStorage,
  secureStorage,
} from '../cryptoVault';

describe('Client-Side Cryptographic Vault (cryptoVault.ts)', () => {
  beforeEach(() => {
    rawStorage.clear();
    _resetVaultKeyCache();
  });

  afterEach(() => {
    rawStorage.clear();
    _resetVaultKeyCache();
  });

  it('should detect Web Crypto API availability in runtime environment', () => {
    expect(isWebCryptoAvailable()).toBe(true);
  });

  it('should derive a consistent 256-bit AES-GCM CryptoKey', async () => {
    const key1 = await getOrCreateVaultKey();
    expect(key1).toBeDefined();
    expect(key1.algorithm.name).toBe('AES-GCM');

    // Subsequent calls in the same session return the cached key
    const key2 = await getOrCreateVaultKey();
    expect(key2).toBe(key1);
  });

  it('should encrypt data into an authenticated ENC:v1 bundle', async () => {
    const payload = {
      title: 'Mutual Non-Disclosure Agreement',
      clauses: [
        { id: 1, text: 'Confidentiality shall last for 3 years.' },
        { id: 2, text: 'Disputes shall be governed by Delaware law.' },
      ],
      userId: 'usr_789xyz',
    };

    const encrypted = await encryptData(payload);
    expect(encrypted.startsWith('ENC:v1:')).toBe(true);
    expect(encrypted).not.toContain('Mutual Non-Disclosure Agreement');
    expect(encrypted).not.toContain('Delaware law');

    const parts = encrypted.slice('ENC:v1:'.length).split(':');
    expect(parts.length).toBe(2); // [ivB64, cipherB64]
    expect(parts[0].length).toBeGreaterThan(10);
    expect(parts[1].length).toBeGreaterThan(20);
  });

  it('should decrypt an encrypted bundle accurately', async () => {
    const originalContract = {
      title: 'Commercial SaaS Terms of Service',
      riskScore: 82,
      confidentialNotes: 'User identified 2 red flag clauses regarding liability caps.',
    };

    const encrypted = await encryptData(originalContract);
    const decrypted = await decryptData<typeof originalContract>(encrypted);

    expect(decrypted).toEqual(originalContract);
  });

  it('should reject tampered or corrupted ciphertext with null (AES-GCM auth failure)', async () => {
    const original = { secret: 'Confidential corporate strategy' };
    const encrypted = await encryptData(original);

    // Tamper with the ciphertext by flipping characters in the payload
    const parts = encrypted.split(':');
    const tamperedCipher = parts[2].slice(0, -4) + 'AAAA';
    const tamperedBundle = `${parts[0]}:${parts[1]}:${tamperedCipher}`;

    const decrypted = await decryptData(tamperedBundle);
    expect(decrypted).toBeNull();
  });

  it('should support backward-compatible decryption of unencrypted legacy JSON', async () => {
    const legacyJson = JSON.stringify({ legacyField: 'Plaintext historic contract' });
    const decrypted = await decryptData<{ legacyField: string }>(legacyJson);

    expect(decrypted).toEqual({ legacyField: 'Plaintext historic contract' });
  });

  it('should return null for malformed or empty input', async () => {
    expect(await decryptData('')).toBeNull();
    expect(await decryptData('invalid-random-string')).toBeNull();
  });

  describe('secureStorage wrapper', () => {
    it('should transparently encrypt on setItem and decrypt on getItem', async () => {
      const auditData = {
        agreementName: 'Employment Agreement 2026',
        redFlagsCount: 3,
      };

      await secureStorage.setItem('cached_audit', auditData);

      // Verify that raw storage contains only the encrypted ciphertext
      const rawInStorage = rawStorage.getItem('cached_audit');
      expect(rawInStorage).toBeDefined();
      expect(rawInStorage?.startsWith('ENC:v1:')).toBe(true);
      expect(rawInStorage).not.toContain('Employment Agreement 2026');

      // Verify transparent decryption on retrieval
      const restored = await secureStorage.getItem<typeof auditData>('cached_audit');
      expect(restored).toEqual(auditData);

      // Verify removal
      secureStorage.removeItem('cached_audit');
      expect(rawStorage.getItem('cached_audit')).toBeNull();
    });
  });
});
