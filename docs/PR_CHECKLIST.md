# Backend-Legacy PR Checklist

Use this checklist before opening or approving a PR that touches the backend-legacy package.

---

## General (All PRs)

- [ ] `npm run build` passes (runs the full pipeline: clean, generate, fix-imports, selections, functions, strings, tsc)
- [ ] `npm run test` passes (all Vitest tests across 11 test files)
- [ ] `npm run test:coverage` meets thresholds (60% lines, 50% functions, 40% branches, 60% statements)
- [ ] No lint errors: `npm run lint`
- [ ] No manual edits to files in `src/generated/` (these are auto-generated)
- [ ] No `any` types, `eslint-disable`, or `@ts-ignore`
- [ ] No `console.log` in production code (use the logger)
- [ ] No hardcoded secrets or connection strings

---

## For Schema Changes (`prisma/schema.prisma`)

- [ ] Schema validates: `npx prisma validate`
- [ ] Full codegen pipeline runs successfully:
  - `npm run generate` (Prisma generate)
  - `npm run generate:selections` (selection sets from DMMF)
  - `npm run generate:functions` (model CRUD functions)
  - `npm run generate:strings` (type string utilities)
- [ ] Schema validation script passes: `npm run validate:schema`
- [ ] No generated code drift (generated files committed after regeneration)
- [ ] All new fields have defaults or are optional (to avoid breaking existing data)
- [ ] Relations properly defined with `@relation` (correct `fields` and `references`)
- [ ] Indexes added where needed (`@index`, `@@index`)
- [ ] New enum values do not break existing data or consumer code
- [ ] Selection sets updated for new fields (check `src/generated/selectionSets/`)

---

## For Migration Changes (`prisma/migrations/`)

- [ ] Migration files created via `npx prisma migrate dev` (not manually written)
- [ ] Migration files not modified after creation (Prisma checksums will fail)
- [ ] Migration tested on a dev database: `npm run migrate:dev`
- [ ] Production deploy tested: `npm run migrate` (runs `prisma migrate deploy`)
- [ ] Backward-compatible changes preferred (add columns as optional, then backfill)
- [ ] Breaking changes documented with a migration plan
- [ ] Data constraints verified (NOT NULL with default, unique on non-duplicate data)

---

## For Codegen Module Changes (`src/modules/`)

- [ ] Generator tests pass: `npx vitest run src/tests/generator.test.ts`
- [ ] Parser tests pass: `npx vitest run src/tests/parser.test.ts`
- [ ] Full build succeeds with the changed generator
- [ ] Generated output diff reviewed (run `npm run build` and check `git diff`)
- [ ] MAX_DEPTH changes justified (currently 4 for selections, 5 for strings)

---

## For Plugin/Middleware Changes

- [ ] Relevant tests pass:
  - Plugins: `npx vitest run src/plugins/__tests__/`
  - Middleware: `npx vitest run src/middleware/__tests__/`
  - Validators: `npx vitest run src/validators/`
- [ ] No regressions in error sanitization (sensitive data must not leak to clients)
- [ ] Query depth limits still enforced
- [ ] Audit logging captures the correct request/response data

---

## Consumer Package Impact

- [ ] Impact on consuming packages assessed:
  - **engine** -- depends on `@adaptic/backend-legacy` for types and codegen output
  - **utils** -- depends on `@adaptic/backend-legacy` for types
  - **platform** -- consumes types at runtime via GraphQL (no build-time dep)
- [ ] Consumer packages still build after changes:
  ```bash
  cd ../engine && yarn build
  cd ../utils && npm run build
  ```
- [ ] No breaking type changes without coordinated updates to consumers
- [ ] New exports added to `src/index.ts` (auto-generated) are intentional

---

## Version and Release

- [ ] `package.json` version handled by the publish workflow (no need to bump manually; CI bumps + publishes on push to `main` / `stable-release`)
- [ ] Changelog or PR description documents user-facing changes
- [ ] Prisma version aligned across the dependency chain:
  - `@prisma/client`: `^6.19.2`
  - `prisma`: `^6.19.2`
  - `@prisma/internals`: `^6.19.2`
  - `@prisma/generator-helper`: `^6.19.2`
