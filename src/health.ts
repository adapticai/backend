import { Request, Response, Router } from 'express';
import prisma, { getLastQuerySucceededAt } from './prismaClient';
import { logger } from './utils/logger';

const SERVICE_NAME = 'backend-legacy';

/**
 * Reads the package version from package.json at startup.
 * Falls back to 'unknown' if the version cannot be determined.
 */
function getPackageVersion(): string {
  try {
    const pkg = require('../package.json');
    return pkg.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

const PACKAGE_VERSION = getPackageVersion();

/** Tracks the process start time for uptime calculation */
const startedAt = Date.now();

/** Response shape for the health check endpoint */
interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  database: 'connected' | 'disconnected';
  /** How `database` was decided: a recent completed query, or a probe. */
  databaseCheck: DatabaseCheck;
  /** Seconds since a query last completed on this process, or null if none has. */
  lastQuerySucceededSecondsAgo: number | null;
}

type DatabaseCheck = 'recent-query' | 'probe';

/**
 * How recently a query must have completed for `/health` to accept it as
 * proof the database is answering, without issuing a query of its own.
 *
 * Two heartbeat intervals (30s each) plus slack. The heartbeat runs through the
 * same client, so an idle process still refreshes this; and a saturated pool
 * still completes queries (each is bounded by the 30s statement timeout), so
 * saturation alone does not let it go stale.
 */
export const DB_SUCCESS_FRESHNESS_MS = 75_000;

/**
 * Budget for the fallback probe when no recent success exists. Well under the
 * 10s pool wait so a saturated pool yields an answer inside the platform's
 * probe timeout rather than hanging the request.
 */
export const HEALTH_PROBE_TIMEOUT_MS = 2_000;

/** The one probe query this module may have outstanding on the pool. */
let outstandingProbe: Promise<unknown> | undefined;

/**
 * Probe the live client with `SELECT 1`, giving up after `timeoutMs`.
 *
 * Reads `global.prisma` rather than the module-level import, because the
 * heartbeat's reconnect path replaces `global.prisma` and the import stays
 * pinned to the original (by then disconnected) client.
 *
 * At most one probe query is ever outstanding: a caller that arrives while a
 * previous probe is still queued on the pool waits on that same query instead
 * of adding another waiter, so frequent health checks cannot themselves deepen
 * a saturated pool's queue.
 *
 * @param timeoutMs - How long to wait for the probe before calling it failed.
 * @returns True if the probe completed within the budget.
 */
async function probeLiveClient(timeoutMs: number): Promise<boolean> {
  if (!outstandingProbe) {
    const client = global.prisma ?? prisma;
    outstandingProbe = Promise.resolve(client.$queryRaw`SELECT 1`).finally(
      () => {
        outstandingProbe = undefined;
      }
    );
  }
  const probe = outstandingProbe;

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timedOut = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(false), timeoutMs);
  });
  try {
    return await Promise.race([
      probe.then(
        () => true,
        (dbError: unknown) => {
          logger.warn('Health check: database probe failed', {
            error: dbError instanceof Error ? dbError.message : String(dbError),
          });
          return false;
        }
      ),
      timedOut,
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Decide whether the database is answering this process, without depending
 * on a free pool connection when there is already evidence that it is.
 *
 * A query that completed within {@link DB_SUCCESS_FRESHNESS_MS} is taken as
 * that evidence and no query is issued. Only when there is none (startup, or a
 * database that has stopped answering) does it fall back to a bounded probe.
 *
 * @param now - Current epoch ms (injectable for tests).
 * @returns The database status, how it was decided, and the success age.
 */
export async function checkDatabaseReadiness(
  now: number = Date.now()
): Promise<{
  database: 'connected' | 'disconnected';
  databaseCheck: DatabaseCheck;
  lastQuerySucceededSecondsAgo: number | null;
}> {
  const lastSuccess = getLastQuerySucceededAt();
  const ageMs = lastSuccess === undefined ? undefined : now - lastSuccess;
  if (ageMs !== undefined && ageMs <= DB_SUCCESS_FRESHNESS_MS) {
    return {
      database: 'connected',
      databaseCheck: 'recent-query',
      lastQuerySucceededSecondsAgo: Math.max(0, Math.floor(ageMs / 1000)),
    };
  }

  const answered = await probeLiveClient(HEALTH_PROBE_TIMEOUT_MS);
  // A successful probe goes through the same client extension and refreshes
  // the stamp; report the age as it stands after the probe.
  const after = getLastQuerySucceededAt();
  return {
    database: answered ? 'connected' : 'disconnected',
    databaseCheck: 'probe',
    lastQuerySucceededSecondsAgo:
      after === undefined
        ? null
        : Math.max(0, Math.floor((Date.now() - after) / 1000)),
  };
}

/**
 * Checks database connectivity by issuing a lightweight query.
 * Returns 'connected' or 'disconnected'. Never throws.
 */
async function checkDatabase(): Promise<'connected' | 'disconnected'> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return 'connected';
  } catch (dbError) {
    logger.warn('Health check: database connectivity test failed', {
      error: dbError instanceof Error ? dbError.message : String(dbError),
    });
    return 'disconnected';
  }
}

/**
 * Creates an Express router with health-probe endpoints.
 *
 * - `GET /livez` — Process-only liveness check. Always returns HTTP 200 with
 *   `{ status, service, version, uptime }`. Safe for Cloud Run / Kubernetes
 *   liveness probes since it never touches the database.
 * - `GET /readyz` — Readiness check. Returns HTTP 200 only when the database
 *   is reachable (`SELECT 1`), HTTP 503 otherwise. Suitable for Cloud Run
 *   startup probes and load-balancer readiness.
 * - `GET /health` — Full health snapshot including memory usage and database
 *   status. Returns 503 only when the database has stopped answering this
 *   process: a query that completed within the freshness window counts as
 *   proof without taking a pool connection, so a saturated-but-working pool
 *   reads as healthy. With no recent success it falls back to a bounded
 *   probe (see {@link checkDatabaseReadiness}). Kept for backward
 *   compatibility with existing Railway/uptime checks.
 *
 * All endpoints should be mounted before auth middleware so they remain
 * accessible without authentication.
 */
export function createHealthRouter(): Router {
  const router = Router();

  router.get('/livez', (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'ok',
      service: SERVICE_NAME,
      version: PACKAGE_VERSION,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startedAt) / 1000),
    });
  });

  router.get('/readyz', async (_req: Request, res: Response): Promise<void> => {
    const databaseStatus = await checkDatabase();
    const isReady = databaseStatus === 'connected';
    res.status(isReady ? 200 : 503).json({
      status: isReady ? 'ready' : 'not-ready',
      service: SERVICE_NAME,
      version: PACKAGE_VERSION,
      database: databaseStatus,
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/health', async (_req: Request, res: Response): Promise<void> => {
    const readiness = await checkDatabaseReadiness();
    const databaseStatus = readiness.database;
    const isHealthy = databaseStatus === 'connected';
    const statusCode = isHealthy ? 200 : 503;

    const memoryUsage = process.memoryUsage();

    const body: HealthResponse = {
      status: isHealthy ? 'ok' : 'degraded',
      service: SERVICE_NAME,
      version: PACKAGE_VERSION,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startedAt) / 1000),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      database: databaseStatus,
      databaseCheck: readiness.databaseCheck,
      lastQuerySucceededSecondsAgo: readiness.lastQuerySucceededSecondsAgo,
    };

    res.status(statusCode).json(body);
  });

  return router;
}
