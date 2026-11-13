import { randomBytes } from 'node:crypto';
import { describe, it, expect } from 'vitest';

import {
  base32Encode,
  decryptTotpSecret,
  encryptTotpSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  hotp,
  otpauthUri,
  readTotpEncryptionKey,
  totpCode,
  totpStep,
  TotpKeyError,
  TOTP_ENCRYPTION_KEY_ENV,
  verifyTotp,
} from '../totp';

/** The RFC 6238 appendix B SHA-1 seed: the ASCII string "12345678901234567890". */
const RFC_SECRET = Buffer.from('12345678901234567890', 'ascii');
const MS = 1000;
const STEP_MS = 30 * MS;
const EIGHT_DIGITS = 8;

describe('RFC 6238 appendix B test vectors (SHA-1, 8 digits)', () => {
  it.each([
    [59, '94287082'],
    [1111111109, '07081804'],
    [1111111111, '14050471'],
    [1234567890, '89005924'],
    [2000000000, '69279037'],
    [20000000000, '65353130'],
  ])('T = %i s gives %s', (seconds, expected) => {
    expect(totpCode(RFC_SECRET, seconds * MS, EIGHT_DIGITS)).toBe(expected);
  });

  it('RFC 4226 appendix D HOTP vectors (6 digits)', () => {
    const expected = [
      '755224',
      '287082',
      '359152',
      '969429',
      '338314',
      '254676',
      '287922',
      '162583',
      '399871',
      '520489',
    ];
    expect(expected.map((_, counter) => hotp(RFC_SECRET, counter))).toEqual(
      expected
    );
  });
});

describe('verifyTotp', () => {
  const now = 1_700_000_000_000;
  const step = totpStep(now);

  it('accepts the current step and one step either side, returning the matched step', () => {
    expect(verifyTotp(RFC_SECRET, hotp(RFC_SECRET, step), now, null)).toBe(
      step
    );
    expect(verifyTotp(RFC_SECRET, hotp(RFC_SECRET, step - 1), now, null)).toBe(
      step - 1
    );
    expect(verifyTotp(RFC_SECRET, hotp(RFC_SECRET, step + 1), now, null)).toBe(
      step + 1
    );
  });

  it('rejects a code two steps away', () => {
    expect(
      verifyTotp(RFC_SECRET, hotp(RFC_SECRET, step - 2), now, null)
    ).toBeNull();
    expect(
      verifyTotp(RFC_SECRET, hotp(RFC_SECRET, step + 2), now, null)
    ).toBeNull();
  });

  it('rejects a wrong code', () => {
    const right = hotp(RFC_SECRET, step);
    const wrong = String((Number(right) + 1) % 1_000_000).padStart(6, '0');
    expect(verifyTotp(RFC_SECRET, wrong, now, null)).toBeNull();
    expect(verifyTotp(randomBytes(20), right, now, null)).toBeNull();
  });

  it('rejects a replay: the last accepted step and every earlier one', () => {
    const code = hotp(RFC_SECRET, step);
    expect(verifyTotp(RFC_SECRET, code, now, step)).toBeNull();
    expect(verifyTotp(RFC_SECRET, code, now, step - 1)).toBe(step);
    expect(
      verifyTotp(
        RFC_SECRET,
        hotp(RFC_SECRET, step - 1),
        now + STEP_MS,
        step - 1
      )
    ).toBeNull();
  });

  it('rejects anything that is not six digits', () => {
    expect(verifyTotp(RFC_SECRET, '12345', now, null)).toBeNull();
    expect(verifyTotp(RFC_SECRET, 'abcdef', now, null)).toBeNull();
    expect(verifyTotp(RFC_SECRET, '', now, null)).toBeNull();
  });
});

describe('secret encryption at rest', () => {
  const key = randomBytes(32);

  it('round-trips, with a fresh nonce each time', () => {
    const secret = randomBytes(20);
    const a = encryptTotpSecret(secret, key);
    const b = encryptTotpSecret(secret, key);
    expect(a).not.toBe(b);
    expect(a).not.toContain(base32Encode(secret));
    expect(decryptTotpSecret(a, key).equals(secret)).toBe(true);
  });

  it('fails under the wrong key or a tampered ciphertext', () => {
    const stored = encryptTotpSecret(randomBytes(20), key);
    expect(() => decryptTotpSecret(stored, randomBytes(32))).toThrow();
    const [version, iv, tag, body] = stored.split('.');
    const flipped = Buffer.from(body, 'base64');
    flipped[0] ^= 1;
    expect(() =>
      decryptTotpSecret(
        [version, iv, tag, flipped.toString('base64')].join('.'),
        key
      )
    ).toThrow();
  });

  it('reads the key from TOTP_ENCRYPTION_KEY and refuses a missing or malformed one', () => {
    const encoded = key.toString('base64');
    expect(
      readTotpEncryptionKey({ [TOTP_ENCRYPTION_KEY_ENV]: encoded }).equals(key)
    ).toBe(true);
    expect(() => readTotpEncryptionKey({})).toThrow(TotpKeyError);
    expect(() =>
      readTotpEncryptionKey({ [TOTP_ENCRYPTION_KEY_ENV]: '   ' })
    ).toThrow(TotpKeyError);
    expect(() =>
      readTotpEncryptionKey({
        [TOTP_ENCRYPTION_KEY_ENV]: randomBytes(16).toString('base64'),
      })
    ).toThrow(TotpKeyError);
    expect(() =>
      readTotpEncryptionKey({ [TOTP_ENCRYPTION_KEY_ENV]: 'not base64 at all!' })
    ).toThrow(TotpKeyError);
  });
});

describe('recovery codes and the otpauth URI', () => {
  it('issues ten distinct 80-bit codes whose hashes ignore case and separators', () => {
    const codes = generateRecoveryCodes();
    expect(codes).toHaveLength(10);
    expect(new Set(codes).size).toBe(10);
    for (const code of codes)
      expect(code).toMatch(/^[A-Z2-7]{4}(-[A-Z2-7]{4}){3}$/);
    const [first] = codes;
    expect(hashRecoveryCode(first.toLowerCase().replace(/-/g, ' '))).toBe(
      hashRecoveryCode(first)
    );
    expect(hashRecoveryCode(first)).not.toContain(first.replace(/-/g, ''));
  });

  it('encodes RFC 4648 base32 and writes every parameter into the URI', () => {
    expect(base32Encode(Buffer.from('foobar'))).toBe('MZXW6YTBOI');
    const uri = new URL(otpauthUri(RFC_SECRET, 'a@b.test', 'Adaptic'));
    expect(uri.protocol).toBe('otpauth:');
    expect(uri.host).toBe('totp');
    expect(decodeURIComponent(uri.pathname)).toBe('/Adaptic:a@b.test');
    expect(Object.fromEntries(uri.searchParams)).toEqual({
      secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',
      issuer: 'Adaptic',
      algorithm: 'SHA1',
      digits: '6',
      period: '30',
    });
  });
});
