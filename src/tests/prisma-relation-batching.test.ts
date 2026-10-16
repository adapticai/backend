import { describe, expect, it, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import {
  MAX_BATCH_KEYS,
  RelationBatcher,
  batchKey,
  planRelationLoad,
  readInternalParams,
  resetSeamWarningForTest,
  stableKey,
  withRelationBatching,
  type BatchExecutor,
  type InternalRequestParams,
  type QueryExtensionParams,
  type RelationLoadPlan,
} from '../prisma/relation-batcher';
import { applyClientExtensions } from '../prismaClient';

/**
 * A URL that parses but points at nothing. Prisma builds a client lazily, so
 * no connection is attempted unless a query reaches the engine — and every
 * test here short-circuits before that. A test that accidentally reaches the
 * engine fails loudly with a connection error rather than silently passing.
 */
const UNREACHABLE_DB = 'postgresql://u:p@127.0.0.1:1/none';

/**
 * Build a bare client against the unreachable datasource.
 *
 * @returns A fresh Prisma client.
 */
function bareClient(): PrismaClient {
  return new PrismaClient({ datasources: { db: { url: UNREACHABLE_DB } } });
}

/** One observation recorded by a probe extension. */
interface Observation {
  readonly label: string;
  readonly phase: 'enter' | 'exit';
  readonly args?: unknown;
  readonly dataPath?: unknown;
  readonly jsModelName?: unknown;
  readonly inTransaction?: boolean;
  readonly result?: unknown;
}

/**
 * The extension shape used by the probes below, declared locally for the same
 * reason the production module declares its own: instantiating Prisma's
 * parameterised hook type blows the checker's union limit.
 */
interface ProbeExtension {
  readonly name: string;
  readonly query: Record<string, Record<string, unknown>>;
}

/** The single client method the probes need. */
interface ExtendableClient {
  /**
   * Installs a client extension.
   *
   * @param extension - The extension to install.
   * @returns The extended client.
   */
  $extends(extension: ProbeExtension): unknown;
}

/**
 * Install a probe extension on a client.
 *
 * @param client - The client to extend.
 * @param extension - The probe to install.
 * @returns The extended client.
 */
function extend(client: PrismaClient, extension: ProbeExtension): PrismaClient {
  return (client as unknown as ExtendableClient).$extends(
    extension
  ) as unknown as PrismaClient;
}

/**
 * A probe that records entry/exit, marks the arguments, and continues inward.
 *
 * @param label - Name used in the recorded observations.
 * @param log - Collector the observations are appended to.
 * @param hook - Which hook key to register under.
 * @returns The probe extension.
 */
function passThroughProbe(
  label: string,
  log: Observation[],
  hook: '$allOperations' | 'findUnique'
): ProbeExtension {
  return {
    name: label,
    query: {
      $allModels: {
        [hook]: async (params: {
          args: Record<string, unknown>;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }): Promise<unknown> => {
          log.push({ label, phase: 'enter', args: params.args });
          const result = await params.query({
            ...params.args,
            [`markedBy_${label}`]: true,
          });
          log.push({ label, phase: 'exit', result });
          return result;
        },
      },
    },
  };
}

/**
 * A probe that records Prisma's private request parameters and stops.
 *
 * @param log - Collector the observations are appended to.
 * @param value - The value returned in place of executing the query.
 * @returns The probe extension.
 */
function terminalProbe(log: Observation[], value: unknown): ProbeExtension {
  return {
    name: 'terminal',
    query: {
      $allModels: {
        $allOperations: async (params: {
          args: unknown;
        }): Promise<unknown> => {
          const internal = readInternalParams(
            params as unknown as QueryExtensionParams
          );
          log.push({
            label: 'terminal',
            phase: 'enter',
            args: params.args,
            dataPath: internal?.dataPath,
            jsModelName: internal?.jsModelName,
            inTransaction: internal?.transaction !== undefined,
          });
          return value;
        },
      },
    },
  };
}

/**
 * Build extension params for {@link planRelationLoad} without a client.
 *
 * @param args - The arguments the hook would receive.
 * @returns Extension params carrying those arguments.
 */
function paramsFor(args: unknown): QueryExtensionParams {
  return {
    model: 'Trade',
    args,
    query: async () => {
      throw new Error('query() must not be called by planRelationLoad');
    },
  };
}

/** Internal params matching a well-formed single-hop fluent relation load. */
const FLUENT_INTERNAL: InternalRequestParams = {
  dataPath: ['select', 'actions'],
  jsModelName: 'trade',
  transaction: undefined,
};

/** Arguments matching a well-formed single-hop fluent relation load. */
const FLUENT_ARGS = {
  where: { id: 'T1' },
  select: { actions: { take: 3 } },
};

describe('Prisma extension layering (pinned against the installed version)', () => {
  it('runs the extension installed FIRST as the OUTERMOST hook', async () => {
    const log: Observation[] = [];
    const client = extend(
      extend(
        extend(bareClient(), passThroughProbe('OUTER', log, '$allOperations')),
        passThroughProbe('INNER', log, 'findUnique')
      ),
      terminalProbe(log, { sunk: true })
    );

    await client.trade.findUnique({ where: { id: 'T1' } });

    expect(log.map((o) => `${o.label}:${o.phase}`)).toEqual([
      'OUTER:enter',
      'INNER:enter',
      'terminal:enter',
      'INNER:exit',
      'OUTER:exit',
    ]);
  });

  it('carries the outer hook argument rewrite into the inner hook', async () => {
    const log: Observation[] = [];
    const client = extend(
      extend(
        extend(bareClient(), passThroughProbe('OUTER', log, '$allOperations')),
        passThroughProbe('INNER', log, 'findUnique')
      ),
      terminalProbe(log, { sunk: true })
    );

    await client.trade.findUnique({ where: { id: 'T1' } });

    const inner = log.find((o) => o.label === 'INNER' && o.phase === 'enter');
    expect(inner?.args).toMatchObject({ markedBy_OUTER: true });
  });

  it('gives the outer hook the value the inner hook returned', async () => {
    const log: Observation[] = [];
    const client = extend(
      extend(
        extend(bareClient(), passThroughProbe('OUTER', log, '$allOperations')),
        {
          name: 'INNER',
          query: {
            $allModels: {
              findUnique: async (): Promise<unknown> => ['substituted'],
            },
          },
        }
      ),
      terminalProbe(log, { sunk: true })
    );

    await client.trade.findUnique({ where: { id: 'T1' } });

    const outerExit = log.find(
      (o) => o.label === 'OUTER' && o.phase === 'exit'
    );
    expect(outerExit?.result).toEqual(['substituted']);
  });
});

describe('the fluent relation seam this batcher depends on', () => {
  beforeEach(() => {
    resetSeamWarningForTest();
  });

  it('dispatches a fluent relation load as findUnique with a two-segment dataPath', async () => {
    const log: Observation[] = [];
    const client = extend(bareClient(), terminalProbe(log, null));

    await client.trade.findUnique({ where: { id: 'T1' } }).actions({ take: 2 });

    expect(log).toHaveLength(1);
    expect(log[0].dataPath).toEqual(['select', 'actions']);
    expect(log[0].jsModelName).toBe('trade');
    expect(log[0].args).toEqual({
      where: { id: 'T1' },
      select: { actions: { take: 2 } },
    });
  });

  it('gives a caller-written include or select an empty dataPath', async () => {
    const log: Observation[] = [];
    const client = extend(bareClient(), terminalProbe(log, null));

    await client.trade.findUnique({
      where: { id: 'T1' },
      include: { actions: true },
    });
    await client.trade.findUnique({
      where: { id: 'T1' },
      select: { id: true, actions: true },
    });

    expect(log.map((o) => o.dataPath)).toEqual([[], []]);
  });

  it('gives a chained fluent load a longer dataPath', async () => {
    const log: Observation[] = [];
    const client = extend(bareClient(), terminalProbe(log, null));

    await client.trade.findUnique({ where: { id: 'T1' } }).strategyRef().trades();

    expect(log[0].dataPath).toEqual([
      'select',
      'strategyRef',
      'select',
      'trades',
    ]);
  });
});

describe('planRelationLoad', () => {
  it('plans a well-formed single-hop fluent relation load', () => {
    expect(planRelationLoad(paramsFor(FLUENT_ARGS), FLUENT_INTERNAL)).toEqual({
      jsModelName: 'trade',
      keyField: 'id',
      keyValue: 'T1',
      relation: 'actions',
      relationArgs: { take: 3 },
    });
  });

  it('refuses a read inside a transaction', () => {
    expect(
      planRelationLoad(paramsFor(FLUENT_ARGS), {
        ...FLUENT_INTERNAL,
        transaction: { kind: 'itx', id: 'tx1' },
      })
    ).toBeUndefined();
  });

  it('refuses an empty dataPath — a caller-written findUnique', () => {
    expect(
      planRelationLoad(paramsFor(FLUENT_ARGS), {
        ...FLUENT_INTERNAL,
        dataPath: [],
      })
    ).toBeUndefined();
  });

  it('refuses a chained dataPath', () => {
    // The arguments a real two-hop chain produces, taken from the seam test
    // above: the single `select` key IS dataPath[1], so nothing but the path
    // LENGTH distinguishes this from a batchable single hop. Batching it would
    // return the intermediate `strategyRef` record where the caller is owed
    // the terminal `trades` list.
    expect(
      planRelationLoad(
        paramsFor({
          where: { id: 'T1' },
          select: { strategyRef: { select: { trades: true } } },
        }),
        {
          ...FLUENT_INTERNAL,
          dataPath: ['select', 'strategyRef', 'select', 'trades'],
        }
      )
    ).toBeUndefined();
  });

  it('refuses a compound unique selector', () => {
    expect(
      planRelationLoad(
        paramsFor({
          where: { tradeId_sequence: { tradeId: 'T1', sequence: 1 } },
          select: { actions: true },
        }),
        FLUENT_INTERNAL
      )
    ).toBeUndefined();
  });

  it('refuses a multi-key where clause', () => {
    expect(
      planRelationLoad(
        paramsFor({
          where: { id: 'T1', deletedAt: null },
          select: { actions: true },
        }),
        FLUENT_INTERNAL
      )
    ).toBeUndefined();
  });

  it('refuses arguments carrying anything beyond where and select', () => {
    expect(
      planRelationLoad(
        paramsFor({
          where: { id: 'T1' },
          select: { actions: true },
          omit: { analysis: true },
        }),
        FLUENT_INTERNAL
      )
    ).toBeUndefined();
  });

  it('refuses a select naming something other than the dataPath relation', () => {
    expect(
      planRelationLoad(
        paramsFor({ where: { id: 'T1' }, select: { id: true } }),
        FLUENT_INTERNAL
      )
    ).toBeUndefined();
  });

  it('falls through when the private seam is absent', () => {
    const seamless: QueryExtensionParams = paramsFor(FLUENT_ARGS);
    expect(readInternalParams(seamless)).toBeUndefined();
  });
});

describe('stableKey and batchKey', () => {
  it('is insensitive to object key order', () => {
    expect(stableKey({ a: 1, b: 2 })).toBe(stableKey({ b: 2, a: 1 }));
  });

  it('separates structurally different relation arguments', () => {
    const base: RelationLoadPlan = {
      jsModelName: 'trade',
      keyField: 'id',
      keyValue: 'T1',
      relation: 'actions',
      relationArgs: { take: 3 },
    };
    expect(batchKey(base)).toBe(
      batchKey({ ...base, keyValue: 'T2' })
    );
    expect(batchKey(base)).not.toBe(
      batchKey({ ...base, relationArgs: { take: 4 } })
    );
    expect(batchKey(base)).not.toBe(
      batchKey({ ...base, relation: 'alerts' })
    );
  });
});

describe('RelationBatcher', () => {
  /**
   * Build a plan for one parent key.
   *
   * @param keyValue - The parent key.
   * @param relationArgs - The relation's arguments.
   * @returns The plan.
   */
  function plan(keyValue: string, relationArgs: unknown = true): RelationLoadPlan {
    return {
      jsModelName: 'trade',
      keyField: 'id',
      keyValue,
      relation: 'actions',
      relationArgs,
    };
  }

  it('serves many same-shape loads from a single batched read', async () => {
    const calls: Array<Record<string, unknown>> = [];
    const execute: BatchExecutor = async (_model, args) => {
      calls.push(args);
      const where = args.where as { id: { in: string[] } };
      return where.id.in.map((id) => ({ id, actions: [{ id: `${id}-a` }] }));
    };
    const batcher = new RelationBatcher(execute);

    const ids = ['T1', 'T2', 'T3'];
    const results = await Promise.all(ids.map((id) => batcher.load(plan(id))));

    expect(calls).toHaveLength(1);
    expect(calls[0]).toEqual({
      where: { id: { in: ids } },
      select: { id: true, actions: true },
    });
    expect(results).toEqual([
      [{ id: 'T1-a' }],
      [{ id: 'T2-a' }],
      [{ id: 'T3-a' }],
    ]);
  });

  it('passes the relation arguments through untouched', async () => {
    const calls: Array<Record<string, unknown>> = [];
    const execute: BatchExecutor = async (_model, args) => {
      calls.push(args);
      return [];
    };
    const batcher = new RelationBatcher(execute);
    const relationArgs = { take: 50_001, orderBy: { sequence: 'asc' } };

    await batcher.load(plan('T1', relationArgs));

    expect(
      (calls[0].select as Record<string, unknown>).actions
    ).toEqual(relationArgs);
  });

  it('returns null, never an empty list, for a parent row that does not exist', async () => {
    const execute: BatchExecutor = async () => [
      { id: 'T1', actions: [{ id: 'a' }] },
    ];
    const batcher = new RelationBatcher(execute);

    const [present, missing] = await Promise.all([
      batcher.load(plan('T1')),
      batcher.load(plan('MISSING')),
    ]);

    expect(present).toEqual([{ id: 'a' }]);
    expect(missing).toBeNull();
  });

  it('keeps structurally different relation arguments in separate batches', async () => {
    const calls: Array<Record<string, unknown>> = [];
    const execute: BatchExecutor = async (_model, args) => {
      calls.push(args);
      return [];
    };
    const batcher = new RelationBatcher(execute);

    await Promise.all([
      batcher.load(plan('T1', { take: 1 })),
      batcher.load(plan('T2', { take: 2 })),
    ]);

    expect(calls).toHaveLength(2);
  });

  it('chunks a batch larger than the per-statement key ceiling', async () => {
    const groups: number[] = [];
    const execute: BatchExecutor = async (_model, args) => {
      const where = args.where as { id: { in: string[] } };
      groups.push(where.id.in.length);
      return where.id.in.map((id) => ({ id, actions: [] }));
    };
    const batcher = new RelationBatcher(execute);

    const ids = Array.from(
      { length: MAX_BATCH_KEYS + 7 },
      (_unused, i) => `T${i}`
    );
    const results = await Promise.all(ids.map((id) => batcher.load(plan(id))));

    expect(groups).toEqual([MAX_BATCH_KEYS, 7]);
    expect(results).toHaveLength(MAX_BATCH_KEYS + 7);
    expect(results.every((r) => Array.isArray(r))).toBe(true);
  });

  it('rejects every waiting load when the batched read fails', async () => {
    const execute: BatchExecutor = async () => {
      throw new Error('batched read failed');
    };
    const batcher = new RelationBatcher(execute);

    await expect(
      Promise.all([batcher.load(plan('T1')), batcher.load(plan('T2'))])
    ).rejects.toThrow('batched read failed');
  });

  it('does not invent a value when the executor returns a non-array', async () => {
    const execute: BatchExecutor = async () => ({ notAnArray: true });
    const batcher = new RelationBatcher(execute);

    await expect(batcher.load(plan('T1'))).rejects.toThrow(
      /expected an array/
    );
  });
});

describe('withRelationBatching wiring', () => {
  beforeEach(() => {
    resetSeamWarningForTest();
  });

  it('installs an extension named relation-batching', () => {
    const installed: string[] = [];
    const fake = {
      $extends(extension: { name: string }): unknown {
        installed.push(extension.name);
        return fake;
      },
    };

    withRelationBatching(fake as unknown as PrismaClient);

    expect(installed).toEqual(['relation-batching']);
  });

  /**
   * Build the client the two wiring tests drive.
   *
   * The layering mirrors production and is only expressible because the
   * ordering law above is pinned: the dispatch stub is installed FIRST so it is
   * OUTERMOST, which is the only position from which it can intercept the
   * batched `findMany` the batcher issues through the client it wrapped. The
   * batcher goes on next, and a stub standing in for the query engine goes on
   * last so an unbatched `findUnique` is answered instead of reaching a
   * database that is not there.
   *
   * @param log - Collector for every operation both stubs observe.
   * @param rows - Rows the dispatch stub answers a batched `findMany` with.
   * @returns The wired client.
   */
  function wiredClient(
    log: Observation[],
    rows: readonly Record<string, unknown>[]
  ): PrismaClient {
    const dispatchStub: ProbeExtension = {
      name: 'dispatch-stub',
      query: {
        $allModels: {
          findMany: async (params: { args: unknown }): Promise<unknown> => {
            log.push({ label: 'findMany', phase: 'enter', args: params.args });
            return rows;
          },
        },
      },
    };
    const engineStub: ProbeExtension = {
      name: 'engine-stub',
      query: {
        $allModels: {
          $allOperations: async (params: {
            args: unknown;
          }): Promise<unknown> => {
            log.push({
              label: 'unbatched',
              phase: 'enter',
              args: params.args,
            });
            return null;
          },
        },
      },
    };
    return extend(
      withRelationBatching(extend(bareClient(), dispatchStub)),
      engineStub
    );
  }

  it('serves a fluent relation load from one batched findMany, never per row', async () => {
    const log: Observation[] = [];
    const client = wiredClient(log, [
      { id: 'T1', actions: [{ id: 'a1' }] },
      { id: 'T2', actions: [{ id: 'a2' }] },
    ]);

    const [first, second, missing] = await Promise.all([
      client.trade.findUnique({ where: { id: 'T1' } }).actions(),
      client.trade.findUnique({ where: { id: 'T2' } }).actions(),
      client.trade.findUnique({ where: { id: 'GONE' } }).actions(),
    ]);

    expect(log).toEqual([
      {
        label: 'findMany',
        phase: 'enter',
        args: {
          where: { id: { in: ['T1', 'T2', 'GONE'] } },
          select: { id: true, actions: true },
        },
      },
    ]);
    expect(first).toEqual([{ id: 'a1' }]);
    expect(second).toEqual([{ id: 'a2' }]);
    expect(missing).toBeNull();
  });

  it('passes a caller-written findUnique straight through, unbatched', async () => {
    const log: Observation[] = [];
    const client = wiredClient(log, []);

    await client.trade.findUnique({
      where: { id: 'T1' },
      include: { actions: true },
    });

    expect(log).toEqual([
      {
        label: 'unbatched',
        phase: 'enter',
        args: { where: { id: 'T1' }, include: { actions: true } },
      },
    ]);
  });
});

describe('applyClientExtensions composition order', () => {
  it('installs the ceiling guard before the relation batcher, putting the guard outermost', () => {
    const installed: string[] = [];
    const recorder = {
      $extends(extension: { name: string }): unknown {
        installed.push(extension.name);
        return recorder;
      },
    };

    applyClientExtensions(recorder as unknown as PrismaClient);

    // Read with the ordering law pinned above: first installed is outermost.
    // Inverting the composition in prismaClient.ts flips this array, which is
    // what makes this assertion load-bearing rather than decorative.
    expect(installed).toEqual(['unbounded-read-ceiling', 'relation-batching']);
    expect(installed.indexOf('unbounded-read-ceiling')).toBeLessThan(
      installed.indexOf('relation-batching')
    );
  });
});
