# Using `@adaptic/backend-legacy`

This is the canonical consumer-facing usage guide for the `@adaptic/backend-legacy`
NPM package. It covers Apollo Client setup, the typed CRUD API exposed under the
`adaptic` default export, the `types`/`enums`/`typeStrings` namespaces, and the
operational rules every consumer must observe (schema-ownership boundary, real
import patterns, error handling).

**Counts and status (verify before relying on these numbers):**

| Quantity        | Authoritative source                                      | Refresh recipe                                 |
| --------------- | --------------------------------------------------------- | ---------------------------------------------- |
| Models          | `prisma/schema.prisma`                                    | `grep -c '^model ' prisma/schema.prisma` -> 67 |
| Enums           | `prisma/schema.prisma`                                    | `grep -c '^enum ' prisma/schema.prisma` -> 73  |
| Migrations      | `prisma/migrations/`                                      | `ls prisma/migrations/ | wc -l` -> 165         |
| Published version | `npm view @adaptic/backend-legacy version`              | latest channel currently `0.0.984`             |

(Snapshot date: 2026-05-22. If you are reading this much later, regenerate the
counts before quoting them.)

---

## Where to look first

For a richer cross-monorepo map of which package owns what and where to start
reading when investigating a feature, see
[`~/adapticai/docs/AGENT_STARTING_POINTS.yml`](../../docs/AGENT_STARTING_POINTS.yml)
at the workspace root.

The most useful in-package references:

| Document                                                  | Purpose                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)               | System overview, codegen pipeline, observability           |
| [`docs/REPO_MAP.md`](./REPO_MAP.md)                       | Directory layout                                           |
| [`docs/CONVENTIONS.md`](./CONVENTIONS.md)                 | Code conventions and inline GQL/TYPESTRING directives      |
| [`docs/AGENT_RULES.md`](./AGENT_RULES.md)                 | Rules for modifying the schema / generated code            |
| [`docs/ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md)     | Env-var reference (DATABASE_URL, OTEL_*, APQ_*, etc.)      |
| [`CLAUDE.md`](../CLAUDE.md)                               | Claude Code instructions                                   |
| `prisma/schema.prisma`                                    | Authoritative model and enum catalogue                     |

---

## Schema-ownership boundary (Tier A vs Tier B)

The Adaptic monorepo splits database tables across **two** PostgreSQL
instances. Understanding this boundary is required before adding any model or
choosing where to write data.

### Tier B — Adaptic-domain data (this package owns it)

All identity, audit, trade-lifecycle, and system-of-record data — `User`,
`Session`, `Account`, `AlpacaAccount`, `Customer`, `Trade`, `Action`, `Alert`,
`Asset`, `TradingPolicy`, `Allocation`, `NewsArticle`, `AuditLog`,
`Configuration`, `TradeAuditEvent`, `PolicyOverlay`, `AccountRiskMetrics`,
`RiskEscalationEvent`, etc. — lives in the **backend-legacy Postgres**
(production: AlloyDB; dev: shared via Prisma Accelerate). Access is **only**
through this package via `adaptic.<model>.<crud>()`. No consumer package may
instantiate a `PrismaClient` against this database.

When you need a new domain model:

1. Add it to `backend-legacy/prisma/schema.prisma`.
2. Run `npm run build` (full codegen pipeline).
3. Push to `main` (or `stable-release`) — CI publishes the npm package.
4. Bump the dependency version in consumers and update their callsites.

### Tier A — Engine-system telemetry / governance (engine owns it)

Engine-system telemetry, cache, event-sourcing, decision memory, and ML-governance
data live in a **separate engine-local Postgres** (Railway `adaptic-os/stable`,
internal hostname `postgres-nxbe.railway.internal`) accessed via `telemetryDb`
— the PrismaClient singleton at `engine/src/db/engine-prisma.ts`. The
authoritative Tier A model list lives in `engine/prisma/schema.prisma` and is
enforced by ESLint (`@typescript-eslint/no-restricted-imports`).

If you are reading code in the engine and see a `telemetryDb.<model>.<op>()`
call, it is hitting a different database than `adaptic.<model>.<op>()`. See
[`engine/docs/superpowers/specs/2026-04-15-engine-local-telemetry-db-design.md`](../../engine/docs/superpowers/specs/2026-04-15-engine-local-telemetry-db-design.md)
for the design rationale and the classification rule.

**Rule of thumb:** if a feature is system-of-record for identity / audit /
trade lifecycle, it is Tier B (backend-legacy). If it is engine-internal
telemetry, observability, governance, or cache, it is Tier A
(engine `telemetryDb`).

---

## Installation

```bash
npm install @adaptic/backend-legacy
```

### Environment variables (consumer)

The package reads the following at runtime:

| Variable                             | Purpose                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| `BACKEND_HTTPS_URL`                  | GraphQL HTTPS endpoint (e.g. `https://stable-api.adaptic.ai/graphql`)                |
| `BACKEND_WS_URL`                     | GraphQL WebSocket endpoint (subscriptions)                                           |
| `NEXT_PUBLIC_BACKEND_HTTPS_URL`      | Browser-side override for the HTTPS endpoint (preferred in `platform/apps/web`)      |
| `SERVER_AUTH_TOKEN` / `NEXT_PUBLIC_SERVER_AUTH_TOKEN` | Server-to-server auth token used when no per-request token is provided |
| `NODE_ENV`                           | `production` enables stricter Apollo error handling                                  |

If you run the server itself (this package as a dev dependency), see
[`docs/ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md) for the full server-side
list including `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_OAUTH_CLIENT_IDS`,
`ALLOWED_ORIGINS`, and the observability toggles (`OTEL_TRACING_ENABLED`,
`PROMETHEUS_METRICS_ENABLED`, `APQ_ENABLED`,
`GRAPHQL_COMPLEXITY_ENABLED`).

---

## Public API surface

The package's default export is the typed `adaptic` CRUD namespace; the named
exports cover Apollo Client configuration and the type/enum/string namespaces.

### Real import patterns (verified against current consumers)

The engine and utils packages import via:

```typescript
import adaptic from '@adaptic/backend-legacy';
import {
  getApolloClient,
  configureConnectionPool,
  setTokenProvider,
  stopClient,
  getPoolStats,
  type ApolloClientType,
  type NormalizedCacheObject,
  type TokenProvider,
  type PoolStats,
} from '@adaptic/backend-legacy';
import type { types, enums } from '@adaptic/backend-legacy';
```

There is **no** named `{ adaptic }` export — `adaptic` is the default. Patterns
like `import { adaptic } from '@adaptic/backend-legacy'` will not type-check.

### What's exported

| Export                                                                  | Description                                                                              |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `default` (`adaptic`)                                                   | CRUD namespace keyed by model (lowercase first letter)                                   |
| `types` namespace                                                       | All Prisma model TypeScript types (67 models as of 2026-05-22)                            |
| `enums` namespace                                                       | All Prisma enums (73 as of 2026-05-22)                                                    |
| `typeStrings`                                                           | Stringified type definitions for LLM context injection                                   |
| `getApolloClient()`                                                     | Singleton Apollo Client factory (server + browser auto-detect)                           |
| `getApolloModules()`                                                    | Lazy module loader (returns `{ gql, ApolloError, ... }`)                                 |
| `configureConnectionPool(config)`                                       | Tunes the connection-pool admission limits, retries, queue depth                         |
| `setTokenProvider(provider)`                                            | Registers a custom auth-token resolver (e.g. NextAuth session callback)                  |
| `stopClient()`                                                          | Disposes the singleton on process shutdown                                               |
| `getPoolStats()`                                                        | Returns live pool counters (in-flight, queued, retried) for observability                |
| `OptionsGreeksHistoryCustomResolver`                                    | Custom GraphQL resolver re-export (server-side use only)                                 |
| Apollo type aliases (`ApolloClientType`, `InMemoryCacheType`, ...)      | Re-exports for type-only imports (avoids forcing consumers to depend on `@apollo/client` |

> **Note on internal modules.** The published `dist/` also contains
> `dist/middleware/`, `dist/auth/`, `dist/plugins/`, `dist/utils/`, and
> `dist/validators/`. These are **not** re-exported through `src/index.ts`.
> They are reachable via deep imports (e.g.
> `import { softDeleteRecord } from '@adaptic/backend-legacy/middleware'`) but
> are not part of the documented public API. Treat them as server-side
> internals — consumers that depend on them are coupling to an unstable
> surface.

---

## Apollo Client setup

The package provides a singleton Apollo Client with connection pooling and
in-flight query coalescing. Create one instance per process and reuse it; the
internal pool keeps the backend within configured concurrency limits.

### Minimum setup

```typescript
import adaptic, { getApolloClient } from '@adaptic/backend-legacy';

const client = await getApolloClient();

// Subsequent CRUD calls reuse the singleton:
const trade = await adaptic.trade.get({ id: 'trade-abc' }, client);
```

### Configuring the connection pool

```typescript
import { configureConnectionPool, getApolloClient } from '@adaptic/backend-legacy';

configureConnectionPool({
  maxConcurrentOperations: 50,    // hard cap on parallel ops (default: 50)
  retryAttempts: 5,
  retryDelay: 500,                // base ms; client uses exponential backoff
  connectionTimeout: 15_000,
  maxQueueDepth: 200,             // load-shedding threshold
  queueWaitTimeoutMs: 30_000,
  coalesceInFlightQueries: true,  // dedup identical in-flight queries
});

const client = await getApolloClient();
```

`configureConnectionPool` must be called **before** `getApolloClient()`.

### Custom token provider (auth)

Server consumers typically register a token provider that pulls a session JWT
from their auth system (NextAuth, custom JWT, etc.):

```typescript
import { setTokenProvider } from '@adaptic/backend-legacy';

setTokenProvider(async () => {
  return await resolveSessionJwt(); // your auth lookup
});
```

The provider runs on every GraphQL operation; cache the resolved token if
your auth lookup is expensive.

---

## Typed CRUD operations

Every model gets the same nine operations. Each accepts a model-shaped object
and the shared Apollo Client. The library transforms the input into the
appropriate GraphQL `where` and `data` shapes automatically.

| Operation                              | Returns               | When to use                                          |
| -------------------------------------- | --------------------- | ---------------------------------------------------- |
| `create(props, client?)`               | `ModelType`           | New record, confirmed not to exist                   |
| `createMany(props[], client?)`         | `{ count: number }`   | Batch create                                         |
| `update(props, client?)`               | `ModelType`           | Modify an existing record by ID                      |
| `updateMany(props[], client?)`         | `{ count: number }`   | Apply same update to a list                          |
| `upsert(props, client?)`               | `ModelType`           | Create-or-update (slightly slower than `update`)     |
| `delete(props, client?)`               | `ModelType`           | Remove a record (or soft-delete; see soft-delete)    |
| `get(props, client?, whereInput?)`     | `ModelType \| null`   | Fetch one record by unique field                     |
| `getAll(client?)`                      | `ModelType[] \| null` | Fetch everything (use sparingly)                     |
| `findMany(props, client?, whereInput?)` | `ModelType[] \| null` | Filtered list with optional explicit `where`          |

### Examples (current models)

```typescript
import adaptic, { getApolloClient, types, enums } from '@adaptic/backend-legacy';

const client = await getApolloClient();

// Create a user
const user = await adaptic.user.create({
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: enums.UserRole.ADMIN,
}, client);

// Update an Alpaca brokerage account
const account = await adaptic.alpacaAccount.update({
  id: 'aa-123',
  cryptoTradingEnabled: false,
}, client);

// Fetch a trade by ID, asserting its type
const trade = (await adaptic.trade.get(
  { id: 'trade-456' },
  client,
)) as types.Trade | null;

// Open trades for a specific account, last 24h
const recent = await adaptic.trade.findMany({}, client, {
  alpacaAccountId: 'aa-123',
  status: { in: [enums.TradeStatus.OPEN, enums.TradeStatus.PARTIAL] },
  createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
});

// Trading-policy lookup (institutional governance model)
const policy = await adaptic.tradingPolicy.get(
  { alpacaAccountId: 'aa-123' },
  client,
);
if (policy?.autonomyMode === enums.AutonomyMode.FULLY_AUTONOMOUS) {
  // ...
}

// Risk-overlay enumeration
const overlays = await adaptic.policyOverlay.findMany({}, client, {
  tradingPolicy: { alpacaAccountId: 'aa-123' },
  status: enums.OverlayStatus.ACTIVE,
});

// Audit-event persistence (Tier B — SEC 15c3-5 / FINRA target)
await adaptic.tradeAuditEvent.create({
  alpacaAccountId: 'aa-123',
  tradeId: 'trade-456',
  eventType: 'order_submitted',
  eventData: { /* JSON */ },
}, client);
```

### `where` filter operators

`findMany` (and `get` via the optional third argument) accepts the standard
Prisma operator set inside any field:

`equals`, `not`, `in`, `notIn`, `lt`, `lte`, `gt`, `gte`, `contains`,
`startsWith`, `endsWith`, plus logical combinators `AND`, `OR`, `NOT`, and
relational `some` / `every` / `none`.

```typescript
const adminsFromCorp = await adaptic.user.findMany({}, client, {
  AND: [
    { role: enums.UserRole.ADMIN },
    { email: { endsWith: '@adaptic.ai' } },
  ],
});

const accountsWithRecentTrades = await adaptic.alpacaAccount.findMany(
  {},
  client,
  {
    trades: {
      some: {
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
    },
  },
);
```

---

## Types namespace

```typescript
import { types, enums } from '@adaptic/backend-legacy';

const trade: types.Trade = {
  id: 'trade-abc',
  symbol: 'AAPL',
  qty: 100,
  status: enums.TradeStatus.OPEN,
  // ...
};
```

Each model has an associated TypeScript interface mirroring its Prisma shape
(scalars, nullable fields, and relation arrays). The `types` namespace is
re-exported from the generated TypeGraphQL output and is the authoritative
type surface for the entire monorepo.

---

## Enums namespace

```typescript
import { enums } from '@adaptic/backend-legacy';

const role: enums.UserRole = enums.UserRole.ADMIN;
const exitReason: enums.TradeExitReason = enums.TradeExitReason.STOP_LOSS;
const autonomy: enums.AutonomyMode = enums.AutonomyMode.SEMI_AUTONOMOUS;
```

Every enum in `prisma/schema.prisma` is exposed here. Notable
governance/decision enums added in the trading-policy expansion:
`AutonomyMode`, `OverlayType`, `OverlaySeverity`, `OverlayStatus`,
`AccountRiskState`, `DecisionOutcome`, `DecisionRecordStatus`,
`DecisionMemoryOutcome`, `RiskEscalationActor`, `RiskEscalationReason`.

---

## TypeStrings namespace (for LLM context)

`typeStrings` exports each model as a stringified TypeScript-style type
definition (including nested relations and enums), intended to be embedded
in LLM prompts where the model wants the LLM to return data matching a
specific shape.

```typescript
import { typeStrings } from '@adaptic/backend-legacy';

const prompt = `
Return a JSON object that matches this TypeScript type:

${typeStrings.Trade}

Use the provided market data to populate the fields.
`;
```

The selection-set composability and the GQL/TYPESTRING inline-directive
system that controls what each typeString includes are documented in
[`CLAUDE.md`](../CLAUDE.md) under "GQL Inline Comment System".

---

## Selection sets (deep-import surface)

Each model has a generated GraphQL selection-set string used by the CRUD
functions internally. Consumers occasionally need to compose a custom query
using these:

```typescript
import { selectionSets } from '@adaptic/backend-legacy/generated/selectionSets';

const fields = selectionSets.Trade; // multi-line string
```

The nesting depth and per-field inclusion rules are controlled by the
`/// GQL.*` directives on the schema fields — see
[`CLAUDE.md`](../CLAUDE.md) for the directive language.

---

## Error handling

The connection pool retries connection-level errors with exponential backoff
before surfacing the failure. Wrap CRUD calls in standard try/catch and
inspect Apollo errors for diagnostics:

```typescript
import adaptic, {
  getApolloClient,
  getApolloModules,
} from '@adaptic/backend-legacy';

const client = await getApolloClient();
const { ApolloError } = await getApolloModules();

try {
  const user = await adaptic.user.get({ id: 'user-123' }, client);
  if (!user) {
    // Distinguish "not found" from "errored"
  }
} catch (err) {
  if (err instanceof ApolloError) {
    // Inspect err.graphQLErrors / err.networkError for root cause
  } else {
    // Pool exhaustion / queue-wait / load-shedding errors are plain Error
  }
}
```

Server-side, the Apollo Server surfaces `UNAUTHENTICATED` errors with an
`extensions.reason` enum (one of `malformed | expired | bad_signature |
bad_audience | opaque_access_token_rejected | misconfigured`) and HTTP status
401. Consumers should treat any 401 as a session-refresh trigger.

---

## Migrations & schema evolution

Migrations are managed by the package owner via Prisma:

```bash
npm run migrate         # production: prisma migrate deploy
npm run migrate:dev     # local: prisma migrate dev + deploy
npm run validate:schema # validate + drift check
```

Consumers do not run migrations. If you need a new field on a Tier B model,
file a schema change against this repo, wait for the npm publish, and bump
your dependency.

---

## Troubleshooting

| Symptom                                                | Likely cause                                                                                  | Resolution                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `Accelerate was not able to connect`                   | `DATABASE_URL` misconfigured or Accelerate proxy down                                         | Verify env var; check Prisma Accelerate dashboard                                                     |
| `LOAD_SHEDDING` error from CRUD calls                  | Connection pool queue exceeded `maxQueueDepth`                                                | Reduce concurrent issuance, raise `maxQueueDepth`, or back off load                                   |
| `QUEUE_WAIT_TIMEOUT`                                   | Operation sat in queue longer than `queueWaitTimeoutMs`                                       | Backend is overloaded — investigate upstream rather than just raising the timeout                     |
| `UNAUTHENTICATED` with `reason: misconfigured`         | Server hasn't been started with `GOOGLE_OAUTH_CLIENT_IDS` (or the wrong audiences)            | Set `GOOGLE_OAUTH_CLIENT_IDS` on the server before restart                                            |
| `Cannot read properties of undefined (reading 'write')` | Old Apollo Client version mismatched with backend response shape                              | Pin to `@apollo/client@^3.11.0` (current peer dep)                                                    |
| Type-check fails after schema change                   | Consumer is on an older `@adaptic/backend-legacy` version                                     | Bump consumer dep version; rebuild                                                                    |
| Stale enum values after schema change                  | Consumer hasn't reinstalled `@adaptic/backend-legacy` after publish                           | `npm install` / `yarn install` in the consumer; rebuild                                               |

For deeper failure modes (Prisma generation errors, codegen drift, audit-plugin
issues), see [`docs/DEBUGGING_PLAYBOOK.md`](./DEBUGGING_PLAYBOOK.md).

---

## Versioning

The package is published on every push to `main` (npm dist-tag `latest`) and
`stable-release` (dist-tag `stable`). CI bumps the patch version and runs
`npm publish`. Consumers track the channel that matches their stability
posture:

| Channel              | Use when                                                                  |
| -------------------- | ------------------------------------------------------------------------- |
| `@adaptic/backend-legacy@latest` | Active development; tracks `main`                            |
| `@adaptic/backend-legacy@stable` | Production deploys; tracks the `stable-release` branch        |

The current `latest` version is `0.0.984` (2026-05-22). Re-verify with
`npm view @adaptic/backend-legacy version` rather than trusting this number
in older copies of the doc.

---

## Where to make schema changes

`backend-legacy` is the only place to add Tier B models (User, Trade, Policy,
AuditLog, etc.). Tier A telemetry models go in `engine/prisma/schema.prisma`.
If in doubt about which tier a new feature belongs to, ask:

- Does it record identity, audit, regulatory, or trade-lifecycle state? -> Tier B.
- Is it an engine-internal counter, cache, event-source row, decision-memory
  entry, or ML-governance row? -> Tier A.

See the [Schema-ownership boundary](#schema-ownership-boundary-tier-a-vs-tier-b)
section above for the canonical statement of the rule.
