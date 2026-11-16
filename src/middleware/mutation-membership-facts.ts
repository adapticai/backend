/**
 * The database facts a user principal's OrgMembership or FundAssignment write
 * is decided on (`src/auth/membership-write-authority.ts`).
 *
 * For each row the write reaches — the payload's row for a create, the row the
 * caller's `where` addresses for an update or delete, both for an upsert — it
 * reads the row's organization (and fund), and what the CALLER holds there:
 * their OrgMembership role in that organization and, for a fund assignment,
 * their FundAssignment role on that fund. Roles come from these rows, never
 * from the token's claims, because the token's roles are the platform's
 * persona for the caller and are themselves derived from these rows. Each
 * organization's and fund's standing is read once per mutation.
 *
 * A row that does not exist (an addressed membership, or the fund a payload
 * names) is decided as outside the caller's tenant, the same answer a row in
 * another tenant gets, so the refusal says nothing about which ids exist.
 * Arguments that identify no row at all (no `where`, a payload naming no
 * organization, fund or member) are {@link MembershipFacts} `unresolvable`;
 * a database failure propagates. The guard refuses on both.
 *
 * @module middleware/mutation-membership-facts
 */

import type { Prisma } from '@prisma/client';

import type { MutationTarget } from '../auth/mutation-authorization';
import {
  ADMITTING_MEMBERSHIP_VERDICTS,
  decideMembershipWrite,
  isFirstOwnerCandidate,
  type CallerStanding,
  type FirstOwnerFacts,
  type MembershipModel,
  type MembershipRowWrite,
  type MembershipVerdict,
} from '../auth/membership-write-authority';

type Where = Record<string, unknown>;

// Each selection and unique selector is pinned to the generated Prisma types,
// so a renamed column, relation or compound key fails the build rather than
// failing every membership write at run time.
const MEMBERSHIP_SELECT = {
  organizationId: true,
  userId: true,
  role: true,
} as const satisfies Prisma.OrgMembershipSelect;
const ASSIGNMENT_SELECT = {
  fundId: true,
  userId: true,
  role: true,
  fund: { select: { organizationId: true } },
} as const satisfies Prisma.FundAssignmentSelect;
const MEMBERSHIP_ROLE_SELECT = {
  role: true,
} as const satisfies Prisma.OrgMembershipSelect;
const ASSIGNMENT_ROLE_SELECT = {
  role: true,
} as const satisfies Prisma.FundAssignmentSelect;
const FUND_SELECT = {
  organizationId: true,
} as const satisfies Prisma.FundSelect;
const ORGANIZATION_SELECT = {
  deletedAt: true,
  _count: { select: { members: true, funds: true } },
} as const satisfies Prisma.OrganizationSelect;

/** The caller's own membership in an organization, by its compound unique key. */
function callerMembershipWhere(
  organizationId: string,
  userId: string
): Prisma.OrgMembershipWhereUniqueInput {
  return { organizationId_userId: { organizationId, userId } };
}

/** The caller's own assignment on a fund, by its compound unique key. */
function callerAssignmentWhere(
  fundId: string,
  userId: string
): Prisma.FundAssignmentWhereUniqueInput {
  return { fundId_userId: { fundId, userId } };
}

/**
 * The slice of the Prisma client the facts are read through. Declared
 * structurally so the decision can be exercised against a fake; the guard
 * passes the server's PrismaClient.
 */
export interface MembershipFactsPrisma {
  orgMembership: {
    findUnique(args: {
      where: Where;
      select: typeof MEMBERSHIP_SELECT | typeof MEMBERSHIP_ROLE_SELECT;
    }): Promise<{
      organizationId?: string;
      userId?: string;
      role: string;
    } | null>;
  };
  fundAssignment: {
    findUnique(args: {
      where: Where;
      select: typeof ASSIGNMENT_SELECT | typeof ASSIGNMENT_ROLE_SELECT;
    }): Promise<{
      fundId?: string;
      userId?: string;
      role: string;
      fund?: { organizationId: string };
    } | null>;
  };
  fund: {
    findUnique(args: {
      where: { id: string };
      select: typeof FUND_SELECT;
    }): Promise<{ organizationId: string } | null>;
  };
  organization: {
    findUnique(args: {
      where: { id: string };
      select: typeof ORGANIZATION_SELECT;
    }): Promise<{
      deletedAt: Date | null;
      _count: { members: number; funds: number };
    } | null>;
  };
}

/** The outcome of {@link membershipWriteVerdict}. */
export type MembershipFacts =
  | { readonly kind: 'decided'; readonly verdict: MembershipVerdict }
  | { readonly kind: 'unresolvable' };

/** The column default for each model's `role` (`prisma/schema.prisma`). */
const DEFAULT_ROLE: Record<MembershipModel, string> = {
  OrgMembership: 'MEMBER',
  FundAssignment: 'VIEWER',
};

/** A row the write reaches; `missing` when it names a row that does not exist. */
type RowLookup = MembershipRowWrite | 'missing' | 'malformed';

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** A foreign key from a create payload, in its scalar or `relation.connect.id` form. */
function connectIdOf(
  data: Record<string, unknown>,
  scalar: string,
  relation: string
): string | undefined {
  const direct = data[scalar];
  if (typeof direct === 'string' && direct.length > 0) return direct;
  const id = asRecord(asRecord(data[relation])?.connect)?.id;
  return typeof id === 'string' && id.length > 0 ? id : undefined;
}

/** An enum value written either bare (`OWNER`) or as `{ set: OWNER }`. */
function enumValueOf(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  const set = asRecord(value)?.set;
  return typeof set === 'string' ? set : undefined;
}

/** Whether a payload writes the `permissions` list at all. */
function setsPermissions(data: Record<string, unknown>): boolean {
  return data.permissions !== undefined && data.permissions !== null;
}

/** The row a create payload would write. */
async function createdRow(
  prisma: MembershipFactsPrisma,
  model: MembershipModel,
  payload: unknown
): Promise<RowLookup> {
  const data = asRecord(payload);
  if (!data) return 'malformed';
  const memberUserId = connectIdOf(data, 'userId', 'user');
  if (memberUserId === undefined) return 'malformed';
  const role =
    data.role === undefined ? DEFAULT_ROLE[model] : enumValueOf(data.role);
  if (role === undefined) return 'malformed';
  const base = {
    side: 'create' as const,
    memberUserId,
    rolesTouched: [role],
    setsPermissions: setsPermissions(data),
  };
  if (model === 'OrgMembership') {
    const organizationId = connectIdOf(data, 'organizationId', 'organization');
    return organizationId === undefined
      ? 'malformed'
      : { ...base, organizationId };
  }
  const fundId = connectIdOf(data, 'fundId', 'fund');
  if (fundId === undefined) return 'malformed';
  const fund = await prisma.fund.findUnique({
    where: { id: fundId },
    select: FUND_SELECT,
  });
  return fund
    ? { ...base, organizationId: fund.organizationId, fundId }
    : 'missing';
}

/** The row an update, upsert or delete addresses. */
async function existingRow(
  prisma: MembershipFactsPrisma,
  model: MembershipModel,
  where: Where,
  update: Record<string, unknown> | undefined
): Promise<RowLookup> {
  const newRole =
    update?.role === undefined ? undefined : enumValueOf(update.role);
  const extra = {
    side: 'existing' as const,
    setsPermissions: update !== undefined && setsPermissions(update),
  };
  if (model === 'OrgMembership') {
    const row = await prisma.orgMembership.findUnique({
      where,
      select: MEMBERSHIP_SELECT,
    });
    if (!row?.organizationId || !row.userId) return 'missing';
    return {
      ...extra,
      organizationId: row.organizationId,
      memberUserId: row.userId,
      rolesTouched: newRole === undefined ? [row.role] : [row.role, newRole],
    };
  }
  const row = await prisma.fundAssignment.findUnique({
    where,
    select: ASSIGNMENT_SELECT,
  });
  if (!row?.fundId || !row.userId || !row.fund) return 'missing';
  return {
    ...extra,
    organizationId: row.fund.organizationId,
    fundId: row.fundId,
    memberUserId: row.userId,
    rolesTouched: newRole === undefined ? [row.role] : [row.role, newRole],
  };
}

/**
 * The rows a write reaches. An upsert reaches the existing row when there is
 * one (the update branch) and always the create payload's row (the branch
 * taken when there is none).
 */
async function rowsWritten(
  prisma: MembershipFactsPrisma,
  model: MembershipModel,
  target: MutationTarget,
  args: Record<string, unknown>
): Promise<RowLookup[] | 'malformed'> {
  if (target.action === 'create') {
    const row = await createdRow(prisma, model, args.data);
    return row === 'malformed' ? row : [row];
  }
  const where = asRecord(args.where);
  if (!where) return 'malformed';
  if (target.action === 'upsert') {
    const created = await createdRow(prisma, model, args.create);
    if (created === 'malformed') return created;
    const existing = await existingRow(
      prisma,
      model,
      where,
      asRecord(args.update)
    );
    return existing === 'missing' ? [created] : [existing, created];
  }
  const update = target.action === 'update' ? asRecord(args.data) : undefined;
  return [await existingRow(prisma, model, where, update)];
}

/** Reads what the caller holds in an organization and fund, once each per mutation. */
function standingReader(
  prisma: MembershipFactsPrisma,
  callerId: string
): (write: MembershipRowWrite) => Promise<CallerStanding> {
  const orgRoles = new Map<string, Promise<string | null>>();
  const fundRoles = new Map<string, Promise<string | null>>();
  const orgRole = (organizationId: string): Promise<string | null> => {
    let role = orgRoles.get(organizationId);
    if (!role) {
      role = prisma.orgMembership
        .findUnique({
          where: callerMembershipWhere(organizationId, callerId),
          select: MEMBERSHIP_ROLE_SELECT,
        })
        .then((row) => row?.role ?? null);
      orgRoles.set(organizationId, role);
    }
    return role;
  };
  const fundRole = (fundId: string): Promise<string | null> => {
    let role = fundRoles.get(fundId);
    if (!role) {
      role = prisma.fundAssignment
        .findUnique({
          where: callerAssignmentWhere(fundId, callerId),
          select: ASSIGNMENT_ROLE_SELECT,
        })
        .then((row) => row?.role ?? null);
      fundRoles.set(fundId, role);
    }
    return role;
  };
  return async (write) => {
    const [org, fund] = await Promise.all([
      orgRole(write.organizationId),
      write.fundId === undefined
        ? Promise.resolve(null)
        : fundRole(write.fundId),
    ]);
    return { orgRole: org, fundRole: fund };
  };
}

/** The facts a first-owner create is decided on, or `null` when the organization does not exist. */
async function firstOwnerFactsOf(
  prisma: MembershipFactsPrisma,
  organizationId: string
): Promise<FirstOwnerFacts | null> {
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: ORGANIZATION_SELECT,
  });
  if (!organization) return null;
  return {
    organizationDeleted: organization.deletedAt !== null,
    organizationMemberCount: organization._count.members,
    organizationFundCount: organization._count.funds,
  };
}

/**
 * Decide a user principal's write to an entitlement row from the database.
 * Every row the write reaches must be admitted; the first refusal is returned.
 *
 * @param prisma - A client exposing {@link MembershipFactsPrisma}.
 * @param model - The entitlement model written.
 * @param target - The classified root mutation (`one` cardinality).
 * @param args - The mutation's arguments.
 * @param callerId - The user principal's subject.
 * @throws Whatever the database raised; the caller refuses on it.
 */
export async function membershipWriteVerdict(
  prisma: MembershipFactsPrisma,
  model: MembershipModel,
  target: MutationTarget,
  args: Record<string, unknown>,
  callerId: string
): Promise<MembershipFacts> {
  const rows = await rowsWritten(prisma, model, target, args);
  if (rows === 'malformed') return { kind: 'unresolvable' };
  const standingOf = standingReader(prisma, callerId);
  let admitted: MembershipVerdict | null = null;
  for (const row of rows) {
    if (row === 'missing' || row === 'malformed') {
      return row === 'missing'
        ? { kind: 'decided', verdict: 'tenant_out_of_scope' }
        : { kind: 'unresolvable' };
    }
    const standing = await standingOf(row);
    const firstOwner = isFirstOwnerCandidate(model, row, callerId, standing)
      ? await firstOwnerFactsOf(prisma, row.organizationId)
      : null;
    const verdict = decideMembershipWrite(
      model,
      row,
      callerId,
      standing,
      firstOwner
    );
    if (!ADMITTING_MEMBERSHIP_VERDICTS.has(verdict)) {
      return { kind: 'decided', verdict };
    }
    admitted ??= verdict;
  }
  return admitted === null
    ? { kind: 'unresolvable' }
    : { kind: 'decided', verdict: admitted };
}
