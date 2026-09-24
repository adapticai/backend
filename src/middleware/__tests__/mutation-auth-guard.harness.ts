/**
 * Out-of-process harness for `mutation-auth-guard.test.ts`.
 *
 * The generated TypeGraphQL resolvers need `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, so a schema built from them cannot
 * be constructed inside the vitest worker. This harness runs under ts-node,
 * builds a schema from the GENERATED TradingPolicy, AlpacaAccount and User
 * resolvers with the guard installed exactly as `server.ts` installs it
 * (`installMutationAuthGuard` on the built schema),
 * serves it through a real ApolloServer carrying the production HTTP-status
 * plugin (so a refusal's HTTP status is observed, not assumed), runs every
 * scenario against a recording fake Prisma client, and prints one JSON
 * document the test asserts on.
 *
 * Run directly:
 *   npx ts-node --transpile-only src/middleware/__tests__/mutation-auth-guard.harness.ts
 */
import 'reflect-metadata';
import { ApolloServer } from '@apollo/server';
import { buildSchema } from 'type-graphql';

import { TradingPolicyCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/TradingPolicy/TradingPolicyCrudResolver';
import { AlpacaAccountCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/AlpacaAccount/AlpacaAccountCrudResolver';
import { UserCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/User/UserCrudResolver';
import type { MutationAuthMode } from '../../auth/mutation-authorization';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { createHttpStatusMapperPlugin } from '../../plugins/http-status-mapper';
import {
  installMutationAuthGuard,
  mutationAuthorizationTotal,
  resetMutationAuthLogThrottle,
} from '../mutation-auth-guard';
import { mutationAuditWriteFailuresTotal } from '../trading-policy-audit';

export const API_KEY = 'PKMUTATIONGUARDKEY00000000';
export const API_SECRET = 'mutation-guard-secret-value-that-must-never-leak';

const U_OWNER = '11111111-1111-4111-8111-111111111111';
const U_STRANGER = '22222222-2222-4222-8222-222222222222';
const U_FUND = '33333333-3333-4333-8333-333333333333';
const U_OTHER = '44444444-4444-4444-8444-444444444444';
const FUND_1 = '55555555-5555-4555-8555-555555555555';

const ACCOUNTS: Record<string, { id: string; userId: string; type: string; brokerageAccount: { fundId: string } | null }> = {
  a1: { id: 'a1', userId: U_OWNER, type: 'LIVE', brokerageAccount: null },
  a2: { id: 'a2', userId: U_OTHER, type: 'PAPER', brokerageAccount: { fundId: FUND_1 } },
};

const POLICIES: Record<string, { id: string; alpacaAccountId: string }> = {
  p1: { id: 'p1', alpacaAccountId: 'a1' },
  p2: { id: 'p2', alpacaAccountId: 'a2' },
};

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  server: { kind: 'server', sub: 'adaptic-engine:host-1:42' },
  staticServer: { kind: 'server' },
  admin: { kind: 'admin', sub: '66666666-6666-4666-8666-666666666666', roles: ['admin'] },
  owner: { kind: 'user', sub: U_OWNER, email: 'owner@example.test', roles: [] },
  stranger: { kind: 'user', sub: U_STRANGER, roles: [] },
  fundUser: { kind: 'user', sub: U_FUND, roles: [] },
};

const FLIP_LIVE =
  'mutation Flip { updateOneTradingPolicy(where: { alpacaAccountId: "a1" }, data: { realtimeTradingEnabled: { set: true } }) { id realtimeTradingEnabled } }';
const FLIP_FUND =
  'mutation FlipFund { updateOneTradingPolicy(where: { alpacaAccountId: "a2" }, data: { killSwitchEnabled: { set: true } }) { id } }';
const ALIASED =
  'mutation Batch { a: updateOneTradingPolicy(where: { alpacaAccountId: "a1" }, data: { killSwitchEnabled: { set: true } }) { id } ' +
  'b: updateOneTradingPolicy(where: { alpacaAccountId: "a2" }, data: { killSwitchEnabled: { set: true } }) { id } }';
const NESTED_POLICY =
  'mutation Nested { updateOneAlpacaAccount(where: { id: "a1" }, data: { tradingPolicy: { update: { data: { realtimeTradingEnabled: { set: true } } } } }) { id } }';
const STEAL_ACCOUNT = `mutation Steal { updateOneUser(where: { id: "${U_STRANGER}" }, data: { alpacaAccounts: { connect: [{ id: "a1" }] } }) { id } }`;
const CREATE_WITH_KEYS = `mutation Create { createOneAlpacaAccount(data: { APIKey: "${API_KEY}", APISecret: "${API_SECRET}", user: { connect: { id: "${U_OWNER}" } } }) { id } }`;
const SELF_UPDATE = `mutation Self { updateOneUser(where: { id: "${U_OWNER}" }, data: { name: { set: "n" } }) { id } }`;
const BULK_POLICY =
  'mutation Bulk { updateManyTradingPolicy(where: { killSwitchEnabled: { equals: false } }, data: { killSwitchEnabled: { set: true } }) { count } }';
const DELETE_ACCOUNT = 'mutation Del { deleteOneAlpacaAccount(where: { id: "a1" }) { id } }';

/** One harness scenario. */
export interface Scenario {
  name: string;
  query: string;
  principal: keyof typeof PRINCIPALS;
  mode: MutationAuthMode;
  enforcedModels?: string[];
  auditDown?: boolean;
}

export const SCENARIOS: Scenario[] = [
  { name: 'flip/none/enforce', query: FLIP_LIVE, principal: 'none', mode: 'enforce' },
  { name: 'flip/none/shadow', query: FLIP_LIVE, principal: 'none', mode: 'shadow' },
  { name: 'flip/none/shadow+escalated', query: FLIP_LIVE, principal: 'none', mode: 'shadow', enforcedModels: ['TradingPolicy'] },
  { name: 'flip/none/shadow+other-escalated', query: FLIP_LIVE, principal: 'none', mode: 'shadow', enforcedModels: ['User'] },
  { name: 'flip/none/off', query: FLIP_LIVE, principal: 'none', mode: 'off' },
  { name: 'flip/server/enforce', query: FLIP_LIVE, principal: 'server', mode: 'enforce' },
  { name: 'flip/staticServer/enforce', query: FLIP_LIVE, principal: 'staticServer', mode: 'enforce' },
  { name: 'flip/admin/enforce', query: FLIP_LIVE, principal: 'admin', mode: 'enforce' },
  { name: 'flip/owner/enforce', query: FLIP_LIVE, principal: 'owner', mode: 'enforce' },
  { name: 'flip/stranger/enforce', query: FLIP_LIVE, principal: 'stranger', mode: 'enforce' },
  { name: 'flip/stranger/shadow', query: FLIP_LIVE, principal: 'stranger', mode: 'shadow' },
  { name: 'flipFund/fundUser/enforce', query: FLIP_FUND, principal: 'fundUser', mode: 'enforce' },
  { name: 'flipFund/stranger/enforce', query: FLIP_FUND, principal: 'stranger', mode: 'enforce' },
  { name: 'aliased/none/enforce', query: ALIASED, principal: 'none', mode: 'enforce' },
  { name: 'aliased/owner/enforce', query: ALIASED, principal: 'owner', mode: 'enforce' },
  { name: 'nested/none/enforce', query: NESTED_POLICY, principal: 'none', mode: 'enforce' },
  { name: 'nested/owner/enforce', query: NESTED_POLICY, principal: 'owner', mode: 'enforce' },
  { name: 'nested/stranger/enforce', query: NESTED_POLICY, principal: 'stranger', mode: 'enforce' },
  { name: 'steal/stranger/enforce', query: STEAL_ACCOUNT, principal: 'stranger', mode: 'enforce' },
  { name: 'createKeys/none/enforce', query: CREATE_WITH_KEYS, principal: 'none', mode: 'enforce' },
  { name: 'createKeys/stranger/enforce', query: CREATE_WITH_KEYS, principal: 'stranger', mode: 'enforce' },
  { name: 'createKeys/owner/enforce', query: CREATE_WITH_KEYS, principal: 'owner', mode: 'enforce' },
  { name: 'self/owner/enforce', query: SELF_UPDATE, principal: 'owner', mode: 'enforce' },
  { name: 'self/stranger/enforce', query: SELF_UPDATE, principal: 'stranger', mode: 'enforce' },
  { name: 'bulk/owner/enforce', query: BULK_POLICY, principal: 'owner', mode: 'enforce' },
  { name: 'bulk/server/enforce', query: BULK_POLICY, principal: 'server', mode: 'enforce' },
  { name: 'delete/owner/enforce', query: DELETE_ACCOUNT, principal: 'owner', mode: 'enforce' },
  { name: 'auditDown/server/enforce', query: FLIP_LIVE, principal: 'server', mode: 'enforce', auditDown: true },
  { name: 'auditDown/server/shadow', query: FLIP_LIVE, principal: 'server', mode: 'shadow', auditDown: true },
];

/** What the harness reports per scenario. */
export interface ScenarioResult {
  status: number;
  codes: string[];
  reasons: string[];
  json: string;
  writes: string[];
  audit: Array<Record<string, unknown>>;
  counterDelta: Record<string, number>;
  auditFailureDelta: number;
}

async function counterSnapshot(): Promise<Record<string, number>> {
  const metric = await mutationAuthorizationTotal.get();
  const out: Record<string, number> = {};
  for (const v of metric.values) {
    const key = `${v.labels.mutation}|${v.labels.principal_kind}|${v.labels.decision}|${v.labels.reason}`;
    out[key] = (out[key] ?? 0) + v.value;
  }
  return out;
}

async function auditFailures(): Promise<number> {
  const metric = await mutationAuditWriteFailuresTotal.get();
  return metric.values.reduce((sum, v) => sum + v.value, 0);
}

type Where = Record<string, unknown>;

function policyBy(where: Where): { id: string; alpacaAccountId: string } | undefined {
  return Object.values(POLICIES).find(
    (p) => (where.id !== undefined && p.id === where.id) || (where.alpacaAccountId !== undefined && p.alpacaAccountId === where.alpacaAccountId)
  );
}

function policyFacts(p: { id: string; alpacaAccountId: string }): Record<string, unknown> {
  return {
    ...p,
    realtimeTradingEnabled: false,
    paperTradingOnly: false,
    killSwitchEnabled: false,
    autonomyMode: 'ADVISORY_ONLY',
    alpacaAccount: ACCOUNTS[p.alpacaAccountId],
  };
}

async function main(): Promise<void> {
  let mode: MutationAuthMode = 'enforce';
  let enforcedModels: ReadonlySet<string> = new Set();
  let auditDown = false;
  let writes: string[] = [];
  let audit: Array<Record<string, unknown>> = [];

  const write = (name: string, value: unknown): Promise<unknown> => {
    writes.push(name);
    return Promise.resolve(value);
  };
  const prisma = {
    tradingPolicy: {
      findUnique: ({ where }: { where: Where }) => {
        const p = policyBy(where);
        return Promise.resolve(p ? policyFacts(p) : null);
      },
      findMany: () => Promise.resolve(Object.values(POLICIES).map(policyFacts)),
      update: ({ where }: { where: Where }) =>
        write('tradingPolicy.update', { ...policyBy(where), realtimeTradingEnabled: true }),
      updateMany: () => write('tradingPolicy.updateMany', { count: 2 }),
    },
    alpacaAccount: {
      findUnique: ({ where }: { where: Where }) =>
        Promise.resolve(typeof where.id === 'string' ? (ACCOUNTS[where.id] ?? null) : null),
      update: () => write('alpacaAccount.update', { id: 'a1', type: 'LIVE' }),
      create: () => write('alpacaAccount.create', { id: 'a9', type: 'PAPER' }),
      delete: () => write('alpacaAccount.delete', { id: 'a1', type: 'LIVE' }),
    },
    user: {
      update: ({ where }: { where: Where }) => write('user.update', { id: where.id }),
    },
    orgMembership: { findMany: () => Promise.resolve([]) },
    fund: { findMany: () => Promise.resolve([]) },
    fundAssignment: {
      findMany: ({ where }: { where: { userId: string } }) =>
        Promise.resolve(where.userId === U_FUND ? [{ fundId: FUND_1 }] : []),
    },
    auditLog: {
      create: ({ data }: { data: Record<string, unknown> }) => {
        if (auditDown) return Promise.reject(new Error('audit table unavailable'));
        audit.push(data);
        return Promise.resolve({ id: `audit-${audit.length}` });
      },
    },
  };

  const schema = await buildSchema({
    resolvers: [TradingPolicyCrudResolver, AlpacaAccountCrudResolver, UserCrudResolver],
    validate: false,
  });
  const guardedMutations = installMutationAuthGuard(schema, {
    modeProvider: () => mode,
    enforcedModelsProvider: () => enforcedModels,
  });
  // Installing twice must not double-guard (each decision would count twice).
  installMutationAuthGuard(schema, { modeProvider: () => mode, enforcedModelsProvider: () => enforcedModels });
  const mutationFieldCount = Object.keys(schema.getMutationType()?.getFields() ?? {}).length;
  const server = new ApolloServer({ schema, plugins: [createHttpStatusMapperPlugin()] });
  await server.start();

  const results: Record<string, ScenarioResult> = {};
  for (const scenario of SCENARIOS) {
    mode = scenario.mode;
    enforcedModels = new Set(scenario.enforcedModels ?? []);
    auditDown = scenario.auditDown === true;
    writes = [];
    audit = [];
    resetMutationAuthLogThrottle();
    const before = await counterSnapshot();
    const failuresBefore = await auditFailures();
    const response = await server.executeOperation(
      { query: scenario.query },
      {
        contextValue: {
          prisma,
          principal: PRINCIPALS[scenario.principal],
          req: {
            ip: '203.0.113.7',
            headers: { 'user-agent': 'mutation-guard-harness', 'x-adaptic-change-reason': 'harness: arm LIVE' },
          },
        },
      }
    );
    const after = await counterSnapshot();
    const counterDelta: Record<string, number> = {};
    for (const [key, value] of Object.entries(after)) {
      const delta = value - (before[key] ?? 0);
      if (delta !== 0) counterDelta[key] = delta;
    }
    const body = response.body.kind === 'single' ? response.body.singleResult : null;
    const errors = body?.errors ?? [];
    results[scenario.name] = {
      status: response.http.status ?? 200,
      codes: errors.map((e) => String(e.extensions?.code)),
      reasons: errors.map((e) => String(e.extensions?.reason)),
      json: JSON.stringify(body),
      writes,
      audit: JSON.parse(JSON.stringify(audit)) as Array<Record<string, unknown>>,
      counterDelta,
      auditFailureDelta: (await auditFailures()) - failuresBefore,
    };
  }
  await server.stop();
  process.stdout.write(
    `<<<RESULTS>>>${JSON.stringify({ guardedMutations, mutationFieldCount, results })}<<<END>>>\n`
  );
}

main().catch((error: unknown) => {
  process.stderr.write(`harness failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
