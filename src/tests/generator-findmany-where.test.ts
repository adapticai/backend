/**
 * The props-only `where` a generated `findMany<Model>(props)` builds
 * (src/modules/find-many-where.ts, wired in src/modules/generator.ts).
 *
 * The emitted code is evaluated, not string-matched: the where body is
 * compiled into a function over `props` and the guard is transpiled from the
 * TypeScript the generator writes, so the assertions read the object the
 * client would actually send and the error a caller would actually see.
 * Field definitions come from the real generated `<Model>WhereInput` files.
 */
import fs from 'fs';
import path from 'path';
import ts from 'typescript';
import { describe, expect, it, vi } from 'vitest';
import { Trade } from '../Trade';
import type { ApolloClientType, NormalizedCacheObject } from '../client';
import type { Trade as TradeType } from '../generated/typegraphql-prisma/models/Trade';
import { constructVariablesObject } from '../modules/generator';
import {
  buildFindManyPropsGuard,
  buildFindManyWhereBody,
  findManyPropsFilterFields,
  isEqualsFilterField,
} from '../modules/find-many-where';
import { getInputTypeDefinition } from '../modules/parser';
import { FieldDefinition } from '../modules/types';

const inputsPath = path.join(
  __dirname,
  '../generated/typegraphql-prisma/resolvers/inputs'
);
const modelsPath = path.join(__dirname, '../generated/typegraphql-prisma/models');

type Where = Record<string, unknown>;

/** Drop undefined entries, as the generated `removeUndefinedProps` does for a flat where. */
function defined(where: Where): Where {
  return Object.fromEntries(Object.entries(where).filter(([, v]) => v !== undefined));
}

/** Compile an emitted object-literal body into the where object for given props. */
function evaluateBody(body: string, props: Where): Where {
  const build = new Function('props', `return {\n${body}};`) as (p: Where) => Where;
  return defined(build(props));
}

/** Transpile and run the emitted guard; returns the thrown message, or null. */
function runGuard(guard: string, props: Where, whereInput?: Where): string | null {
  const js = ts.transpileModule(guard, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const check = new Function('props', 'whereInput', js) as (p: Where, w?: Where) => void;
  try {
    check(props, whereInput);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/** The where the previous generator emitted for findMany (the unique-field builder over WhereInput). */
function legacyWhere(modelName: string, props: Where): Where {
  const body = constructVariablesObject(
    'props',
    path.join(inputsPath, `${modelName}WhereInput.ts`),
    modelName,
    inputsPath,
    modelsPath,
    'where'
  );
  return evaluateBody(body, props);
}

const tradeWhere: FieldDefinition[] = getInputTypeDefinition(
  path.join(inputsPath, 'TradeWhereInput.ts')
);

/**
 * Call the committed, generated `Trade.findMany` (the code consumers run)
 * with a client that records the variables it is asked to send.
 */
async function sentWhere(props: Where, whereInput?: Where): Promise<Where> {
  const query = vi.fn(async (_options: { variables: { where: Where } }) => ({ data: { trades: [] } }));
  const client = { query } as unknown as ApolloClientType<NormalizedCacheObject>;
  await Trade.findMany(props as unknown as TradeType, client, whereInput);
  expect(query).toHaveBeenCalledTimes(1);
  return query.mock.calls[0][0].variables.where;
}

describe('generated Trade.findMany (the shipped CRUD surface)', () => {
  it('sends a non-unique filter alongside a unique one instead of dropping it', async () => {
    await expect(sentWhere({ alpacaAccountId: 'a', side: 'BUY' })).resolves.toEqual({
      alpacaAccountId: { equals: 'a' },
      side: { equals: 'BUY' },
    });
  });

  it('sends a where built from non-unique filters alone instead of throwing "requires at least one filter"', async () => {
    await expect(sentWhere({ side: 'SELL' })).resolves.toEqual({ side: { equals: 'SELL' } });
  });

  it('refuses a relation passed as props before any query is sent', async () => {
    const query = vi.fn();
    const client = { query } as unknown as ApolloClientType<NormalizedCacheObject>;
    await expect(
      Trade.findMany({ actions: { some: {} } } as unknown as TradeType, client)
    ).rejects.toThrow('findManyTrade: filter field(s) actions are not expressible via props; pass whereInput');
    expect(query).not.toHaveBeenCalled();
  });

  it('sends an explicit whereInput verbatim', async () => {
    const whereInput = { side: { in: ['BUY', 'SELL'] }, actions: { some: { status: { equals: 'FILLED' } } } };
    await expect(sentWhere({} as Where, whereInput)).resolves.toEqual(whereInput);
  });
});

describe('findMany props-only where (Trade)', () => {
  const body = buildFindManyWhereBody(tradeWhere, 'props');

  it('keeps a non-unique scalar filter alongside a unique one instead of dropping it', () => {
    expect(evaluateBody(body, { alpacaAccountId: 'a', side: 'BUY' })).toEqual({
      alpacaAccountId: { equals: 'a' },
      side: { equals: 'BUY' },
    });
  });

  it('builds a non-empty where from non-unique filters alone', () => {
    expect(evaluateBody(body, { side: 'BUY', entryPrice: 10 })).toEqual({
      side: { equals: 'BUY' },
      entryPrice: { equals: 10 },
    });
  });

  it('filters on a nullable Uuid column the unique-name heuristic emitted nothing for', () => {
    expect(evaluateBody(body, { strategyId: 's-1' })).toEqual({ strategyId: { equals: 's-1' } });
  });

  it('passes an explicit null through as an equals-null filter', () => {
    expect(evaluateBody(body, { exitTime: null })).toEqual({ exitTime: { equals: null } });
  });

  it('never emits combinators, relations or JSON columns', () => {
    const fields = findManyPropsFilterFields(tradeWhere);
    for (const name of ['AND', 'OR', 'NOT', 'actions', 'strategyRef', 'rejectionMetadata']) {
      expect(fields).not.toContain(name);
    }
  });
});

describe('findMany props guard (Trade)', () => {
  const guard = buildFindManyPropsGuard('Trade', tradeWhere);

  it('refuses a relation filter passed as props, naming the field', () => {
    expect(runGuard(guard, { alpacaAccountId: 'a', actions: { some: {} } })).toBe(
      'findManyTrade: filter field(s) actions are not expressible via props; pass whereInput'
    );
  });

  it('refuses a JSON column and an unknown key together', () => {
    expect(runGuard(guard, { rejectionMetadata: {}, notAColumn: 1 })).toBe(
      'findManyTrade: filter field(s) rejectionMetadata, notAColumn are not expressible via props; pass whereInput'
    );
  });

  it('ignores keys whose value is undefined, as the where builder does', () => {
    expect(runGuard(guard, { alpacaAccountId: 'a', actions: undefined })).toBeNull();
  });

  it('does not run when an explicit whereInput is supplied', () => {
    expect(runGuard(guard, { actions: { some: {} } }, { id: { equals: 'x' } })).toBeNull();
  });
});

describe('findMany props-only where: no-op on inputs the previous builder already handled', () => {
  const whereInputFiles = fs
    .readdirSync(inputsPath)
    .filter((f) => /^[A-Z][A-Za-z0-9]*WhereInput\.ts$/.test(f))
    .filter((f) => !/(?:Scalar|Unique)WhereInput\.ts$/.test(f) && !f.includes('WithAggregates'));

  it('covers every model WhereInput', () => {
    expect(whereInputFiles.length).toBeGreaterThan(50);
  });

  it('produces an identical where for every field the previous builder emitted, in every model', () => {
    for (const file of whereInputFiles) {
      const modelName = file.replace(/WhereInput\.ts$/, '');
      const fields = getInputTypeDefinition(path.join(inputsPath, file));
      const body = buildFindManyWhereBody(fields, 'props');
      // Give every column a distinct value, then keep only the columns the
      // previous builder put in its where — the correct-input partition.
      const allProps: Where = Object.fromEntries(fields.map((f) => [f.name, `v-${f.name}`]));
      const legacy = legacyWhere(modelName, allProps);
      const legacyProps: Where = Object.fromEntries(Object.keys(legacy).map((k) => [k, allProps[k]]));
      expect({ model: modelName, where: evaluateBody(body, legacyProps) }).toEqual({
        model: modelName,
        where: legacyWhere(modelName, legacyProps),
      });
    }
  });
});

describe('isEqualsFilterField', () => {
  const field = (name: string, typeName: string): FieldDefinition => ({
    name,
    type: { name: typeName, isScalar: false, isList: false, isNullable: true },
  });

  it('accepts scalar, enum and scalar-list filters', () => {
    for (const t of [
      'StringFilter',
      'UuidNullableFilter',
      'FloatNullableFilter',
      'IntFilter',
      'BigIntNullableFilter',
      'DecimalFilter',
      'BoolFilter',
      'DateTimeNullableFilter',
      'EnumTradeSideNullableFilter',
      'StringNullableListFilter',
    ]) {
      expect(isEqualsFilterField(field('c', t))).toBe(true);
    }
  });

  it('rejects relations, JSON and combinators', () => {
    expect(isEqualsFilterField(field('actions', 'ActionListRelationFilter'))).toBe(false);
    expect(isEqualsFilterField(field('strategyRef', 'StrategyNullableRelationFilter'))).toBe(false);
    expect(isEqualsFilterField(field('meta', 'JsonNullableFilter'))).toBe(false);
    expect(isEqualsFilterField(field('AND', 'StringFilter'))).toBe(false);
  });
});
