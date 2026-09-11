# Environment Setup Guide

This guide explains how to configure environment variables for the Adaptic backend-legacy service.

## Quick Start

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values (see sections below)

3. Never commit the `.env` file to version control

## Environment Variables Reference

### Required Variables

These variables must be configured for the application to run:

#### Authentication & Security

| Variable                        | Description                                        | Example                                       |
| ------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| `ALLOWED_ORIGINS`               | CORS allowed origins (comma-separated)             | `http://localhost:3000,http://localhost:3001` |
| `JWT_SECRET`                    | Secret key for JWT token generation (min 32 chars) | Generate with `openssl rand -base64 32`       |
| `JWT_SALT`                      | Salt for password hashing (min 32 chars)           | Generate with `openssl rand -base64 32`       |
| `NEXTAUTH_SECRET`               | NextAuth secret (should match JWT_SECRET)          | Same as JWT_SECRET                            |
| `NEXT_PUBLIC_SERVER_AUTH_TOKEN` | Server authentication token for GraphQL            | Custom token string                           |

#### Database

| Variable              | Description                        | Example                                                       |
| --------------------- | ---------------------------------- | ------------------------------------------------------------- |
| `DATABASE_URL`        | Primary database connection URL    | `postgresql://user:pass@localhost:5432/adaptic?schema=public` |
| `DIRECT_DATABASE_URL` | Direct database URL for migrations | `postgresql://user:pass@localhost:5432/adaptic?schema=public` |

#### GraphQL Endpoints

| Variable            | Description                | Example                             |
| ------------------- | -------------------------- | ----------------------------------- |
| `BACKEND_HTTPS_URL` | GraphQL HTTP endpoint      | `http://localhost:4000/graphql`     |
| `BACKEND_WS_URL`    | GraphQL WebSocket endpoint | `ws://localhost:4000/subscriptions` |

### Optional Variables

#### AWS Configuration

Required only if using AWS services (S3, Lambda):

| Variable                   | Description                          |
| -------------------------- | ------------------------------------ |
| `MY_AWS_USERNAME`          | AWS IAM username                     |
| `MY_AWS_PASSWORD`          | AWS IAM password                     |
| `MY_AWS_ACCESS_KEY_ID`     | AWS access key ID                    |
| `MY_AWS_SECRET_ACCESS_KEY` | AWS secret access key                |
| `MY_AWS_REGION`            | AWS region (default: ap-southeast-2) |
| `MY_AWS_ID`                | AWS account ID                       |
| `MY_AWS_ROLE_ARN`          | IAM role ARN for Lambda functions    |
| `MY_AWS_S3_BUCKET`         | S3 bucket name for functions         |

#### Prisma Pulse

| Variable        | Description                                        |
| --------------- | -------------------------------------------------- |
| `PULSE_API_KEY` | Prisma Pulse API key for real-time database events |

#### Railway

Required only for Railway deployments:

| Variable            | Description                  |
| ------------------- | ---------------------------- |
| `RAILWAY_TOKEN`     | Railway authentication token |
| `RAILWAY_API_TOKEN` | Railway API token            |

#### Application

| Variable           | Description           | Default   |
| ------------------ | --------------------- | --------- |
| `GLOBAL_NAMESPACE` | Application namespace | `adaptic` |

#### Observability & Security Toggles

All of the following are read by the server bootstrap at startup. They default
to **on** in production/staging and **off** in development unless an explicit
override is set. See `docs/audits/2026-05-22-readability/README.md` for the
wire-up decisions made during the 2026-05-22 readability sweep.

| Variable                          | Description                                                                            | Default                  |
| --------------------------------- | -------------------------------------------------------------------------------------- | ------------------------ |
| `OTEL_TRACING_ENABLED`            | Enables OpenTelemetry tracing (HTTP, Express, GraphQL instrumentation)                 | `true` in production/staging |
| `OTEL_EXPORTER_OTLP_ENDPOINT`     | OTLP HTTP endpoint for the trace collector                                             | `http://localhost:4318/v1/traces` |
| `OTEL_SERVICE_NAME`               | Service name attached to all spans                                                     | `backend-legacy`         |
| `PROMETHEUS_METRICS_ENABLED`      | Enables Prometheus metrics collection and the `GET /metrics` endpoint                  | `true` in production/staging |
| `APQ_ENABLED`                     | Enables Automatic Persisted Queries (in-memory LRU cache)                              | `true`                   |
| `APQ_MAX_CACHE_SIZE`              | Max APQ cache entries before LRU eviction                                              | `1000`                   |
| `GRAPHQL_COMPLEXITY_ENABLED`      | Enables the query complexity + depth guard plugin                                      | `true` in production/staging |
| `GRAPHQL_MAX_DEPTH`               | Max allowed query depth                                                                | `10`                     |
| `GRAPHQL_MAX_COMPLEXITY_AUTH`     | Max query complexity for authenticated users                                           | `1000`                   |
| `GRAPHQL_MAX_COMPLEXITY_UNAUTH`   | Max query complexity for unauthenticated users                                         | `200`                    |
| `GOOGLE_OAUTH_CLIENT_IDS`         | Comma-separated list of Google OAuth client IDs accepted as Bearer-token audiences. **REQUIRED in production.** Boot fails fast if unset. | (none)                   |

The CORS `ALLOWED_ORIGINS` value is *additive* — the server hardcodes a small
baseline of `localhost:{3000, 3001, 4000}`, `https://adaptic.ai`,
`https://os.adaptic.ai`, and `https://stable.adaptic.ai`, and appends any
comma-separated entries from `ALLOWED_ORIGINS` on top. See `src/server.ts`.

## Local Development Setup

### 1. Generate Secure Secrets

Generate secure random strings for sensitive variables:

```bash
# Generate JWT_SECRET
openssl rand -base64 32

# Generate JWT_SALT
openssl rand -base64 32
```

### 2. Database Setup

For local development with PostgreSQL:

```bash
# Install PostgreSQL (macOS)
brew install postgresql

# Start PostgreSQL
brew services start postgresql

# Create database
createdb adaptic

# Set environment variables
DATABASE_URL="postgresql://localhost:5432/adaptic?schema=public"
DIRECT_DATABASE_URL="postgresql://localhost:5432/adaptic?schema=public"
```

### 3. Run Migrations

```bash
npm run migrate:dev
```

### 4. Start Development Server

```bash
npm run dev
```

## Production Deployment

### Railway Dashboard

1. Go to your Railway project
2. Navigate to Variables tab
3. Add each environment variable individually
4. Ensure `DATABASE_URL` uses Railway's provided PostgreSQL URL
5. Set `DIRECT_DATABASE_URL` for migrations

### GitHub Secrets

For CI/CD workflows:

1. Go to repository Settings → Secrets and variables → Actions
2. Add secrets for sensitive variables:
   - `JWT_SECRET`
   - `JWT_SALT`
   - `DATABASE_URL`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

### Prisma Accelerate

If using Prisma Accelerate:

1. DATABASE_URL format: `prisma://accelerate.prisma-data.net/?api_key=YOUR_API_KEY`
2. DIRECT_DATABASE_URL must still be direct PostgreSQL connection

## Environment-Specific Configuration

### Local Development

```env
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
BACKEND_HTTPS_URL="http://localhost:4000/graphql"
BACKEND_WS_URL="ws://localhost:4000/subscriptions"
DATABASE_URL="postgresql://localhost:5432/adaptic?schema=public"
```

### Development/Staging

```env
ALLOWED_ORIGINS="https://adaptic-dev.netlify.app"
BACKEND_HTTPS_URL="https://adaptic-dev.netlify.app/graphql"
BACKEND_WS_URL="wss://adaptic-dev.netlify.app/subscriptions"
DATABASE_URL="<railway-or-prisma-accelerate-url>"
```

### Production

```env
ALLOWED_ORIGINS="https://app.adaptic.ai,https://adaptic.ai"
BACKEND_HTTPS_URL="https://stable-api.adaptic.ai/graphql"
BACKEND_WS_URL="wss://stable-api.adaptic.ai/subscriptions"
DATABASE_URL="<production-database-url>"
```

## Security Best Practices

1. **Never commit `.env` files**: Always use `.env.example` as template
2. **Use strong secrets**: Minimum 32 characters for JWT secrets
3. **Rotate credentials regularly**: Update secrets periodically
4. **Limit access**: Only provide access to environment variables on a need-to-know basis
5. **Use separate databases**: Different databases for dev/staging/prod
6. **Monitor access**: Track who has access to production secrets

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Regenerate Prisma client
npm run generate
```

### Authentication Errors

Ensure JWT_SECRET and NEXTAUTH_SECRET match and are at least 32 characters.

### GraphQL Endpoint Issues

Verify BACKEND_HTTPS_URL and BACKEND_WS_URL match your deployment environment.

## Additional Resources

- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [Railway Documentation](https://docs.railway.app/develop/variables)
- [NextAuth Configuration](https://next-auth.js.org/configuration/options)
