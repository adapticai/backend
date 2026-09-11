import { describe, it, expect, afterEach, afterAll, vi } from 'vitest';
import express from 'express';
import cors from 'cors';
import type { AddressInfo } from 'net';
import type { Server } from 'http';

/**
 * Server-mount contract for the /graphql chain (audit B01-backend-legacy-08 /
 * -11, server.ts test gap): with the limiter mounted exactly as in server.ts
 * (after cors(), before body parsing), shadow-mode responses must be
 * byte-identical for an unauthenticated caller exceeding the anon budget — no
 * X-RateLimit-* headers, no 429 — and an enforce-mode 429 must carry CORS
 * headers so browser clients can read Retry-After.
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
import { makeConfig } from './rate-limit-test-utils';

describe('server-mount contract: /graphql chain with cors (integration)', () => {
  let server: Server | undefined;

  afterEach(() => {
    delete process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV];
  });

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve) => server?.close(() => resolve()));
    }
  });

  it('shadow responses are byte-identical (no X-RateLimit headers, no 429) and enforce-mode 429s carry CORS headers', async () => {
    _resetRateTierCacheForTests();
    const maxUnauthenticated = 3;
    const limiter = createRateLimiter(
      makeConfig({ maxUnauthenticated, name: 'graphql' })
    );

    const app = express();
    // Mirror server.ts: cors() BEFORE the limiter in the /graphql chain.
    app.use(
      '/graphql',
      cors({ origin: true, credentials: true }),
      limiter,
      express.json(),
      (_req, res) => {
        res.json({ data: { ok: true } });
      }
    );
    server = app.listen(0);
    const { port } = server.address() as AddressInfo;
    const url = `http://127.0.0.1:${port}/graphql`;

    // SHADOW: exceed the anon budget; every response must be a plain 200 with
    // zero rate-limit surface.
    for (let i = 0; i < maxUnauthenticated + 3; i += 1) {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{}',
      });
      expect(resp.status).toBe(200);
      expect(resp.headers.get('x-ratelimit-limit')).toBeNull();
      expect(resp.headers.get('x-ratelimit-remaining')).toBeNull();
      expect(resp.headers.get('retry-after')).toBeNull();
    }

    // ENFORCE: the bucket is already exhausted; the 429 must carry CORS
    // headers so browser clients can read Retry-After.
    process.env[CORTEX_RATE_LIMIT_ENFORCE_ENV] = 'true';
    const blocked = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'https://stable.adaptic.ai',
      },
      body: '{}',
    });
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).not.toBeNull();
    expect(blocked.headers.get('access-control-allow-origin')).not.toBeNull();
  });
});
