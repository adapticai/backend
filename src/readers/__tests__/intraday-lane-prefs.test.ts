import { describe, it, expect } from 'vitest';
import type { DocumentNode } from 'graphql';
import { print } from 'graphql';

import adapticDefault, * as pkg from '../../index';
import { INTRADAY_LANE_PREFS_SELECTION, readIntradayLanePrefs } from '../intraday-lane-prefs';
import type { ApolloClientType, NormalizedCacheObject } from '../../client';

/**
 * The narrow read of TradingPolicy.intradayLanePrefs. A stub client stands in
 * for the backend. The read must select only its three fields, so a server
 * without the column fails this read alone. It must also never turn a failure
 * or an omitted field into a value.
 */

interface Captured {
  query: string;
  variables: Record<string, unknown>;
}

function stubClient(
  answer: (captured: Captured) => Promise<unknown>,
  seen: Captured[] = []
): ApolloClientType<NormalizedCacheObject> {
  return {
    query: (options: { query: DocumentNode; variables: Record<string, unknown> }): Promise<unknown> => {
      const captured = { query: print(options.query), variables: options.variables };
      seen.push(captured);
      return answer(captured);
    },
  } as unknown as ApolloClientType<NormalizedCacheObject>;
}

const ACCOUNT = '22222222-2222-4222-8222-222222222222';
const row = (prefs: unknown): Record<string, unknown> => ({ id: 'p1', alpacaAccountId: ACCOUNT, intradayLanePrefs: prefs });

describe('readIntradayLanePrefs', () => {
  it('is exported from the package root', () => {
    expect(pkg.readIntradayLanePrefs).toBe(readIntradayLanePrefs);
    expect(adapticDefault).toBeDefined();
  });

  it('selects exactly its three fields, keyed by the account', async () => {
    const seen: Captured[] = [];
    await readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: { getTradingPolicy: row(null) } }), seen));
    expect(seen).toHaveLength(1);
    expect(seen[0].variables).toEqual({ where: { alpacaAccountId: ACCOUNT } });
    const body = /getTradingPolicy\(where: \$where\) \{([^}]*)\}/.exec(seen[0].query);
    expect(body?.[1].trim().split(/\s+/)).toEqual(INTRADAY_LANE_PREFS_SELECTION.split(' '));
    expect(INTRADAY_LANE_PREFS_SELECTION).toBe('id alpacaAccountId intradayLanePrefs');
  });

  it('returns the stored value, and null preferences as null', async () => {
    const prefs = { armed: true, perLaneTradesPerDay: 3 };
    await expect(
      readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: { getTradingPolicy: row(prefs) } })))
    ).resolves.toEqual({ policyId: 'p1', alpacaAccountId: ACCOUNT, intradayLanePrefs: prefs });
    await expect(
      readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: { getTradingPolicy: row(null) } })))
    ).resolves.toEqual({ policyId: 'p1', alpacaAccountId: ACCOUNT, intradayLanePrefs: null });
  });

  it('returns null only when the account has no policy row', async () => {
    await expect(
      readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: { getTradingPolicy: null } })))
    ).resolves.toBeNull();
    await expect(
      readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.reject(new Error('No TradingPolicy found'))))
    ).resolves.toBeNull();
  });

  it('throws, never answers, when the server predates the column', async () => {
    const unknownField = new Error('Cannot query field "intradayLanePrefs" on type "TradingPolicy".');
    await expect(readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.reject(unknownField)))).rejects.toThrow(
      'Cannot query field'
    );
    await expect(
      readIntradayLanePrefs(
        ACCOUNT,
        stubClient(() => Promise.resolve({ data: null, errors: [{ message: 'Cannot query field "intradayLanePrefs"' }] }))
      )
    ).rejects.toThrow('Cannot query field');
  });

  it('throws when the answer omits the field or the policy', async () => {
    const withoutField = row(null);
    delete withoutField.intradayLanePrefs;
    await expect(
      readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: { getTradingPolicy: withoutField } })))
    ).rejects.toThrow('omits intradayLanePrefs');
    await expect(readIntradayLanePrefs(ACCOUNT, stubClient(() => Promise.resolve({ data: {} })))).rejects.toThrow(
      'no getTradingPolicy field'
    );
  });
});
