import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';

/**
 * Every enum value the Prisma client accepts must exist in a database built
 * from the migration history.
 *
 * `prisma migrate deploy` is the only path that changes the production schema,
 * so a value added to `prisma/schema.prisma` without a migration is accepted by
 * the generated client and the GraphQL inputs and then rejected by Postgres on
 * the first write that uses it (`invalid input value for enum`).
 *
 * This is the static, database-free half of the check: each value must appear
 * as a quoted literal in some migration's executable SQL (`CREATE TYPE … AS
 * ENUM ('A', …)` or `ALTER TYPE … ADD VALUE 'A'`). It cannot see a value that
 * a later migration renamed or dropped; the complete check is
 * `prisma migrate diff --from-migrations prisma/migrations
 * --to-schema-datamodel prisma/schema.prisma`, which needs a shadow database.
 */

const MIGRATIONS_DIR = join(__dirname, '..', '..', 'prisma', 'migrations');

/**
 * @returns The executable SQL of every migration, comment lines removed so a
 *   value named only in prose does not count.
 */
function readAllMigrationSql(): string {
  return readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) =>
      readFileSync(join(MIGRATIONS_DIR, entry.name, 'migration.sql'), 'utf8')
        .split('\n')
        .filter((line) => !line.trimStart().startsWith('--'))
        .join('\n')
    )
    .join('\n');
}

describe('migration history covers every schema enum value', () => {
  const sql = readAllMigrationSql();
  const enums = Prisma.dmmf.datamodel.enums;

  it('reads the schema enums', () => {
    expect(enums.length).toBeGreaterThan(0);
  });

  it.each(enums.map((e) => [e.name, e.values.map((v) => v.dbName ?? v.name)] as const))(
    '%s: every value is created or added by a migration',
    (_name, values) => {
      const missing = values.filter((value) => !sql.includes(`'${value}'`));
      expect(missing).toEqual([]);
    }
  );
});
