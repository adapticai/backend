/**
 * A reserved column re-sent unchanged by the generated update client is the
 * identity and is dropped before the guard decides; a changed one is left for
 * the guard to refuse, and the service and admins are never touched. The
 * served half (a user's echoed update admitted, a changed kind refused, the
 * service still setting kind and scope) is `src/tests/office-entity-scope.test.ts`.
 */
import { describe, expect, it } from 'vitest';

import {
  dropEchoedReservedColumns,
  echoedReservedKeys,
  type EchoRowReader,
} from '../reserved-column-echo';

const UPDATE_ONE = {
  model: 'Organization',
  action: 'update',
  cardinality: 'one',
} as const;

function reader(
  row: Record<string, unknown> | null,
  calls: unknown[] = []
): () => EchoRowReader {
  return () => ({
    findUnique: async (args) => {
      calls.push(args);
      return row;
    },
  });
}

describe('echoedReservedKeys', () => {
  it('names a reserved set equal to the stored value, scalar or list, null included', () => {
    expect(
      echoedReservedKeys(
        'Organization',
        { kind: { set: 'MANAGER' }, name: { set: 'n' } },
        { kind: 'MANAGER' }
      )
    ).toEqual(['kind']);
    expect(
      echoedReservedKeys(
        'OrgMembership',
        { entityScopeAll: { set: false }, entityScopeIds: { set: ['a', 'b'] } },
        { entityScopeAll: false, entityScopeIds: ['a', 'b'] }
      )
    ).toEqual(['entityScopeAll', 'entityScopeIds']);
    expect(
      echoedReservedKeys(
        'Investor',
        { parentInvestorId: { set: null } },
        { parentInvestorId: null }
      )
    ).toEqual(['parentInvestorId']);
  });

  it('never names a changed value, a reordered list, a non-set operation or an unreserved column', () => {
    expect(
      echoedReservedKeys(
        'Organization',
        { kind: { set: 'ALLOCATOR_OFFICE' } },
        { kind: 'MANAGER' }
      )
    ).toEqual([]);
    expect(
      echoedReservedKeys(
        'OrgMembership',
        { entityScopeIds: { set: ['b', 'a'] } },
        { entityScopeIds: ['a', 'b'] }
      )
    ).toEqual([]);
    expect(
      echoedReservedKeys(
        'OrgMembership',
        { entityScopeIds: { push: 'a' } },
        { entityScopeIds: ['a'] }
      )
    ).toEqual([]);
    expect(
      echoedReservedKeys('Fund', { name: { set: 'n' } }, { name: 'n' })
    ).toEqual([]);
  });
});

describe('dropEchoedReservedColumns', () => {
  it("drops a user's echoed kind and keeps every other field", async () => {
    const args = {
      where: { id: 'o' },
      data: { kind: { set: 'MANAGER' }, name: { set: 'n' } },
    };
    const calls: unknown[] = [];
    await dropEchoedReservedColumns(
      { kind: 'user' },
      UPDATE_ONE,
      args,
      reader({ kind: 'MANAGER' }, calls)
    );
    expect(args.data).toEqual({ name: { set: 'n' } });
    expect(calls).toEqual([{ where: { id: 'o' }, select: { kind: true } }]);
  });

  it('leaves a changed kind for the guard to refuse', async () => {
    const args = {
      where: { id: 'o' },
      data: { kind: { set: 'ALLOCATOR_OFFICE' } },
    };
    await dropEchoedReservedColumns(
      { kind: 'user' },
      UPDATE_ONE,
      args,
      reader({ kind: 'MANAGER' })
    );
    expect(args.data).toEqual({ kind: { set: 'ALLOCATOR_OFFICE' } });
  });

  it('touches nothing for the service or an admin, a bulk write, an upsert, a missing row or a failed read', async () => {
    const payload = (): {
      where: { id: string };
      data: Record<string, unknown>;
    } => ({
      where: { id: 'o' },
      data: { kind: { set: 'MANAGER' } },
    });
    for (const kind of ['server', 'admin'] as const) {
      const args = payload();
      await dropEchoedReservedColumns(
        { kind },
        UPDATE_ONE,
        args,
        reader({ kind: 'MANAGER' })
      );
      expect(args.data, kind).toEqual({ kind: { set: 'MANAGER' } });
    }
    for (const target of [
      { ...UPDATE_ONE, cardinality: 'many' as const },
      { ...UPDATE_ONE, action: 'upsert' as const },
    ]) {
      const args = payload();
      await dropEchoedReservedColumns(
        { kind: 'user' },
        target,
        args,
        reader({ kind: 'MANAGER' })
      );
      expect(args.data).toEqual({ kind: { set: 'MANAGER' } });
    }
    const missing = payload();
    await dropEchoedReservedColumns(
      { kind: 'user' },
      UPDATE_ONE,
      missing,
      reader(null)
    );
    expect(missing.data).toEqual({ kind: { set: 'MANAGER' } });
    const failed = payload();
    await dropEchoedReservedColumns(
      { kind: 'user' },
      UPDATE_ONE,
      failed,
      () => ({
        findUnique: async () => {
          throw new Error('db down');
        },
      })
    );
    expect(failed.data).toEqual({ kind: { set: 'MANAGER' } });
  });
});
