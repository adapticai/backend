/**
 * Rate-limit tier resolution (audit B01-backend-legacy-09).
 *
 * The rate limiter previously granted the 5x-higher authenticated tier to any
 * request carrying a 3-dot-segment `Bearer` header — a trivially fabricated
 * shape (`Bearer a.b.c`). This module keys the tier off ACTUAL verification
 * instead, using the two offline-verifiable credential classes:
 *
 *   1. `SERVER_AUTH_TOKEN` exact match (the engine / server-to-server path).
 *   2. App-issued HS256 JWTs verified against the shared `jwtSecret`.
 *
 * Google ID tokens (RS256, JWKS-verified) cannot be verified synchronously
 * without a network dependency in the request hot path; they are deliberately
 * tiered as `anon`. This is a metrics-only inaccuracy while the limiter is in
 * shadow mode — before any enforce graduation, either extend this resolver
 * with an async JWKS-backed path or raise the anon ceiling to cover browser
 * traffic (tracked in the B01-02 graduation checklist).
 *
 * Verified results are memoised in a bounded, TTL'd cache keyed by the token's
 * SHA-256 (raw tokens are never retained) so the per-request cost is one hash.
 */

import { createHash } from 'crypto';
import jwt from 'jsonwebtoken';
import type { Request } from 'express';
import { jwtSecret } from '../config/jwtConfig';

/** Rate-limit tier: `auth` = verified caller budget, `anon` = default budget. */
export type RateTier = 'auth' | 'anon';

/**
 * Outcome of tier resolution for one request.
 */
export interface RateTierResolution {
  /** The tier the request's rate budget is drawn from. */
  readonly tier: RateTier;
  /**
   * Stable per-principal bucket key (`sub:<sub>`) for verified callers, so
   * authenticated traffic is bucketed per principal rather than per IP
   * (audit B01-backend-legacy-02). `null` for anonymous callers — the limiter
   * falls back to the client IP.
   */
  readonly principalKey: string | null;
}

/** Bound on memoised token verdicts; oldest entries evicted first. */
const TIER_CACHE_MAX_ENTRIES = 2048;

/** Memoised verdicts expire after one rate-limit window (15 minutes). */
const TIER_CACHE_TTL_MS = 15 * 60 * 1000;

const ANON_RESOLUTION: RateTierResolution = { tier: 'anon', principalKey: null };

interface CachedResolution {
  readonly resolution: RateTierResolution;
  readonly expiresAt: number;
}

const tierCache = new Map<string, CachedResolution>();

/**
 * Clears the memoised token-verdict cache. Test-only.
 *
 * @internal exported for testing
 */
export function _resetRateTierCacheForTests(): void {
  tierCache.clear();
}

/**
 * Verifies a bearer token offline and classifies its rate tier.
 *
 * @param token - Raw bearer token value (after the `Bearer ` prefix).
 * @returns The resolved tier; `anon` for anything that fails verification.
 */
function verifyTier(token: string): RateTierResolution {
  const serverAuthToken = process.env.SERVER_AUTH_TOKEN;
  if (
    typeof serverAuthToken === 'string' &&
    serverAuthToken.length > 0 &&
    token === serverAuthToken
  ) {
    return { tier: 'auth', principalKey: 'sub:server' };
  }

  try {
    // HS256 pinned for the same alg-confusion reasons as the token-verifier.
    const payload = jwt.verify(token, jwtSecret, { algorithms: ['HS256'] });
    if (typeof payload !== 'string' && typeof payload.sub === 'string') {
      return { tier: 'auth', principalKey: `sub:${payload.sub}` };
    }
    return ANON_RESOLUTION;
  } catch {
    // Unverifiable (bad signature, expired, RS256 Google ID token, garbage
    // shape) — treated as anonymous for tier purposes. Never throws upward:
    // the limiter must not be able to fail a request.
    return ANON_RESOLUTION;
  }
}

/**
 * Resolves the rate-limit tier and principal bucket key for a request.
 *
 * Cheap on the hot path: one SHA-256 over the token plus a bounded map lookup;
 * the HMAC verification runs at most once per token per TTL window.
 *
 * @param req - Incoming Express request.
 * @returns The request's {@link RateTierResolution}; `anon` when no `Bearer`
 *   token is present or the token cannot be verified offline.
 */
export function resolveRateTier(req: Request): RateTierResolution {
  const authHeader = req.headers.authorization ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return ANON_RESOLUTION;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (token.length === 0) {
    return ANON_RESOLUTION;
  }

  const cacheKey = createHash('sha256').update(token).digest('hex');
  const now = Date.now();
  const cached = tierCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.resolution;
  }

  const resolution = verifyTier(token);

  if (tierCache.size >= TIER_CACHE_MAX_ENTRIES) {
    // Map preserves insertion order — evict the oldest entry.
    const oldestKey = tierCache.keys().next().value;
    if (oldestKey !== undefined) {
      tierCache.delete(oldestKey);
    }
  }
  tierCache.set(cacheKey, { resolution, expiresAt: now + TIER_CACHE_TTL_MS });

  return resolution;
}
