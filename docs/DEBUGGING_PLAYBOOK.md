# Backend-Legacy Debugging Playbook

This playbook covers the most common failure modes in the backend-legacy package and how to resolve them. The package owns the Prisma schema (67 models, 73 enums as of 2026-05-22; verify with `grep -c '^model ' prisma/schema.prisma` and `grep -c '^enum ' prisma/schema.prisma`), the codegen pipeline, and type exports consumed by engine, utils, and platform.

---

## Prisma Generate Fails

**Symptoms:** `npm run generate` exits with an error before producing `src/generated/typegraphql-prisma/`.

**Diagnostic steps:**

1. Validate schema syntax independently:
   ```bash
   npx prisma validate
   ```
2. Check the schema file for syntax errors:
   ```bash
   # Opens the schema at prisma/schema.prisma
   npx prisma format   # auto-formats and reveals parse errors
   ```
3. Verify the PostgreSQL connection string is set in `.env` (needed by some Prisma commands, though `generate --no-engine` does not connect to the database).
4. Search for duplicate model or enum names:
   ```bash
   grep -n '^model ' prisma/schema.prisma | sort -t' ' -k2 | uniq -d -f1
   grep -n '^enum ' prisma/schema.prisma | sort -t' ' -k2 | uniq -d -f1
   ```
5. Verify every relation field has a matching `@relation` directive with correct `fields` and `references`.
6. Confirm every model has exactly one `@id` field (or a compound `@@id`).

**Common causes:**

- Malformed `@relation` directive (missing `fields` or `references`)
- Missing `@id` on a model
- Duplicate model/enum names after a merge
- Unsupported Prisma type syntax after a Prisma version bump

---

## Codegen Pipeline Fails

The full build pipeline runs in this order (see `package.json` `build` script):

```
clean -> generate -> fix-imports -> generate:selections -> generate:functions -> generate:strings -> tsc -> build:server
```

**Diagnostic steps:**

1. Identify which stage failed. Run each stage individually:
   ```bash
   npm run clean
   npm run generate                # Prisma generate (produces src/generated/typegraphql-prisma/)
   npm run fix-imports             # Patches import paths (fix-import-paths.cjs)
   npm run generate:selections     # Produces src/generated/selectionSets/ from DMMF
   npm run generate:functions      # Produces model CRUD functions from src/modules/index.ts
   npm run generate:strings        # Produces src/generated/typeStrings/ from DMMF
   ```
2. If `generate:selections` or `generate:strings` fails, they both use `@prisma/internals` `getDMMF()` to parse the schema. Check that:
   - `prisma/schema.prisma` is valid (step 1 above)
   - `@prisma/internals` version matches `@prisma/client` version (currently both should be `^6.19.2`)
3. If `generate:functions` fails, check `src/modules/index.ts`:
   - It reads from `src/generated/typegraphql-prisma/models/` -- that directory must exist (run `npm run generate` first)
   - It also reads from `src/generated/typegraphql-prisma/resolvers/inputs/`
   - Check for models that produce null from `generateModelFunctions()` (logged as skipped)
4. Check for circular type references in the Prisma schema that cause infinite loops in codegen (the generators use `MAX_DEPTH` of 4-5 to prevent this).
5. If `fix-imports` fails, check `fix-import-paths.cjs` for path patterns that no longer match generated output.

**Common causes:**

- Running codegen stages out of order (most common: skipping `npm run generate` before `generate:functions`)
- Prisma version mismatch between `@prisma/client`, `prisma`, `@prisma/internals`, and `@prisma/generator-helper`
- A new model with deeply nested self-referential relations exceeding MAX_DEPTH
- Missing `src/generated/` directory (run `npm run generate` first)

---

## Migration Issues

**Diagnostic steps:**

1. Check migration status:
   ```bash
   npx prisma migrate status
   ```
2. For development, use `npm run migrate:dev` (runs `prisma migrate dev` then `prisma migrate deploy`).
3. For production/CI, use `npm run migrate` (runs `prisma migrate deploy` only).
4. If a migration is stuck or failed:
   - Check the `_prisma_migrations` table in the database for failed entries
   - Verify no migration SQL files in `prisma/migrations/` have been manually edited after creation
   - Check for data that would violate new constraints (NOT NULL on existing rows, unique constraints on duplicate data)
5. For conflicting migrations (common after branch merges):
   ```bash
   npx prisma migrate resolve --applied <migration_name>   # Mark as applied
   npx prisma migrate resolve --rolled-back <migration_name>  # Mark as rolled back
   ```

**Common causes:**

- Edited migration file after creation (Prisma checksums will fail)
- Constraint violation on existing data (adding NOT NULL without a default)
- Conflicting migrations from parallel branches
- Database connection timeout or permission issues

---

## Type Export Issues

The package publishes types via `dist/index.d.ts` (see `package.json` `types` field). The build compiles from `src/` to `dist/` using `tsconfig.json`.

**Diagnostic steps:**

1. Run a full build:
   ```bash
   npm run build
   ```
2. Verify generated types are included in the build output:
   ```bash
   ls dist/generated/typegraphql-prisma/models/
   ls dist/generated/selectionSets/
   ls dist/generated/typeStrings/
   ```
3. Check that `tsconfig.json` includes generated files:
   - `include` should contain `src/generated/typegraphql-prisma/**/*.ts`
   - `exclude` should NOT contain `src/generated/`
4. Verify `package.json` `files` array includes the right dist paths:
   ```json
   "files": ["dist/**/*.js", "dist/**/*.d.ts", "dist/**/*.js.map"]
   ```
5. Test the import from a consuming package:
   ```typescript
   import { types, enums } from '@adaptic/backend-legacy';
   ```

**Common causes:**

- Generated files not included in tsconfig `include` patterns
- Build not run after schema changes (stale `dist/`)
- `package.json` `files` field missing a pattern
- TypeScript `declaration: true` not set (it is set in this project)

---

## Consumer Package Type Errors

When engine, utils, or other consumers report type errors after a backend-legacy change.

**Diagnostic steps:**

1. Rebuild backend-legacy first:
   ```bash
   cd backend-legacy && npm run build
   ```
2. Check the consumer is importing from the correct path:
   - Types: `import { types } from '@adaptic/backend-legacy'`
   - Enums: `import { enums } from '@adaptic/backend-legacy'`
3. Verify version alignment: the consumer's `package.json` should reference the same version of `@adaptic/backend-legacy` that was just built.
4. Check for type resolution conflicts -- if the consumer also depends on `@prisma/client`, its Prisma version must match backend-legacy's (`^6.19.2`).
5. If types seem stale, regenerate:
   ```bash
   cd backend-legacy && npm run generate && npm run build
   ```
6. In the engine, verify `@adaptic/backend-legacy` is linked (not a stale cached npm version):
   ```bash
   ls -la node_modules/@adaptic/backend-legacy
   ```

**Common causes:**

- Consumer not rebuilt after backend-legacy changes
- Prisma version drift between packages
- Stale `node_modules/@adaptic/backend-legacy` (needs reinstall or link)
- New enum values not recognized by consumer code

---

## Selection Set Issues

Selection sets are generated from the Prisma DMMF into `src/generated/selectionSets/`. They define which fields to fetch in GraphQL queries.

**Diagnostic steps:**

1. Regenerate selection sets:
   ```bash
   npm run generate:selections
   ```
2. Check the generated output in `src/generated/selectionSets/` for the model in question.
3. Verify new fields added to the schema are included. The generator uses `MAX_DEPTH = 4` for nested relations -- deeply nested fields may be excluded by design.
4. Check for `@GQL.SKIP` comments in the schema that exclude certain fields from selection sets.
5. If a field appears in the schema but not in the selection set, check whether it is a relation that exceeds the depth limit or is explicitly excluded.

**Common causes:**

- Schema changed but `npm run generate:selections` not re-run
- New relation field exceeds MAX_DEPTH (4 levels)
- Field excluded by `@GQL.SKIP` or `@GQL.EXCLUDE` meta-tags in schema comments
- Circular relation causing the generator to stop recursion

---

## Schema Validation in CI

The project includes a schema validation script at `scripts/validate-schema.sh` (also available as `npm run validate:schema`). It performs three checks:

1. `npx prisma validate` -- schema syntax
2. `npx prisma generate --no-engine` -- code generation
3. `git diff --quiet -- src/generated/` -- drift detection (exit code 2 if drift found)

If CI fails with exit code 2, it means the schema was changed but generated code was not regenerated and committed. Fix:

```bash
npm run generate
git add src/generated/
git commit -m "Regenerate after schema change"
```

---

## Quick Reference: Build Command Chain

```
npm run build
  |-> clean          (rm -rf dist && rm -rf src/generated)
  |-> generate       (prisma generate --no-engine)
  |-> fix-imports    (node fix-import-paths.cjs)
  |-> generate:selections  (ts-node src/modules/generateSelections.ts)
  |-> generate:functions   (ts-node src/modules/index.ts)
  |-> generate:strings     (ts-node src/modules/generateStrings.ts)
  |-> tsc            (TypeScript compile to dist/)
  |-> build:server   (tsc --project tsconfig.server.json)
```

If any step fails, subsequent steps will not run. Always debug starting from the first failing step.
