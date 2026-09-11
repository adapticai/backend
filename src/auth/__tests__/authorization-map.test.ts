import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { Prisma } from '@prisma/client';

/**
 * Pins the CORTEX-P0-001 phase-2 authorization map (audit B01-backend-legacy-03).
 *
 * The map is what makes the shadow authChecker reachable at all — if it drifts
 * from the generated resolver surface (renamed actions, removed models) the
 * checker silently goes back to being inert and its metrics become
 * false-confidence zeros (audit B01-backend-legacy-07).
 *
 * The real `src/generated/typegraphql-prisma` module cannot be imported under
 * vitest: importing it executes every TypeGraphQL decorator, which requires
 * `emitDecoratorMetadata` that esbuild does not implement. It is therefore
 * mocked with a registry built programmatically from `Prisma.ModelName` —
 * one `<Model>CrudResolver` per model exposing `deleteOne<Model>` /
 * `deleteMany<Model>` prototype methods, mirroring codegen's naming. Drift
 * against the REAL generated surface is guarded at runtime: the builder
 * validates every action against the actual resolver prototypes and any miss
 * is surfaced in `summary.skippedActions`, logged at warn on boot, and
 * reported in the server's boot log (server.ts).
 */

vi.mock('../../generated/typegraphql-prisma', async () => {
  const { Prisma: PrismaNs } = await import('@prisma/client');
  const applyResolversEnhanceMap = vi.fn();
  const mod: Record<string, unknown> = { applyResolversEnhanceMap };
  for (const model of Object.values(PrismaNs.ModelName)) {
    class FakeCrudResolver {}
    const proto = FakeCrudResolver.prototype as unknown as Record<
      string,
      unknown
    >;
    proto[`deleteOne${model}`] = function deleteOne(): void {};
    proto[`deleteMany${model}`] = function deleteMany(): void {};
    // Read and non-delete mutation actions, named the way codegen names them:
    // one model's reads appear under several shapes, and the plural form is the
    // field a caller actually writes. The read tier derives its coverage by
    // EXCLUDING mutation prefixes, so the mock has to carry both kinds for that
    // exclusion to be worth asserting.
    const plural = `${model.charAt(0).toLowerCase()}${model.slice(1)}s`;
    const singular = `${model.charAt(0).toLowerCase()}${model.slice(1)}`;
    proto[plural] = function findMany(): void {};
    proto[singular] = function findUnique(): void {};
    proto[`findFirst${model}`] = function findFirst(): void {};
    proto[`findFirst${model}OrThrow`] = function findFirstOrThrow(): void {};
    proto[`aggregate${model}`] = function aggregate(): void {};
    proto[`groupBy${model}`] = function groupBy(): void {};
    proto[`createOne${model}`] = function createOne(): void {};
    proto[`updateOne${model}`] = function updateOne(): void {};
    proto[`upsertOne${model}`] = function upsertOne(): void {};
    mod[`${model}CrudResolver`] = FakeCrudResolver;
  }
  return mod;
});

import {
  buildCortexAuthorizationMap,
  applyCortexAuthorizationMap,
  IR_MODELS,
  TENANT_SCOPED_READ_MODELS,
} from '../authorization-map';
import * as generatedIndex from '../../generated/typegraphql-prisma';

describe('buildCortexAuthorizationMap', () => {
  it('gives all five IR models full (_all) coverage', () => {
    const { map, summary } = buildCortexAuthorizationMap();

    expect(IR_MODELS).toHaveLength(5);
    expect(summary.fullCoverageModels).toBe(5);
    for (const model of IR_MODELS) {
      const config = map[model];
      expect(config, `missing map entry for IR model ${model}`).toBeDefined();
      expect(config?._all).toBeDefined();
      expect(config?._all).toHaveLength(1);
    }
  });

  it('covers the delete mutations of every non-IR Prisma model, with zero convention drift', () => {
    const { summary } = buildCortexAuthorizationMap();
    const nonIrModelCount =
      Object.values(Prisma.ModelName).length - IR_MODELS.length;

    // skippedActions is the drift guard: a non-empty list means a
    // deleteOne<Model>/deleteMany<Model> action does not exist on the CRUD
    // resolver and coverage silently shrank.
    expect(summary.skippedActions).toEqual([]);
    expect(summary.deleteCoverageModels).toBe(nonIrModelCount);
    // 5 `_all` markers, 2 delete actions per non-IR model, plus the read
    // actions on the tenant-scoped models. Counted from the map rather than
    // assumed, so the total cannot drift from what was actually decorated.
    const { map } = buildCortexAuthorizationMap();
    const readActions = TENANT_SCOPED_READ_MODELS.reduce((total, model) => {
      const entry = (map as Record<string, unknown>)[model];
      const keys = entry && typeof entry === 'object' ? Object.keys(entry) : [];
      return total + keys.filter((k) => !k.startsWith('delete')).length;
    }, 0);
    expect(readActions).toBeGreaterThan(0);
    expect(summary.decoratedActions).toBe(
      IR_MODELS.length + nonIrModelCount * 2 + readActions
    );
  });

  it('spot check: User reads ARE decorated now, alongside its deletes', () => {
    // This assertion is inverted on purpose. It previously pinned that User
    // reads were undecorated, which was the defect: `users` answered
    // unauthenticated in production and the checker never ran for it, so the
    // leak could not even be counted. Full `_all` coverage is still not given —
    // that would decorate creates and updates too, which is a different and
    // larger decision.
    const { map } = buildCortexAuthorizationMap();
    const userConfig = map.User as Record<string, unknown> | undefined;
    expect(userConfig).toBeDefined();
    expect(userConfig?.deleteOneUser).toBeDefined();
    expect(userConfig?.deleteManyUser).toBeDefined();
    expect(userConfig?._all).toBeUndefined();
    expect(userConfig?.findFirstUser).toBeDefined();
    expect(userConfig?.users).toBeDefined();
    expect(userConfig?.createOneUser).toBeUndefined();
  });

  it('reports (never silently drops) actions missing from the resolver surface', () => {
    const registry = generatedIndex as unknown as Record<
      string,
      { prototype: Record<string, unknown> }
    >;
    const userProto = registry.UserCrudResolver.prototype;
    const original = userProto.deleteOneUser;
    delete userProto.deleteOneUser;
    try {
      const { map, summary } = buildCortexAuthorizationMap();
      expect(summary.skippedActions).toContain('deleteOneUser');
      // The surviving action is still covered.
      const userConfig = map.User as Record<string, unknown> | undefined;
      expect(userConfig?.deleteManyUser).toBeDefined();
      expect(userConfig?.deleteOneUser).toBeUndefined();
    } finally {
      userProto.deleteOneUser = original;
    }
  });
});

describe('applyCortexAuthorizationMap', () => {
  it('applies exactly once and is idempotent — repeat calls return the cached summary without re-decorating', () => {
    const applySpy = vi.mocked(generatedIndex.applyResolversEnhanceMap);
    applySpy.mockClear();

    const first = applyCortexAuthorizationMap();
    expect(first.decoratedActions).toBeGreaterThan(0);
    expect(first.skippedActions).toEqual([]);
    expect(applySpy).toHaveBeenCalledTimes(1);

    const second = applyCortexAuthorizationMap();
    // Reference equality + no second apply: duplicate Authorized metadata on
    // the same fields would double-register in TypeGraphQL's storage.
    expect(second).toBe(first);
    expect(applySpy).toHaveBeenCalledTimes(1);
  });
});

/**
 * The reads that leak must at least be COUNTED before enforcement is argued.
 *
 * A read-only probe of the deployed API with no Authorization header returns a
 * real organisation name, a real user's email address and a real membership
 * row. Those three models were outside the checker entirely — `_all` covers the
 * five investor-relations models and everything else got delete coverage only —
 * so the checker never ran for the reads that actually leak, and a query it
 * never runs for is one it cannot count.
 *
 * Decorating them changes NO behaviour while the checker is in shadow. It makes
 * the exposure measurable, which has to come first: a would-deny ratio that
 * reflects only surfaces nobody ever authenticated to is not evidence about
 * enforcement safety.
 */
describe('read coverage on the tenant-scoped models', () => {
  /** Decorated action names for a model. */
  function actionsFor(model: string): string[] {
    const { map } = buildCortexAuthorizationMap();
    const entry = (map as Record<string, unknown>)[model];
    return entry && typeof entry === 'object' ? Object.keys(entry) : [];
  }

  it('names exactly the three models observed answering unauthenticated', () => {
    expect([...TENANT_SCOPED_READ_MODELS].sort()).toEqual([
      'OrgMembership',
      'Organization',
      'User',
    ]);
  });

  it.each([...TENANT_SCOPED_READ_MODELS])('%s covers every shape of its reads', (model) => {
    const actions = actionsFor(model);
    // The generator exposes one model's reads under several names, and a single
    // uncovered alias is an uncounted leak.
    expect(actions).toContain(`findFirst${model}`);
    expect(actions).toContain(`findFirst${model}OrThrow`);
    expect(actions).toContain(`aggregate${model}`);
    expect(actions).toContain(`groupBy${model}`);
  });

  it('covers the plural query a caller actually writes', () => {
    expect(actionsFor('Organization')).toContain('organizations');
    expect(actionsFor('User')).toContain('users');
    expect(actionsFor('OrgMembership')).toContain('orgMemberships');
  });

  it('keeps delete coverage alongside the reads rather than replacing it', () => {
    for (const model of TENANT_SCOPED_READ_MODELS) {
      const actions = actionsFor(model);
      expect(actions).toContain(`deleteOne${model}`);
      expect(actions).toContain(`deleteMany${model}`);
    }
  });

  it('decorates no create, update or upsert as though it were a read', () => {
    for (const model of TENANT_SCOPED_READ_MODELS) {
      for (const action of actionsFor(model)) {
        expect(action).not.toMatch(/^(create|update|upsert)/);
      }
    }
  });

  it('reports the coverage, and skips nothing', () => {
    const { summary } = buildCortexAuthorizationMap();
    expect(summary.readCoverageModels).toBe(TENANT_SCOPED_READ_MODELS.length);
    expect(summary.skippedActions.filter((a) => a.endsWith(':reads'))).toEqual([]);
  });

  it('leaves the investor-relations models on full coverage, untouched', () => {
    for (const model of IR_MODELS) {
      expect(actionsFor(model)).toEqual(['_all']);
    }
  });
});
