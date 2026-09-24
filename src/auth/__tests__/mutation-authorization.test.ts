/**
 * Pure decision logic for mutation authorization, plus the input helpers the
 * guard builds on. The schema-level behaviour (real generated resolvers, HTTP
 * status, audit rows) is in `src/middleware/__tests__/mutation-auth-guard.test.ts`.
 */
import { describe, expect, it } from 'vitest';
import { GraphQLInputObjectType, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import {
  classifyMutationField,
  effectiveModeFor,
  evaluateMutationAccess,
  expandEnforcedModels,
  getEnforcedModels,
  getMutationAuthMode,
  ruleFor,
  type MutationTarget,
} from '../mutation-authorization';
import { findNestedWrites, nestedContainerModel, type NestedWrite } from '../nested-write-inspector';
import {
  firstNestedRefusal,
  nestedWriteRefusalForUser,
  writesNestedModelRows,
  type RelationFacts,
} from '../nested-write-policy';
import { userContentRefusal } from '../user-write-content';
import { REDACTED, redactCredentials } from '../credential-redaction';
import type { BackendPrincipal } from '../token-verifier';
import {
  isDisarmOnlyPolicyWrite,
  mayTouchLiveAccount,
  sanitizeHeader,
  touchesTradingSwitch,
  wsActorRequest,
} from '../../middleware/trading-policy-audit';

const MODELS = new Set(['TradingPolicy', 'AlpacaAccount', 'User', 'Account', 'AccountLinkingRequest', 'Trade']);
const LONGEST_FIRST = [...MODELS].sort((a, b) => b.length - a.length);

const SERVER: BackendPrincipal = { kind: 'server', sub: 'adaptic-engine:h:1' };
const ADMIN: BackendPrincipal = { kind: 'admin', sub: 'a-1', roles: ['admin'] };
const USER: BackendPrincipal = { kind: 'user', sub: 'u-1', roles: [] };

const target = (fieldName: string): MutationTarget => classifyMutationField(fieldName, MODELS);

describe('getMutationAuthMode', () => {
  it('defaults an unset or blank variable to shadow, so the first deploy changes nothing', () => {
    expect(getMutationAuthMode({})).toBe('shadow');
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: '  ' })).toBe('shadow');
  });

  it('honours the three recognised values, case-insensitively', () => {
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: 'off' })).toBe('off');
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: 'Shadow' })).toBe('shadow');
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: ' ENFORCE ' })).toBe('enforce');
  });

  it('fails CLOSED on a set-but-unrecognised value', () => {
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: 'enforced' })).toBe('enforce');
    expect(getMutationAuthMode({ MUTATION_AUTH_MODE: 'true' })).toBe('enforce');
  });
});

describe('effectiveModeFor', () => {
  const escalated = getEnforcedModels({ MUTATION_AUTH_ENFORCE_MODELS: ' TradingPolicy, AlpacaAccount ,,' });

  it('parses the escalation list', () => {
    expect([...escalated]).toEqual(['TradingPolicy', 'AlpacaAccount']);
  });

  it('escalates only the listed models under shadow', () => {
    expect(effectiveModeFor(['TradingPolicy'], 'shadow', escalated)).toBe('enforce');
    expect(effectiveModeFor(['User'], 'shadow', escalated)).toBe('shadow');
  });

  it('lets off win as a kill switch and enforce cover every model', () => {
    expect(effectiveModeFor(['TradingPolicy'], 'off', escalated)).toBe('off');
    expect(effectiveModeFor(['User'], 'enforce', new Set())).toBe('enforce');
  });

  it('decides a mutation at the strictest mode of any model it writes, nested included', () => {
    expect(effectiveModeFor(['User', 'AlpacaAccount', 'TradingPolicy'], 'shadow', new Set(['TradingPolicy']))).toBe(
      'enforce'
    );
    expect(effectiveModeFor(['User', 'Alert'], 'shadow', new Set(['TradingPolicy']))).toBe('shadow');
  });

  it('brings the entitlement-source models along when an account model is escalated', () => {
    expect([...expandEnforcedModels(new Set(['TradingPolicy']))].sort()).toEqual(
      ['BrokerageAccount', 'Fund', 'FundAssignment', 'OrgMembership', 'TradingPolicy'].sort()
    );
    expect(effectiveModeFor(['FundAssignment'], 'shadow', new Set(['AlpacaAccount']))).toBe('enforce');
    expect(effectiveModeFor(['FundAssignment'], 'shadow', new Set(['Alert']))).toBe('shadow');
  });
});

describe('classifyMutationField', () => {
  it('resolves every generated prefix onto its model', () => {
    expect(target('updateOneTradingPolicy')).toMatchObject({ model: 'TradingPolicy', action: 'update', cardinality: 'one' });
    expect(target('upsertOneTradingPolicy')).toMatchObject({ action: 'upsert', cardinality: 'one' });
    expect(target('updateManyTradingPolicy')).toMatchObject({ action: 'update', cardinality: 'many' });
    expect(target('createManyAndReturnTrade')).toMatchObject({ model: 'Trade', action: 'create', cardinality: 'many' });
    expect(target('deleteOneAlpacaAccount')).toMatchObject({ model: 'AlpacaAccount', action: 'delete' });
  });

  it('treats anything else as a custom mutation, which a user may not run unless listed', () => {
    expect(target('updateOrgTradingDefaults')).toMatchObject({ model: 'custom:updateOrgTradingDefaults', action: 'custom' });
    expect(evaluateMutationAccess(USER, target('updateOrgTradingDefaults')).allowed).toBe(true);
    expect(evaluateMutationAccess(USER, target('somethingNew')).reason).toBe('model_not_user_writable');
  });
});

describe('evaluateMutationAccess', () => {
  it('refuses no principal as unauthenticated (401), for every model', () => {
    for (const field of ['updateOneTradingPolicy', 'createOneTrade', 'updateOneUser', 'updateOrgTradingDefaults']) {
      expect(evaluateMutationAccess(null, target(field))).toEqual({
        allowed: false,
        reason: 'unauthenticated',
        refusal: 'unauthenticated',
      });
    }
  });

  it('admits the service principal and admins everywhere', () => {
    expect(evaluateMutationAccess(SERVER, target('updateManyTrade')).reason).toBe('service_principal');
    expect(evaluateMutationAccess(ADMIN, target('deleteManyTradingPolicy')).reason).toBe('admin_principal');
  });

  it('refuses a user on service-only models', () => {
    expect(ruleFor('Trade').policy).toBe('service_only');
    expect(evaluateMutationAccess(USER, target('updateOneTrade'))).toMatchObject({
      allowed: false,
      reason: 'model_not_user_writable',
      refusal: 'forbidden',
    });
  });

  it('requires resolved ownership for an account-owned write', () => {
    const flip = target('updateOneTradingPolicy');
    expect(evaluateMutationAccess(USER, flip).reason).toBe('account_unresolved');
    expect(evaluateMutationAccess(USER, flip, { ownership: { kind: 'owner' } }).allowed).toBe(true);
    expect(evaluateMutationAccess(USER, flip, { ownership: { kind: 'fund_entitled' } }).reason).toBe(
      'account_fund_entitled'
    );
    expect(evaluateMutationAccess(USER, flip, { ownership: { kind: 'other' } }).reason).toBe('not_account_owner');
  });

  it('refuses a user bulk or out-of-list actions even when they own the account', () => {
    const owner = { ownership: { kind: 'owner' } as const };
    expect(evaluateMutationAccess(USER, target('updateManyTradingPolicy'), owner).reason).toBe(
      'bulk_not_user_writable'
    );
    expect(evaluateMutationAccess(USER, target('deleteOneTradingPolicy'), owner).reason).toBe(
      'action_not_user_writable'
    );
  });

  it('refuses a user whose payload carries a refused nested write or refused content', () => {
    expect(
      evaluateMutationAccess(USER, target('updateOneTradingPolicy'), {
        ownership: { kind: 'owner' },
        nestedRefusal: 'nested_entitlement_write',
      }).reason
    ).toBe('nested_entitlement_write');
    expect(
      evaluateMutationAccess(USER, target('updateOneUser'), {
        targetsSelf: true,
        contentRefusal: 'field_not_user_writable',
      }).reason
    ).toBe('field_not_user_writable');
  });

  it('admits a tenant-scoped write only when the guard proved it in scope', () => {
    const models = new Set(['FundAssignment']);
    const fa = classifyMutationField('createOneFundAssignment', models);
    expect(evaluateMutationAccess(USER, fa).reason).toBe('tenant_unresolved');
    expect(evaluateMutationAccess(USER, fa, { tenantScope: 'in_scope' }).allowed).toBe(true);
    expect(evaluateMutationAccess(USER, fa, { tenantScope: 'out_of_scope' }).reason).toBe('tenant_out_of_scope');
  });

  it('confines self-policy writes to the caller', () => {
    expect(evaluateMutationAccess(USER, target('updateOneUser'), { targetsSelf: true }).allowed).toBe(true);
    expect(evaluateMutationAccess(USER, target('updateOneUser'), { targetsSelf: false }).reason).toBe('not_self');
    expect(evaluateMutationAccess(USER, target('createOneUser'), { targetsSelf: true }).reason).toBe(
      'action_not_user_writable'
    );
  });
});

/** Foreign-key placement for the relations the cases below use. */
const RELATIONS: RelationFacts = {
  fkOnParent: (model, relation) =>
    new Map<string, boolean>([
      ['AlpacaAccount.tradingPolicy', false],
      ['AlpacaAccount.user', true],
      ['AlpacaAccount.brokerageAccount', false],
      ['TradingPolicy.alpacaAccount', true],
      ['BrokerageAccount.engineAccount', true],
      ['BrokerageAccount.fund', true],
      ['FundAssignment.fund', true],
      ['FundAssignment.user', true],
      ['User.alpacaAccounts', false],
      ['User.fundAssignments', false],
      ['User.managedFunds', false],
      ['Fund.operator', true],
      ['Fund.brokerageAccounts', false],
      ['Organization.funds', false],
      ['Mandate.organization', true],
      ['Mandate.owner', true],
      ['Mandate.activeVersion', true],
      ['Mandate.fund', true],
      ['MandateApproval.mandateVersion', true],
    ]).get(`${model}.${relation}`),
};

const nw = (over: Partial<NestedWrite> & Pick<NestedWrite, 'model' | 'parentModel' | 'relation'>): NestedWrite => ({
  operations: ['update'],
  path: `data.${over.relation}`,
  connectIds: [],
  parentMode: 'update',
  depth: 1,
  parentRowWhere: null,
  ...over,
});

describe('nestedWriteRefusalForUser', () => {
  const me = 'u-1';
  const refusal = (w: NestedWrite): string | null => nestedWriteRefusalForUser(w, me, RELATIONS);

  it('admits the owned-content edges whose target is the root row\'s own counterpart, at depth 1 only', () => {
    expect(refusal(nw({ model: 'TradingPolicy', parentModel: 'AlpacaAccount', relation: 'tradingPolicy' }))).toBeNull();
    expect(
      refusal(nw({ model: 'TradingPolicy', parentModel: 'AlpacaAccount', relation: 'tradingPolicy', depth: 2 }))
    ).toBe('nested_write_not_user_writable');
    expect(
      refusal(nw({ model: 'AlpacaAccount', parentModel: 'BrokerageAccount', relation: 'engineAccount', operations: ['upsert'] }))
    ).toBeNull();
  });

  it('refuses entitlement rows and fund manager/operator relations nested, whatever the operation', () => {
    for (const operations of [['create'], ['connect'], ['update']]) {
      expect(refusal(nw({ model: 'FundAssignment', parentModel: 'User', relation: 'fundAssignments', operations }))).toBe(
        'nested_entitlement_write'
      );
    }
    expect(
      refusal(nw({ model: 'User', parentModel: 'Fund', relation: 'operator', operations: ['connect'], connectIds: [me], parentMode: 'create' }))
    ).toBe('nested_entitlement_write');
  });

  it('refuses a walk that leaves the root: tenant rows and other users\' rows are never content-written nested', () => {
    expect(refusal(nw({ model: 'Fund', parentModel: 'User', relation: 'managedFunds' }))).toBe('nested_entitlement_write');
    expect(refusal(nw({ model: 'AlpacaAccount', parentModel: 'Fund', relation: 'brokerageAccounts' }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ model: 'User', parentModel: 'AlpacaAccount', relation: 'user' }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ model: 'AlpacaAccount', parentModel: 'User', relation: 'alpacaAccounts' }))).toBe(
      'nested_write_not_user_writable'
    );
  });

  it('admits connect only where the foreign key sits on the parent, and re-tenanting never', () => {
    const connect = { operations: ['connect'], connectIds: ['x'] };
    expect(refusal(nw({ model: 'BrokerageAccount', parentModel: 'AlpacaAccount', relation: 'brokerageAccount', ...connect }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ model: 'Fund', parentModel: 'Organization', relation: 'funds', ...connect, parentMode: 'create' }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ model: 'Fund', parentModel: 'FundAssignment', relation: 'fund', ...connect }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ model: 'Fund', parentModel: 'BrokerageAccount', relation: 'fund', ...connect, parentMode: 'create' }))).toBeNull();
    expect(refusal(nw({ model: 'AlpacaAccount', parentModel: 'BrokerageAccount', relation: 'engineAccount', ...connect }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(
      refusal(nw({ model: 'AlpacaAccount', parentModel: 'TradingPolicy', relation: 'alpacaAccount', ...connect, parentMode: 'create' }))
    ).toBeNull();
    expect(refusal(nw({ model: 'MandateVersion', parentModel: 'Mandate', relation: 'activeVersion', ...connect }))).toBeNull();
  });

  it('admits connecting the caller\'s own user row only onto a row being created', () => {
    const self = { model: 'User', parentModel: 'AlpacaAccount', relation: 'user', operations: ['connect'] } as const;
    expect(refusal(nw({ ...self, connectIds: [me], parentMode: 'create' }))).toBeNull();
    expect(refusal(nw({ ...self, connectIds: [me], parentMode: 'update' }))).toBe('nested_write_not_user_writable');
    expect(refusal(nw({ ...self, connectIds: ['someone-else'], parentMode: 'create' }))).toBe(
      'nested_write_not_user_writable'
    );
    expect(refusal(nw({ ...self, connectIds: null, parentMode: 'create' }))).toBe('nested_write_not_user_writable');
  });

  it('refuses every re-pointing or deleting operation', () => {
    for (const op of ['set', 'disconnect', 'delete', 'deleteMany', 'updateMany', 'connectOrCreate', 'createMany']) {
      expect(refusal(nw({ model: 'TradingPolicy', parentModel: 'AlpacaAccount', relation: 'tradingPolicy', operations: [op] })), op).toBe(
        'nested_write_not_user_writable'
      );
    }
  });

  it('counts a nested model as written unless the container only connects over a parent-side key', () => {
    const connect = { operations: ['connect'], connectIds: ['f1'] };
    expect(writesNestedModelRows(nw({ model: 'Fund', parentModel: 'Mandate', relation: 'fund', ...connect }), RELATIONS)).toBe(false);
    expect(writesNestedModelRows(nw({ model: 'Fund', parentModel: 'Organization', relation: 'funds', ...connect }), RELATIONS)).toBe(true);
    expect(
      writesNestedModelRows(nw({ model: 'AlpacaAccount', parentModel: 'User', relation: 'alpacaAccounts', ...connect }), RELATIONS)
    ).toBe(true);
    expect(writesNestedModelRows(nw({ model: 'TradingPolicy', parentModel: 'AlpacaAccount', relation: 'tradingPolicy' }), RELATIONS)).toBe(
      true
    );
  });

  it('reports an entitlement refusal ahead of any other', () => {
    expect(
      firstNestedRefusal(
        [
          nw({ model: 'User', parentModel: 'AlpacaAccount', relation: 'user' }),
          nw({ model: 'OrgMembership', parentModel: 'User', relation: 'orgMemberships', operations: ['create'] }),
        ],
        me,
        RELATIONS
      )
    ).toBe('nested_entitlement_write');
    expect(firstNestedRefusal([], me, RELATIONS)).toBeNull();
  });
});

describe('userContentRefusal', () => {
  const me = '11111111-1111-4111-8111-111111111111';
  const models = new Set(['User', 'AuditLog', 'Configuration']);
  const t = (field: string): MutationTarget => classifyMutationField(field, models);

  it('lets a user set only their profile and onboarding fields', () => {
    expect(userContentRefusal(t('updateOneUser'), { data: { name: { set: 'n' }, bio: { set: 'b' } } }, me)).toBeNull();
    for (const field of ['role', 'email', 'id', 'openaiAPIKey', 'customerId', 'alpacaAccounts', 'fundAssignments']) {
      expect(userContentRefusal(t('updateOneUser'), { data: { [field]: { set: 'x' } } }, me), field).toBe(
        'field_not_user_writable'
      );
    }
  });

  it('refuses an audit row claiming the guard\'s source or another author', () => {
    expect(userContentRefusal(t('createOneAuditLog'), { data: { metadata: { source: 'mutation-auth-guard' } } }, me)).toBe(
      'reserved_audit_source'
    );
    expect(userContentRefusal(t('createOneAuditLog'), { data: { userId: 'someone-else' } }, me)).toBe('audit_actor_mismatch');
    expect(userContentRefusal(t('createOneAuditLog'), { data: { userId: me, metadata: { source: 'platform' } } }, me)).toBeNull();
  });

  it('confines a configuration upsert to the caller\'s own platform preference key', () => {
    const own = `platform.web.chart-preferences.user.${me}`;
    expect(
      userContentRefusal(t('upsertOneConfiguration'), { where: { configKey: own }, create: { configKey: own }, update: {} }, me)
    ).toBeNull();
    for (const key of ['llm.alias.routing', `platform.web.chart-preferences.user.22222222-2222-4222-8222-222222222222`]) {
      expect(userContentRefusal(t('upsertOneConfiguration'), { where: { configKey: key }, create: { configKey: key } }, me), key).toBe(
        'config_key_not_user_scoped'
      );
    }
    expect(
      userContentRefusal(t('upsertOneConfiguration'), { where: { configKey: own }, create: { configKey: 'llm.alias.routing' } }, me)
    ).toBe('config_key_not_user_scoped');
    expect(userContentRefusal(t('upsertOneConfiguration'), { where: { id: 'c1' } }, me)).toBe('config_key_not_user_scoped');
  });
});

describe('nested-write inspection', () => {
  it('recognises generated nested containers and attributes them to the longest model', () => {
    expect(nestedContainerModel('TradingPolicyUpdateOneWithoutAlpacaAccountNestedInput', LONGEST_FIRST)).toBe(
      'TradingPolicy'
    );
    expect(nestedContainerModel('AlpacaAccountCreateNestedManyWithoutUserInput', LONGEST_FIRST)).toBe(
      'AlpacaAccount'
    );
    expect(nestedContainerModel('AccountLinkingRequestUpdateManyWithoutUserNestedInput', LONGEST_FIRST)).toBe(
      'AccountLinkingRequest'
    );
    expect(nestedContainerModel('TradingPolicyUpdateInput', LONGEST_FIRST)).toBeUndefined();
    expect(nestedContainerModel('TradingPolicyWhereUniqueInput', LONGEST_FIRST)).toBeUndefined();
  });

  it('walks by input type, collecting operations and connect ids at every depth', () => {
    const connectType = new GraphQLInputObjectType({ name: 'UserWhereUniqueInput', fields: { id: { type: GraphQLString } } });
    const nestedAccount: GraphQLInputObjectType = new GraphQLInputObjectType({
      name: 'AlpacaAccountUpdateManyWithoutUserNestedInput',
      fields: { connect: { type: new GraphQLList(connectType) }, label: { type: GraphQLString } },
    });
    const data = new GraphQLInputObjectType({
      name: 'UserUpdateInput',
      fields: { alpacaAccounts: { type: nestedAccount }, note: { type: GraphQLString } },
    });
    const mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: { updateOneUser: { type: GraphQLString, args: { data: { type: data } } } },
    });
    const found = findNestedWrites(
      { parentType: mutation, fieldName: 'updateOneUser' },
      { data: { note: 'update', alpacaAccounts: { connect: [{ id: 'a1' }, { id: 'a2' }] } } },
      LONGEST_FIRST,
      { model: 'User', action: 'update' }
    );
    expect(found).toEqual([
      {
        model: 'AlpacaAccount',
        operations: ['connect'],
        path: 'data.alpacaAccounts',
        connectIds: ['a1', 'a2'],
        parentModel: 'User',
        relation: 'alpacaAccounts',
        parentMode: 'update',
        depth: 1,
        parentRowWhere: null,
      },
    ]);
  });

  it('records each container\'s own parent model, mode, depth and parent-row selector', () => {
    const accountWhereUnique = new GraphQLInputObjectType({ name: 'AlpacaAccountWhereUniqueInput', fields: { id: { type: GraphQLString } } });
    const flag = new GraphQLInputObjectType({ name: 'BoolFieldUpdateOperationsInput', fields: { set: { type: GraphQLString } } });
    const policyData = new GraphQLInputObjectType({ name: 'TradingPolicyUpdateWithoutAlpacaAccountInput', fields: { realtimeTradingEnabled: { type: flag } } });
    const policyToOne = new GraphQLInputObjectType({ name: 'TradingPolicyUpdateToOneWithWhereWithoutAlpacaAccountInput', fields: { data: { type: policyData } } });
    const policyNested = new GraphQLInputObjectType({ name: 'TradingPolicyUpdateOneWithoutAlpacaAccountNestedInput', fields: { update: { type: policyToOne } } });
    const accountData = new GraphQLInputObjectType({ name: 'AlpacaAccountUpdateWithoutUserInput', fields: { tradingPolicy: { type: policyNested } } });
    const accountCreate = new GraphQLInputObjectType({ name: 'AlpacaAccountCreateWithoutUserInput', fields: { tradingPolicy: { type: policyNested } } });
    const accountEntry = new GraphQLInputObjectType({
      name: 'AlpacaAccountUpdateWithWhereUniqueWithoutUserInput',
      fields: { where: { type: accountWhereUnique }, data: { type: accountData } },
    });
    const accounts = new GraphQLInputObjectType({
      name: 'AlpacaAccountUpdateManyWithoutUserNestedInput',
      fields: { update: { type: new GraphQLList(accountEntry) }, create: { type: new GraphQLList(accountCreate) } },
    });
    const userData = new GraphQLInputObjectType({ name: 'UserUpdateInput', fields: { alpacaAccounts: { type: accounts } } });
    const userWhere = new GraphQLInputObjectType({ name: 'UserWhereUniqueInput', fields: { id: { type: GraphQLString } } });
    const mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: { updateOneUser: { type: GraphQLString, args: { where: { type: userWhere }, data: { type: userData } } } },
    });
    const flip = { update: { data: { realtimeTradingEnabled: { set: true } } } };
    const found = findNestedWrites(
      { parentType: mutation, fieldName: 'updateOneUser' },
      {
        where: { id: 'u-1' },
        data: { alpacaAccounts: { update: [{ where: { id: 'a3' }, data: { tradingPolicy: flip } }], create: [{ tradingPolicy: flip }] } },
      },
      LONGEST_FIRST,
      { model: 'User', action: 'update' }
    );
    expect(found.map((f) => [f.model, f.parentModel, f.relation, f.parentMode, f.depth, f.parentRowWhere, f.path])).toEqual([
      ['AlpacaAccount', 'User', 'alpacaAccounts', 'update', 1, { id: 'u-1' }, 'data.alpacaAccounts'],
      ['TradingPolicy', 'AlpacaAccount', 'tradingPolicy', 'update', 2, { id: 'a3' }, 'data.alpacaAccounts.update[0].data.tradingPolicy'],
      ['TradingPolicy', 'AlpacaAccount', 'tradingPolicy', 'create', 2, null, 'data.alpacaAccounts.create[0].tradingPolicy'],
    ]);
  });
});

describe('credential redaction', () => {
  it('replaces every credential-named value and keeps everything else', () => {
    const out = redactCredentials({
      APIKey: 'k',
      nested: [{ APISecret: { set: 's' }, refresh_token: 't', keep: 1 }],
      apiKey: null,
    });
    expect(out).toEqual({ APIKey: REDACTED, nested: [{ APISecret: REDACTED, refresh_token: REDACTED, keep: 1 }], apiKey: null });
  });
});

describe('audit helpers', () => {
  it('strips control characters and bounds header values', () => {
    expect(sanitizeHeader('arm\r\nLIVE\u0000now', 100)).toBe('arm LIVE now');
    expect(sanitizeHeader('x'.repeat(10), 4)).toBe('xxxx…');
    expect(sanitizeHeader(undefined, 10)).toBeNull();
    expect(sanitizeHeader('   ', 10)).toBeNull();
  });

  it('treats a write as disarm-only only when every switch it sets moves to its safe value', () => {
    const t = classifyMutationField('updateOneTradingPolicy', new Set(['TradingPolicy']));
    const where = { id: 'p1' };
    expect(isDisarmOnlyPolicyWrite(t, { where, data: { realtimeTradingEnabled: { set: false } } })).toBe(true);
    expect(
      isDisarmOnlyPolicyWrite(t, { where, data: { id: { set: 'p1' }, killSwitchEnabled: { set: true }, lastModifiedBy: { set: 'e' } } })
    ).toBe(true);
    expect(isDisarmOnlyPolicyWrite(t, { where, data: { realtimeTradingEnabled: { set: true } } })).toBe(false);
    expect(isDisarmOnlyPolicyWrite(t, { where, data: { killSwitchEnabled: { set: true }, maxLeverage: { set: 4 } } })).toBe(false);
    expect(isDisarmOnlyPolicyWrite(t, { where, data: { lastModifiedBy: { set: 'e' } } })).toBe(false);
    expect(isDisarmOnlyPolicyWrite(t, { where, data: { id: { set: 'p2' }, killSwitchEnabled: { set: true } } })).toBe(false);
    const upsert = classifyMutationField('upsertOneTradingPolicy', new Set(['TradingPolicy']));
    expect(isDisarmOnlyPolicyWrite(upsert, { where, update: { killSwitchEnabled: { set: true } } })).toBe(false);
  });

  it('treats an unidentified account as possibly LIVE', () => {
    const row = { nestedPath: null, policyId: null, alpacaAccountId: null, accountType: null, before: null };
    expect(mayTouchLiveAccount([{ ...row, resolution: 'unresolved' }])).toBe(true);
    expect(mayTouchLiveAccount([{ ...row, resolution: 'resolved', accountType: 'PAPER' }])).toBe(false);
    expect(mayTouchLiveAccount([{ ...row, resolution: 'resolved', accountType: 'LIVE' }])).toBe(true);
  });

  it('attributes a WebSocket operation from its upgrade request and connection params', () => {
    const req = wsActorRequest(
      { request: { headers: { 'user-agent': 'ws-client', origin: 'https://os.adaptic.ai' }, socket: { remoteAddress: '198.51.100.9' } } },
      { 'X-Adaptic-Change-Reason': 'disarm for maintenance' }
    );
    expect(req).toEqual({
      ip: '198.51.100.9',
      headers: {
        'user-agent': 'ws-client',
        origin: 'https://os.adaptic.ai',
        'x-adaptic-change-reason': 'disarm for maintenance',
      },
    });
    expect(wsActorRequest(undefined, undefined)).toEqual({ ip: undefined, headers: { 'x-adaptic-change-reason': undefined } });
  });

  it('detects a trading-switch change at any depth', () => {
    expect(touchesTradingSwitch({ data: { tradingPolicy: { update: { data: { killSwitchEnabled: { set: true } } } } } })).toBe(true);
    expect(touchesTradingSwitch({ data: { maxLeverage: { set: 2 } } })).toBe(false);
  });
});
