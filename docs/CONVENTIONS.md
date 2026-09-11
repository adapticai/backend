# Backend-Legacy Conventions

## Schema Changes

- All model changes start in `prisma/schema.prisma`. This is the single source of truth for the entire Adaptic.ai platform.
- Run `npm run generate` after every schema change to regenerate TypeGraphQL types.
- Run `npm run generate:selections` to regenerate GraphQL selection set strings.
- Run `npm run generate:functions` to regenerate per-model CRUD files and `src/index.ts`.
- Run `npm run generate:strings` to regenerate LLM type string representations.
- Or run `npm run build` to execute the full pipeline in the correct order.
- Update selectionSet strings when adding fields (handled automatically by `generate:selections`).
- NEVER modify generated files directly -- they will be overwritten on next build.

## Naming

- **Models:** PascalCase, matching Prisma schema names (e.g., `BrokerageAccount`, `TradeExecutionHistory`).
- **Enums:** PascalCase for the enum name, `UPPER_SNAKE_CASE` for values (e.g., `ActionStatus.EXECUTED`).
- **Fields:** camelCase in Prisma schema and generated types (e.g., `providerAccountId`, `createdAt`).
- **Relations:** Named clearly to indicate the relationship direction and cardinality (e.g., `user User @relation(...)`, `trades Trade[]`).
- **Generated CRUD files:** PascalCase matching the model name (e.g., `Account.ts`, `Trade.ts`), placed directly in `src/`.
- **Selection sets:** Same PascalCase name as the model, exported as a string constant.
- **Type strings:** `{ModelName}TypeString` (e.g., `AccountTypeString`, `TradeTypeString`).

## Codegen

- Generated code should never be manually edited. The following directories are fully generated:
  - `src/generated/typegraphql-prisma/` (by `prisma generate`)
  - `src/generated/selectionSets/` (by `generate:selections`)
  - `src/generated/typeStrings/` (by `generate:strings`)
  - `src/[A-Z]*.ts` (by `generate:functions`, one PascalCase model CRUD file per Prisma model; 67 files as of 2026-05-22)
  - `src/index.ts` (by `generate:functions`)
- Codegen pipeline order (must run sequentially):
  1. `prisma generate` -- TypeGraphQL models, enums, resolvers, inputs from schema
  2. `fix-import-paths.cjs` -- Correct import paths in generated TypeGraphQL output
  3. `generate:selections` -- GraphQL selection set strings from Prisma DMMF
  4. `generate:functions` -- Per-model CRUD function files + index.ts from generated models/inputs
  5. `generate:strings` -- TypeScript type-as-string files from Prisma DMMF
- If generated output is wrong, fix the generator input (schema) or config (generator scripts), not the output.
- Always run the full pipeline before committing schema-related changes.

## Migrations

- Use `npm run migrate:dev` for development migrations (runs `prisma migrate dev` then `prisma migrate deploy`).
- Use `npm run migrate` (deploy only) for production.
- Migration files should never be modified after creation. There are 165 migrations in the history (as of 2026-05-22; verify with `ls prisma/migrations/ | wc -l`).
- Name migrations descriptively when prompted by Prisma (e.g., `added_fund_model`, `align_to_authjs`).
- Always test migrations on dev before applying to production.
- For non-trivial schema changes (field removal, type changes, model renames), plan a rollback strategy.

## Type Exports

- All canonical types exported from the package root via `src/index.ts`:
  - `types` namespace -- All Prisma model types (67 as of 2026-05-22)
  - `enums` namespace -- All Prisma enums (73 as of 2026-05-22)
  - `typeStrings` -- String representations of types (for LLM context)
- Per-model CRUD functions exported as named exports (e.g., `Account.create()`, `Trade.get()`).
- Apollo Client utilities exported: `getApolloClient`, `getApolloModules`, `setTokenProvider`, `configureConnectionPool`.
- Selection sets exported from `src/generated/selectionSets/index.ts` for consumer convenience.
- Custom resolvers exported from `src/resolvers/custom/index.ts`.

## Testing

- **Framework:** Vitest (configured in `vitest.config.ts`).
- **Test locations:**
  - `src/tests/` -- Core unit tests (generator, parser, utils, connection pool, validation)
  - `src/middleware/__tests__/` -- Middleware unit tests
  - `src/plugins/__tests__/` -- Plugin unit tests
  - `src/validators/` -- Co-located validator tests (e.g., `allocation-validator.test.ts`)
- **Coverage thresholds:** 60% lines, 50% functions, 40% branches, 60% statements.
- **Excluded from coverage:** generated code (`src/generated/`), codegen scripts (`src/modules/`), resolvers.
- Run all tests: `npm run test`
- Run single test: `npx vitest run src/tests/[test-file].test.ts`
- Run in watch mode: `npm run test:watch`
- Run with coverage: `npm run test:coverage`

## ESLint

- Flat config in `eslint.config.mjs` with TypeScript strict checking.
- Generated code is fully ignored: `src/generated/**`, `src/[A-Z]*.ts`, `src/modules/**`.
- Key enforced rules:
  - `@typescript-eslint/no-explicit-any: warn` (warn, not error, due to generated code patterns)
  - `@typescript-eslint/no-floating-promises: error`
  - `no-console: error` (except `warn` and `error`)
  - `no-debugger: error`
  - `no-eval: error`
  - `no-var: error`
- Test files have relaxed rules (no-console off, any warn instead of error).

## TypeScript Configuration

- **Target:** ES2018
- **Module:** CommonJS (main build), ESNext (server build via `tsconfig.server.json`)
- **Strict mode:** Enabled
- **Decorators:** `experimentalDecorators` and `emitDecoratorMetadata` enabled (required by TypeGraphQL)
- **Path alias:** `@/*` maps to `./src/*`
- **Excluded from compilation:** `node_modules`, test files (`**/*.test.ts`), codegen scripts (`src/modules/**/*.ts`)
- **Included explicitly:** `src/generated/typegraphql-prisma/**/*.ts`

## Apollo Server

- Apollo Server 5 with Express 4 integration (`@as-integrations/express4`).
- WebSocket subscriptions via `graphql-ws`.
- JWT authentication middleware on all requests.
- Middleware stack: auth -> rate-limiter -> input-validator -> query-complexity -> audit-logger.
- Plugins: error-sanitizer, query-depth-limiter, persisted queries.
- CORS configured via `ALLOWED_ORIGINS` environment variable.

## Prisma Client

- Singleton pattern via `global.prisma` (prevents connection exhaustion during hot reloads).
- Prisma Accelerate extension enabled for connection pooling and edge caching.
- Connection pool size configurable via `DATABASE_POOL_SIZE` (defaults: dev=5, staging=10, production=20).
- Pool timeout configurable via `DATABASE_POOL_TIMEOUT_MS` (default: 10000ms).
- Error and warning event handlers for pool exhaustion detection.

## Code Style

- 2-space indentation, single quotes, semicolons required.
- camelCase for variables and functions, PascalCase for classes, interfaces, and models.
- `UPPER_SNAKE_CASE` for constants and enum values.
- Arrow functions with parentheses: `(arg) => {}`.
- Absolute imports with `@/*` path alias.
- JSDoc comments for all exported functions and types.
- Async/await for asynchronous operations, try/catch for error handling.
- External library imports first, then local module imports.
