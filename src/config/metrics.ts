import { timingSafeEqual } from 'node:crypto';
import { Request, Response, Router } from 'express';
import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';
import { logger } from '../utils/logger';

const SERVICE_NAME = 'backend-legacy';

/**
 * Dedicated Prometheus registry for backend-legacy metrics.
 * Using a dedicated registry avoids conflicts with default Node.js metrics
 * that might be registered by other libraries.
 */
export const metricsRegistry = new Registry();
metricsRegistry.setDefaultLabels({ service: SERVICE_NAME });

// ---------------------------------------------------------------------------
// HTTP / GraphQL request metrics
// ---------------------------------------------------------------------------

/** Counts total HTTP requests by method, route, and status code */
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'] as const,
  registers: [metricsRegistry],
});

/** Histogram of HTTP request durations in seconds */
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [metricsRegistry],
});

/** Counts total GraphQL operations by type and name */
export const graphqlOperationsTotal = new Counter({
  name: 'graphql_operations_total',
  help: 'Total number of GraphQL operations',
  labelNames: ['operation_type', 'operation_name', 'status'] as const,
  registers: [metricsRegistry],
});

/** Histogram of GraphQL operation durations in seconds */
export const graphqlOperationDuration = new Histogram({
  name: 'graphql_operation_duration_seconds',
  help: 'Duration of GraphQL operations in seconds',
  labelNames: ['operation_type', 'operation_name'] as const,
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30],
  registers: [metricsRegistry],
});

/** Counts GraphQL errors by operation and error code */
export const graphqlErrorsTotal = new Counter({
  name: 'graphql_errors_total',
  help: 'Total number of GraphQL errors',
  labelNames: ['operation_type', 'operation_name', 'error_code'] as const,
  registers: [metricsRegistry],
});

// ---------------------------------------------------------------------------
// Database metrics
// ---------------------------------------------------------------------------

/** Histogram of Prisma query durations in seconds */
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'model'] as const,
  buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 5],
  registers: [metricsRegistry],
});

/** Gauge for active database connections */
export const dbConnectionsActive = new Gauge({
  name: 'db_connections_active',
  help: 'Number of active database connections (approximate)',
  registers: [metricsRegistry],
});

// ---------------------------------------------------------------------------
// WebSocket / Subscriptions metrics
// ---------------------------------------------------------------------------

/** Gauge for active GraphQL subscriptions */
export const activeSubscriptions = new Gauge({
  name: 'graphql_active_subscriptions',
  help: 'Number of active GraphQL subscriptions',
  registers: [metricsRegistry],
});

/** Gauge for active WebSocket connections */
export const activeWebSocketConnections = new Gauge({
  name: 'websocket_active_connections',
  help: 'Number of active WebSocket connections',
  registers: [metricsRegistry],
});

/**
 * Counts row-level tenancy-scoping decisions for user-scoped principals.
 * Labelled by `mode` (off/shadow/enforce), the governed `model`, the resolver
 * `operation` field, and the `decision` (allow/restrict/deny). In `shadow` mode
 * a non-`allow` decision is the signal proving whether flipping to `enforce`
 * would catch any legitimate platform or engine query.
 */
export const tenancyScopingDecisionsTotal = new Counter({
  name: 'tenancy_scoping_decisions_total',
  help: 'Row-level tenancy-scoping decisions by mode, model, operation, and decision',
  labelNames: ['mode', 'model', 'operation', 'decision'] as const,
  registers: [metricsRegistry],
});

// ---------------------------------------------------------------------------
// Application metrics
// ---------------------------------------------------------------------------

/** Gauge for application uptime in seconds */
const uptimeGauge = new Gauge({
  name: 'app_uptime_seconds',
  help: 'Application uptime in seconds',
  registers: [metricsRegistry],
});

const startedAt = Date.now();

// ---------------------------------------------------------------------------
// Initialization
// ---------------------------------------------------------------------------

/**
 * Determines if metrics collection is enabled.
 * Enabled by default in production/staging; can be explicitly controlled
 * via PROMETHEUS_METRICS_ENABLED env var.
 */
function isMetricsEnabled(): boolean {
  const explicitSetting = process.env.PROMETHEUS_METRICS_ENABLED;
  if (explicitSetting !== undefined) {
    return explicitSetting === 'true' || explicitSetting === '1';
  }
  const env = process.env.NODE_ENV || 'development';
  return env === 'production' || env === 'staging';
}

/**
 * Initializes Prometheus metrics collection.
 *
 * Registers default Node.js metrics (CPU, memory, event loop, GC) and
 * application-specific metrics for HTTP, GraphQL, and database operations.
 *
 * Environment variables:
 * - PROMETHEUS_METRICS_ENABLED: Explicit on/off ('true'/'false'). Defaults to on in production/staging.
 *
 * @returns true if metrics were initialized, false if disabled
 */
export function initMetrics(): boolean {
  if (!isMetricsEnabled()) {
    logger.info('Prometheus metrics collection is disabled', {
      reason:
        'PROMETHEUS_METRICS_ENABLED not set or environment is development',
    });
    return false;
  }

  // Register default Node.js metrics (memory, CPU, event loop lag, etc.)
  collectDefaultMetrics({ register: metricsRegistry });

  // Update uptime gauge periodically
  const UPTIME_UPDATE_INTERVAL_MS = 15000;
  setInterval(() => {
    uptimeGauge.set((Date.now() - startedAt) / 1000);
  }, UPTIME_UPDATE_INTERVAL_MS);

  logger.info('Prometheus metrics initialized');
  return true;
}

// ---------------------------------------------------------------------------
// Express middleware
// ---------------------------------------------------------------------------

/**
 * The label used for a request that matched no route.
 *
 * One bucket, not the path that was asked for.
 */
export const UNMATCHED_ROUTE_LABEL = 'unmatched';

/**
 * The bounded route label for a request.
 *
 * `req.route.path` is the Express route PATTERN, so its value set is bounded by
 * this application's own routing table. `req.path` is not bounded by anything —
 * it is whatever the client asked for. Falling back from the first to the second
 * turns a metric label into an attack surface: every unmatched path a scanner
 * probes becomes a new permanent time series, and the registry grows without
 * limit at the caller's discretion. Production carried 679 distinct values, 130
 * of them probes such as `/wp-config.php` and
 * `/@fs/proc/self/cwd/.config/gcloud/application_default_credentials.json`.
 *
 * A request that matched no route is therefore recorded as a single bucket. The
 * request is still counted, with its method and status; what is discarded is the
 * attacker's choice of string.
 *
 * @param req - The request being recorded.
 * @returns The matched route pattern, or {@link UNMATCHED_ROUTE_LABEL}.
 */
export function routeLabel(req: Pick<Request, 'route'>): string {
  const matched = (req as { route?: { path?: unknown } }).route?.path;
  return typeof matched === 'string' && matched.length > 0
    ? matched
    : UNMATCHED_ROUTE_LABEL;
}

/**
 * Express middleware that records HTTP request metrics.
 * Tracks request count and duration for each method/route/status combination.
 *
 * Should be mounted early in the middleware chain to capture all requests.
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: () => void
): void {
  if (!isMetricsEnabled()) {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start);
    const durationSeconds = durationNs / 1e9;
    const route = routeLabel(req);
    const method = req.method;
    const statusCode = String(res.statusCode);

    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDuration.observe(
      { method, route, status_code: statusCode },
      durationSeconds
    );
  });

  next();
}

// ---------------------------------------------------------------------------
// Apollo Server plugin
// ---------------------------------------------------------------------------

/**
 * Creates an Apollo Server plugin that records GraphQL operation metrics.
 *
 * Tracks:
 * - Operation count by type (query/mutation/subscription) and name
 * - Operation duration
 * - Error count by operation and error code
 *
 * @returns Apollo Server plugin configuration
 */
export function createMetricsPlugin(): {
  requestDidStart: () => Promise<{
    willSendResponse: (requestContext: {
      operationName?: string | null;
      operation?: { operation: string } | null;
      response: {
        body: {
          kind: string;
          singleResult?: {
            errors?: ReadonlyArray<{ extensions?: { code?: string } }>;
          };
        };
      };
    }) => Promise<void>;
  }>;
} {
  return {
    async requestDidStart() {
      const start = process.hrtime.bigint();

      return {
        async willSendResponse(requestContext) {
          const durationNs = Number(process.hrtime.bigint() - start);
          const durationSeconds = durationNs / 1e9;

          const operationName = requestContext.operationName || 'anonymous';
          const operationType =
            requestContext.operation?.operation || 'unknown';

          graphqlOperationDuration.observe(
            { operation_type: operationType, operation_name: operationName },
            durationSeconds
          );

          const responseBody = requestContext.response.body;
          const hasErrors =
            responseBody.kind === 'single' &&
            responseBody.singleResult?.errors &&
            responseBody.singleResult.errors.length > 0;

          if (
            hasErrors &&
            responseBody.kind === 'single' &&
            responseBody.singleResult?.errors
          ) {
            for (const error of responseBody.singleResult.errors) {
              const errorCode =
                error.extensions?.code || 'INTERNAL_SERVER_ERROR';
              graphqlErrorsTotal.inc({
                operation_type: operationType,
                operation_name: operationName,
                error_code: String(errorCode),
              });
            }
            graphqlOperationsTotal.inc({
              operation_type: operationType,
              operation_name: operationName,
              status: 'error',
            });
          } else {
            graphqlOperationsTotal.inc({
              operation_type: operationType,
              operation_name: operationName,
              status: 'success',
            });
          }
        },
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Metrics endpoint
// ---------------------------------------------------------------------------

/**
 * Creates an Express router that exposes Prometheus metrics at GET /metrics.
 *
 * The endpoint returns metrics in Prometheus text exposition format.
 * This should be scraped by a Prometheus server at regular intervals.
 *
 * Note: This endpoint should be protected in production (e.g., by firewall rules
 * or by requiring a bearer token). It is excluded from rate limiting by default.
 */
/**
 * Whether the scrape endpoint requires a bearer token, and which one.
 *
 * Read per request rather than captured at boot so the switch can be turned on
 * without a restart.
 */
function metricsScrapeToken(): string | null {
  const token = process.env.METRICS_SCRAPE_TOKEN;
  return typeof token === 'string' && token.length > 0 ? token : null;
}

/**
 * Whether an `Authorization` header may read the scrape.
 *
 * Returns true when no token is configured, which is the state every existing
 * deployment is in: the gate is inert until an operator sets one, so shipping it
 * breaks no scraper and closing the endpoint stays an operator decision.
 *
 * The comparison is constant-time so a wrong token cannot be discovered a byte
 * at a time from response timing. A length mismatch short-circuits, which is
 * correct — the length is not the secret, the bytes are.
 *
 * @param authorization - The request's `Authorization` header, if any.
 * @param expected - The configured token, or `null` when none is configured.
 */
export function scrapeAuthorized(
  authorization: string | undefined,
  expected: string | null
): boolean {
  if (expected === null) return true;
  const header = authorization ?? '';
  if (!header.startsWith('Bearer ')) return false;
  const presented = Buffer.from(header.slice(7), 'utf8');
  const wanted = Buffer.from(expected, 'utf8');
  return presented.length === wanted.length && timingSafeEqual(presented, wanted);
}

export function createMetricsRouter(): Router {
  const router = Router();

  router.get(
    '/metrics',
    async (req: Request, res: Response): Promise<void> => {
      // Optional bearer gate. Inert until METRICS_SCRAPE_TOKEN is set, so
      // enabling it is an operator decision and no existing scraper breaks by
      // deploying this. When set, the endpoint stops being world-readable.
      //
      // This is defence in depth, not the fix. The endpoint is mounted outside
      // Apollo and outside auth on purpose, and restricting it at the ingress
      // remains the right control; it simply is not in place, and until it is
      // this scrape exposes the service's whole operational posture — request
      // volumes, error rates, and the authorization counters that reveal the
      // checker is running in shadow — to anyone who asks.
      if (!scrapeAuthorized(req.get('authorization'), metricsScrapeToken())) {
        res.status(401).set('WWW-Authenticate', 'Bearer').send('Unauthorized');
        return;
      }
      try {
        const metrics = await metricsRegistry.metrics();
        res.set('Content-Type', metricsRegistry.contentType);
        res.status(200).send(metrics);
      } catch (metricsError) {
        logger.error('Failed to generate metrics', {
          error:
            metricsError instanceof Error
              ? metricsError.message
              : String(metricsError),
        });
        res.status(500).send('Failed to generate metrics');
      }
    }
  );

  return router;
}
