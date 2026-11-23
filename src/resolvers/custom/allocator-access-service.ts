/**
 * The served reads of allocator-office and Manager OS access (AG-29,
 * GAP-MO-ORG-02): the auditor grants and role assignments active NOW, and the
 * entities of an office a person may see.
 *
 * The generated `auditorGrants` / `roleAssignments` reads return every row in
 * the caller's organizations, revoked and expired ones included, because a
 * grant's history is a record worth reading. These reads answer the other
 * question — what is in force — with the server's clock, so no consumer
 * re-derives "active" from a clock of its own.
 *
 * Who may ask:
 *
 * - no principal is refused (`UNAUTHENTICATED`);
 * - a user reads only rows of organizations they belong to (the tenancy
 *   entitlement, `resolveEntitlement`), and the entity view only for
 *   themselves;
 * - the service and admin principals read unscoped, and name the person whose
 *   entity view they resolve (the platform resolves it at sign-in).
 *
 * Every refusal is a typed {@link AllocatorAccessRefusal}; nothing is turned
 * into an empty answer except "this person is entitled to nothing", which is
 * the true answer.
 *
 * @module resolvers/custom/allocator-access-service
 */

import {
  activeAuditorGrantWhere,
  activeRoleAssignmentWhere,
  isAuditorGrantActive,
  isRoleAssignmentActive,
  officeEntityWhere,
  resolveEntityScope,
  withGrantedEntities,
  type EntityScope,
  type EntityScopeColumns,
} from '../../auth/allocator-access';
import {
  resolveEntitlement,
  type EntitlementPrismaClient,
} from '../../auth/tenancy-scope';
import type { BackendPrincipal } from '../../auth/token-verifier';
import type { InvestorKycStatus, InvestorStatus, InvestorType } from '@prisma/client';

/** Why an access read was refused. */
export type AllocatorAccessRefusalCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'BAD_USER_INPUT';

/** A refused access read, mapped onto a GraphQL error by the resolver. */
export class AllocatorAccessRefusal extends Error {
  constructor(
    readonly code: AllocatorAccessRefusalCode,
    message: string
  ) {
    super(message);
    this.name = 'AllocatorAccessRefusal';
  }
}

/** A source of the current time; injectable for tests. */
export type Clock = () => Date;

/** The wall clock. */
export const systemClock: Clock = () => new Date();

/** An auditor grant row as Prisma returns it. */
export interface AuditorGrantRow {
  readonly id: string;
  readonly officeOrganizationId: string;
  readonly userId: string;
  readonly entityIds: string[];
  readonly periodFrom: Date;
  readonly periodTo: Date;
  readonly expiresAt: Date;
  readonly revokedAt?: Date | null;
  readonly grantedById: string;
  readonly createdAt: Date;
}

/** A role assignment row as Prisma returns it. */
export interface RoleAssignmentRow {
  readonly id: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly startsAt: Date;
  readonly endsAt?: Date | null;
}

/** A Prisma `where` object. */
type Where = Record<string, unknown>;

/** The Prisma delegates these reads use. Narrow so a test can pass a fake. */
export interface AllocatorAccessPrisma extends EntitlementPrismaClient {
  auditorGrant: {
    findMany<R extends AuditorGrantRow>(args: {
      where: Where;
      orderBy: Where;
    }): Promise<R[]>;
  };
  roleAssignment: {
    findMany<R extends RoleAssignmentRow>(args: {
      where: Where;
      orderBy: Where;
    }): Promise<R[]>;
  };
  orgMembership: EntitlementPrismaClient['orgMembership'] & {
    findFirst(args: {
      where: { organizationId: string; userId: string };
      select: { entityScopeAll: true; entityScopeIds: true };
    }): Promise<EntityScopeColumns | null>;
  };
  investor: {
    findMany(args: {
      where: Where;
      orderBy: Where;
      select: typeof OFFICE_ENTITY_SELECT;
    }): Promise<OfficeEntityRow[]>;
  };
}

/**
 * The columns `officeEntities` serves: the entity's identity, classification
 * and place in the office's tree. Holdings, documents and the linked user are
 * read through their own scoped reads, never through this one.
 */
export const OFFICE_ENTITY_SELECT = {
  id: true,
  name: true,
  type: true,
  status: true,
  kycStatus: true,
  jurisdiction: true,
  registrationNumber: true,
  parentInvestorId: true,
  officeOrganizationId: true,
  organizationId: true,
} as const;

/** One office entity as `officeEntities` serves it. */
export interface OfficeEntityRow {
  readonly id: string;
  readonly name: string;
  readonly type: InvestorType;
  readonly status: InvestorStatus;
  readonly kycStatus: InvestorKycStatus;
  readonly jurisdiction: string | null;
  readonly registrationNumber: string | null;
  readonly parentInvestorId: string | null;
  readonly officeOrganizationId: string | null;
  readonly organizationId: string;
}

/** Optional filters on the active reads. */
export interface ActiveFilter {
  readonly organizationId?: string | null;
  readonly userId?: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A named id, validated; `undefined` when not given. */
function idArg(
  name: string,
  value: string | null | undefined
): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (!UUID.test(value))
    throw new AllocatorAccessRefusal(
      'BAD_USER_INPUT',
      `${name} is not a UUID.`
    );
  return value;
}

/** Refuse a caller with no principal. */
function requirePrincipal(
  principal: BackendPrincipal | null | undefined
): BackendPrincipal {
  if (!principal)
    throw new AllocatorAccessRefusal(
      'UNAUTHENTICATED',
      'Sign in to read access.'
    );
  return principal;
}

/**
 * The organizations a principal may read access rows of: `null` for the
 * service and admin principals (unscoped), the member organizations for a
 * user.
 */
async function readableOrgIds(
  prisma: AllocatorAccessPrisma,
  principal: BackendPrincipal
): Promise<readonly string[] | null> {
  if (principal.kind === 'server' || principal.kind === 'admin') return null;
  return (await resolveEntitlement(prisma, principal.sub)).orgIds;
}

/** AND the optional filters and the caller's organization scope onto a base `where`. */
function scopedWhere(
  base: Where,
  orgField: string,
  orgIds: readonly string[] | null,
  filter: { organizationId?: string; userId?: string }
): Where {
  const and: Where[] = [base];
  if (orgIds !== null) and.push({ [orgField]: { in: [...orgIds] } });
  if (filter.organizationId !== undefined)
    and.push({ [orgField]: { equals: filter.organizationId } });
  if (filter.userId !== undefined)
    and.push({ userId: { equals: filter.userId } });
  return { AND: and };
}

/**
 * The auditor grants active at the clock's `now`, in the caller's scope.
 *
 * The database selects them (`revokedAt` null, `expiresAt` after now) and
 * every row is checked again against the same instant, so a row the query
 * should not have matched is never served as active.
 *
 * @param prisma - The Prisma client (or a structural subset).
 * @param principal - The verified caller.
 * @param filter - Optional office (`organizationId`) and auditor (`userId`) filters.
 * @param clock - The time source.
 */
export async function activeAuditorGrants<R extends AuditorGrantRow>(
  prisma: AllocatorAccessPrisma,
  principal: BackendPrincipal | null | undefined,
  filter: ActiveFilter,
  clock: Clock = systemClock
): Promise<R[]> {
  const caller = requirePrincipal(principal);
  const organizationId = idArg('officeOrganizationId', filter.organizationId);
  const userId = idArg('userId', filter.userId);
  const now = clock();
  const orgIds = await readableOrgIds(prisma, caller);
  const rows = await prisma.auditorGrant.findMany<R>({
    where: scopedWhere(
      activeAuditorGrantWhere(now),
      'officeOrganizationId',
      orgIds,
      { organizationId, userId }
    ),
    orderBy: { expiresAt: 'asc' },
  });
  return rows.filter((row) => isAuditorGrantActive(row, now));
}

/**
 * The role assignments active at the clock's `now`, in the caller's scope;
 * checked again per row like {@link activeAuditorGrants}.
 *
 * @param prisma - The Prisma client (or a structural subset).
 * @param principal - The verified caller.
 * @param filter - Optional organization and holder filters.
 * @param clock - The time source.
 */
export async function activeRoleAssignments<R extends RoleAssignmentRow>(
  prisma: AllocatorAccessPrisma,
  principal: BackendPrincipal | null | undefined,
  filter: ActiveFilter,
  clock: Clock = systemClock
): Promise<R[]> {
  const caller = requirePrincipal(principal);
  const organizationId = idArg('organizationId', filter.organizationId);
  const userId = idArg('userId', filter.userId);
  const now = clock();
  const orgIds = await readableOrgIds(prisma, caller);
  const rows = await prisma.roleAssignment.findMany<R>({
    where: scopedWhere(
      activeRoleAssignmentWhere(now),
      'organizationId',
      orgIds,
      { organizationId, userId }
    ),
    orderBy: { startsAt: 'asc' },
  });
  return rows.filter((row) => isRoleAssignmentActive(row, now));
}

/**
 * The person whose entity view is resolved: a user resolves only their own;
 * the service and admin principals must name one.
 */
function entityViewer(
  principal: BackendPrincipal,
  userId: string | undefined
): string {
  if (principal.kind === 'user') {
    if (userId !== undefined && userId !== principal.sub) {
      throw new AllocatorAccessRefusal(
        'FORBIDDEN',
        'A user reads only their own entity view.'
      );
    }
    return principal.sub;
  }
  if (userId === undefined) {
    throw new AllocatorAccessRefusal(
      'BAD_USER_INPUT',
      'Name the user whose entity view to resolve.'
    );
  }
  return userId;
}

/**
 * The entity scope a person holds in an office: their membership's scope,
 * widened by the entities their active auditor grants for that office name.
 * Fails closed: no membership and no active grant is no entity.
 *
 * @param prisma - The Prisma client (or a structural subset).
 * @param officeOrganizationId - The office.
 * @param userId - The person.
 * @param now - The instant grants are judged at.
 */
export async function entityScopeOf(
  prisma: AllocatorAccessPrisma,
  officeOrganizationId: string,
  userId: string,
  now: Date
): Promise<EntityScope> {
  const [membership, grants] = await Promise.all([
    prisma.orgMembership.findFirst({
      where: { organizationId: officeOrganizationId, userId },
      select: { entityScopeAll: true, entityScopeIds: true },
    }),
    prisma.auditorGrant.findMany<AuditorGrantRow>({
      where: {
        AND: [
          activeAuditorGrantWhere(now),
          { officeOrganizationId: { equals: officeOrganizationId } },
          { userId: { equals: userId } },
        ],
      },
      orderBy: { expiresAt: 'asc' },
    }),
  ]);
  const granted = grants
    .filter((grant) => isAuditorGrantActive(grant, now))
    .flatMap((grant) => grant.entityIds);
  return withGrantedEntities(resolveEntityScope(membership), granted);
}

/**
 * The entities (OfficeEntity rows: identity, classification, tree place) of an office the viewer may see, ordered by
 * name. A user reads their own view; the service and admin principals name
 * the viewer.
 *
 * @param prisma - The Prisma client (or a structural subset).
 * @param principal - The verified caller.
 * @param args - The office and, for a service or admin caller, the viewer.
 * @param clock - The time source.
 */
export async function officeEntities(
  prisma: AllocatorAccessPrisma,
  principal: BackendPrincipal | null | undefined,
  args: { officeOrganizationId: string; userId?: string | null },
  clock: Clock = systemClock
): Promise<OfficeEntityRow[]> {
  const caller = requirePrincipal(principal);
  const officeOrganizationId = idArg(
    'officeOrganizationId',
    args.officeOrganizationId
  );
  if (officeOrganizationId === undefined) {
    throw new AllocatorAccessRefusal(
      'BAD_USER_INPUT',
      'officeOrganizationId is required.'
    );
  }
  const viewer = entityViewer(caller, idArg('userId', args.userId));
  const scope = await entityScopeOf(
    prisma,
    officeOrganizationId,
    viewer,
    clock()
  );
  if (!scope.all && scope.investorIds.length === 0) return [];
  return prisma.investor.findMany({
    where: officeEntityWhere(officeOrganizationId, scope),
    orderBy: { name: 'asc' },
    select: OFFICE_ENTITY_SELECT,
  });
}
