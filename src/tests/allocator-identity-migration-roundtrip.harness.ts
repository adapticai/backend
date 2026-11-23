/**
 * Proves `20261123090000_allocator_identity_roles` is additive on data that
 * predates it: rows seeded by raw SQL into a database migrated only up to the
 * migration before it are snapshotted, this migration's own SQL is applied,
 * and the same rows are read again, raw and through the generated GraphQL
 * resolvers.
 *
 * Needs `ACCESS_PRE_DATABASE_URL`: a DISPOSABLE database migrated to
 * `20261121130000_trading_policy_lane_fields` and not past it. The harness
 * refuses any other state, and leaves the database with this migration's SQL
 * applied (it is not recorded in `_prisma_migrations`), so use a fresh one per
 * run. Output is printed between `<<<RESULTS>>>` and `<<<END>>>`.
 */
import 'reflect-metadata';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { buildSchema } from 'type-graphql';
import { graphql } from 'graphql';

import { resolvers } from '../generated/typegraphql-prisma';
import {
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../config/server-only-models';

const MIGRATION = '20261123090000_allocator_identity_roles';
const PREVIOUS = '20261121130000_trading_policy_lane_fields';
const MIGRATION_SQL = join(
  __dirname,
  '..',
  '..',
  'prisma',
  'migrations',
  MIGRATION,
  'migration.sql'
);

/** The tables whose pre-existing rows are snapshotted. */
type Table = 'users' | 'organizations' | 'org_memberships' | 'investors' | 'audit_logs';

type Row = Record<string, unknown>;
type Snapshot = Record<Table, Row[]>;

/** The migration's statements, comments removed, in order. */
function statements(sql: string): string[] {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*\n/)
    .map((s) => s.trim().replace(/;$/, ''))
    .filter((s) => s.length > 0);
}

async function snapshot(
  prisma: PrismaClient,
  ids: Record<Table, string[]>
): Promise<Snapshot> {
  const read = async (table: Table): Promise<Row[]> => {
    const rows = await prisma.$queryRawUnsafe<Array<{ row: Row }>>(
      `SELECT row_to_json(t) AS row FROM ${table} t WHERE id::text = ANY($1::text[]) ORDER BY id`,
      ids[table]
    );
    return rows.map((r) => r.row);
  };
  const out: Snapshot = {
    users: await read('users'),
    organizations: await read('organizations'),
    org_memberships: await read('org_memberships'),
    investors: await read('investors'),
    audit_logs: await read('audit_logs'),
  };
  return out;
}

async function main(): Promise<void> {
  const url = process.env.ACCESS_PRE_DATABASE_URL;
  if (!url) throw new Error('ACCESS_PRE_DATABASE_URL is not set');
  const prisma = new PrismaClient({ datasourceUrl: url });
  try {
    const applied = await prisma.$queryRawUnsafe<
      Array<{ migration_name: string }>
    >(
      `SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL ORDER BY migration_name DESC LIMIT 1`
    );
    const columnExists = await prisma.$queryRawUnsafe<Array<{ n: number }>>(
      `SELECT count(*)::int AS n FROM information_schema.columns WHERE table_name = 'organizations' AND column_name = 'kind'`
    );
    if (applied[0]?.migration_name !== PREVIOUS || columnExists[0]?.n !== 0) {
      throw new Error(
        `database is not at ${PREVIOUS} without ${MIGRATION}; use a fresh disposable database`
      );
    }

    const tag = randomUUID().slice(0, 8);
    const userId = randomUUID();
    const orgId = randomUUID();
    const membershipId = randomUUID();
    const investorId = randomUUID();
    const auditId = randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO users (id, email, name, "updatedAt") VALUES ($1::uuid, $2, 'Pre Migration', now())`,
      userId,
      `pre-${tag}@example.test`
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO organizations (id, name, slug, "businessType", "emailDomains", "updatedAt")
       VALUES ($1::uuid, 'Pre Org', $2, 'family_office', ARRAY['pre.example'], now())`,
      orgId,
      `pre-${tag}`
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO org_memberships (id, "organizationId", "userId", role, permissions, "updatedAt")
       VALUES ($1::uuid, $2::uuid, $3::uuid, 'AUDITOR', ARRAY['read:all'], now())`,
      membershipId,
      orgId,
      userId
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO investors (id, "organizationId", "userId", name, email, jurisdiction, "updatedAt")
       VALUES ($1::uuid, $2::uuid, $3::uuid, 'Pre Investor', 'lp@example.test', 'GB', now())`,
      investorId,
      orgId,
      userId
    );
    await prisma.$executeRawUnsafe(
      `INSERT INTO audit_logs (id, "userId", "operationType", "modelName", "recordId", "changedFields")
       VALUES ($1::uuid, $2::uuid, 'UPDATE', 'Organization', $3, '{"name":{"before":"A","after":"B"}}'::jsonb)`,
      auditId,
      userId,
      orgId
    );
    const ids = {
      users: [userId],
      organizations: [orgId],
      org_memberships: [membershipId],
      investors: [investorId],
      audit_logs: [auditId],
    };

    const before = await snapshot(prisma, ids);
    for (const statement of statements(readFileSync(MIGRATION_SQL, 'utf8'))) {
      await prisma.$executeRawUnsafe(statement);
    }
    const after = await snapshot(prisma, ids);

    const schema = withoutServerOnlySchemaSurface(
      await buildSchema({
        resolvers: withoutServerOnlyResolvers(resolvers),
        validate: false,
      })
    );
    const served = await graphql({
      schema,
      source: `query ($org: String!, $m: String!, $inv: String!, $audit: String!) {
        organization(where: { id: $org }) { id name slug businessType emailDomains kind timeZone }
        orgMembership(where: { id: $m }) { id role permissions entityScopeAll entityScopeIds }
        investor(where: { id: $inv }) { id name email jurisdiction parentInvestorId registrationNumber officeOrganizationId }
        auditLog(where: { id: $audit }) { id operationType modelName recordId changedFields workspace }
      }`,
      variableValues: {
        org: orgId,
        m: membershipId,
        inv: investorId,
        audit: auditId,
      },
      contextValue: { prisma },
    });

    process.stdout.write(
      `<<<RESULTS>>>${JSON.stringify({
        before,
        after,
        served: {
          data: served.data ?? null,
          errors: (served.errors ?? []).map((e) => e.message),
        },
      })}<<<END>>>\n`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});
