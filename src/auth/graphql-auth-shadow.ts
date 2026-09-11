/**
 * GraphQL context-layer authentication SHADOW observer.
 *
 * This is the transport/context-level counterpart to the resolver-level
 * {@link ../auth/cortex-auth-checker.cortexAuthChecker}. The two observe DIFFERENT
 * populations and are complementary:
 *
 *   - `cortexAuthChecker` runs ONLY for `@Authorized()`-decorated fields (today:
 *     the 5 investor-relations models + delete mutations). It cannot see an
 *     unauthenticated request to any of the hundreds of auto-generated,
 *     undecorated CRUD fields — which is the overwhelming majority of live
 *     traffic (the platform, the account-audit scripts, and the engine all reach
 *     undecorated resolvers).
 *   - THIS observer runs in the `/graphql` HTTP + WebSocket `context()` callback,
 *     BEFORE any resolver, on EVERY request. It records whether a request arrived
 *     with a verified principal, with no principal, or with an invalid token —
 *     the true, complete denominator+numerator the enforcement decision needs.
 *
 * WHY (audit context): the `/graphql` `context()` currently lets a request with
 * NO bearer token fall through as `{ principal: null }` and ALLOWS it. Requiring
 * a principal at this layer (rejecting `null`) is the change that would break the
 * entire product today (cookie-authenticated platform, token-less audit scripts,
 * the engine's `SERVER_AUTH_TOKEN` gate). Before that enforcement can ever be
 * flipped, we must first MEASURE, in production, exactly who reaches `/graphql`
 * without a verified principal. This module provides that measurement WITHOUT
 * changing behaviour: it counts and (throttled) logs would-denies and always
 * returns control to the caller.
 *
 * SAFETY CONTRACT — observe-only, never blocks:
 *   - The Prometheus counter {@link graphqlAuthContextEvaluationsTotal} increments
 *     on every context evaluation, labelled by transport + outcome. It is the
 *     primary quantitative signal and carries only BOUNDED labels (never the
 *     attacker-controllable operation name / origin / IP).
 *   - For the `no_principal` outcome — the would-deny — a structured identity log
 *     is emitted, THROTTLED to the first occurrence of each
 *     `(transport, operationName, origin)` per dedup window. Unthrottled logging
 *     of every unauthenticated request would flood Cloud Logging and bury real
 *     warnings (audit B01-backend-legacy-10); the counter carries the per-request
 *     cardinality instead.
 *   - The dedup store is capped and rotates novel keys into a shared overflow
 *     bucket so an attacker rotating spoofed origins/operation names cannot grow
 *     memory without bound (audit B01-backend-legacy-12).
 *
 * @see src/auth/cortex-auth-checker.ts for the resolver-level shadow checker.
 * @see docs/security/2026-08-23-graphql-auth-enforcement-runbook.md for the
 *      staged enforcement plan this observer feeds.
 */

import { Counter, Gauge } from 'prom-client';
import { metricsRegistry } from '../config/metrics';
import { logger } from '../utils/logger';

// -----------------------------------------------------------------------------
// Public types
// -----------------------------------------------------------------------------

/** The GraphQL transport a context evaluation ran on. */
export type GraphqlTransport = 'http' | 'ws';

/**
 * Outcome of a `/graphql` `context()` evaluation.
 *
 *   - `authenticated`  — a verified {@link ../auth/token-verifier.BackendPrincipal}
 *     was attached.
 *   - `no_principal`   — no bearer token was presented; the request falls through
 *     with `principal: null`. This is the WOULD-DENY case under principal-required
 *     enforcement — the sole behaviour the enforcement flip changes.
 *   - `invalid_token`  — a token was presented but failed verification. This is
 *     ALREADY rejected today (HTTP 401 / WS close); recorded here only to complete
 *     the denominator.
 */
export type AuthContextOutcome =
  | 'authenticated'
  | 'no_principal'
  | 'invalid_token';

/**
 * Caller identity captured for a would-deny (`no_principal`) request. Every field
 * is best-effort and may be absent (server-to-server callers send no `origin`;
 * the WS operation name is not always known at context time). Nothing here is
 * ever used as a Prometheus label — only in the throttled structured log.
 */
export interface ShadowAuthIdentity {
  /** Transport the request arrived on. */
  transport: GraphqlTransport;
  /** GraphQL operation name, when resolvable from the request body / args. */
  operationName?: string;
  /** `Origin` header — distinguishes browser callers (platform) from scripts. */
  origin?: string;
  /** Client IP, as resolved by the caller (Express `req.ip` honours trust-proxy). */
  ip?: string;
  /** `User-Agent` header, when present. */
  userAgent?: string;
  /**
   * Whether an `Authorization` header was present at all. `true` here with a
   * `no_principal` outcome means the header was present but not a `Bearer <token>`
   * (or an empty bearer) — a distinct, actionable misconfiguration.
   */
  authHeaderPresent: boolean;
}

// -----------------------------------------------------------------------------
// Metrics
// -----------------------------------------------------------------------------

/**
 * Counts EVERY `/graphql` context evaluation, labelled by {@link GraphqlTransport}
 * and {@link AuthContextOutcome}. This single series is both the denominator
 * (total requests seen) and the numerator (`outcome="no_principal"` = would-denies).
 *
 * Graduation rule for the runbook: the enforcement flip is safe to consider only
 * once `outcome="no_principal"` has been driven to (effectively) zero for the
 * transport being enforced, sustained across a full trading week — i.e. every
 * legitimate caller has been migrated to presenting a verified principal.
 *
 * Labels are deliberately BOUNDED (2 transports x 3 outcomes = 6 series). The
 * high-cardinality identity (operation name, origin, IP) lives only in the
 * throttled log, never as a metric label — an unauthenticated caller controls
 * those strings and could otherwise explode metric cardinality.
 */
export const graphqlAuthContextEvaluationsTotal = new Counter({
  name: 'graphql_auth_context_evaluations_total',
  help: 'GraphQL /graphql context evaluations by transport and outcome (outcome="no_principal" is the shadow would-deny; observe-only, never blocks)',
  labelNames: ['transport', 'outcome'] as const,
  registers: [metricsRegistry],
});

/**
 * Current tracked-key cardinality of the throttled-log dedup store. Bounds
 * visibility into the store ahead of the {@link MAX_TRACKED_SHADOW_KEYS} cap
 * (audit B01-backend-legacy-12).
 */
export const graphqlAuthShadowTrackedKeys = new Gauge({
  name: 'graphql_auth_shadow_tracked_keys',
  help: 'Current distinct (transport, operationName, origin) keys tracked by the shadow-auth log throttle',
  registers: [metricsRegistry],
});

// -----------------------------------------------------------------------------
// Logging-enable flag (counter is always on; this only gates the detail log)
// -----------------------------------------------------------------------------

/**
 * Environment variable that DISABLES the throttled identity log. Absent (the
 * default) keeps logging ON. Set to `true`/`1` to silence the per-caller log
 * lines if they ever become operationally noisy — the {@link
 * graphqlAuthContextEvaluationsTotal} counter continues unaffected, so the
 * quantitative signal is never lost.
 */
export const GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV =
  'GRAPHQL_AUTH_SHADOW_LOG_DISABLED';

/**
 * Whether the throttled identity log is disabled. Read fresh each call (a cheap
 * env read) so it can be toggled operationally without a restart — matching the
 * shadow-flag convention used by the AuthChecker and rate limiter.
 *
 * @param env - Environment source (defaults to `process.env`); injectable for tests.
 * @returns `true` only when the flag is explicitly `true`/`1`.
 */
export function isShadowAuthLoggingDisabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  const raw = (env[GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV] ?? '')
    .trim()
    .toLowerCase();
  return raw === 'true' || raw === '1';
}

// -----------------------------------------------------------------------------
// Throttled-log dedup store (mirrors the rate-limiter's capped store pattern)
// -----------------------------------------------------------------------------

/**
 * Dedup window for the identity log: at most one line per distinct
 * `(transport, operationName, origin)` key per window. Sized long (10 min) so a
 * high-volume unauthenticated caller (e.g. the whole platform) contributes ~one
 * line per window rather than one per request.
 */
export const SHADOW_LOG_DEDUP_WINDOW_MS = 10 * 60 * 1000;

/** Sweep cadence for expired dedup windows. */
const STORE_SWEEP_INTERVAL_MS = 60_000;

/**
 * Cap on distinct dedup keys. Past the cap, novel keys aggregate into a single
 * shared overflow bucket instead of allocating — bounding memory under an
 * attacker rotating spoofed origins / operation names (audit B01-backend-legacy-12).
 */
const MAX_TRACKED_SHADOW_KEYS = 10_000;

/** Dedup key used once the store cardinality cap is reached. */
const OVERFLOW_KEY = 'overflow';

/** Max characters retained from a caller-supplied string used in a dedup key. */
const MAX_KEY_SEGMENT_LEN = 120;

/** Max characters retained from a `User-Agent` in the log body. */
const MAX_UA_LEN = 200;

interface ShadowLogEntry {
  count: number;
  windowResetAt: number;
}

const shadowLogStore = new Map<string, ShadowLogEntry>();

// Sweep expired windows every minute. `unref()` so importing this module (tests,
// one-off scripts) never keeps the process alive on account of the sweeper.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of shadowLogStore) {
    if (entry.windowResetAt < now) {
      shadowLogStore.delete(key);
    }
  }
  graphqlAuthShadowTrackedKeys.set(shadowLogStore.size);
}, STORE_SWEEP_INTERVAL_MS).unref();

/**
 * Decide whether to emit an identity log line for `key` now: emit on the first
 * occurrence within the current dedup window, then suppress until the window
 * rolls over. Applies the cardinality cap + overflow bucket.
 *
 * @param key - The `(transport, operationName, origin)` dedup key.
 * @returns `true` when this is the first sighting of the key in the window.
 */
function shouldEmitIdentityLog(key: string): boolean {
  const now = Date.now();
  let storeKey = key;

  // Cardinality cap: fold novel keys into the shared overflow bucket rather than
  // growing without bound.
  if (
    !shadowLogStore.has(storeKey) &&
    shadowLogStore.size >= MAX_TRACKED_SHADOW_KEYS
  ) {
    storeKey = OVERFLOW_KEY;
  }

  const existing = shadowLogStore.get(storeKey);
  if (!existing || existing.windowResetAt < now) {
    shadowLogStore.set(storeKey, {
      count: 1,
      windowResetAt: now + SHADOW_LOG_DEDUP_WINDOW_MS,
    });
    return true;
  }

  existing.count += 1;
  return false;
}

// -----------------------------------------------------------------------------
// Extraction helpers (accept `unknown` so callers pass framework objects without
// leaking `any` or coupling this module to Express / graphql-ws types)
// -----------------------------------------------------------------------------

/**
 * Normalise a raw header value (`string | string[] | undefined`, arriving typed
 * as `unknown`) to a single string. Node folds repeated headers into an array;
 * we keep the first value.
 *
 * @param value - Raw header value.
 * @returns The string value, or `undefined` when absent/unusable.
 */
export function headerToString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
}

/**
 * Extract a GraphQL operation name from a parsed HTTP request body.
 *
 * @param body - The JSON-parsed `/graphql` POST body (typed `unknown`).
 * @returns The `operationName`, or `undefined` when absent/empty.
 */
export function extractOperationName(body: unknown): string | undefined {
  if (typeof body !== 'object' || body === null) return undefined;
  const op = (body as { operationName?: unknown }).operationName;
  return typeof op === 'string' && op.length > 0 ? op : undefined;
}

/**
 * Extract a GraphQL operation name from graphql-ws `ExecutionArgs`.
 *
 * @param args - The third argument to the graphql-ws `context` callback (typed `unknown`).
 * @returns The `operationName`, or `undefined` when absent/empty.
 */
export function extractOperationNameFromArgs(
  args: unknown
): string | undefined {
  if (typeof args !== 'object' || args === null) return undefined;
  const op = (args as { operationName?: unknown }).operationName;
  return typeof op === 'string' && op.length > 0 ? op : undefined;
}

/**
 * Extract `origin` / `userAgent` / `ip` from the graphql-ws `ctx.extra` object
 * (`{ request, socket }` for the `ws` integration), tolerating any shape.
 *
 * @param extra - The graphql-ws context `extra` (typed `unknown`).
 * @returns Best-effort header identity for the WebSocket upgrade request.
 */
export function extractHeaderIdentityFromWsExtra(extra: unknown): {
  origin?: string;
  userAgent?: string;
  ip?: string;
} {
  if (typeof extra !== 'object' || extra === null) return {};
  const request = (extra as { request?: unknown }).request;
  if (typeof request !== 'object' || request === null) return {};

  const headers = (request as { headers?: unknown }).headers;
  const socket = (request as { socket?: unknown }).socket;
  const headerBag =
    typeof headers === 'object' && headers !== null
      ? (headers as Record<string, unknown>)
      : {};
  const remoteAddress =
    typeof socket === 'object' && socket !== null
      ? (socket as { remoteAddress?: unknown }).remoteAddress
      : undefined;

  return {
    origin: headerToString(headerBag['origin']),
    userAgent: headerToString(headerBag['user-agent']),
    ip: typeof remoteAddress === 'string' ? remoteAddress : undefined,
  };
}

/** Trim + length-cap a caller-supplied string for safe use in a dedup key. */
function capSegment(value: string | undefined, max: number): string {
  if (!value) return '';
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

// -----------------------------------------------------------------------------
// Recording entry points (called from server.ts context callbacks)
// -----------------------------------------------------------------------------

/**
 * Record a context evaluation outcome on {@link graphqlAuthContextEvaluationsTotal}.
 * Use for the `authenticated` and `invalid_token` outcomes; the `no_principal`
 * outcome is recorded (with identity logging) by {@link recordShadowAuthMiss}.
 *
 * @param transport - The transport the evaluation ran on.
 * @param outcome - The evaluation outcome.
 */
export function recordAuthContextOutcome(
  transport: GraphqlTransport,
  outcome: AuthContextOutcome
): void {
  graphqlAuthContextEvaluationsTotal.inc({ transport, outcome });
}

/**
 * Record a would-deny (`no_principal`) request: increment the counter and, unless
 * logging is disabled, emit a throttled structured identity log. NEVER blocks and
 * NEVER throws — safe to call on the hot path of the `context()` callback.
 *
 * @param identity - Best-effort caller identity for the unauthenticated request.
 */
export function recordShadowAuthMiss(identity: ShadowAuthIdentity): void {
  graphqlAuthContextEvaluationsTotal.inc({
    transport: identity.transport,
    outcome: 'no_principal',
  });

  if (isShadowAuthLoggingDisabled()) return;

  const operationName =
    capSegment(identity.operationName, MAX_KEY_SEGMENT_LEN) || '<unnamed>';
  const origin = capSegment(identity.origin, MAX_KEY_SEGMENT_LEN) || '<none>';
  const key = `${identity.transport}|${operationName}|${origin}`;

  if (!shouldEmitIdentityLog(key)) return;

  logger.warn(
    '[graphql-auth-shadow] would-deny: unauthenticated /graphql request (allowing — no verified principal)',
    {
      transport: identity.transport,
      operationName,
      origin,
      ip: identity.ip,
      userAgent: capSegment(identity.userAgent, MAX_UA_LEN) || undefined,
      authHeaderPresent: identity.authHeaderPresent,
      dedupWindowMs: SHADOW_LOG_DEDUP_WINDOW_MS,
      note: 'First occurrence of this (transport, operationName, origin) in the current dedup window. Every occurrence is counted on graphql_auth_context_evaluations_total{outcome="no_principal"}.',
    }
  );
}

/**
 * Test-only reset of the throttled-log dedup store. Mirrors the token-verifier's
 * `_resetGoogleAudienceCacheForTests` convention so tests can assert first-in-window
 * emission deterministically without waiting out a real window.
 *
 * @internal
 */
export function _resetShadowAuthStateForTests(): void {
  shadowLogStore.clear();
}
