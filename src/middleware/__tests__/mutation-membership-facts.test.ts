/**
 * The membership-authority facts read from the database, against a fake
 * client over fixture rows. Each case pairs a refusal with the admitted
 * control that differs from it in one row.
 */
import { describe, expect, it } from 'vitest';

import { classifyMutationField } from '../../auth/mutation-authorization';
import {
  membershipWriteVerdict,
  type MembershipFactsPrisma,
} from '../mutation-membership-facts';

type Row = Record<string, unknown>;

const OWNER = 'u-owner';
const ADMIN = 'u-admin';
const MEMBER = 'u-member';
const MANAGER = 'u-manager';
const FOUNDER = 'u-founder';
const JOINER = 'u-joiner';
const OUTSIDER = 'u-outsider';

const ROWS: Record<string, Row[]> = {
  orgMembership: [
    { id: 'om-owner', organizationId: 'org-1', userId: OWNER, role: 'OWNER' },
    { id: 'om-admin', organizationId: 'org-1', userId: ADMIN, role: 'ADMIN' },
    {
      id: 'om-member',
      organizationId: 'org-1',
      userId: MEMBER,
      role: 'MEMBER',
    },
    {
      id: 'om-x',
      organizationId: 'org-domain',
      userId: OUTSIDER,
      role: 'OWNER',
    },
  ],
  fundAssignment: [
    { id: 'fa-manager', fundId: 'fund-1', userId: MANAGER, role: 'MANAGER' },
    { id: 'fa-member', fundId: 'fund-1', userId: MEMBER, role: 'VIEWER' },
  ],
  fund: [{ id: 'fund-1', organizationId: 'org-1' }],
  organization: [
    { id: 'org-1', deletedAt: null, emailDomains: [] },
    { id: 'org-new', deletedAt: null, emailDomains: [] },
    { id: 'org-domain', deletedAt: null, emailDomains: ['join.example'] },
  ],
};

function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([key, condition]) =>
    condition !== null && typeof condition === 'object' && !(key in row)
      ? matches(row, condition as Row)
      : row[key] === condition
  );
}

function project(name: string, row: Row, select: Row): Row {
  const out: Row = {};
  for (const [key, wanted] of Object.entries(select)) {
    if (key === '_count') {
      out._count = {
        members: ROWS.orgMembership.filter((m) => m.organizationId === row.id)
          .length,
        funds: ROWS.fund.filter((f) => f.organizationId === row.id).length,
      };
    } else if (name === 'fundAssignment' && key === 'fund') {
      const parent = ROWS.fund.find((f) => f.id === row.fundId);
      out.fund = parent
        ? project('fund', parent, (wanted as { select: Row }).select)
        : null;
    } else {
      out[key] = row[key];
    }
  }
  return out;
}

interface Fake {
  prisma: MembershipFactsPrisma;
  reads: string[];
}

function fake(failing: ReadonlySet<string> = new Set()): Fake {
  const reads: string[] = [];
  const delegate = (
    name: string
  ): {
    findUnique: (args: { where: Row; select: Row }) => Promise<Row | null>;
  } => ({
    findUnique: ({ where, select }) => {
      reads.push(name);
      if (failing.has(name))
        return Promise.reject(new Error(`${name} unavailable`));
      const row = (ROWS[name] ?? []).find((r) => matches(r, where));
      return Promise.resolve(row ? project(name, row, select) : null);
    },
  });
  // Cast justified: the fake implements exactly the delegate methods the facts
  // read, with looser argument and result types than the structural interface.
  const prisma = {
    orgMembership: delegate('orgMembership'),
    fundAssignment: delegate('fundAssignment'),
    fund: delegate('fund'),
    organization: delegate('organization'),
  } as unknown as MembershipFactsPrisma;
  return { prisma, reads };
}

const MODELS = new Set(['OrgMembership', 'FundAssignment']);
const target = (field: string): ReturnType<typeof classifyMutationField> =>
  classifyMutationField(field, MODELS);
const connect = (id: string): Row => ({ connect: { id } });

describe('membershipWriteVerdict', () => {
  it("reads the caller's role from the database: a MEMBER promoting themselves is refused, an OWNER is admitted", async () => {
    const promote = {
      where: { id: 'om-member' },
      data: { role: { set: 'OWNER' } },
    };
    const { prisma } = fake();
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('updateOneOrgMembership'),
        promote,
        MEMBER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_role_insufficient',
    });
    const demote = {
      where: { id: 'om-member' },
      data: { role: { set: 'AUDITOR' } },
    };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('updateOneOrgMembership'),
        demote,
        OWNER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_org_admin',
    });
  });

  it('holds an ADMIN off an OWNER row by its stored role, not just the role being set', async () => {
    const { prisma } = fake();
    const demoteOwner = {
      where: { id: 'om-owner' },
      data: { role: { set: 'MEMBER' } },
    };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('updateOneOrgMembership'),
        demoteOwner,
        ADMIN
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_owner_requires_owner',
    });
    const removeOwner = { where: { id: 'om-owner' } };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('deleteOneOrgMembership'),
        removeOwner,
        ADMIN
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_owner_requires_owner',
    });
  });

  it("refuses a MEMBER creating a MANAGER assignment for themselves; admits the fund's MANAGER", async () => {
    const { prisma } = fake();
    const data = (userId: string, role: string): Row => ({
      data: { fund: connect('fund-1'), user: connect(userId), role },
    });
    expect(
      await membershipWriteVerdict(
        prisma,
        'FundAssignment',
        target('createOneFundAssignment'),
        data(MEMBER, 'MANAGER'),
        MEMBER
      )
    ).toEqual({ kind: 'decided', verdict: 'membership_role_insufficient' });
    expect(
      await membershipWriteVerdict(
        prisma,
        'FundAssignment',
        target('createOneFundAssignment'),
        data(OUTSIDER, 'ANALYST'),
        MANAGER
      )
    ).toEqual({ kind: 'decided', verdict: 'membership_fund_manager' });
  });

  it('admits the creator of an empty organization as its first OWNER, and no one into an occupied one', async () => {
    const { prisma } = fake();
    const create = (orgId: string): Row => ({
      data: {
        organization: connect(orgId),
        user: connect(FOUNDER),
        role: 'OWNER',
      },
    });
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('createOneOrgMembership'),
        create('org-new'),
        FOUNDER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_first_owner',
    });
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('createOneOrgMembership'),
        create('org-1'),
        FOUNDER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'tenant_out_of_scope',
    });
  });

  it('refuses a self-joined MEMBER (the column default role) into an organization that has members', async () => {
    const { prisma } = fake();
    const join = {
      data: { organization: connect('org-domain'), user: connect(JOINER) },
    };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('createOneOrgMembership'),
        join,
        JOINER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'tenant_out_of_scope',
    });
  });

  it('decides both branches of an upsert: the existing row and the create payload', async () => {
    const { prisma } = fake();
    const upsert = {
      where: {
        organizationId_userId: { organizationId: 'org-1', userId: OWNER },
      },
      create: {
        organization: connect('org-1'),
        user: connect(OWNER),
        role: 'MEMBER',
      },
      update: { role: { set: 'MEMBER' } },
    };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('upsertOneOrgMembership'),
        upsert,
        ADMIN
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_owner_requires_owner',
    });
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('upsertOneOrgMembership'),
        upsert,
        OWNER
      )
    ).toEqual({
      kind: 'decided',
      verdict: 'membership_org_admin',
    });
  });

  it('reports arguments that identify no row as unresolvable', async () => {
    const { prisma } = fake();
    const cases: Array<[string, Row]> = [
      ['updateOneOrgMembership', { data: {} }],
      ['createOneOrgMembership', { data: { user: connect(OWNER) } }],
      ['createOneOrgMembership', { data: { organization: connect('org-1') } }],
      ['createOneFundAssignment', { data: { user: connect(OWNER) } }],
    ];
    for (const [field, args] of cases) {
      const model = field.endsWith('FundAssignment')
        ? 'FundAssignment'
        : 'OrgMembership';
      expect(
        await membershipWriteVerdict(prisma, model, target(field), args, OWNER),
        field
      ).toEqual({ kind: 'unresolvable' });
    }
  });

  it('answers a row that does not exist exactly as a row in another tenant, so ids cannot be probed', async () => {
    const { prisma } = fake();
    const cases: Array<[string, Row]> = [
      ['updateOneOrgMembership', { where: { id: 'om-none' }, data: {} }],
      ['deleteOneFundAssignment', { where: { id: 'fa-none' } }],
      [
        'createOneFundAssignment',
        { data: { fund: connect('fund-none'), user: connect(OWNER) } },
      ],
      [
        'createOneOrgMembership',
        { data: { organization: connect('org-none'), user: connect(OWNER), role: 'OWNER' } },
      ],
      ['updateOneOrgMembership', { where: { id: 'om-x' }, data: {} }],
    ];
    for (const [field, args] of cases) {
      const model = field.endsWith('FundAssignment')
        ? 'FundAssignment'
        : 'OrgMembership';
      expect(
        await membershipWriteVerdict(prisma, model, target(field), args, OWNER),
        field
      ).toEqual({ kind: 'decided', verdict: 'tenant_out_of_scope' });
    }
  });

  it("reads the caller's standing in an organization once per mutation, across an upsert's two branches", async () => {
    const { prisma, reads } = fake();
    const upsert = {
      where: { id: 'om-member' },
      create: {
        organization: connect('org-1'),
        user: connect(MEMBER),
        role: 'MEMBER',
      },
      update: { role: { set: 'AUDITOR' } },
    };
    expect(
      await membershipWriteVerdict(
        prisma,
        'OrgMembership',
        target('upsertOneOrgMembership'),
        upsert,
        OWNER
      )
    ).toEqual({ kind: 'decided', verdict: 'membership_org_admin' });
    // The addressed row, then the caller's own membership in org-1, once.
    expect(reads).toEqual(['orgMembership', 'orgMembership']);
  });

  it('propagates a failed role read so the guard refuses, and reads each fact once', async () => {
    const args = {
      where: { id: 'om-member' },
      data: { role: { set: 'ADMIN' } },
    };
    const broken = fake(new Set(['orgMembership']));
    await expect(
      membershipWriteVerdict(
        broken.prisma,
        'OrgMembership',
        target('updateOneOrgMembership'),
        args,
        OWNER
      )
    ).rejects.toThrow('orgMembership unavailable');
    const healthy = fake();
    await membershipWriteVerdict(
      healthy.prisma,
      'OrgMembership',
      target('updateOneOrgMembership'),
      args,
      OWNER
    );
    expect(healthy.reads).toEqual(['orgMembership', 'orgMembership']);
  });
});
