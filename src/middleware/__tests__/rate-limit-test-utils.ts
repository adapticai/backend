import { vi } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Counter } from 'prom-client';
import type { Request, Response } from 'express';
import type { RateLimitConfig } from '../rate-limiter';

/**
 * Shared fixtures for the rate-limiter test files (audit
 * B01-backend-legacy-08). Pure helpers only — each test file remains
 * responsible for setting `process.env.JWT_SECRET` via `vi.hoisted` BEFORE its
 * first import pulls in `config/jwtConfig` (which reads the env at load time).
 */

/** Window used by every test config. */
export const WINDOW_MS = 60_000;

/**
 * Builds a small test limiter config.
 *
 * @param overrides - Field overrides applied over the defaults.
 * @returns A complete {@link RateLimitConfig}.
 */
export function makeConfig(
  overrides: Partial<RateLimitConfig> = {}
): RateLimitConfig {
  return {
    name: 'graphql',
    windowMs: WINDOW_MS,
    maxAuthenticated: 100,
    maxUnauthenticated: 2,
    standardHeaders: true,
    message: { errors: [{ message: 'Too many requests' }] },
    ...overrides,
  };
}

/** A mock Express response with observable spies. */
export interface MockResponse {
  res: Response;
  setHeader: ReturnType<typeof vi.fn>;
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
}

/**
 * Creates a mock response whose header/status/json calls are observable —
 * the shadow contract is proven by these spies staying untouched.
 *
 * @returns The {@link MockResponse}.
 */
export function makeRes(): MockResponse {
  const setHeader = vi.fn();
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  const res = { setHeader, status, json } as unknown as Response;
  return { res, setHeader, status, json };
}

/**
 * Creates a mock request. Defaults to an anonymous POST from a fixed IP.
 *
 * @param overrides - Request field overrides (headers, ip, method, …).
 * @returns A Request usable by the limiter middleware.
 */
export function makeReq(overrides: Record<string, unknown> = {}): Request {
  return {
    method: 'POST',
    headers: {},
    ip: '203.0.113.10',
    socket: { remoteAddress: '203.0.113.10' },
    ...overrides,
  } as unknown as Request;
}

/**
 * Reads the current value of a limiter counter for a label pair.
 *
 * @param counter - The prom-client counter to read.
 * @param labels - The limiter/tier label pair identifying the series.
 * @returns The current value (0 when the series does not exist yet).
 */
export async function counterValue(
  counter: Counter<'limiter' | 'tier'>,
  labels: { limiter: string; tier: string }
): Promise<number> {
  const metric = await counter.get();
  const sample = metric.values.find(
    (v) => v.labels.limiter === labels.limiter && v.labels.tier === labels.tier
  );
  return sample?.value ?? 0;
}

/**
 * Signs a real HS256 user JWT with the ambient `JWT_SECRET` (the same secret
 * `config/jwtConfig` resolved at load), so the tier resolver verifies it.
 *
 * @param sub - Subject claim for the token.
 * @returns A signed JWT string.
 */
export function signUserToken(sub: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be set by the test file before signing');
  }
  return jwt.sign({ sub, roles: ['user'] }, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
}
