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
 * Resolve the dedicated service secret, or `null` when the path is not
 * provisioned.
 *
 * Read per call rather than cached at import so an operator rotating the
 * Railway variable takes effect on the next request rather than the next
 * restart — the same discipline `SERVER_AUTH_TOKEN` already follows.
 *
 * @returns The secret, or `null` when unset, blank, or too short to be one.
 */
function resolveServiceSecret(): string | null {
  const raw = process.env.BACKEND_SERVICE_JWT_SECRET;
  if (typeof raw !== 'string') return null;
  const secret = raw.trim();
  if (secret.length === 0) return null;
  if (secret.length < MINIMUM_SERVICE_SECRET_LENGTH) {
    logger.error(
      '[auth] BACKEND_SERVICE_JWT_SECRET is set but shorter than the minimum ' +
        `${MINIMUM_SERVICE_SECRET_LENGTH} characters; the service-principal path is DISABLED. ` +
        'Service callers will be rejected until a long enough secret is provisioned.',
      { secretLength: secret.length }
    );
    return null;
  }
  return secret;
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
export function verifyServiceToken(token: string): BackendPrincipal | null {
  const secret = resolveServiceSecret();
  if (secret === null) return null;

  // A service secret set equal to the user-session secret would let any
  // end-user JWT that carries our issuer/audience become a `server` principal,
  // which bypasses every tenancy scope and role gate. Refuse rather than
  // silently operate with the separation collapsed.
  if (secret === jwtSecret) {
    logger.error(
      '[auth] BACKEND_SERVICE_JWT_SECRET is identical to JWT_SECRET. ' +
        'These MUST be distinct secrets — sharing them collapses the ' +
        'separation between end-user and service identity. Refusing to ' +
        'verify service tokens until they differ.'
    );
    throw new AuthError('invalid_token', 'misconfigured');
  }

  let payload: jwt.JwtPayload;
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
    payload = verified;
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
      // Signature mismatch means this is simply not a service credential —
      // fall through so the app-JWT and Google paths get their turn.
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
  if (
    typeof iat === 'number' &&
    Number.isFinite(iat) &&
    exp - iat > MAX_SERVICE_TOKEN_LIFETIME_SEC
  ) {
    logger.warn('[auth] service token rejected: lifetime exceeds ceiling', {
      sub,
      lifetimeSec: exp - iat,
      ceilingSec: MAX_SERVICE_TOKEN_LIFETIME_SEC,
    });
    throw new AuthError('invalid_token', 'bad_audience');
  }

  return { kind: 'server' };
}
