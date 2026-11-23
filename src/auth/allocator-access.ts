/**
 * Allocator-office access — pure decision logic (AG-29, GAP-MO-ORG-02).
 *
 * Three questions the allocator workspace and the Manager OS role layer ask of
 * the backend, each answered here without I/O so the answer can be proven
 * without a database:
 *
 * - **Which of an office's entities may this person see?** An office member's
 *   view is their `OrgMembership` entity scope: every entity the office owns
 *   when `entityScopeAll` is true, otherwise exactly the listed
 *   `entityScopeIds`. Scope fails closed: an absent membership, a false flag
 *   with an empty list, or a list the database returned as null all resolve to
 *   no entity. An auditor sees the entities their ACTIVE grants for that
 *   office name, in addition to any membership scope.
 * - **Is this auditor grant active?** Only while it is not revoked and `now`
 *   is strictly before `expiresAt`. A grant expiring at exactly `now` is
 *   expired. `periodFrom`..`periodTo` is the audited period (what the auditor
 *   may look at), not the grant's validity, so it plays no part here.
 * - **Is this role assignment active?** From `startsAt` (inclusive) until
 *   `endsAt` (exclusive); open-ended when `endsAt` is null.
 *
 * `now` is always passed in, never read here, so a test can stand on either
 * side of a boundary.
 *
 * @module auth/allocator-access
 */

/** The entity scope of one office member: every entity, or exactly these. */
export type EntityScope =
  | { readonly all: true }
  | { readonly all: false; readonly investorIds: readonly string[] };

/** The scope that sees nothing. */
export const NO_ENTITIES: EntityScope = { all: false, investorIds: [] };

/** The membership columns the entity scope is read from, as Prisma returns them. */
export interface EntityScopeColumns {
  readonly entityScopeAll: boolean | null | undefined;
  readonly entityScopeIds: readonly string[] | null | undefined;
}

/**
 * Resolve a membership's entity scope. Fails closed: only `entityScopeAll ===
 * true` opens every entity; anything else is the listed ids, and a missing
 * membership or list is none.
 *
 * @param membership - The member's OrgMembership in the office, or `null` when they hold none.
 * @returns The resolved {@link EntityScope}.
 */
export function resolveEntityScope(
  membership: EntityScopeColumns | null
): EntityScope {
  if (membership === null) return NO_ENTITIES;
  if (membership.entityScopeAll === true) return { all: true };
  const ids = membership.entityScopeIds ?? [];
  return { all: false, investorIds: Array.from(new Set(ids)) };
}

/**
 * Widen a scope by the entities named in grants (an auditor's active grants).
 * An `all` scope stays `all`; a listed scope gains the granted ids.
 *
 * @param scope - The membership scope.
 * @param grantedIds - Entity ids named by active grants.
 * @returns The union.
 */
export function withGrantedEntities(
  scope: EntityScope,
  grantedIds: readonly string[]
): EntityScope {
  if (scope.all) return scope;
  return {
    all: false,
    investorIds: Array.from(new Set([...scope.investorIds, ...grantedIds])),
  };
}

/** A Prisma `where` fragment over `Investor`. */
export type InvestorWhere = Record<string, unknown>;

/**
 * The `Investor` filter for an office's entities within a scope: owned by the
 * office, not soft-deleted, and (for a listed scope) one of the listed ids. A
 * listed scope with no ids is `id IN ()`, which matches nothing.
 *
 * @param officeOrganizationId - The office whose entities are read.
 * @param scope - The reader's entity scope.
 * @returns The Prisma `where` fragment.
 */
export function officeEntityWhere(
  officeOrganizationId: string,
  scope: EntityScope
): InvestorWhere {
  const owned: InvestorWhere = {
    officeOrganizationId: { equals: officeOrganizationId },
    deletedAt: { equals: null },
  };
  return scope.all ? owned : { ...owned, id: { in: [...scope.investorIds] } };
}

/** The grant columns that decide whether it is active. */
export interface AuditorGrantValidity {
  readonly expiresAt: Date;
  /** Null when not revoked. Absent (not read) is unknown, and an unknown grant is not active. */
  readonly revokedAt?: Date | null;
}

/**
 * Whether an auditor grant is active at `now`: not revoked, and `now` strictly
 * before `expiresAt`.
 *
 * @param grant - The grant's validity columns.
 * @param now - The instant to decide at.
 */
export function isAuditorGrantActive(
  grant: AuditorGrantValidity,
  now: Date
): boolean {
  return grant.revokedAt === null && now.getTime() < grant.expiresAt.getTime();
}

/**
 * The Prisma `where` fragment selecting the auditor grants active at `now`;
 * the database half of {@link isAuditorGrantActive}.
 *
 * @param now - The instant to decide at.
 */
export function activeAuditorGrantWhere(now: Date): Record<string, unknown> {
  return { revokedAt: { equals: null }, expiresAt: { gt: now } };
}

/** The assignment columns that decide whether it is active. */
export interface RoleAssignmentWindow {
  readonly startsAt: Date;
  /** Null for open-ended. Absent (not read) is unknown, and an unknown window is not active. */
  readonly endsAt?: Date | null;
}

/**
 * Whether a role assignment is active at `now`: started (inclusive) and not
 * yet ended (exclusive).
 *
 * @param assignment - The assignment's window.
 * @param now - The instant to decide at.
 */
export function isRoleAssignmentActive(
  assignment: RoleAssignmentWindow,
  now: Date
): boolean {
  const t = now.getTime();
  const { endsAt } = assignment;
  if (endsAt === undefined) return false;
  return assignment.startsAt.getTime() <= t && (endsAt === null || t < endsAt.getTime());
}

/**
 * The Prisma `where` fragment selecting the role assignments active at `now`;
 * the database half of {@link isRoleAssignmentActive}.
 *
 * @param now - The instant to decide at.
 */
export function activeRoleAssignmentWhere(now: Date): Record<string, unknown> {
  return {
    startsAt: { lte: now },
    OR: [{ endsAt: { equals: null } }, { endsAt: { gt: now } }],
  };
}
