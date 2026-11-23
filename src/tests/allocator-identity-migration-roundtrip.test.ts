import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * `20261123090000_allocator_identity_roles` applied to rows that predate it
 * (`allocator-identity-migration-roundtrip.harness.ts`): every pre-existing
 * column of every pre-existing row reads back identical, raw and through the
 * generated resolvers, and every new column reads as its documented
 * meaning-preserving value.
 *
 * SKIPPED IN CI: it runs only when ACCESS_PRE_DATABASE_URL points at a fresh,
 * disposable database migrated to 20261121130000 and not past it. Locally:
 *
 *   createdb w2b_pre && (move this migration aside) prisma migrate deploy && (restore it)
 *   ACCESS_PRE_DATABASE_URL=postgresql://postgres@127.0.0.1:5541/w2b_pre \
 *     npx vitest run --maxWorkers=2 src/tests/allocator-identity-migration-roundtrip.test.ts
 */

type Row = Record<string, unknown>;
type Tables =
  | 'users'
  | 'organizations'
  | 'org_memberships'
  | 'investors'
  | 'audit_logs';

interface Report {
  before: Record<Tables, Row[]>;
  after: Record<Tables, Row[]>;
  served: { data: Record<string, Row | null> | null; errors: string[] };
}

const DATABASE_URL = process.env.ACCESS_PRE_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

/** The columns this migration adds, per table. */
const ADDED: Record<Tables, Row> = {
  users: {},
  organizations: { kind: 'MANAGER', timeZone: null },
  org_memberships: { entityScopeAll: false, entityScopeIds: [] },
  investors: {
    parentInvestorId: null,
    registrationNumber: null,
    officeOrganizationId: null,
  },
  audit_logs: { workspace: null },
};

function without(row: Row, keys: string[]): Row {
  return Object.fromEntries(
    Object.entries(row).filter(([k]) => !keys.includes(k))
  );
}

describe.skipIf(!DATABASE_URL)(
  'allocator identity migration on pre-existing rows',
  () => {
    let report: Report;

    beforeAll(async () => {
      report = await runTsNodeHarness<Report>(
        'src/tests/allocator-identity-migration-roundtrip.harness.ts',
        HARNESS_TIMEOUT_MS
      );
    }, HARNESS_TIMEOUT_MS + 30_000);

    it('seeded one row in every snapshotted table before the migration', () => {
      for (const table of Object.keys(ADDED) as Tables[]) {
        expect(report.before[table], table).toHaveLength(1);
        for (const key of Object.keys(ADDED[table])) {
          expect(
            Object.keys(report.before[table][0]),
            `${table}.${key} absent before`
          ).not.toContain(key);
        }
      }
    });

    it('leaves every pre-existing column of every pre-existing row byte-identical', () => {
      for (const table of Object.keys(ADDED) as Tables[]) {
        const added = Object.keys(ADDED[table]);
        expect(without(report.after[table][0], added), table).toEqual(
          report.before[table][0]
        );
      }
    });

    it('gives every new column its meaning-preserving value: MANAGER, no entity, untagged', () => {
      for (const table of Object.keys(ADDED) as Tables[]) {
        expect(report.after[table][0], table).toMatchObject(ADDED[table]);
      }
    });

    it('serves the pre-existing rows through the generated resolvers unchanged', () => {
      expect(report.served.errors).toEqual([]);
      const data = report.served.data ?? {};
      const org = report.before.organizations[0];
      const membership = report.before.org_memberships[0];
      const investor = report.before.investors[0];
      const audit = report.before.audit_logs[0];
      expect(data.organization).toEqual({
        id: org.id,
        name: org.name,
        slug: org.slug,
        businessType: org.businessType,
        emailDomains: org.emailDomains,
        kind: 'MANAGER',
        timeZone: null,
      });
      expect(data.orgMembership).toEqual({
        id: membership.id,
        role: 'AUDITOR',
        permissions: ['read:all'],
        entityScopeAll: false,
        entityScopeIds: [],
      });
      expect(data.investor).toEqual({
        id: investor.id,
        name: investor.name,
        email: investor.email,
        jurisdiction: investor.jurisdiction,
        parentInvestorId: null,
        registrationNumber: null,
        officeOrganizationId: null,
      });
      expect(data.auditLog).toEqual({
        id: audit.id,
        operationType: 'UPDATE',
        modelName: 'Organization',
        recordId: audit.recordId,
        changedFields: audit.changedFields,
        workspace: null,
      });
    });
  }
);
