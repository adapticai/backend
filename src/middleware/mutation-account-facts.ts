/**
 * Database facts the mutation guard needs: which brokerage accounts a
 * TradingPolicy / AlpacaAccount write touches, who owns them, and — for the
 * audit trail — each touched policy's switch values before the write.
 *
 * One read serves both purposes, so a policy write costs the guard a single
 * `findUnique` (or a bounded `findMany` for a bulk write) plus, for a user
 * principal, the entitlement read the tenancy scoping already performs.
 *
 * Every read here fails CLOSED at the caller: an account the guard cannot
 * resolve is `unresolved`, which a user principal is refused on, and the
 * failure is logged rather than turned into an ownership answer.
 *
 * @module middleware/mutation-account-facts
 */

import {
  resolveEntitlement,
  type EntitlementPrismaClient,
} from '../auth/tenancy-scope';
import type { AccountOwnership, MutationTarget } from '../auth/mutation-authorization';
import type { AuditedPolicyRow, AuditLogWriter } from './trading-policy-audit';

/** Most rows a bulk policy write records in its audit row. */
export const MAX_AUDITED_BULK_ROWS = 200;

const ACCOUNT_SELECT = {
  id: true,
  userId: true,
  type: true,
  brokerageAccount: { select: { fundId: true } },
} as const;

const POLICY_SELECT = {
  id: true,
  alpacaAccountId: true,
  realtimeTradingEnabled: true,
  paperTradingOnly: true,
  killSwitchEnabled: true,
  autonomyMode: true,
  alpacaAccount: { select: ACCOUNT_SELECT },
} as const;

/** The account columns the guard reads. */
export interface AccountFacts {
  readonly id: string;
  readonly userId: string;
  readonly type: string;
  readonly brokerageAccount: { readonly fundId: string } | null;
}

/** The policy columns the guard reads. */
export interface PolicyFacts {
  readonly id: string;
  readonly alpacaAccountId: string;
  readonly realtimeTradingEnabled: boolean;
  readonly paperTradingOnly: boolean;
  readonly killSwitchEnabled: boolean;
  readonly autonomyMode: string;
  readonly alpacaAccount: AccountFacts;
}

type Where = Record<string, unknown>;

/**
 * The slice of the Prisma client the guard uses. Declared structurally so the
 * guard can be exercised against a fake, the pattern the tenancy scoping uses.
 */
export interface MutationAuthPrisma extends AuditLogWriter, EntitlementPrismaClient {
  tradingPolicy: {
    findUnique(args: { where: Where; select: typeof POLICY_SELECT }): Promise<PolicyFacts | null>;
    findMany(args: {
      where: Where;
      select: typeof POLICY_SELECT;
      take: number;
    }): Promise<PolicyFacts[]>;
  };
  alpacaAccount: {
    findUnique(args: { where: Where; select: typeof ACCOUNT_SELECT }): Promise<AccountFacts | null>;
  };
}

/** The accounts a write touches, with policy rows where they already exist. */
export interface TouchedAccounts {
  readonly accounts: readonly AccountFacts[];
  readonly policies: readonly AuditedPolicyRow[];
  /**
   * For an `AlpacaAccount` create: the owner the payload assigns. No account
   * row exists yet, so ownership is decided from this.
   */
  readonly assignedOwnerId?: string | null;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function stringAt(value: unknown, ...path: string[]): string | undefined {
  let cursor: unknown = value;
  for (const key of path) cursor = asRecord(cursor)?.[key];
  return typeof cursor === 'string' && cursor.length > 0 ? cursor : undefined;
}

/** The account a TradingPolicy create payload attaches to. */
function policyAccountIdIn(data: unknown): string | undefined {
  return stringAt(data, 'alpacaAccountId') ?? stringAt(data, 'alpacaAccount', 'connect', 'id');
}

function policyRow(row: PolicyFacts): AuditedPolicyRow {
  return {
    policyId: row.id,
    alpacaAccountId: row.alpacaAccountId,
    accountType: row.alpacaAccount.type,
    before: {
      realtimeTradingEnabled: row.realtimeTradingEnabled,
      paperTradingOnly: row.paperTradingOnly,
      killSwitchEnabled: row.killSwitchEnabled,
      autonomyMode: row.autonomyMode,
    },
  };
}

function newPolicyRow(account: AccountFacts): AuditedPolicyRow {
  return { policyId: null, alpacaAccountId: account.id, accountType: account.type, before: null };
}

async function accountById(prisma: MutationAuthPrisma, id: string): Promise<AccountFacts | null> {
  return prisma.alpacaAccount.findUnique({ where: { id }, select: ACCOUNT_SELECT });
}

async function touchedByPolicyWrite(
  prisma: MutationAuthPrisma,
  target: MutationTarget,
  args: Record<string, unknown>
): Promise<TouchedAccounts> {
  const where = asRecord(args.where);
  if (target.cardinality === 'many') {
    if (target.action === 'create') {
      const items = Array.isArray(args.data) ? args.data : [args.data];
      const accounts: AccountFacts[] = [];
      for (const item of items.slice(0, MAX_AUDITED_BULK_ROWS)) {
        const id = policyAccountIdIn(item);
        const account = id ? await accountById(prisma, id) : null;
        if (account) accounts.push(account);
      }
      return { accounts, policies: accounts.map(newPolicyRow) };
    }
    const rows = await prisma.tradingPolicy.findMany({
      where: where ?? {},
      select: POLICY_SELECT,
      take: MAX_AUDITED_BULK_ROWS,
    });
    return { accounts: rows.map((r) => r.alpacaAccount), policies: rows.map(policyRow) };
  }

  const existing =
    where && target.action !== 'create'
      ? await prisma.tradingPolicy.findUnique({ where, select: POLICY_SELECT })
      : null;
  if (existing) {
    return { accounts: [existing.alpacaAccount], policies: [policyRow(existing)] };
  }
  const createData = target.action === 'upsert' ? args.create : args.data;
  const accountId = target.action === 'create' || target.action === 'upsert'
    ? policyAccountIdIn(createData)
    : undefined;
  const account = accountId ? await accountById(prisma, accountId) : null;
  return account ? { accounts: [account], policies: [newPolicyRow(account)] } : { accounts: [], policies: [] };
}

async function touchedByAccountWrite(
  prisma: MutationAuthPrisma,
  target: MutationTarget,
  args: Record<string, unknown>
): Promise<TouchedAccounts> {
  if (target.action === 'create') {
    const owner = stringAt(args.data, 'userId') ?? stringAt(args.data, 'user', 'connect', 'id') ?? null;
    return { accounts: [], policies: [], assignedOwnerId: owner };
  }
  const where = asRecord(args.where);
  if (!where || target.cardinality === 'many') return { accounts: [], policies: [] };
  const account = await prisma.alpacaAccount.findUnique({ where, select: ACCOUNT_SELECT });
  if (!account) return { accounts: [], policies: [] };
  const policy = await prisma.tradingPolicy.findUnique({
    where: { alpacaAccountId: account.id },
    select: POLICY_SELECT,
  });
  return { accounts: [account], policies: policy ? [policyRow(policy)] : [] };
}

/**
 * The accounts (and existing policy rows) a mutation on `TradingPolicy` or
 * `AlpacaAccount` touches. Any other root model touches no account the guard
 * can resolve from its arguments, and yields an empty result.
 *
 * @throws Whatever the database raised; the caller fails closed on it.
 */
export async function loadTouchedAccounts(
  prisma: MutationAuthPrisma,
  target: MutationTarget,
  args: Record<string, unknown>
): Promise<TouchedAccounts> {
  if (target.model === 'TradingPolicy') return touchedByPolicyWrite(prisma, target, args);
  if (target.model === 'AlpacaAccount') return touchedByAccountWrite(prisma, target, args);
  return { accounts: [], policies: [] };
}

/**
 * Whether `userId` owns every account a write touches, or is entitled to the
 * fund each is bound to.
 *
 * An account the caller neither owns nor is fund-entitled to makes the whole
 * write `other`; a write whose accounts could not be resolved is
 * `unresolved`. Both refuse a user principal.
 *
 * @throws Whatever the entitlement read raised; the caller fails closed on it.
 */
export async function ownershipOf(
  prisma: MutationAuthPrisma,
  userId: string,
  touched: TouchedAccounts
): Promise<AccountOwnership> {
  if (touched.assignedOwnerId !== undefined) {
    if (touched.assignedOwnerId === null) return { kind: 'unresolved' };
    return touched.assignedOwnerId === userId ? { kind: 'owner' } : { kind: 'other' };
  }
  if (touched.accounts.length === 0) return { kind: 'unresolved' };
  if (touched.accounts.every((a) => a.userId === userId)) return { kind: 'owner' };

  const entitlement = await resolveEntitlement(prisma, userId);
  const funds = new Set(entitlement.fundIds);
  const allowed = touched.accounts.every(
    (a) => a.userId === userId || (a.brokerageAccount !== null && funds.has(a.brokerageAccount.fundId))
  );
  return allowed ? { kind: 'fund_entitled' } : { kind: 'other' };
}
