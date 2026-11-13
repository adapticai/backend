/**
 * The mutation guard's own tenancy check for a user principal's write to a
 * tenancy-governed model (Organization, OrgMembership, Fund, FundAssignment,
 * BrokerageAccount, Notification*).
 *
 * The tenancy-scoping middleware applies the same scope, but only as strongly
 * as `TENANCY_SCOPING_MODE` (default `shadow`) and only on root fields. The
 * guard cannot defer to it: fund entitlement — read from OrgMembership, Fund
 * and FundAssignment — is what admits a user's write to every AlpacaAccount
 * and TradingPolicy bridged to the fund, so an entitlement row a caller could
 * write outside their own tenants would let them mint the access they are
 * then checked against. The decision here is applied at the guard's own mode.
 *
 * - create: the payload's tenant must be one the caller is entitled to
 *   (`dataInScope`, the tenancy module's own create rule; for a model whose
 *   tenant is a parent row's, such as an Ada message's conversation, the
 *   parent is read under the caller's write scope).
 * - update / delete: the addressed row must match the caller's WRITE scope
 *   (`findUnique` on the caller's `where` AND the write-scope fragment).
 * - upsert: if the row exists it must be in scope; if it does not, the
 *   create payload must be.
 *
 * @module middleware/mutation-tenant-facts
 */

import type { MutationTarget, TenantScope } from '../auth/mutation-authorization';
import {
  buildWriteScopeWhere,
  dataInScope,
  hasCreateParent,
  injectScopeWhere,
  parentScopedCreateInScope,
  resolveEntitlement,
  type Entitlement,
  type EntitlementPrismaClient,
  type GovernedModel,
  type ParentScopeReader,
} from '../auth/tenancy-scope';

type Where = Record<string, unknown>;

/** A delegate that can say whether one row matching a unique `where` exists. */
export interface ScopedRowReader {
  findUnique(args: { where: Where; select: { id: true } }): Promise<{ id: string } | null>;
}

/**
 * The slice of the Prisma client the tenancy check reads. Declared
 * structurally so the guard can be exercised against a fake.
 */
export interface TenantScopePrisma extends EntitlementPrismaClient {
  organization: ScopedRowReader;
  orgMembership: EntitlementPrismaClient['orgMembership'] & ScopedRowReader;
  fund: EntitlementPrismaClient['fund'] & ScopedRowReader;
  fundAssignment: EntitlementPrismaClient['fundAssignment'] & ScopedRowReader;
  brokerageAccount: ScopedRowReader;
  notificationEvent: ScopedRowReader;
  notificationDelivery: ScopedRowReader;
  notificationPreference: ScopedRowReader;
  follow: ScopedRowReader;
  autoFollowRule: ScopedRowReader;
  pushSubscription: ScopedRowReader;
  adaConversation: ScopedRowReader & ParentScopeReader;
  adaMessage: ScopedRowReader;
  userTotp: ScopedRowReader;
  deskDecision: ScopedRowReader;
  featureFlagOverride: ScopedRowReader;
  mandateVersion: ScopedRowReader;
}

function readerFor(prisma: TenantScopePrisma, model: GovernedModel): ScopedRowReader {
  switch (model) {
    case 'Organization':
      return prisma.organization;
    case 'OrgMembership':
      return prisma.orgMembership;
    case 'Fund':
      return prisma.fund;
    case 'FundAssignment':
      return prisma.fundAssignment;
    case 'BrokerageAccount':
      return prisma.brokerageAccount;
    case 'NotificationEvent':
      return prisma.notificationEvent;
    case 'NotificationDelivery':
      return prisma.notificationDelivery;
    case 'NotificationPreference':
      return prisma.notificationPreference;
    case 'Follow':
      return prisma.follow;
    case 'AutoFollowRule':
      return prisma.autoFollowRule;
    case 'PushSubscription':
      return prisma.pushSubscription;
    case 'AdaConversation':
      return prisma.adaConversation;
    case 'AdaMessage':
      return prisma.adaMessage;
    case 'UserTotp':
      return prisma.userTotp;
    case 'DeskDecision':
      return prisma.deskDecision;
    case 'FeatureFlagOverride':
      return prisma.featureFlagOverride;
  }
}

/** Whether a create (or upsert's create) payload lands in the caller's scope. */
async function createInScope(
  prisma: TenantScopePrisma,
  model: GovernedModel,
  data: unknown,
  entitlement: Entitlement
): Promise<boolean> {
  if (dataInScope(model, data, entitlement)) return true;
  return hasCreateParent(model) ? parentScopedCreateInScope(prisma, model, data, entitlement) : false;
}

function asRecord(value: unknown): Where | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Where) : undefined;
}

const ID_ONLY = { id: true } as const;

/**
 * Whether a user's write to a governed model stays inside their entitlement.
 *
 * @throws Whatever the database raised; the caller fails closed on it.
 */
export async function tenantScopeOf(
  prisma: TenantScopePrisma,
  model: GovernedModel,
  target: MutationTarget,
  args: Record<string, unknown>,
  userId: string
): Promise<TenantScope> {
  const entitlement = await resolveEntitlement(prisma, userId);
  if (target.action === 'create') {
    return (await createInScope(prisma, model, args.data, entitlement)) ? 'in_scope' : 'out_of_scope';
  }
  const where = asRecord(args.where);
  if (!where) return 'out_of_scope';
  const reader = readerFor(prisma, model);
  const scoped = await reader.findUnique({
    where: injectScopeWhere(where, buildWriteScopeWhere(model, entitlement)),
    select: ID_ONLY,
  });
  if (scoped) return 'in_scope';
  if (target.action !== 'upsert') return 'out_of_scope';
  const existing = await reader.findUnique({ where, select: ID_ONLY });
  if (existing) return 'out_of_scope';
  return (await createInScope(prisma, model, args.create, entitlement)) ? 'in_scope' : 'out_of_scope';
}

/**
 * Whether a user's update of a MandateVersion addresses a version whose
 * mandate lies in the caller's entitlement: the mandate's organization is one
 * they are a member of, or its fund one they are entitled to. A user may only
 * update a version (`MODEL_WRITE_RULES`), so the addressed row is all there
 * is to check.
 *
 * @throws Whatever the database raised; the caller fails closed on it.
 */
export async function mandateVersionScopeOf(
  prisma: TenantScopePrisma,
  args: Record<string, unknown>,
  userId: string
): Promise<TenantScope> {
  const where = asRecord(args.where);
  if (!where) return 'out_of_scope';
  const entitlement = await resolveEntitlement(prisma, userId);
  const scoped = await prisma.mandateVersion.findUnique({
    where: injectScopeWhere(where, {
      mandate: {
        OR: [
          { organizationId: { in: [...entitlement.orgIds] } },
          { fundId: { in: [...entitlement.fundIds] } },
        ],
      },
    }),
    select: ID_ONLY,
  });
  return scoped ? 'in_scope' : 'out_of_scope';
}
