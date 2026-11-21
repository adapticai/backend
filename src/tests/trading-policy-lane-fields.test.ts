import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';
import adaptic from '../index';
import type { TradingPolicy as TradingPolicyType } from '../generated/typegraphql-prisma/models/TradingPolicy';
import type { ApolloClientType, NormalizedCacheObject } from '../client';

/**
 * The multi-lane intraday controls on TradingPolicy: the `laneTradingEnabled`
 * opt-in, the `laneMaxEntriesPerSymbolPerDay` cap and the `intradayLanePrefs`
 * carrier. Surface and migration assertions only, no database; the columns
 * themselves are exercised against Postgres by
 * `trading-policy-lane-fields-roundtrip.test.ts`.
 *
 * Every field must leave an existing account disarmed: the opt-in defaults to
 * false, and the cap and the carrier are nullable with no default, so a NULL
 * reaches the engine as "unset" rather than as an invented number or object.
 */

const SRC_DIR = join(__dirname, '..');
const MIGRATION = join(
  SRC_DIR,
  '..',
  'prisma',
  'migrations',
  '20261121130000_trading_policy_lane_fields',
  'migration.sql'
);
const LANE_FIELDS = ['laneTradingEnabled', 'laneMaxEntriesPerSymbolPerDay', 'intradayLanePrefs'] as const;

/** Field names in a selection-set string, one per line, nesting braces dropped. */
function fieldsOf(selection: string): string[] {
  return selection
    .split('\n')
    .map((line) => line.trim().replace(/\s*\{$/, ''))
    .filter((line) => line.length > 0 && line !== '}');
}

/** The selection-set text of one committed CRUD file. */
function selectionSetOf(model: string): string {
  const source = readFileSync(join(SRC_DIR, `${model}.ts`), 'utf8');
  const match = /const selectionSet = `([^`]*)`/.exec(source);
  if (!match) throw new Error(`no selectionSet in src/${model}.ts`);
  return match[1];
}

/** The body of the `tradingPolicy { ... }` block nested in a selection set. */
function nestedTradingPolicy(selection: string): string {
  const start = selection.indexOf('tradingPolicy {');
  if (start < 0) throw new Error('no nested tradingPolicy selection');
  let depth = 0;
  for (let i = selection.indexOf('{', start); i < selection.length; i += 1) {
    if (selection[i] === '{') depth += 1;
    if (selection[i] === '}') depth -= 1;
    if (depth === 0) return selection.slice(selection.indexOf('{', start) + 1, i);
  }
  throw new Error('unterminated tradingPolicy selection');
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

describe('selection sets carry the lane fields', () => {
  it('adaptic.tradingPolicy selects all three', () => {
    expect(fieldsOf(selectionSetOf('TradingPolicy'))).toEqual(expect.arrayContaining([...LANE_FIELDS]));
  });

  it('adaptic.alpacaAccount selects them on its nested tradingPolicy, the engine read path', () => {
    expect(fieldsOf(nestedTradingPolicy(selectionSetOf('AlpacaAccount')))).toEqual(
      expect.arrayContaining([...LANE_FIELDS])
    );
  });
});

describe('the generated model', () => {
  const model = Prisma.dmmf.datamodel.models.find((m) => m.name === 'TradingPolicy');
  const field = (name: string): Prisma.DMMF.Field => {
    const found = model?.fields.find((f) => f.name === name);
    if (!found) throw new Error(`TradingPolicy.${name} is not in the generated client`);
    return found;
  };

  it('laneTradingEnabled is a required Boolean defaulting to false', () => {
    expect(field('laneTradingEnabled')).toMatchObject({ type: 'Boolean', isRequired: true, default: false });
  });

  it('laneMaxEntriesPerSymbolPerDay is a nullable Int with no default', () => {
    expect(field('laneMaxEntriesPerSymbolPerDay')).toMatchObject({ type: 'Int', isRequired: false });
    expect(field('laneMaxEntriesPerSymbolPerDay').hasDefaultValue).toBe(false);
  });

  it('intradayLanePrefs is nullable Json with no default', () => {
    expect(field('intradayLanePrefs')).toMatchObject({ type: 'Json', isRequired: false });
    expect(field('intradayLanePrefs').hasDefaultValue).toBe(false);
  });

  it('the published GraphQL type declares the cap and the carrier nullable and the opt-in not', () => {
    const source = readFileSync(
      join(SRC_DIR, 'generated', 'typegraphql-prisma', 'models', 'TradingPolicy.ts'),
      'utf8'
    );
    const declared = (name: string): string => {
      const property = new RegExp(`\\n  ${name}[!?]: ([^;]+);`).exec(source);
      if (!property) throw new Error(`no declaration for ${name}`);
      const decorator = source.slice(source.lastIndexOf('@TypeGraphQL.Field', property.index), property.index);
      const nullable = /nullable: (true|false)/.exec(decorator);
      if (!nullable) throw new Error(`no nullability on ${name}`);
      return `${nullable[1]} ${property[1]}`;
    };
    expect(declared('laneTradingEnabled')).toBe('false boolean');
    expect(declared('laneMaxEntriesPerSymbolPerDay')).toBe('true number | null');
    expect(declared('intradayLanePrefs')).toBe('true Prisma.JsonValue | null');
  });
});

describe('generated writes', () => {
  const lanes = {
    laneTradingEnabled: true,
    laneMaxEntriesPerSymbolPerDay: 3,
    intradayLanePrefs: { armed: true },
  };

  it('adaptic.tradingPolicy.create sends the lane fields', async () => {
    const variables = await capturedVariables(
      (client) =>
        adaptic.tradingPolicy.create(
          { alpacaAccountId: '22222222-2222-4222-8222-222222222222', ...lanes } as unknown as TradingPolicyType,
          client
        ),
      'createOneTradingPolicy'
    );
    expect(variables.data).toMatchObject(lanes);
  });

  it('adaptic.tradingPolicy.update sends the lane fields as sets', async () => {
    const variables = await capturedVariables(
      (client) =>
        adaptic.tradingPolicy.update(
          { id: '33333333-3333-4333-8333-333333333333', ...lanes } as unknown as TradingPolicyType,
          client
        ),
      'updateOneTradingPolicy'
    );
    const data = variables.data as Record<string, unknown>;
    expect(data.laneTradingEnabled).toEqual({ set: true });
    expect(data.laneMaxEntriesPerSymbolPerDay).toEqual({ set: 3 });
    expect(data.intradayLanePrefs).toEqual({ armed: true });
  });
});

describe('the migration is additive and leaves existing rows disarmed', () => {
  const sql = readFileSync(MIGRATION, 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('--'))
    .join('\n');

  it('drops nothing, retypes nothing and updates no row', () => {
    expect(sql).not.toMatch(/\bDROP\b/i);
    expect(sql).not.toMatch(/\bUPDATE\b/i);
    expect(sql).not.toMatch(/ALTER\s+COLUMN/i);
  });

  it('adds the opt-in NOT NULL DEFAULT false and the other two nullable with no default', () => {
    expect(sql).toMatch(/ADD COLUMN\s+"laneTradingEnabled"\s+BOOLEAN NOT NULL DEFAULT false\s*;/);
    expect(sql).toMatch(/ADD COLUMN\s+"laneMaxEntriesPerSymbolPerDay"\s+INTEGER\s*,/);
    expect(sql).toMatch(/ADD COLUMN\s+"intradayLanePrefs"\s+JSONB\s*,/);
  });

  it('touches only trading_policies', () => {
    expect(sql.match(/ALTER TABLE\s+"(\w+)"/g)).toEqual(['ALTER TABLE "trading_policies"']);
  });
});
