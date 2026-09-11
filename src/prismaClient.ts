import { PrismaClient } from '@prisma/client';
// Note: `@prisma/extension-accelerate` is installed and available for future
// use (per-query `cacheStrategy()` etc.). It is NOT applied here because
// basic pool multiplexing — the primary benefit we want from Accelerate —
// is activated purely by the `prisma://` DATABASE_URL scheme and does not
// require the client extension. Adding the extension would change the
// PrismaClient type surface, forcing casts throughout the audit-logger
// plugin and server context injection. Revisit if we adopt per-query
// caching strategies.
import { logger } from './utils/logger';

/**
 * Define the global type for PrismaClient to use across environments
 */
declare global {
  // This works in both browser and Node.js environments
  var prisma: PrismaClient | undefined;
}

/** Default statement timeout (30s) prevents hung queries from blocking pool slots indefinitely */
const DEFAULT_STATEMENT_TIMEOUT_MS = 30000;

/** Heartbeat interval: how often we verify the DB connection is alive */
const HEARTBEAT_INTERVAL_MS = 30000;

/** Consecutive heartbeat failures before triggering client reconnection */
const MAX_HEARTBEAT_FAILURES = 3;

/** Heartbeat query timeout (5s) — shorter than pool timeout to detect issues early */
const HEARTBEAT_TIMEOUT_MS = 5000;

/**
 * Connection pool size defaults per deployment tier.
 * Can be overridden via the DATABASE_POOL_SIZE environment variable.
 *
 * Production raised from 20 to 35 to give Prisma more headroom against the
 * Apollo client's `maxConcurrentOperations` budget (also lowered to 50 in
 * src/client.ts). Prior 20:100 ratio let 80 concurrent in-flight ops queue
 * on a saturated pool, producing the "DatabaseHealthCheck exhausted retries
 * (3/3)" cascades observed on Railway adaptic-os/stable. No-op for
 * deployments using Prisma Accelerate (prisma:// URL), where pooling is
 * managed at the proxy and this value is ignored.
 */
const POOL_SIZE_DEFAULTS: Record<string, number> = {
  development: 5,
  staging: 10,
  production: 35,
};

/** Connection pool timeout in milliseconds. Configurable via DATABASE_POOL_TIMEOUT_MS. */
const DEFAULT_POOL_TIMEOUT_MS = 10000;

/**
 * Resolves the connection pool size from environment variables or tier defaults.
 *
 * Priority:
 * 1. DATABASE_POOL_SIZE environment variable (explicit override)
 * 2. Tier default based on NODE_ENV (development: 5, staging: 10, production: 20)
 *
 * @returns The resolved connection pool size
 */
function resolvePoolSize(): number {
  const envPoolSize = process.env.DATABASE_POOL_SIZE;
  if (envPoolSize) {
    const parsed = parseInt(envPoolSize, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    logger.warn(
      'Invalid DATABASE_POOL_SIZE value, falling back to tier default',
      {
        value: envPoolSize,
      }
    );
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  return POOL_SIZE_DEFAULTS[nodeEnv] || POOL_SIZE_DEFAULTS.development;
}

/**
 * Resolves the connection pool timeout from environment variables.
 *
 * @returns The resolved pool timeout in milliseconds
 */
function resolvePoolTimeout(): number {
  const envTimeout = process.env.DATABASE_POOL_TIMEOUT_MS;
  if (envTimeout) {
    const parsed = parseInt(envTimeout, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    logger.warn(
      'Invalid DATABASE_POOL_TIMEOUT_MS value, falling back to default',
      {
        value: envTimeout,
      }
    );
  }
  return DEFAULT_POOL_TIMEOUT_MS;
}

/**
 * Constructs a DATABASE_URL with connection pool parameters appended.
 * Prisma uses URL query parameters for pool configuration when using
 * the data proxy / Accelerate.
 *
 * For direct connections (non-Accelerate), pool settings are managed
 * via the connection_limit and pool_timeout query parameters on the
 * database URL.
 *
 * @returns The database URL with pool parameters
 */
/**
 * True when the given DATABASE_URL points to Prisma Accelerate.
 * Accelerate connections use a `prisma://` scheme and handle pooling
 * at the Accelerate proxy; per-connection Postgres timeouts are not
 * valid as URL params in that case.
 */
function isAccelerateUrl(url: string): boolean {
  return url.startsWith('prisma://') || url.startsWith('prisma+postgres://');
}

function buildDatabaseUrl(): string {
  const baseUrl = process.env.DATABASE_URL || '';
  if (!baseUrl) {
    return baseUrl;
  }

  const poolSize = resolvePoolSize();
  const poolTimeout = resolvePoolTimeout();

  // Accelerate path: Accelerate manages pooling itself at the proxy. We do
  // NOT append `statement_timeout` / `idle_in_transaction_session_timeout`
  // because they are Postgres-specific parameters the Accelerate URL
  // parser would reject. Accelerate URLs carry the api_key as a query
  // param; leave them untouched (pool size is controlled via the Accelerate
  // console, not via URL).
  if (isAccelerateUrl(baseUrl)) {
    logger.info(
      'Prisma Accelerate URL detected — pooling managed by Accelerate proxy',
      {
        environment: process.env.NODE_ENV || 'development',
      }
    );
    return baseUrl;
  }

  // Direct Postgres path: append per-connection pool + timeout params.
  const separator = baseUrl.includes('?') ? '&' : '?';

  logger.info('Database connection pool configured', {
    poolSize,
    poolTimeoutMs: poolTimeout,
    environment: process.env.NODE_ENV || 'development',
  });

  const statementTimeoutMs = parseInt(
    process.env.DATABASE_STATEMENT_TIMEOUT_MS ||
      String(DEFAULT_STATEMENT_TIMEOUT_MS),
    10
  );

  return `${baseUrl}${separator}connection_limit=${poolSize}&pool_timeout=${Math.floor(poolTimeout / 1000)}&statement_timeout=${statementTimeoutMs}&idle_in_transaction_session_timeout=${statementTimeoutMs}`;
}

// Create a singleton that works in all environments
if (!global.prisma) {
  const poolSize = resolvePoolSize();

  const client = new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
  });

  // Register event-based log handlers with structured error diagnostics
  client.$on('error' as never, (e: { message: string; timestamp: string }) => {
    const message = e.message || '';

    // Build structured error information for actionable diagnostics
    const errorInfo: Record<string, unknown> = {
      message,
      timestamp: e.timestamp,
      poolSize,
    };

    // Extract Prisma error code (e.g., P2002 unique constraint, P2003 foreign key)
    const prismaCodeMatch =
      message.match(/error code:\s*(P\d+)/i) || message.match(/(P\d{4})/);
    if (prismaCodeMatch) {
      errorInfo.prismaErrorCode = prismaCodeMatch[1];
    }

    // Extract Postgres error code (e.g., 23514 check constraint, 23505 unique)
    const pgCodeMatch = message.match(/(?:error code|code):\s*(\d{5})/);
    if (pgCodeMatch) {
      errorInfo.postgresErrorCode = pgCodeMatch[1];
    }

    // Extract constraint name for violation diagnostics
    const constraintMatch = message.match(/constraint\s+"([^"]+)"/);
    if (constraintMatch) {
      errorInfo.constraintName = constraintMatch[1];
    }

    // Extract model or table name
    const modelMatch = message.match(/(?:model|table|relation)\s+"?(\w+)"?/i);
    if (modelMatch) {
      errorInfo.model = modelMatch[1];
    }

    // Categorize for alerting and triage
    //
    // Two classes of "errors" are expected and handled by the caller and must
    // not pollute ERROR-level logs (they distort error budgets and trigger
    // spurious alerts):
    //
    // 1. "No record was found for a delete/update" — race condition where the
    //    target row was already removed by another worker. Engine callers
    //    handle this gracefully (see crypto-trade-execution-engine.ts and
    //    order-manager.ts deleteTrade()). Demoted to INFO.
    //
    // 2. "Inconsistent column data: Error creating UUID" — caller passed a
    //    non-UUID value to a `String @db.Uuid` column. This is a caller-side
    //    bug; the engine has been hardened to detect synthetic positionIds
    //    upstream (see engine/src/di/options-lifecycle.ts UUID_REGEX guard),
    //    but for any remaining cases, log at WARN with full diagnostics so
    //    callers can be tracked down without flooding ERROR logs.
    const isExpectedDeleteRace =
      message.includes('No record was found for a delete') ||
      message.includes('No record was found for an update');
    const isInvalidUuidInput =
      message.includes('Error creating UUID') ||
      message.includes('Inconsistent column data: Error creating UUID');

    if (isExpectedDeleteRace) {
      errorInfo.category = 'EXPECTED_RACE';
      errorInfo.handledByCaller = true;
      logger.info('Prisma expected race (record already removed)', errorInfo);
    } else if (isInvalidUuidInput) {
      errorInfo.category = 'INVALID_INPUT_FORMAT';
      errorInfo.hint =
        'Caller passed a non-UUID value to a UUID column. Validate inputs upstream.';
      logger.warn('Prisma rejected invalid UUID input', errorInfo);
    } else if (
      message.includes('pool') ||
      message.includes('connection') ||
      message.includes('timeout')
    ) {
      errorInfo.category = 'CONNECTION_POOL';
      logger.error('Database connection pool issue detected', errorInfo);
    } else if (prismaCodeMatch || pgCodeMatch) {
      errorInfo.category = 'DATA_INTEGRITY';
      logger.error('Prisma data integrity error', errorInfo);
    } else {
      errorInfo.category = 'UNKNOWN';
      logger.error('Prisma client error', errorInfo);
    }
  });

  client.$on('warn' as never, (e: { message: string }) => {
    logger.warn('Prisma client warning', { message: e.message });
  });

  // Soft-delete filtering is handled at the application/middleware level
  // via the soft-delete middleware (see src/middleware/soft-delete.ts).
  // Prisma 6 uses client extensions rather than $use() middleware.

  global.prisma = client;
}

// Initialize a singleton PrismaClient with a connection pool that persists across requests
const prisma: PrismaClient = global.prisma;

// ---------------------------------------------------------------------------
// Connection health monitor — detects stale connections before they cause
// query hangs by periodically running a lightweight heartbeat query.
// After MAX_HEARTBEAT_FAILURES consecutive failures, the client is
// disconnected and reconnected to force Prisma to establish fresh connections.
// ---------------------------------------------------------------------------

let heartbeatFailures = 0;
let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
let isReconnecting = false;

async function heartbeat(): Promise<void> {
  if (isReconnecting || !global.prisma) return;

  try {
    const start = Date.now();
    await Promise.race([
      global.prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error('Heartbeat timeout')),
          HEARTBEAT_TIMEOUT_MS
        )
      ),
    ]);
    const latencyMs = Date.now() - start;

    if (heartbeatFailures > 0) {
      logger.info('Database heartbeat recovered', {
        latencyMs,
        previousFailures: heartbeatFailures,
      });
    }
    heartbeatFailures = 0;
  } catch (error) {
    heartbeatFailures++;
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.warn('Database heartbeat failed', {
      consecutiveFailures: heartbeatFailures,
      error: errorMessage,
    });

    if (heartbeatFailures >= MAX_HEARTBEAT_FAILURES) {
      logger.error(
        'Database heartbeat exceeded failure threshold, reconnecting Prisma client',
        {
          consecutiveFailures: heartbeatFailures,
        }
      );
      await reconnectPrisma();
    }
  }
}

async function reconnectPrisma(): Promise<void> {
  if (isReconnecting) return;
  isReconnecting = true;

  try {
    // Disconnect existing client — this drops all pooled connections
    try {
      await Promise.race([
        global.prisma?.$disconnect(),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);
    } catch {
      // Disconnect may fail if DB is unreachable — that's expected
    }

    // Create a fresh client with the same configuration
    const newClient = new PrismaClient({
      log: [
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
      datasources: {
        db: {
          url: buildDatabaseUrl(),
        },
      },
    });

    // Re-register error/warn handlers
    newClient.$on(
      'error' as never,
      (e: { message: string; timestamp: string }) => {
        logger.error('Prisma client error (reconnected)', {
          message: e.message,
          timestamp: e.timestamp,
        });
      }
    );
    newClient.$on('warn' as never, (e: { message: string }) => {
      logger.warn('Prisma client warning (reconnected)', {
        message: e.message,
      });
    });

    global.prisma = newClient;
    heartbeatFailures = 0;
    logger.info('Prisma client reconnected successfully');
  } catch (error) {
    logger.error('Failed to reconnect Prisma client', {
      error: error instanceof Error ? error.message : String(error),
    });
  } finally {
    isReconnecting = false;
  }
}

/**
 * Starts the periodic database heartbeat monitor.
 * Call once during server startup. The returned cleanup function
 * must be called during graceful shutdown.
 */
export function startConnectionHealthMonitor(): () => void {
  if (heartbeatTimer) return () => stopConnectionHealthMonitor();

  logger.info('Starting database connection health monitor', {
    intervalMs: HEARTBEAT_INTERVAL_MS,
    failureThreshold: MAX_HEARTBEAT_FAILURES,
  });

  heartbeatTimer = setInterval(() => {
    void heartbeat();
  }, HEARTBEAT_INTERVAL_MS);

  // Run an initial heartbeat immediately
  void heartbeat();

  return () => stopConnectionHealthMonitor();
}

/**
 * Stops the periodic heartbeat monitor. Safe to call multiple times.
 */
export function stopConnectionHealthMonitor(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = undefined;
    logger.info('Database connection health monitor stopped');
  }
}

/**
 * Disconnects the Prisma client with a timeout to prevent hanging during shutdown.
 * @param timeoutMs - Maximum time to wait for disconnect (default: 5000ms)
 */
export async function disconnectWithTimeout(timeoutMs = 5000): Promise<void> {
  stopConnectionHealthMonitor();

  if (!global.prisma) return;

  try {
    await Promise.race([
      global.prisma.$disconnect(),
      new Promise<void>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(`Prisma disconnect timed out after ${timeoutMs}ms`)
            ),
          timeoutMs
        )
      ),
    ]);
    logger.info('Database connections closed successfully');
  } catch (error) {
    logger.warn('Database disconnect did not complete cleanly', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export default prisma;
