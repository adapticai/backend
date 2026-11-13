import { describe, it, expect } from 'vitest';
import { GraphQLError, type GraphQLResolveInfo } from 'graphql';
import type { ResolverData } from 'type-graphql';

import {
  classifyMutationField,
  effectiveModeFor,
  evaluateMutationAccess,
  type MutationAuthMode,
} from '../mutation-authorization';
import {
  buildScopeWhere,
  buildWriteScopeWhere,
  DESK_MODELS,
  evaluateAccess,
  type Entitlement,
} from '../tenancy-scope';
import type { BackendPrincipal } from '../token-verifier';
import { userContentRefusal } from '../user-write-content';
import { assertServicePrincipal } from '../../resolvers/custom/totp-principal';
import {
  createTenancyScopingMiddleware,
  type TenancyScopingContext,
} from '../../middleware/tenancy-scoping';

const ME = '11111111-1111-4111-8111-111111111111';
const OTHER = '22222222-2222-4222-8222-222222222222';
const FUND = '33333333-3333-4333-8333-333333333333';
const ORG = '44444444-4444-4444-8444-444444444444';

const USER: BackendPrincipal = { kind: 'user', sub: ME, roles: [] };
const ADMIN: BackendPrincipal = { kind: 'admin', sub: ME, roles: ['admin'] };
const SERVER: BackendPrincipal = { kind: 'server' };

const MODELS = new Set<string>([...DESK_MODELS, 'Configuration', 'User']);
const target = (field: string): ReturnType<typeof classifyMutationField> =>
  classifyMutationField(field, MODELS);
const ENT: Entitlement = { userId: ME, orgIds: [ORG], fundIds: [FUND] };

/** The plural (list) query of each desk model, as the generator names it. */
const LIST_QUERY: Record<(typeof DESK_MODELS)[number], string> = {
  Follow: 'follows',
  AutoFollowRule: 'autoFollowRules',
  PushSubscription: 'pushSubscriptions',
  AdaConversation: 'adaConversations',
  AdaMessage: 'adaMessages',
  UserTotp: 'userTotps',
  DeskDecision: 'deskDecisions',
  FeatureFlagOverride: 'featureFlagOverrides',
};

describe('desk mutations are enforced whatever MUTATION_AUTH_MODE says', () => {
  const modes: MutationAuthMode[] = ['shadow', 'off', 'enforce'];
  it.each([
    'UserTotp',
    'PushSubscription',
    'FeatureFlagOverride',
    'Follow',
    'custom:verifyUserTotp',
  ])('%s is decided at enforce in every mode', (model) => {
    for (const mode of modes)
      expect(effectiveModeFor([model], mode, new Set())).toBe('enforce');
  });

  it('a desk model reached by a nested write enforces the whole mutation', () => {
    expect(effectiveModeFor(['User', 'UserTotp'], 'shadow', new Set())).toBe(
      'enforce'
    );
  });

  it('leaves the staged models in the configured mode', () => {
    expect(effectiveModeFor(['Alert'], 'shadow', new Set())).toBe('shadow');
    expect(effectiveModeFor(['Alert'], 'off', new Set())).toBe('off');
  });
});

describe('UserTotp writes are service-principal only', () => {
  it.each([
    'updateOneUserTotp',
    'deleteOneUserTotp',
    'createOneUserTotp',
    'upsertOneUserTotp',
  ])(
    '%s: user and admin are refused, the service principal is admitted',
    (field) => {
      expect(evaluateMutationAccess(USER, target(field))).toMatchObject({
        allowed: false,
        reason: 'service_principal_only',
      });
      expect(evaluateMutationAccess(ADMIN, target(field))).toMatchObject({
        allowed: false,
        reason: 'service_principal_only',
      });
      expect(evaluateMutationAccess(SERVER, target(field))).toMatchObject({
        allowed: true,
      });
    }
  );

  it('an admin cannot reach UserTotp through a nested write on another root', () => {
    expect(
      evaluateMutationAccess(ADMIN, target('updateOneUser'), {
        nestedModels: ['UserTotp'],
      })
    ).toMatchObject({
      allowed: false,
      reason: 'service_principal_only',
    });
  });

  it('the TOTP custom mutations refuse user and admin', () => {
    for (const field of [
      'enrollUserTotp',
      'confirmUserTotp',
      'verifyUserTotp',
      'disableUserTotp',
    ]) {
      expect(evaluateMutationAccess(ADMIN, target(field)).allowed).toBe(false);
      expect(evaluateMutationAccess(USER, target(field)).allowed).toBe(false);
      expect(evaluateMutationAccess(SERVER, target(field)).allowed).toBe(true);
    }
  });

  it('FeatureFlagOverride and PushSubscription refuse an unauthenticated writer', () => {
    for (const field of [
      'createOneFeatureFlagOverride',
      'updateOnePushSubscription',
    ]) {
      expect(evaluateMutationAccess(null, target(field))).toMatchObject({
        allowed: false,
        reason: 'unauthenticated',
      });
    }
    expect(
      evaluateMutationAccess(USER, target('createOneFeatureFlagOverride'))
    ).toMatchObject({
      allowed: false,
      reason: 'model_not_user_writable',
    });
  });
});

describe('desk row scope', () => {
  it('user-owned models scope to the caller, fund-owned to the fund tenant', () => {
    for (const model of ['Follow', 'PushSubscription', 'UserTotp'] as const) {
      expect(buildScopeWhere(model, ENT)).toEqual({ userId: { equals: ME } });
    }
    for (const model of ['DeskDecision', 'AutoFollowRule'] as const) {
      expect(buildScopeWhere(model, ENT)).toEqual({ fundId: { in: [FUND] } });
    }
    expect(buildScopeWhere('FeatureFlagOverride', ENT)).toEqual({
      OR: [{ userId: { equals: ME } }, { organizationId: { in: [ORG] } }],
    });
  });

  it('a shared conversation is readable by the fund but writable only by its author', () => {
    expect(buildScopeWhere('AdaConversation', ENT)).toEqual({
      OR: [
        { userId: { equals: ME } },
        { sharedWithOrg: { equals: true }, fundId: { in: [FUND] } },
      ],
    });
    expect(buildWriteScopeWhere('AdaConversation', ENT)).toEqual({
      userId: { equals: ME },
    });
    expect(buildWriteScopeWhere('AdaMessage', ENT)).toEqual({
      conversation: { is: { userId: { equals: ME } } },
    });
  });

  it('a Follow upsert by natural key is admitted only when the create lands in scope', () => {
    const field = { model: 'Follow' as const, opKind: 'upsertScope' as const };
    const key = {
      userId_fundId_targetKind_targetId: {
        userId: ME,
        fundId: FUND,
        targetKind: 'asset',
        targetId: 'NVDA',
      },
    };
    const create = {
      user: { connect: { id: ME } },
      fund: { connect: { id: FUND } },
    };
    expect(evaluateAccess(field, { where: key, create }, ENT).decision).toBe(
      'allow'
    );
    expect(
      evaluateAccess(
        field,
        { where: key, create: { ...create, user: { connect: { id: OTHER } } } },
        ENT
      ).decision
    ).toBe('deny');
  });
});

/** Minimal resolver data for a root field. */
function rootCall(
  fieldName: string,
  parent: 'Query' | 'Mutation',
  args: Record<string, unknown>
): ResolverData<TenancyScopingContext> {
  return {
    root: {},
    args,
    context: {},
    info: {
      fieldName,
      parentType: { name: parent },
    } as unknown as GraphQLResolveInfo,
  };
}

describe('the tenancy middleware on the desk models', () => {
  it.each(Object.entries(LIST_QUERY))(
    '%s refuses an unauthenticated read in shadow and in off',
    async (_model, query) => {
      for (const mode of ['shadow', 'off'] as const) {
        const middleware = createTenancyScopingMiddleware({
          modeProvider: () => mode,
        });
        let ran = false;
        const call = middleware(rootCall(query, 'Query', {}), () => {
          ran = true;
          return Promise.resolve([]);
        });
        await expect(call).rejects.toBeInstanceOf(GraphQLError);
        await expect(call).rejects.toMatchObject({
          extensions: { code: 'UNAUTHENTICATED' },
        });
        expect(ran).toBe(false);
      }
    }
  );

  it('narrows a user read of Follow to their own rows in shadow mode', async () => {
    const middleware = createTenancyScopingMiddleware({
      modeProvider: () => 'shadow',
    });
    const data = rootCall('follows', 'Query', {
      where: { userId: { equals: OTHER } },
    });
    data.context.principal = USER;
    data.context.__tenancyEntitlement = Promise.resolve(ENT);
    await middleware(data, () => Promise.resolve([]));
    expect(data.args.where).toEqual({
      userId: { equals: OTHER },
      AND: [{ userId: { equals: ME } }],
    });
  });

  it('leaves a staged model unscoped for an unauthenticated read in shadow', async () => {
    const middleware = createTenancyScopingMiddleware({
      modeProvider: () => 'shadow',
    });
    let ran = false;
    await middleware(rootCall('funds', 'Query', {}), () => {
      ran = true;
      return Promise.resolve([]);
    });
    expect(ran).toBe(true);
  });
});

describe('desk preferences live in the per-user Configuration namespace', () => {
  const upsert = (key: string): Record<string, unknown> => ({
    where: { configKey: key },
    create: {
      configKey: key,
      configValue: { version: 1 },
      type: 'USER_PREFERENCE',
    },
    update: { configValue: { version: 1 } },
  });

  it('admits platform.web.desk-preferences.user.<own id> for that user', () => {
    const args = upsert(`platform.web.desk-preferences.user.${ME}`);
    expect(
      userContentRefusal(target('upsertOneConfiguration'), args, ME)
    ).toBeNull();
    expect(
      evaluateMutationAccess(USER, target('upsertOneConfiguration'), {
        contentRefusal: userContentRefusal(
          target('upsertOneConfiguration'),
          args,
          ME
        ),
      })
    ).toMatchObject({ allowed: true });
  });

  it("refuses another user's desk-preferences key", () => {
    const args = upsert(`platform.web.desk-preferences.user.${OTHER}`);
    expect(userContentRefusal(target('upsertOneConfiguration'), args, ME)).toBe(
      'config_key_not_user_scoped'
    );
    expect(
      evaluateMutationAccess(USER, target('upsertOneConfiguration'), {
        contentRefusal: userContentRefusal(
          target('upsertOneConfiguration'),
          args,
          ME
        ),
      })
    ).toMatchObject({ allowed: false, reason: 'config_key_not_user_scoped' });
  });
});

describe('the TOTP resolver checks the principal itself', () => {
  it('admits only the service principal, whatever the mutation guard decides', () => {
    expect(() => assertServicePrincipal(SERVER)).not.toThrow();
    for (const [principal, code] of [
      [USER, 'FORBIDDEN'],
      [ADMIN, 'FORBIDDEN'],
      [null, 'UNAUTHENTICATED'],
    ] as const) {
      let thrown: unknown;
      try {
        assertServicePrincipal(principal);
      } catch (error: unknown) {
        thrown = error;
      }
      expect(thrown).toBeInstanceOf(GraphQLError);
      expect((thrown as GraphQLError).extensions.code).toBe(code);
    }
  });
});
