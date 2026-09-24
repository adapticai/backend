/**
 * The mutation authorization guard, against the real generated schema.
 *
 * The schema-level cases run through `mutation-auth-guard.harness.ts`: the
 * GENERATED TradingPolicy, AlpacaAccount and User resolvers — the types the
 * production `/graphql` endpoint serves — with the guard installed the way
 * `server.ts` installs it, served by a real ApolloServer carrying the
 * production HTTP-status plugin. The harness runs under ts-node because the
 * generated resolvers need `emitDecoratorMetadata`, which vitest's esbuild
 * transform does not emit.
 *
 * Every refusal is paired with an allowed CONTROL on the same mutation that
 * must reach the resolver: "no write happened" means nothing unless the same
 * harness demonstrably writes when access is allowed.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

const API_KEY = 'PKMUTATIONGUARDKEY00000000';
const API_SECRET = 'mutation-guard-secret-value-that-must-never-leak';

interface AuditRow {
  userId: string | null;
  recordId: string;
  ipAddress: string | null;
  changedFields: { nestedPath: string | null; requested: Record<string, unknown> };
  metadata: {
    phase: string;
    outcome: string;
    decision: string;
    authorizationReason: string;
    changeReason: string | null;
    attemptId?: string | null;
    tradingSwitchTouched: boolean;
    actor: { principalKind: string; sub: string | null; ip: string | null; userAgent: string | null };
    accounts: Array<{ alpacaAccountId: string; accountType: string; before: Record<string, unknown> | null }>;
  };
}

interface ScenarioResult {
  status: number;
  codes: string[];
  reasons: string[];
  json: string;
  writes: string[];
  audit: AuditRow[];
  counterDelta: Record<string, number>;
  auditFailureDelta: number;
}

let results: Record<string, ScenarioResult>;
let guardedMutations: number;
let mutationFieldCount: number;

function scenario(name: string): ScenarioResult {
  const r = results[name];
  if (!r) throw new Error(`harness produced no result for scenario "${name}"`);
  return r;
}

beforeAll(() => {
  const root = path.resolve(__dirname, '../../..');
  const stdout = execFileSync(
    path.join(root, 'node_modules/.bin/ts-node'),
    ['--transpile-only', 'src/middleware/__tests__/mutation-auth-guard.harness.ts'],
    {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, LOG_LEVEL: 'error' },
      maxBuffer: 64 * 1024 * 1024,
    }
  );
  const match = /<<<RESULTS>>>(.*)<<<END>>>/s.exec(stdout);
  if (!match) throw new Error(`harness printed no results:\n${stdout.slice(-2000)}`);
  const parsed = JSON.parse(match[1]) as {
    guardedMutations: number;
    mutationFieldCount: number;
    results: Record<string, ScenarioResult>;
  };
  results = parsed.results;
  guardedMutations = parsed.guardedMutations;
  mutationFieldCount = parsed.mutationFieldCount;
}, 180_000);

describe('installation', () => {
  it('guards every root Mutation field the schema exposes, derived from the schema itself', () => {
    expect(mutationFieldCount).toBeGreaterThan(20);
    expect(guardedMutations).toBe(mutationFieldCount);
  });

  it('decides each mutation exactly once even when installed twice', () => {
    const counted = Object.values(scenario('flip/server/enforce').counterDelta).reduce((a, b) => a + b, 0);
    expect(counted).toBe(1);
  });
});

describe('anonymous mutations', () => {
  it('are refused with HTTP 401 UNAUTHENTICATED at enforce, before the resolver writes', () => {
    const r = scenario('flip/none/enforce');
    expect(r.status).toBe(401);
    expect(r.codes).toEqual(['UNAUTHENTICATED']);
    expect(r.writes).toEqual([]);
    expect(r.counterDelta).toEqual({ 'updateOneTradingPolicy|none|denied|unauthenticated': 1 });
  });

  it('are admitted but counted as would-deny in shadow (the default first-deploy mode)', () => {
    const r = scenario('flip/none/shadow');
    expect(r.status).toBe(200);
    expect(r.codes).toEqual([]);
    expect(r.writes).toEqual(['tradingPolicy.update']);
    expect(r.counterDelta).toEqual({ 'updateOneTradingPolicy|none|would_deny|unauthenticated': 1 });
  });

  it('are refused in shadow when their model is escalated, and only then', () => {
    expect(scenario('flip/none/shadow+escalated').codes).toEqual(['UNAUTHENTICATED']);
    expect(scenario('flip/none/shadow+escalated').writes).toEqual([]);
    expect(scenario('flip/none/shadow+other-escalated').writes).toEqual(['tradingPolicy.update']);
  });

  it('pass untouched when the guard is off, still counted and still audited', () => {
    const r = scenario('flip/none/off');
    expect(r.writes).toEqual(['tradingPolicy.update']);
    expect(r.counterDelta).toEqual({ 'updateOneTradingPolicy|none|allowed|guard_off': 1 });
    expect(r.audit.map((a) => a.metadata.phase)).toEqual(['attempt', 'result']);
  });
});

describe('verified principals', () => {
  it('admit the engine service principal (control for every refusal)', () => {
    for (const name of ['flip/server/enforce', 'flip/staticServer/enforce', 'flip/admin/enforce']) {
      const r = scenario(name);
      expect(r.codes, name).toEqual([]);
      expect(r.writes, name).toEqual(['tradingPolicy.update']);
    }
    expect(scenario('bulk/server/enforce').writes).toEqual(['tradingPolicy.updateMany']);
  });

  it('admit a user on their own account and on a fund-entitled account', () => {
    expect(scenario('flip/owner/enforce').writes).toEqual(['tradingPolicy.update']);
    expect(scenario('flip/owner/enforce').counterDelta).toEqual({
      'updateOneTradingPolicy|user|allowed|account_owner': 1,
    });
    expect(scenario('flipFund/fundUser/enforce').writes).toEqual(['tradingPolicy.update']);
    expect(scenario('flipFund/fundUser/enforce').counterDelta).toEqual({
      'updateOneTradingPolicy|user|allowed|account_fund_entitled': 1,
    });
  });

  it('refuse a cross-account user with HTTP 403 and no write', () => {
    for (const name of ['flip/stranger/enforce', 'flipFund/stranger/enforce']) {
      const r = scenario(name);
      expect(r.status, name).toBe(403);
      expect(r.codes, name).toEqual(['FORBIDDEN']);
      expect(r.reasons, name).toEqual(['not_account_owner']);
      expect(r.writes, name).toEqual([]);
    }
    expect(scenario('flip/stranger/shadow').counterDelta).toEqual({
      'updateOneTradingPolicy|user|would_deny|not_account_owner': 1,
    });
  });

  it('confine a user to their own User row', () => {
    expect(scenario('self/owner/enforce').writes).toEqual(['user.update']);
    expect(scenario('self/stranger/enforce').reasons).toEqual(['not_self']);
    expect(scenario('self/stranger/enforce').writes).toEqual([]);
  });

  it('refuse bulk and delete actions to a user even on their own account', () => {
    expect(scenario('bulk/owner/enforce').reasons).toEqual(['bulk_not_user_writable']);
    expect(scenario('bulk/owner/enforce').writes).toEqual([]);
    expect(scenario('delete/owner/enforce').reasons).toEqual(['action_not_user_writable']);
    expect(scenario('delete/owner/enforce').writes).toEqual([]);
  });
});

describe('batched, aliased and nested mutations', () => {
  it('decide every aliased root field on its own', () => {
    const none = scenario('aliased/none/enforce');
    expect(none.codes).toEqual(['UNAUTHENTICATED', 'UNAUTHENTICATED']);
    expect(none.writes).toEqual([]);

    const owner = scenario('aliased/owner/enforce');
    expect(owner.writes).toEqual(['tradingPolicy.update']);
    expect(owner.reasons).toEqual(['not_account_owner']);
    const data = (JSON.parse(owner.json) as { data: { a: unknown; b: unknown } }).data;
    expect(data.a).not.toBeNull();
    expect(data.b).toBeNull();
  });

  it('guard a TradingPolicy write nested under another model', () => {
    expect(scenario('nested/none/enforce').codes).toEqual(['UNAUTHENTICATED']);
    expect(scenario('nested/none/enforce').writes).toEqual([]);
    expect(scenario('nested/stranger/enforce').reasons).toEqual(['not_account_owner']);
    expect(scenario('nested/owner/enforce').writes).toEqual(['alpacaAccount.update']);
  });

  it('refuse re-pointing another user\'s account onto the caller', () => {
    const r = scenario('steal/stranger/enforce');
    expect(r.reasons).toEqual(['nested_write_not_user_writable']);
    expect(r.writes).toEqual([]);
  });

  it('let a user create an account connected to themselves, but not to someone else', () => {
    expect(scenario('createKeys/owner/enforce').writes).toEqual(['alpacaAccount.create']);
    expect(scenario('createKeys/stranger/enforce').reasons).toEqual(['nested_write_not_user_writable']);
    expect(scenario('createKeys/stranger/enforce').writes).toEqual([]);
  });
});

describe('error bodies', () => {
  it('carry no argument value — a refused credential write never echoes the key', () => {
    for (const name of ['createKeys/none/enforce', 'createKeys/stranger/enforce']) {
      const r = scenario(name);
      expect(r.codes.length, name).toBe(1);
      expect(r.json, name).not.toContain(API_KEY);
      expect(r.json, name).not.toContain(API_SECRET);
    }
  });
});

describe('TradingPolicy audit trail', () => {
  it('attributes an allowed LIVE-flag write: actor, stated reason, before-state, linked result', () => {
    const [attempt, result] = scenario('flip/server/enforce').audit;
    expect(attempt.metadata).toMatchObject({
      phase: 'attempt',
      outcome: 'pending',
      decision: 'allowed',
      authorizationReason: 'service_principal',
      changeReason: 'harness: arm LIVE',
      tradingSwitchTouched: true,
      actor: {
        principalKind: 'server',
        sub: 'adaptic-engine:host-1:42',
        ip: '203.0.113.7',
        userAgent: 'mutation-guard-harness',
      },
    });
    expect(attempt.metadata.accounts).toEqual([
      {
        policyId: 'p1',
        alpacaAccountId: 'a1',
        accountType: 'LIVE',
        before: {
          realtimeTradingEnabled: false,
          paperTradingOnly: false,
          killSwitchEnabled: false,
          autonomyMode: 'ADVISORY_ONLY',
        },
      },
    ]);
    expect(attempt.recordId).toBe('p1');
    expect(result.metadata).toMatchObject({ phase: 'result', outcome: 'succeeded', attemptId: 'audit-1' });
  });

  it('records the user id of a user principal', () => {
    const [attempt] = scenario('flip/owner/enforce').audit;
    expect(attempt.userId).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('records a refused attempt — the anonymous LIVE flip is attributable to its source', () => {
    const rows = scenario('flip/none/enforce').audit;
    expect(rows).toHaveLength(1);
    expect(rows[0].metadata).toMatchObject({
      phase: 'attempt',
      outcome: 'denied',
      decision: 'denied',
      authorizationReason: 'unauthenticated',
      actor: { principalKind: 'none', ip: '203.0.113.7', userAgent: 'mutation-guard-harness' },
    });
  });

  it('records a shadow would-deny write that went through', () => {
    const rows = scenario('flip/none/shadow').audit;
    expect(rows.map((r) => `${r.metadata.phase}:${r.metadata.outcome}:${r.metadata.decision}`)).toEqual([
      'attempt:pending:would_deny',
      'result:succeeded:would_deny',
    ]);
  });

  it('audits a nested TradingPolicy write with its argument path', () => {
    const [attempt] = scenario('nested/owner/enforce').audit;
    expect(attempt.changedFields.nestedPath).toBe('data.tradingPolicy');
    expect(attempt.metadata.accounts.map((a) => a.alpacaAccountId)).toEqual(['a1']);
    expect(scenario('nested/none/enforce').audit[0].metadata.outcome).toBe('denied');
  });

  it('writes one attempt row per aliased field', () => {
    expect(scenario('aliased/none/enforce').audit).toHaveLength(2);
  });

  it('refuses an enforced write it cannot attribute, and counts the failure', () => {
    const r = scenario('auditDown/server/enforce');
    expect(r.status).toBe(503);
    expect(r.codes).toEqual(['AUDIT_UNAVAILABLE']);
    expect(r.writes).toEqual([]);
    expect(r.auditFailureDelta).toBe(1);
  });

  it('lets a shadow write proceed when the audit table is down, and counts both lost rows', () => {
    const r = scenario('auditDown/server/shadow');
    expect(r.writes).toEqual(['tradingPolicy.update']);
    expect(r.auditFailureDelta).toBe(2);
  });

  it('does not write guard audit rows for models other than TradingPolicy', () => {
    expect(scenario('self/owner/enforce').audit).toEqual([]);
  });
});
