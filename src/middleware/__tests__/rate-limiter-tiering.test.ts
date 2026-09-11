import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { NextFunction } from 'express';

/**
 * Tier-verification pins (audit B01-backend-legacy-02 / -09): the `auth` rate
 * tier must require ACTUAL offline verification — a fabricated 3-segment
 * Bearer shape must no longer earn the 5x-higher budget — and verified callers
 * must bucket per principal `sub` rather than per source IP.
 */

// jwtConfig reads process.env at import time — set the secret before any
// import of the module graph pulls it in.
vi.hoisted(() => {
  process.env.JWT_SECRET =
    'rate-limiter-test-secret-0123456789abcdef0123456789abcdef';
});

import {
  createRateLimiter,
  CORTEX_RATE_LIMIT_ENFORCE_ENV,
} from '../rate-limiter';
import { _resetRateTierCacheForTests } from '../rate-tier';
import {
  makeConfig,
  makeReq,
  makeRes,
  signUserToken,
} from './rate-limit-test-utils';

describe('rate limiter tier verification', () => {
  beforeEach(() => {
    _resetRateTierCacheForTests();
    // Enforce mode makes the tier observable through 429 semantics.
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    delete process.env.SERVER_AUTH_TOKEN;
  });

  afterEach(() => {
    delete process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV];
    delete process.env.SERVER_AUTH_TOKEN;
  });

  it('a fabricated JWT-shaped token no longer earns the auth tier (B01-09)', () => {
    const limiter = createRateLimiter(
      makeConfig({ maxUnauthenticated: 1, maxAuthenticated: 100 })
    );

    const next = vi.fn();
    const req = makeReq({ headers: { authorization: 'Bearer a.b.c' } });
    limiter(req, makeRes().res, next as NextFunction);
    const second = makeRes();
    limiter(req, second.res, next as NextFunction);

    // Tiered as anon (limit 1) -> second request is blocked, despite the
    // 3-segment Bearer shape.
    expect(second.status).toHaveBeenCalledWith(429);
  });

  it('verified HS256 JWTs earn the auth tier, bucketed per principal sub (B01-02/-09)', () => {
    const limiter = createRateLimiter(
      makeConfig({ maxUnauthenticated: 1, maxAuthenticated: 2 })
    );

    const next = vi.fn();
    const tokenA = signUserToken('user-a');
    const tokenB = signUserToken('user-b');

    // Same source IP for every request: buckets must separate by sub, not IP.
    for (let i = 0; i < 2; i += 1) {
      const r = makeRes();
      limiter(
        makeReq({ headers: { authorization: `Bearer ${tokenA}` } }),
        r.res,
        next as NextFunction
      );
      expect(r.status).not.toHaveBeenCalled();
    }
    const overA = makeRes();
    limiter(
      makeReq({ headers: { authorization: `Bearer ${tokenA}` } }),
      overA.res,
      next as NextFunction
    );
    expect(overA.status).toHaveBeenCalledWith(429);

    // user-b still has a full budget despite sharing the IP with user-a.
    const freshB = makeRes();
    limiter(
      makeReq({ headers: { authorization: `Bearer ${tokenB}` } }),
      freshB.res,
      next as NextFunction
    );
    expect(freshB.status).not.toHaveBeenCalled();
  });

  it('the exact SERVER_AUTH_TOKEN earns the auth tier', () => {
    process.env.SERVER_AUTH_TOKEN = 'server-token-for-tier-test';
    const limiter = createRateLimiter(
      makeConfig({ maxUnauthenticated: 1, maxAuthenticated: 3 })
    );

    const next = vi.fn();
    for (let i = 0; i < 3; i += 1) {
      const r = makeRes();
      limiter(
        makeReq({
          headers: { authorization: 'Bearer server-token-for-tier-test' },
        }),
        r.res,
        next as NextFunction
      );
      expect(r.status).not.toHaveBeenCalled();
    }
  });
});
