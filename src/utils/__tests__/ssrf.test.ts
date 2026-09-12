import { describe, expect, it } from 'vitest';
import { isPrivateOrBlockedIP, validateSafeUrl } from '../../../api/_ssrf.js';

describe('SSRF Protection Shield (_ssrf.js)', () => {
  describe('isPrivateOrBlockedIP', () => {
    it('should block IPv4 loopback and local network addresses', () => {
      expect(isPrivateOrBlockedIP('127.0.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('127.0.0.254')).toBe(true);
      expect(isPrivateOrBlockedIP('0.0.0.0')).toBe(true);
    });

    it('should block cloud metadata addresses (AWS / GCP / Azure)', () => {
      expect(isPrivateOrBlockedIP('169.254.169.254')).toBe(true);
      expect(isPrivateOrBlockedIP('169.254.0.1')).toBe(true);
    });

    it('should block RFC 1918 private subnets', () => {
      expect(isPrivateOrBlockedIP('10.0.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('10.255.255.255')).toBe(true);
      expect(isPrivateOrBlockedIP('172.16.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('172.31.255.255')).toBe(true);
      expect(isPrivateOrBlockedIP('192.168.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('192.168.1.100')).toBe(true);
    });

    it('should block carrier-grade NAT, multicast, and documentation IPs', () => {
      expect(isPrivateOrBlockedIP('100.64.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('192.0.2.1')).toBe(true);
      expect(isPrivateOrBlockedIP('224.0.0.1')).toBe(true);
      expect(isPrivateOrBlockedIP('255.255.255.255')).toBe(true);
    });

    it('should block IPv6 loopback, link-local, and unique local addresses', () => {
      expect(isPrivateOrBlockedIP('::1')).toBe(true);
      expect(isPrivateOrBlockedIP('::')).toBe(true);
      expect(isPrivateOrBlockedIP('fe80::1')).toBe(true);
      expect(isPrivateOrBlockedIP('fc00::1')).toBe(true);
      expect(isPrivateOrBlockedIP('fd12:3456:789a::1')).toBe(true);
      expect(isPrivateOrBlockedIP('::ffff:127.0.0.1')).toBe(true);
    });

    it('should allow legitimate public IP addresses', () => {
      expect(isPrivateOrBlockedIP('8.8.8.8')).toBe(false);
      expect(isPrivateOrBlockedIP('1.1.1.1')).toBe(false);
      expect(isPrivateOrBlockedIP('93.184.216.34')).toBe(false);
      expect(isPrivateOrBlockedIP('2606:4700:4700::1111')).toBe(false);
    });
  });

  describe('validateSafeUrl', () => {
    it('should reject non-HTTP/HTTPS protocols', async () => {
      const fileResult = await validateSafeUrl('file:///etc/passwd');
      expect(fileResult.safe).toBe(false);
      expect(fileResult.error).toContain('Only HTTP and HTTPS protocols are permitted');

      const ftpResult = await validateSafeUrl('ftp://example.com/file.txt');
      expect(ftpResult.safe).toBe(false);
    });

    it('should reject non-standard ports to prevent port scanning', async () => {
      const portResult = await validateSafeUrl('http://example.com:8080/terms');
      expect(portResult.safe).toBe(false);
      expect(portResult.error).toContain('Non-standard port');

      const sshResult = await validateSafeUrl('https://example.com:22/secret');
      expect(sshResult.safe).toBe(false);
    });

    it('should block direct IP access to private/cloud metadata ranges', async () => {
      const metaResult = await validateSafeUrl('http://169.254.169.254/latest/meta-data');
      expect(metaResult.safe).toBe(false);
      expect(metaResult.error).toContain('private, loopback, or cloud infrastructure');

      const localResult = await validateSafeUrl('http://127.0.0.1/admin');
      expect(localResult.safe).toBe(false);
    });

    it('should accept standard public web URLs', async () => {
      const result = await validateSafeUrl('https://example.com/terms-of-service');
      expect(result.safe).toBe(true);
      expect(result.parsedUrl?.hostname).toBe('example.com');
    });
  });
});
