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
  getEnforcedModels,
  getMutationAuthMode,
  isNestedWriteUserWritable,
  ruleFor,
  type MutationTarget,
} from '../mutation-authorization';
import { findNestedWrites, nestedContainerModel } from '../nested-write-inspector';
import { REDACTED, redactCredentials } from '../credential-redaction';
import type { BackendPrincipal } from '../token-verifier';
import { sanitizeHeader, touchesTradingSwitch } from '../../middleware/trading-policy-audit';

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
    expect(effectiveModeFor('TradingPolicy', 'shadow', escalated)).toBe('enforce');
    expect(effectiveModeFor('User', 'shadow', escalated)).toBe('shadow');
  });

  it('lets off win as a kill switch and enforce cover every model', () => {
    expect(effectiveModeFor('TradingPolicy', 'off', escalated)).toBe('off');
    expect(effectiveModeFor('User', 'enforce', new Set())).toBe('enforce');
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

  it('refuses a user whose payload carries a forbidden nested write', () => {
    expect(
      evaluateMutationAccess(USER, target('updateOneTradingPolicy'), {
        ownership: { kind: 'owner' },
        forbiddenNestedWrites: ['AlpacaAccount'],
      }).reason
    ).toBe('nested_write_not_user_writable');
  });

  it('confines self-policy writes to the caller', () => {
    expect(evaluateMutationAccess(USER, target('updateOneUser'), { targetsSelf: true }).allowed).toBe(true);
    expect(evaluateMutationAccess(USER, target('updateOneUser'), { targetsSelf: false }).reason).toBe('not_self');
    expect(evaluateMutationAccess(USER, target('createOneUser'), { targetsSelf: true }).reason).toBe(
      'action_not_user_writable'
    );
  });
});

describe('isNestedWriteUserWritable', () => {
  it('lets an owned root write its own related account or policy content', () => {
    expect(isNestedWriteUserWritable('AlpacaAccount', 'TradingPolicy', ['update'])).toBe(true);
    expect(isNestedWriteUserWritable('User', 'AlpacaAccount', ['create'])).toBe(true);
  });

  it('refuses re-pointing an owned model, and reaching one from an unowned root', () => {
    expect(isNestedWriteUserWritable('User', 'AlpacaAccount', ['connect'])).toBe(false);
    expect(isNestedWriteUserWritable('AlpacaAccount', 'TradingPolicy', ['connectOrCreate'])).toBe(false);
    expect(isNestedWriteUserWritable('AlpacaAccount', 'User', ['connect'])).toBe(false);
    expect(isNestedWriteUserWritable('Configuration', 'TradingPolicy', ['update'])).toBe(false);
    expect(isNestedWriteUserWritable('TradingPolicy', 'Trade', ['create'])).toBe(false);
  });

  it('admits a connect of the caller\'s own user row only', () => {
    expect(isNestedWriteUserWritable('AlpacaAccount', 'User', ['connect'], true)).toBe(true);
    expect(isNestedWriteUserWritable('AlpacaAccount', 'User', ['connect', 'update'], true)).toBe(false);
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
      LONGEST_FIRST
    );
    expect(found).toEqual([
      { model: 'AlpacaAccount', operations: ['connect'], path: 'data.alpacaAccounts', connectIds: ['a1', 'a2'] },
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

  it('detects a trading-switch change at any depth', () => {
    expect(touchesTradingSwitch({ data: { tradingPolicy: { update: { data: { killSwitchEnabled: { set: true } } } } } })).toBe(true);
    expect(touchesTradingSwitch({ data: { maxLeverage: { set: 2 } } })).toBe(false);
  });
});
