# Backend-Legacy 2026-05-22 Readability Sweep — Archive

This directory holds documents archived during the 2026-05-22 backend-legacy
agentic-readability sweep. They reflect prior-generation snapshots (typically the
2026-02-08 architecture campaign) and are retained for historical context. **Do
not treat them as current state.** Live architecture documentation lives under
`docs/ARCHITECTURE.md`, `docs/REPO_MAP.md`, and the package-root `CLAUDE.md`.

## Contents

| File                            | Original location                | Reason archived                                                                                                                      |
| ------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `CURRENT-ARCHITECTURE.md`       | repo root                        | Dated 2026-02-08, superseded by `docs/ARCHITECTURE.md`. Cites stale counts (54 models / 53 enums / 139 migrations / v0.0.43).        |
| `TARGET-STATE-ARCHITECTURE.md`  | repo root                        | Dated 2026-02-08. Marks many P2 features (tracing, metrics, APQ, query complexity, validation) as "IMPLEMENTED" but several were never wired into `src/server.ts`. See "Dormant infrastructure" below for the 2026-05-22 wire/delete decisions. |
| `VALIDATION_IMPLEMENTATION.md`  | repo root                        | Point-in-time task-completion record for input-validation work. Content now covered by source-level JSDoc and `docs/ARCHITECTURE.md`. |

## Dormant infrastructure (2026-05-22 decisions)

The TARGET-STATE document claimed the following were "IMPLEMENTED" — in reality
the implementations existed in `src/` but had never been wired into
`src/server.ts`. As part of the 2026-05-22 sweep we audited each and made an
explicit wire-or-delete call:

| Feature                   | Source file                                         | Decision      | Rationale                                                                                                  |
| ------------------------- | --------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| OpenTelemetry tracing     | `src/config/tracing.ts`                             | **Wire**      | Already env-flag-gated (`OTEL_TRACING_ENABLED`); `shutdownTracing()` was already called in `server.ts`. Only `initTracing()` was missing — registered at the top of `startServer()`. |
| Prometheus metrics        | `src/config/metrics.ts`                             | **Wire**      | Self-contained, env-flag-gated (`PROMETHEUS_METRICS_ENABLED`). Added `initMetrics()` + `metricsMiddleware` + `createMetricsPlugin()` + `createMetricsRouter()` to server bootstrap. |
| Automatic Persisted Queries | `src/config/persisted-queries.ts`                 | **Wire**      | Audit suggested deletion citing "requires Redis"; verified the implementation is fully in-memory LRU. Wired into Apollo Server via the `persistedQueries` option, gated by `APQ_ENABLED`. |
| Query complexity / depth  | `src/middleware/query-complexity.ts`                | **Wire**      | Single Apollo plugin import. Wired into the plugins array; gated by `GRAPHQL_COMPLEXITY_ENABLED` (defaults on in production/staging). |
| GraphQL validation plugin | `src/middleware/graphql-validation-plugin.ts`       | **Wire**      | Already implemented. Wired into the plugins array.                                                          |

All wiring is gated by existing environment variables documented in
`docs/ENVIRONMENT_SETUP.md` and the package `CLAUDE.md`. No new dependencies
were introduced — each feature's deps were already in `package.json`.
