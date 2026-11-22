/**
 * Who may write an entitlement row — pure decision logic.
 *
 * `OrgMembership.role` and `FundAssignment.role` are the authority the rest of
 * the system reads: the platform derives a person's personas from them at
 * sign-in, the tenancy scope derives which organizations and funds they reach,
 * and fund entitlement admits writes to every brokerage account bridged to a
 * fund. Being inside a tenant is therefore not enough to write one of these
 * rows. A plain member who could write them could make themselves OWNER of
 * their organization, or MANAGER of any fund in it, and every downstream
 * authority would follow.
 *
 * A user principal may write an entitlement row only with authority over the
 * tenant the row belongs to:
 *
 * - **OrgMembership** — the caller holds OWNER or ADMIN in that organization.
 *   A row whose role is OWNER, before or after the write, needs OWNER: an
 *   ADMIN who could grant OWNER could grant it to themselves, and an ADMIN who
 *   could demote or remove an OWNER could take the organization from them.
 * - **FundAssignment** — the caller holds OWNER or ADMIN in the fund's
 *   organization, or a MANAGER assignment on that same fund. MANAGER is the
 *   highest fund role and is the role that runs the fund's team, so admitting
 *   it lets no one rise above what they already hold, and it confers nothing
 *   on any other fund.
 *
 * One self-service write is admitted without that authority, because the
 * backend can prove from its own rows that nothing is being taken from
 * anyone: the **first owner**. A caller makes themselves OWNER of an
 * organization that is not deleted and has no members and no funds. That is
 * the state an organization is in the moment its creator has written it; once
 * anyone holds a membership, or the organization holds a fund, the exception
 * closes, and an organization with neither has nothing in it to claim.
 *
 * Joining an organization any other way (an invitation, an email-domain
 * match) rests on proof the backend cannot verify from rows the caller is
 * unable to write — an invitation is a single-use token, and a user's email
 * address is a column of their own row — so those memberships are written by
 * a service principal after the platform has checked the proof.
 *
 * Everything here is decided from facts read from the database for this
 * mutation (`src/middleware/mutation-membership-facts.ts`), never from the
 * token's claims.
 *
 * @module auth/membership-write-authority
 */

/** An entitlement model. */
export type MembershipModel = 'OrgMembership' | 'FundAssignment';

/** Whether a model is one of the entitlement models this module decides. */
export function isMembershipModel(model: string): model is MembershipModel {
  return model === 'OrgMembership' || model === 'FundAssignment';
}

/** The organization role that owns an organization. */
export const ORG_OWNER_ROLE = 'OWNER';

/** Organization roles that may manage memberships and fund assignments. */
export const ORG_MANAGEMENT_ROLES: ReadonlySet<string> = new Set([
  ORG_OWNER_ROLE,
  'ADMIN',
]);

/** The fund role that may manage its own fund's assignments. */
export const FUND_MANAGER_ROLE = 'MANAGER';

/** What one side of an entitlement write does to one row. */
export interface MembershipRowWrite {
  /** Whether the row is being created, or an existing row changed or removed. */
  readonly side: 'create' | 'existing';
  /** The organization the row belongs to (for a fund assignment, its fund's). */
  readonly organizationId: string;
  /** For a fund assignment: the fund. */
  readonly fundId?: string;
  /** The person the row is for. */
  readonly memberUserId: string;
  /**
   * Every role the row holds before or after the write: the payload's role
   * (or the column default) for a create; the stored role, and the new one
   * if the write sets it, for an existing row.
   */
  readonly rolesTouched: readonly string[];
  /** Whether the write sets the row's free-form `permissions`. */
  readonly setsPermissions: boolean;
}

/** What the caller holds in the row's tenant, read from the database. */
export interface CallerStanding {
  /** The caller's OrgMembership role in the row's organization, or `null`. */
  readonly orgRole: string | null;
  /** For a fund assignment: the caller's FundAssignment role on that fund, or `null`. */
  readonly fundRole: string | null;
}

/** The facts a first-owner OrgMembership create is decided on. */
export interface FirstOwnerFacts {
  readonly organizationDeleted: boolean;
  readonly organizationMemberCount: number;
  readonly organizationFundCount: number;
}

/** Why an entitlement write was admitted or refused. */
export type MembershipVerdict =
  | 'membership_org_admin'
  | 'membership_fund_manager'
  | 'membership_first_owner'
  | 'tenant_out_of_scope'
  | 'membership_role_insufficient'
  | 'membership_owner_requires_owner';

/** The verdicts that admit the write. */
export const ADMITTING_MEMBERSHIP_VERDICTS: ReadonlySet<MembershipVerdict> =
  new Set<MembershipVerdict>([
    'membership_org_admin',
    'membership_fund_manager',
    'membership_first_owner',
  ]);

/**
 * Whether a write could be a first-owner create: the caller making
 * themselves a member of an organization they do not belong to. The
 * first-owner facts are read only for this shape.
 */
export function isFirstOwnerCandidate(
  model: MembershipModel,
  write: MembershipRowWrite,
  callerId: string,
  standing: CallerStanding
): boolean {
  return (
    model === 'OrgMembership' &&
    write.side === 'create' &&
    write.memberUserId === callerId &&
    standing.orgRole === null
  );
}

/** Whether a create makes the caller the plain first OWNER of an empty organization. */
function isFirstOwner(
  write: MembershipRowWrite,
  facts: FirstOwnerFacts
): boolean {
  return (
    write.rolesTouched.length === 1 &&
    write.rolesTouched[0] === ORG_OWNER_ROLE &&
    !write.setsPermissions &&
    !facts.organizationDeleted &&
    facts.organizationMemberCount === 0 &&
    facts.organizationFundCount === 0
  );
}

/**
 * Decide one side of an entitlement write. Pure; performs no I/O.
 *
 * @param model - The entitlement model written.
 * @param write - What the write does to the row.
 * @param callerId - The user principal's subject.
 * @param standing - What the caller holds in the row's tenant.
 * @param firstOwner - The first-owner facts, read only for an
 *   {@link isFirstOwnerCandidate} write; `null` otherwise.
 * @returns The verdict.
 */
export function decideMembershipWrite(
  model: MembershipModel,
  write: MembershipRowWrite,
  callerId: string,
  standing: CallerStanding,
  firstOwner: FirstOwnerFacts | null
): MembershipVerdict {
  const { orgRole, fundRole } = standing;
  if (model === 'OrgMembership') {
    if (orgRole === ORG_OWNER_ROLE) return 'membership_org_admin';
    if (orgRole !== null && ORG_MANAGEMENT_ROLES.has(orgRole)) {
      return write.rolesTouched.includes(ORG_OWNER_ROLE)
        ? 'membership_owner_requires_owner'
        : 'membership_org_admin';
    }
    if (orgRole !== null) return 'membership_role_insufficient';
    if (
      firstOwner !== null &&
      isFirstOwnerCandidate(model, write, callerId, standing) &&
      isFirstOwner(write, firstOwner)
    ) {
      return 'membership_first_owner';
    }
    return 'tenant_out_of_scope';
  }
  if (orgRole !== null && ORG_MANAGEMENT_ROLES.has(orgRole)) {
    return 'membership_org_admin';
  }
  if (fundRole === FUND_MANAGER_ROLE) return 'membership_fund_manager';
  if (orgRole !== null || fundRole !== null) {
    return 'membership_role_insufficient';
  }
  return 'tenant_out_of_scope';
}
