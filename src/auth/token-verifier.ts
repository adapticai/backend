/**
 * Verified identity for backend tokens.
 *
 * `verifyBackendToken` is the SOLE entry point for establishing principal
 * identity from a bearer token presented at the GraphQL HTTP, GraphQL WebSocket,
 * or Express middleware layer of `@adaptic/backend`.
 *
 * It rejects, in priority order:
 *
 *   1. **Server-to-server static token.** `process.env.SERVER_AUTH_TOKEN`
 *      exact match -> `{ kind: "server" }`. Configured via the environment;
 *      never read at request time without a non-empty env value.
 *   2. **App-issued JWT.** `jwt.verify(token, jwtSecret)` against the shared
 *      backend `jwtSecret`. Returns `{ kind: "user", sub, roles }` or
 *      `{ kind: "admin", … }` when the JWT carries an admin role.
 *   3. **Google ID token.** `OAuth2Client.verifyIdToken({ idToken, audience })`
 *      against the configured Google client IDs. Note that an *access* token
 *      (`ya29.…`) is NOT an ID token and cannot be verified offline — those
 *      are rejected explicitly with reason `opaque_access_token_rejected`.
 *
 * On every failure path, throws an `AuthError` whose `reason` is a finite
 * discriminated string. Callers map `AuthError` to HTTP 401 / GraphQL
 * `UNAUTHENTICATED` extension code at the transport layer.
 *
 * No path silently downgrades to an unverified principal. No path returns
 * `null`. No path logs the token value — only a length and an 8-char prefix
 * masked with an ellipsis.
 *
 * @see backend-legacy/src/auth/__tests__/token-verifier.test.ts for full
 *      coverage of every reason branch.
 */

import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { OAuth2Client, type LoginTicket } from 'google-auth-library';
import { jwtSecret } from '../config/jwtConfig';
import { logger } from '../utils/logger';
import { verifyServiceToken } from './service-token';

// -----------------------------------------------------------------------------
// Public types
// -----------------------------------------------------------------------------

/**
 * Finite, discriminated set of reasons `verifyBackendToken` can fail.
 *
 * The set is closed by design: every new failure mode added to the verifier
 * must be classified into one of these reasons (or a new reason added here
 * with explicit consumer-side handling).
 */
export type AuthErrorReason =
  | 'malformed'
  | 'expired'
  | 'bad_audience'
  | 'bad_signature'
  | 'opaque_access_token_rejected'
  | 'misconfigured';

/**
 * Backend principal — the verified caller identity attached to a request.
 *
 * - `server`: trusted server-to-server caller (Next.js route handler, internal
 *   service). Authenticated by the static `SERVER_AUTH_TOKEN`.
 * - `user`: end-user authenticated via app-issued JWT or Google ID token.
 * - `admin`: same as `user` but with an `admin` role explicitly listed.
 *
 * The discriminator is `kind`. Callers `switch` on `kind` and the TypeScript
 * compiler enforces exhaustive handling.
 */
export type BackendPrincipal =
  | { kind: 'server' }
  | { kind: 'user'; sub: string; email?: string; roles: string[] }
  | { kind: 'admin'; sub: string; email?: string; roles: string[] };

/**
 * Typed authentication error. The `reason` discriminates the failure case;
 * callers may map `reason` to a transport-specific error code (HTTP 401,
 * GraphQL `UNAUTHENTICATED`) and a structured log entry.
 *
 * Never include token contents in messages. The `reason` is sufficient.
 */
export class AuthError extends Error {
  public readonly code: 'invalid_token';
  public readonly reason: AuthErrorReason;

  constructor(code: 'invalid_token', reason: AuthErrorReason, message?: string) {
    super(message ?? `${code}: ${reason}`);
    this.name = 'AuthError';
    this.code = code;
    this.reason = reason;
    // Restore prototype chain for `instanceof` after transpilation to ES5/CJS.
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// -----------------------------------------------------------------------------
// Configuration: Google audience allowlist
// -----------------------------------------------------------------------------

/**
 * Sentinel for the lazy-cached Google audience list. We resolve at first call
 * rather than at module load so tests can set `process.env.GOOGLE_OAUTH_CLIENT_IDS`
 * before importing this module without import-order dance.
 */
let cachedAudienceList: string[] | undefined;
let cachedAudienceListResolved = false;

/**
 * Resolve the comma-separated list of accepted Google OAuth client IDs from
 * `GOOGLE_OAUTH_CLIENT_IDS`.
 *
 * - In production (`NODE_ENV=production`): if the env is missing or empty,
 *   throw `AuthError("invalid_token", "misconfigured")` at the FIRST call.
 *   This serialises the failure into the request response rather than crashing
 *   the process; the boot-time invariant check at `assertGoogleAudienceConfiguredForProd`
 *   handles fail-fast-at-startup.
 * - In dev/test: log a single warning and return `[]`. With an empty audience
 *   list, the Google ID-token verification branch will always fail — acceptable
 *   in non-prod because trusted paths use `SERVER_AUTH_TOKEN` or app JWTs.
 *
 * @internal exported for testing
 */
export function googleAudienceList(): string[] {
  if (cachedAudienceListResolved) {
    return cachedAudienceList ?? [];
  }

  const raw = (process.env.GOOGLE_OAUTH_CLIENT_IDS ?? '').trim();
  const isProd = process.env.NODE_ENV === 'production';

  if (raw.length === 0) {
    if (isProd) {
      // Do not cache the empty list in prod — we want subsequent verifier
      // calls to surface the misconfiguration too.
      throw new AuthError(
        'invalid_token',
        'misconfigured',
        'GOOGLE_OAUTH_CLIENT_IDS is required in production but is not set'
      );
    }
    logger.warn(
      '[auth] GOOGLE_OAUTH_CLIENT_IDS is not set; Google ID-token verification will reject all tokens until configured. This is acceptable for local dev only.'
    );
    cachedAudienceList = [];
    cachedAudienceListResolved = true;
    return cachedAudienceList;
  }

  const list = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  cachedAudienceList = list;
  cachedAudienceListResolved = true;
  return list;
}

/**
 * Boot-time invariant: in production, require `GOOGLE_OAUTH_CLIENT_IDS` to be
 * a non-empty allowlist. Call this once during server startup so the process
 * refuses to boot with an invalid identity configuration.
 *
 * Throws a plain `Error` (not `AuthError`) so the startup harness logs it as
 * a fatal config error rather than a per-request auth failure.
 */
export function assertGoogleAudienceConfiguredForProd(): void {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) return;

  const raw = (process.env.GOOGLE_OAUTH_CLIENT_IDS ?? '').trim();
  if (raw.length === 0) {
    const msg =
      '[SECURITY] FATAL: GOOGLE_OAUTH_CLIENT_IDS is required in production. ' +
      'Set it to a comma-separated allowlist of Google OAuth client IDs ' +
      '(e.g. "1234.apps.googleusercontent.com,5678.apps.googleusercontent.com"). ' +
      'Without this, no Google ID token can be safely verified.';
    logger.error(msg);
    throw new Error(
      'GOOGLE_OAUTH_CLIENT_IDS is required in production. Set it to a comma-separated list of accepted Google OAuth client IDs.'
    );
  }
}

/**
 * Test-only escape hatch to reset the cached audience list. Wired into the
 * public surface so tests in this package can mutate env between cases and
 * have the next call to `googleAudienceList()` re-read the environment.
 *
 * @internal
 */
export function _resetGoogleAudienceCacheForTests(): void {
  cachedAudienceList = undefined;
  cachedAudienceListResolved = false;
}

// -----------------------------------------------------------------------------
// OAuth2Client singleton
// -----------------------------------------------------------------------------

/**
 * Lazy-instantiated `OAuth2Client`. Constructing one is cheap, but doing it at
 * module load would force the test suite to mock `google-auth-library` before
 * any unrelated import path touches this module. Lazy avoids that fragility.
 */
let oauthClient: OAuth2Client | undefined;

function getOAuthClient(): OAuth2Client {
  if (!oauthClient) {
    oauthClient = new OAuth2Client();
  }
  return oauthClient;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Extract a roles array from a verified JWT payload, normalising the two
 * shapes the platform emits:
 *   - `{ roles: ["user", "admin"] }` (preferred)
 *   - `{ role: "admin" }` (legacy single-string)
 *
 * Returns an empty array when neither claim is present. The Apollo `AuthChecker`
 * treats an empty roles array as "authenticated user with no privileged role".
 */
export function parseRolesFromJWT(
  payload: jwt.JwtPayload | string | undefined
): string[] {
  if (!payload || typeof payload === 'string') return [];

  const out: string[] = [];
  const rolesClaim = (payload as { roles?: unknown }).roles;
  if (Array.isArray(rolesClaim)) {
    for (const r of rolesClaim) {
      if (typeof r === 'string' && r.length > 0) out.push(r);
    }
  }

  const roleClaim = (payload as { role?: unknown }).role;
  if (typeof roleClaim === 'string' && roleClaim.length > 0) {
    if (!out.includes(roleClaim)) out.push(roleClaim);
  }

  return out;
}

/**
 * Redact a token for safe logging. Returns the first 8 characters followed by
 * an ellipsis and the total length. Never returns the full token.
 */
function redactToken(token: string): string {
  if (!token) return '<empty>';
  if (token.length <= 8) return `<len=${token.length}>`;
  return `${token.slice(0, 8)}…<len=${token.length}>`;
}

/**
 * Classify a JWT verification failure into a discriminated `AuthErrorReason`.
 * `jsonwebtoken` throws specific subclasses we can branch on; falls back to
 * `bad_signature` for the generic case.
 */
function classifyJwtError(error: unknown): AuthErrorReason {
  if (error instanceof TokenExpiredError) return 'expired';
  if (error instanceof JsonWebTokenError) {
    const msg = (error.message || '').toLowerCase();
    if (msg.includes('malformed') || msg.includes('jwt must be')) {
      return 'malformed';
    }
    return 'bad_signature';
  }
  return 'bad_signature';
}

// -----------------------------------------------------------------------------
// Main entry point
// -----------------------------------------------------------------------------

/**
 * Verify a bearer token and return a typed `BackendPrincipal`.
 *
 * Throws `AuthError("invalid_token", reason)` on every failure path. Callers
 * are required to handle the throw — there is no silent fallback to an
 * unauthenticated principal.
 *
 * Structural validation pipeline:
 *
 *  - Empty or whitespace-only -> `malformed`.
 *  - Exact match with `SERVER_AUTH_TOKEN` -> `{ kind: "server" }`.
 *  - HS256 JWT signed with `BACKEND_SERVICE_JWT_SECRET`, issuer `adaptic-service`,
 *    audience `adaptic-backend` -> `{ kind: "server" }`. See `./service-token`.
 *  - Single segment (no dots) -> `opaque_access_token_rejected`. This is the
 *    structural catch for OAuth access tokens, which cannot be verified offline.
 *  - Exactly 3 dot-separated segments -> attempt local JWT verify, then Google
 *    ID-token verify. The Google branch only runs if the local JWT branch
 *    fails AND the configured Google audience list is non-empty.
 *  - Any other segment count -> `malformed`.
 *
 * @param token Raw bearer token (the value after `Bearer ` in the header).
 * @returns A verified `BackendPrincipal` on success.
 * @throws `AuthError` on any failure.
 */
export async function verifyBackendToken(
  token: string
): Promise<BackendPrincipal> {
  // ---- structural rejection of empty input ---------------------------------
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new AuthError('invalid_token', 'malformed');
  }

  // ---- path 1: server-to-server static token -------------------------------
  // Read once per call so a runtime env change is honoured. The exact-match
  // check guards against the historical bug of allowing the empty string to
  // authenticate when SERVER_AUTH_TOKEN is unset.
  const serverAuthToken = process.env.SERVER_AUTH_TOKEN;
  if (
    typeof serverAuthToken === 'string' &&
    serverAuthToken.length > 0 &&
    token === serverAuthToken
  ) {
    return { kind: 'server' };
  }

  // ---- structural classification --------------------------------------------
  const segments = token.split('.');

  // Single segment (no dots) -> opaque OAuth access token (or similar).
  // These tokens (ya29.…, but technically any non-dotted bearer) cannot be
  // verified offline. Reject explicitly so the caller surfaces a clear reason.
  if (segments.length === 1) {
    logger.warn('[auth] opaque access token rejected', {
      tokenPrefix: redactToken(token),
    });
    throw new AuthError('invalid_token', 'opaque_access_token_rejected');
  }

  // Anything other than 3 segments is not a valid JWT or Google ID token.
  // This catches the historical `ya29.<single-payload>` form (2 segments) and
  // any other malformed shape.
  if (segments.length !== 3) {
    logger.warn('[auth] malformed token rejected', {
      tokenPrefix: redactToken(token),
      segmentCount: segments.length,
    });
    throw new AuthError('invalid_token', 'malformed');
  }

  // ---- path 1b: dedicated service credential -------------------------------
  // Checked before the app-JWT path because a service credential is signed
  // with a DIFFERENT secret: reaching path 2 first would classify it as
  // `bad_signature` and report an unprovisioned-service outage as a forgery.
  // Returns null when the path is unprovisioned or the signature is not ours,
  // which leaves every existing token's behaviour byte-identical.
  const servicePrincipal = verifyServiceToken(token);
  if (servicePrincipal !== null) {
    return servicePrincipal;
  }

  // ---- path 2: app-issued JWT ----------------------------------------------
  // Try local JWT verification first. On success, return a user principal.
  // On failure, capture the reason but DO NOT throw yet — we may still be
  // looking at a Google ID token, which is structurally a JWT signed by Google.
  let localJwtFailure: AuthErrorReason | undefined;
  try {
    // Pin algorithm to HS256. Without this, `jsonwebtoken.verify` accepts
    // `alg: "none"` (silently!) for older versions of the library — a
    // well-known footgun where an attacker forges an unsigned token and
    // the server accepts it as authentic. Pinning also ensures forward
    // compatibility: if we ever sign with a different alg, every verifier
    // is forced to update in lockstep with the signer.
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    if (typeof payload === 'string') {
      // String-payload JWTs are not used by this platform and carry no claims
      // we can convert into a principal. Treat as malformed.
      throw new AuthError('invalid_token', 'malformed');
    }
    const sub = typeof payload.sub === 'string' ? payload.sub : undefined;
    if (!sub) {
      // No sub claim -> no principal. Treat as malformed identity.
      throw new AuthError('invalid_token', 'malformed');
    }

    const roles = parseRolesFromJWT(payload);
    const isAdmin = roles.includes('admin');
    const emailClaim = (payload as { email?: unknown }).email;
    const email =
      typeof emailClaim === 'string' && emailClaim.length > 0
        ? emailClaim
        : undefined;

    return isAdmin
      ? { kind: 'admin', sub, email, roles }
      : { kind: 'user', sub, email, roles };
  } catch (e) {
    // AuthError thrown from inside the try-block (e.g. no-sub case) must
    // propagate without being reclassified.
    if (e instanceof AuthError) {
      throw e;
    }
    localJwtFailure = classifyJwtError(e);
    // Expired tokens are unambiguous: we know they were signed by us. Surface
    // the expiry reason immediately rather than falling through to Google.
    if (localJwtFailure === 'expired') {
      throw new AuthError('invalid_token', 'expired');
    }
    // Otherwise, fall through to Google ID-token verification below.
  }

  // ---- path 3: Google ID token ---------------------------------------------
  // Only attempt Google verification when an audience list is configured.
  // The list is empty in dev/test by default, which causes this branch to
  // throw the most-precise reason from the local JWT path above.
  const audience = googleAudienceList();
  if (audience.length === 0) {
    // No Google verification possible. Bubble up the local JWT reason.
    throw new AuthError(
      'invalid_token',
      localJwtFailure ?? 'bad_signature'
    );
  }

  // A 3-segment token reaching this point is presumed to be either a Google
  // ID token or a forgery. Local JWT verify against our secret has already
  // failed (otherwise we returned above). We surface Google's diagnosis as
  // the authoritative one — `localJwtFailure` is captured only for the case
  // where the audience list is empty (handled above) so we can bubble the
  // best-available signal to the caller.
  let ticketResult: LoginTicket;
  try {
    ticketResult = await getOAuthClient().verifyIdToken({
      idToken: token,
      audience,
    });
  } catch (e) {
    // google-auth-library throws plain Errors with messages like
    // "Wrong recipient, payload audience != requiredAudience" for bad audience,
    // "Token used too late" for expiry, and "Invalid token signature" for
    // tampering. Classify into the closest discriminated reason.
    const msg = e instanceof Error ? e.message.toLowerCase() : '';
    logger.warn('[auth] Google ID token verification failed', {
      tokenPrefix: redactToken(token),
      errorMessage: e instanceof Error ? e.message : 'unknown',
      localJwtReason: localJwtFailure ?? 'n/a',
    });

    if (msg.includes('used too late') || msg.includes('expired')) {
      throw new AuthError('invalid_token', 'expired');
    }
    if (msg.includes('signature') || msg.includes('invalid token')) {
      throw new AuthError('invalid_token', 'bad_signature');
    }
    // Default classification for Google verification failures is
    // `bad_audience` — BUT: when local-JWT path 2 already failed (the
    // common case, since the app mints HS256 tokens that Google cannot
    // recognise), the user is almost certainly NOT presenting a Google
    // ID token at all. Surfacing `bad_audience` in that case hides the
    // real upstream failure (typically `bad_signature` from path 2)
    // behind an irrelevant fallback diagnosis. Prefer the local-JWT
    // reason when present; only fall back to `bad_audience` when there
    // is no local-JWT failure to bubble (i.e. a token that decoded as
    // a JWT but somehow didn't reach the local-JWT branch — defensive).
    throw new AuthError('invalid_token', localJwtFailure ?? 'bad_audience');
  }

  // ticketResult must be defined here because the catch above always throws.
  const payload = ticketResult?.getPayload?.();
  if (!payload) {
    // Google verified the token but returned no payload — treat as a
    // signature failure since we cannot extract a principal.
    logger.warn('[auth] Google verifyIdToken returned no payload', {
      tokenPrefix: redactToken(token),
    });
    throw new AuthError('invalid_token', 'bad_signature');
  }

  const sub = payload.sub;
  if (typeof sub !== 'string' || sub.length === 0) {
    // No `sub` claim from Google -> no principal we can use.
    logger.warn('[auth] Google payload missing sub claim', {
      tokenPrefix: redactToken(token),
    });
    throw new AuthError('invalid_token', 'bad_signature');
  }

  return {
    kind: 'user',
    sub,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    roles: ['user'],
  };
}
