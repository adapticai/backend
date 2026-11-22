import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Trade } from '../Trade';
import type {
  ApolloClientType,
  NormalizedCacheObject,
} from '../client';
import type { Trade as TradeType } from '../generated/typegraphql-prisma/models/Trade';

/**
 * The bounded-window capability on the generated per-account history read.
 *
 * An unfiltered `trade.findMany({ alpacaAccountId })` returns every trade the
 * account has ever had. Measured against production on 2026-09-22 that is
 * 10,605 rows / 32.9 MB / 15.8 s for the largest book, and a caller that needs
 * only the current session pays all of it — which is what pushed the engine's
 * 8 s execution-history budget past its deadline into its fail-closed branch
 * and withheld entries.
 *
 * Two properties have to hold together, and they pull in opposite directions:
 *
 *  1. A caller CAN bound the read, and the bound reaches the DATABASE. A limit
 *     applied after the rows arrive saves nothing, because the rows are the
 *     cost. So the assertion is on the GraphQL document and its variables —
 *     the only thing the server can turn into `LIMIT` / `ORDER BY` / a `WHERE`
 *     predicate — not on the returned array's length, which a JS `slice` would
 *     satisfy just as well while changing nothing.
 *
 *  2. A caller that does NOT ask for a bound is not given one. Reconciliation
 *     and realised-P&L reads need whole history; silently truncating them would
 *     corrupt accounting, which is strictly worse than the slow query this
 *     change exists to fix. So the unbounded call must emit a document with no
 *     limiting argument anywhere in it.
 */

/** Captures what the generated CRUD function actually sent to the transport. */
interface CapturedQuery {
  readonly body: string;
  readonly variables: Record<string, unknown>;
}

/**
 * Minimal Apollo stand-in that records one query and returns an empty result.
 *
 * The generated functions accept an injected client, so no network, no schema
 * and no database are involved: the subject under test is the document the
 * function builds, which is exactly the artifact that decides whether the bound
 * is pushed down or not.
 *
 * @param captured - Array the observed query is appended to.
 * @returns A client object usable as the `globalClient` argument.
 */
function stubClient(
  captured: CapturedQuery[]
): ApolloClientType<NormalizedCacheObject> {
  const client = {
    query: (options: {
      query: { loc?: { source: { body: string } } };
      variables?: Record<string, unknown>;
    }): Promise<{ data: Record<string, unknown> }> => {
      captured.push({
        body: options.query.loc?.source.body ?? '',
        variables: options.variables ?? {},
      });
      return Promise.resolve({ data: { trades: [] } });
    },
  };
  return client as unknown as ApolloClientType<NormalizedCacheObject>;
}

const ACCOUNT_ID = 'fdb76913-d261-4797-947c-4077bf0a770c';

/** Arguments that limit a read; none of these may appear in an unbounded call. */
const LIMITING_TOKENS = ['take', 'skip', 'orderBy'] as const;

describe('Trade.findMany bounded-window reads', () => {
  it('pushes take and orderBy into the document and the variables, so the bound reaches Postgres', async () => {
    const captured: CapturedQuery[] = [];
    const since = new Date('2026-09-20T13:30:00.000Z').toISOString();

    await Trade.findMany(
      {} as TradeType,
      stubClient(captured),
      {
        alpacaAccountId: { equals: ACCOUNT_ID },
        createdAt: { gte: since },
      },
      { orderBy: { createdAt: 'desc' }, take: 500 }
    );

    expect(captured).toHaveLength(1);
    const [sent] = captured;

    // The document must DECLARE and USE the limiting arguments. A server can
    // only translate them into LIMIT/ORDER BY if they are in the query itself.
    expect(sent.body).toContain('$take: Int');
    expect(sent.body).toContain('$orderBy: [TradeOrderByWithRelationInput!]');
    expect(sent.body).toContain('take: $take');
    expect(sent.body).toContain('orderBy: $orderBy');

    // ...and the values must actually be sent.
    expect(sent.variables.take).toBe(500);
    expect(sent.variables.orderBy).toEqual({ createdAt: 'desc' });

    // The window predicate is a WHERE on an indexed timestamp column, not a
    // post-fetch filter: it travels inside `where`, which the resolver hands
    // straight to Prisma.
    expect(sent.variables.where).toEqual({
      alpacaAccountId: { equals: ACCOUNT_ID },
      createdAt: { gte: since },
    });
  });

  it('emits no limiting argument at all when the caller does not ask for one', async () => {
    const captured: CapturedQuery[] = [];

    await Trade.findMany({} as TradeType, stubClient(captured), {
      alpacaAccountId: { equals: ACCOUNT_ID },
    });

    expect(captured).toHaveLength(1);
    const [sent] = captured;

    // Everything between `query findManyTrade` and the opening brace of the
    // field selection is the operation signature plus the field arguments —
    // the only place a limit could be introduced. Checking the whole document
    // would false-positive on a model field that happens to be called `take`.
    const header = sent.body.slice(0, sent.body.indexOf('{', sent.body.indexOf('trades')));
    for (const token of LIMITING_TOKENS) {
      expect(header).not.toContain(token);
    }
    for (const token of LIMITING_TOKENS) {
      expect(sent.variables[token]).toBeUndefined();
    }
  });

  it('omits the arguments the caller left out, so a take-only call carries no orderBy', async () => {
    const captured: CapturedQuery[] = [];

    await Trade.findMany(
      {} as TradeType,
      stubClient(captured),
      { alpacaAccountId: { equals: ACCOUNT_ID } },
      { take: 200 }
    );

    const [sent] = captured;
    expect(sent.body).toContain('$take: Int');
    expect(sent.body).not.toContain('$orderBy');
    expect(sent.body).not.toContain('$skip');
    expect(sent.variables.orderBy).toBeUndefined();
    expect(sent.variables.skip).toBeUndefined();
  });
});

describe('Trade.getAll bounded reads', () => {
  it('bounds the whole-table read when asked, and leaves it unbounded when not', async () => {
    const bounded: CapturedQuery[] = [];
    await Trade.getAll(stubClient(bounded), {
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    expect(bounded[0].body).toContain(
      'query getAllTrade($orderBy: [TradeOrderByWithRelationInput!], $take: Int)'
    );
    expect(bounded[0].body).toContain('trades(orderBy: $orderBy, take: $take)');
    expect(bounded[0].variables).toEqual({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const unbounded: CapturedQuery[] = [];
    await Trade.getAll(stubClient(unbounded));
    // No argument list at all — the operation and the field are bare, exactly
    // as they were before the option existed.
    expect(unbounded[0].body).toContain('query getAllTrade {');
    expect(unbounded[0].body).toContain('trades {');
    expect(unbounded[0].variables).toEqual({});
  });
});

describe('trades composite index backing the bounded window', () => {
  const ROOT = join(__dirname, '..', '..');

  it('declares the (alpacaAccountId, createdAt) index in the Prisma schema', () => {
    const schema = readFileSync(join(ROOT, 'prisma', 'schema.prisma'), 'utf8');
    const tradeModel = schema.slice(
      schema.indexOf('\nmodel Trade {'),
      schema.indexOf('@@map(name: "trades")')
    );
    expect(tradeModel).toContain('@@index([alpacaAccountId, createdAt])');
  });

  it('ships the matching migration, idempotently and on the mapped table name', () => {
    const sql = readFileSync(
      join(
        ROOT,
        'prisma',
        'migrations',
        '20260923000000_add_trade_account_created_at_index',
        'migration.sql'
      ),
      'utf8'
    );
    const statements = sql
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('--'))
      .join('\n');

    expect(statements).toContain(
      'CREATE INDEX IF NOT EXISTS "trades_alpacaAccountId_createdAt_idx" ON "trades"("alpacaAccountId", "createdAt")'
    );
    // DDL only. `prisma migrate deploy` runs unattended at container start, so
    // a data statement here would run against production with no review.
    expect(statements).not.toMatch(/\b(INSERT|UPDATE|DELETE)\b/i);
  });
});
