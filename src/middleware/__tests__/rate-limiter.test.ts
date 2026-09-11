import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { NextFunction } from 'express';

/**
 * Rate limiter behaviour pins (audit B01-backend-legacy-08 / -10 / -11 / -12 /
 * -14). The safety-critical contract is byte-identical SHADOW behaviour on the
 * live /graphql surface: with `CORTEX_RATE_LIMIT_ENFORCE` unset the limiter
 * must NEVER touch the response (no headers, no 429) while still counting
 * would-be blocks. Tier verification pins live in
 * `rate-limiter-tiering.test.ts`; the Express+cors mount contract lives in
 * `rate-limiter-mount.integration.test.ts`.
 */

// jwtConfig reads process.env at import time — set the secret before any
// import of the module graph pulls it in (same pattern as token-verifier tests).
vi.hoisted(() => {
  process.env.JWT_SECRET =
    'rate-limiter-test-secret-0123456789abcdef0123456789abcdef';
});

import {
  createRateLimiter,
  isRateLimitEnforced,
  cortexRateLimitWouldBlockTotal,
  cortexRateLimitBlockedTotal,
  CORTEX_RATE_LIMIT_ENFORCE_ENV,
} from '../rate-limiter';
import { _resetRateTierCacheForTests } from '../rate-tier';
import { logger } from '../../utils/logger';
import {
  WINDOW_MS,
  makeConfig,
  makeReq,
  makeRes,
  counterValue,
} from './rate-limit-test-utils';

describe('isRateLimitEnforced', () => {
  it('defaults to shadow for unset/unrecognised values', () => {
    expect(isRateLimitEnforced({})).toBe(false);
    expect(
      isRateLimitEnforced({ [CORTEX_RATE_LIMIT_ENFORCE_ENV]: 'bogus' })
    ).toBe(false);
  });

  it('is true only for explicit true/1', () => {
    expect(
      isRateLimitEnforced({ [CORTEX_RATE_LIMIT_ENFORCE_ENV]: 'true' })
    ).toBe(true);
    expect(isRateLimitEnforced({ [CORTEX_RATE_LIMIT_ENFORCE_ENV]: '1' })).toBe(
      true
    );
  });
});

describe('rate limiter middleware', () => {
  beforeEach(() => {
    _resetRateTierCacheForTests();
    delete process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV];
  });

  afterEach(() => {
    delete process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV];
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('SHADOW: never touches the response — no headers, no 429, always next() — while counting would-blocks', async () => {
    const limiter = createRateLimiter(makeConfig());
    const labels = { limiter: 'graphql', tier: 'anon' };
    const before = await counterValue(cortexRateLimitWouldBlockTotal, labels);
    const blockedBefore = await counterValue(
      cortexRateLimitBlockedTotal,
      labels
    );

    const next = vi.fn();
    const { res, setHeader, status, json } = makeRes();
    for (let i = 0; i < 4; i += 1) {
      limiter(makeReq(), res, next as NextFunction);
    }

    expect(next).toHaveBeenCalledTimes(4);
    expect(setHeader).not.toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();

    // maxUnauthenticated=2 -> requests 3 and 4 are over-limit.
    expect(
      (await counterValue(cortexRateLimitWouldBlockTotal, labels)) - before
    ).toBe(2);
    // Real-block series must stay untouched in shadow (B01-14).
    expect(
      (await counterValue(cortexRateLimitBlockedTotal, labels)) - blockedBefore
    ).toBe(0);
  });

  it('SHADOW: logs at most once per (bucket, window) — first over-limit only (B01-10)', () => {
    const warnSpy = vi
      .spyOn(logger, 'warn')
      .mockImplementation(() => undefined);
    const limiter = createRateLimiter(makeConfig({ maxUnauthenticated: 1 }));

    const next = vi.fn();
    const { res } = makeRes();
    for (let i = 0; i < 5; i += 1) {
      limiter(makeReq(), res, next as NextFunction);
    }

    const shadowLogs = warnSpy.mock.calls.filter(
      ([message]) =>
        typeof message === 'string' && message.includes('shadow would-block')
    );
    expect(shadowLogs).toHaveLength(1);
  });

  it('ENFORCE: returns 429 + Retry-After when over limit and counts on the blocked series only (B01-14)', async () => {
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    const limiter = createRateLimiter(makeConfig({ maxUnauthenticated: 1 }));
    const labels = { limiter: 'graphql', tier: 'anon' };
    const wouldBefore = await counterValue(
      cortexRateLimitWouldBlockTotal,
      labels
    );
    const blockedBefore = await counterValue(
      cortexRateLimitBlockedTotal,
      labels
    );

    const next = vi.fn();
    const first = makeRes();
    limiter(makeReq(), first.res, next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1);
    expect(first.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '1');

    const second = makeRes();
    limiter(makeReq(), second.res, next as NextFunction);
    expect(next).toHaveBeenCalledTimes(1); // not called again
    expect(second.status).toHaveBeenCalledWith(429);
    expect(second.json).toHaveBeenCalledWith({
      errors: [{ message: 'Too many requests' }],
    });
    const retryAfter = second.setHeader.mock.calls.find(
      ([name]) => name === 'Retry-After'
    );
    expect(retryAfter).toBeDefined();

    expect(
      (await counterValue(cortexRateLimitBlockedTotal, labels)) - blockedBefore
    ).toBe(1);
    expect(
      (await counterValue(cortexRateLimitWouldBlockTotal, labels)) - wouldBefore
    ).toBe(0);
  });

  it('resets the bucket after the window elapses', () => {
    vi.useFakeTimers();
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    const limiter = createRateLimiter(makeConfig({ maxUnauthenticated: 1 }));

    const next = vi.fn();
    limiter(makeReq(), makeRes().res, next as NextFunction);
    const blocked = makeRes();
    limiter(makeReq(), blocked.res, next as NextFunction);
    expect(blocked.status).toHaveBeenCalledWith(429);

    vi.advanceTimersByTime(WINDOW_MS + 1);

    const fresh = makeRes();
    limiter(makeReq(), fresh.res, next as NextFunction);
    expect(fresh.status).not.toHaveBeenCalledWith(429);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('OPTIONS preflights never consume rate budget (B01-11)', () => {
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    const limiter = createRateLimiter(makeConfig({ maxUnauthenticated: 1 }));

    const next = vi.fn();
    for (let i = 0; i < 5; i += 1) {
      limiter(
        makeReq({ method: 'OPTIONS' }),
        makeRes().res,
        next as NextFunction
      );
    }
    // Budget untouched: the first real request is still within limit.
    const real = makeRes();
    limiter(makeReq(), real.res, next as NextFunction);
    expect(real.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(6);
  });

  it('aggregates novel identifiers into a shared overflow bucket past the key cap (B01-12)', () => {
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    const limiter = createRateLimiter(
      makeConfig({ maxUnauthenticated: 1, maxTrackedKeys: 2 })
    );

    const next = vi.fn();
    // Two distinct IPs fill the tracked-key budget.
    limiter(
      makeReq({ ip: '198.51.100.1' }),
      makeRes().res,
      next as NextFunction
    );
    limiter(
      makeReq({ ip: '198.51.100.2' }),
      makeRes().res,
      next as NextFunction
    );

    // Third and fourth novel IPs share the overflow bucket: the fourth is
    // over-limit even though that IP has made only one request.
    const third = makeRes();
    limiter(makeReq({ ip: '198.51.100.3' }), third.res, next as NextFunction);
    expect(third.status).not.toHaveBeenCalled();
    const fourth = makeRes();
    limiter(makeReq({ ip: '198.51.100.4' }), fourth.res, next as NextFunction);
    expect(fourth.status).toHaveBeenCalledWith(429);
  });
});
