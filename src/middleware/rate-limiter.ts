// CORTEX-P0-001: mounted in server.ts as
//   app.use('/graphql', cors, graphqlRateLimiter, …)  // GraphQL surface (after CORS)
//   app.use('/api', authRateLimiter)                  // authenticated Express surface
// SHADOW-FIRST: 429 enforcement is gated behind CORTEX_RATE_LIMIT_ENFORCE.
// While OFF (default), the limiters observe + count requests that WOULD be
// blocked but never touch the response — live behaviour is byte-identical.

import { Request, Response, NextFunction } from 'express';
import { Counter, Gauge } from 'prom-client';
import { metricsRegistry } from '../config/metrics';
import { logger } from '../utils/logger';
import { resolveRateTier } from './rate-tier';

/**
 * Environment variable gating 429 enforcement. When set to `true`/`1`, the
 * limiters block over-limit requests with HTTP 429. Unset or any other value
 * keeps them in SHADOW mode (observe + count + always proceed).
 */
export const CORTEX_RATE_LIMIT_ENFORCE_ENV = 'CORTEX_RATE_LIMIT_ENFORCE';

/**
 * Whether rate-limit 429 enforcement is ON. Read fresh on each request (a cheap
 * env read) so the shadow→enforce graduation can be flipped operationally
 * without a restart. Defaults to OFF (shadow) for any unset/unrecognised value.
 *
 * @param env - Environment source (defaults to `process.env`); injectable for tests.
 * @returns `true` only when the flag is explicitly `true`/`1`.
 */
export function isRateLimitEnforced(
  env: Record<string, string | undefined> = process.env
): boolean {
  const raw = (env[CORTEX_RATE_LIMIT_ENFORCE_ENV] ?? '').trim().toLowerCase();
  return raw === 'true' || raw === '1';
}

/**
 * Counts requests that rate limiting WOULD block (HTTP 429) while in SHADOW
 * mode. This is the signal proving whether flipping
 * `CORTEX_RATE_LIMIT_ENFORCE` to enforce would reject legitimate traffic.
 * Labelled by the `limiter` name (`graphql`/`auth`) and the request `tier`
 * (`auth`/`anon`). Real enforce-mode denials count on
 * {@link cortexRateLimitBlockedTotal} instead, keeping the observed-only and
 * actually-blocked series distinct (audit B01-backend-legacy-14).
 */
export const cortexRateLimitWouldBlockTotal = new Counter({
  name: 'cortex_rate_limit_would_block_total',
  help: 'Requests rate limiting would block (429), by limiter and tier (shadow mode only; real denials count on cortex_rate_limit_blocked_total)',
  labelNames: ['limiter', 'tier'] as const,
  registers: [metricsRegistry],
});

/**
 * Counts requests actually blocked with HTTP 429 in ENFORCE mode. Kept as a
 * separate series from {@link cortexRateLimitWouldBlockTotal} so shadow
 * observations and real blocks never mix (audit B01-backend-legacy-14).
 */
export const cortexRateLimitBlockedTotal = new Counter({
  name: 'cortex_rate_limit_blocked_total',
  help: 'Requests actually blocked with HTTP 429, by limiter and tier (enforce mode only)',
  labelNames: ['limiter', 'tier'] as const,
  registers: [metricsRegistry],
});

/**
 * Tracked bucket-key cardinality per limiter store. Bounds memory ahead of the
 * trust-proxy fix, after which the identifier derives from X-Forwarded-For and
 * an attacker rotating spoofed values could otherwise mint unbounded entries
 * (audit B01-backend-legacy-12).
 */
export const cortexRateLimitStoreKeys = new Gauge({
  name: 'cortex_rate_limit_store_keys',
  help: 'Current tracked bucket-key cardinality per limiter store',
  labelNames: ['limiter'] as const,
  registers: [metricsRegistry],
});

/** Sweep cadence for expired bucket entries. */
const STORE_SWEEP_INTERVAL_MS = 60_000;

/**
 * Default cap on distinct bucket keys per limiter store. Past the cap, new
 * identifiers aggregate into a shared per-tier overflow bucket instead of
 * allocating — bounding memory under identifier-rotation abuse.
 */
const DEFAULT_MAX_TRACKED_KEYS = 100_000;

/** Bucket-key prefix used once the store cardinality cap is reached. */
const OVERFLOW_KEY_PREFIX = 'overflow';

/** Configuration for one rate limiter instance. */
export interface RateLimitConfig {
  /** Stable limiter identifier used as the `limiter` metric label. */
  name: string;
  windowMs: number;
  maxAuthenticated: number;
  maxUnauthenticated: number;
  message: { errors: Array<{ message: string }> };
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  /** Cap on distinct bucket keys (defaults to {@link DEFAULT_MAX_TRACKED_KEYS}). */
  maxTrackedKeys?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

/**
 * Creates an in-memory rate limiter middleware with separate limits for
 * verified (auth) and anonymous requests.
 *
 * Bucketing: verified callers are keyed per principal (`sub:<sub>`); anonymous
 * callers are keyed by client IP, which resolves correctly behind the LB only
 * with `trust proxy` configured in server.ts (audit B01-backend-legacy-02).
 * The `auth` tier requires actual offline verification — a fabricated
 * JWT-shaped header no longer earns the higher budget (B01-backend-legacy-09).
 * CORS preflights (`OPTIONS`) are never counted (B01-backend-legacy-11).
 *
 * Response headers (enforce mode only, when standardHeaders is enabled):
 *   X-RateLimit-Limit     - maximum requests allowed in the current window
 *   X-RateLimit-Remaining - requests remaining in the current window
 *   X-RateLimit-Reset     - seconds until the current window resets
 *   Retry-After           - seconds to wait before retrying (only on 429)
 *
 * @param config - Rate limit configuration.
 * @returns Express middleware function.
 */
export function createRateLimiter(
  config: RateLimitConfig
): (req: Request, res: Response, next: NextFunction) => void {
  const store = new Map<string, RateLimitEntry>();
  const maxTrackedKeys = config.maxTrackedKeys ?? DEFAULT_MAX_TRACKED_KEYS;

  // Sweep expired entries every minute. `unref()` so an importing process
  // (tests, one-off scripts) is never kept alive by the sweeper
  // (audit B01-backend-legacy-12).
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetTime < now) {
        store.delete(key);
      }
    }
    cortexRateLimitStoreKeys.set({ limiter: config.name }, store.size);
  }, STORE_SWEEP_INTERVAL_MS).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    // CORS preflights carry no credentials and must not consume rate budget
    // (audit B01-backend-legacy-11).
    if (req.method === 'OPTIONS') {
      next();
      return;
    }

    const { tier, principalKey } = resolveRateTier(req);
    const identifier =
      principalKey ?? req.ip ?? req.socket.remoteAddress ?? 'unknown';
    const effectiveMax =
      tier === 'auth' ? config.maxAuthenticated : config.maxUnauthenticated;
    let storeKey = `${identifier}:${tier}`;
    const now = Date.now();

    // Cardinality cap: aggregate novel identifiers into a shared per-tier
    // overflow bucket rather than growing without bound
    // (audit B01-backend-legacy-12).
    if (!store.has(storeKey) && store.size >= maxTrackedKeys) {
      storeKey = `${OVERFLOW_KEY_PREFIX}:${tier}`;
    }

    const existing = store.get(storeKey);
    let current: RateLimitEntry;
    if (!existing || existing.resetTime < now) {
      current = { count: 1, resetTime: now + config.windowMs };
      store.set(storeKey, current);
    } else {
      existing.count += 1;
      current = existing;
    }

    const remaining = Math.max(0, effectiveMax - current.count);
    const resetSeconds = Math.ceil((current.resetTime - now) / 1000);
    const overLimit = current.count > effectiveMax;

    // SHADOW mode (default): observe + count over-limit requests but NEVER touch
    // the response — no rate-limit headers, no 429. This keeps live behaviour
    // byte-identical until CORTEX_RATE_LIMIT_ENFORCE is flipped on.
    if (!isRateLimitEnforced()) {
      if (overLimit) {
        cortexRateLimitWouldBlockTotal.inc({ limiter: config.name, tier });
        // Log only the FIRST over-limit request per (bucket, window) — the
        // counter carries per-request cardinality; unthrottled logging floods
        // Cloud Logging and buries real warnings (audit B01-backend-legacy-10).
        if (current.count === effectiveMax + 1) {
          logger.warn('[cortex-rate-limit] shadow would-block (allowing)', {
            limiter: config.name,
            identifier,
            tier,
            count: current.count,
            limit: effectiveMax,
            resetSeconds,
          });
        }
      }
      next();
      return;
    }

    // ENFORCE mode: emit the informational rate-limit headers and block
    // over-limit requests with HTTP 429.
    if (config.standardHeaders !== false) {
      res.setHeader('X-RateLimit-Limit', effectiveMax.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', resetSeconds.toString());
    }

    if (overLimit) {
      // Include Retry-After header on 429 responses (RFC 6585 / RFC 7231)
      res.setHeader('Retry-After', resetSeconds.toString());
      cortexRateLimitBlockedTotal.inc({ limiter: config.name, tier });
      res.status(429).json(config.message);
      return;
    }

    next();
  };
}

/**
 * Rate limiter for GraphQL endpoint.
 *
 * Verified requests:  1000 requests per 15 minutes (configurable via RATE_LIMIT_MAX)
 * Anonymous requests: 200 requests per 15 minutes (configurable via RATE_LIMIT_MAX_UNAUTH)
 */
export const graphqlRateLimiter = createRateLimiter({
  name: 'graphql',
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAuthenticated: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
  maxUnauthenticated: parseInt(process.env.RATE_LIMIT_MAX_UNAUTH || '200', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [{ message: 'Too many requests, please try again later.' }],
  },
});

/**
 * Rate limiter for authentication endpoints.
 *
 * Verified requests:  50 requests per 15 minutes
 * Anonymous requests: 20 requests per 15 minutes
 */
export const authRateLimiter = createRateLimiter({
  name: 'auth',
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAuthenticated: 50,
  maxUnauthenticated: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { errors: [{ message: 'Too many authentication attempts.' }] },
});
