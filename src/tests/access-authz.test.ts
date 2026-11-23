import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * The access models, the served access reads and the reserved
 * `Organization.kind`, measured on the served schema against a real Postgres
 * built from the migration history (`access-authz.harness.ts`), with every
 * staged mode at its default (shadow).
 *
 * SKIPPED IN CI: it runs only when ACCESS_IT_DATABASE_URL points at a
 * disposable migrated database, and CI has none. The pure halves are
 * src/auth/__tests__/access-models-authorization.test.ts and
 * src/resolvers/custom/__tests__/allocator-access-service.test.ts. Locally:
 *
 *   ACCESS_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5541/w2b_it \
 *     npx vitest run --maxWorkers=2 src/tests/access-authz.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
  codes: string[];
}

interface Report {
  steps: Record<string, StepResult>;
  facts: {
    investors: Record<'inv1' | 'inv2' | 'inv3' | 'invB', string>;
    grants: Record<'active' | 'revoked' | 'expired' | 'b', string>;
    assignments: Record<'open' | 'ended' | 'b', string>;
    groups: Record<'a' | 'b', string>;
    writes: {
      roleAssignmentsBefore: number;
      roleAssignmentsAfter: number;
      officeKindAfter: string;
      revokedStillRevoked: boolean;
      aliceGrants: number;
    };
  };
}

const DATABASE_URL = process.env.ACCESS_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

function ids(step: StepResult, field: string): string[] {
  const rows = (step.data?.[field] ?? []) as Array<{ id: string }>;
  return rows.map((row) => row.id).sort();
}

describe.skipIf(!DATABASE_URL)('access models on the served schema', () => {
  let report: Report;

  beforeAll(async () => {
    report = await runTsNodeHarness<Report>(
      'src/tests/access-authz.harness.ts',
      HARNESS_TIMEOUT_MS
    );
  }, HARNESS_TIMEOUT_MS + 30_000);

  it("a member reads only their own organization's RoleAssignment, AuditorGrant and EntityGroup rows", () => {
    const { steps, facts } = report;
    expect(steps.aliceList.errors).toEqual([]);
    expect(ids(steps.aliceList, 'roleAssignments')).toEqual(
      [facts.assignments.open, facts.assignments.ended].sort()
    );
    expect(ids(steps.aliceList, 'auditorGrants')).toEqual(
      [facts.grants.active, facts.grants.revoked, facts.grants.expired].sort()
    );
    expect(ids(steps.aliceList, 'entityGroups')).toEqual([facts.groups.a]);
    expect(steps.aliceReadsOtherOfficeRows.errors).toEqual([]);
    expect(steps.aliceReadsOtherOfficeRows.data).toEqual({
      roleAssignment: null,
      auditorGrant: null,
      entityGroup: null,
    });
  });

  it('the service reads every organization, and no principal reads nothing', () => {
    const { steps } = report;
    expect(ids(steps.serviceList, 'roleAssignments')).toHaveLength(3);
    expect(ids(steps.serviceList, 'auditorGrants')).toHaveLength(4);
    expect(ids(steps.serviceList, 'entityGroups')).toHaveLength(2);
    expect(steps.anonymousList.data).toBeNull();
    expect(steps.anonymousList.codes).toContain('UNAUTHENTICATED');
  });

  it('a revoked or expired AuditorGrant is never returned as active', () => {
    const { steps, facts } = report;
    expect(steps.aliceActiveGrants.errors).toEqual([]);
    expect(ids(steps.aliceActiveGrants, 'activeAuditorGrants')).toEqual([
      facts.grants.active,
    ]);
    expect(
      ids(steps.serviceActiveGrantsForErin, 'activeAuditorGrants')
    ).toEqual([facts.grants.active, facts.grants.b].sort());
  });

  it('an ended RoleAssignment is never returned as active', () => {
    expect(
      ids(report.steps.aliceActiveAssignments, 'activeRoleAssignments')
    ).toEqual([report.facts.assignments.open]);
  });

  it('entityScopeAll = false with an empty list resolves to no entities', () => {
    expect(report.steps.daveEntities.errors).toEqual([]);
    expect(ids(report.steps.daveEntities, 'officeEntities')).toEqual([]);
  });

  it('a listed scope reads exactly its entities, an all scope every office entity, an auditor only active grants', () => {
    const { steps, facts } = report;
    expect(ids(steps.carolEntities, 'officeEntities')).toEqual([
      facts.investors.inv1,
    ]);
    expect(ids(steps.aliceEntities, 'officeEntities')).toEqual(
      [facts.investors.inv1, facts.investors.inv2, facts.investors.inv3].sort()
    );
    expect(ids(steps.serviceEntitiesForErin, 'officeEntities')).toEqual([
      facts.investors.inv2,
    ]);
    expect(steps.carolAsksForAlice.codes).toEqual(['FORBIDDEN']);
  });

  it('a user cannot write an access model with the mutation guard at its default (shadow), root or nested', () => {
    const { steps, facts } = report;
    expect(steps.aliceCreatesRoleAssignment.codes).toEqual(['FORBIDDEN']);
    expect(steps.aliceCreatesAuditorGrant.codes).toEqual(['FORBIDDEN']);
    expect(steps.aliceRevivesRevokedGrant.codes).toEqual(['FORBIDDEN']);
    expect(steps.aliceNestedRoleAssignment.data).toBeNull();
    expect(steps.aliceNestedRoleAssignment.errors.join(' ')).toMatch(
      /"roleAssignments" is not defined by type "OrganizationUpdateInput"/
    );
    expect(steps.serviceCreatesRoleAssignment.errors).toEqual([]);
    expect(facts.writes.roleAssignmentsAfter).toBe(
      facts.writes.roleAssignmentsBefore + 1
    );
    expect(facts.writes.revokedStillRevoked).toBe(true);
    expect(facts.writes.aliceGrants).toBe(0);
  });

  it("a member cannot change their organization's kind, and keeps every other organization write", () => {
    const { steps, facts } = report;
    expect(steps.aliceSetsOrganizationKind.codes).toEqual(['FORBIDDEN']);
    expect(facts.writes.officeKindAfter).toBe('ALLOCATOR_OFFICE');
    expect(steps.aliceSetsTimeZone.errors).toEqual([]);
    expect(steps.aliceSetsTimeZone.data).toEqual({
      updateOneOrganization: {
        id: expect.any(String),
        timeZone: 'Europe/London',
        kind: 'ALLOCATOR_OFFICE',
      },
    });
  });

  it('the access back-relations are not on the User output', () => {
    expect(report.steps.userReadsGrantsThroughUser.data).toBeNull();
    expect(report.steps.userReadsGrantsThroughUser.errors.join(' ')).toMatch(
      /auditorGrants/
    );
  });
});
