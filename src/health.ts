import { Request, Response, Router } from 'express';
import prisma from './prismaClient';
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
 *   status. Returns 503 when the database is unreachable. Kept for
 *   backward compatibility with existing Railway/uptime checks.
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
    const databaseStatus = await checkDatabase();
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
    };

    res.status(statusCode).json(body);
  });

  return router;
}
