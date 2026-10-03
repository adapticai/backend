/**
 * Service-to-service principal minted from a dedicated HS256 secret.
 *
 * WHY THIS EXISTS AS A THIRD PATH RATHER THAN REUSING EITHER EXISTING ONE.
 * `verifyBackendToken` already knows two ways to arrive at a non-user caller,
 * and both are wrong for a long-lived internal service:
 *
 *   - `SERVER_AUTH_TOKEN` is an exact string match against a static value. It
 *     never expires, carries no audience, names no caller, and cannot be
 *     rotated without a simultaneous restart of every holder. A copy taken
 *     from a log or a process listing is a permanent credential.
 *   - An app-issued JWT verifies against `jwtSecret` — the SAME secret that
 *     signs end-user sessions. A service credential keyed on it would make
 *     every holder of a user secret able to mint a service identity and vice
 *     versa, and it yields `kind: "user"`, which is then subject to
 *     per-user tenancy scoping that a service must not be subject to.
 *
 * So the service path is keyed on `BACKEND_SERVICE_JWT_SECRET`, a secret whose
 * ONLY purpose is service identity. It is deliberately distinct from
 * `JWT_SECRET` so that the blast radius of either one leaking stops at that
 * one trust domain, and the verifier refuses to run if the two are ever set to
 * the same value — a configuration that would silently collapse the
 * separation this module exists to create.
 *
 * ABSENCE DISABLES THE PATH; IT NEVER WIDENS IT. With no secret provisioned
 * `verifyServiceToken` returns `null` and the caller falls through to the
 * existing paths, which reject. A service that cannot prove itself is refused,
 * never admitted.
 *
 * @module auth/service-token
 */

import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { jwtSecret } from '../config/jwtConfig';
import { logger } from '../utils/logger';

import { AuthError, type BackendPrincipal } from './token-verifier';

/**
 * Issuer every service credential must carry.
 *
 * Pinned rather than free-form so a token minted for some other HS256 system
 * that happens to share the secret cannot be replayed here.
 */
export const SERVICE_TOKEN_ISSUER = 'adaptic-service';

/**
 * Audience every service credential must carry.
 *
 * This backend is the only intended recipient. Binding the audience is what
 * stops a credential minted for a sibling service from being replayed against
 * the data tier.
 */
export const SERVICE_TOKEN_AUDIENCE = 'adaptic-backend';

/** Minimum length for the dedicated service secret, in characters. */
export const MINIMUM_SERVICE_SECRET_LENGTH = 32;

/**
 * Largest lifetime this backend will honour on a service credential, seconds.
 *
 * A credential's own `exp` bounds the replay window on a leak, so a minter is
 * free to choose a shorter one — but it may not choose a longer one and
 * thereby re-create the non-expiring static bearer this path replaces. One
 * hour is comfortably above the 15-minute lifetime the engine mints and far
 * below "effectively permanent".
 */
export const MAX_SERVICE_TOKEN_LIFETIME_SEC = 3600;

/**
 * How far in the future, seconds, a credential's `iat` may sit before it is
 * refused.
 *
 * The lifetime ceiling is measured from `iat`, so an `iat` the verifier does
 * not bound would let a secret holder date a token years ahead and hold a
 * credential valid until then. One minute absorbs ordinary clock drift between
 * a minter and this host and nothing more.
 */
export const MAX_SERVICE_TOKEN_CLOCK_SKEW_SEC = 60;

/**
 * Which configured secret proved a credential's signature.
 *
 * `primary` is `BACKEND_SERVICE_JWT_SECRET`; `previous` is the optional
 * `BACKEND_SERVICE_JWT_SECRET_PREVIOUS` that exists only for the length of a
 * rotation.
 */
export type ServiceKeySlot = 'primary' | 'previous';

/**
 * Validate one raw secret value, or `null` when it cannot serve as one.
 *
 * @param name - Env var name, for the operator-facing log line.
 * @param raw - The raw env value.
 * @returns The trimmed secret, or `null` when unset, blank, or too short.
 */
function readSecret(name: string, raw: string | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const secret = raw.trim();
  if (secret.length === 0) return null;
  if (secret.length < MINIMUM_SERVICE_SECRET_LENGTH) {
    logger.error(
      `[auth] ${name} is set but shorter than the minimum ` +
        `${MINIMUM_SERVICE_SECRET_LENGTH} characters; it will not be used to verify service tokens.`,
      { secretLength: secret.length }
    );
    return null;
  }
  return secret;
}

/**
 * Resolve the service secrets to try, in order, or `null` when the path is not
 * provisioned.
 *
 * Read per call rather than cached at import so an operator rotating the
 * Railway variable takes effect on the next request rather than the next
 * restart — the same discipline `SERVER_AUTH_TOKEN` already follows.
 *
 * WHY A SECOND SLOT. With one secret, rotation means every minter and this
 * verifier must change at the same instant or service calls fail in between.
 * `BACKEND_SERVICE_JWT_SECRET_PREVIOUS` lets the verifier accept the outgoing
 * key while minters move to the new one, so the swap is: set PREVIOUS to the
 * current value and the primary to the new one, move the minters, watch the
 * `previous` log line drain to zero, then unset PREVIOUS.
 *
 * The previous slot never stands alone: with no valid primary the whole path
 * stays disabled, so an operator cannot half-finish a rotation into a state
 * where only the retiring key is honoured.
 *
 * @returns The slots to try, primary first, or `null` when unprovisioned.
 */
function resolveServiceSecrets(): Array<{ slot: ServiceKeySlot; secret: string }> | null {
  const primary = readSecret(
    'BACKEND_SERVICE_JWT_SECRET',
    process.env.BACKEND_SERVICE_JWT_SECRET
  );
  if (primary === null) {
    if (process.env.BACKEND_SERVICE_JWT_SECRET_PREVIOUS?.trim()) {
      logger.error(
        '[auth] BACKEND_SERVICE_JWT_SECRET_PREVIOUS is set without a valid ' +
          'BACKEND_SERVICE_JWT_SECRET; the service-principal path is DISABLED. ' +
          'The previous slot only extends a provisioned primary, it never replaces one.'
      );
    } else if (process.env.BACKEND_SERVICE_JWT_SECRET?.trim()) {
      logger.error(
        '[auth] the service-principal path is DISABLED. ' +
          'Service callers will be rejected until a long enough secret is provisioned.'
      );
    }
    return null;
  }

  const slots: Array<{ slot: ServiceKeySlot; secret: string }> = [
    { slot: 'primary', secret: primary },
  ];
  const previous = readSecret(
    'BACKEND_SERVICE_JWT_SECRET_PREVIOUS',
    process.env.BACKEND_SERVICE_JWT_SECRET_PREVIOUS
  );
  // Equal to the primary adds nothing; skip it so the log never claims a
  // `previous` verification that was really the primary.
  if (previous !== null && previous !== primary) {
    slots.push({ slot: 'previous', secret: previous });
  }
  return slots;
}

/**
 * Verify a token's signature and bound claims against one secret.
 *
 * @returns The payload, or `null` when the signature is not this secret's.
 * @throws {AuthError} When the signature matched but the token is unacceptable.
 */
function verifyAgainst(token: string, secret: string): jwt.JwtPayload | null {
  try {
    // Algorithm pinned to HS256 for the same reason path 2 pins it: an
    // unpinned verify accepts `alg: "none"` on some versions, which turns a
    // forged unsigned token into an authenticated service principal.
    const verified = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: SERVICE_TOKEN_ISSUER,
      audience: SERVICE_TOKEN_AUDIENCE,
    });
    if (typeof verified === 'string') {
      throw new AuthError('invalid_token', 'malformed');
    }
    return verified;
  } catch (error: unknown) {
    if (error instanceof AuthError) throw error;

    // A valid signature with an expired `exp` is unambiguously our token:
    // `jsonwebtoken` checks the signature before the claims, so reaching
    // TokenExpiredError proves the secret matched. Report the real reason.
    if (error instanceof TokenExpiredError) {
      throw new AuthError('invalid_token', 'expired');
    }

    if (error instanceof JsonWebTokenError) {
      const message = (error.message || '').toLowerCase();
      // Signature mismatch means this is simply not this secret's credential —
      // the caller tries the next slot, then falls through to the app-JWT and
      // Google paths.
      if (
        message.includes('invalid signature') ||
        message.includes('invalid algorithm')
      ) {
        return null;
      }
      // Signature matched but a bound claim did not. That IS a service token
      // aimed at the wrong recipient; reject it rather than fall through.
      if (message.includes('audience') || message.includes('issuer')) {
        logger.warn('[auth] service token rejected: claim binding mismatch', {
          errorMessage: error.message,
        });
        throw new AuthError('invalid_token', 'bad_audience');
      }
      return null;
    }
    return null;
  }
}

/**
 * Attempt to establish a service principal from a bearer token.
 *
 * Returns `null` — meaning "not a service credential, keep looking" — only
 * when the path is unprovisioned or the signature does not belong to the
 * service secret. Once a token IS proven to carry that signature, every
 * subsequent problem with it (expiry, wrong audience, missing subject,
 * over-long lifetime) throws, because at that point the caller's intent is
 * unambiguous and falling through would report a misleading `bad_signature`
 * for what is actually an expired or mis-scoped service token.
 *
 * @param token - Raw bearer token; assumed to be three dot-separated segments.
 * @returns The verified service principal, or `null` to fall through.
 * @throws {AuthError} When the token is ours but unacceptable.
 */
export function verifyServiceToken(
  token: string,
  nowMs: number = Date.now()
): BackendPrincipal | null {
  const slots = resolveServiceSecrets();
  if (slots === null) return null;

  // A service secret set equal to the user-session secret would let any
  // end-user JWT that carries our issuer/audience become a `server` principal,
  // which bypasses every tenancy scope and role gate. Refuse rather than
  // silently operate with the separation collapsed. This holds for the
  // previous slot too: a rotation must not reopen the hole.
  if (slots.some(({ secret }) => secret === jwtSecret)) {
    logger.error(
      '[auth] BACKEND_SERVICE_JWT_SECRET (or its _PREVIOUS slot) is identical to JWT_SECRET. ' +
        'These MUST be distinct secrets — sharing them collapses the ' +
        'separation between end-user and service identity. Refusing to ' +
        'verify service tokens until they differ.'
    );
    throw new AuthError('invalid_token', 'misconfigured');
  }

  let payload: jwt.JwtPayload | null = null;
  let keySlot: ServiceKeySlot = 'primary';
  for (const { slot, secret } of slots) {
    payload = verifyAgainst(token, secret);
    if (payload !== null) {
      keySlot = slot;
      break;
    }
  }
  if (payload === null) return null;

  const sub = typeof payload.sub === 'string' ? payload.sub.trim() : '';
  if (sub.length === 0) {
    // An unattributable service credential defeats the audit trail this path
    // is supposed to provide over the static token it replaces.
    logger.warn('[auth] service token rejected: missing sub claim');
    throw new AuthError('invalid_token', 'malformed');
  }

  const iat = payload.iat;
  const exp = payload.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) {
    // Without an expiry this is a permanent bearer — exactly the property the
    // service path exists to avoid.
    logger.warn('[auth] service token rejected: missing exp claim', { sub });
    throw new AuthError('invalid_token', 'malformed');
  }
  if (typeof iat !== 'number' || !Number.isFinite(iat)) {
    // The lifetime ceiling is `exp - iat`. Without an `iat` there is nothing to
    // measure it from, and a far-future `exp` would pass as a long-lived
    // bearer — so an undated credential is refused, not waved through.
    logger.warn('[auth] service token rejected: missing iat claim', { sub });
    throw new AuthError('invalid_token', 'malformed');
  }
  const nowSec = Math.floor(nowMs / 1000);
  if (iat > nowSec + MAX_SERVICE_TOKEN_CLOCK_SKEW_SEC) {
    // A forward-dated `iat` moves the ceiling's window into the future with it:
    // `exp - iat` stays small while `exp - now` is unbounded.
    logger.warn('[auth] service token rejected: iat is in the future', {
      sub,
      aheadSec: iat - nowSec,
      skewSec: MAX_SERVICE_TOKEN_CLOCK_SKEW_SEC,
    });
    throw new AuthError('invalid_token', 'malformed');
  }
  if (exp - iat > MAX_SERVICE_TOKEN_LIFETIME_SEC) {
    logger.warn('[auth] service token rejected: lifetime exceeds ceiling', {
      sub,
      lifetimeSec: exp - iat,
      ceilingSec: MAX_SERVICE_TOKEN_LIFETIME_SEC,
    });
    throw new AuthError('invalid_token', 'bad_audience');
  }

  // Which key verified is the rotation's progress signal: once `previous`
  // stops appearing, every minter is on the new key and the slot can go.
  // `previous` logs at info so it shows under any production LOG_LEVEL short
  // of warn; `primary` is the steady state and stays at debug.
  const keyLog = keySlot === 'previous' ? logger.info : logger.debug;
  keyLog('[auth] service token verified', { sub, keySlot });

  return { kind: 'server', sub };
}
