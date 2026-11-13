import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';

/**
 * Every enum value the Prisma client accepts must exist, ON ITS OWN ENUM, in a
 * database built from the migration history.
 *
 * `prisma migrate deploy` is the only path that changes the production schema,
 * so a value added to `prisma/schema.prisma` without a migration is accepted by
 * the generated client and the GraphQL inputs and then rejected by Postgres on
 * the first write that uses it (`invalid input value for enum`).
 *
 * This is the static, database-free half of the check. It replays the enum DDL
 * of every migration in order — `CREATE TYPE "E" AS ENUM (…)` (including the
 * `DO $$ … duplicate_object` form, which is a no-op when the type exists),
 * `ALTER TYPE "E" ADD VALUE [IF NOT EXISTS] 'v'`, `ALTER TYPE "E" RENAME VALUE
 * 'a' TO 'b'`, `ALTER TYPE "E" RENAME TO "F"` and `DROP TYPE` (the
 * create-`_new` / rename / drop-`_old` recreation Prisma emits to remove a
 * value) — and asserts, per enum, that the schema's values are a subset of the
 * replayed set. A value is credited only to the enum its statement names, so
 * a value two enums share cannot stand in for the other. The complete check is
 * `prisma migrate diff --from-migrations prisma/migrations
 * --to-schema-datamodel prisma/schema.prisma`, which needs a shadow database.
 */

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'prisma', 'migrations');

/** A type name, optionally schema-qualified: `"E"` or `"public"."E"`. */
const TYPE_NAME = String.raw`(?:"[^"]+"\.)?"([^"]+)"`;

/** One enum DDL statement, in the order it runs. */
const ENUM_DDL = new RegExp(
  [
    String.raw`CREATE\s+TYPE\s+${TYPE_NAME}\s+AS\s+ENUM\s*\(([^)]*)\)`,
    String.raw`ALTER\s+TYPE\s+${TYPE_NAME}\s+ADD\s+VALUE\s+(?:IF\s+NOT\s+EXISTS\s+)?'((?:[^']|'')*)'`,
    String.raw`ALTER\s+TYPE\s+${TYPE_NAME}\s+RENAME\s+VALUE\s+'((?:[^']|'')*)'\s+TO\s+'((?:[^']|'')*)'`,
    String.raw`ALTER\s+TYPE\s+${TYPE_NAME}\s+RENAME\s+TO\s+"([^"]+)"`,
    String.raw`DROP\s+TYPE\s+(?:IF\s+EXISTS\s+)?((?:(?:"[^"]+"\.)?"[^"]+"\s*,?\s*)+)`,
  ].join('|'),
  'gi'
);

const QUOTED_VALUE = /'((?:[^']|'')*)'/g;
const QUOTED_TYPE = /(?:"[^"]+"\.)?"([^"]+)"/g;

function unquote(value: string): string {
  return value.replace(/''/g, "'");
}

/** Remove `--` comments, so a value named only in prose does not count. */
function stripComments(sql: string): string {
  return sql
    .split('\n')
    .map((line) => line.replace(/--.*$/, ''))
    .join('\n');
}

/**
 * Replay the enum DDL in `sqlInOrder` and return every enum's values.
 *
 * @param sqlInOrder - Migration SQL, oldest first.
 * @returns Enum name to its set of values after the last statement.
 */
function replayEnumDdl(
  sqlInOrder: readonly string[]
): Map<string, Set<string>> {
  const enums = new Map<string, Set<string>>();
  for (const raw of sqlInOrder) {
    const sql = stripComments(raw);
    for (const m of sql.matchAll(ENUM_DDL)) {
      const [
        ,
        createName,
        createValues,
        addName,
        addValue,
        renValName,
        renFrom,
        renTo,
        renName,
        renTarget,
        dropList,
      ] = m;
      if (createName !== undefined) {
        if (!enums.has(createName)) {
          enums.set(
            createName,
            new Set(
              [...createValues.matchAll(QUOTED_VALUE)].map((v) => unquote(v[1]))
            )
          );
        }
      } else if (addName !== undefined) {
        const values = enums.get(addName) ?? new Set<string>();
        values.add(unquote(addValue));
        enums.set(addName, values);
      } else if (renValName !== undefined) {
        const values = enums.get(renValName);
        if (values?.delete(unquote(renFrom))) values.add(unquote(renTo));
      } else if (renName !== undefined) {
        const values = enums.get(renName);
        enums.delete(renName);
        if (values) enums.set(renTarget, values);
      } else if (dropList !== undefined) {
        for (const t of dropList.matchAll(QUOTED_TYPE)) enums.delete(t[1]);
      }
    }
  }
  return enums;
}

/** Every migration's SQL, oldest first (directory names are timestamp-prefixed). */
function readMigrationsInOrder(): string[] {
  return readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) =>
      readFileSync(join(MIGRATIONS_DIR, name, 'migration.sql'), 'utf8')
    );
}

describe('replayEnumDdl', () => {
  it('credits a value only to the enum its statement names', () => {
    const replayed = replayEnumDdl([
      `CREATE TYPE "Side" AS ENUM ('BUY', 'SELL');`,
      `CREATE TYPE "Action" AS ENUM ('BUY');`,
      `ALTER TYPE "Side" ADD VALUE IF NOT EXISTS 'SHORT';`,
    ]);
    expect([...(replayed.get('Action') ?? [])]).toEqual(['BUY']);
    expect(replayed.get('Action')?.has('SELL')).toBe(false);
    expect(replayed.get('Action')?.has('SHORT')).toBe(false);
  });

  it('follows renames, recreation and drops', () => {
    const replayed = replayEnumDdl([
      `CREATE TYPE "S" AS ENUM ('A', 'B', 'C');`,
      `ALTER TYPE "S" RENAME VALUE 'A' TO 'AA';`,
      `CREATE TYPE "S_new" AS ENUM ('AA', 'B');
       ALTER TYPE "S" RENAME TO "S_old";
       ALTER TYPE "S_new" RENAME TO "S";
       DROP TYPE "public"."S_old";`,
      `DO $$ BEGIN
         CREATE TYPE "S" AS ENUM ('Z');
       EXCEPTION WHEN duplicate_object THEN NULL; END $$;`,
      `CREATE TYPE "Gone" AS ENUM ('X'); DROP TYPE IF EXISTS "Gone";`,
      `-- ALTER TYPE "S" ADD VALUE 'COMMENTED';`,
    ]);
    expect([...(replayed.get('S') ?? [])].sort()).toEqual(['AA', 'B']);
    expect(replayed.has('S_old')).toBe(false);
    expect(replayed.has('S_new')).toBe(false);
    expect(replayed.has('Gone')).toBe(false);
  });
});

describe('migration history covers every schema enum value, per enum', () => {
  const replayed = replayEnumDdl(readMigrationsInOrder());
  const enums = Prisma.dmmf.datamodel.enums;

  it('reads the schema enums', () => {
    expect(enums.length).toBeGreaterThan(0);
  });

  it.each(
    enums.map(
      (e) =>
        [e.dbName ?? e.name, e.values.map((v) => v.dbName ?? v.name)] as const
    )
  )(
    '%s: the migrated enum exists and holds every schema value',
    (name, values) => {
      const migrated = replayed.get(name);
      expect(migrated, `no migration creates "${name}"`).toBeDefined();
      const missing = values.filter((value) => !migrated?.has(value));
      expect(missing).toEqual([]);
    }
  );
});
