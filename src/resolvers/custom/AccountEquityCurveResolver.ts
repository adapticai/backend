/**
 * `accountEquityCurve` and `marketTape` — server-side audit reads.
 *
 * Return an account's 1-minute equity curve and the market tape without the
 * caller ever holding the account's broker key. Both require the audit-read
 * role (see `assertAuditRead`) and refuse LIVE accounts unless `includeLive`.
 * Read-only; every read logs the operator and account.
 *
 * @module resolvers/custom/AccountEquityCurveResolver
 */
import * as TypeGraphQL from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { logger } from '../../utils/logger';
import {
  assertAccountReadable,
  assertAuditRead,
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
  principal?: BackendPrincipal | null;
}

/** Injectable HTTP client; tests replace it. */
export const alpacaFetch: { current: AlpacaFetch } = {
  current: (url, init) => fetch(url, init),
};

async function loadAccount(prisma: PrismaClient, id: string, includeLive: boolean): Promise<AuditAccountRow> {
  const account = await prisma.alpacaAccount.findUnique({
    where: { id },
    select: { id: true, type: true, APIKey: true, APISecret: true, configuration: true },
  });
  if (!account) throw new GraphQLError('Account not found', { extensions: { code: 'NOT_FOUND' } });
  assertAccountReadable(account as AuditAccountRow, includeLive);
  return account as AuditAccountRow;
}

@TypeGraphQL.Resolver()
export class AccountEquityCurveResolver {
  @TypeGraphQL.Query((_returns) => AccountEquityCurve, {
    description:
      'A session’s 1-minute equity curve for one account, read server-side. Requires the audit-read role. LIVE accounts need includeLive.',
  })
  async accountEquityCurve(
    @TypeGraphQL.Ctx() ctx: GraphQLContext,
    @TypeGraphQL.Arg('accountId', (_t) => String) accountId: string,
    @TypeGraphQL.Arg('sessionDate', (_t) => String, { nullable: true }) sessionDate?: string,
    @TypeGraphQL.Arg('includeLive', (_t) => Boolean, { defaultValue: false }) includeLive?: boolean
  ): Promise<AccountEquityCurve> {
    const operator = assertAuditRead(ctx.principal);
    const date = parseSessionDate(sessionDate);
    const account = await loadAccount(getPrismaFromContext(ctx) as PrismaClient, accountId, includeLive === true);
    logger.info('[audit-read] accountEquityCurve', { operator, accountId, accountType: account.type, sessionDate: date });
    return readEquityCurve({ account, sessionDate: date, nowMs: Date.now(), fetchImpl: alpacaFetch.current });
  }

  @TypeGraphQL.Query((_returns) => [MarketTapeBar], {
    description:
      '1-minute bars for the symbols over [startMs, endMs], read server-side with the account’s market-data entitlement. Requires the audit-read role.',
  })
  async marketTape(
    @TypeGraphQL.Ctx() ctx: GraphQLContext,
    @TypeGraphQL.Arg('accountId', (_t) => String) accountId: string,
    @TypeGraphQL.Arg('symbols', (_t) => [String]) symbols: string[],
    @TypeGraphQL.Arg('startMs', (_t) => TypeGraphQL.Float) startMs: number,
    @TypeGraphQL.Arg('endMs', (_t) => TypeGraphQL.Float) endMs: number,
    @TypeGraphQL.Arg('feed', (_t) => String, { defaultValue: 'auto' }) feed?: string,
    @TypeGraphQL.Arg('includeLive', (_t) => Boolean, { defaultValue: false }) includeLive?: boolean
  ): Promise<MarketTapeBar[]> {
    const operator = assertAuditRead(ctx.principal);
    const args = validateTapeArgs({ symbols, startMs, endMs, feed: feed ?? 'auto' });
    const account = await loadAccount(getPrismaFromContext(ctx) as PrismaClient, accountId, includeLive === true);
    logger.info('[audit-read] marketTape', { operator, accountId, symbols: args.symbols.length, feed: args.feed });
    return readMarketTape({
      account,
      symbols: args.symbols,
      startMs,
      endMs,
      feed: args.feed,
      nowMs: Date.now(),
      fetchImpl: alpacaFetch.current,
    });
  }
}
