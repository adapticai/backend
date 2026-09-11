# Backend-Legacy Architecture

## System Overview

`@adaptic/backend-legacy` is the canonical data layer and code generation package for the Adaptic.ai platform. It serves three primary functions:

1. **Type Authority** -- Defines all 67 Prisma models and 73 enums (as of 2026-05-22) that form the data contract for the entire monorepo
2. **Code Generation** -- Produces typed CRUD functions, GraphQL selection sets, and LLM type strings from the Prisma schema
3. **GraphQL API Server** -- Runs an Apollo Server 5 + Express 4 backend with WebSocket subscriptions

### Architecture Diagram

```
                    prisma/schema.prisma
                    (67 models, 73 enums)
                           |
                    prisma generate
                           |
           src/generated/typegraphql-prisma/
           (models, resolvers, enums, scalars)
                           |
                  fix-import-paths.cjs
                           |
            +------- ------+---------------+
            |              |               |
  generateSelections   generator.ts   generateStrings
            |              |               |
   src/generated/     src/*.ts         src/generated/
   selectionSets/   (one CRUD file    typeStrings/
   (one file per     per model +       (one file per
    model + index)   index.ts)         model + index)
            |              |               |
            +--------------+---------------+
                           |
                     tsc (CJS + ESM)
                           |
                       dist/ + dist/server/
                           |
                NPM Package (@adaptic/backend-legacy)
                           |
            +--------------+---------------+
            |              |               |
       @adaptic/      @adaptic/      platform/
        engine          utils       (runtime only)
       (direct)       (direct)   (GraphQL/WebSocket)
```

## Technology Stack

| Layer             | Technology                        | Version               |
| ----------------- | --------------------------------- | --------------------- |
| HTTP Server       | Express                           | 4.21.x                |
| GraphQL Server    | Apollo Server                     | 5.x                   |
| Schema Generation | TypeGraphQL + typegraphql-prisma  | 2.0.0-rc.2 / 0.28.0   |
| ORM               | Prisma Client                     | 6.19.x                |
| Database          | PostgreSQL                        | via Prisma Accelerate |
| Auth              | JWT (jsonwebtoken) + Google OAuth | 9.x                   |
| Subscriptions     | graphql-ws over WebSocket         | 5.16.x                |
| TypeScript        |                                   | 5.9.x                 |
| Test Framework    | Vitest                            | 3.x                   |
| Linter            | ESLint (flat config)              | 9.x                   |

## Source Directory Structure

```
src/
  index.ts                  # Package entry point (exports types, enums, CRUD, Apollo Client)
  server.ts                 # Apollo Server + Express + WebSocket startup
  client.ts                 # Apollo Client factory (singleton, connection pool, retry)
  prismaClient.ts           # Prisma singleton with Accelerate extension
  health.ts                 # GET /health endpoint
  utils.ts                  # Shared utility functions (removeUndefinedProps, etc.)
  utils/
    index.ts                # Utils barrel export
    logger.ts               # Structured JSON logger
  config/
    jwtConfig.ts            # JWT secret management (production enforcement)
    tracing.ts              # OpenTelemetry tracing configuration
    metrics.ts              # Prometheus metrics (prom-client)
    persisted-queries.ts    # APQ LRU cache for Apollo Server
  middleware/
    auth.ts                 # JWT Bearer token authentication
    audit-logger.ts         # Apollo plugin for mutation audit logging
    input-validator.ts      # Input validation for GraphQL mutations
    graphql-validation-plugin.ts  # Schema-level GraphQL validation
    rate-limiter.ts         # Rate limiting (auth/unauth split)
    query-complexity.ts     # Query complexity + depth analysis
    soft-delete.ts          # Soft delete utilities (deletedAt field)
  plugins/
    query-depth-limiter.ts  # Configurable query depth limiting
    error-sanitizer.ts      # Strip internal details in production
    integration-example.ts  # Example plugin integration
  validators/
    allocation-validator.ts # Allocation sum validation
  resolvers/
    custom/
      index.ts              # Custom resolver exports
      OptionsGreeksHistoryCustomResolver.ts
      OptionsGreeksHistorySystemSummary.ts
  modules/                  # Code generation scripts (excluded from build)
    index.ts                # Orchestrates CRUD function generation
    generator.ts            # CRUD function code generator
    generateSelections.ts   # Selection set generator
    generateStrings.ts      # Type string generator
    parser.ts               # TypeGraphQL input type parser
    types.ts                # Generator type definitions
    utils.ts                # Generator utilities
  scripts/
    migrate-openai-model-enum.ts
    set-default-openai-model.ts
  tests/                    # Test files
    connection-pool.test.ts
    generator.test.ts
    graphql-validation-plugin.test.ts
    input-validator.test.ts
    parser.test.ts
    utils.test.ts
  generated/                # All generated code (gitignored from lint/build)
    typegraphql-prisma/     # Prisma-generated TypeGraphQL models, resolvers, enums
      models/               # 62 TypeScript model classes
      resolvers/            # Auto-generated CRUD resolvers
        inputs/             # GraphQL input types for mutations
        outputs/            # GraphQL output types
      enums/                # 63 TypeScript enum definitions
    selectionSets/          # 62 GraphQL field selection sets
    typeStrings/            # 62 type string representations for LLM context
  [A-Z]*.ts                 # 62 auto-generated CRUD model files (Trade.ts, User.ts, etc.)
```

## Code Generation Pipeline

### Step 1: Prisma Generate

```bash
npx prisma generate --no-engine
```

Reads `prisma/schema.prisma` and produces TypeGraphQL-compatible models and resolvers via the `typegraphql-prisma` generator.

**Input:** `prisma/schema.prisma` (67 models, 73 enums)
**Output:** `src/generated/typegraphql-prisma/` (models, resolvers, enums, scalars, helpers)

The generator configuration in the schema:

```prisma
generator typegraphql {
  provider               = "typegraphql-prisma"
  output                 = "../src/generated/typegraphql-prisma"
  emitTranspiledCode     = false
  contextPrismaKey       = "prisma"
  prismaClientImportPath = "../src/prismaClient.ts"
}
```

### Step 2: Fix Import Paths

```bash
node fix-import-paths.cjs
```

Post-processes generated TypeGraphQL files to correct import paths for the package's module structure. Handles path resolution between generated models and resolver output types.

### Step 3: Generate Selection Sets

```bash
ts-node src/modules/generateSelections.ts
```

Parses the Prisma schema via `@prisma/internals` DMMF (Data Model Meta Format), then generates GraphQL field selection set strings for each model. These selection sets control which fields are requested in Apollo Client queries.

**Key features:**

- Respects `GQL.SKIP`, `GQL.EXCLUDE`, `GQL.INCLUDE`, `GQL.MAX_DEPTH` meta tags in schema field documentation
- Prevents circular references via ancestor tracking
- LRU cache for repeated model traversals
- Maximum depth of 4 levels for nested relations

**Output:** `src/generated/selectionSets/` (one file per model + index.ts)

### Step 4: Generate CRUD Functions

```bash
ts-node src/modules/index.ts
```

Produces typed CRUD function files for each Prisma model. Each model gets a file (e.g., `src/Trade.ts`) with the following operations:

| Operation             | GraphQL              | Description             |
| --------------------- | -------------------- | ----------------------- |
| `create(props)`       | `createOneTrade`     | Create a single record  |
| `createMany(props[])` | `createManyTrade`    | Create multiple records |
| `update(props)`       | `updateOneTrade`     | Update by ID            |
| `updateMany(props)`   | `updateManyTrade`    | Update matching records |
| `upsert(props)`       | `upsertOneTrade`     | Create or update        |
| `delete(props)`       | `deleteOneTrade`     | Delete by ID            |
| `deleteMany(props)`   | `deleteManyTrade`    | Delete matching records |
| `get(props)`          | `trade` (findUnique) | Get single record by ID |
| `getAll()`            | `trades` (findMany)  | Get all records         |
| `findMany(props)`     | `trades` (findMany)  | Find with where clause  |

The generator also rebuilds `src/index.ts`, which aggregates all model CRUD objects into the `adaptic` default export.

**Output:** one CRUD file per model in `src/` + regenerated `src/index.ts`

### Step 5: Generate Type Strings

```bash
ts-node src/modules/generateStrings.ts
```

Produces TypeScript type string representations for each model, designed for LLM context injection. Includes enum declarations, field types, and documentation annotations.

**Key features:**

- Respects `TYPESTRING.SKIP` and `TYPESTRING.INCLUDE` meta tags
- Converts Prisma types to TypeScript types (String -> string, Int -> number, etc.)
- Resolves nested relations up to depth 5
- Prevents circular reference via ancestor tracking

**Output:** `src/generated/typeStrings/` (one file per model + index.ts)

## Data Model Overview

The Prisma schema is the authoritative catalogue of models and enums. The lists
below are summary inventories grouped by domain and reflect the schema **as of
2026-05-22 (67 models, 73 enums)**. When the count changes, regenerate this
section against `prisma/schema.prisma`:

```bash
grep -c '^model ' prisma/schema.prisma   # 67
grep -c '^enum '  prisma/schema.prisma   # 73
```

### Models by Domain (67 total)

#### Identity and Authentication (9 models)

| Model                   | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `User`                  | Platform user with roles, subscription, preferences      |
| `Session`               | User sessions (NextAuth compatible)                      |
| `Account`               | OAuth account connections                                |
| `Authenticator`         | WebAuthn/FIDO2 authenticators                            |
| `LinkedProvider`        | Linked authentication providers per user                 |
| `AccountLinkingRequest` | Cross-provider account linking workflow                  |
| `VerificationToken`     | Email/token verification                                 |
| `WaitlistEntry`         | Platform access waitlist                                 |
| `InviteToken`           | Invitation tokens for new users                          |

#### Brokerage and Portfolio (6 models)

| Model              | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `AlpacaAccount`    | Alpaca brokerage account binding (paper / live)                    |
| `Allocation`       | Portfolio allocation percentages (equities, options, crypto, etc.) |
| `Trade`            | Individual trade records with entry/exit data                      |
| `Action`           | Trade execution actions (BUY, SELL, HEDGE, etc.)                   |
| `Customer`         | Customer/account holder records                                    |
| `EquityBar`        | Persistent equity OHLCV bar cache (multi-timespan)                 |

#### Assets and Market Data (5 models)

| Model                       | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `Asset`                     | Financial instruments (stocks, ETFs, crypto, etc.) |
| `NewsArticle`               | News articles with sentiment data                  |
| `NewsArticleAssetSentiment` | Per-asset sentiment scores for news articles       |
| `MarketSentiment`           | Overall market sentiment snapshots                 |
| `EconomicEvent`             | Economic calendar events with importance levels    |

#### Options Trading (7 models)

| Model                    | Description                                       |
| ------------------------ | ------------------------------------------------- |
| `OptionsContract`        | Options contract definitions (call/put)           |
| `OptionsPosition`        | Open options positions                            |
| `OptionsPositionEvent`   | Lifecycle events on options positions             |
| `OptionsGreeksHistory`   | Historical Greeks snapshots per contract          |
| `PortfolioGreeksHistory` | Portfolio-level Greeks aggregations               |
| `OptionsTradeExecution`  | Options trade execution records                   |
| `ScheduledOptionOrder`   | Scheduled/pending option orders                   |

#### Trading Policy and Risk Governance (4 models)

| Model                  | Description                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `TradingPolicy`        | Per-account autonomous-trading policy (autonomy mode, asset-class toggles, risk parameters). |
| `PolicyOverlay`        | Dynamic policy overlays (escalation, throttle, kill-switch) on top of a `TradingPolicy`.     |
| `AccountRiskMetrics`   | Periodic snapshot of account-level risk metrics (drawdown, exposure, leverage).              |
| `RiskEscalationEvent`  | Risk escalation events surfaced for operator review.                                         |

#### ML and Model Management (6 models)

| Model                       | Description                                          |
| --------------------------- | ---------------------------------------------------- |
| `MLTrainingData`            | Training data for ML models                          |
| `MLModelVersion`            | ML model version registry (engine-managed)           |
| `ModelVersion`              | Backend-managed model version lifecycle              |
| `ModelArtifact`             | Model artifact storage references                    |
| `ModelVersionArtifact`      | Junction: model version to artifact mapping          |
| `ABTest`                    | A/B test definitions and results                     |

#### Signal Processing (5 models)

| Model                    | Description                                |
| ------------------------ | ------------------------------------------ |
| `SignalLineage`          | Signal provenance and transformation chain |
| `SignalGeneratorMetrics` | Signal generator performance metrics       |
| `SignalPriorityQueue`    | Priority-ordered signal processing queue   |
| `SignalOutcome`          | Signal outcome tracking (hit/miss/partial) |
| `TradeExecutionHistory`  | Detailed trade execution audit trail       |

#### Decision Engine and Memory (3 models)

| Model                         | Description                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `AccountDecisionRecord`       | Per-account decision artefact (input context, outcome, model version, reasoning).    |
| `DecisionMemorySummary`       | Aggregated decision-memory rollup per account / strategy / period.                   |
| `FeatureImportanceAnalysis`   | Feature importance / SHAP analysis output                                            |

#### Institutional Data (6 models)

| Model                            | Description                                |
| -------------------------------- | ------------------------------------------ |
| `InstitutionalHolding`           | Institutional investor holding disclosures |
| `InstitutionalFlowSignal`        | Institutional money flow signals           |
| `InstitutionalSentimentHistory`  | Historical institutional sentiment         |
| `InstitutionalSentimentMetrics`  | Aggregated institutional sentiment metrics |
| `InstitutionalSentimentAlerts`   | Institutional data pipeline alerts         |
| `InstitutionalSentimentErrors`   | Institutional data pipeline errors         |

#### Analytics and Configuration (4 models)

| Model                    | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `AnalyticsSnapshot`      | Point-in-time analytics snapshots                                    |
| `AnalyticsConfiguration` | Analytics pipeline configuration                                     |
| `Configuration`          | System configuration key-value store                                 |
| `LlmConfiguration`       | LLM provider/model configuration (per account or system-wide)        |

#### Monitoring, Audit, and Operations (8 models)

| Model                      | Description                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| `Alert`                    | User-facing alerts (trade, portfolio, risk, system)                              |
| `SystemAlert`              | System-level operational alerts                                                  |
| `ConnectionHealthSnapshot` | Connection health monitoring snapshots                                           |
| `AuditLog`                 | Mutation audit log (who changed what, when)                                      |
| `TradeAuditEvent`          | Trade-specific audit events (SEC Rule 15c3-5 / FINRA audit-event target)         |
| `StrategyHealthSnapshot`   | Periodic snapshot of strategy operational health                                 |
| `Event`                    | System events with categorization                                                |
| `EventSnapshot`            | Point-in-time event snapshots                                                    |

#### Trade Outcomes (1 model)

| Model           | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `TradeOutcome`  | Closed-trade outcome record (P&L, hold time, quality classification) |

#### Sync and Error Handling (3 models)

| Model               | Description                            |
| ------------------- | -------------------------------------- |
| `SyncEvent`         | Cross-system synchronization events    |
| `ConflictEvent`     | Data conflict detection and resolution |
| `DeadLetterMessage` | Failed message processing queue        |

### Enums by Domain (73 total)

The schema currently defines 73 enums spanning trading, risk governance,
autonomy / decision modes, market regime, ML model lifecycle, audit operations,
signal processing, options, broker LLM/provider catalogues, alert taxonomies,
and operational status states. The list is too long to enumerate inline without
drifting; treat `prisma/schema.prisma` as the source of truth and refresh with:

```bash
grep '^enum ' prisma/schema.prisma | sed 's/enum //;s/ {//' | sort
```

Major newer enums (added in the trading-policy / decision-engine /
risk-governance / ML-governance expansions) include `AutonomyMode`,
`AccountRiskState`, `OverlayType`, `OverlaySeverity`, `OverlayStatus`,
`DecisionOutcome`, `DecisionRecordStatus`, `DecisionMemoryOutcome`,
`RiskEscalationActor`, `RiskEscalationReason`, `ModelVersionStatus`,
`SignalDecisionType`, `SignalExecutionStatus`, `SignalGeneratorSource`,
`SignalOutcomeType`, `SignalPriorityTier`, `SignalQueueStatus`,
`TradeExitReason`, `TradeOutcomeQuality`, plus the LLM provider/model
enums (`AnthropicModel`, `OpenaiModel`, `DeepseekModel`, `GeminiModel`,
`KimiModel`, `QwenModel`, `XaiModel`, `DeepinfraModel`, `LlmProvider`).

## Server Architecture

### Entry Point

`src/server.ts` starts the server with the following components:

```
startServer()
  |
  +-- buildSchema() (TypeGraphQL + custom resolvers)
  |
  +-- express() app
  |     |
  |     +-- authMiddleware on /api routes
  |     +-- createHealthRouter() on /health
  |     +-- Apollo expressMiddleware on /graphql
  |           |
  |           +-- CORS (environment-based origins)
  |           +-- bodyParser.json
  |           +-- JWT verification in context
  |           +-- AuditLog plugin
  |
  +-- WebSocketServer on /subscriptions
  |     |
  |     +-- graphql-ws useServer
  |     +-- JWT verification in context
  |
  +-- Process signal handlers (SIGINT, SIGTERM)
```

### Authentication Flow

1. Client sends `Authorization: Bearer <token>` header
2. Server checks token format:
   - Google OAuth token (starts with `ya29.`): passed through as `{ provider: 'google', token }`
   - Server-to-server token: validated against `SERVER_AUTH_TOKEN` env var
   - JWT: verified using `jwtSecret` from `src/config/jwtConfig.ts`
3. Decoded user attached to GraphQL context as `user`
4. Invalid/missing tokens: request continues but `authError` set in context

### Database Resilience

- Prisma singleton with global scope (survives hot reloads)
- Prisma Accelerate extension for connection pooling
- Configurable pool size per deployment tier (dev: 5, staging: 10, prod: 20)
- Pool exhaustion detection via Prisma event logging
- Auto-restart of Railway Postgres after 3 consecutive DB unreachable errors (5min cooldown)

## Security Layers

| Layer                 | Implementation                                     | Location                                      |
| --------------------- | -------------------------------------------------- | --------------------------------------------- |
| Authentication        | JWT + Google OAuth + Server tokens                 | `src/middleware/auth.ts`, `src/server.ts`     |
| JWT Secret Management | Production enforcement, min 32 chars               | `src/config/jwtConfig.ts`                     |
| CORS                  | Environment-based origin whitelist                 | `src/server.ts`                               |
| Rate Limiting         | Auth/unauth split, Retry-After headers             | `src/middleware/rate-limiter.ts`              |
| Input Validation      | Mutation input validation                          | `src/middleware/input-validator.ts`           |
| GraphQL Validation    | Schema-level operation validation                  | `src/middleware/graphql-validation-plugin.ts` |
| Query Depth Limiting  | Configurable max depth (default: 10)               | `src/plugins/query-depth-limiter.ts`          |
| Query Complexity      | Auth/unauth complexity limits                      | `src/middleware/query-complexity.ts`          |
| Error Sanitization    | Strip stack traces in production                   | `src/plugins/error-sanitizer.ts`              |
| Audit Logging         | All mutations logged to AuditLog model             | `src/middleware/audit-logger.ts`              |
| Soft Deletes          | deletedAt on User, AlpacaAccount, Trade, Action    | `src/middleware/soft-delete.ts`               |
| Database Constraints  | CHECK constraints on prices, quantities, strings   | Prisma migration                              |
| Allocation Validation | Sum validation for allocation percentages          | `src/validators/allocation-validator.ts`      |

## Observability

All listed capabilities are wired into `src/server.ts` and gated by environment
variables (defaults: on in production/staging, off in development unless the
operator explicitly enables them). See `docs/ENVIRONMENT_SETUP.md` for the
complete env-var list and `docs/audits/2026-05-22-readability/README.md` for the
2026-05-22 wire/delete decisions.

| Capability            | Implementation                               | Toggle                            | Status |
| --------------------- | -------------------------------------------- | --------------------------------- | ------ |
| Structured Logging    | Custom JSON logger (`src/utils/logger.ts`)   | Always on                         | Active |
| Health Check          | `GET /health` (DB, uptime, memory, version)  | Always on                         | Active |
| OpenTelemetry Tracing | OTLP exporter, HTTP/Express/GraphQL spans    | `OTEL_TRACING_ENABLED`            | Active |
| Prometheus Metrics    | HTTP/GraphQL/DB metrics, `/metrics` endpoint | `PROMETHEUS_METRICS_ENABLED`      | Active |
| Persisted Queries     | APQ in-memory LRU cache (default 1000)       | `APQ_ENABLED`                     | Active |
| Query Complexity/Depth | Auth/unauth complexity and depth limits     | `GRAPHQL_COMPLEXITY_ENABLED`      | Active |
| Input Validation      | GraphQL mutation input validation plugin    | Always on                         | Active |

## Cross-Package Integration

### Type Contract

backend-legacy's Prisma models are THE canonical type definitions for the entire monorepo:

- `@adaptic/engine` imports types and uses CRUD functions via Apollo Client
- `@adaptic/utils` imports types for financial calculations
- `platform` consumes types at runtime via GraphQL queries/mutations and WebSocket events
- Selection sets ensure consistent field requests across all consumers

### Schema-Ownership Boundary: Tier A (engine) vs Tier B (backend-legacy)

The Adaptic monorepo splits database tables across two PostgreSQL instances.
**This package owns Tier B.** Engine telemetry / governance data lives in a
separate Postgres owned by the engine. Both tiers are documented here so
agents adding new models know where to put them.

**Tier B — Adaptic-domain data (this package).** User, Session, Account,
AlpacaAccount, Customer, Trade, Action, Alert, Asset, TradingPolicy,
Allocation, NewsArticle, AuditLog, Configuration, TradeAuditEvent — anything
with cross-model relations or that is a system-of-record for identity,
audit, or trade lifecycle. All Tier B access is through `adaptic.*` CRUD
functions; no package may instantiate a `PrismaClient` against this database.

**Tier A — Engine-system telemetry, cache, event-sourcing, decision memory,
and ML-governance data.** Lives in a separate engine-local Postgres
(Railway `adaptic-os/stable`, internal hostname
`postgres-nxbe.railway.internal`) accessed via `telemetryDb` — the
PrismaClient singleton at `engine/src/db/engine-prisma.ts`. The
authoritative Tier A model list lives in `engine/prisma/schema.prisma` and
is enforced by ESLint (`@typescript-eslint/no-restricted-imports`).

**Classification rule.** If a feature is system-of-record for identity,
audit, regulatory, or trade-lifecycle state, it is Tier B (backend-legacy).
If it is engine-internal telemetry, observability, governance, or cache, it
is Tier A (engine `telemetryDb`).

**Cross-references.** The root [`CLAUDE.md`](../../CLAUDE.md) carries the
canonical statement of this rule; the engine spec
[`engine/docs/superpowers/specs/2026-04-15-engine-local-telemetry-db-design.md`](../../engine/docs/superpowers/specs/2026-04-15-engine-local-telemetry-db-design.md)
captures the design rationale. The consumer-facing version of this section
lives in [`docs/using-adaptic-backend.md`](./using-adaptic-backend.md).

### Generated Code Drift Detection

The CI workflow (`.github/workflows/ci.yml`) includes a `verify-generated-code` job that:

1. Runs the full codegen pipeline
2. Checks `git diff --quiet src/generated/` for drift
3. Fails the PR if generated code doesn't match committed code

### Schema Validation

```bash
npm run validate:schema
```

Performs three checks:

1. `npx prisma validate` -- schema syntax
2. `npx prisma generate` -- code generation succeeds
3. `git diff --quiet src/generated/` -- drift detection

Exit codes: 0 (pass), 1 (validation failure), 2 (drift detected)

## Build Process

### Full Build Pipeline

```
npm run build
  |
  1. npm run clean          # rm -rf dist && rm -rf src/generated
  2. npm run generate       # prisma generate --no-engine
  3. npm run fix-imports    # node fix-import-paths.cjs
  4. npm run generate:selections  # ts-node src/modules/generateSelections.ts
  5. npm run generate:functions   # ts-node src/modules/index.ts
  6. npm run generate:strings     # ts-node src/modules/generateStrings.ts
  7. tsc                          # CJS build -> dist/ (ES2018, CommonJS)
  8. npm run build:server         # ESM build -> dist/server/ (ESNext)
```

### Dual Output

| Target | tsconfig               | Output         | Module            | Use Case                  |
| ------ | ---------------------- | -------------- | ----------------- | ------------------------- |
| CJS    | `tsconfig.json`        | `dist/`        | CommonJS (ES2018) | NPM package consumers     |
| ESM    | `tsconfig.server.json` | `dist/server/` | ESNext            | Server-side ESM consumers |

### NPM Package Contents

Published files (from `package.json` `files` field):

- `dist/**/*.js` -- compiled JavaScript
- `dist/**/*.d.ts` -- TypeScript declarations
- `dist/**/*.js.map` -- source maps

## Testing

### Framework

Vitest with v8 coverage provider. Configuration in `vitest.config.ts`:

- **Test pattern:** `src/**/*.test.ts`, `src/**/*.spec.ts`
- **Excludes:** `node_modules`, `dist`, `src/generated/**`, `src/modules/**`
- **Timeout:** 10s per test, 10s per hook
- **Coverage thresholds:** 60% lines, 50% functions, 40% branches, 60% statements

### Test Files

| Test File                                       | Tests | Domain                        |
| ----------------------------------------------- | ----- | ----------------------------- |
| `src/middleware/__tests__/audit-logger.test.ts` | 25    | Audit logging plugin          |
| `src/middleware/__tests__/soft-delete.test.ts`  | 21    | Soft delete utilities         |
| `src/tests/connection-pool.test.ts`             | 10    | Connection pool configuration |
| `src/tests/graphql-validation-plugin.test.ts`   | --    | GraphQL validation            |
| `src/tests/input-validator.test.ts`             | --    | Input validation              |
| `src/validators/allocation-validator.test.ts`   | --    | Allocation validation         |
| `src/tests/generator.test.ts`                   | --    | CRUD generator                |
| `src/tests/parser.test.ts`                      | --    | Input type parser             |
| `src/tests/utils.test.ts`                       | --    | Utility functions             |

## Migration History

- **165 migrations** from July 2024 through May 2026
- PostgreSQL database accessed via Prisma Accelerate
- Notable recent migrations:
  - `trade_timestamp_string_to_datetime` -- Converted Trade.timestamp from String to DateTime
  - `add_allocation_validation` -- Added allocation sum validation constraints
  - `fix_updated_at_patterns` -- Corrected @default(now()) to @updatedAt on 8+ models
  - `add_missing_foreign_key_indexes` -- Added indexes on FK columns
  - `add_audit_log_and_soft_deletes` -- AuditLog model + deletedAt fields
  - `add_database_constraints` -- CHECK constraints for prices, quantities, strings

## Known Issues and Remaining Work

| Priority | Issue           | Detail                                                                                          |
| -------- | --------------- | ----------------------------------------------------------------------------------------------- |
| P1       | TypeGraphQL RC  | Using 2.0.0-rc.2 (waiting on stable release)                                                    |
| Low      | Git history     | .env may exist in git history (manual BFG cleanup needed)                                       |

The dormant tracing/metrics/APQ/query-complexity/validation plugins flagged
in the 2026-02-08 architecture campaign were all wired into `src/server.ts`
during the 2026-05-22 readability sweep. See `docs/audits/2026-05-22-readability/README.md`.
