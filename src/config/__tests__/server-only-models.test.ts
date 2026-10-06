import 'reflect-metadata';
import { beforeAll, describe, it, expect } from 'vitest';
import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import {
  SERVER_ONLY_MODELS,
  isServerOnlyModel,
  isServerOnlyTypeName,
  withoutServerOnlyResolvers,
  withoutServerOnlySchemaSurface,
} from '../server-only-models';
import { runTsNodeHarness } from '../../middleware/__tests__/ts-node-harness';

/**
 * The trade restatement ledger is server-only: no GraphQL query, mutation,
 * type, input or count may reach it. These tests pin the two halves of that
 * exclusion (resolver filtering before `buildSchema`, residual stripping after
 * it); the served-schema harness proves the combination on the real surface.
 */

describe('server-only model registry', () => {
  it('lists the trade restatement ledger', () => {
    expect(SERVER_ONLY_MODELS).toContain('TradeRestatement');
    expect(isServerOnlyModel('TradeRestatement')).toBe(true);
    expect(isServerOnlyModel('Trade')).toBe(false);
  });

  it('matches the model and its generated companions, not neighbours', () => {
    expect(isServerOnlyTypeName('TradeRestatement')).toBe(true);
    expect(isServerOnlyTypeName('TradeRestatementWhereInput')).toBe(true);
    expect(isServerOnlyTypeName('TradeRestatementListRelationFilter')).toBe(
      true
    );
    expect(isServerOnlyTypeName('Trade')).toBe(false);
    expect(isServerOnlyTypeName('TradeCount')).toBe(false);
    expect(isServerOnlyTypeName('TradeRestatementsx')).toBe(false);
  });
});

describe('withoutServerOnlyResolvers', () => {
  it('drops only the server-only CRUD and relation resolver classes', () => {
    class TradeCrudResolver {}
    class TradeRelationsResolver {}
    class TradeRestatementCrudResolver {}
    class TradeRestatementRelationsResolver {}
    class TradingSettingsResolver {}
    const kept = withoutServerOnlyResolvers([
      TradeCrudResolver,
      TradeRelationsResolver,
      TradeRestatementCrudResolver,
      TradeRestatementRelationsResolver,
      TradingSettingsResolver,
    ]);
    expect(kept.map((r) => r.name)).toEqual([
      'TradeCrudResolver',
      'TradeRelationsResolver',
      'TradingSettingsResolver',
    ]);
  });
});

describe('withoutServerOnlySchemaSurface', () => {
  it('strips the relation count and the inputs only it referenced', () => {
    const restatementWhere = new GraphQLInputObjectType({
      name: 'TradeRestatementWhereInput',
      fields: { restatementRef: { type: GraphQLString } },
    });
    const tradeCount = new GraphQLObjectType({
      name: 'TradeCount',
      fields: {
        actions: { type: GraphQLInt },
        restatements: {
          type: GraphQLInt,
          args: { where: { type: restatementWhere } },
        },
      },
    });
    const query = new GraphQLObjectType({
      name: 'Query',
      fields: { tradeCount: { type: tradeCount } },
    });
    const stripped = withoutServerOnlySchemaSurface(
      new GraphQLSchema({ query })
    );

    const count = stripped.getType('TradeCount') as GraphQLObjectType;
    expect(Object.keys(count.getFields())).toEqual(['actions']);
    expect(stripped.getType('TradeRestatementWhereInput')).toBeUndefined();
  });
});

/** Building the full served schema takes about a minute of CPU on a loaded machine. */
const HARNESS_TIMEOUT_MS = 300_000;

interface SurfaceReport {
  serverOnlyTypes: string[];
  sdlMentions: number;
  hasTrade: boolean;
  tradeCountFields: string[];
}

describe('the served GraphQL schema exposes nothing of the ledger', () => {
  let report: SurfaceReport;

  beforeAll(async () => {
    report = await runTsNodeHarness<SurfaceReport>(
      'src/config/__tests__/server-only-surface.harness.ts',
      HARNESS_TIMEOUT_MS
    );
  }, HARNESS_TIMEOUT_MS + 30_000);

  it('has no TradeRestatement type, field, argument or input', () => {
    expect(report.serverOnlyTypes).toEqual([]);
    expect(report.sdlMentions).toBe(0);
  });

  it('leaves the parent model and its other relation counts in place', () => {
    expect(report.hasTrade).toBe(true);
    expect(report.tradeCountFields).toEqual(['actions']);
  });
});
