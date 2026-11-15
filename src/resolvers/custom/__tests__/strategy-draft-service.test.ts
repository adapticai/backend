/**
 * The strategy-draft writes (G-STR-08) against an in-memory `strategies`
 * table that evaluates the `where` each call sends, so a filter the service
 * forgets to send is a row another caller can write, and the test sees it.
 */

import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { buildSchema, Query, Resolver } from 'type-graphql';
import { createRequire } from 'node:module';
import type { GraphQLObjectType } from 'graphql';

import {
  classifyMutationField,
  evaluateMutationAccess,
  STRATEGY_DRAFT_MUTATIONS,
} from '../../../auth/mutation-authorization';
import type { BackendPrincipal } from '../../../auth/token-verifier';
import { StrategyDraftResolver } from '../StrategyDraftResolver';
import {
  createStrategyDraft,
  deleteStrategyDraft,
  recordStrategyDraftBacktest,
  saveStrategyDraft,
  StrategyDraftRefusal,
  type StrategyDraftPrisma,
} from '../strategy-draft-service';
import { canonicalJson, specHash } from '../strategy-spec-hash';

const ALICE_ID = '00000000-0000-4000-8000-00000000a11c';
const BOB_ID = '00000000-0000-4000-8000-000000000b0b';
const ALICE: BackendPrincipal = { kind: 'user', sub: ALICE_ID, roles: [] };
const BOB: BackendPrincipal = { kind: 'user', sub: BOB_ID, roles: [] };
const SERVICE: BackendPrincipal = { kind: 'server' };

const REV = new Date('2026-11-15T10:00:00.000Z');
const LATER = new Date('2026-11-15T10:05:00.000Z');
const SPEC = { thesis: 'Grid capex', allocationPct: 5 };
const EDITED = { thesis: 'Grid capex, edited', allocationPct: 5 };

interface Row {
  id: string;
  key: string;
  displayName: string;
  origin: string;
  lifecycleState: string;
  kind: string | null;
  spec: unknown;
  desk: string | null;
  ownerUserId: string | null;
  backtestJobId: string | null;
  backtestSpecHash: string | null;
  updatedAt: Date;
  deletedAt: Date | null;
}

/** Whether a row satisfies the subset of `StrategyWhereInput` the service sends. */
function matches(row: Row, where: Record<string, unknown>): boolean {
  return Object.entries(where).every(([field, condition]) => {
    const value = (row as unknown as Record<string, unknown>)[field];
    if (condition instanceof Date)
      return value instanceof Date && value.getTime() === condition.getTime();
    if (condition !== null && typeof condition === 'object') {
      const ops = condition as Record<string, unknown>;
      if ('not' in ops) return value !== ops.not;
      throw new Error(`fake table: unsupported filter on ${field}`);
    }
    return value === condition;
  });
}

/** An in-memory table, with a hook that runs between a read and the next write. */
function table(seed: Row[]): {
  rows: Row[];
  prisma: StrategyDraftPrisma;
  writes: Array<Record<string, unknown>>;
  betweenReadAndWrite: { run: (() => void) | null };
} {
  const rows = seed.map((row) => ({ ...row }));
  const writes: Array<Record<string, unknown>> = [];
  const betweenReadAndWrite: { run: (() => void) | null } = { run: null };
  const prisma: StrategyDraftPrisma = {
    strategy: {
      async findFirst({ where }) {
        const row = rows.find((candidate) =>
          matches(candidate, where as Record<string, unknown>)
        );
        const facts = row
          ? {
              id: row.id,
              lifecycleState: row.lifecycleState,
              spec: row.spec as never,
              updatedAt: row.updatedAt,
            }
          : null;
        betweenReadAndWrite.run?.();
        return facts;
      },
      async create({ data }) {
        writes.push({ ...data });
        const row: Row = {
          id: `id-${rows.length + 1}`,
          key: String(data.key),
          displayName: String(data.displayName),
          origin: String(data.origin),
          lifecycleState: String(data.lifecycleState),
          kind: (data.kind as string | undefined) ?? null,
          spec: data.spec,
          desk: (data.desk as string | undefined) ?? null,
          ownerUserId: (data.ownerUserId as string | undefined) ?? null,
          backtestJobId: null,
          backtestSpecHash: null,
          updatedAt: REV,
          deletedAt: null,
        };
        rows.push(row);
        return { id: row.id, updatedAt: row.updatedAt };
      },
      async updateMany({ where, data }) {
        writes.push({ ...data });
        const hit = rows.filter((row) =>
          matches(row, where as Record<string, unknown>)
        );
        for (const row of hit) Object.assign(row, data);
        return { count: hit.length };
      },
    },
  };
  return { rows, prisma, writes, betweenReadAndWrite };
}

function draft(overrides: Partial<Row> = {}): Row {
  return {
    id: 'draft-1',
    key: 'desk-thematic-1',
    displayName: 'Grid',
    origin: 'USER',
    lifecycleState: 'DRAFT',
    kind: 'thematic',
    spec: SPEC,
    desk: null,
    ownerUserId: ALICE_ID,
    backtestJobId: null,
    backtestSpecHash: null,
    updatedAt: REV,
    deletedAt: null,
    ...overrides,
  };
}

const clock = (): Date => LATER;

/**
 * type-graphql (externalized) loads graphql's CJS entry while vite gives this
 * file the ESM one (see vitest.config.ts); execute with the copy the schema
 * was built on.
 */
const { graphql } = createRequire(import.meta.url)(
  'graphql'
) as typeof import('graphql');

/** A schema needs one query; the drafts define none. */
@Resolver()
class DraftSchemaQuery {
  @Query(() => Boolean)
  ping(): boolean {
    return true;
  }
}

describe('createStrategyDraft', () => {
  it('stamps the owner from the principal, origin USER, DRAFT, and no desk', async () => {
    const t = table([]);
    const out = await createStrategyDraft(t.prisma, ALICE, {
      kind: 'thematic',
      displayName: '  Grid  ',
      spec: SPEC,
    });
    expect(out.status).toBe('WRITTEN');
    expect(t.rows[0]).toMatchObject({
      ownerUserId: ALICE_ID,
      origin: 'USER',
      lifecycleState: 'DRAFT',
      kind: 'thematic',
      displayName: 'Grid',
      desk: null,
    });
    expect(Object.keys(t.writes[0]).sort()).toEqual(
      [
        'displayName',
        'key',
        'kind',
        'lifecycleState',
        'origin',
        'ownerUserId',
        'spec',
      ].sort()
    );
  });

  it('refuses no principal and the service principal: a draft has a human author', async () => {
    const t = table([]);
    await expect(
      createStrategyDraft(t.prisma, null, {
        kind: 'signal',
        displayName: 'x',
        spec: {},
      })
    ).rejects.toMatchObject({
      code: 'UNAUTHENTICATED',
    });
    await expect(
      createStrategyDraft(t.prisma, SERVICE, {
        kind: 'signal',
        displayName: 'x',
        spec: {},
      })
    ).rejects.toBeInstanceOf(StrategyDraftRefusal);
    expect(t.rows).toHaveLength(0);
  });

  it('refuses a spec that is not a JSON object', async () => {
    const t = table([]);
    await expect(
      createStrategyDraft(t.prisma, ALICE, {
        kind: 'signal',
        displayName: 'x',
        spec: [1],
      })
    ).rejects.toMatchObject({
      code: 'BAD_USER_INPUT',
    });
  });
});

describe('saveStrategyDraft', () => {
  it("writes the author's own draft at its revision and stamps a later revision", async () => {
    const t = table([draft()]);
    const out = await saveStrategyDraft(
      t.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: REV,
        displayName: 'Grid 2',
        spec: EDITED,
      },
      clock
    );
    expect(out).toEqual({ status: 'WRITTEN', id: 'draft-1', revision: LATER });
    expect(t.rows[0]).toMatchObject({
      displayName: 'Grid 2',
      spec: EDITED,
      updatedAt: LATER,
    });
  });

  it("cannot write another user's draft", async () => {
    const t = table([draft()]);
    const out = await saveStrategyDraft(
      t.prisma,
      BOB,
      {
        id: 'draft-1',
        expectedRevision: REV,
        displayName: 'Mine',
        spec: EDITED,
      },
      clock
    );
    expect(out.status).toBe('NOT_FOUND');
    expect(t.rows[0]).toMatchObject({ displayName: 'Grid', spec: SPEC });
  });

  it("cannot write another user's draft even when the read is skipped by a race (the write filter names the author)", async () => {
    const t = table([draft({ ownerUserId: BOB_ID })]);
    // The row is BOB's; ALICE's read sees it as hers only if the owner flips
    // after the read. The write itself must still refuse.
    t.rows[0].ownerUserId = ALICE_ID;
    t.betweenReadAndWrite.run = () => {
      t.rows[0].ownerUserId = BOB_ID;
    };
    const out = await saveStrategyDraft(
      t.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: REV,
        displayName: 'Mine',
        spec: EDITED,
      },
      clock
    );
    expect(out.status).toBe('STALE');
    expect(t.rows[0]).toMatchObject({ displayName: 'Grid', spec: SPEC });
  });

  it('cannot write a row that is not a draft', async () => {
    const t = table([draft({ lifecycleState: 'PENDING_APPROVAL' })]);
    const out = await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      clock
    );
    expect(out.status).toBe('NOT_DRAFT');
    expect(t.rows[0].spec).toEqual(SPEC);
  });

  it('cannot write a draft that was submitted between the read and the write', async () => {
    const t = table([draft()]);
    t.betweenReadAndWrite.run = () => {
      t.rows[0].lifecycleState = 'PENDING_APPROVAL';
    };
    const out = await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      clock
    );
    expect(out.status).toBe('STALE');
    expect(t.rows[0].spec).toEqual(SPEC);
  });

  it('answers STALE for an old revision, and when another write lands between the read and the write', async () => {
    const t = table([draft()]);
    const old = await saveStrategyDraft(
      t.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: new Date(0),
        displayName: 'x',
        spec: EDITED,
      },
      clock
    );
    expect(old.status).toBe('STALE');
    t.betweenReadAndWrite.run = () => {
      t.rows[0].updatedAt = new Date(REV.getTime() + 5);
    };
    const raced = await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      clock
    );
    expect(raced.status).toBe('STALE');
    expect(t.rows[0].spec).toEqual(SPEC);
  });

  it('stamps a revision strictly later than the one matched, even when the clock has not moved', async () => {
    const t = table([draft()]);
    const out = await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      () => REV
    );
    expect(out.revision?.getTime()).toBe(REV.getTime() + 1);
    const second = await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'y', spec: SPEC },
      () => REV
    );
    expect(second.status).toBe('STALE');
  });

  it('never writes desk, lifecycleState, origin, ownerUserId or key', async () => {
    const t = table([
      draft({ backtestJobId: 'job-1', backtestSpecHash: specHash(SPEC) }),
    ]);
    await saveStrategyDraft(
      t.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      clock
    );
    expect(Object.keys(t.writes[0]).sort()).toEqual([
      'backtestJobId',
      'backtestSpecHash',
      'displayName',
      'spec',
      'updatedAt',
    ]);
  });

  it('clears the recorded backtest when the spec changes, and keeps it when only the name does', async () => {
    const recorded = {
      backtestJobId: 'job-1',
      backtestSpecHash: specHash(SPEC),
    };
    const changed = table([draft(recorded)]);
    await saveStrategyDraft(
      changed.prisma,
      ALICE,
      { id: 'draft-1', expectedRevision: REV, displayName: 'x', spec: EDITED },
      clock
    );
    expect(changed.rows[0]).toMatchObject({
      backtestJobId: null,
      backtestSpecHash: null,
    });

    const renamed = table([draft(recorded)]);
    // Key order differs; the canonical spec is the same.
    await saveStrategyDraft(
      renamed.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: REV,
        displayName: 'x',
        spec: { allocationPct: 5, thesis: 'Grid capex' },
      },
      clock
    );
    expect(renamed.rows[0]).toMatchObject(recorded);
  });
});

describe('deleteStrategyDraft', () => {
  it("soft-deletes the author's draft, and not another user's or a submitted one", async () => {
    const t = table([draft()]);
    expect(
      (
        await deleteStrategyDraft(
          t.prisma,
          BOB,
          { id: 'draft-1', expectedRevision: REV },
          clock
        )
      ).status
    ).toBe('NOT_FOUND');
    expect(t.rows[0].deletedAt).toBeNull();
    const submitted = table([draft({ lifecycleState: 'ACTIVE' })]);
    expect(
      (
        await deleteStrategyDraft(
          submitted.prisma,
          ALICE,
          { id: 'draft-1', expectedRevision: REV },
          clock
        )
      ).status
    ).toBe('NOT_DRAFT');
    expect(submitted.rows[0].deletedAt).toBeNull();
    expect(
      (
        await deleteStrategyDraft(
          t.prisma,
          ALICE,
          { id: 'draft-1', expectedRevision: REV },
          clock
        )
      ).status
    ).toBe('WRITTEN');
    expect(t.rows[0].deletedAt).toEqual(LATER);
  });
});

describe('recordStrategyDraftBacktest', () => {
  it('records a job only against the hash of the stored spec', async () => {
    const t = table([draft()]);
    const forged = await recordStrategyDraftBacktest(
      t.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: REV,
        jobId: 'job-1',
        specHash: specHash(EDITED),
      },
      clock
    );
    expect(forged.status).toBe('SPEC_MISMATCH');
    expect(t.rows[0].backtestJobId).toBeNull();
    const out = await recordStrategyDraftBacktest(
      t.prisma,
      ALICE,
      {
        id: 'draft-1',
        expectedRevision: REV,
        jobId: 'job-1',
        specHash: specHash(SPEC),
      },
      clock
    );
    expect(out.status).toBe('WRITTEN');
    expect(t.rows[0]).toMatchObject({
      backtestJobId: 'job-1',
      backtestSpecHash: specHash(SPEC),
    });
  });

  it("does not record against another user's draft", async () => {
    const t = table([draft()]);
    const out = await recordStrategyDraftBacktest(
      t.prisma,
      BOB,
      {
        id: 'draft-1',
        expectedRevision: REV,
        jobId: 'j',
        specHash: specHash(SPEC),
      },
      clock
    );
    expect(out.status).toBe('NOT_FOUND');
    expect(t.rows[0].backtestJobId).toBeNull();
  });
});

describe('the spec hash', () => {
  it('matches the fixed vector the platform also carries (spec-hash.test.ts)', () => {
    const vector = {
      thesis: 'Grid capex',
      constituents: [
        { symbol: 'ETN', weight: 0.5 },
        { symbol: 'PWR', weight: 0.5 },
      ],
      allocationPct: 5,
      neutralise: { size: false, beta: true },
      note: 'é − ×',
    };
    expect(canonicalJson(vector)).toBe(
      '{"allocationPct":5,"constituents":[{"symbol":"ETN","weight":0.5},{"symbol":"PWR","weight":0.5}],"neutralise":{"beta":true,"size":false},"note":"é − ×","thesis":"Grid capex"}'
    );
    expect(specHash(vector)).toBe(
      '04b0c4b4bb1f123331287804f3d78d2f2a36d115a39f5ce08786f4b976b450a4'
    );
  });
});

describe('the GraphQL surface', () => {
  it('takes no operator-governed argument, and refuses a desk argument at validation', async () => {
    const schema = await buildSchema({
      resolvers: [StrategyDraftResolver, DraftSchemaQuery],
      validate: false,
    });
    const mutation = schema.getMutationType() as GraphQLObjectType;
    const args = Object.fromEntries(
      Object.values(mutation.getFields()).map((field) => [
        field.name,
        field.args.map((arg) => arg.name).sort(),
      ])
    );
    expect(args).toEqual({
      createStrategyDraft: ['displayName', 'kind', 'spec'],
      saveStrategyDraft: ['displayName', 'expectedRevision', 'id', 'spec'],
      deleteStrategyDraft: ['expectedRevision', 'id'],
      recordStrategyDraftBacktest: [
        'expectedRevision',
        'id',
        'jobId',
        'specHash',
      ],
    });
    const result = await graphql({
      schema,
      source:
        'mutation { createStrategyDraft(kind: thematic, displayName: "x", spec: {}, desk: THEMATIC) { status } }',
      contextValue: { principal: ALICE, prisma: table([]).prisma },
    });
    expect(result.errors?.[0]?.message).toMatch(/Unknown argument "desk"/);
  });

  it('runs through the schema as the author', async () => {
    const schema = await buildSchema({
      resolvers: [StrategyDraftResolver, DraftSchemaQuery],
      validate: false,
    });
    const t = table([draft()]);
    const result = await graphql({
      schema,
      source: `mutation { saveStrategyDraft(id: "draft-1", expectedRevision: "${REV.toISOString()}", displayName: "Grid 2", spec: { thesis: "x" }) { status id revision } }`,
      contextValue: { principal: BOB, prisma: t.prisma },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      saveStrategyDraft: { status: 'NOT_FOUND', id: 'draft-1', revision: null },
    });
    const anonymous = await graphql({
      schema,
      source: `mutation { deleteStrategyDraft(id: "draft-1", expectedRevision: "${REV.toISOString()}") { status } }`,
      contextValue: { principal: null, prisma: t.prisma },
    });
    expect(anonymous.errors?.[0]?.extensions?.code).toBe('UNAUTHENTICATED');
    expect(t.rows[0].deletedAt).toBeNull();
  });
});

describe('the mutation guard', () => {
  const models = new Set(['Strategy']);
  it('keeps every generated Strategy write service-only for a user, so desk stays operator-assigned', () => {
    for (const field of [
      'createOneStrategy',
      'updateOneStrategy',
      'upsertOneStrategy',
      'updateManyStrategy',
      'deleteOneStrategy',
    ]) {
      expect(
        evaluateMutationAccess(ALICE, classifyMutationField(field, models))
          .reason
      ).toBe('model_not_user_writable');
    }
  });

  it('defers to the draft resolver for the four draft mutations', () => {
    expect(STRATEGY_DRAFT_MUTATIONS).toHaveLength(4);
    for (const target of STRATEGY_DRAFT_MUTATIONS) {
      const field = target.replace(/^custom:/, '');
      expect(
        evaluateMutationAccess(ALICE, classifyMutationField(field, models))
      ).toEqual({
        allowed: true,
        reason: 'resolver_authorized',
      });
    }
  });
});
