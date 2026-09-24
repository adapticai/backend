/**
 * Out-of-process harness for `credential-field-guard.test.ts`.
 *
 * The generated TypeGraphQL resolvers rely on `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, so a schema built from them cannot
 * be constructed inside the vitest worker. This harness runs under ts-node
 * (which honours the repo tsconfig), builds a schema from the GENERATED
 * AlpacaAccount and User resolvers with the guard installed exactly as
 * `server.ts` installs it, executes every scenario, and prints one JSON
 * document the test asserts on.
 *
 * Run directly: npx ts-node --transpile-only src/middleware/__tests__/credential-field-guard.harness.ts
 */
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { graphql } from 'graphql';

import { AlpacaAccountCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/AlpacaAccount/AlpacaAccountCrudResolver';
import { UserCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/User/UserCrudResolver';
import { BrokerageAccountCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/BrokerageAccount/BrokerageAccountCrudResolver';
import { BrokerageAccountCredentialStatusResolver } from '../../resolvers/custom/BrokerageAccountCredentialStatusResolver';
import type { BackendPrincipal } from '../../auth/token-verifier';
import {
  createCredentialFieldGuardMiddleware,
  credentialFieldAccessTotal,
  type CredentialFieldGuardMode,
} from '../credential-field-guard';

export const API_KEY = 'PKGUARDTESTKEYVALUE0000000';
export const API_SECRET = 'guard-test-secret-value-that-must-never-leak';

const ROW = { id: 'acct-1', type: 'LIVE', APIKey: API_KEY, APISecret: API_SECRET };

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  server: { kind: 'server' },
  user: { kind: 'user', sub: 'u-1', roles: ['user'] },
  admin: { kind: 'admin', sub: 'a-1', roles: ['admin'] },
};

export interface Scenario {
  name: string;
  query: string;
  principal: keyof typeof PRINCIPALS;
  mode: CredentialFieldGuardMode;
}

export interface ScenarioResult {
  codes: string[];
  json: string;
  resolverCalls: number;
  counterDelta: Record<string, number>;
}

const READ_KEYS = '{ alpacaAccounts { id APIKey APISecret } }';

export const SCENARIOS: Scenario[] = [
  { name: 'output/server', query: READ_KEYS, principal: 'server', mode: 'enforce' },
  { name: 'output/none', query: READ_KEYS, principal: 'none', mode: 'enforce' },
  { name: 'output/user', query: READ_KEYS, principal: 'user', mode: 'enforce' },
  { name: 'output/admin', query: READ_KEYS, principal: 'admin', mode: 'enforce' },
  {
    name: 'output/non-credential-none',
    query: '{ alpacaAccounts { id type } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'output/single-row-none',
    query: '{ alpacaAccount(where: { id: "acct-1" }) { id APISecret } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'aggregate-max/server',
    query: '{ aggregateAlpacaAccount { _max { APISecret } } }',
    principal: 'server',
    mode: 'enforce',
  },
  {
    name: 'aggregate-max/none',
    query: '{ aggregateAlpacaAccount { _max { APISecret } } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'aggregate-count/none',
    query: '{ aggregateAlpacaAccount { _count { APISecret } } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/where-none',
    query: '{ alpacaAccounts(where: { APISecret: { startsWith: "g" } }) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/where-server',
    query: '{ alpacaAccounts(where: { APISecret: { startsWith: "g" } }) { id } }',
    principal: 'server',
    mode: 'enforce',
  },
  {
    name: 'arg/not-nested-none',
    query: '{ alpacaAccounts(where: { NOT: [{ APIKey: { equals: "x" } }] }) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/orderBy-none',
    query: '{ alpacaAccounts(orderBy: [{ APISecret: asc }]) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/distinct-none',
    query: '{ alpacaAccounts(distinct: [APIKey]) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/relation-filter-none',
    query:
      '{ users(where: { alpacaAccounts: { some: { APISecret: { startsWith: "g" } } } }) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/groupBy-none',
    query: '{ groupByAlpacaAccount(by: [APIKey]) { APIKey } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'arg/non-credential-filter-none',
    query: '{ alpacaAccounts(where: { id: { equals: "acct-1" } }) { id } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'brokerage/status-none',
    query: '{ brokerageAccounts { id hasApiCredentials } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'brokerage/key-none',
    query: '{ brokerageAccounts { id apiKey } }',
    principal: 'none',
    mode: 'enforce',
  },
  {
    name: 'brokerage/key-server',
    query: '{ brokerageAccounts { id apiKey } }',
    principal: 'server',
    mode: 'enforce',
  },
  { name: 'mode/shadow-none', query: READ_KEYS, principal: 'none', mode: 'shadow' },
  { name: 'mode/off-none', query: READ_KEYS, principal: 'none', mode: 'off' },
];

async function counterSnapshot(): Promise<Record<string, number>> {
  const metric = await credentialFieldAccessTotal.get();
  const out: Record<string, number> = {};
  for (const v of metric.values) {
    const key = `${v.labels.surface}|${v.labels.decision}|${v.labels.principal_kind}`;
    out[key] = (out[key] ?? 0) + v.value;
  }
  return out;
}

async function main(): Promise<void> {
  let mode: CredentialFieldGuardMode = 'enforce';
  let resolverCalls = 0;
  const count = <T>(value: T): Promise<T> => {
    resolverCalls += 1;
    return Promise.resolve(value);
  };
  const prisma = {
    alpacaAccount: {
      findMany: () => count([ROW]),
      findUnique: () => count(ROW),
      groupBy: () => count([{ id: ROW.id, APIKey: API_KEY, _max: { APISecret: API_SECRET } }]),
      aggregate: () => count({ _max: { APISecret: API_SECRET }, _count: { APISecret: 1 } }),
    },
    user: { findMany: () => count([{ id: 'u-1' }]) },
    brokerageAccount: {
      findMany: () =>
        count([
          { id: 'ba-1', apiKey: API_KEY, apiSecret: API_SECRET },
          { id: 'ba-2', apiKey: null, apiSecret: null },
          { id: 'ba-3', apiKey: API_KEY, apiSecret: '   ' },
        ]),
    },
  };

  const schema = await buildSchema({
    resolvers: [
      AlpacaAccountCrudResolver,
      UserCrudResolver,
      BrokerageAccountCrudResolver,
      BrokerageAccountCredentialStatusResolver,
    ],
    validate: false,
    globalMiddlewares: [createCredentialFieldGuardMiddleware({ modeProvider: () => mode })],
  });

  const results: Record<string, ScenarioResult> = {};
  for (const scenario of SCENARIOS) {
    mode = scenario.mode;
    resolverCalls = 0;
    const before = await counterSnapshot();
    const result = await graphql({
      schema,
      source: scenario.query,
      contextValue: {
        prisma,
        principal: PRINCIPALS[scenario.principal],
        req: { ip: '203.0.113.9', headers: { 'user-agent': 'guard-harness' } },
      },
    });
    const after = await counterSnapshot();
    const counterDelta: Record<string, number> = {};
    for (const [key, value] of Object.entries(after)) {
      const delta = value - (before[key] ?? 0);
      if (delta !== 0) counterDelta[key] = delta;
    }
    results[scenario.name] = {
      codes: (result.errors ?? []).map((e) => String(e.extensions?.code)),
      json: JSON.stringify(result),
      resolverCalls,
      counterDelta,
    };
  }
  process.stdout.write(`<<<RESULTS>>>${JSON.stringify(results)}<<<END>>>\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${String(error)}\n`);
  process.exit(1);
});
