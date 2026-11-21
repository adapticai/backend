import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';
import adaptic from '../index';
import type { TradingPolicy as TradingPolicyType } from '../generated/typegraphql-prisma/models/TradingPolicy';
import type { ApolloClientType, NormalizedCacheObject } from '../client';

/**
 * The multi-lane intraday carrier on TradingPolicy: `intradayLanePrefs`, the
 * one home of the lane opt-in and the per-lane caps (architecture §0: one
 * carrier, no separate opt-in or cap column). Surface and migration
 * assertions only, no database; the column itself is exercised against
 * Postgres by `trading-policy-lane-fields-roundtrip.test.ts`.
 *
 * The carrier must leave an existing account disarmed: it is nullable with no
 * default, so a NULL reaches the engine as "unset" rather than as an invented
 * object.
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
const LANE_FIELDS = ['intradayLanePrefs'] as const;

/** The columns architecture §0 dropped; nothing generated may carry them. */
const DROPPED_FIELDS = ['laneTradingEnabled', 'laneMaxEntriesPerSymbolPerDay'] as const;

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

describe('no generated selection set carries the lane carrier', () => {
  // A server whose schema predates the column rejects every operation that
  // selects it. The TradingPolicy and AlpacaAccount selection sets carry the
  // engine's order-chokepoint and broker-credential reads, so the field stays
  // out of every generated read (GQL.SKIP) and is read by readIntradayLanePrefs.
  const crudFiles = readdirSync(SRC_DIR).filter(
    (file) => /^[A-Z]\w*\.ts$/.test(file) && readFileSync(join(SRC_DIR, file), 'utf8').includes('const selectionSet = `')
  );

  it('finds the CRUD files it scans', () => {
    expect(crudFiles).toEqual(expect.arrayContaining(['TradingPolicy.ts', 'AlpacaAccount.ts']));
  });

  it('adaptic.tradingPolicy selects neither the carrier nor a dropped column', () => {
    const fields = fieldsOf(selectionSetOf('TradingPolicy'));
    expect(fields).toContain('realtimeTradingEnabled');
    for (const field of [...LANE_FIELDS, ...DROPPED_FIELDS]) expect(fields).not.toContain(field);
  });

  it('adaptic.alpacaAccount does not select it on its nested tradingPolicy', () => {
    const fields = fieldsOf(nestedTradingPolicy(selectionSetOf('AlpacaAccount')));
    expect(fields).toContain('realtimeTradingEnabled');
    for (const field of [...LANE_FIELDS, ...DROPPED_FIELDS]) expect(fields).not.toContain(field);
  });

  it('no CRUD file selects it anywhere', () => {
    const selecting = crudFiles.filter((file) =>
      fieldsOf(selectionSetOf(file.replace(/\.ts$/, ''))).some((field) =>
        ([...LANE_FIELDS, ...DROPPED_FIELDS] as readonly string[]).includes(field)
      )
    );
    expect(selecting).toEqual([]);
  });
});

describe('the generated model', () => {
  const model = Prisma.dmmf.datamodel.models.find((m) => m.name === 'TradingPolicy');
  const field = (name: string): Prisma.DMMF.Field => {
    const found = model?.fields.find((f) => f.name === name);
    if (!found) throw new Error(`TradingPolicy.${name} is not in the generated client`);
    return found;
  };

  it('carries neither dropped column', () => {
    for (const dropped of DROPPED_FIELDS) expect(model?.fields.some((f) => f.name === dropped)).toBe(false);
  });

  it('intradayLanePrefs is nullable Json with no default', () => {
    expect(field('intradayLanePrefs')).toMatchObject({ type: 'Json', isRequired: false });
    expect(field('intradayLanePrefs').hasDefaultValue).toBe(false);
  });

  it('the published GraphQL type declares the carrier nullable', () => {
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
    expect(declared('intradayLanePrefs')).toBe('true Prisma.JsonValue | null');
  });
});

describe('generated writes', () => {
  const lanes = { intradayLanePrefs: { armed: true, perLaneTradesPerDay: 3 } };

  it('adaptic.tradingPolicy.create sends the carrier', async () => {
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

  it('adaptic.tradingPolicy.update sends the carrier as its value', async () => {
    const variables = await capturedVariables(
      (client) =>
        adaptic.tradingPolicy.update(
          { id: '33333333-3333-4333-8333-333333333333', ...lanes } as unknown as TradingPolicyType,
          client
        ),
      'updateOneTradingPolicy'
    );
    const data = variables.data as Record<string, unknown>;
    expect(data.intradayLanePrefs).toEqual({ armed: true, perLaneTradesPerDay: 3 });
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

  it('adds only the carrier, nullable with no default', () => {
    expect(sql.match(/ADD COLUMN/g)).toHaveLength(1);
    expect(sql).toMatch(/ADD COLUMN\s+"intradayLanePrefs"\s+JSONB\s*;/);
  });

  it('touches only trading_policies', () => {
    expect(sql.match(/ALTER TABLE\s+"(\w+)"/g)).toEqual(['ALTER TABLE "trading_policies"']);
  });
});
