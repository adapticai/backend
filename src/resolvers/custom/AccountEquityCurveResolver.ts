/**
 * `accountEquityCurve` and `marketTape` — server-side audit reads.
 *
 * Return an account's 1-minute equity curve and the market tape without the
 * caller ever holding the account's broker key. Both require an audit-read
 * token in the `x-adaptic-audit-token` header (see `assertAuditRead`) and
 * refuse LIVE accounts.
 * Read-only on the broker; every read spends a per-operator request budget and
 * writes an `AuditLog` row naming the operator, account and operation.
 *
 * @module resolvers/custom/AccountEquityCurveResolver
 */
import * as TypeGraphQL from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import { logger } from '../../utils/logger';
import {
  assertAccountReadable,
  assertAuditRead,
  auditTokenFromHeaders,
  createOperatorBudgets,
  parseSessionDate,
  readEquityCurve,
  readMarketTape,
  validateTapeArgs,
  type AlpacaFetch,
  type AuditAccountRow,
} from './account-audit-read';

@TypeGraphQL.ObjectType('EquityCurvePoint', {})
export class EquityCurvePoint {
  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  ms!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  equity!: number;
}

@TypeGraphQL.ObjectType('AccountEquityCurve', {})
export class AccountEquityCurve {
  @TypeGraphQL.Field((_t) => String)
  accountId!: string;

  @TypeGraphQL.Field((_t) => String)
  accountType!: string;

  @TypeGraphQL.Field((_t) => String)
  accountName!: string;

  @TypeGraphQL.Field((_t) => String)
  sessionDate!: string;

  @TypeGraphQL.Field((_t) => [EquityCurvePoint])
  points!: EquityCurvePoint[];

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  lastEquity!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  equity!: number;

  @TypeGraphQL.Field((_t) => String)
  source!: string;
}

@TypeGraphQL.ObjectType('MarketTapeBar', {})
export class MarketTapeBar {
  @TypeGraphQL.Field((_t) => String)
  symbol!: string;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  ms!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  o!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  h!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  l!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  c!: number;

  @TypeGraphQL.Field((_t) => TypeGraphQL.Float)
  v!: number;

  @TypeGraphQL.Field((_t) => String)
  feed!: string;
}

interface GraphQLContext {
  req?: { headers?: Record<string, string | string[] | undefined> };
}

/**
 * Injectable HTTP client. Exported as a test seam only: nothing in production
 * reassigns `current`, and the default is the global `fetch`.
 */
export const alpacaFetch: { current: AlpacaFetch } = {
  current: (url, init) => fetch(url, init),
};

const operatorBudget = createOperatorBudgets();

/** `AuditLog.operationType` has no READ member, so a read is recorded as a CREATE of an `AuditRead` record. */
async function recordRead(
  prisma: PrismaClient,
  p: { operator: string; accountId: string; op: string; detail?: Record<string, unknown> }
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        operationType: 'CREATE',
        modelName: 'AuditRead',
        recordId: p.accountId,
        operationName: p.op,
        changedFields: {},
        metadata: { operator: p.operator, accountId: p.accountId, op: p.op, ...p.detail },
      },
    });
  } catch (err) {
    // Fail closed: an unrecorded read is not served.
    logger.error('[audit-read] could not write the AuditLog row; refusing the read', { operator: p.operator, accountId: p.accountId, op: p.op, err });
    throw new GraphQLError('Audit read could not be recorded', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
}

async function loadAccount(prisma: PrismaClient, id: string): Promise<AuditAccountRow> {
  const account = await prisma.alpacaAccount.findUnique({
    where: { id },
    select: { id: true, type: true, APIKey: true, APISecret: true, configuration: true },
  });
  if (!account) throw new GraphQLError('Account not found', { extensions: { code: 'NOT_FOUND' } });
  assertAccountReadable(account as AuditAccountRow);
  return account as AuditAccountRow;
}

@TypeGraphQL.Resolver()
export class AccountEquityCurveResolver {
  @TypeGraphQL.Query((_returns) => AccountEquityCurve, {
    description:
      'A session’s 1-minute equity curve for one account, read server-side. Requires an audit-read token. PAPER accounts only.',
  })
  async accountEquityCurve(
    @TypeGraphQL.Ctx() ctx: GraphQLContext,
    @TypeGraphQL.Arg('accountId', (_t) => String) accountId: string,
    @TypeGraphQL.Arg('sessionDate', (_t) => String, { nullable: true }) sessionDate?: string
  ): Promise<AccountEquityCurve> {
    const operator = assertAuditRead(auditTokenFromHeaders(ctx.req?.headers));
    const date = parseSessionDate(sessionDate);
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const account = await loadAccount(prisma, accountId);
    await recordRead(prisma, { operator, accountId, op: 'accountEquityCurve', detail: { sessionDate: date } });
    return readEquityCurve({
      account,
      sessionDate: date,
      nowMs: Date.now(),
      fetchImpl: alpacaFetch.current,
      budget: operatorBudget(operator),
    });
  }

  @TypeGraphQL.Query((_returns) => [MarketTapeBar], {
    description:
      '1-minute bars for the symbols over [startMs, endMs], read server-side with the account’s market-data entitlement. Requires an audit-read token. PAPER accounts only.',
  })
  async marketTape(
    @TypeGraphQL.Ctx() ctx: GraphQLContext,
    @TypeGraphQL.Arg('accountId', (_t) => String) accountId: string,
    @TypeGraphQL.Arg('symbols', (_t) => [String]) symbols: string[],
    @TypeGraphQL.Arg('startMs', (_t) => TypeGraphQL.Float) startMs: number,
    @TypeGraphQL.Arg('endMs', (_t) => TypeGraphQL.Float) endMs: number,
    @TypeGraphQL.Arg('feed', (_t) => String, { defaultValue: 'auto' }) feed?: string
  ): Promise<MarketTapeBar[]> {
    const operator = assertAuditRead(auditTokenFromHeaders(ctx.req?.headers));
    const args = validateTapeArgs({ symbols, startMs, endMs, feed: feed ?? 'auto' });
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const account = await loadAccount(prisma, accountId);
    await recordRead(prisma, {
      operator,
      accountId,
      op: 'marketTape',
      detail: { symbols: args.symbols, feed: args.feed, startMs, endMs },
    });
    return readMarketTape({
      account,
      symbols: args.symbols,
      startMs,
      endMs,
      feed: args.feed,
      nowMs: Date.now(),
      fetchImpl: alpacaFetch.current,
      budget: operatorBudget(operator),
    });
  }
}
