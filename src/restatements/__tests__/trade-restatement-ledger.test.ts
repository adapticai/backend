import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  RestatementRevertError,
  revertRestatement,
} from '../trade-restatement-revert';

/**
 * Guardrails for the trade restatement ledger
 * (`20261004000000_add_trade_restatements`).
 *
 * 1. The migration stays additive and guarded (`prisma migrate deploy` runs
 *    unattended at container start) and keeps the invariants the controller
 *    signed off: UNIQUE(tradeId, restatementRef) so a re-run cannot
 *    double-record, an FK that blocks hard-deleting a restated trade, and an
 *    attributed revert.
 * 2. The revert path, exercised on a COPY: a throwaway schema with its own
 *    `trades` table and the real migration applied. This runs only when
 *    RESTATEMENT_TEST_DATABASE_URL points at a disposable Postgres (CI has no
 *    database service); it creates and drops its own schema and never touches
 *    `public`. Run it before the first real write:
 *      RESTATEMENT_TEST_DATABASE_URL=postgresql://localhost:5432/scratch \
 *        npx vitest run src/restatements
 */

const MIGRATION = '20261004000000_add_trade_restatements';
const MIGRATION_PATH = join(
  __dirname,
  '..',
  '..',
  '..',
  'prisma',
  'migrations',
  MIGRATION,
  'migration.sql'
);

/** The migration with `--` comment lines stripped. */
function migrationSql(): string {
  return readFileSync(MIGRATION_PATH, 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');
}

/** Splits SQL into statements on top-level semicolons, keeping `$$` bodies whole. */
function splitStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = '';
  let inDollar = false;
  for (let i = 0; i < sql.length; i += 1) {
    if (sql.startsWith('$$', i)) {
      inDollar = !inDollar;
      current += '$$';
      i += 1;
      continue;
    }
    if (sql[i] === ';' && !inDollar) {
      if (current.trim()) statements.push(current.trim());
      current = '';
      continue;
    }
    current += sql[i];
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

describe('trade_restatements migration is additive, guarded and keeps the signed-off invariants', () => {
  const sql = migrationSql();

  it('creates only trade_restatements, guarded with IF NOT EXISTS', () => {
    const creates = [
      ...sql.matchAll(/CREATE TABLE (IF NOT EXISTS )?"([^"]+)"/g),
    ];
    expect(creates).toHaveLength(1);
    expect(creates[0][1]).toBe('IF NOT EXISTS ');
    expect(creates[0][2]).toBe('trade_restatements');
    for (const index of sql.matchAll(
      /CREATE (UNIQUE )?INDEX (IF NOT EXISTS )?/g
    )) {
      expect(index[2]).toBe('IF NOT EXISTS ');
    }
  });

  it('never alters, drops, updates or deletes anything else', () => {
    expect(sql).not.toMatch(/\bDROP\b/i);
    expect(sql).not.toMatch(/\bUPDATE\s+"/i);
    expect(sql).not.toMatch(/\bDELETE\s+FROM\b/i);
    expect(sql).not.toMatch(/\bTRUNCATE\b/i);
    const alterTargets = [...sql.matchAll(/ALTER TABLE "([^"]+)"/g)].map(
      (m) => m[1]
    );
    expect(alterTargets).toEqual(['trade_restatements']);
  });

  it('declares UNIQUE(tradeId, restatementRef) so a re-run cannot double-record', () => {
    expect(sql).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "trade_restatements_tradeId_restatementRef_key" ON "trade_restatements"("tradeId", "restatementRef")'
    );
    expect(sql).toContain(
      'CREATE INDEX IF NOT EXISTS "trade_restatements_restatementRef_idx" ON "trade_restatements"("restatementRef")'
    );
  });

  it('references trades ON DELETE RESTRICT, added only if absent', () => {
    expect(sql).toMatch(
      /IF NOT EXISTS \(SELECT 1 FROM pg_constraint WHERE conname = 'trade_restatements_tradeId_fkey'\)/
    );
    expect(sql).toMatch(
      /FOREIGN KEY \("tradeId"\) REFERENCES "trades"\("id"\) ON DELETE RESTRICT/
    );
  });

  it('requires the prior row, the basis and the approver, and an attributed revert', () => {
    expect(sql).toMatch(/"priorRow" JSONB NOT NULL/);
    expect(sql).toMatch(/"basis" JSONB NOT NULL/);
    expect(sql).toMatch(/"approvedBy" TEXT NOT NULL/);
    expect(sql).toMatch(/"executedBy" TEXT NOT NULL DEFAULT CURRENT_USER/);
    expect(sql).toMatch(/"revertedAt" TIMESTAMP\(3\),/);
    expect(sql).toContain(
      'CHECK (("revertedAt" IS NULL) = ("revertedBy" IS NULL))'
    );
    expect(sql).toContain(
      'CHECK ("fieldsChanged" IS NOT NULL AND cardinality("fieldsChanged") > 0)'
    );
  });

  it('defaults the id in the database, because the writers are SQL scripts', () => {
    expect(sql).toMatch(/"id" UUID NOT NULL DEFAULT gen_random_uuid\(\)/);
  });
});

const TEST_DATABASE_URL = process.env.RESTATEMENT_TEST_DATABASE_URL;

const ACCOUNT = '11111111-1111-4111-8111-111111111111';
const TRADE_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const TRADE_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const TRADE_C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
const REF = 'RST-TEST-ENTRYBASIS';

describe.skipIf(!TEST_DATABASE_URL)(
  'trade_restatements revert path on a copy',
  () => {
    const schema = `restatement_test_${randomBytes(4).toString('hex')}`;
    let admin: PrismaClient;
    let prisma: PrismaClient;

    /** Every trades column except updatedAt, which a write is expected to bump. */
    async function tradeRow(id: string): Promise<Record<string, unknown>> {
      const rows = await prisma.$queryRaw<
        Array<{ row: Record<string, unknown> }>
      >`
      SELECT to_jsonb(t.*) - 'updatedAt' AS row FROM "trades" t WHERE t.id = ${id}::uuid`;
      return rows[0].row;
    }

    /**
     * The restatement as the scripts run it: stage, snapshot into the ledger and
     * update trades in ONE transaction, with the counts tied before commit.
     */
    async function restate(
      staged: Array<{
        id: string;
        entryPrice: number;
        pnlAmount: number | null;
      }>,
      { failAfterLedger = false } = {}
    ): Promise<{ ledger: number; updated: number }> {
      return prisma.$transaction(async (tx) => {
        const values = Prisma.join(
          staged.map(
            (s) =>
              Prisma.sql`(${s.id}::uuid, ${s.entryPrice}::float8, ${s.pnlAmount}::float8)`
          )
        );
        await tx.$executeRaw`CREATE TEMP TABLE rst_stage (trade_id uuid, new_entry_price float8, new_pnl_amount float8) ON COMMIT DROP`;
        await tx.$executeRaw`INSERT INTO rst_stage VALUES ${values}`;
        const ledger = await tx.$executeRaw`
        INSERT INTO "trade_restatements"
          ("restatementRef", "runAt", "tradeId", "alpacaAccountId", "fieldsChanged",
           "priorEntryPrice", "newEntryPrice", "priorPnlAmount", "newPnlAmount", basis, "priorRow", "approvedBy")
        SELECT ${REF}, (now() AT TIME ZONE 'UTC'), t.id, t."alpacaAccountId",
               CASE WHEN s.new_pnl_amount IS NULL THEN ARRAY['entryPrice'] ELSE ARRAY['entryPrice','pnlAmount'] END,
               t."entryPrice", s.new_entry_price, t."pnlAmount", COALESCE(s.new_pnl_amount, t."pnlAmount"),
               jsonb_build_object('rule', 'entry_fill_vwap'), to_jsonb(t.*), 'controller'
          FROM "trades" t JOIN rst_stage s ON s.trade_id = t.id`;
        if (failAfterLedger) {
          throw new Error('repair failed after the ledger insert');
        }
        const updated = await tx.$executeRaw`
        UPDATE "trades" t
           SET "entryPrice" = s.new_entry_price,
               "pnlAmount"  = COALESCE(s.new_pnl_amount, t."pnlAmount"),
               "updatedAt"  = (now() AT TIME ZONE 'UTC')
          FROM rst_stage s WHERE t.id = s.trade_id`;
        if (ledger !== updated || updated !== staged.length) {
          throw new Error(
            `counts do not tie: ledger ${ledger}, updated ${updated}, staged ${staged.length}`
          );
        }
        return { ledger, updated };
      });
    }

    async function ledgerCount(where = Prisma.empty): Promise<number> {
      const rows = await prisma.$queryRaw<Array<{ n: number }>>`
      SELECT count(*)::int AS n FROM "trade_restatements" WHERE "restatementRef" = ${REF} ${where}`;
      return rows[0].n;
    }

    beforeAll(async () => {
      admin = new PrismaClient({ datasourceUrl: TEST_DATABASE_URL });
      await admin.$executeRawUnsafe(`CREATE SCHEMA "${schema}"`);
      const url = new URL(TEST_DATABASE_URL as string);
      url.searchParams.set('schema', schema);
      prisma = new PrismaClient({ datasourceUrl: url.toString() });

      // The copy: the trades columns the ledger and the revert touch, same types as production.
      await prisma.$executeRawUnsafe(
        `CREATE TYPE "TradeStatus" AS ENUM ('PENDING','OPEN','PARTIAL','COMPLETED','CANCELED','SUPERSEDED','REJECTED_BROKER','REJECTED_COMPLIANCE','FAILED')`
      );
      await prisma.$executeRawUnsafe(`
      CREATE TABLE "trades" (
        "id" UUID PRIMARY KEY,
        "alpacaAccountId" UUID NOT NULL,
        "symbol" TEXT NOT NULL,
        "status" "TradeStatus" NOT NULL DEFAULT 'PENDING',
        "entryPrice" DOUBLE PRECISION,
        "exitPrice" DOUBLE PRECISION,
        "entryQty" DOUBLE PRECISION,
        "exitQty" DOUBLE PRECISION,
        "entryValue" DOUBLE PRECISION,
        "pnlAmount" DOUBLE PRECISION,
        "updatedAt" TIMESTAMP(3) NOT NULL
      )`);
      for (const statement of splitStatements(migrationSql())) {
        await prisma.$executeRawUnsafe(statement);
      }
      // Idempotent: a second deploy of the same migration is a no-op.
      for (const statement of splitStatements(migrationSql())) {
        await prisma.$executeRawUnsafe(statement);
      }
      await prisma.$executeRawUnsafe(`
      INSERT INTO "trades" (id, "alpacaAccountId", symbol, status, "entryPrice", "exitPrice", "entryQty", "exitQty", "entryValue", "pnlAmount", "updatedAt") VALUES
        ('${TRADE_A}', '${ACCOUNT}', 'GOOG',  'COMPLETED', 101.25, 103.00, 10, 10, 1012.50, 17.50, '2026-10-02 13:40:00'),
        ('${TRADE_B}', '${ACCOUNT}', 'GOOGL', 'COMPLETED', 99.10,  98.00,  5,  5,  495.50,  -5.50, '2026-10-02 13:41:00'),
        ('${TRADE_C}', '${ACCOUNT}', 'MSFT',  'COMPLETED', 410.00, 412.00, 2,  2,  820.00,  NULL,  '2026-10-02 13:42:00')`);
    });

    afterAll(async () => {
      await prisma?.$disconnect();
      await admin?.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
      );
      await admin?.$disconnect();
    });

    it('writes no ledger row when the repair transaction fails', async () => {
      const before = await tradeRow(TRADE_A);
      await expect(
        restate([{ id: TRADE_A, entryPrice: 101.4, pnlAmount: 16.0 }], {
          failAfterLedger: true,
        })
      ).rejects.toThrow('repair failed after the ledger insert');
      expect(await ledgerCount()).toBe(0);
      expect(await tradeRow(TRADE_A)).toEqual(before);
    });

    it('records one ledger row per updated trade, with the whole prior row', async () => {
      const priorA = await tradeRow(TRADE_A);
      const result = await restate([
        { id: TRADE_A, entryPrice: 101.4, pnlAmount: 16.0 },
        { id: TRADE_B, entryPrice: 99.0, pnlAmount: -5.0 },
        { id: TRADE_C, entryPrice: 409.5, pnlAmount: null },
      ]);
      expect(result).toEqual({ ledger: 3, updated: 3 });
      expect(await ledgerCount()).toBe(3);

      const ledgerA = await prisma.$queryRaw<
        Array<{
          priorRow: Record<string, unknown>;
          fieldsChanged: string[];
          executedBy: string;
        }>
      >`SELECT "priorRow", "fieldsChanged", "executedBy" FROM "trade_restatements" WHERE "tradeId" = ${TRADE_A}::uuid`;
      const { updatedAt: _ignored, ...priorRowA } = ledgerA[0].priorRow;
      expect(priorRowA).toEqual(priorA);
      expect(ledgerA[0].fieldsChanged).toEqual(['entryPrice', 'pnlAmount']);
      expect(ledgerA[0].executedBy).not.toBe('');

      const ledgerC = await prisma.$queryRaw<
        Array<{ fieldsChanged: string[] }>
      >`
      SELECT "fieldsChanged" FROM "trade_restatements" WHERE "tradeId" = ${TRADE_C}::uuid`;
      expect(ledgerC[0].fieldsChanged).toEqual(['entryPrice']);
    });

    it('refuses to double-record the same run', async () => {
      await expect(
        restate([{ id: TRADE_A, entryPrice: 101.4, pnlAmount: 16.0 }])
      ).rejects.toThrow(/23505|already exists/);
      expect(await ledgerCount()).toBe(3);
    });

    it('refuses a revert whose expected count does not tie, and writes nothing', async () => {
      const before = await tradeRow(TRADE_A);
      await expect(
        revertRestatement(prisma, {
          restatementRef: REF,
          expectedRows: 2,
          revertedBy: 'controller',
        })
      ).rejects.toThrow(RestatementRevertError);
      expect(await tradeRow(TRADE_A)).toEqual(before);
      expect(await ledgerCount(Prisma.sql`AND "revertedAt" IS NULL`)).toBe(3);
    });

    it('refuses a revert when a trade was rewritten after the restatement', async () => {
      await prisma.$executeRaw`UPDATE "trades" SET "entryPrice" = 555 WHERE id = ${TRADE_B}::uuid`;
      await expect(
        revertRestatement(prisma, {
          restatementRef: REF,
          expectedRows: 3,
          revertedBy: 'controller',
        })
      ).rejects.toThrow(/no longer carry the restated values/);
      expect(await ledgerCount(Prisma.sql`AND "revertedAt" IS NULL`)).toBe(3);
      await prisma.$executeRaw`UPDATE "trades" SET "entryPrice" = 99.0 WHERE id = ${TRADE_B}::uuid`;
    });

    it('a hard delete of a restated trade is blocked by the ledger', async () => {
      await expect(
        prisma.$executeRaw`DELETE FROM "trades" WHERE id = ${TRADE_A}::uuid`
      ).rejects.toThrow(
        /trade_restatements_tradeId_fkey|Foreign key constraint/
      );
    });

    it('reverts: restores exactly the prior rows and stamps the ledger, counts tied', async () => {
      const result = await revertRestatement(prisma, {
        restatementRef: REF,
        expectedRows: 3,
        revertedBy: 'controller',
      });
      expect(result).toEqual({ ledgerRows: 3, tradesRestored: 3 });

      const ledger = await prisma.$queryRaw<
        Array<{
          tradeId: string;
          priorRow: Record<string, unknown>;
          revertedAt: Date | null;
          revertedBy: string | null;
        }>
      >`SELECT "tradeId"::text AS "tradeId", "priorRow", "revertedAt", "revertedBy" FROM "trade_restatements" WHERE "restatementRef" = ${REF}`;
      expect(ledger).toHaveLength(3);
      for (const row of ledger) {
        expect(row.revertedAt).not.toBeNull();
        expect(row.revertedBy).toBe('controller');
        const { updatedAt: _ignored, ...prior } = row.priorRow;
        expect(await tradeRow(row.tradeId)).toEqual(prior);
      }
    });

    it('a second revert finds nothing live and writes nothing', async () => {
      await expect(
        revertRestatement(prisma, {
          restatementRef: REF,
          expectedRows: 3,
          revertedBy: 'controller',
        })
      ).rejects.toThrow(/0 live ledger rows, expected 3/);
    });

    it('an unattributed revert stamp is rejected by the database', async () => {
      await expect(
        prisma.$executeRaw`UPDATE "trade_restatements" SET "revertedBy" = NULL WHERE "restatementRef" = ${REF}`
      ).rejects.toThrow(
        /trade_restatements_revert_attributed|check constraint/i
      );
    });
  }
);
