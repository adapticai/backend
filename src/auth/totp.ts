/**
 * TOTP second factor: RFC 6238 codes, secret encryption at rest, and
 * recovery codes. Pure functions over explicit inputs (time, key, bytes); the
 * resolver in `src/resolvers/custom/UserTotpResolver.ts` supplies them and
 * owns every database effect.
 *
 * - Codes are RFC 6238 with the RFC 4226 dynamic truncation: HMAC-SHA1, a
 *   30-second step, six digits — the parameters every authenticator app
 *   defaults to, written into the otpauth URI so none is left implicit.
 * - Verification accepts the current step and one step either side (clock
 *   skew between the device and the server), compares in constant time, and
 *   returns the matched step so the caller can refuse a replay of it.
 * - The shared secret is stored encrypted with AES-256-GCM under
 *   `TOTP_ENCRYPTION_KEY` (32 bytes, base64). A missing or malformed key is an
 *   error, never a fallback: a TOTP secret stored in the clear, or under a
 *   default key, is not a second factor.
 * - Recovery codes are 80 random bits each, shown once, and stored as SHA-256
 *   hashes. Their entropy is what makes an unsalted fast hash adequate: there
 *   is no dictionary to run against them.
 *
 * @module auth/totp
 */

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

/** Environment variable holding the 32-byte AES-256-GCM key, base64-encoded. */
export const TOTP_ENCRYPTION_KEY_ENV = 'TOTP_ENCRYPTION_KEY';

/** RFC 6238 time step, in seconds. */
export const TOTP_STEP_SECONDS = 30;

/** Digits in a code. */
export const TOTP_DIGITS = 6;

/** Steps accepted either side of the current one. */
export const TOTP_WINDOW_STEPS = 1;

/** Bytes of shared secret: 160 bits, the HMAC-SHA1 block-size recommendation of RFC 4226 §4. */
export const TOTP_SECRET_BYTES = 20;

/** Recovery codes issued per enrolment. */
export const RECOVERY_CODE_COUNT = 10;

/** Bytes of randomness per recovery code (80 bits → 16 base32 characters). */
const RECOVERY_CODE_BYTES = 10;

/** AES-256 key length in bytes. */
const AES_KEY_BYTES = 32;

/** GCM nonce length in bytes (the NIST SP 800-38D recommendation). */
const GCM_IV_BYTES = 12;

/** Version tag on the stored ciphertext, so a future key rotation can tell formats apart. */
const CIPHERTEXT_VERSION = 'v1';

const MS_PER_SECOND = 1000;
const DECIMAL_BASE = 10;
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BITS_PER_BASE32_CHAR = 5;
const BITS_PER_BYTE = 8;
const BASE32_MASK = 0x1f;
const BYTE_MASK = 0xff;
const TRUNCATION_OFFSET_MASK = 0x0f;
const TRUNCATION_SIGN_MASK = 0x7f;
const COUNTER_BYTES = 8;
const RECOVERY_GROUP = 4;

/** Raised when the encryption key is absent or malformed. */
export class TotpKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TotpKeyError';
  }
}

/**
 * Read and validate the encryption key.
 *
 * @param env - Environment source; injectable for tests.
 * @returns The 32-byte key.
 * @throws TotpKeyError when the variable is unset or does not decode to 32 bytes.
 */
export function readTotpEncryptionKey(
  env: Record<string, string | undefined> = process.env
): Buffer {
  const raw = (env[TOTP_ENCRYPTION_KEY_ENV] ?? '').trim();
  if (raw.length === 0) {
    throw new TotpKeyError(
      `${TOTP_ENCRYPTION_KEY_ENV} is not set; TOTP secrets cannot be encrypted or read`
    );
  }
  const key = Buffer.from(raw, 'base64');
  if (key.length !== AES_KEY_BYTES || key.toString('base64') !== raw) {
    throw new TotpKeyError(
      `${TOTP_ENCRYPTION_KEY_ENV} must be ${AES_KEY_BYTES} bytes, base64-encoded`
    );
  }
  return key;
}

/** RFC 4648 base32 without padding (the form otpauth URIs carry). */
export function base32Encode(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const byte of bytes) {
    value = (value << BITS_PER_BYTE) | byte;
    bits += BITS_PER_BYTE;
    while (bits >= BITS_PER_BASE32_CHAR) {
      out +=
        BASE32_ALPHABET[
          (value >>> (bits - BITS_PER_BASE32_CHAR)) & BASE32_MASK
        ];
      bits -= BITS_PER_BASE32_CHAR;
    }
  }
  if (bits > 0)
    out +=
      BASE32_ALPHABET[(value << (BITS_PER_BASE32_CHAR - bits)) & BASE32_MASK];
  return out;
}

/** The RFC 6238 time step containing `nowMs`. */
export function totpStep(nowMs: number): number {
  return Math.floor(nowMs / MS_PER_SECOND / TOTP_STEP_SECONDS);
}

/**
 * The RFC 4226 HOTP value for one counter, as a zero-padded decimal string.
 *
 * @param secret - The shared secret bytes.
 * @param counter - The moving factor (for TOTP, the time step).
 * @param digits - Code length.
 */
export function hotp(
  secret: Buffer,
  counter: number,
  digits: number = TOTP_DIGITS
): string {
  const message = Buffer.alloc(COUNTER_BYTES);
  message.writeBigUInt64BE(BigInt(counter));
  const mac = createHmac('sha1', secret).update(message).digest();
  const offset = mac[mac.length - 1] & TRUNCATION_OFFSET_MASK;
  const binary =
    ((mac[offset] & TRUNCATION_SIGN_MASK) << 24) |
    ((mac[offset + 1] & BYTE_MASK) << 16) |
    ((mac[offset + 2] & BYTE_MASK) << 8) |
    (mac[offset + 3] & BYTE_MASK);
  return String(binary % DECIMAL_BASE ** digits).padStart(digits, '0');
}

/** The TOTP code for the step containing `nowMs`. */
export function totpCode(
  secret: Buffer,
  nowMs: number,
  digits: number = TOTP_DIGITS
): string {
  return hotp(secret, totpStep(nowMs), digits);
}

function constantTimeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Check a submitted code against the steps around `nowMs`.
 *
 * Every candidate step is compared, whatever matched first, so the time taken
 * does not reveal which step (if any) the code belongs to.
 *
 * @param secret - The shared secret bytes.
 * @param code - The submitted code (whitespace ignored).
 * @param nowMs - The current time.
 * @param lastUsedStep - The step of the last accepted code; that step and
 *   every earlier one are refused, so an observed code cannot be replayed.
 * @returns The matched step, or `null` when the code is not valid now.
 */
export function verifyTotp(
  secret: Buffer,
  code: string,
  nowMs: number,
  lastUsedStep: number | null
): number | null {
  const submitted = code.replace(/\s+/g, '');
  if (!/^\d+$/.test(submitted) || submitted.length !== TOTP_DIGITS) return null;
  const current = totpStep(nowMs);
  let matched: number | null = null;
  for (let delta = -TOTP_WINDOW_STEPS; delta <= TOTP_WINDOW_STEPS; delta++) {
    const step = current + delta;
    if (constantTimeEqual(hotp(secret, step), submitted) && matched === null)
      matched = step;
  }
  if (matched === null) return null;
  if (lastUsedStep !== null && matched <= lastUsedStep) return null;
  return matched;
}

/** Fresh random shared-secret bytes. */
export function generateTotpSecret(
  random: (size: number) => Buffer = randomBytes
): Buffer {
  return random(TOTP_SECRET_BYTES);
}

/**
 * The `otpauth://` URI an authenticator app scans. Every parameter is
 * explicit, so no app falls back to a default that differs from the server's.
 *
 * @param secret - The shared secret bytes.
 * @param accountName - The label shown in the app (the user's email).
 * @param issuer - The issuer shown in the app.
 */
export function otpauthUri(
  secret: Buffer,
  accountName: string,
  issuer: string
): string {
  const label = encodeURIComponent(`${issuer}:${accountName}`);
  const params = new URLSearchParams({
    secret: base32Encode(secret),
    issuer,
    algorithm: 'SHA1',
    digits: String(TOTP_DIGITS),
    period: String(TOTP_STEP_SECONDS),
  });
  return `otpauth://totp/${label}?${params.toString()}`;
}

/**
 * Encrypt a secret for storage: `v1.<iv>.<tag>.<ciphertext>`, each base64.
 *
 * @param secret - The shared secret bytes.
 * @param key - The 32-byte key from {@link readTotpEncryptionKey}.
 * @param random - Randomness source for the nonce; injectable for tests.
 */
export function encryptTotpSecret(
  secret: Buffer,
  key: Buffer,
  random: (size: number) => Buffer = randomBytes
): string {
  const iv = random(GCM_IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(secret), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    CIPHERTEXT_VERSION,
    iv.toString('base64'),
    tag.toString('base64'),
    ciphertext.toString('base64'),
  ].join('.');
}

/**
 * Decrypt a stored secret.
 *
 * @throws Error when the format is unknown or the authentication tag fails
 *   (a wrong key, or a tampered row).
 */
export function decryptTotpSecret(stored: string, key: Buffer): Buffer {
  const parts = stored.split('.');
  if (parts.length !== 4 || parts[0] !== CIPHERTEXT_VERSION) {
    throw new Error('stored TOTP secret has an unrecognised format');
  }
  const [, iv, tag, ciphertext] = parts;
  const decipher = createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64')),
    decipher.final(),
  ]);
}

/** Normalise a recovery code as typed: uppercase, separators and spaces removed. */
export function normalizeRecoveryCode(code: string): string {
  return code.replace(/[\s-]+/g, '').toUpperCase();
}

/** The stored hash of a recovery code (hex SHA-256 of its normalised form). */
export function hashRecoveryCode(code: string): string {
  return createHash('sha256').update(normalizeRecoveryCode(code)).digest('hex');
}

/**
 * Fresh recovery codes, formatted `XXXX-XXXX-XXXX-XXXX` for reading aloud.
 *
 * @param random - Randomness source; injectable for tests.
 */
export function generateRecoveryCodes(
  random: (size: number) => Buffer = randomBytes
): string[] {
  const codes: string[] = [];
  for (let i = 0; i < RECOVERY_CODE_COUNT; i++) {
    const raw = base32Encode(random(RECOVERY_CODE_BYTES));
    const groups: string[] = [];
    for (let at = 0; at < raw.length; at += RECOVERY_GROUP)
      groups.push(raw.slice(at, at + RECOVERY_GROUP));
    codes.push(groups.join('-'));
  }
  return codes;
}
