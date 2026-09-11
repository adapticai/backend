# Backend-Legacy Testing Strategy

## Framework

**Vitest** is the test runner (configured in `vitest.config.ts`). Tests use the `node` environment with `globals: true` and a 10-second timeout for both tests and hooks.

## Test Files

There are 11 test files across 4 directories:

| Directory                   | Files                                                                                                                                             | Scope                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/tests/`                | `connection-pool.test.ts`, `generator.test.ts`, `graphql-validation-plugin.test.ts`, `input-validator.test.ts`, `parser.test.ts`, `utils.test.ts` | Core codegen pipeline, parser, utilities, connection pooling |
| `src/plugins/__tests__/`    | `error-sanitizer.test.ts`, `query-depth-limiter.test.ts`                                                                                          | Apollo Server plugins                                        |
| `src/middleware/__tests__/` | `audit-logger.test.ts`, `soft-delete.test.ts`                                                                                                     | Express middleware                                           |
| `src/validators/`           | `allocation-validator.test.ts`                                                                                                                    | Business logic validators                                    |

## Commands

```bash
# Run all tests
npm run test

# Run all tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run a single test file
npx vitest run src/tests/generator.test.ts

# Run tests matching a pattern
npx vitest run --reporter=verbose -t "pattern"
```

Note: The CLAUDE.md mentions `npx jest` for single-file runs, but the project uses Vitest. Use `npx vitest run` instead.

## Test Inclusion/Exclusion

From `vitest.config.ts`:

- **Included:** `src/**/*.test.ts`, `src/**/*.spec.ts`
- **Excluded:** `node_modules`, `dist`, `src/generated/**`, `src/modules/**`

Generated code and codegen modules are excluded from test discovery (they are tested indirectly via the codegen pipeline tests in `src/tests/`).

## Coverage

Coverage is configured with V8 provider. Current thresholds:

| Metric     | Threshold |
| ---------- | --------- |
| Lines      | 60%       |
| Functions  | 50%       |
| Branches   | 40%       |
| Statements | 60%       |

Coverage excludes: test files, generated code (`src/generated/`), codegen modules (`src/modules/`), and resolvers (`src/resolvers/`).

Reports are generated in `./coverage/` in text, JSON, LCOV, and HTML formats.

## Test Types

### Codegen Pipeline Tests

- `generator.test.ts` -- verifies `generateModelFunctions()` produces correct CRUD function files
- `parser.test.ts` -- verifies Prisma schema parsing and DMMF extraction
- `utils.test.ts` -- tests codegen utility functions

### Validation Tests

- `input-validator.test.ts` -- validates GraphQL input sanitization and type coercion
- `graphql-validation-plugin.test.ts` -- tests the GraphQL validation Apollo plugin
- `allocation-validator.test.ts` -- tests business-rule validation for fund allocations

### Infrastructure Tests

- `connection-pool.test.ts` -- tests Prisma connection pool configuration and behavior
- `error-sanitizer.test.ts` -- verifies error messages are sanitized before reaching clients
- `query-depth-limiter.test.ts` -- tests GraphQL query depth limiting
- `audit-logger.test.ts` -- tests request/response audit logging middleware
- `soft-delete.test.ts` -- tests Prisma middleware for soft-delete behavior

## What to Test When Making Changes

### After Schema Changes

- Run `npm run build` (full pipeline) to verify codegen succeeds
- Run `npm run test` to ensure no tests break
- Run `npm run validate:schema` to check for drift
- Verify selection sets include new fields: check `src/generated/selectionSets/`

### After Codegen Module Changes

- Run the specific generator: `npm run generate:functions`, `generate:selections`, or `generate:strings`
- Run `npm run test` -- especially `generator.test.ts` and `parser.test.ts`
- Run a full build to ensure generated output compiles

### After Plugin/Middleware Changes

- Run the relevant test file directly for fast feedback:
  ```bash
  npx vitest run src/plugins/__tests__/error-sanitizer.test.ts
  npx vitest run src/middleware/__tests__/audit-logger.test.ts
  ```
- Then run the full suite: `npm run test`

### After Dependency Updates

- Run `npm run build` to verify Prisma version compatibility
- Run `npm run test` to catch runtime incompatibilities
- If Prisma was updated, verify `@prisma/client`, `prisma`, `@prisma/internals`, and `@prisma/generator-helper` all align

## Done Criteria

A change is ready for PR when:

- All tests pass: `npm run test`
- Full build succeeds: `npm run build`
- No type errors: `tsc --noEmit` (or the build itself passes)
- Coverage thresholds met: `npm run test:coverage`
- Schema validates: `npm run validate:schema` (if schema was changed)
- No drift in generated code (CI will catch this via `scripts/validate-schema.sh`)
