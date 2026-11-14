import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import adaptic from '../index';
import type { AuditLog as AuditLogType } from '../generated/typegraphql-prisma/models/AuditLog';
import type { Strategy as StrategyType } from '../generated/typegraphql-prisma/models/Strategy';
import { DeskType } from '../generated/typegraphql-prisma/enums/DeskType';
import { MandateAction } from '../generated/typegraphql-prisma/enums/MandateAction';
import { MandateMetric } from '../generated/typegraphql-prisma/enums/MandateMetric';
import { MandateRuleGroup } from '../generated/typegraphql-prisma/enums/MandateRuleGroup';
import type { ApolloClientType, NormalizedCacheObject } from '../client';
import { classifyMutationField, evaluateMutationAccess } from '../auth/mutation-authorization';
import type { BackendPrincipal } from '../auth/token-verifier';

/**
 * The desk attribution and ledger fields on the published surface: the desk
 * taxonomy on Strategy (G-DESK-01, G-ORD-01), the MandateRule machine keys
 * (G-RISK-01) and the AuditLog ledger sequence (G-LED-01). Surface and
 * migration assertions only, no database; the constraints themselves are
 * exercised against Postgres by `desk-attribution-roundtrip.test.ts`.
 */

const SRC_DIR = join(__dirname, '..');
const MIGRATION = join(
  SRC_DIR,
  '..',
  'prisma',
  'migrations',
  '20261114110000_desk_attribution_ledger',
  'migration.sql'
);

/** Field names in the committed CRUD file's selection set. */
function selectionFields(model: string): string[] {
  const source = readFileSync(join(SRC_DIR, `${model}.ts`), 'utf8');
  const match = /const selectionSet = `([^`]*)`/.exec(source);
  if (!match) throw new Error(`no selectionSet in src/${model}.ts`);
  return match[1]
    .split('\n')
    .map((line) => line.trim().replace(/\s*\{$/, ''))
    .filter((line) => line.length > 0 && line !== '}');
}

/** The variables one generated mutation sends, captured by a stub client. */
async function capturedVariables(
  call: (client: ApolloClientType<NormalizedCacheObject>) => Promise<unknown>,
  resultKey: string
): Promise<Record<string, unknown>> {
  const seen: Record<string, unknown>[] = [];
  const stub = {
    mutate: (options: { variables: Record<string, unknown> }): Promise<unknown> => {
      seen.push(options.variables);
      return Promise.resolve({ data: { [resultKey]: { id: 'row' } } });
    },
  } as unknown as ApolloClientType<NormalizedCacheObject>;
  await call(stub);
  expect(seen).toHaveLength(1);
  return seen[0];
}

describe('selection sets carry the desk attribution and ledger fields', () => {
  it.each([
    ['Strategy', ['desk']],
    ['MandateRule', ['ruleCode', 'metricKey', 'action', 'group']],
    ['AuditLog', ['fundId', 'ledgerSeq']],
  ] as const)('%s selects %j', (model, fields) => {
    expect(selectionFields(model)).toEqual(expect.arrayContaining([...fields]));
  });
});

describe('the enums carry exactly the contract values', () => {
  it('DeskType names the three desks', () => {
    expect(Object.values(DeskType)).toEqual(['EVENT', 'THEMATIC', 'SYSTEMATIC']);
  });

  it('MandateMetric lists only the quantities the engine measures', () => {
    expect(Object.values(MandateMetric)).toEqual([
      'GROSS_LEVERAGE',
      'NET_EXPOSURE_RATIO',
      'SINGLE_NAME_CONCENTRATION',
      'MAX_SECTOR_CONCENTRATION',
      'DAILY_LOSS',
      'DRAWDOWN',
      'VAR_95',
      'VAR_99',
      'EXPECTED_SHORTFALL_95',
      'MARGIN_UTILIZATION',
      'OPEN_POSITIONS',
    ]);
  });

  it('MandateAction and MandateRuleGroup', () => {
    expect(Object.values(MandateAction)).toEqual(['BLOCK', 'ESCALATE', 'HALT', 'DERISK']);
    expect(Object.values(MandateRuleGroup)).toEqual(['EXPOSURE', 'LOSS', 'LIQUIDITY']);
  });
});

describe('generated writes', () => {
  it('adaptic.strategy.create sends the desk', async () => {
    const variables = await capturedVariables(
      (client) =>
        adaptic.strategy.create(
          { key: 'k', displayName: 'K', desk: DeskType.EVENT } as unknown as StrategyType,
          client
        ),
      'createOneStrategy'
    );
    expect((variables.data as Record<string, unknown>).desk).toBe('EVENT');
  });

  it('adaptic.auditLog.create sends the fund and never a ledger position', async () => {
    const fundId = '33333333-3333-4333-8333-333333333333';
    const variables = await capturedVariables(
      (client) =>
        adaptic.auditLog.create(
          {
            operationType: 'UPDATE',
            modelName: 'Order',
            recordId: 'o-1',
            changedFields: {},
            fundId,
            ledgerSeq: BigInt(7),
          } as unknown as AuditLogType,
          client
        ),
      'createOneAuditLog'
    );
    const data = variables.data as Record<string, unknown>;
    expect(data.fundId).toBe(fundId);
    expect(data).not.toHaveProperty('ledgerSeq');
  });
});

describe('the migration is additive and leaves existing rows unnumbered', () => {
  const sql = readFileSync(MIGRATION, 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

  it('drops nothing, retypes nothing and adds no NOT NULL column', () => {
    expect(sql).not.toMatch(/\bDROP\b/i);
    expect(sql).not.toMatch(/ALTER\s+COLUMN\s+"?\w+"?\s+(SET\s+DATA\s+)?TYPE/i);
    expect(sql).not.toMatch(/ADD\s+COLUMN[^,;]*NOT\s+NULL/i);
  });

  it('adds ledgerSeq with no default, then sets the sequence default', () => {
    const add = /ADD COLUMN\s+"ledgerSeq"\s+BIGINT\s*;/.exec(sql);
    const setDefault = sql.indexOf(
      `ALTER COLUMN "ledgerSeq" SET DEFAULT nextval('audit_logs_ledger_seq'::regclass)`
    );
    expect(add).not.toBeNull();
    expect(setDefault).toBeGreaterThan(add?.index ?? Number.POSITIVE_INFINITY);
  });
});

describe('who may write the new fields', () => {
  const MODELS = new Set(['Strategy', 'MandateRule', 'AuditLog']);
  const USER: BackendPrincipal = { kind: 'user', sub: '11111111-1111-4111-8111-111111111111', roles: [] };
  const ADMIN: BackendPrincipal = { kind: 'admin', sub: '11111111-1111-4111-8111-111111111111', roles: ['admin'] };
  const SERVER: BackendPrincipal = { kind: 'server' };

  it.each(['createOneStrategy', 'updateOneStrategy', 'createOneMandateRule', 'updateOneMandateRule'])(
    '%s: an operator or the engine, never a signed-in user',
    (field) => {
      const target = classifyMutationField(field, MODELS);
      expect(evaluateMutationAccess(USER, target).reason).toBe('model_not_user_writable');
      expect(evaluateMutationAccess(ADMIN, target).allowed).toBe(true);
      expect(evaluateMutationAccess(SERVER, target).allowed).toBe(true);
    }
  );
});
