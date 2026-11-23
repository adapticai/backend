import { beforeAll, describe, expect, it } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * An allocator office's entities on the served schema, with every staged mode
 * at its default (shadow), against the database scripts/test-db/global-setup.ts
 * provisions (`office-entity-scope.harness.ts` has the cast). The pure halves
 * are src/auth/__tests__/office-entity-scope.test.ts and
 * src/middleware/__tests__/reserved-column-echo.test.ts.
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
  codes: string[];
}

interface Report {
  steps: Record<string, StepResult>;
  facts: {
    investors: Record<'inv1' | 'inv2' | 'inv3' | 'legacy', string>;
    holdings: Record<'h1' | 'legacy', string>;
    grants: Record<'active' | 'revoked', string>;
    group: string;
    writes: {
      countBefore: number;
      officeRowsAfter: Array<{ id: string; name: string; parentInvestorId: string | null }>;
      legacyParentAfter: string | null;
      legacyNotesAfter: string | null;
    };
    carolScopeAfter: string[];
    nullLists: Record<'entityScopeIds' | 'entityIds' | 'investorIds', string>;
    auditRows: Array<{ workspace: string | null }>;
  };
}

// The database is provisioned for every run (scripts/test-db/global-setup.ts);
// without it this suite fails rather than skips, since a skip reads as a pass.
const DATABASE_URL = process.env.ACCESS_IT_DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('No database for this suite: scripts/test-db/global-setup.ts provisions one on every run.');
}
const HARNESS_TIMEOUT_MS = 300_000;

function ids(step: StepResult, field: string): string[] {
  return ((step.data?.[field] ?? []) as Array<{ id: string }>).map((row) => row.id);
}

function count(step: StepResult): number {
  return (step.data?.aggregateInvestor as { _count: { _all: number } })._count._all;
}

describe('office entities on the served schema', () => {
  let report: Report;

  beforeAll(async () => {
    report = await runTsNodeHarness<Report>('src/tests/office-entity-scope.harness.ts', HARNESS_TIMEOUT_MS);
  }, HARNESS_TIMEOUT_MS + 30_000);

  it("a non-member, a null principal and a member with an empty list read none of an office's entities, through any investor read root", () => {
    for (const who of ['mallory', 'anonymous', 'dave']) {
      const step = report.steps[`officeRead.${who}`];
      expect(step.errors, who).toEqual([]);
      expect(ids(step, 'investors'), who).toEqual([]);
      expect(count(step), who).toBe(0);
      expect(step.data?.findFirstInvestor, who).toBeNull();
    }
  });

  it('a member with entityScopeAll = false reads only their listed entities; an auditor reads their granted ones; a manager reads its register', () => {
    const { inv1, inv2, inv3 } = report.facts.investors;
    const expected: Record<string, string[]> = {
      alice: [inv1, inv2, inv3],
      carol: [inv1],
      erin: [inv2],
      mona: [inv1, inv2],
      service: [inv1, inv2, inv3],
    };
    for (const [who, rows] of Object.entries(expected)) {
      const step = report.steps[`officeRead.${who}`];
      expect(step.errors, who).toEqual([]);
      expect(ids(step, 'investors'), who).toEqual(rows);
      expect(count(step), who).toBe(rows.length);
    }
    expect((report.steps['officeRead.alice'].data?.findFirstInvestor as { id: string }).id).toBe(inv3);
    expect(report.steps['officeRead.carol'].data?.findFirstInvestor).toBeNull();
  });

  it('serves a row no office owns exactly as the service reads it, to a stranger and a null principal', () => {
    const service = report.steps['legacyRead.service'];
    expect(service.errors).toEqual([]);
    expect((service.data?.investor as { id: string }).id).toBe(report.facts.investors.legacy);
    for (const who of ['mallory', 'anonymous']) {
      expect(report.steps[`legacyRead.${who}`], who).toEqual(service);
    }
  });

  it("serves an entity's holdings only to readers of the entity, and every other holding as before", () => {
    const { h1, legacy } = report.facts.holdings;
    expect(ids(report.steps['holdings.mallory'], 'holdings')).toEqual([legacy]);
    expect(ids(report.steps['holdings.mona'], 'holdings').sort()).toEqual([h1, legacy].sort());
    expect(ids(report.steps['holdings.service'], 'holdings').sort()).toEqual([h1, legacy].sort());
  });

  it('narrows the relations that return an investor to the rows the reader may see', () => {
    const { inv1, inv2, inv3, legacy } = report.facts.investors;
    const orgInvestors = (who: string): string[] =>
      ((report.steps[`relation.${who}`].data?.organization as { investors: Array<{ id: string }> }).investors ?? []).map(
        (row) => row.id
      );
    const parent = (who: string): unknown =>
      (report.steps[`relation.${who}`].data?.investor as { parentInvestor: unknown } | null)?.parentInvestor;
    expect(report.steps['relation.mallory'].errors).toEqual([]);
    expect(orgInvestors('mallory')).toEqual([legacy]);
    expect(report.steps['relation.mallory'].data?.investor).toBeNull();
    expect(orgInvestors('mona')).toEqual([inv1, inv2, legacy]);
    expect(parent('mona')).toBeNull();
    expect(orgInvestors('alice')).toEqual([inv1, inv2, legacy]);
    expect(parent('alice')).toEqual({ id: inv3 });
  });

  it("refuses a stranger's probe of an entity's columns from another root, and serves the service's", () => {
    expect(report.steps['probe.mallory'].codes).toEqual(['FORBIDDEN']);
    expect(report.steps['probe.service'].errors).toEqual([]);
    expect(ids(report.steps['probe.service'], 'organizations')).toHaveLength(1);
  });

  it("refuses a stranger counting a relation's investors by an entity column, and serves the service's count", () => {
    expect(report.steps['probe.malloryCount'].codes).toContain('FORBIDDEN');
    expect(report.steps['probe.serviceCount'].errors).toEqual([]);
    expect(report.steps['probe.serviceCount'].data).toEqual({
      organizations: [{ id: expect.any(String), _count: { investors: 1 } }],
    });
  });

  it("an external auditor reads their own grants with their own token; a listed member reads no one else's; groups go to whole-office readers", () => {
    const { active, revoked } = report.facts.grants;
    const erin = report.steps['grants.erin'];
    expect(erin.errors).toEqual([]);
    expect(ids(erin, 'auditorGrants')).toEqual([active, revoked]);
    expect(ids(erin, 'activeAuditorGrants')).toEqual([active]);
    expect(ids(erin, 'entityGroups')).toEqual([]);
    const alice = report.steps['grants.alice'];
    expect(ids(alice, 'auditorGrants')).toEqual([active, revoked]);
    expect(ids(alice, 'activeAuditorGrants')).toEqual([active]);
    expect(ids(alice, 'entityGroups')).toEqual([report.facts.group]);
    for (const who of ['carol', 'mallory']) {
      const step = report.steps[`grants.${who}`];
      expect(step.errors, who).toEqual([]);
      expect([ids(step, 'auditorGrants'), ids(step, 'activeAuditorGrants'), ids(step, 'entityGroups')], who).toEqual([[], [], []]);
    }
  });

  it("a user cannot place an entity in an office's tree, or change or delete an office's entities, at the guard's default (shadow)", () => {
    const { steps, facts } = report;
    expect(steps['write.malloryPlantsEntity'].codes).toEqual(['FORBIDDEN']);
    expect(steps['write.malloryConnectsOffice'].codes).toEqual(['FORBIDDEN']);
    expect(steps['write.malloryMovesLegacyUnderEntity'].codes).toEqual(['FORBIDDEN']);
    expect(steps['write.malloryRenamesOfficeEntities'].data).toEqual({ updateManyInvestor: { count: 0 } });
    expect(steps['write.malloryDeletesOfficeEntities'].data).toEqual({ deleteManyInvestor: { count: 0 } });
    expect(facts.writes.countBefore).toBe(3);
    expect(facts.writes.officeRowsAfter.map((row) => row.name)).toEqual(['Entity 1', 'Entity 2', 'Entity 3']);
    expect(facts.writes.legacyParentAfter).toBeNull();
  });

  it('leaves the write behaviour of a row no office owns as it was (shadow admits it)', () => {
    expect(report.steps['write.malloryRenamesLegacy'].data).toEqual({ updateManyInvestor: { count: 1 } });
    expect(report.facts.writes.legacyNotesAfter).toBe('control');
  });

  it("admits a user's update that re-sends their reserved scope unchanged, refuses a changed one, and leaves the service setting scope and kind", () => {
    const { steps, facts } = report;
    expect(steps['echo.carolUpdatesOwnMembershipUnchanged'].errors).toEqual([]);
    expect(steps['echo.carolWidensOwnScope'].codes).toEqual(['FORBIDDEN']);
    expect(steps['echo.serviceSetsScope'].errors).toEqual([]);
    expect(steps['echo.serviceSetsKind'].data).toEqual({
      updateOneOrganization: { id: expect.any(String), kind: 'ALLOCATOR_OFFICE' },
    });
    expect([...facts.carolScopeAfter].sort()).toEqual([facts.investors.inv1, facts.investors.inv3].sort());
  });

  it('refuses a user tagging their audit entry for every workspace, and admits their own workspace', () => {
    const { steps, facts } = report;
    expect(steps['audit.SHARED'].codes).toEqual(['FORBIDDEN']);
    expect(steps['audit.ORGANISATION'].codes).toEqual(['FORBIDDEN']);
    expect(steps['audit.FUND'].errors).toEqual([]);
    expect(facts.auditRows).toEqual([{ workspace: 'FUND' }]);
  });

  it('refuses NULL in a membership scope, a grant and a group id list (empty means none)', () => {
    expect(report.facts.nullLists).toEqual({ entityScopeIds: '23502', entityIds: '23502', investorIds: '23502' });
  });
});
