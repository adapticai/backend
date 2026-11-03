/**
 * `accountEquityCurve` — server-side audit read.
 *
 * Returns an account's 1-minute equity curve without the caller ever holding
 * the account's broker key. Requires an audit-read token in the
 * `x-adaptic-audit-token` header (see `assertAuditRead`) and refuses LIVE
 * accounts.
 * Read-only on the broker; every read spends a per-account request budget and
 * writes an `AuditLog` row naming the operator, account and operation. Once the
 * token verifies, a refusal (unknown account, LIVE account, incomplete broker
 * snapshot) also writes a row, with its reason; an unverified caller writes none.
 *
 * @module resolvers/custom/AccountEquityCurveResolver
 */
import * as TypeGraphQL from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';

import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import { logger } from '../../utils/logger';
import {
  AuditReadRefused,
  assertAccountIdShape,
  assertAccountReadable,
  assertAuditRead,
  auditTokenFromHeaders,
  createAccountBudgets,
  parseSessionDate,
  readEquityCurve,
  type AlpacaFetch,
  type AuditAccountRow,
  type AuditReadRefusalReason,
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

const accountBudget = createAccountBudgets();

/** Width of `AuditLog.recordId`; only a malformed (refused) account id can exceed it. */
const RECORD_ID_MAX = 255;

interface AuditReadRow {
  operator: string;
  accountId: string;
  op: string;
  detail?: Record<string, unknown>;
}

function auditRowData(p: AuditReadRow, outcome: { outcome: 'read' } | { outcome: 'refused'; reason: AuditReadRefusalReason }) {
  const accountId = p.accountId.slice(0, RECORD_ID_MAX);
  return {
    operationType: 'CREATE' as const,
    modelName: 'AuditRead',
    recordId: accountId,
    operationName: p.op,
    changedFields: {},
    metadata: { operator: p.operator, accountId, op: p.op, ...p.detail, ...outcome },
  };
}

/** `AuditLog.operationType` has no READ member, so a read is recorded as a CREATE of an `AuditRead` record. */
async function recordRead(prisma: PrismaClient, p: AuditReadRow): Promise<void> {
  try {
    await prisma.auditLog.create({ data: auditRowData(p, { outcome: 'read' }) });
  } catch (err) {
    // Fail closed: an unrecorded read is not served.
    logger.error('[audit-read] could not write the AuditLog row; refusing the read', { operator: p.operator, accountId: p.accountId, op: p.op, err });
    throw new GraphQLError('Audit read could not be recorded', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
}

/**
 * Record a refusal of a verified caller's read. The caller still gets the
 * refusal if the row cannot be written: nothing is served either way, and the
 * refusal is the truthful answer.
 */
async function recordRefusal(prisma: PrismaClient, p: AuditReadRow, reason: AuditReadRefusalReason): Promise<void> {
  try {
    await prisma.auditLog.create({ data: auditRowData(p, { outcome: 'refused', reason }) });
  } catch (err) {
    logger.error('[audit-read] could not write the AuditLog row for a refused read', { operator: p.operator, accountId: p.accountId, op: p.op, reason, err });
  }
}

async function loadAccount(prisma: PrismaClient, id: string): Promise<AuditAccountRow> {
  assertAccountIdShape(id);
  const account = await prisma.alpacaAccount.findUnique({
    where: { id },
    select: { id: true, type: true, APIKey: true, APISecret: true, configuration: true },
  });
  if (!account) throw new AuditReadRefused('ACCOUNT_NOT_FOUND', 'Account not found', 'NOT_FOUND');
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
    // Throws before any row: a caller whose token does not verify is unattributed.
    const operator = assertAuditRead(auditTokenFromHeaders(ctx.req?.headers));
    const date = parseSessionDate(sessionDate);
    const prisma = getPrismaFromContext(ctx) as PrismaClient;
    const row: AuditReadRow = { operator, accountId, op: 'accountEquityCurve', detail: { sessionDate: date } };
    try {
      const account = await loadAccount(prisma, accountId);
      await recordRead(prisma, row);
      return await readEquityCurve({
        account,
        sessionDate: date,
        nowMs: Date.now(),
        fetchImpl: alpacaFetch.current,
        budget: accountBudget(accountId),
      });
    } catch (err) {
      // An incomplete snapshot is refused after the read row is written, so
      // that read leaves two rows: the key use, then the refusal.
      if (err instanceof AuditReadRefused) await recordRefusal(prisma, row, err.reason);
      throw err;
    }
  }
}
