/**
 * Who may write an entitlement row, decided from what the caller holds in
 * the row's tenant. Every refusal is paired with the admitted control that
 * differs from it in one fact.
 */
import { describe, expect, it } from 'vitest';

import {
  decideMembershipWrite,
  type CallerStanding,
  type MembershipRowWrite,
  type FirstOwnerFacts,
} from '../membership-write-authority';
import {
  evaluateMutationAccess,
  ruleFor,
  type MutationTarget,
} from '../mutation-authorization';

const ME = 'user-me';
const OTHER = 'user-other';
const ORG = 'org-1';
const FUND = 'fund-1';

const NONE: CallerStanding = { orgRole: null, fundRole: null };
const org = (role: string): CallerStanding => ({
  orgRole: role,
  fundRole: null,
});
const fund = (role: string): CallerStanding => ({
  orgRole: null,
  fundRole: role,
});

function membership(
  overrides: Partial<MembershipRowWrite> = {}
): MembershipRowWrite {
  return {
    side: 'existing',
    organizationId: ORG,
    memberUserId: OTHER,
    rolesTouched: ['MEMBER', 'ADMIN'],
    setsPermissions: false,
    ...overrides,
  };
}

function assignment(
  overrides: Partial<MembershipRowWrite> = {}
): MembershipRowWrite {
  return {
    ...membership({ rolesTouched: ['VIEWER'], side: 'create' }),
    fundId: FUND,
    ...overrides,
  };
}

const EMPTY_ORG: FirstOwnerFacts = {
  organizationDeleted: false,
  organizationMemberCount: 0,
  organizationFundCount: 0,
};

describe('OrgMembership', () => {
  it('refuses a MEMBER promoting themselves, and admits an OWNER changing a member', () => {
    const promoteSelf = membership({
      memberUserId: ME,
      rolesTouched: ['MEMBER', 'OWNER'],
    });
    expect(
      decideMembershipWrite(
        'OrgMembership',
        promoteSelf,
        ME,
        org('MEMBER'),
        null
      )
    ).toBe('membership_role_insufficient');
    expect(
      decideMembershipWrite(
        'OrgMembership',
        membership(),
        ME,
        org('OWNER'),
        null
      )
    ).toBe('membership_org_admin');
  });

  it('refuses every role below ADMIN, whatever it is', () => {
    for (const role of [
      'PORTFOLIO_MANAGER',
      'COMPLIANCE_OFFICER',
      'KYC_AML_OFFICER',
      'AUDITOR',
      'MEMBER',
    ]) {
      expect(
        decideMembershipWrite(
          'OrgMembership',
          membership(),
          ME,
          org(role),
          null
        ),
        role
      ).toBe('membership_role_insufficient');
    }
  });

  it('lets an ADMIN manage non-owner rows but never grant, alter or remove OWNER', () => {
    expect(
      decideMembershipWrite(
        'OrgMembership',
        membership(),
        ME,
        org('ADMIN'),
        null
      )
    ).toBe('membership_org_admin');
    for (const rolesTouched of [
      ['ADMIN', 'OWNER'],
      ['OWNER', 'MEMBER'],
      ['OWNER'],
    ]) {
      expect(
        decideMembershipWrite(
          'OrgMembership',
          membership({ rolesTouched }),
          ME,
          org('ADMIN'),
          null
        ),
        rolesTouched.join('>')
      ).toBe('membership_owner_requires_owner');
    }
    expect(
      decideMembershipWrite(
        'OrgMembership',
        membership({ rolesTouched: ['ADMIN', 'OWNER'] }),
        ME,
        org('OWNER'),
        null
      )
    ).toBe('membership_org_admin');
  });

  it('refuses a caller with no membership in the organization as outside the tenant', () => {
    expect(
      decideMembershipWrite('OrgMembership', membership(), ME, NONE, null)
    ).toBe('tenant_out_of_scope');
  });

  it('admits the first owner of an empty organization, and only that', () => {
    const firstOwner = membership({
      side: 'create',
      memberUserId: ME,
      rolesTouched: ['OWNER'],
    });
    expect(
      decideMembershipWrite('OrgMembership', firstOwner, ME, NONE, EMPTY_ORG)
    ).toBe('membership_first_owner');
    const refused: Array<[string, MembershipRowWrite, FirstOwnerFacts]> = [
      [
        'org has a member',
        firstOwner,
        { ...EMPTY_ORG, organizationMemberCount: 1 },
      ],
      [
        'org has a fund',
        firstOwner,
        { ...EMPTY_ORG, organizationFundCount: 1 },
      ],
      [
        'org is deleted',
        firstOwner,
        { ...EMPTY_ORG, organizationDeleted: true },
      ],
      [
        'row is for someone else',
        { ...firstOwner, memberUserId: OTHER },
        EMPTY_ORG,
      ],
      [
        'row carries permissions',
        { ...firstOwner, setsPermissions: true },
        EMPTY_ORG,
      ],
      [
        'row updates an existing membership',
        { ...firstOwner, side: 'existing' },
        EMPTY_ORG,
      ],
    ];
    for (const [label, write, facts] of refused) {
      expect(
        decideMembershipWrite('OrgMembership', write, ME, NONE, facts),
        label
      ).toBe('tenant_out_of_scope');
    }
  });

  it('admits no self-joined membership other than the first owner: a join needs a service principal', () => {
    const join = membership({
      side: 'create',
      memberUserId: ME,
      rolesTouched: ['MEMBER'],
    });
    expect(
      decideMembershipWrite('OrgMembership', join, ME, NONE, EMPTY_ORG)
    ).toBe('tenant_out_of_scope');
  });

  it('never admits a first-owner create for someone who already belongs', () => {
    const firstOwner = membership({
      side: 'create',
      memberUserId: ME,
      rolesTouched: ['OWNER'],
    });
    expect(
      decideMembershipWrite(
        'OrgMembership',
        firstOwner,
        ME,
        org('MEMBER'),
        EMPTY_ORG
      )
    ).toBe('membership_role_insufficient');
  });
});

describe('FundAssignment', () => {
  it('refuses a MEMBER assigning themselves MANAGER, and admits an org OWNER or ADMIN', () => {
    const selfManager = assignment({
      memberUserId: ME,
      rolesTouched: ['MANAGER'],
    });
    expect(
      decideMembershipWrite(
        'FundAssignment',
        selfManager,
        ME,
        org('MEMBER'),
        null
      )
    ).toBe('membership_role_insufficient');
    expect(
      decideMembershipWrite(
        'FundAssignment',
        assignment(),
        ME,
        org('OWNER'),
        null
      )
    ).toBe('membership_org_admin');
    expect(
      decideMembershipWrite(
        'FundAssignment',
        assignment(),
        ME,
        org('ADMIN'),
        null
      )
    ).toBe('membership_org_admin');
  });

  it("admits the fund's own MANAGER, and refuses every lesser fund role", () => {
    expect(
      decideMembershipWrite(
        'FundAssignment',
        assignment(),
        ME,
        fund('MANAGER'),
        null
      )
    ).toBe('membership_fund_manager');
    for (const role of [
      'TRADER',
      'ANALYST',
      'COMPLIANCE',
      'AUDITOR',
      'VIEWER',
      'INVESTOR',
    ]) {
      expect(
        decideMembershipWrite(
          'FundAssignment',
          assignment(),
          ME,
          fund(role),
          null
        ),
        role
      ).toBe('membership_role_insufficient');
    }
  });

  it('refuses a caller with no standing in the fund or its organization as outside the tenant', () => {
    expect(
      decideMembershipWrite('FundAssignment', assignment(), ME, NONE, null)
    ).toBe('tenant_out_of_scope');
  });
});

describe('the mutation decision', () => {
  const user = { kind: 'user' as const, sub: ME, roles: ['fund_operator'] };
  const target: MutationTarget = {
    model: 'OrgMembership',
    action: 'update',
    cardinality: 'one',
    fieldName: 'updateOneOrgMembership',
  };

  it('decides the entitlement models on membership authority, not on tenancy', () => {
    expect(ruleFor('OrgMembership').policy).toBe('membership_authority');
    expect(ruleFor('FundAssignment').policy).toBe('membership_authority');
    expect(ruleFor('Fund').policy).toBe('tenant_scoped');
    // Being inside the tenant no longer admits the write.
    expect(
      evaluateMutationAccess(user, target, { tenantScope: 'in_scope' })
    ).toMatchObject({
      allowed: false,
      reason: 'membership_authority_unresolved',
    });
  });

  it('admits on an admitting verdict and refuses on every other, with the verdict as the reason', () => {
    expect(
      evaluateMutationAccess(user, target, {
        membershipAuthority: 'membership_org_admin',
      })
    ).toEqual({
      allowed: true,
      reason: 'membership_org_admin',
    });
    expect(
      evaluateMutationAccess(user, target, {
        membershipAuthority: 'membership_role_insufficient',
      })
    ).toEqual({
      allowed: false,
      reason: 'membership_role_insufficient',
      refusal: 'forbidden',
    });
    expect(
      evaluateMutationAccess(user, target, {
        membershipAuthority: 'unresolved',
      })
    ).toMatchObject({
      allowed: false,
      reason: 'membership_authority_unresolved',
    });
  });

  it('still refuses a bulk entitlement write before any authority is read', () => {
    const bulk: MutationTarget = {
      ...target,
      cardinality: 'many',
      fieldName: 'updateManyOrgMembership',
    };
    expect(
      evaluateMutationAccess(user, bulk, {
        membershipAuthority: 'membership_org_admin',
      })
    ).toMatchObject({
      allowed: false,
      reason: 'bulk_not_user_writable',
    });
  });
});
