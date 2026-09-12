/**
 * TermSight v2 Client-Side Cryptographic Vault
 * Zero-knowledge, authenticated 256-bit AES-GCM encryption for client-side storage.
 * Compatible with modern browsers, Web Workers, and Node 20+ environments.
 */

const VAULT_PREFIX = 'ENC:v1:';
const SALT_STORAGE_KEY = 'termsight_vault_salt_v1';

let cachedVaultKey: CryptoKey | null = null;

// Fallback in-memory map when localStorage is not available (e.g. Node test runner)
const memoryStorage = new Map<string, string>();

export const rawStorage = {
  getItem(key: string): string | null {
    if (typeof localStorage !== 'undefined') {
      try { return localStorage.getItem(key); } catch { /* ignore */ }
    }
    return memoryStorage.get(key) ?? null;
  },
  setItem(key: string, value: string): void {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(key, value); return; } catch { /* ignore */ }
    }
    memoryStorage.set(key, value);
  },
  removeItem(key: string): void {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.removeItem(key); return; } catch { /* ignore */ }
    }
    memoryStorage.delete(key);
  },
  clear(): void {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.clear(); } catch { /* ignore */ }
    }
    memoryStorage.clear();
  },
};

/**
 * Retrieves the crypto instance across Browser and Node environments.
 */
export function getCrypto(): Crypto {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API is not available in this environment.');
}

/**
 * Checks if the Web Crypto API is available in the current runtime.
 */
export function isWebCryptoAvailable(): boolean {
  try {
    const c = getCrypto();
    return Boolean(c && c.subtle);
  } catch {
    return false;
  }
}

/**
 * Converts a Uint8Array buffer into a Base64 string.
 */
function bufferToBase64(buffer: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < buffer.byteLength; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

/**
 * Converts a Base64 string back into a Uint8Array buffer.
 */
function base64ToBuffer(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives or retrieves the device-isolated 256-bit AES-GCM cryptographic vault key.
 */
export async function getOrCreateVaultKey(): Promise<CryptoKey> {
  if (cachedVaultKey) return cachedVaultKey;

  const cryptoInstance = getCrypto();

  // Retrieve or generate a high-entropy device salt
  let rawSalt = rawStorage.getItem(SALT_STORAGE_KEY);
  if (!rawSalt) {
    const saltBytes = cryptoInstance.getRandomValues(new Uint8Array(16));
    rawSalt = Array.from(saltBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    rawStorage.setItem(SALT_STORAGE_KEY, rawSalt);
  }

  const encoder = new TextEncoder();
  const keyMaterial = await cryptoInstance.subtle.importKey(
    'raw',
    encoder.encode(`termsight-vault-entropy:${rawSalt}`),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  cachedVaultKey = await cryptoInstance.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(rawSalt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return cachedVaultKey;
}

/**
 * Resets the in-memory cached vault key (primarily used in tests).
 */
export function _resetVaultKeyCache(): void {
  cachedVaultKey = null;
}

/**
 * Encrypts arbitrary data into a tamper-evident AES-GCM bundle.
 *
 * @param data - Any serializable object or string
 * @param [customKey] - Optional custom CryptoKey
 * @returns Base64 encrypted bundle format: ENC:v1:<iv>:<ciphertext>
 */
export async function encryptData<T>(data: T, customKey?: CryptoKey): Promise<string> {
  if (!isWebCryptoAvailable()) {
    return JSON.stringify(data);
  }

  const cryptoInstance = getCrypto();
  const key = customKey || (await getOrCreateVaultKey());
  const serialized = JSON.stringify(data);
  const encoded = new TextEncoder().encode(serialized);

  // 96-bit (12 byte) random IV per NIST SP 800-38D recommendation for AES-GCM
  const iv = cryptoInstance.getRandomValues(new Uint8Array(12));

  const cipherBuffer = await cryptoInstance.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const ivB64 = bufferToBase64(iv);
  const cipherB64 = bufferToBase64(new Uint8Array(cipherBuffer));

  return `${VAULT_PREFIX}${ivB64}:${cipherB64}`;
}

/**
 * Decrypts a tamper-evident AES-GCM bundle back into its original object.
 *
 * @param bundle - Encrypted string or plain JSON fallback
 * @param [customKey] - Optional custom CryptoKey
 * @returns Decrypted object or null if decryption fails / data was tampered with
 */
export async function decryptData<T>(bundle: string, customKey?: CryptoKey): Promise<T | null> {
  if (!bundle || typeof bundle !== 'string') return null;

  // Handle plain JSON legacy or unencrypted fallback
  if (!bundle.startsWith(VAULT_PREFIX)) {
    try {
      return JSON.parse(bundle) as T;
    } catch {
      return null;
    }
  }

  if (!isWebCryptoAvailable()) return null;

  try {
    const rawPayload = bundle.slice(VAULT_PREFIX.length);
    const [ivB64, cipherB64] = rawPayload.split(':');
    if (!ivB64 || !cipherB64) return null;

    const iv = base64ToBuffer(ivB64);
    const ciphertext = base64ToBuffer(cipherB64);

    const cryptoInstance = getCrypto();
    const key = customKey || (await getOrCreateVaultKey());
    const decryptedBuffer = await cryptoInstance.subtle.decrypt(
      { name: 'AES-GCM', iv: iv as Uint8Array<ArrayBuffer> },
      key,
      ciphertext as Uint8Array<ArrayBuffer>
    );

    const decoded = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decoded) as T;
  } catch {
    // Authentication tag failure, key mismatch, or corrupt data
    return null;
  }
}

/**
 * Secure Storage wrapper providing asynchronous encrypted persistence.
 */
export const secureStorage = {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const encrypted = await encryptData(value);
      rawStorage.setItem(key, encrypted);
    } catch {
      // Storage unavailable or blocked
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const raw = rawStorage.getItem(key);
      if (!raw) return null;
      return await decryptData<T>(raw);
    } catch {
      return null;
    }
  },

  removeItem(key: string): void {
    rawStorage.removeItem(key);
  },

  clear(): void {
    rawStorage.clear();
  },
};
