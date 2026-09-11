// apollo-client.server.ts

// Import types for type‑checking only.
import type {
  ApolloClient as ApolloClientType,
  InMemoryCache as InMemoryCacheType,
  HttpLink as HttpLinkType,
  NormalizedCacheObject,
} from '@apollo/client';

import { ApolloClient, gql, ApolloError } from '@apollo/client/core/core.cjs';
import { split } from '@apollo/client/link/core/core.cjs';
import { setContext } from '@apollo/client/link/context/context.cjs';
import { onError } from '@apollo/client/link/error/error.cjs';
import { HttpLink } from '@apollo/client/link/http/http.cjs';
import { InMemoryCache } from '@apollo/client/cache/inmemory/inMemoryCache.js';

import { logger } from './utils/logger';
// Re‑export the runtime implementations.
export {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  gql,
  ApolloError,
  split,
  setContext,
  onError,
};

// Re‑export the types.
export type {
  ApolloClientType,
  InMemoryCacheType,
  HttpLinkType,
  NormalizedCacheObject,
};

// ─────────────────────────────────────────────────────────────────────────
// HTTP keepalive agent for outgoing fetch (server-side only)
// ─────────────────────────────────────────────────────────────────────────
//
// Without an explicit dispatcher, Node.js's built-in fetch (powered by undici)
// uses a default dispatcher whose connection lifetime defaults are tuned for
// short scripts, NOT long-running services. In long-running engine processes
// this manifests as TCP socket "mushrooming": every GraphQL operation opens
// a fresh TCP+TLS connection, and the kernel's ephemeral-port pool is
// exhausted under sustained load.
//
// Setting a single global undici Agent with `keepAliveTimeout` and a bounded
// `connections` pool ensures sockets are reused across operations and that
// at most N parallel connections per origin are kept alive — typical
// behavior for any production HTTP client. This dramatically reduces TCP
// handshake overhead and prevents the engine→backend-legacy connection
// queue from compounding under load.
//
// Tuning rationale:
// - keepAliveTimeout 30s: idle sockets stay open for 30s before being closed
// - keepAliveMaxTimeout 600s: hard cap on connection age
// - connections 64: max parallel sockets per origin (covers concurrent
//   sessions × ~1 op each, with headroom for bursts)
// - pipelining 1: HTTP/1.1 pipelining (most servers don't support more)
//
// This setup is idempotent and safe to call multiple times — only the first
// call actually configures the dispatcher.

let keepAliveConfigured = false;
let keepAliveConfigurePromise: Promise<void> | undefined;

/**
 * Configure a single global undici dispatcher with persistent keepalive
 * connections for the Node.js process. Call this once during server-side
 * application startup, before any GraphQL operation is made.
 *
 * Idempotent and safe to call multiple times — only the first call actually
 * configures the dispatcher; subsequent calls return the same in-flight or
 * resolved promise so concurrent callers don't double-configure.
 *
 * Browser environments are unaffected — this function only runs on Node.js
 * and bails out early if invoked in a browser context.
 */
export function configureKeepAliveDispatcher(opts?: {
  /** Max parallel sockets per origin. Default: 64. */
  connections?: number;
  /** Idle keep-alive timeout in milliseconds. Default: 30000. */
  keepAliveTimeoutMs?: number;
  /** Hard cap on connection age in milliseconds. Default: 600000 (10 min). */
  keepAliveMaxTimeoutMs?: number;
}): Promise<void> {
  if (keepAliveConfigured) {
    return Promise.resolve();
  }
  if (keepAliveConfigurePromise) {
    return keepAliveConfigurePromise;
  }

  // Server-only: bail in browser bundles.
  if (typeof window !== 'undefined') {
    return Promise.resolve();
  }

  // Use dynamic ESM import (works in both CJS and ESM Node contexts) instead
  // of require(), which fails at runtime when this module is loaded as ESM.
  // Cache the in-flight promise so concurrent callers join the same load.
  keepAliveConfigurePromise = (async () => {
    try {
      const undici = (await import('undici')) as typeof import('undici');

      const dispatcher = new undici.Agent({
        keepAliveTimeout: opts?.keepAliveTimeoutMs ?? 30_000,
        keepAliveMaxTimeout: opts?.keepAliveMaxTimeoutMs ?? 600_000,
        connections: opts?.connections ?? 64,
        pipelining: 1,
      });

      undici.setGlobalDispatcher(dispatcher);
      keepAliveConfigured = true;

      logger.info(
        'Apollo client: undici global keepalive dispatcher configured',
        {
          connections: opts?.connections ?? 64,
          keepAliveTimeoutMs: opts?.keepAliveTimeoutMs ?? 30_000,
          keepAliveMaxTimeoutMs: opts?.keepAliveMaxTimeoutMs ?? 600_000,
        }
      );
    } catch (err) {
      // Undici should always be available alongside Node 18+ but be defensive.
      logger.warn(
        'Apollo client: failed to configure undici keepalive dispatcher',
        {
          error: err instanceof Error ? err.message : String(err),
        }
      );
      // Reset so a future call can retry once the failure cause clears.
      keepAliveConfigurePromise = undefined;
    }
  })();

  return keepAliveConfigurePromise;
}
