// client.ts

import { randomInt } from 'node:crypto';
import { logger } from './utils/logger';

// === Export type definitions (statically) ===
import type {
  ApolloClient as ApolloClientType,
  InMemoryCache as InMemoryCacheType,
  NormalizedCacheObject,
  DefaultOptions,
} from '@apollo/client';

import { HttpLink as HttpLinkType } from '@apollo/client/link/http';

export type {
  ApolloClientType,
  InMemoryCacheType,
  HttpLinkType,
  NormalizedCacheObject,
};

// === Define an interface for the expected runtime exports ===
export interface ApolloModules {
  ApolloClient: typeof import('@apollo/client').ApolloClient;
  InMemoryCache: typeof import('@apollo/client/cache/inmemory/inMemoryCache').InMemoryCache;
  HttpLink: typeof import('@apollo/client/link/http').HttpLink;
  gql: typeof import('@apollo/client').gql;
  ApolloError: typeof import('@apollo/client').ApolloError;
  split: typeof import('@apollo/client').split;
  setContext: typeof import('@apollo/client/link/context').setContext;
  onError: typeof import('@apollo/client/link/error').onError;
  /**
   * Server-only helper: lazily exported only by `apollo-client.server.ts`.
   * The browser variant does not export this and the runtime check above
   * gates the call to `typeof window === 'undefined'`. Returns a Promise so
   * callers can await the dispatcher being installed before issuing the
   * first GraphQL operation.
   */
  configureKeepAliveDispatcher?: (opts?: {
    connections?: number;
    keepAliveTimeoutMs?: number;
    keepAliveMaxTimeoutMs?: number;
  }) => Promise<void>;
}

// === Connection Pool Configuration ===
interface ConnectionPoolConfig {
  maxConcurrentOperations: number;
  retryAttempts: number;
  retryDelay: number;
  connectionTimeout: number;
  /**
   * Maximum depth of the in-memory operation queue. When the queue length
   * reaches this threshold, new first-attempt operations are rejected
   * synchronously with a LOAD_SHEDDING error instead of being enqueued.
   * Retries bypass this check so in-flight work completes.
   *
   * Prevents unbounded queue growth during backend stalls (e.g. Postgres
   * checkpoint I/O pauses on Railway shared volumes): without admission
   * control, 30s+ stalls accumulate hundreds of queued operations that all
   * fire together when the stall clears, saturating the backend event loop
   * and causing a retry storm of cascading 30s client-side timeouts.
   */
  maxQueueDepth: number;
  /**
   * Maximum time (ms) an operation may sit in the queue before executing.
   * If a queued operation waits longer than this on its first attempt, it
   * is rejected with a QUEUE_WAIT_TIMEOUT error instead of firing against
   * a likely-already-overloaded backend. Retries bypass this check.
   *
   * Prevents "zombie" requests that fire long after the caller has
   * given up (engine default is a 30s client fetch timeout): executing
   * them wastes backend capacity on results nobody wants.
   */
  queueWaitTimeoutMs: number;
  /**
   * When true (default), identical QUERY operations that arrive while a
   * prior identical query is still in flight share the same Promise
   * instead of each going through the pool queue independently. Keyed on
   * `operationName + fetchPolicy + stable-stringified variables`.
   *
   * Mutations and subscriptions are never coalesced. Queries with any
   * per-call context override are not coalesced (context can carry
   * auth/headers/behaviour flags). Entries are removed on promise
   * settlement (success OR failure), so the next identical call issues
   * a fresh request — this is pure in-flight dedup, not TTL caching.
   *
   * Measured in Session-1 audit: Agent-2 showed 150-300 findManyTrade/min
   * in production with zero caller-side dedup; 3 independent callers
   * fetching the same `status: ACTIVE` PolicyOverlay list; duplicate
   * health-check fan-out. Coalescing eliminates those duplicates before
   * they consume a pool concurrency slot.
   */
  coalesceInFlightQueries?: boolean;
}

const DEFAULT_POOL_CONFIG: ConnectionPoolConfig = {
  // Lowered from 100 → 50 so this client does not fire more concurrent
  // GraphQL ops than the server-side Prisma pool (production default
  // raised to 35 in prismaClient.ts) can execute without queueing.
  // A 100:20 ratio was producing "DatabaseHealthCheck exhausted retries
  // (3/3)" cascades on Railway adaptic-os/stable where 80 ops queued on
  // a saturated pool and blew the 10s connectionTimeout.
  maxConcurrentOperations: 50,
  retryAttempts: 3, // Number of retry attempts for failed operations
  retryDelay: 1000, // Base delay in ms between retries (will use exponential backoff)
  connectionTimeout: 10000, // Connection timeout in ms
  // Keep a 3× concurrency queue so short spikes don't load-shed.
  maxQueueDepth: 150,
  queueWaitTimeoutMs: 15000, // Drop queued ops that waited > 15s (half of typical 30s fetch timeout)
  coalesceInFlightQueries: true, // Dedup identical queries that overlap in time
};

// === Token Provider Type ===
/**
 * Function type for dynamic token providers.
 * Allows clients to provide tokens dynamically (e.g., from session storage).
 */
export type TokenProvider = () => string | Promise<string>;

// === Internal state ===
let apolloModules: ApolloModules | undefined;
let apolloClient: ApolloClientType<NormalizedCacheObject> | undefined;
let pendingOperations = 0;
const operationQueue: Array<{
  executeWithRetry: () => Promise<void>;
  enqueuedAt: number;
  operationName: string;
}> = [];
let poolConfig: ConnectionPoolConfig = DEFAULT_POOL_CONFIG;
let customTokenProvider: TokenProvider | undefined;

// === Pool observability counters ===
// These are best-effort process-local counters. They are exposed via
// `getPoolStats()` for engine-side Prometheus scraping. Resetting
// categorical counters is not offered — callers that care about deltas
// should sample-then-diff.
const poolCounters = {
  executedTotal: 0,
  rejectedLoadShed: 0,
  rejectedQueueWaitTimeout: 0,
  rejectedNonRetryable: 0,
  retryAttemptsTotal: 0,
  coalescedHitsTotal: 0,
};

// === In-flight query coalescer ===
//
// Map of coalesce-key → shared Promise. When two callers issue the same
// GraphQL query (same operation name, same variables, same fetchPolicy,
// no per-call context override) while the first is still in flight, the
// second caller awaits the same Promise instead of firing a duplicate
// request. This collapses bursts of identical reads — the core finding
// of the Session-1 audit for hot paths like findManyTrade /
// findManyTradingPolicy / findManyPolicyOverlay / getAllAlpacaAccount /
// DatabaseHealthCheck, which Agent-2 measured at 150-300 findManyTrade/min
// in production with ZERO caller-side dedup.
//
// Safety rules:
//   - Mutations are NEVER coalesced (two identical upserts may be
//     intentional; coalescing would merge distinct side-effects).
//   - Subscriptions are NEVER coalesced (ongoing stream, not a one-shot).
//   - Queries with any `context` override are not coalesced (context can
//     carry per-call headers/auth/behaviour; merging is unsafe).
//   - Entries are removed when the Promise settles (success OR failure),
//     so the NEXT identical call issues a fresh request. No staleness
//     window — pure in-flight dedup.
//   - Failure is shared: all coalesced callers receive the same
//     rejection. Correct behaviour — any retry is the caller's
//     responsibility, the pool itself already retries transient classes.
interface InflightEntry {
  promise: Promise<unknown>;
  firstEnqueuedAt: number;
  hits: number;
}
const inflightQueries = new Map<string, InflightEntry>();

/**
 * Deterministic key-only stringify for coalescing.
 *
 * `JSON.stringify` does not sort object keys, so `{a:1,b:2}` and `{b:2,a:1}`
 * produce different strings even though they are the same input from a
 * GraphQL perspective. Sort recursively so order-of-declaration in caller
 * code does not defeat coalescing.
 */
function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return JSON.stringify(value);
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return '[' + value.map(stableStringify).join(',') + ']';
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return (
    '{' +
    keys
      .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
      .join(',') +
    '}'
  );
}

/**
 * Compute the coalesce key for a query, or `null` to bypass coalescing
 * entirely. Callers that return `null` fall through to the normal
 * enqueue path.
 */
function computeCoalesceKey(
  operationName: string,
  options: unknown
): string | null {
  try {
    if (poolConfig.coalesceInFlightQueries === false) return null;
    if (!operationName || operationName === 'anonymous') return null;
    // `options` shape on server is the raw Apollo `QueryOptions`.
    const opts = options as {
      mutation?: unknown;
      query?: unknown;
      variables?: unknown;
      fetchPolicy?: string;
      context?: Record<string, unknown>;
    };
    // Never coalesce mutations. They may have distinct side-effects even
    // with identical inputs (e.g., two retries of the same create).
    if (opts?.mutation) return null;
    // Not a query shape — fail-safe skip.
    if (!opts?.query) return null;
    // Per-call context overrides are unsafe to share (headers, auth,
    // noRetry flag, custom fetchOptions). Conservative skip.
    if (opts.context && Object.keys(opts.context).length > 0) return null;
    const vars = stableStringify(opts.variables ?? null);
    const fp = opts.fetchPolicy ?? 'default';
    return `${operationName}::${fp}::${vars}`;
  } catch {
    return null;
  }
}

// Forward-declare the optional server-only keepalive helper. The actual
// implementation lives in `apollo-client.server.ts` and is loaded only when
// the runtime is Node.js (see loadApolloModules below). This indirection
// keeps the keepalive logic out of browser bundles. Returns a Promise so
// callers can await the dispatcher being installed before issuing requests.
type ConfigureKeepAliveDispatcher = (opts?: {
  connections?: number;
  keepAliveTimeoutMs?: number;
  keepAliveMaxTimeoutMs?: number;
}) => Promise<void>;

/**
 * Dynamically loads the correct Apollo modules based on the runtime environment.
 */
async function loadApolloModules(): Promise<ApolloModules> {
  if (typeof window === 'undefined' || process.env.AWS_EXECUTION_ENV) {
    // Server-side (or Lambda): load the CommonJS‑based implementation.
    return (await import('./apollo-client.server')) as ApolloModules;
  } else {
    // Client-side: load the ESM‑based implementation.
    return (await import('./apollo-client.client')) as ApolloModules;
  }
}

/**
 * Configures the connection pool for Apollo Client.
 * Call this function to customize connection pooling behavior.
 */
export function configureConnectionPool(
  config: Partial<ConnectionPoolConfig>
): void {
  poolConfig = { ...poolConfig, ...config };
  logger.info('Apollo client connection pool configured', {
    poolConfig: JSON.stringify(poolConfig),
  });
}

/**
 * Sets a custom token provider for dynamic authentication.
 * This allows clients to provide tokens from session storage, cookies, etc.
 *
 * @param provider - Function that returns the auth token (sync or async)
 *
 * @example
 * // Using with NextAuth session token
 * setTokenProvider(async () => {
 *   const session = await getSession();
 *   return session?.accessToken || '';
 * });
 */
export function setTokenProvider(provider: TokenProvider): void {
  customTokenProvider = provider;
  // Reset the client so it picks up the new token provider
  if (apolloClient) {
    logger.info(
      'Token provider updated, Apollo client will be recreated on next request'
    );
    apolloClient = undefined;
  }
}

/**
 * Validates that a token looks like a valid JWT.
 * JWTs have three base64url-encoded parts separated by dots.
 */
function isValidJwtFormat(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  // Check that each part is base64url encoded (alphanumeric, -, _, no padding needed)
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => base64UrlRegex.test(part));
}

/**
 * Gets the authentication token with validation.
 * Returns empty string if no valid token is available.
 */
async function getAuthToken(): Promise<string> {
  let token = '';

  // First, try the custom token provider if set
  if (customTokenProvider) {
    try {
      token = await Promise.resolve(customTokenProvider());
    } catch (error) {
      logger.error('[Apollo Client] Error getting token from custom provider', {
        error: String(error),
      });
    }
  }

  // Fall back to environment variables
  if (!token) {
    token =
      process.env.NEXT_PUBLIC_SERVER_AUTH_TOKEN ||
      process.env.SERVER_AUTH_TOKEN ||
      '';
  }

  // Validate the token format
  if (token && !isValidJwtFormat(token)) {
    // Opaque OAuth access tokens (`ya29.…`) are NOT acceptable backend
    // credentials — the backend's `verifyBackendToken` rejects them with
    // `opaque_access_token_rejected`. Refuse to send them so callers see a
    // clear local warning instead of an opaque 401 from the server.
    if (token.startsWith('ya29.')) {
      logger.warn(
        '[Apollo Client] Refusing to send a Google OAuth access token (ya29.…) ' +
          'to the backend. These tokens cannot be verified offline and are ' +
          'rejected by the backend. Use a backend-issued JWT or SERVER_AUTH_TOKEN ' +
          'instead.'
      );
      return '';
    }

    logger.warn(
      '[Apollo Client] Token does not appear to be a valid JWT format. ' +
        'Expected format: header.payload.signature (three base64url-encoded parts). ' +
        'Token will not be sent. Please check your NEXT_PUBLIC_SERVER_AUTH_TOKEN or SERVER_AUTH_TOKEN environment variable.'
    );
    return '';
  }

  return token;
}

/**
 * Processes the operation queue respecting the connection pool limits.
 *
 * Before executing each dequeued operation, this also performs a proactive
 * queue-wait-timeout sweep: any operation that has been waiting longer than
 * `queueWaitTimeoutMs` on its first attempt is rejected inline by its own
 * `executeWithRetry` (attempt === 0 branch) rather than consuming a slot.
 * The sweep runs here (not on a separate timer) because queue pressure
 * almost always clears at the same moment a slot opens up, so the check
 * is cheap and avoids introducing another timer.
 */
function processQueue(): void {
  // Process queue until we reach max concurrent operations or queue is empty
  while (
    pendingOperations < poolConfig.maxConcurrentOperations &&
    operationQueue.length > 0
  ) {
    const entry = operationQueue.shift();
    if (entry) {
      pendingOperations++;
      void entry.executeWithRetry().finally(() => {
        pendingOperations--;
        processQueue(); // Process next item after an operation completes
      });
    }
  }
}

/**
 * Extract the GraphQL operation name from a query or mutation DocumentNode.
 * Returns the name of the first OperationDefinition (e.g. `findManyTrade`,
 * `createOneAlert`) so callers see which operations participate in a retry
 * or timeout cascade. Returns 'anonymous' for unnamed operations and
 * 'unknown' when the document shape is unexpected — never throws, so
 * observability code never degrades the request path.
 */
function extractOperationName(options: unknown): string {
  try {
    const opts = options as {
      query?: { definitions?: ReadonlyArray<unknown> };
      mutation?: { definitions?: ReadonlyArray<unknown> };
    };
    const doc = opts?.query ?? opts?.mutation;
    const defs = doc?.definitions;
    if (!Array.isArray(defs)) return 'unknown';
    for (const def of defs) {
      const d = def as {
        kind?: string;
        name?: { value?: string };
      };
      if (d?.kind === 'OperationDefinition') {
        return d.name?.value ?? 'anonymous';
      }
    }
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Adds an operation to the queue with retry capability.
 *
 * `operationName` is threaded through retries so every log line names the
 * GraphQL operation (e.g. `findManyTrade`, `createManyEquityBar`) that is
 * being retried or rejected. Without it, cascade bursts of 4-17 concurrent
 * timeouts are indistinguishable in logs and root-cause diagnosis is
 * impossible.
 */
/**
 * Classify an error as definitively non-retryable. These errors cost capacity
 * when retried and cannot succeed without the caller changing behaviour:
 *
 * - **Accelerate 1102 "Worker exceeded resource limits"**: the Cloudflare
 *   Worker backing Prisma Accelerate hit its CPU/memory budget. Cloudflare's
 *   guidance is explicit: do not retry — retrying the same shape will hit
 *   the same limit and only inflates worker concurrency across the fleet,
 *   which can trigger broader throttling. Fix is at the caller (smaller
 *   batch, narrower selection, chunked write).
 * - **P2002 unique-constraint violation**: another writer already inserted
 *   the conflicting row. Retrying the same mutation produces the same
 *   failure. Fix is at the caller (idempotent find-or-create, stable
 *   idempotency key, serialized writer).
 * - **P2025 "record not found" race**: a concurrent delete/update removed
 *   the target row. Retrying a delete/update against a vanished row loops.
 * - **GraphQL schema validation / 400 Bad Request**: the query itself is
 *   malformed; retrying guarantees the same 400.
 *
 * Explicit classification avoids the previous pattern where the generic
 * `error.message.includes('Accelerate')` branch treated all Accelerate
 * errors — including 1102 — as retryable, turning a single worker-limit
 * breach into a retry storm that further starved the Accelerate worker
 * pool. See Cloudflare error codes
 * (https://developers.cloudflare.com/workers/observability/errors/#error-1102).
 */
function isDefinitivelyNonRetryable(message: string): boolean {
  return (
    // Accelerate Worker resource-limit errors — never retry
    message.includes('1102') ||
    message.includes('Worker exceeded resource limits') ||
    message.includes('Worker exceeded CPU') ||
    message.includes('Worker exceeded memory') ||
    // Prisma unique-constraint violation — retry just reproduces it
    message.includes('P2002') ||
    message.includes('Unique constraint failed') ||
    // Prisma record-not-found race — deletes/updates already lost the row
    message.includes('P2025') ||
    message.includes('Record to update not found') ||
    message.includes('Record to delete does not exist') ||
    // GraphQL schema / 400 — malformed query, retry is pointless
    message.includes('GRAPHQL_VALIDATION_FAILED') ||
    message.includes('status code 400')
  );
}

async function enqueueOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  attempt = 0
): Promise<T> {
  // Load shedding: reject new (first-attempt) operations when the queue is
  // saturated. This turns a cascading 30s timeout storm during backend
  // stalls into a fast-fail that callers can handle explicitly (e.g. log,
  // retry later, or skip this cycle). Retries bypass this check because
  // they represent in-flight commitments that already consumed backend
  // capacity on the first attempt.
  if (attempt === 0 && operationQueue.length >= poolConfig.maxQueueDepth) {
    poolCounters.rejectedLoadShed++;
    logger.warn(
      `Apollo operation '${operationName}' rejected — queue saturated (${operationQueue.length}/${poolConfig.maxQueueDepth})`,
      {
        operation: operationName,
        queueDepth: operationQueue.length,
        maxQueueDepth: poolConfig.maxQueueDepth,
        pendingOperations,
        maxConcurrentOperations: poolConfig.maxConcurrentOperations,
        category: 'LOAD_SHEDDING',
      }
    );
    return Promise.reject(
      new Error(
        `Apollo operation '${operationName}' rejected: queue saturated (${operationQueue.length}/${poolConfig.maxQueueDepth}). Backend is overloaded.`
      )
    );
  }

  return new Promise((resolve, reject) => {
    const enqueuedAt = Date.now();
    const executeWithRetry = async (): Promise<void> => {
      // Queue-wait timeout: if this operation sat in the queue longer than
      // queueWaitTimeoutMs before a slot opened up, the caller has almost
      // certainly already timed out (engine's default fetch timeout is 30s).
      // Firing the request anyway wastes backend capacity on results nobody
      // is waiting for. Retries bypass this check — they have their own
      // retry-specific delay semantics.
      if (attempt === 0) {
        const waitMs = Date.now() - enqueuedAt;
        if (waitMs > poolConfig.queueWaitTimeoutMs) {
          poolCounters.rejectedQueueWaitTimeout++;
          logger.warn(
            `Apollo operation '${operationName}' dropped — queue wait exceeded ${poolConfig.queueWaitTimeoutMs}ms (waited ${waitMs}ms)`,
            {
              operation: operationName,
              waitMs,
              queueWaitTimeoutMs: poolConfig.queueWaitTimeoutMs,
              queueDepth: operationQueue.length,
              pendingOperations,
              category: 'QUEUE_WAIT_TIMEOUT',
            }
          );
          reject(
            new Error(
              `Apollo operation '${operationName}' dropped: queue wait ${waitMs}ms exceeded ${poolConfig.queueWaitTimeoutMs}ms. Caller likely already timed out.`
            )
          );
          return;
        }
      }

      try {
        const result = await operation();
        poolCounters.executedTotal++;
        resolve(result);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        const isTimeoutLike =
          error instanceof Error &&
          (error.message.includes('aborted due to timeout') ||
            error.message.includes('TimeoutError') ||
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('status code 504'));

        // deleteOne* mutations are naturally idempotent: if the server receives
        // the request and the record exists, it is deleted; a subsequent delete
        // of the same record returns the "record not found" race error that
        // callers already swallow. When a delete TIMES OUT, the Prisma query
        // has almost certainly already run server-side, so retrying issues a
        // second delete that fails with "not found" AND adds load to an
        // already-stressed backend. This creates a retry storm that starves
        // read operations (e.g. getAlpacaAccount) of pool/bandwidth during
        // backend pressure — observed 2026-04-21 blocking equity trade
        // prepareAccountContext (20s cap) across all accounts.
        //
        // Suppressing retries for deleteOne* on timeout/aborted errors: the
        // caller still receives the error and can treat it as success (the
        // engine's database-operations-wrapper already handles this path with
        // idempotent=true).
        const isNonRetryableDelete =
          operationName.startsWith('deleteOne') && isTimeoutLike;

        // Hard non-retry classes: retrying guarantees the same failure AND
        // wastes backend capacity. Cross-check this list against caller-side
        // handling — engine's graphql-error-handler should also treat these
        // as non-retryable so double-wrapped callers don't re-retry.
        const isHardNonRetryable = isDefinitivelyNonRetryable(errorMessage);

        const isRetryable =
          !isNonRetryableDelete &&
          !isHardNonRetryable &&
          error instanceof Error &&
          // Narrowed from the previous broad `includes('Accelerate')`: that
          // matched 1102 (Worker resource-limit) and fed retry storms. Keep
          // only transient Accelerate classes that genuinely benefit from
          // retry (1016 = origin DNS temporarily unresolved, 1033 = worker
          // script temporarily unreachable).
          (error.message.includes('code: 1016') ||
            error.message.includes('code: 1033') ||
            error.message.includes('Accelerate transient') ||
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('ECONNRESET') ||
            error.message.includes('ETIMEDOUT') ||
            error.message.includes('fetch failed') ||
            error.message.includes('socket hang up') ||
            error.message.includes('network') ||
            error.message.includes("Can't reach database server") ||
            error.message.includes('Connection pool timeout') ||
            error.message.includes('P2024') ||
            error.message.includes('terminated') ||
            error.message.includes('aborted due to timeout') ||
            error.message.includes('TimeoutError') ||
            error.message.includes('status code 408') ||
            error.message.includes('status code 502') ||
            error.message.includes('status code 503') ||
            error.message.includes('status code 504'));

        if (isNonRetryableDelete) {
          logger.warn(
            `Apollo mutation '${operationName}' timed out — NOT retrying (server-side delete is idempotent; retry would starve reads)`,
            {
              operation: operationName,
              attempt: attempt + 1,
              error: errorMessage,
              category: 'SUPPRESSED_DELETE_RETRY',
            }
          );
        }

        if (isHardNonRetryable) {
          poolCounters.rejectedNonRetryable++;
          logger.warn(
            `Apollo operation '${operationName}' failed with non-retryable error — NOT retrying (would reproduce same failure or hit resource limit)`,
            {
              operation: operationName,
              attempt: attempt + 1,
              error: errorMessage,
              category: 'NON_RETRYABLE_HARD',
            }
          );
        }

        if (attempt < poolConfig.retryAttempts && isRetryable) {
          // Decorrelated jitter: delay = random_between(retryDelay, base * 3)
          // where base = retryDelay * 2^attempt. This breaks the thundering
          // herd pattern where every op enqueued at the same stall moment
          // retries at the same time (1.5s, 3s, 6s — all in lockstep) and
          // overwhelms the backend the instant it recovers. See AWS
          // architecture blog "Exponential Backoff And Jitter".
          const base = poolConfig.retryDelay * Math.pow(2, attempt);
          const upper = base * 3;
          const lower = poolConfig.retryDelay;
          const delay =
            lower >= upper
              ? upper
              : randomInt(Math.floor(lower), Math.floor(upper) + 1);
          poolCounters.retryAttemptsTotal++;
          logger.warn(
            `Apollo operation '${operationName}' failed, retrying in ${delay}ms (attempt ${attempt + 1}/${poolConfig.retryAttempts})`,
            {
              operation: operationName,
              attempt: attempt + 1,
              maxAttempts: poolConfig.retryAttempts,
              delayMs: delay,
              error: errorMessage,
              category: 'RETRY',
            }
          );
          setTimeout(() => {
            enqueueOperation(operation, operationName, attempt + 1)
              .then(resolve)
              .catch(reject);
          }, delay);
        } else {
          if (isRetryable) {
            logger.warn(
              `Apollo operation '${operationName}' exhausted retries (${poolConfig.retryAttempts}/${poolConfig.retryAttempts})`,
              {
                operation: operationName,
                attempts: poolConfig.retryAttempts,
                error: errorMessage,
                category: 'RETRY_EXHAUSTED',
              }
            );
          }
          reject(error);
        }
      }
    };

    operationQueue.push({ executeWithRetry, enqueuedAt, operationName });
    processQueue();
  });
}

/**
 * Returns a singleton Apollo Client instance with connection pooling.
 * **IMPORTANT:** Because module loading is asynchronous,
 * make sure to await this function before using the client.
 */
export async function getApolloClient(): Promise<
  ApolloClientType<NormalizedCacheObject>
> {
  if (apolloClient) {
    return apolloClient;
  }

  try {
    if (!apolloModules) {
      apolloModules = await loadApolloModules();
    }

    const { ApolloClient, InMemoryCache, HttpLink, setContext, onError } =
      apolloModules;

    // Configure a global undici keepalive dispatcher for Node.js fetch.
    // Without this, Node's built-in fetch opens a fresh TCP socket per
    // request, exhausting the kernel's ephemeral port pool under sustained
    // load (the engine's signature symptom on Railway with many concurrent
    // GraphQL operations). This is server-only — browser bundles see a
    // no-op since `apollo-client.server.ts` is only loaded on Node.js.
    //
    // Awaited so the dispatcher is installed BEFORE the HttpLink below
    // issues its first fetch — otherwise the very first request races the
    // async undici import and goes out on the default (non-keepalive)
    // dispatcher.
    if (typeof window === 'undefined') {
      const serverModule = apolloModules as ApolloModules & {
        configureKeepAliveDispatcher?: ConfigureKeepAliveDispatcher;
      };
      if (typeof serverModule.configureKeepAliveDispatcher === 'function') {
        await serverModule.configureKeepAliveDispatcher();
      }
    }

    // Determine the GraphQL endpoint.
    const isProduction = process.env.NODE_ENV === 'production';
    const httpUrl =
      process.env.NEXT_PUBLIC_BACKEND_HTTPS_URL ||
      process.env.BACKEND_HTTPS_URL ||
      (isProduction
        ? 'https://stable-api.adaptic.ai/graphql'
        : 'http://localhost:4000/graphql');

    // Create the HTTP link. The `fetch` global resolves to Node.js's
    // built-in undici fetch on the server (which now uses the keepalive
    // dispatcher configured above) or the browser's native fetch on the
    // client. Either way, sockets are reused across requests instead of
    // a fresh TCP+TLS handshake per operation.
    //
    // The custom fetch wrapper enforces connectionTimeout via
    // AbortSignal.timeout(). Without this, hung backend responses block
    // the connection pool queue indefinitely — the prior fetchOptions.timeout
    // was not a valid Fetch API option and was silently ignored.
    const timeoutMs = poolConfig.connectionTimeout;
    const fetchWithTimeout: typeof fetch = (input, init) => {
      const timeoutSignal = AbortSignal.timeout(timeoutMs);
      const existingSignal = init?.signal;
      const signal = existingSignal
        ? AbortSignal.any([existingSignal, timeoutSignal])
        : timeoutSignal;
      return fetch(input, { ...init, signal });
    };

    const httpLinkInstance = new HttpLink({
      uri: httpUrl,
      fetch: fetchWithTimeout,
    });

    // Create the auth link with async token retrieval and validation.
    const authLink = setContext(async (request, prevContext) => {
      const headers = prevContext.headers || {};
      // Retrieve and validate the token
      const token = await getAuthToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          connection: 'keep-alive',
        },
      };
    });

    // Create the error handling link with retry logic.
    //
    // Apollo's onError link fires on every error including transient ones
    // that the wrapping retryLink (and the engine-side retry-with-backoff
    // queue at executeWithRetry above) handles automatically. Logging
    // every transient blip at ERROR floods the consumer's error budget
    // and triggers spurious alerts during checkpoint storms / brief
    // network jitter. Demote known transient classes to WARN; reserve
    // ERROR for genuine non-recoverable issues.
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          // Same demotion classes as the formatError handler in server.ts
          // and the prismaClient $on('error') categorizer:
          //   - Delete/update race on already-removed rows -> INFO
          //   - Invalid UUID input from buggy callers -> WARN
          //   - Everything else -> ERROR
          const isExpectedDeleteRace =
            message.includes('No record was found for a delete') ||
            message.includes('No record was found for an update');
          const isInvalidUuidInput =
            message.includes('Error creating UUID') ||
            message.includes('Inconsistent column data: Error creating UUID');

          if (isExpectedDeleteRace) {
            logger.info(
              `[GraphQL expected race]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          } else if (isInvalidUuidInput) {
            logger.warn(
              `[GraphQL invalid UUID input]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          } else {
            logger.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          }
        });
      }
      if (networkError) {
        const errMessage = String(networkError);
        // Network-class transients that the wrapping retry queue at
        // executeWithRetry already handles automatically. Each retry
        // attempt was logging at ERROR, producing 7+ ERROR lines per
        // retry sequence. Demote known transients to WARN; reserve
        // ERROR for non-network failures (TLS handshake, DNS resolve,
        // SSL cert validation).
        const isTransient =
          errMessage.includes('TypeError: fetch failed') ||
          errMessage.includes('TimeoutError') ||
          errMessage.includes('aborted due to timeout') ||
          errMessage.includes('ECONNRESET') ||
          errMessage.includes('ETIMEDOUT') ||
          errMessage.includes('ECONNREFUSED') ||
          errMessage.includes('socket hang up') ||
          errMessage.includes('status code 408') ||
          errMessage.includes('status code 502') ||
          errMessage.includes('status code 503') ||
          errMessage.includes('status code 504');

        if (isTransient) {
          logger.warn(
            `[Network error]: ${errMessage} (transient — caller retry queue will handle)`
          );
        } else {
          logger.error(`[Network error]: ${errMessage}`);
        }
      }
    });

    // Default options with conservative caching and fetch policies
    const defaultOptions: DefaultOptions = {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    };

    // Initialize the Apollo Client with our custom settings
    // Note: Explicitly avoid canonizeResults (deprecated in Apollo Client 3.14+)
    apolloClient = new ApolloClient({
      link: errorLink.concat(authLink.concat(httpLinkInstance)),
      cache: new InMemoryCache({
        // Apollo Client 3.14+ deprecates addTypename option
        // __typename is added automatically by default, no need to specify
        typePolicies: {},
      }),
      defaultOptions,
      devtools: {
        enabled: process.env.NODE_ENV !== 'production',
      },
    });

    // Wrap the client's query and mutate methods to use our connection pool
    const originalQuery = apolloClient.query.bind(apolloClient);
    const originalMutate = apolloClient.mutate.bind(apolloClient);

    apolloClient.query = ((options: Parameters<typeof originalQuery>[0]) => {
      const operationName = extractOperationName(options);
      const coalesceKey = computeCoalesceKey(operationName, options);

      if (coalesceKey) {
        const existing = inflightQueries.get(coalesceKey);
        if (existing) {
          poolCounters.coalescedHitsTotal++;
          existing.hits++;
          // Share the Promise. Apollo's QueryResult is fully serialisable
          // and callers never mutate it; safe to hand to multiple awaiters.
          // Two-step cast because the inflight map is keyed generically;
          // the original call's TVariables/T cannot be preserved across
          // distinct callers (and does not need to be — the result shape
          // is identical for identical queries by construction).
          return existing.promise as unknown as ReturnType<
            typeof originalQuery
          >;
        }

        const promise = enqueueOperation(
          () => originalQuery(options),
          operationName
        );
        inflightQueries.set(coalesceKey, {
          promise,
          firstEnqueuedAt: Date.now(),
          hits: 0,
        });
        // Use .then/.catch symmetric cleanup so it fires regardless of
        // resolution or rejection. Avoids unhandled-rejection warnings
        // that a bare `.finally()` would produce if awaiters have not
        // attached yet when the Promise rejects.
        const cleanup = (): void => {
          inflightQueries.delete(coalesceKey);
        };
        promise.then(cleanup, cleanup);
        return promise as unknown as ReturnType<typeof originalQuery>;
      }

      return enqueueOperation(
        () => originalQuery(options),
        operationName
      ) as unknown as ReturnType<typeof originalQuery>;
    }) as typeof apolloClient.query;

    apolloClient.mutate = (options) => {
      return enqueueOperation(
        () => originalMutate(options),
        extractOperationName(options)
      );
    };

    return apolloClient;
  } catch (error) {
    logger.error('Error initializing Apollo Client', { error: String(error) });
    throw error;
  }
}

/**
 * Returns the underlying runtime exports.
 *
 * **Note:** Because the exports are loaded dynamically,
 * they are not available as named (synchronous) exports from this module.
 */
export async function getApolloModules(): Promise<ApolloModules> {
  if (!apolloModules) {
    apolloModules = await loadApolloModules();
  }
  return apolloModules;
}

/**
 * Lazy client accessor — the connection is only created when this value is first
 * awaited (or used in `Promise.all`). Previously this was `getApolloClient()` which
 * eagerly opened a connection at module-load time, before any pool configuration or
 * auth token provider was set, causing orphaned connections in every process that
 * imported `@adaptic/backend-legacy`.
 *
 * @deprecated Prefer calling `getApolloClient()` directly for explicit lifecycle control.
 */
export const client: PromiseLike<ApolloClientType<NormalizedCacheObject>> = {
  then<TResult1 = ApolloClientType<NormalizedCacheObject>, TResult2 = never>(
    onfulfilled?:
      | ((
          value: ApolloClientType<NormalizedCacheObject>
        ) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined
  ): Promise<TResult1 | TResult2> {
    return getApolloClient().then(onfulfilled, onrejected);
  },
};

/**
 * Snapshot of connection-pool state at the instant `getPoolStats` is called.
 * Exposed so downstream observability (engine's Prometheus registry) can
 * scrape pool depth, pending-op concurrency, retry counters, and rejection
 * categories without having to reach into module-private state.
 */
export interface PoolStats {
  /** Operations currently in flight (post-dequeue, pre-resolution). */
  pendingOperations: number;
  /** Operations waiting in the queue for a concurrency slot. */
  queueDepth: number;
  /** Configured limits at the time of sampling. */
  maxConcurrentOperations: number;
  maxQueueDepth: number;
  queueWaitTimeoutMs: number;
  connectionTimeoutMs: number;
  /** Count of operations whose underlying fetch resolved (success path). */
  executedTotal: number;
  /** Count of first-attempt ops rejected by load-shedding admission control. */
  rejectedLoadShed: number;
  /** Count of ops rejected after queue-wait-timeout at dequeue. */
  rejectedQueueWaitTimeout: number;
  /** Count of ops that failed with a hard non-retryable error class. */
  rejectedNonRetryable: number;
  /** Count of retry attempts fired across all operations. */
  retryAttemptsTotal: number;
  /**
   * Count of query operations satisfied from the in-flight coalescer
   * (i.e. requests that did NOT consume a pool concurrency slot because
   * an identical request was already running). Expected to be large and
   * growing monotonically in a healthy system with hot reads. Ratio
   * `coalescedHitsTotal / (executedTotal + coalescedHitsTotal)` is the
   * coalesce hit rate.
   */
  coalescedHitsTotal: number;
  /** Current size of the in-flight coalescer map (0 when idle). */
  coalescerInflightSize: number;
}

/**
 * Returns a read-only snapshot of pool state for observability.
 * Safe to call on every scrape interval (O(1)).
 */
export function getPoolStats(): PoolStats {
  return {
    pendingOperations,
    queueDepth: operationQueue.length,
    maxConcurrentOperations: poolConfig.maxConcurrentOperations,
    maxQueueDepth: poolConfig.maxQueueDepth,
    queueWaitTimeoutMs: poolConfig.queueWaitTimeoutMs,
    connectionTimeoutMs: poolConfig.connectionTimeout,
    executedTotal: poolCounters.executedTotal,
    rejectedLoadShed: poolCounters.rejectedLoadShed,
    rejectedQueueWaitTimeout: poolCounters.rejectedQueueWaitTimeout,
    rejectedNonRetryable: poolCounters.rejectedNonRetryable,
    retryAttemptsTotal: poolCounters.retryAttemptsTotal,
    coalescedHitsTotal: poolCounters.coalescedHitsTotal,
    coalescerInflightSize: inflightQueries.size,
  };
}

/**
 * Gracefully stops the singleton Apollo Client and releases its resources.
 * Call this during process shutdown to close keep-alive HTTP connections and
 * drain in-flight operations.
 *
 * After calling `stopClient()`, the next call to `getApolloClient()` will
 * create a fresh instance.
 */
export function stopClient(): void {
  if (apolloClient) {
    apolloClient.stop();
    apolloClient = undefined;
    logger.info('Apollo client stopped and resources released');
  }
}
