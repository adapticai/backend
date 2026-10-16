import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

import {
  DEFAULT_FIND_MANY_TAKE,
  RelationReadTooLargeError,
  applyRelationCeiling,
  resetOversizeRelationReports,
  resolveRelationTakeCeiling,
  runGuardedOperation,
  withUnboundedReadGuard,
} from '../prismaClient';

/**
 * The ceilings that stop a read bounded by nothing but table size.
 *
 * The defect these tests exist to pin is not a wrong ceiling — it is a guard
 * registered on an operation the reads it meant to cover never dispatch as. A
 * hook on `findMany` looks like it covers every list read, and covers only the
 * top-level ones: a relation list reaches the client as the PARENT's
 * `findUnique`, so every relation the GraphQL API serves went unbounded while
 * the guard's own documentation said otherwise.
 *
 * That is a fact about Prisma's dispatch, not about this repo's code, which is
 * why the first suite asserts it against the real generated client. It is the
 * assertion that would have caught the gap originally, and the one that will
 * catch it again if a Prisma upgrade moves a shape from one operation to
 * another.
 */

/** One dispatch observed by the probe extension. */
interface Dispatch {
  readonly model: string;
  readonly operation: string;
  readonly args: Record<string, unknown>;
}

/** Any object that accepts a Prisma client extension. */
interface Extendable {
  $extends(extension: {
    name: string;
    query: {
      $allModels: {
        $allOperations: (params: {
          model: string;
          operation: string;
          args: unknown;
          query: (args: Record<string, unknown>) => Promise<unknown>;
        }) => Promise<unknown>;
      };
    };
  }): unknown;
}

const PROBE_URL = 'postgresql://unused:unused@127.0.0.1:1/unused';
const ID = '00000000-0000-0000-0000-000000000001';

/**
 * Wrap a client so every dispatch is recorded and none of them executes.
 *
 * The extension never calls Prisma's `query` continuation, so no connection is
 * opened and no database is needed — while the model, operation name and
 * arguments observed are exactly the ones a real read would have produced.
 *
 * @param client - The client to observe.
 * @param sink - Array each observed dispatch is appended to.
 * @returns A client that records instead of querying.
 */
function recordDispatches(client: unknown, sink: Dispatch[]): PrismaClient {
  const extended = (client as Extendable).$extends({
    name: 'dispatch-probe',
    query: {
      $allModels: {
        $allOperations: ({ model, operation, args }) => {
          sink.push({
            model,
            operation,
            args: (args ?? {}) as Record<string, unknown>,
          });
          return Promise.resolve(null);
        },
      },
    },
  });
  return extended as PrismaClient;
}

/** A client that reaches no database, for dispatch-shape observation only. */
function offlineClient(): PrismaClient {
  return new PrismaClient({ datasources: { db: { url: PROBE_URL } } });
}

describe('Prisma dispatch shapes for list reads', () => {
  it('dispatches a fluent relation load as the PARENT findUnique, not findMany', async () => {
    const seen: Dispatch[] = [];
    const client = recordDispatches(offlineClient(), seen);

    await client.trade.findUnique({ where: { id: ID } }).actions();
    await client.alpacaAccount.findUnique({ where: { id: ID } }).alerts();

    expect(seen.map((d) => `${d.model}.${d.operation}`)).toEqual([
      'Trade.findUnique',
      'AlpacaAccount.findUnique',
    ]);
    // The relation is not invisible — it arrives in `select`, which is what
    // makes bounding it possible at all.
    expect(seen[0].args.select).toEqual({ actions: true });
    expect(seen[1].args.select).toEqual({ alerts: true });
  });

  it('dispatches an include of a relation as the parent operation', async () => {
    const seen: Dispatch[] = [];
    const client = recordDispatches(offlineClient(), seen);

    await client.alpacaAccount.findUnique({
      where: { id: ID },
      include: { alerts: true },
    });
    await client.trade.findFirst({
      where: { id: ID },
      include: { actions: true },
    });

    expect(seen.map((d) => `${d.model}.${d.operation}`)).toEqual([
      'AlpacaAccount.findUnique',
      'Trade.findFirst',
    ]);
    expect(seen[0].args.include).toEqual({ alerts: true });
    expect(seen[1].args.include).toEqual({ actions: true });
  });

  it('dispatches only a top-level list read as findMany', async () => {
    const seen: Dispatch[] = [];
    const client = recordDispatches(offlineClient(), seen);

    await client.trade.findMany({ where: { alpacaAccountId: ID } });

    expect(seen).toHaveLength(1);
    expect(seen[0].operation).toBe('findMany');
  });
});

describe('withUnboundedReadGuard installation', () => {
  const previous = process.env.PRISMA_RELATION_TAKE_CEILING;

  afterEach(() => {
    if (previous === undefined) delete process.env.PRISMA_RELATION_TAKE_CEILING;
    else process.env.PRISMA_RELATION_TAKE_CEILING = previous;
  });

  it('reaches the fluent relation path once the relation ceiling is set', async () => {
    process.env.PRISMA_RELATION_TAKE_CEILING = '10';
    const seen: Dispatch[] = [];
    // The guard is installed FIRST, so it runs outermost and the probe sees
    // the arguments the guard produced. This is the installed extension on a
    // real client, not the policy function called directly.
    const guarded = withUnboundedReadGuard(offlineClient());
    const client = recordDispatches(guarded, seen);

    await client.trade.findUnique({ where: { id: ID } }).actions();

    expect(seen[0].operation).toBe('findUnique');
    expect(seen[0].args.select).toEqual({ actions: { take: 11 } });
  });

  it('leaves relation arguments untouched while the relation ceiling is unset', async () => {
    delete process.env.PRISMA_RELATION_TAKE_CEILING;
    const seen: Dispatch[] = [];
    const client = recordDispatches(
      withUnboundedReadGuard(offlineClient()),
      seen
    );

    await client.trade.findUnique({ where: { id: ID } }).actions();
    await client.alpacaAccount.findUnique({
      where: { id: ID },
      include: { alerts: true },
    });

    expect(seen[0].args.select).toEqual({ actions: true });
    expect(seen[1].args.include).toEqual({ alerts: true });
  });

  it('still caps a top-level findMany that states no take', async () => {
    const seen: Dispatch[] = [];
    const client = recordDispatches(
      withUnboundedReadGuard(offlineClient()),
      seen
    );

    await client.trade.findMany({ where: { alpacaAccountId: ID } });

    expect(seen[0].args.take).toBe(DEFAULT_FIND_MANY_TAKE);
  });
});

describe('resolveRelationTakeCeiling', () => {
  const previous = process.env.PRISMA_RELATION_TAKE_CEILING;

  afterEach(() => {
    if (previous === undefined) delete process.env.PRISMA_RELATION_TAKE_CEILING;
    else process.env.PRISMA_RELATION_TAKE_CEILING = previous;
  });

  it('is unset by default, because enforcing it reorders unordered relations', () => {
    delete process.env.PRISMA_RELATION_TAKE_CEILING;
    expect(resolveRelationTakeCeiling()).toBeUndefined();
  });

  it('refuses a non-positive or unparseable value rather than inventing one', () => {
    process.env.PRISMA_RELATION_TAKE_CEILING = '0';
    expect(resolveRelationTakeCeiling()).toBeUndefined();
    process.env.PRISMA_RELATION_TAKE_CEILING = 'lots';
    expect(resolveRelationTakeCeiling()).toBeUndefined();
  });

  it('honours a positive integer', () => {
    process.env.PRISMA_RELATION_TAKE_CEILING = '250';
    expect(resolveRelationTakeCeiling()).toBe(250);
  });
});

describe('applyRelationCeiling', () => {
  it('is the identity while the ceiling is unset', () => {
    const args = {
      where: { id: ID },
      include: { alerts: true, accountRiskMetrics: true },
    };
    const result = applyRelationCeiling('AlpacaAccount', args, undefined);
    expect(result.args).toEqual(args);
    expect(result.probed.size).toBe(0);
  });

  it('probes one row above the ceiling, so truncation is certain and not guessed', () => {
    const result = applyRelationCeiling(
      'Trade',
      { where: { id: ID }, select: { actions: true } },
      100
    );
    expect(result.args.select).toEqual({ actions: { take: 101 } });
    expect([...result.probed]).toEqual(['actions']);
  });

  it('leaves to-one relations and scalars alone', () => {
    const result = applyRelationCeiling(
      'Action',
      { select: { id: true, note: true, trade: true } },
      100
    );
    expect(result.args.select).toEqual({ id: true, note: true, trade: true });
    expect(result.probed.size).toBe(0);
  });

  it('honours an explicit take instead of overriding the caller', () => {
    const result = applyRelationCeiling(
      'Trade',
      { include: { actions: { take: 5 } } },
      100
    );
    expect(result.args.include).toEqual({ actions: { take: 5 } });
    expect(result.probed.size).toBe(0);
  });

  it('descends through a to-one relation into the list underneath it', () => {
    const result = applyRelationCeiling(
      'Action',
      { select: { trade: { select: { actions: true } } } },
      100
    );
    expect(result.args.select).toEqual({
      trade: { select: { actions: { take: 101 } } },
    });
    expect([...result.probed]).toEqual(['trade.actions']);
  });

  it('never touches write payloads', () => {
    const data = { symbol: 'AAPL', actions: { create: [{ note: 'n' }] } };
    const result = applyRelationCeiling('Trade', { data }, 100);
    expect(result.args.data).toEqual(data);
  });
});

/**
 * Drives the policy with an injected executor, so the decision it makes about
 * a result is testable without a database.
 *
 * @param input - Operation, arguments, ceilings, and the rows to resolve with.
 * @returns Whatever the policy resolved to.
 */
async function guarded(input: {
  readonly model: string;
  readonly operation: string;
  readonly args: Record<string, unknown>;
  readonly relationCeiling?: number;
  readonly findManyCeiling?: number;
  readonly resolveWith: unknown;
  readonly observedArgs?: Record<string, unknown>[];
}): Promise<unknown> {
  return runGuardedOperation({
    model: input.model,
    operation: input.operation,
    args: input.args,
    findManyCeiling: input.findManyCeiling ?? DEFAULT_FIND_MANY_TAKE,
    relationCeiling: input.relationCeiling,
    query: (args) => {
      input.observedArgs?.push(args);
      return Promise.resolve(input.resolveWith);
    },
  });
}

/** `count` rows, enough to make an array of the right length. */
function rows(count: number): { id: number }[] {
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

describe('runGuardedOperation with the relation ceiling enforced', () => {
  it('refuses a relation list that came back over the ceiling rather than truncating it', async () => {
    await expect(
      guarded({
        model: 'AlpacaAccount',
        operation: 'findUnique',
        args: { where: { id: ID }, include: { alerts: true } },
        relationCeiling: 10,
        resolveWith: { id: ID, alerts: rows(11) },
      })
    ).rejects.toBeInstanceOf(RelationReadTooLargeError);
  });

  it('names the model, the relation path and the ceiling in the refusal', async () => {
    let error: RelationReadTooLargeError | undefined;
    try {
      await guarded({
        model: 'AlpacaAccount',
        operation: 'findUnique',
        args: { where: { id: ID }, include: { alerts: true } },
        relationCeiling: 10,
        resolveWith: { id: ID, alerts: rows(11) },
      });
    } catch (thrown) {
      error = thrown as RelationReadTooLargeError;
    }

    expect(error).toBeInstanceOf(RelationReadTooLargeError);
    if (!error) throw new Error('unreachable');
    expect(error.model).toBe('AlpacaAccount');
    expect(error.relationPath).toBe('alerts');
    expect(error.ceiling).toBe(10);
  });

  it('refuses a FLUENT relation load, whose result arrives with its parent stripped off', async () => {
    // The fluent chain resolves to the relation's rows, not to a Trade. A
    // check that only understood the parent-shaped result would pass here
    // while covering nothing — which is the shape of the original defect.
    await expect(
      guarded({
        model: 'Trade',
        operation: 'findUnique',
        args: { where: { id: ID }, select: { actions: true } },
        relationCeiling: 10,
        resolveWith: rows(11),
      })
    ).rejects.toBeInstanceOf(RelationReadTooLargeError);
  });

  it('refuses a relation loaded once per row of a findMany', async () => {
    await expect(
      guarded({
        model: 'Trade',
        operation: 'findMany',
        args: { include: { actions: true } },
        relationCeiling: 10,
        resolveWith: [
          { id: 'a', actions: rows(1) },
          { id: 'b', actions: rows(11) },
        ],
      })
    ).rejects.toBeInstanceOf(RelationReadTooLargeError);
  });

  it('returns a relation list AT the ceiling unchanged', async () => {
    const result = await guarded({
      model: 'AlpacaAccount',
      operation: 'findUnique',
      args: { where: { id: ID }, include: { alerts: true } },
      relationCeiling: 10,
      resolveWith: { id: ID, alerts: rows(10) },
    });
    expect((result as { alerts: unknown[] }).alerts).toHaveLength(10);
  });

  it('does not refuse a list the caller bounded itself', async () => {
    const result = await guarded({
      model: 'AlpacaAccount',
      operation: 'findUnique',
      args: { where: { id: ID }, include: { alerts: { take: 99 } } },
      relationCeiling: 10,
      resolveWith: { id: ID, alerts: rows(99) },
    });
    expect((result as { alerts: unknown[] }).alerts).toHaveLength(99);
  });
});

describe('runGuardedOperation while only observing', () => {
  beforeEach(() => {
    resetOversizeRelationReports();
  });

  it('passes the arguments through byte-identically', async () => {
    const observed: Record<string, unknown>[] = [];
    const args = { where: { id: ID }, include: { alerts: true } };
    await guarded({
      model: 'AlpacaAccount',
      operation: 'findUnique',
      args,
      resolveWith: { id: ID, alerts: rows(3) },
      observedArgs: observed,
    });
    expect(observed[0]).toEqual(args);
  });

  it('returns every row of an oversized relation rather than shortening it', async () => {
    const result = await guarded({
      model: 'AlpacaAccount',
      operation: 'findUnique',
      args: { where: { id: ID }, include: { alerts: true } },
      findManyCeiling: 10,
      resolveWith: { id: ID, alerts: rows(40) },
    });
    expect((result as { alerts: unknown[] }).alerts).toHaveLength(40);
  });

  it('still caps a top-level findMany that states no take', async () => {
    const observed: Record<string, unknown>[] = [];
    await guarded({
      model: 'Trade',
      operation: 'findMany',
      args: { where: { alpacaAccountId: ID } },
      findManyCeiling: 25,
      resolveWith: rows(3),
      observedArgs: observed,
    });
    expect(observed[0].take).toBe(25);
  });

  it('honours an explicit take on a top-level findMany', async () => {
    const observed: Record<string, unknown>[] = [];
    await guarded({
      model: 'Trade',
      operation: 'findMany',
      args: { take: 7 },
      findManyCeiling: 25,
      resolveWith: rows(7),
      observedArgs: observed,
    });
    expect(observed[0].take).toBe(7);
  });
});
