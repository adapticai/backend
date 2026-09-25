/**
 * Out-of-process harness for `mutation-auth-guard.test.ts`.
 *
 * The generated TypeGraphQL resolvers need `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit, so a schema built from them cannot
 * be constructed inside the vitest worker. This harness runs under ts-node,
 * builds a schema from the GENERATED TradingPolicy, AlpacaAccount, User,
 * tenancy (Organization, OrgMembership, Fund, FundAssignment,
 * BrokerageAccount), AuditLog and Configuration resolvers with the guard
 * installed exactly as `server.ts` installs it
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
import { OrganizationCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/Organization/OrganizationCrudResolver';
import { OrgMembershipCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/OrgMembership/OrgMembershipCrudResolver';
import { FundCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/Fund/FundCrudResolver';
import { FundAssignmentCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/FundAssignment/FundAssignmentCrudResolver';
import { BrokerageAccountCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/BrokerageAccount/BrokerageAccountCrudResolver';
import { AuditLogCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/AuditLog/AuditLogCrudResolver';
import { ConfigurationCrudResolver } from '../../generated/typegraphql-prisma/resolvers/crud/Configuration/ConfigurationCrudResolver';
import type { MutationAuthMode } from '../../auth/mutation-authorization';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { createHttpStatusMapperPlugin } from '../../plugins/http-status-mapper';
import {
  installMutationAuthGuard,
  mutationAuthorizationTotal,
  resetMutationAuthLogThrottle,
} from '../mutation-auth-guard';
import { mutationAuditBypassedTotal, mutationAuditWriteFailuresTotal } from '../trading-policy-audit';

export const API_KEY = 'PKMUTATIONGUARDKEY00000000';
export const API_SECRET = 'mutation-guard-secret-value-that-must-never-leak';

const U_OWNER = '11111111-1111-4111-8111-111111111111';
const U_STRANGER = '22222222-2222-4222-8222-222222222222';
const U_FUND = '33333333-3333-4333-8333-333333333333';
const U_OTHER = '44444444-4444-4444-8444-444444444444';
const FUND_1 = '55555555-5555-4555-8555-555555555555';
const FUND_2 = '77777777-7777-4777-8777-777777777777';
const ORG_2 = '88888888-8888-4888-8888-888888888888';

const ACCOUNTS: Record<string, { id: string; userId: string; type: string; brokerageAccount: { fundId: string } | null }> = {
  a1: { id: 'a1', userId: U_OWNER, type: 'LIVE', brokerageAccount: null },
  a2: { id: 'a2', userId: U_OTHER, type: 'PAPER', brokerageAccount: { fundId: FUND_1 } },
  a3: { id: 'a3', userId: U_OTHER, type: 'LIVE', brokerageAccount: { fundId: FUND_2 } },
};

const POLICIES: Record<string, { id: string; alpacaAccountId: string }> = {
  p1: { id: 'p1', alpacaAccountId: 'a1' },
  p2: { id: 'p2', alpacaAccountId: 'a2' },
  p3: { id: 'p3', alpacaAccountId: 'a3' },
};

type Row = Record<string, unknown>;

/** The tenancy rows: U_FUND is assigned FUND_1; FUND_2 (ORG_2) bridges the LIVE account a3. */
const TENANCY: Record<string, Row[]> = {
  organization: [{ id: ORG_2 }],
  orgMembership: [{ id: 'om2', organizationId: ORG_2, userId: U_OTHER }],
  fund: [
    { id: FUND_1, organizationId: 'org-1' },
    { id: FUND_2, organizationId: ORG_2 },
  ],
  fundAssignment: [
    { id: 'fa1', fundId: FUND_1, userId: U_FUND },
    { id: 'fa2', fundId: FUND_2, userId: U_OTHER },
  ],
  brokerageAccount: [
    { id: 'ba1', fundId: FUND_1, engineAccountId: 'a2' },
    { id: 'ba2', fundId: FUND_2, engineAccountId: 'a3' },
  ],
  notificationEvent: [],
  notificationDelivery: [],
  notificationPreference: [],
};

/** Evaluate the `where` shapes the guard's scope check builds (equality, `in`, `AND`, `OR`). */
function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (key === 'AND') return (condition as Row[]).every((c) => matches(row, c));
    if (key === 'OR') return (condition as Row[]).some((c) => matches(row, c));
    if (condition !== null && typeof condition === 'object' && 'in' in condition) {
      return (condition as { in: unknown[] }).in.includes(row[key]);
    }
    return row[key] === condition;
  });
}

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

const ARM = '{ update: { data: { realtimeTradingEnabled: { set: true } } } }';

// Blocker 1: minting fund entitlement.
const NESTED_ASSIGNMENT = `mutation { updateOneUser(where: { id: "${U_FUND}" }, data: { fundAssignments: { create: [{ fund: { connect: { id: "${FUND_2}" } } }] } }) { id } }`;
const NESTED_MEMBERSHIP = `mutation { updateOneUser(where: { id: "${U_STRANGER}" }, data: { orgMemberships: { create: [{ organization: { connect: { id: "${ORG_2}" } } }] } }) { id } }`;
const ROOT_ASSIGNMENT_OTHER_FUND = `mutation { createOneFundAssignment(data: { fund: { connect: { id: "${FUND_2}" } }, user: { connect: { id: "${U_STRANGER}" } } }) { id } }`;
const ROOT_ASSIGNMENT_OWN_FUND = `mutation { createOneFundAssignment(data: { fund: { connect: { id: "${FUND_1}" } }, user: { connect: { id: "${U_FUND}" } } }) { id } }`;
const RETENANT_ASSIGNMENT = `mutation { updateOneFundAssignment(where: { id: "fa1" }, data: { fund: { connect: { id: "${FUND_2}" } } }) { id } }`;
const BROKER_LABEL = (id: string): string => `mutation { updateOneBrokerageAccount(where: { id: "${id}" }, data: { label: { set: "x" } }) { id } }`;
const ARM_UNDER_USER = (userId: string, accountId: string): string =>
  `mutation { updateOneUser(where: { id: "${userId}" }, data: { alpacaAccounts: { update: [{ where: { id: "${accountId}" }, data: { tradingPolicy: ${ARM} } }] } }) { id } }`;

// Blocker 2: walks that leave the root's rows.
const ACCOUNT_CHAIN = 'mutation { updateOneAlpacaAccount(where: { id: "a1" }, data: { brokerageAccount: { update: { data: { fund: { update: { data: { name: { set: "x" } } } } } } } }) { id } }';
const MANAGED_FUND_OPERATOR = `mutation { updateOneUser(where: { id: "${U_FUND}" }, data: { managedFunds: { update: [{ where: { id: "${FUND_1}" }, data: { operator: { update: { data: { role: { set: ADMIN } } } } } }] } }) { id } }`;
const OWNER_ROW_VIA_FUND = 'mutation { updateOneAlpacaAccount(where: { id: "a2" }, data: { user: { update: { data: { email: { set: "taken@example.test" } } } } }) { id } }';
const REPOINT_BROKER = 'mutation { updateOneAlpacaAccount(where: { id: "a1" }, data: { brokerageAccount: { connect: { id: "ba1" } } }) { id } }';
const NESTED_FUND_POLICY = 'mutation { updateOneAlpacaAccount(where: { id: "a2" }, data: { tradingPolicy: { update: { data: { killSwitchEnabled: { set: true } } } } }) { id } }';

// Blocker 3: nested policy writes attributed to the account they reach.
/** Root account a1 → its owner → a fund → that fund's broker ba2 → ba2's engine account (a3, reached to-one) → its policy. */
const ARM_FAR_FROM_ROOT = `mutation { updateOneAlpacaAccount(where: { id: "a1" }, data: { user: { update: { data: { fundAssignments: { update: [{ where: { id: "fa2" }, data: { fund: { update: { data: { brokerageAccounts: { update: [{ where: { id: "ba2" }, data: { engineAccount: { update: { data: { tradingPolicy: ${ARM} } } } } }] } } } } } }] } } } } }) { id } }`;
const ARM_VIA_BROKER = `mutation { updateOneBrokerageAccount(where: { id: "ba2" }, data: { engineAccount: { update: { data: { tradingPolicy: ${ARM} } } } }) { id } }`;

// Majors.
const SELF_ROLE = `mutation { updateOneUser(where: { id: "${U_OWNER}" }, data: { role: { set: ADMIN } }) { id } }`;
const AUDIT_ROW = (source: string): string =>
  `mutation { createOneAuditLog(data: { userId: "${U_OWNER}", operationType: UPDATE, modelName: "TradingPolicy", recordId: "p1", changedFields: {}, metadata: { source: "${source}" } }) { id } }`;
const CONFIG_UPSERT = (key: string): string =>
  `mutation { upsertOneConfiguration(where: { configKey: "${key}" }, create: { configKey: "${key}", configValue: {}, type: USER_PREFERENCE }, update: { configValue: {} }) { id } }`;
// Controls: the platform's own fund-operator writes stay admitted.
const BROKER_CREATE = `mutation { createOneBrokerageAccount(data: { fund: { connect: { id: "${FUND_1}" } }, engineAccount: { create: { APIKey: "${API_KEY}", APISecret: "${API_SECRET}", user: { connect: { id: "${U_FUND}" } } } } }) { id } }`;
const BROKER_CREATE_OTHER_OWNER = `mutation { createOneBrokerageAccount(data: { fund: { connect: { id: "${FUND_1}" } }, engineAccount: { create: { APIKey: "${API_KEY}", APISecret: "${API_SECRET}", user: { connect: { id: "${U_OTHER}" } } } } }) { id } }`;
const BROKER_BRIDGE_FOREIGN = `mutation { createOneBrokerageAccount(data: { fund: { connect: { id: "${FUND_1}" } }, engineAccount: { connect: { id: "a3" } } }) { id } }`;
/** The platform broker-credentials route's update branch: rotate keys on the fund's bound engine account. */
const BROKER_ROTATE = (userId: string): string => `mutation { updateOneBrokerageAccount(where: { id: "ba1" }, data: { label: { set: "rotated" }, engineAccount: { upsert: { create: { APIKey: "${API_KEY}", APISecret: "${API_SECRET}", user: { connect: { id: "${userId}" } } }, update: { APIKey: { set: "${API_KEY}" } } } } }) { id } }`;
const SUSPEND_UPSERT =
  'mutation { upsertOneTradingPolicy(where: { alpacaAccountId: "a2" }, create: { alpacaAccount: { connect: { id: "a2" } } }, update: { killSwitchEnabled: { set: true } }) { id } }';
const DISARM_LIVE =
  'mutation Disarm { updateOneTradingPolicy(where: { alpacaAccountId: "a1" }, data: { realtimeTradingEnabled: { set: false } }) { id } }';

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

  { name: 'b1/nestedAssignment/fundUser/enforce', query: NESTED_ASSIGNMENT, principal: 'fundUser', mode: 'enforce' },
  { name: 'b1/nestedMembership/stranger/enforce', query: NESTED_MEMBERSHIP, principal: 'stranger', mode: 'enforce' },
  { name: 'b1/rootAssignment/stranger/enforce', query: ROOT_ASSIGNMENT_OTHER_FUND, principal: 'stranger', mode: 'enforce' },
  {
    name: 'b1/rootAssignment/stranger/shadow+accounts',
    query: ROOT_ASSIGNMENT_OTHER_FUND,
    principal: 'stranger',
    mode: 'shadow',
    enforcedModels: ['TradingPolicy', 'AlpacaAccount'],
  },
  { name: 'b1/rootAssignment/fundUser/enforce', query: ROOT_ASSIGNMENT_OWN_FUND, principal: 'fundUser', mode: 'enforce' },
  { name: 'b1/retenantAssignment/fundUser/enforce', query: RETENANT_ASSIGNMENT, principal: 'fundUser', mode: 'enforce' },
  { name: 'b1/crossTenantBroker/stranger/enforce', query: BROKER_LABEL('ba2'), principal: 'stranger', mode: 'enforce' },
  { name: 'b1/tenantBroker/fundUser/enforce', query: BROKER_LABEL('ba1'), principal: 'fundUser', mode: 'enforce' },
  {
    name: 'b1/armUnderUser/none/shadow+policy',
    query: ARM_UNDER_USER(U_OTHER, 'a3'),
    principal: 'none',
    mode: 'shadow',
    enforcedModels: ['TradingPolicy'],
  },

  {
    name: 'b1/stealAccountUnderUser/none/shadow+accounts',
    query: `mutation { updateOneUser(where: { id: "${U_STRANGER}" }, data: { alpacaAccounts: { connect: [{ id: "a3" }] } }) { id } }`,
    principal: 'none',
    mode: 'shadow',
    enforcedModels: ['AlpacaAccount'],
  },
  {
    name: 'b1/connectAccountOntoPolicy/none/shadow+accounts',
    query: 'mutation { createOneTradingPolicy(data: { alpacaAccount: { connect: { id: "a3" } } }) { id } }',
    principal: 'none',
    mode: 'shadow',
    enforcedModels: ['AlpacaAccount'],
  },
  { name: 'b2/accountChain/owner/enforce', query: ACCOUNT_CHAIN, principal: 'owner', mode: 'enforce' },
  { name: 'b2/managedFundOperator/fundUser/enforce', query: MANAGED_FUND_OPERATOR, principal: 'fundUser', mode: 'enforce' },
  { name: 'b2/ownerRowViaFund/fundUser/enforce', query: OWNER_ROW_VIA_FUND, principal: 'fundUser', mode: 'enforce' },
  { name: 'b2/armUnderUser/fundUser/enforce', query: ARM_UNDER_USER(U_FUND, 'a3'), principal: 'fundUser', mode: 'enforce' },
  { name: 'b2/repointBroker/owner/enforce', query: REPOINT_BROKER, principal: 'owner', mode: 'enforce' },
  { name: 'b2/nestedFundPolicy/fundUser/enforce', query: NESTED_FUND_POLICY, principal: 'fundUser', mode: 'enforce' },

  { name: 'b3/armUnderUser/server/enforce', query: ARM_UNDER_USER(U_OTHER, 'a3'), principal: 'server', mode: 'enforce' },
  { name: 'b3/armFarFromRoot/server/enforce', query: ARM_FAR_FROM_ROOT, principal: 'server', mode: 'enforce' },
  { name: 'b3/armViaBroker/server/enforce', query: ARM_VIA_BROKER, principal: 'server', mode: 'enforce' },
  { name: 'b3/armUnderUser/owner/enforce', query: ARM_UNDER_USER(U_OWNER, 'a1'), principal: 'owner', mode: 'enforce' },

  { name: 'm/selfRole/owner/enforce', query: SELF_ROLE, principal: 'owner', mode: 'enforce' },
  { name: 'm/forgedAudit/owner/enforce', query: AUDIT_ROW('mutation-auth-guard'), principal: 'owner', mode: 'enforce' },
  { name: 'm/audit/owner/enforce', query: AUDIT_ROW('platform'), principal: 'owner', mode: 'enforce' },
  { name: 'm/systemConfig/owner/enforce', query: CONFIG_UPSERT('llm.alias.routing'), principal: 'owner', mode: 'enforce' },
  {
    name: 'm/ownConfig/owner/enforce',
    query: CONFIG_UPSERT(`platform.web.chart-preferences.user.${U_OWNER}`),
    principal: 'owner',
    mode: 'enforce',
  },
  { name: 'm/disarmAuditDown/server/enforce', query: DISARM_LIVE, principal: 'server', mode: 'enforce', auditDown: true },

  { name: 'ctl/brokerCreate/fundUser/enforce', query: BROKER_CREATE, principal: 'fundUser', mode: 'enforce' },
  { name: 'ctl/brokerCreateOtherOwner/fundUser/enforce', query: BROKER_CREATE_OTHER_OWNER, principal: 'fundUser', mode: 'enforce' },
  { name: 'ctl/brokerBridgeForeign/fundUser/enforce', query: BROKER_BRIDGE_FOREIGN, principal: 'fundUser', mode: 'enforce' },
  { name: 'ctl/suspendUpsert/fundUser/enforce', query: SUSPEND_UPSERT, principal: 'fundUser', mode: 'enforce' },
  { name: 'ctl/brokerRotate/fundUser/enforce', query: BROKER_ROTATE(U_FUND), principal: 'fundUser', mode: 'enforce' },
  { name: 'ctl/brokerRotate/stranger/enforce', query: BROKER_ROTATE(U_STRANGER), principal: 'stranger', mode: 'enforce' },
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
  auditBypassDelta: number;
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

async function auditBypasses(): Promise<number> {
  const metric = await mutationAuditBypassedTotal.get();
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

/**
 * Fake delegates for the tenancy models: `findMany` / `findUnique` over the
 * fixture rows (the entitlement read and the guard's scope check), and
 * recording writes.
 */
function tenancyDelegates(write: (name: string, value: unknown) => Promise<unknown>): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [delegate, rows] of Object.entries(TENANCY)) {
    out[delegate] = {
      findMany: ({ where }: { where: Row }) => Promise.resolve(rows.filter((r) => matches(r, where))),
      findUnique: ({ where }: { where: Row }) => {
        const row = rows.find((r) => matches(r, where));
        return Promise.resolve(row ? { id: row.id } : null);
      },
      create: () => write(`${delegate}.create`, { id: `${delegate}-new` }),
      update: ({ where }: { where: Row }) => write(`${delegate}.update`, { id: where.id }),
      upsert: ({ where }: { where: Row }) => write(`${delegate}.upsert`, { id: where.id }),
      delete: ({ where }: { where: Row }) => write(`${delegate}.delete`, { id: where.id }),
    };
  }
  return out;
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
      upsert: ({ where }: { where: Where }) => write('tradingPolicy.upsert', { ...policyBy(where) }),
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
    ...tenancyDelegates(write),
    auditLog: {
      create: ({ data }: { data: Record<string, unknown> }) => {
        if (auditDown) return Promise.reject(new Error('audit table unavailable'));
        audit.push(data);
        if (data.metadata === null || typeof data.metadata !== 'object' || (data.metadata as Row).source !== 'mutation-auth-guard') {
          writes.push('auditLog.create');
        }
        return Promise.resolve({ id: `audit-${audit.length}` });
      },
    },
    configuration: {
      upsert: ({ where }: { where: Where }) => write('configuration.upsert', { id: `c-${String(where.configKey)}` }),
    },
  };

  const schema = await buildSchema({
    resolvers: [
      TradingPolicyCrudResolver,
      AlpacaAccountCrudResolver,
      UserCrudResolver,
      OrganizationCrudResolver,
      OrgMembershipCrudResolver,
      FundCrudResolver,
      FundAssignmentCrudResolver,
      BrokerageAccountCrudResolver,
      AuditLogCrudResolver,
      ConfigurationCrudResolver,
    ],
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
    const bypassesBefore = await auditBypasses();
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
      auditBypassDelta: (await auditBypasses()) - bypassesBefore,
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
