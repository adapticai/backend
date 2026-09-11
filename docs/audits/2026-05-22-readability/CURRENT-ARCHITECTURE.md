# @adaptic/backend-legacy - Current Architecture

**Package:** @adaptic/backend-legacy v0.0.43
**Registry:** NPM (published)
**Language:** TypeScript (strict mode)
**Target:** ES2018
**Last Audit:** 2026-02-08

---

## Overview

backend-legacy is the core data layer and GraphQL API for the Adaptic platform. It provides the canonical type definitions, CRUD operations, and database access consumed by `@adaptic/engine`, `@adaptic/utils`, and other packages in the monorepo.

---

## Build Status

**PASSING** - All 8 pipeline steps succeed (verified 2026-02-08):

```
clean -> generate -> fix-imports -> generate:selections -> generate:functions -> generate:strings -> tsc -> build:server
```

**Wave 1 Completion (2026-02-08):** 674 TypeScript compilation errors fixed, build now passes cleanly.

---

## Core Technology Stack

| Layer             | Technology         | Version               |
| ----------------- | ------------------ | --------------------- |
| HTTP Server       | Express            | 4                     |
| GraphQL           | Apollo Server      | 5                     |
| Schema Generation | TypeGraphQL        | 2.0.0-rc.2            |
| ORM               | Prisma             | 6.19.2                |
| Database          | PostgreSQL         | via Prisma Accelerate |
| Auth              | JWT + Google OAuth | -                     |
| Subscriptions     | graphql-ws         | WebSocket transport   |
| TypeScript        |                    | 5.9.3                 |

---

## Database Schema

### Scale

- **54 Prisma models**
- **53 enums**
- **139 migrations** (healthy history, no squash needed)
- **~121 KB schema file**
- **50+ indexes**
- **13 cascading delete relations**
- **~15 unique constraints**

### Model Domains

| Domain          | Models                                                            |
| --------------- | ----------------------------------------------------------------- |
| Identity & Auth | User, Session, Authenticator, Account                             |
| Brokerage       | AlpacaAccount                                                     |
| Portfolio       | Allocation, Position, Trade, Order, Action                        |
| Assets          | Asset                                                             |
| Market Data     | NewsArticle, MarketSentiment                                      |
| ML / Training   | ML training data models                                           |
| Institutional   | Institutional sentiment models                                    |
| Analytics       | Analytics models                                                  |
| Options         | OptionsPosition, OptionsContract, OptionsStrategy, GreeksSnapshot |

### Schema File

- `prisma/schema.prisma` - Single schema file containing all 54 models, 53 enums

### Recent Migrations (Feb 6, 2026)

| Migration                            | Purpose                                              |
| ------------------------------------ | ---------------------------------------------------- |
| `trade_timestamp_string_to_datetime` | Converted Trade.timestamp from String to DateTime    |
| `add_allocation_validation`          | Added allocation sum validation constraints          |
| `fix_updated_at_patterns`            | Corrected @default(now()) to @updatedAt on 8+ models |
| `add_missing_foreign_key_indexes`    | Added indexes on FK columns lacking them             |

---

## Security Hardening (Recently Completed)

The following security measures were implemented as part of the P0 audit remediation:

| Feature                     | Location                                      | Details                                                       |
| --------------------------- | --------------------------------------------- | ------------------------------------------------------------- |
| JWT secret management       | `src/config/jwtConfig.ts`                     | Production requires JWT_SECRET env var, minimum 32 characters |
| Input validation middleware | `src/middleware/input-validator.ts`           | Validates mutation inputs before processing                   |
| GraphQL validation plugin   | `src/middleware/graphql-validation-plugin.ts` | Validates GraphQL operations at the schema level              |
| Query depth limiter         | `src/plugins/query-depth-limiter.ts`          | Configurable via GRAPHQL_MAX_DEPTH env var                    |
| Error sanitizer             | `src/plugins/error-sanitizer.ts`              | Strips stack traces and internal details in production        |
| Rate limiting               | `src/middleware/rate-limiter.ts`              | Configurable via RATE_LIMIT_MAX env var                       |
| CORS configuration          | `src/server.ts`                               | Environment-based origin whitelist via ALLOWED_ORIGINS        |
| Allocation validator        | `src/validators/allocation-validator.ts`      | Ensures allocation sums are valid                             |

---

## Code Generation Pipeline

This is the most architecturally significant aspect of backend-legacy. Five sequential generation steps produce the majority of the package's exported surface area.

### Step 1: Prisma Generate

```
prisma generate
```

Reads `prisma/schema.prisma` and produces TypeGraphQL-compatible models and resolvers.

**Output:** `src/generated/typegraphql-prisma/`

### Step 2: Fix Import Paths

```
fix-import-paths.cjs
```

Post-processes generated files to correct import paths for the package's module structure.

### Step 3: Generate Selection Sets

```
generateSelections.ts
```

Produces GraphQL field selection set files used by the Apollo Client to request exactly the fields needed for each model.

**Output:** `src/generated/selectionSets/` (57 files, one per model)

### Step 4: Generate CRUD Functions

```
generator.ts (generate:functions)
```

Produces typed CRUD function files for each model. Each model gets functions for: `create`, `get`, `getAll`, `findMany`, `update`, `delete`, `createMany`.

**Output:** 57 CRUD function files (one per model)

### Step 5: Generate Type Strings

```
generateStrings.ts
```

Produces string representations of each model's type structure, used to provide LLM context about the data schema.

**Output:** `src/generated/typeStrings/` (57 files, one per model)

### Pipeline Dependency Chain

```
schema.prisma
    |
    v
prisma generate --> typegraphql-prisma models/resolvers
    |
    v
fix-import-paths.cjs --> corrected imports
    |
    v
generateSelections.ts --> 57 selection set files
    |
    v
generator.ts --> 57 CRUD function files
    |
    v
generateStrings.ts --> 57 type string files
```

---

## Package Exports

The published package exposes the following to consumers (`@adaptic/engine`, `@adaptic/utils`, etc.):

### Types Namespace

All Prisma model types are exported under a `types` namespace. These are THE canonical type definitions for the entire monorepo.

### CRUD Functions (per model)

Accessed as `adaptic.<model>.<operation>()`:

```typescript
adaptic.user.create(data);
adaptic.user.get(id);
adaptic.user.getAll();
adaptic.user.findMany(where);
adaptic.user.update(id, data);
adaptic.user.delete(id);
adaptic.user.createMany(data);
adaptic.trade.get(id);
// ... 57 models x 7 operations
```

### Selection Sets

GraphQL field selection sets for each model, ensuring queries request the correct fields.

### Type Strings

String representations of model types for LLM context injection.

### Apollo Client Factory

Singleton Apollo Client with:

- Connection pooling
- Retry logic with exponential backoff
- Token validation
- Prisma Accelerate integration

### PrismaClient Singleton

Direct Prisma client access with Accelerate extension.

---

## Key Files

| File                                          | Purpose                                                          |
| --------------------------------------------- | ---------------------------------------------------------------- |
| `src/server.ts`                               | Apollo GraphQL server setup with Express                         |
| `src/auth.ts`                                 | JWT authentication middleware                                    |
| `src/config/jwtConfig.ts`                     | JWT secret management (production enforcement)                   |
| `src/client.ts`                               | Apollo Client factory (singleton, retries, Prisma Accelerate)    |
| `src/prismaClient.ts`                         | Prisma singleton with Accelerate extension                       |
| `prisma/schema.prisma`                        | Database schema (all 54 models, 53 enums)                        |
| `src/modules/`                                | Code generators (generateSelections, generator, generateStrings) |
| `fix-import-paths.cjs`                        | Post-generation import path correction                           |
| `src/middleware/input-validator.ts`           | Input validation middleware                                      |
| `src/middleware/graphql-validation-plugin.ts` | GraphQL validation plugin                                        |
| `src/middleware/rate-limiter.ts`              | Rate limiting middleware                                         |
| `src/plugins/query-depth-limiter.ts`          | Query depth limiting plugin                                      |
| `src/plugins/error-sanitizer.ts`              | Error sanitization plugin                                        |
| `src/validators/allocation-validator.ts`      | Allocation validation logic                                      |

---

## Authentication

- **JWT tokens** validated on every GraphQL request
- **JWT secret management** via `src/config/jwtConfig.ts` (production requires JWT_SECRET, min 32 chars)
- **Google OAuth** integration for user login
- **Token refresh** mechanism for session continuity
- **Custom token provider** support for programmatic access

---

## Code Quality

| Metric                        | Status                                           |
| ----------------------------- | ------------------------------------------------ |
| `any` types in source code    | **Zero** (only present in generated vendor code) |
| eslint-disable comments       | **Zero**                                         |
| TODO/FIXME in production code | **Zero**                                         |
| console.log instances         | **33** (needs Pino migration)                    |
| Formal ESLint config          | **Configured** (flat config, eslint.config.mjs)  |
| Pre-commit hooks              | **Configured** (Husky + lint-staged)             |
| Formal test runner            | **Vitest** (npm test script configured)          |

### Tests

- **Vitest configured** (vitest.config.ts, `npm test` script)
- **3+ files with actual tests:**
  - `graphql-validation-plugin` tests
  - `input-validator` tests
  - `allocation-validator` tests
  - Additional tests added during Wave 3B
- **2 empty test templates:** generator, parser

---

## Current Issues

### CRITICAL - Security

| Issue                             | Detail                                                                                   |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| .env may contain real credentials | Environment file potentially committed with real secrets; needs removal from git history |

### HIGH - Stability & Quality

| Issue                        | Detail                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| TypeGraphQL RC in production | Using 2.0.0-rc.2 (release candidate, not stable)                                                        |
| 33 console.log calls         | Need migration to Pino structured logging                                                               |
| ~~No formal ESLint config~~  | **RESOLVED** - ESLint flat config added (eslint.config.mjs) with rules matching engine conventions      |
| ~~No pre-commit hooks~~      | **RESOLVED** - Husky + lint-staged configured, runs ESLint and TypeScript type checking on staged files |
| ~~No formal test runner~~    | **RESOLVED** - Vitest configured with npm test script, existing tests runnable                          |
| Prisma version drift         | package.json specifies ^6.13.0 but actual installed version is 6.19.2                                   |

### MEDIUM - Operations

| Issue                        | Detail                                                                                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| ~~No health check endpoint~~ | **RESOLVED** - GET /health endpoint added, returns database connectivity status, server uptime, memory usage, version number |
| Database restart uses exec() | Railway CLI invoked via exec() for DB restarts (fragile)                                                                     |

---

## Deployment

- Hosted on Railway
- Prisma Accelerate for connection pooling and edge caching
- Environment variables managed via Railway dashboard
- CORS configured via ALLOWED_ORIGINS environment variable
- Rate limiting configured via RATE_LIMIT_MAX environment variable
- Query depth configured via GRAPHQL_MAX_DEPTH environment variable
- Health check endpoint available at GET /health (database connectivity, uptime, memory, version)
- No structured logging (uses console.log; 33 instances)
