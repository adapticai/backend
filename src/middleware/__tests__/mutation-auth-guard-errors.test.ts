/**
 * The guard's behaviour when it cannot evaluate a mutation at all.
 *
 * A guard that throws on an unexpected input must not turn every write into
 * an outage while it is only observing, and must not wave a write through
 * while anything is being enforced. Exercised on a plain graphql-js schema
 * (no decorators needed), with the escalation-list provider as the failure
 * point because it is read inside the evaluation.
 */
import { describe, expect, it } from 'vitest';
import { buildSchema, graphql } from 'graphql';

import { installMutationAuthGuard, mutationAuthorizationTotal } from '../mutation-auth-guard';

const SDL = `
  type Query { ok: Boolean }
  type Mutation { updateOneTrade(id: String): String }
`;

async function run(mode: 'shadow' | 'enforce', failuresBeforeRecovery: number): Promise<{
  data: unknown;
  codes: string[];
  writes: number;
}> {
  const schema = buildSchema(SDL);
  let writes = 0;
  const field = schema.getMutationType()?.getFields().updateOneTrade;
  if (!field) throw new Error('fixture schema has no mutation');
  field.resolve = () => {
    writes += 1;
    return 'written';
  };
  let calls = 0;
  installMutationAuthGuard(schema, {
    models: ['Trade'],
    modeProvider: () => mode,
    enforcedModelsProvider: () => {
      calls += 1;
      if (calls <= failuresBeforeRecovery) throw new Error('escalation list unreadable');
      return new Set<string>();
    },
  });
  const result = await graphql({
    schema,
    source: 'mutation { updateOneTrade(id: "t1") }',
    contextValue: { principal: { kind: 'server' } },
  });
  return {
    data: result.data,
    codes: (result.errors ?? []).map((e) => String(e.extensions?.code)),
    writes,
  };
}

async function guardErrorCount(decision: string): Promise<number> {
  const metric = await mutationAuthorizationTotal.get();
  return metric.values
    .filter((v) => v.labels.reason === 'guard_error' && v.labels.decision === decision)
    .reduce((sum, v) => sum + v.value, 0);
}

describe('mutation guard internal failure', () => {
  it('lets the write through in pure shadow, counted as a guard error', async () => {
    const before = await guardErrorCount('allowed');
    const r = await run('shadow', 1);
    expect(r.codes).toEqual([]);
    expect(r.writes).toBe(1);
    expect(await guardErrorCount('allowed')).toBe(before + 1);
  });

  it('refuses in shadow when the escalation list itself cannot be read', async () => {
    const r = await run('shadow', Number.POSITIVE_INFINITY);
    expect(r.codes).toEqual(['MUTATION_AUTH_UNAVAILABLE']);
    expect(r.writes).toBe(0);
  });

  it('refuses under enforce, even for a service principal', async () => {
    const before = await guardErrorCount('denied');
    const r = await run('enforce', 1);
    expect(r.codes).toEqual(['MUTATION_AUTH_UNAVAILABLE']);
    expect(r.writes).toBe(0);
    expect(await guardErrorCount('denied')).toBe(before + 1);
  });

  it('control: the same schema writes normally when nothing fails', async () => {
    const r = await run('enforce', 0);
    expect(r.codes).toEqual([]);
    expect(r.writes).toBe(1);
  });
});
