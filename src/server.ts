import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

// IMPORTANT: tracing initialization must happen before any other instrumented
// import is loaded. `initTracing()` is a no-op unless `OTEL_TRACING_ENABLED=true`
// (or NODE_ENV ∈ {production, staging}), so this remains safe in development.
// See: src/config/tracing.ts and docs/ENVIRONMENT_SETUP.md.
import { initTracing, shutdownTracing } from './config/tracing';
initTracing();

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildSchema } from 'type-graphql';
import { GraphQLError } from 'graphql';
import { resolvers } from './generated/typegraphql-prisma';
import {
  OptionsGreeksHistoryCustomResolver,
  TradingSettingsResolver,
} from './resolvers/custom';
import { createServer } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { authMiddleware } from './middleware/auth';
import { graphqlRateLimiter, authRateLimiter } from './middleware/rate-limiter';
import { createAuditLogPlugin } from './middleware/audit-logger';
import { createTenancyScopingMiddleware } from './middleware/tenancy-scoping';
import { cortexAuthChecker } from './auth/cortex-auth-checker';
import { applyCortexAuthorizationMap } from './auth/authorization-map';
import { createHttpStatusMapperPlugin } from './plugins/http-status-mapper';
import { createValidationPlugin } from './middleware/graphql-validation-plugin';
import { createQueryComplexityPlugin } from './middleware/query-complexity';
import {
  initMetrics,
  metricsMiddleware,
  createMetricsPlugin,
  createMetricsRouter,
} from './config/metrics';
import { createAPQCache, isAPQEnabled } from './config/persisted-queries';
import prisma, {
  startConnectionHealthMonitor,
  disconnectWithTimeout,
} from './prismaClient';
import { createHealthRouter } from './health';
import { logger } from './utils/logger';
import {
  verifyBackendToken,
  AuthError,
  assertGoogleAudienceConfiguredForProd,
  type BackendPrincipal,
} from './auth/token-verifier';
import {
  recordShadowAuthMiss,
  recordAuthContextOutcome,
  extractOperationName,
  extractOperationNameFromArgs,
  extractHeaderIdentityFromWsExtra,
  headerToString,
} from './auth/graphql-auth-shadow';

import { Request } from 'express';
import { CorsOptions } from 'cors';
import { JwtPayload } from 'jsonwebtoken';

/** Represents the decoded user payload attached to authenticated requests */
interface AuthUser {
  sub?: string;
  name?: string;
  role?: string;
  provider?: string;
  token?: string;
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload | AuthUser | string;
}

/**
 * Adapt a verified `BackendPrincipal` to the legacy `user` context shape used
 * by downstream resolvers and audit plugins (`{ sub, role, roles? }`).
 *
 * The server-kind principal is materialised as `{ sub: 'server', role: 'server' }`
 * for compatibility with the historical `audit-logger` middleware that checks
 * `context.user?.role === 'server'`.
 */
function principalToUser(principal: BackendPrincipal): AuthUser {
  switch (principal.kind) {
    case 'server':
      return { sub: 'server', name: 'Server Auth', role: 'server' };
    case 'admin':
      return {
        sub: principal.sub,
        role: 'admin',
        // Preserve the email if Google or our JWT provided one.
        ...(principal.email ? { name: principal.email } : {}),
      };
    case 'user':
      // Surface the highest-privilege role string for legacy consumers that
      // expect `role` to be a single value (default to "user").
      return {
        sub: principal.sub,
        role:
          principal.roles.find((r) => r !== 'user') ??
          principal.roles[0] ??
          'user',
        ...(principal.email ? { name: principal.email } : {}),
      };
  }
}

/**
 * Default number of proxy hops trusted for X-Forwarded-For resolution when
 * `TRUST_PROXY` is unset. One hop matches a single fronting LB/ingress proxy;
 * operators must set `TRUST_PROXY` to the exact hop count of their deployment
 * (audit B01-backend-legacy-02 / -12).
 */
const DEFAULT_TRUST_PROXY_HOPS = 1;

const startServer = async () => {
  // Boot-time invariant: in production, `GOOGLE_OAUTH_CLIENT_IDS` must be set.
  // Without it, no Google ID token can be safely verified — and the verifier
  // would surface a per-request `misconfigured` error indefinitely. Refuse to
  // boot with broken identity configuration.
  assertGoogleAudienceConfiguredForProd();

  // Prometheus metrics initialization. No-op unless `PROMETHEUS_METRICS_ENABLED`
  // is on (defaults on in production/staging). Registers default Node.js metrics
  // and starts the uptime gauge ticker. See: src/config/metrics.ts.
  initMetrics();

  // CORTEX-P0-001 phase 2 (audit B01-backend-legacy-03): decorate generated
  // CRUD resolvers with @Authorized() — full coverage on the 5 investor-relations
  // models, delete mutations elsewhere — so the authChecker below actually
  // executes. Must run BEFORE buildSchema (decorators land in TypeGraphQL's
  // metadata storage). The checker stays SHADOW-FIRST: would-denies are logged
  // + counted but ALLOWED until CORTEX_AUTHCHECKER_ENFORCE is flipped on.
  // The boot log satisfies audit B01-backend-legacy-07: a zero decorated-action
  // count means the checker is unreachable and its metrics are meaningless.
  const authzSummary = applyCortexAuthorizationMap();
  logger.info(
    '[cortex-authz] applied @Authorized coverage (authChecker in shadow unless CORTEX_AUTHCHECKER_ENFORCE)',
    {
      fullCoverageModels: authzSummary.fullCoverageModels,
      deleteCoverageModels: authzSummary.deleteCoverageModels,
      decoratedActions: authzSummary.decoratedActions,
      skippedActions: authzSummary.skippedActions.length,
    }
  );

  const schema = await buildSchema({
    resolvers: [
      ...resolvers,
      OptionsGreeksHistoryCustomResolver,
      TradingSettingsResolver,
    ],
    validate: false,
    // Row-level tenancy scoping (SP2-G7 / SOC2). Applies ONLY to user-scoped
    // principals on the tenancy + notification models; service/admin principals
    // and unauthenticated callers are bypassed in every mode. Gated by
    // `TENANCY_SCOPING_MODE` (default `shadow`).
    globalMiddlewares: [createTenancyScopingMiddleware()],
    // Resolver-level authorization (CORTEX-P0-001). Invoked for the
    // `@Authorized()`-decorated fields applied by applyCortexAuthorizationMap
    // above. SHADOW-FIRST: while `CORTEX_AUTHCHECKER_ENFORCE` is OFF (default),
    // it observes + counts would-deny operations but always allows —
    // byte-identical live behaviour until enforcement is flipped on.
    authChecker: cortexAuthChecker,
  });

  const app = express();
  const httpServer = createServer(app);

  // Trust the load-balancer proxy chain so `req.ip` resolves the CLIENT address
  // from X-Forwarded-For instead of the proxy hop (audit B01-backend-legacy-02).
  // Without this, every external caller shares one rate-limit bucket per tier,
  // invalidating the shadow signal and making any future enforce flip an outage
  // switch for the whole /graphql surface. `TRUST_PROXY` accepts a hop count
  // (recommended: the EXACT number of proxy hops, so a spoofed X-Forwarded-For
  // cannot mint arbitrary identifiers — audit B01-backend-legacy-12) or an
  // Express trust-proxy string (CIDR / preset). Defaults to 1 hop.
  const rawTrustProxy = (process.env.TRUST_PROXY ?? '').trim();
  const trustProxy: number | string =
    rawTrustProxy === ''
      ? DEFAULT_TRUST_PROXY_HOPS
      : /^\d+$/.test(rawTrustProxy)
        ? parseInt(rawTrustProxy, 10)
        : rawTrustProxy;
  app.set('trust proxy', trustProxy);

  // HTTP request metrics — must be mounted early to capture every request.
  // The middleware is a no-op when metrics are disabled.
  app.use(metricsMiddleware);

  // Rate limiting (CORTEX-P0-001). SHADOW-FIRST: while `CORTEX_RATE_LIMIT_ENFORCE`
  // is OFF (default), the limiters observe + count requests that WOULD be blocked
  // but never touch the response, so live behaviour is byte-identical. The
  // GraphQL limiter is mounted INSIDE the /graphql chain after cors() (see below)
  // so an enforce-mode 429 carries CORS headers and browser clients can read the
  // Retry-After instead of seeing an opaque CORS failure
  // (audit B01-backend-legacy-11). Mounted before `/api` auth so limiting
  // precedes the (more expensive) auth work.
  app.use('/api', authRateLimiter);

  app.use('/api', (req, res, next) =>
    authMiddleware(req as AuthenticatedRequest, res, next)
  );

  // APQ cache: in-memory LRU, gated by `APQ_ENABLED` (default on). The
  // Apollo Server option only accepts a value when a cache is provided;
  // omit the option when APQ is disabled rather than passing `false` so
  // Apollo's default in-memory cache can take over if needed.
  const apqCache = createAPQCache();

  const server = new ApolloServer({
    schema,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      createAuditLogPlugin(),
      createHttpStatusMapperPlugin(),
      // Validation plugin — runs on `didResolveOperation` and rejects
      // mutations whose input variables fail pattern-based validation
      // (percentages, positive numbers, non-empty strings).
      createValidationPlugin(),
      // Query complexity + depth guard. No-op unless
      // `GRAPHQL_COMPLEXITY_ENABLED` is on (defaults on in production /
      // staging). Tunable via `GRAPHQL_MAX_DEPTH`,
      // `GRAPHQL_MAX_COMPLEXITY_AUTH`, `GRAPHQL_MAX_COMPLEXITY_UNAUTH`.
      createQueryComplexityPlugin(schema),
      // GraphQL operation metrics (count, duration, error counts).
      // No-op when metrics are disabled.
      createMetricsPlugin(),
    ],
    ...(apqCache && isAPQEnabled()
      ? { persistedQueries: { cache: apqCache } }
      : {}),
    formatError: (err) => {
      const message = err.message || '';

      // Demote known caller-handled / caller-side error patterns to lower
      // log levels so they don't pollute ERROR logs and trigger spurious
      // alerts. The Prisma client error categorizer in prismaClient.ts also
      // demotes these on the raw client side; this mirror keeps the
      // GraphQL-formatted error consistent.
      const isExpectedDeleteRace =
        message.includes('No record was found for a delete') ||
        message.includes('No record was found for an update');
      const isInvalidUuidInput =
        message.includes('Error creating UUID') ||
        message.includes('Inconsistent column data: Error creating UUID');

      if (isExpectedDeleteRace) {
        logger.info('GraphQL expected race (record already removed)', {
          graphqlError: err,
        });
      } else if (isInvalidUuidInput) {
        logger.warn('GraphQL rejected invalid UUID input', {
          graphqlError: err,
        });
      } else {
        logger.error('GraphQL Error', { graphqlError: err });
      }

      if (message.includes("Can't reach database server")) {
        logger.warn('Database unreachable', { graphqlError: err });
      }

      // Surface the verifier's `reason` enum on UNAUTHENTICATED responses so
      // operators (and the web app's network tab) can diagnose auth failures
      // without grepping Railway logs. The reason is one of a finite set —
      // `malformed | expired | bad_signature | bad_audience |
      // opaque_access_token_rejected | misconfigured` — and carries no
      // sensitive data (no token bytes, no claim values). Whitelisted to
      // UNAUTHENTICATED so we do not accidentally leak a `reason` field
      // attached to any other error class. See CORTEX-2026-05-12 auth-debug
      // change log.
      const code = err.extensions?.code || 'INTERNAL_SERVER_ERROR';
      const reasonValue = err.extensions?.reason;
      const includeReason =
        code === 'UNAUTHENTICATED' && typeof reasonValue === 'string';

      return {
        message: err.message,
        locations: err.locations,
        path: err.path,
        extensions: {
          code,
          ...(includeReason ? { reason: reasonValue } : {}),
        },
      };
    },
  });

  await server.start();

  // Health check endpoint - mounted before Apollo middleware so it's not behind GraphQL or auth
  app.use(createHealthRouter());

  // Prometheus metrics endpoint — GET /metrics returns metrics in the
  // Prometheus text exposition format. Mounted outside of Apollo and auth
  // so a scraper can pull metrics without a Bearer token. In production
  // this endpoint should be protected via firewall / Cloud Run ingress
  // rules rather than at the application layer. No-op response if
  // `PROMETHEUS_METRICS_ENABLED` is off (the registry is simply empty).
  app.use(createMetricsRouter());

  // Configure CORS with allowed origins
  const defaultOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
    'https://adaptic.ai',
    'https://os.adaptic.ai',
    'https://stable.adaptic.ai',
  ];
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];
  const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    maxAge: 86400, // 24h preflight cache
  };

  app.use(
    '/graphql',
    cors<Request>(corsOptions),
    // After cors() so enforce-mode 429s carry CORS headers; before body parsing
    // so limiting stays cheap. OPTIONS preflights are skipped inside the
    // limiter (audit B01-backend-legacy-11).
    graphqlRateLimiter,
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        // Ensure we're using the global prisma instance and never disconnecting it between requests
        if (!global.prisma) {
          logger.warn(
            'Prisma client not found in global scope, reinitializing'
          );
          global.prisma = prisma;
        }

        // Extract token from Authorization header
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice('Bearer '.length).trim()
          : '';

        // When NO token is presented, fall through with `user: null`. The
        // `AuthChecker` introduced in CORTEX-P0-001 will reject any operation
        // that requires a principal; this contract preserves the current
        // unauthenticated-public-query path until P0-001 lands.
        if (!token) {
          // Shadow-observe the would-deny WITHOUT blocking: this null-principal
          // request is exactly what a principal-required enforcement flip would
          // reject. Counting + (throttled) logging it here is how we measure the
          // enforcement blast radius in production before ever flipping it.
          // See src/auth/graphql-auth-shadow.ts and
          // docs/security/2026-08-23-graphql-auth-enforcement-runbook.md.
          const rawBody: unknown = req.body;
          recordShadowAuthMiss({
            transport: 'http',
            operationName: extractOperationName(rawBody),
            origin: headerToString(req.headers.origin),
            ip: req.ip,
            userAgent: headerToString(req.headers['user-agent']),
            authHeaderPresent: authHeader.length > 0,
          });
          return { prisma: global.prisma, req, user: null, principal: null };
        }

        // Verify the bearer token through the SINGLE typed entry point. There
        // is no prefix shortcut (ya29.…), no parallel path, and no silent
        // downgrade to an unverified principal on failure.
        try {
          const principal = await verifyBackendToken(token);
          recordAuthContextOutcome('http', 'authenticated');
          return {
            prisma: global.prisma,
            req,
            user: principalToUser(principal),
            // The typed principal is consumed by the tenancy-scoping middleware
            // to distinguish user-scoped callers (scoped) from server/admin
            // callers (never scoped).
            principal,
          };
        } catch (e) {
          const reason = e instanceof AuthError ? e.reason : 'bad_signature';
          // Already rejected today (HTTP 401). Counted only to complete the
          // shadow denominator alongside authenticated / no_principal outcomes.
          recordAuthContextOutcome('http', 'invalid_token');
          logger.warn('GraphQL HTTP auth rejected', { reason });
          // Throw `UNAUTHENTICATED` so Apollo's HTTP transport returns a
          // GraphQL-shaped error response. The `formatError` hook above
          // preserves the `code` extension.
          //
          // `extensions.http.status: 401` is essential and easy to miss:
          // when `context()` throws, Apollo Server takes the
          // `errorResponse` path (ApolloServer.js#executeHTTPGraphQLRequest
          // catch block) which BYPASSES the request pipeline entirely —
          // willSendResponse plugins do not fire. The only mechanism left
          // for setting the HTTP status is `extensions.http.status` on the
          // thrown error itself, which `normalizeAndFormatErrors` lifts
          // into the response head and then strips from the body so it does
          // not leak. Without this, every auth failure ships as HTTP 500,
          // and Apollo Client's observable pipeline crashes on the 5xx +
          // GraphQL-body combination (`Cannot read properties of undefined
          // (reading 'write')`), leaving consumer `await client.query(...)`
          // promises that neither resolve nor reject — which is precisely
          // how /configure/trading-policy ended up locked in a permanent
          // loading state.
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              reason,
              http: { status: 401 },
            },
          });
        }
      },
    })
  );

  // Custom error handling middleware for express
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      logger.error('Express error', { error: err.message, stack: err.stack });
      res.status(500).json({ error: 'An internal server error occurred' });
    }
  );

  app.use((req, res, next) => {
    logger.debug('Incoming request', { method: req.method, url: req.url });
    next();
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
  });

  useServer(
    {
      schema,
      context: async (ctx, _msg, args) => {
        // Ensure we're using the global prisma instance for WebSocket connections too
        if (!global.prisma) {
          logger.warn(
            'Prisma client not found in global scope for WebSocket context, reinitializing'
          );
          global.prisma = prisma;
        }

        const authHeader =
          (ctx.connectionParams as { authorization?: string })?.authorization ||
          '';
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice('Bearer '.length).trim()
          : '';

        // No token presented -> deliver a null-user context. The AuthChecker
        // landing in CORTEX-P0-001 will reject any subscription that requires
        // a principal. Until then, public subscriptions continue to work.
        if (!token) {
          // Shadow-observe the would-deny WITHOUT blocking — the WebSocket
          // parallel of the HTTP path. Operation name is best-effort from
          // ExecutionArgs; origin / user-agent / IP come from the upgrade
          // request carried on ctx.extra.
          const wsIdentity = extractHeaderIdentityFromWsExtra(ctx.extra);
          recordShadowAuthMiss({
            transport: 'ws',
            operationName: extractOperationNameFromArgs(args),
            origin: wsIdentity.origin,
            ip: wsIdentity.ip,
            userAgent: wsIdentity.userAgent,
            authHeaderPresent: authHeader.length > 0,
          });
          return { prisma: global.prisma, user: null, principal: null };
        }

        // Verify the bearer token via the single typed entry point.
        // Any verification failure THROWS — graphql-ws closes the connection
        // when the context callback throws, instead of silently downgrading
        // to a degraded `authError` context that quietly delivered messages
        // to an unauthenticated socket.
        try {
          const principal = await verifyBackendToken(token);
          recordAuthContextOutcome('ws', 'authenticated');
          return {
            prisma: global.prisma,
            user: principalToUser(principal),
            principal,
          };
        } catch (e) {
          const reason = e instanceof AuthError ? e.reason : 'bad_signature';
          // Already rejected today (connection closed). Counted only to complete
          // the shadow denominator alongside authenticated / no_principal.
          recordAuthContextOutcome('ws', 'invalid_token');
          logger.warn('WebSocket auth rejected — closing connection', {
            reason,
          });
          // graphql-ws closes the connection rather than producing an HTTP
          // response, so `extensions.http.status` is irrelevant here — but
          // we include it for symmetry with the HTTP context above. Any
          // future code that funnels a WS-rejected GraphQLError back into
          // an HTTP response (e.g. a graceful-degrade fallback) will get
          // the correct status without further changes.
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              reason,
              http: { status: 401 },
            },
          });
        }
      },
    },
    wsServer
  );

  // Start the periodic database connection health monitor
  startConnectionHealthMonitor();

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    logger.info('Server ready', {
      graphql: `http://localhost:${PORT}/graphql`,
      health: `http://localhost:${PORT}/health`,
    });
    logger.info('Subscriptions ready', {
      endpoint: `ws://localhost:${PORT}/subscriptions`,
    });
  });

  // --- Graceful shutdown ---
  // Sequence: stop accepting connections → drain in-flight requests →
  // close WebSocket → disconnect DB → flush traces → exit
  let isShuttingDown = false;
  const SHUTDOWN_TIMEOUT_MS = 15000;

  async function gracefulShutdown(signal: string): Promise<void> {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`Received ${signal}, starting graceful shutdown`);

    // Force exit if shutdown takes too long
    const forceExitTimer = setTimeout(() => {
      logger.error('Graceful shutdown timed out, forcing exit');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS);
    forceExitTimer.unref();

    try {
      // 1. Stop accepting new HTTP connections
      await new Promise<void>((resolve) => {
        httpServer.close(() => {
          logger.info('HTTP server closed');
          resolve();
        });
      });

      // 2. Close WebSocket server (rejects new WS connections)
      await new Promise<void>((resolve) => {
        wsServer.close(() => {
          logger.info('WebSocket server closed');
          resolve();
        });
      });

      // 3. Apollo Server drain is handled by ApolloServerPluginDrainHttpServer

      // 4. Stop health monitor and disconnect DB with timeout
      await disconnectWithTimeout(5000);

      // 5. Flush OpenTelemetry traces
      await shutdownTracing();

      logger.info('Graceful shutdown complete');
    } catch (error) {
      logger.error('Error during graceful shutdown', {
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      clearTimeout(forceExitTimer);
      process.exit(0);
    }
  }

  process.on('SIGINT', () => {
    void gracefulShutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void gracefulShutdown('SIGTERM');
  });
};

startServer().catch((error) => {
  logger.error('Error starting the server', {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, _promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
});
