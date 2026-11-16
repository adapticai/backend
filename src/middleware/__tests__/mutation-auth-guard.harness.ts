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
import type { CredentialFieldGuardMode } from '../credential-field-guard';
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
const ORG_1 = 'org-1';
/** An organization its creator has just written: no members, no funds. */
const ORG_NEW = '99999999-9999-4999-8999-999999999999';
/** An organization that admits sign-ups from one email domain. */
const ORG_DOMAIN = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const U_ORG_OWNER = 'b0000000-0000-4000-8000-000000000001';
const U_ORG_ADMIN = 'b0000000-0000-4000-8000-000000000002';
const U_ORG_MEMBER = 'b0000000-0000-4000-8000-000000000003';
const U_FUND_MANAGER = 'b0000000-0000-4000-8000-000000000004';
const U_FUND_TRADER = 'b0000000-0000-4000-8000-000000000005';
const U_FOUNDER = 'b0000000-0000-4000-8000-000000000006';
const U_JOINER = 'b0000000-0000-4000-8000-000000000007';

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

/**
 * The tenancy rows: U_FUND is assigned FUND_1 (org-1) as a VIEWER; FUND_2
 * (ORG_2) bridges the LIVE account a3. org-1 has an OWNER, an ADMIN and a
 * MEMBER, and FUND_1 a MANAGER and a TRADER.
 */
const TENANCY: Record<string, Row[]> = {
  organization: [
    { id: ORG_1, deletedAt: null, emailDomains: [] },
    { id: ORG_2, deletedAt: null, emailDomains: [] },
    { id: ORG_NEW, deletedAt: null, emailDomains: [] },
    { id: ORG_DOMAIN, deletedAt: null, emailDomains: ['join.example'] },
  ],
  orgMembership: [
    { id: 'om2', organizationId: ORG_2, userId: U_OTHER, role: 'MEMBER' },
    { id: 'om-owner', organizationId: ORG_1, userId: U_ORG_OWNER, role: 'OWNER' },
    { id: 'om-admin', organizationId: ORG_1, userId: U_ORG_ADMIN, role: 'ADMIN' },
    { id: 'om-member', organizationId: ORG_1, userId: U_ORG_MEMBER, role: 'MEMBER' },
    { id: 'om-domain', organizationId: ORG_DOMAIN, userId: U_OTHER, role: 'OWNER' },
  ],
  fund: [
    { id: FUND_1, organizationId: ORG_1 },
    { id: FUND_2, organizationId: ORG_2 },
  ],
  fundAssignment: [
    { id: 'fa1', fundId: FUND_1, userId: U_FUND, role: 'VIEWER' },
    { id: 'fa2', fundId: FUND_2, userId: U_OTHER, role: 'MANAGER' },
    { id: 'fa-manager', fundId: FUND_1, userId: U_FUND_MANAGER, role: 'MANAGER' },
    { id: 'fa-trader', fundId: FUND_1, userId: U_FUND_TRADER, role: 'TRADER' },
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
    if (condition !== null && typeof condition === 'object' && 'equals' in condition) {
      return row[key] === (condition as { equals: unknown }).equals;
    }
    // A compound unique selector (`organizationId_userId: { organizationId, userId }`).
    if (condition !== null && typeof condition === 'object' && !(key in row)) {
      return matches(row, condition as Row);
    }
    return row[key] === condition;
  });
}

/** Project a fixture row onto a Prisma `select`, including `_count` and a to-one relation. */
function project(delegate: string, row: Row, select: Row | undefined): Row {
  if (!select) return { id: row.id };
  const out: Row = {};
  for (const [key, wanted] of Object.entries(select)) {
    if (key === '_count') {
      const counted = (wanted as { select: Row }).select;
      const counts: Row = {};
      if ('members' in counted) counts.members = TENANCY.orgMembership.filter((m) => m.organizationId === row.id).length;
      if ('funds' in counted) counts.funds = TENANCY.fund.filter((f) => f.organizationId === row.id).length;
      out._count = counts;
    } else if (delegate === 'fundAssignment' && key === 'fund') {
      const fund = TENANCY.fund.find((f) => f.id === row.fundId);
      out.fund = fund ? project('fund', fund, (wanted as { select: Row }).select) : null;
    } else {
      out[key] = row[key];
    }
  }
  return out;
}

const PRINCIPALS: Record<string, BackendPrincipal | null> = {
  none: null,
  server: { kind: 'server', sub: 'adaptic-engine:host-1:42' },
  staticServer: { kind: 'server' },
  admin: { kind: 'admin', sub: '66666666-6666-4666-8666-666666666666', roles: ['admin'] },
  owner: { kind: 'user', sub: U_OWNER, email: 'owner@example.test', roles: [] },
  stranger: { kind: 'user', sub: U_STRANGER, roles: [] },
  fundUser: { kind: 'user', sub: U_FUND, roles: [] },
  orgOwner: { kind: 'user', sub: U_ORG_OWNER, roles: [] },
  orgAdmin: { kind: 'user', sub: U_ORG_ADMIN, roles: [] },
  // The token claims a role the caller does not hold: authority is read from
  // the database, never from the claim.
  orgMember: { kind: 'user', sub: U_ORG_MEMBER, roles: ['fund_operator'] },
  fundManager: { kind: 'user', sub: U_FUND_MANAGER, roles: [] },
  fundTrader: { kind: 'user', sub: U_FUND_TRADER, roles: [] },
  founder: { kind: 'user', sub: U_FOUNDER, roles: [] },
  joiner: { kind: 'user', sub: U_JOINER, roles: [] },
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

// Entitlement rows: who may write a membership or a fund assignment.
const SET_MEMBERSHIP_ROLE = (id: string, role: string): string =>
  `mutation { updateOneOrgMembership(where: { id: "${id}" }, data: { role: { set: ${role} } }) { id } }`;
const DELETE_MEMBERSHIP = (id: string): string => `mutation { deleteOneOrgMembership(where: { id: "${id}" }) { id } }`;
const CREATE_MEMBERSHIP = (orgId: string, userId: string, role: string): string =>
  `mutation { createOneOrgMembership(data: { organization: { connect: { id: "${orgId}" } }, user: { connect: { id: "${userId}" } }, role: ${role} }) { id } }`;
const CREATE_ASSIGNMENT = (fundId: string, userId: string, role: string): string =>
  `mutation { createOneFundAssignment(data: { fund: { connect: { id: "${fundId}" } }, user: { connect: { id: "${userId}" } }, role: ${role} }) { id } }`;
const SET_ASSIGNMENT_ROLE = (id: string, role: string): string =>
  `mutation { updateOneFundAssignment(where: { id: "${id}" }, data: { role: { set: ${role} } }) { id } }`;
const SET_MEMBERSHIP_ROLE_BY_PAIR = (orgId: string, userId: string, role: string): string =>
  `mutation { updateOneOrgMembership(where: { organizationId_userId: { organizationId: "${orgId}", userId: "${userId}" } }, data: { role: { set: ${role} } }) { id } }`;
/** The platform's fund-creation payload: the creator as operator and as the fund's first MANAGER. */
const CREATE_FUND_WITH_MANAGER = (userId: string): string =>
  `mutation { createOneFund(data: { name: "F", slug: "f", organization: { connect: { id: "${ORG_1}" } }, operator: { connect: { id: "${userId}" } }, assignments: { create: [{ user: { connect: { id: "${userId}" } }, role: MANAGER }] } }) { id } }`;

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
// Desk availability: a user sets their own; never another user's.
const SET_AVAILABILITY = (userId: string): string =>
  `mutation { updateOneUser(where: { id: "${userId}" }, data: { availability: { set: away }, availabilityUntil: { set: "2026-11-14T10:00:00.000Z" } }) { id } }`;
const AUDIT_ROW = (source: string): string =>
  `mutation { createOneAuditLog(data: { userId: "${U_OWNER}", operationType: UPDATE, modelName: "TradingPolicy", recordId: "p1", changedFields: {}, metadata: { source: "${source}" } }) { id } }`;
// A fund ledger entry: the engine's service principal writes it; no signed-in user may place one.
const AUDIT_LEDGER_ROW = (userId: string, fundId: string): string =>
  `mutation { createOneAuditLog(data: { userId: "${userId}", operationType: UPDATE, modelName: "Order", recordId: "o1", changedFields: {}, fundId: "${fundId}", metadata: { source: "platform" } }) { id } }`;
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

// Credential predicates: a `where` over a stored credential must be refused
// before the guard reads a row with it, or the rows it matched land in the
// audit trail and the filter becomes an oracle over the credential.
const SECRET_PREFIX = '{ alpacaAccount: { is: { APISecret: { startsWith: "m" } } } }';
const ORACLE_BULK = `mutation { updateManyTradingPolicy(where: ${SECRET_PREFIX}, data: { killSwitchEnabled: { set: true } }) { count } }`;
const ORACLE_ONE =
  'mutation { updateOneTradingPolicy(where: { alpacaAccountId: "a1", alpacaAccount: { is: { APIKey: { startsWith: "P" } } } }, data: { killSwitchEnabled: { set: true } }) { id } }';
const ORACLE_NESTED =
  'mutation { updateOneAlpacaAccount(where: { id: "a1", APISecret: { startsWith: "m" } }, data: { tradingPolicy: { update: { data: { killSwitchEnabled: { set: true } } } } }) { id } }';
const ORACLE_NESTED_WHERE = `mutation { updateOneUser(where: { id: "${U_OWNER}" }, data: { alpacaAccounts: { update: [{ where: { id: "a1", APISecret: { startsWith: "m" } }, data: { tradingPolicy: ${ARM} } }] } }) { id } }`;

/** One harness scenario. */
export interface Scenario {
  name: string;
  query: string;
  principal: keyof typeof PRINCIPALS;
  mode: MutationAuthMode;
  enforcedModels?: string[];
  auditDown?: boolean;
  /** The credential-field guard's mode; defaults to `enforce`, production's setting. */
  credentialMode?: CredentialFieldGuardMode;
  /** Make every OrgMembership and FundAssignment `findUnique` fail. */
  membershipReadsDown?: boolean;
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
  { name: 'b1/rootAssignment/fundUser/shadow', query: ROOT_ASSIGNMENT_OWN_FUND, principal: 'fundUser', mode: 'shadow' },

  // A member's own promotion, under both modes.
  { name: 'mem/promoteSelf/orgMember/enforce', query: SET_MEMBERSHIP_ROLE('om-member', 'OWNER'), principal: 'orgMember', mode: 'enforce' },
  { name: 'mem/promoteSelf/orgMember/shadow', query: SET_MEMBERSHIP_ROLE('om-member', 'OWNER'), principal: 'orgMember', mode: 'shadow' },
  { name: 'mem/promoteSelfByPair/orgMember/enforce', query: SET_MEMBERSHIP_ROLE_BY_PAIR(ORG_1, U_ORG_MEMBER, 'ADMIN'), principal: 'orgMember', mode: 'enforce' },
  { name: 'mem/selfManager/orgMember/enforce', query: CREATE_ASSIGNMENT(FUND_1, U_ORG_MEMBER, 'MANAGER'), principal: 'orgMember', mode: 'enforce' },
  { name: 'mem/selfManager/orgMember/shadow', query: CREATE_ASSIGNMENT(FUND_1, U_ORG_MEMBER, 'MANAGER'), principal: 'orgMember', mode: 'shadow' },
  { name: 'mem/selfManager/fundUser/enforce', query: SET_ASSIGNMENT_ROLE('fa1', 'MANAGER'), principal: 'fundUser', mode: 'enforce' },
  // OWNER and ADMIN manage the organization's memberships; only OWNER touches an OWNER row.
  { name: 'mem/ownerSetsRole/orgOwner/enforce', query: SET_MEMBERSHIP_ROLE('om-member', 'ADMIN'), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/ownerGrantsOwner/orgOwner/enforce', query: SET_MEMBERSHIP_ROLE('om-admin', 'OWNER'), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/ownerRemoves/orgOwner/enforce', query: DELETE_MEMBERSHIP('om-member'), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/adminSetsRole/orgAdmin/enforce', query: SET_MEMBERSHIP_ROLE('om-member', 'AUDITOR'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/adminGrantsOwner/orgAdmin/enforce', query: SET_MEMBERSHIP_ROLE('om-admin', 'OWNER'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/adminDemotesOwner/orgAdmin/enforce', query: SET_MEMBERSHIP_ROLE('om-owner', 'MEMBER'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/adminRemovesOwner/orgAdmin/enforce', query: DELETE_MEMBERSHIP('om-owner'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/adminAddsMember/orgAdmin/enforce', query: CREATE_MEMBERSHIP(ORG_1, U_STRANGER, 'COMPLIANCE_OFFICER'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/otherOrg/orgOwner/enforce', query: SET_MEMBERSHIP_ROLE('om2', 'OWNER'), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/missingRow/orgOwner/enforce', query: SET_MEMBERSHIP_ROLE('om-none', 'ADMIN'), principal: 'orgOwner', mode: 'enforce' },
  // Self-service: the creator of an empty organization. A domain join made as the
  // joiner carries no proof the backend can read (the email is the caller's own column).
  { name: 'mem/firstOwner/founder/enforce', query: CREATE_MEMBERSHIP(ORG_NEW, U_FOUNDER, 'OWNER'), principal: 'founder', mode: 'enforce' },
  { name: 'mem/claimOccupied/founder/enforce', query: CREATE_MEMBERSHIP(ORG_1, U_FOUNDER, 'OWNER'), principal: 'founder', mode: 'enforce' },
  { name: 'mem/firstOwnerForOther/founder/enforce', query: CREATE_MEMBERSHIP(ORG_NEW, U_STRANGER, 'OWNER'), principal: 'founder', mode: 'enforce' },
  { name: 'mem/domainJoin/joiner/enforce', query: CREATE_MEMBERSHIP(ORG_DOMAIN, U_JOINER, 'MEMBER'), principal: 'joiner', mode: 'enforce' },
  // An invitation's acceptance carries no proof the backend can read.
  { name: 'mem/inviteAccept/stranger/enforce', query: CREATE_MEMBERSHIP(ORG_1, U_STRANGER, 'ADMIN'), principal: 'stranger', mode: 'enforce' },
  // Fund assignments: org OWNER/ADMIN, or the fund's own MANAGER.
  { name: 'mem/ownerAssigns/orgOwner/enforce', query: CREATE_ASSIGNMENT(FUND_1, U_STRANGER, 'MANAGER'), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/adminAssigns/orgAdmin/enforce', query: CREATE_ASSIGNMENT(FUND_1, U_STRANGER, 'TRADER'), principal: 'orgAdmin', mode: 'enforce' },
  { name: 'mem/managerAssigns/fundManager/enforce', query: CREATE_ASSIGNMENT(FUND_1, U_STRANGER, 'ANALYST'), principal: 'fundManager', mode: 'enforce' },
  { name: 'mem/managerSetsRole/fundManager/enforce', query: SET_ASSIGNMENT_ROLE('fa1', 'ANALYST'), principal: 'fundManager', mode: 'enforce' },
  { name: 'mem/managerOtherFund/fundManager/enforce', query: CREATE_ASSIGNMENT(FUND_2, U_STRANGER, 'ANALYST'), principal: 'fundManager', mode: 'enforce' },
  { name: 'mem/managerOtherFundRow/fundManager/enforce', query: SET_ASSIGNMENT_ROLE('fa2', 'VIEWER'), principal: 'fundManager', mode: 'enforce' },
  { name: 'mem/traderAssigns/fundTrader/enforce', query: CREATE_ASSIGNMENT(FUND_1, U_STRANGER, 'ANALYST'), principal: 'fundTrader', mode: 'enforce' },
  // The authority read fails: refused, and only observed in shadow.
  { name: 'mem/readDown/orgOwner/enforce', query: SET_MEMBERSHIP_ROLE('om-member', 'ADMIN'), principal: 'orgOwner', mode: 'enforce', membershipReadsDown: true },
  { name: 'mem/readDown/orgOwner/shadow', query: SET_MEMBERSHIP_ROLE('om-member', 'ADMIN'), principal: 'orgOwner', mode: 'shadow', membershipReadsDown: true },
  // The platform's fund creation writes the creator's MANAGER assignment nested.
  { name: 'mem/fundCreate/orgOwner/enforce', query: CREATE_FUND_WITH_MANAGER(U_ORG_OWNER), principal: 'orgOwner', mode: 'enforce' },
  { name: 'mem/ownerSetsRole/server/enforce', query: SET_MEMBERSHIP_ROLE('om-member', 'OWNER'), principal: 'server', mode: 'enforce' },
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
  { name: 'm/availability/owner/enforce', query: SET_AVAILABILITY(U_OWNER), principal: 'owner', mode: 'enforce' },
  { name: 'm/availabilityOther/owner/enforce', query: SET_AVAILABILITY(U_STRANGER), principal: 'owner', mode: 'enforce' },
  { name: 'm/forgedAudit/owner/enforce', query: AUDIT_ROW('mutation-auth-guard'), principal: 'owner', mode: 'enforce' },
  { name: 'm/audit/owner/enforce', query: AUDIT_ROW('platform'), principal: 'owner', mode: 'enforce' },
  { name: 'm/ledgerOtherFund/owner/enforce', query: AUDIT_LEDGER_ROW(U_OWNER, FUND_2), principal: 'owner', mode: 'enforce' },
  { name: 'm/ledgerOwnFund/fundUser/enforce', query: AUDIT_LEDGER_ROW(U_FUND, FUND_1), principal: 'fundUser', mode: 'enforce' },
  { name: 'm/ledger/server/enforce', query: AUDIT_LEDGER_ROW(U_OWNER, FUND_2), principal: 'server', mode: 'enforce' },
  { name: 'm/ledgerOtherFund/owner/shadow', query: AUDIT_LEDGER_ROW(U_OWNER, FUND_2), principal: 'owner', mode: 'shadow' },
  { name: 'm/ledgerOtherFund/owner/off', query: AUDIT_LEDGER_ROW(U_OWNER, FUND_2), principal: 'owner', mode: 'off' },
  { name: 'm/audit/owner/shadow', query: AUDIT_ROW('platform'), principal: 'owner', mode: 'shadow' },
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

  { name: 'cred/bulk/none/shadow', query: ORACLE_BULK, principal: 'none', mode: 'shadow' },
  { name: 'cred/bulk/none/enforce', query: ORACLE_BULK, principal: 'none', mode: 'enforce' },
  { name: 'cred/bulk/none/off', query: ORACLE_BULK, principal: 'none', mode: 'off' },
  { name: 'cred/bulk/admin/enforce', query: ORACLE_BULK, principal: 'admin', mode: 'enforce' },
  { name: 'cred/bulk/owner/shadow', query: ORACLE_BULK, principal: 'owner', mode: 'shadow' },
  { name: 'cred/one/none/shadow', query: ORACLE_ONE, principal: 'none', mode: 'shadow' },
  { name: 'cred/one/none/enforce', query: ORACLE_ONE, principal: 'none', mode: 'enforce' },
  { name: 'cred/nested/none/shadow', query: ORACLE_NESTED, principal: 'none', mode: 'shadow' },
  { name: 'cred/nestedWhere/none/shadow', query: ORACLE_NESTED_WHERE, principal: 'none', mode: 'shadow' },
  { name: 'cred/nested/owner/enforce', query: ORACLE_NESTED, principal: 'owner', mode: 'enforce' },
  { name: 'cred/bulk/server/enforce', query: ORACLE_BULK, principal: 'server', mode: 'enforce' },
  { name: 'cred/bulk/none/shadow+credShadow', query: ORACLE_BULK, principal: 'none', mode: 'shadow', credentialMode: 'shadow' },
];

/** What the harness reports per scenario. */
export interface ScenarioResult {
  status: number;
  codes: string[];
  reasons: string[];
  json: string;
  writes: string[];
  /** Guard-side database reads (`delegate.method`), in order. */
  reads: string[];
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
 * recording reads and writes.
 */
function tenancyDelegates(
  write: (name: string, value: unknown) => Promise<unknown>,
  read: <T>(name: string, value: T) => Promise<T>,
  reads: { push(name: string): void },
  membershipReadsDown: () => boolean
): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const [delegate, rows] of Object.entries(TENANCY)) {
    out[delegate] = {
      findMany: ({ where }: { where: Row }) => read(`${delegate}.findMany`, rows.filter((r) => matches(r, where))),
      findUnique: ({ where, select }: { where: Row; select?: Row }) => {
        if (membershipReadsDown() && (delegate === 'orgMembership' || delegate === 'fundAssignment')) {
          reads.push(`${delegate}.findUnique`);
          return Promise.reject(new Error('membership table unavailable'));
        }
        const row = rows.find((r) => matches(r, where));
        return read(`${delegate}.findUnique`, row ? project(delegate, row, select) : null);
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
  let credentialMode: CredentialFieldGuardMode = 'enforce';
  let membershipReadsDown = false;
  let writes: string[] = [];
  let reads: string[] = [];
  let audit: Array<Record<string, unknown>> = [];

  const write = (name: string, value: unknown): Promise<unknown> => {
    writes.push(name);
    return Promise.resolve(value);
  };
  const read = <T>(name: string, value: T): Promise<T> => {
    reads.push(name);
    return Promise.resolve(value);
  };
  const prisma = {
    tradingPolicy: {
      findUnique: ({ where }: { where: Where }) => {
        const p = policyBy(where);
        return read('tradingPolicy.findUnique', p ? policyFacts(p) : null);
      },
      findMany: () => read('tradingPolicy.findMany', Object.values(POLICIES).map(policyFacts)),
      update: ({ where }: { where: Where }) =>
        write('tradingPolicy.update', { ...policyBy(where), realtimeTradingEnabled: true }),
      updateMany: () => write('tradingPolicy.updateMany', { count: 2 }),
      upsert: ({ where }: { where: Where }) => write('tradingPolicy.upsert', { ...policyBy(where) }),
    },
    alpacaAccount: {
      findUnique: ({ where }: { where: Where }) =>
        read('alpacaAccount.findUnique', typeof where.id === 'string' ? (ACCOUNTS[where.id] ?? null) : null),
      update: () => write('alpacaAccount.update', { id: 'a1', type: 'LIVE' }),
      create: () => write('alpacaAccount.create', { id: 'a9', type: 'PAPER' }),
      delete: () => write('alpacaAccount.delete', { id: 'a1', type: 'LIVE' }),
    },
    user: {
      update: ({ where }: { where: Where }) => write('user.update', { id: where.id }),
    },
    ...tenancyDelegates(write, read, { push: (name: string) => reads.push(name) }, () => membershipReadsDown),
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
    credentialGuardModeProvider: () => credentialMode,
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
    credentialMode = scenario.credentialMode ?? 'enforce';
    membershipReadsDown = scenario.membershipReadsDown === true;
    writes = [];
    reads = [];
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
      reads,
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
