# CLAUDE.md — @adaptic/backend-legacy

Root of the type chain and system-of-record for all Adaptic-domain data: the Prisma schema, the TypeGraphQL/Apollo server, and the codegen pipeline that produces the `adaptic.*` CRUD functions, types, selection sets, and typeStrings every other repo consumes. **Highest blast radius in the workspace** — the generated surface IS the monorepo's contract. The root `~/adapticai/CLAUDE.md` loads alongside this file and carries the shared standards (ownership doctrine, code standards, delivery bar, trading doctrines, publish chain, GitNexus/Graphify usage); this file adds only what is backend-legacy-specific.

## Commands

```bash
npm run build            # full pipeline (below) — required after ANY schema or directive change
npm run validate:schema  # validate + generate + drift detection
npm run migrate:dev      # prisma migrate dev + deploy   (migrate = deploy only)
npm run lint && npm run test
npx vitest run src/tests/<file>.test.ts   # single test
```

Coverage floors: 60% lines / 50% functions / 40% branches (generated code, modules, resolvers excluded). Dual build: `tsc` → CJS `dist/`, `tsconfig.server.json` → ESM `dist/server/`. Never cite cached model/enum/migration counts — `grep -c '^model ' prisma/schema.prisma` when a number matters.

## Codegen pipeline (order matters; `npm run build` runs it all)

`prisma/schema.prisma` → 1. `prisma generate` (typegraphql-prisma models/resolvers/enums) → 2. `fix-import-paths.cjs` → 3. `generateSelections.ts` → `src/generated/selectionSets/` → 4. `generator.ts` → one CRUD file per model → 5. `generateStrings.ts` → `src/generated/typeStrings/`.

Adding/changing a field: edit schema → `npm run build` → publish → bump consumers (propagation chain in the root file, with downstream typecheck for any schema/type change). Published surface: `types` / `enums` / `typeStrings` namespaces, `adaptic.<model>.<op>()`, `getApolloClient()` / `getApolloModules()` / `setTokenProvider()` / `configureConnectionPool()`, custom resolvers.

## GQL inline directives — the curation mechanic (`prisma/schema.prisma` is the single source of truth)

`///` doc comments on fields control what codegen emits:

| Directive                      | Scope    | Effect                                                |
| ------------------------------ | -------- | ----------------------------------------------------- |
| `GQL.SKIP=true`                | any      | omit the field from generated selection sets entirely |
| `GQL.EXCLUDE=['f1','f2']`      | relation | include the relation minus the listed sub-fields      |
| `GQL.INCLUDE=['f1','f2']`      | relation | whitelist — only the listed sub-fields appear         |
| `GQL.MAX_DEPTH=N`              | relation | override the default nesting depth (4)                |
| `TYPESTRING.SKIP` / `.INCLUDE` | any      | same curation for LLM-context typeStrings             |

Gotchas: **directives never propagate to sibling fields** — each field needs its own comment; security-sensitive fields (API keys, tokens, secrets) always get `GQL.SKIP=true`; add an exclusion only after proving no consumer reads the field (search `adaptic.<model>.*` call sites across repos); after any comment change, regenerate (`npm run build`, or at minimum `generate:selections`) and inspect `src/generated/selectionSets/<Model>.ts` before publishing.

## Engineering rules (backend-legacy register — generic rules live in `../docs/ENGINEERING_DOCTRINE.md` and the root file)

1. **Invalid financial/lifecycle states become unrepresentable at the schema**: enums, explicit lifecycle variants, non-null invariants — not optional-field bags validated downstream. A weakly-modeled type here is institutional debt in six repos.
2. Resolvers are the effect boundary: extract validation / authorization / allocation predicates into pure functions unit-testable without a DB; normalize DB/broker/GraphQL failures into typed `BaseError`/`AppError` — no Prisma or vendor exception detail leaks into the generated surface.
3. **The generated surface is behavior.** A mechanical change that moves types, CRUD, selection sets, or typeStrings is a monorepo-wide behavioral change — never ship it under a refactor; review it as the contract change it is.
4. This package owns the provenance store (`SignalLineage`, `SignalOutcome`, `MLModelVersion`, `ModelArtifact`, `AuditLog`, `TradeAuditEvent`) — model it strongly enough that any engine decision traces to model, version, prompt, and inputs months later.
5. Pass `now`, auth context, and clients in; use the established singletons (`getApolloClient()`, `prismaClient`) rather than bypassing them.
6. This GraphQL server fronts the whole platform: benchmark before/after any change on the resolver · Apollo · Prisma · codegen path.
7. Double-sensitive mutations carry idempotency keys. Invariant tests (allocation sums, `filledQuantity ≤ quantity`, order-state transitions, serialization round-trips) are mutation-proven, and `engine`/`utils` must still typecheck after any schema or type change.

Debugging sequence for package issues: `npm run validate:schema` → `npm run generate` → inspect `src/generated/` → confirm selectionSet strings match current schema fields → check migration status → verify `src/index.ts` imports match generated model files.

## Environment

Required: `DATABASE_URL` + `DIRECT_DATABASE_URL` (PostgreSQL via Prisma Accelerate); `JWT_SECRET` in production (min 32 chars enforced; `NEXTAUTH_SECRET` fallback). Tuning vars (pool, rate limits, GraphQL depth/complexity, APQ, OTel, Prometheus) are read in `src/config/` — check code for names and defaults rather than a cached table.

## Deployment & publish triggers

Railway-hosted; `GET /health` unauthenticated, `POST /graphql` Bearer-auth, WS subscriptions at `/subscriptions`. `.github/workflows/publish.yml` (branches `main`, `stable-release`, `platform-alignment`) is paths-filtered — docs-only pushes skip the ~20-min pipeline — but **actual publishing is gated by a dist-content diff** against the published npm tarball: it version-bumps and publishes only when `dist/` content differs (or `always-build-npm` is set in `package-npm.json`). **`README-npm.md` IS publish-relevant** (copied to `dist/README.md`); root `README.md` is not.

Before pushing: confirm the intended channel (`main` → `@latest`, `stable-release` → `@stable`) matches your deployment intent, and do not push schema changes while any consumer repo shows `DIRTY_TREE` — your published change will collide with their in-flight work. Close per the root final-response rule, plus publish status and the versions consumers were bumped to.

## Codebase graph

Codegen emits one near-identical file per model — hundreds of them — so grep is noisy here; the graph answers "what imports / generates / calls X" precisely: `graphify query "<q>" --graph graphify-out/graph.json`; refresh via `../scripts/graphify-refresh.sh backend-legacy`. Usage and caveats in the root file.

---

Keep this file to backend-legacy deltas only — shared rules live in the root file; no point-in-time counts or file-by-file tables (its own history shows they're the first thing to go stale).
