/**
 * The credential-field guard.
 *
 * The schema-level cases run through `credential-field-guard.harness.ts`: a
 * real TypeGraphQL schema built from the GENERATED AlpacaAccount and User
 * resolvers — the types the production `/graphql` endpoint serves — with the
 * guard installed the way `server.ts` installs it. That harness runs under
 * ts-node because the generated resolvers need `emitDecoratorMetadata`, which
 * vitest's esbuild transform does not emit.
 *
 * Every denial is paired with a service-principal CONTROL on the same query
 * that must return the value: "the secret did not appear" means nothing
 * unless the same harness demonstrably delivers it when access is allowed.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { buildSchema as buildSdlSchema } from 'graphql';

import {
  findCredentialArgumentReferences,
  getCredentialFieldGuardMode,
} from '../credential-field-guard';
import { runTsNodeHarness } from './ts-node-harness';

/** Wall-clock budget for the harness (it builds two generated models). */
const HARNESS_TIMEOUT_MS = 150_000;

/** Headroom so the harness's own timeout, not the hook's, reports a hang. */
const HOOK_TIMEOUT_MS = HARNESS_TIMEOUT_MS + 30_000;

const API_KEY = 'PKGUARDTESTKEYVALUE0000000';
const API_SECRET = 'guard-test-secret-value-that-must-never-leak';

interface ScenarioResult {
  codes: string[];
  json: string;
  resolverCalls: number;
  counterDelta: Record<string, number>;
}

let results: Record<string, ScenarioResult>;

function scenario(name: string): ScenarioResult {
  const r = results[name];
  if (!r) throw new Error(`harness produced no result for scenario "${name}"`);
  return r;
}

beforeAll(async () => {
  results = await runTsNodeHarness<Record<string, ScenarioResult>>(
    'src/middleware/__tests__/credential-field-guard.harness.ts',
    HARNESS_TIMEOUT_MS
  );
}, HOOK_TIMEOUT_MS);

describe('output surface', () => {
  it('returns the credential to a service principal (control)', () => {
    const r = scenario('output/server');
    expect(r.codes).toEqual([]);
    expect(r.json).toContain(API_SECRET);
    expect(r.json).toContain(API_KEY);
  });

  it.each(['output/none', 'output/user', 'output/admin', 'output/single-row-none'])(
    '%s: refused, and no part of the value leaves',
    (name) => {
      const r = scenario(name);
      expect(r.codes).toContain('FORBIDDEN');
      expect(r.json).not.toContain(API_SECRET);
      expect(r.json).not.toContain(API_KEY);
    }
  );

  it('leaves non-credential fields readable for an unauthenticated caller', () => {
    const r = scenario('output/non-credential-none');
    expect(r.codes).toEqual([]);
    expect(JSON.parse(r.json)).toEqual({
      data: { alpacaAccounts: [{ id: 'acct-1', type: 'LIVE' }] },
    });
  });

  it('refuses the value through the _max aggregate, which a server may read', () => {
    expect(scenario('aggregate-max/server').json).toContain(API_SECRET);
    const r = scenario('aggregate-max/none');
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.json).not.toContain(API_SECRET);
  });

  it('allows the _count aggregate, which returns no value', () => {
    expect(scenario('aggregate-count/none').codes).toEqual([]);
  });
});

describe('BrokerageAccount credential status', () => {
  it('answers whether credentials are stored without exposing them', () => {
    const r = scenario('brokerage/status-none');
    expect(r.codes).toEqual([]);
    expect(JSON.parse(r.json)).toEqual({
      data: {
        brokerageAccounts: [
          { id: 'ba-1', hasApiCredentials: true },
          { id: 'ba-2', hasApiCredentials: false },
          { id: 'ba-3', hasApiCredentials: false },
        ],
      },
    });
  });

  it('refuses the key itself to an unauthenticated caller', () => {
    const r = scenario('brokerage/key-none');
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.json).not.toContain(API_KEY);
  });

  it('returns the key to a service principal (control)', () => {
    expect(scenario('brokerage/key-server').json).toContain(API_KEY);
  });
});

describe('argument surface (filter / sort / group oracles)', () => {
  it.each([
    'arg/where-none',
    'arg/not-nested-none',
    'arg/orderBy-none',
    'arg/distinct-none',
    'arg/relation-filter-none',
    'arg/groupBy-none',
  ])('%s: refused before the resolver touches the database', (name) => {
    const r = scenario(name);
    expect(r.codes).toContain('FORBIDDEN');
    expect(r.resolverCalls).toBe(0);
    expect(r.json).not.toContain(API_KEY);
  });

  it('lets a service principal filter on a credential column (control)', () => {
    const r = scenario('arg/where-server');
    expect(r.codes).toEqual([]);
    expect(r.resolverCalls).toBe(1);
  });

  it('leaves a non-credential filter alone for an unauthenticated caller', () => {
    const r = scenario('arg/non-credential-filter-none');
    expect(r.codes).toEqual([]);
    expect(r.resolverCalls).toBe(1);
  });
});

describe('modes and accounting', () => {
  it('enforce counts each denial by surface, decision and principal', () => {
    expect(scenario('output/none').counterDelta).toMatchObject({
      'output|denied|none': expect.any(Number),
    });
    expect(scenario('arg/where-none').counterDelta).toEqual({ 'argument|denied|none': 1 });
  });

  it('counts a service principal read as allowed', () => {
    expect(scenario('output/server').counterDelta).toMatchObject({
      'output|allowed|server': expect.any(Number),
    });
  });

  it('shadow resolves unchanged and counts the would-deny', () => {
    const r = scenario('mode/shadow-none');
    expect(r.codes).toEqual([]);
    expect(r.json).toContain(API_SECRET);
    expect(r.counterDelta['output|would_deny|none']).toBeGreaterThan(0);
  });

  it('off is a no-op that records nothing', () => {
    const r = scenario('mode/off-none');
    expect(r.codes).toEqual([]);
    expect(r.json).toContain(API_SECRET);
    expect(r.counterDelta).toEqual({});
  });

  it.each([
    [undefined, 'enforce'],
    ['', 'enforce'],
    ['ENFORCE', 'enforce'],
    ['disabled', 'enforce'],
    [' Shadow ', 'shadow'],
    ['off', 'off'],
  ])('reads CREDENTIAL_FIELD_GUARD_MODE=%j as %s', (raw, expected) => {
    const saved = process.env.CREDENTIAL_FIELD_GUARD_MODE;
    if (raw === undefined) delete process.env.CREDENTIAL_FIELD_GUARD_MODE;
    else process.env.CREDENTIAL_FIELD_GUARD_MODE = raw;
    try {
      expect(getCredentialFieldGuardMode()).toBe(expected);
    } finally {
      if (saved === undefined) delete process.env.CREDENTIAL_FIELD_GUARD_MODE;
      else process.env.CREDENTIAL_FIELD_GUARD_MODE = saved;
    }
  });
});

describe('type-directed argument matching', () => {
  const sdl = buildSdlSchema(`
    input StringFilter { equals: String }
    input AccountWhereInput { access_token: StringFilter token: StringFilter }
    input AccountLinkingRequestWhereInput { verificationToken: StringFilter access_token: StringFilter }
    input InviteTokenWhereInput { token: StringFilter }
    input InviteTokenCreateInput { token: String }
    input PushSubscriptionWhereInput { token: StringFilter }
    type Query {
      accounts(where: AccountWhereInput): Int
      linking(where: AccountLinkingRequestWhereInput): Int
      invites(where: InviteTokenWhereInput): Int
      createInvite(data: InviteTokenCreateInput): Int
      pushes(where: PushSubscriptionWhereInput): Int
    }
  `);
  const queryType = sdl.getQueryType();
  if (!queryType) throw new Error('SDL fixture has no Query type');
  const refs = (fieldName: string, args: Record<string, unknown>): string[] =>
    findCredentialArgumentReferences({ parentType: queryType, fieldName }, args);

  it('flags a credential key inside its own model predicate type', () => {
    expect(refs('invites', { where: { token: { equals: 'x' } } })).toEqual([
      'InviteTokenWhereInput.token',
    ]);
  });

  it('does not flag the same key name on an unrelated model', () => {
    expect(refs('pushes', { where: { token: { equals: 'x' } } })).toEqual([]);
  });

  it('does not treat a write payload as a read predicate', () => {
    expect(refs('createInvite', { data: { token: 'x' } })).toEqual([]);
  });

  it('attributes a longer model name to that model, not its prefix', () => {
    expect(
      refs('linking', {
        where: { verificationToken: { equals: 'x' }, access_token: { equals: 'x' } },
      })
    ).toEqual(['AccountLinkingRequestWhereInput.verificationToken']);
    expect(refs('accounts', { where: { access_token: { equals: 'x' } } })).toEqual([
      'AccountWhereInput.access_token',
    ]);
  });
});
