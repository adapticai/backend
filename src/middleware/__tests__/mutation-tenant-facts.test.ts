/**
 * The guard's own tenancy check for a user's write to a governed model,
 * against a fake Prisma client that evaluates the scope fragment the check
 * builds. Every refusal is paired with an in-scope control.
 */
import { describe, expect, it } from 'vitest';

import { classifyMutationField } from '../../auth/mutation-authorization';
import { tenantScopeOf, type TenantScopePrisma } from '../mutation-tenant-facts';

type Row = Record<string, unknown>;

const ME = '33333333-3333-4333-8333-333333333333';
const MY_FUND = 'f-mine';
const OTHER_FUND = 'f-other';

const ROWS: Record<string, Row[]> = {
  fundAssignment: [
    { id: 'fa-mine', fundId: MY_FUND, userId: ME },
    { id: 'fa-other', fundId: OTHER_FUND, userId: 'someone-else' },
  ],
  brokerageAccount: [
    { id: 'ba-mine', fundId: MY_FUND },
    { id: 'ba-other', fundId: OTHER_FUND },
  ],
};

function matches(row: Row, where: Row): boolean {
  return Object.entries(where).every(([key, condition]) => {
    if (key === 'AND') return (condition as Row[]).every((c) => matches(row, c));
    if (key === 'OR') return (condition as Row[]).some((c) => matches(row, c));
    if (condition !== null && typeof condition === 'object' && 'in' in condition) {
      return (condition as { in: unknown[] }).in.includes(row[key]);
    }
    return row[key] === condition;
  });
}

function delegate(name: string): {
  findMany: (args: { where: Row }) => Promise<Row[]>;
  findUnique: (args: { where: Row }) => Promise<{ id: string } | null>;
} {
  const rows = ROWS[name] ?? [];
  return {
    findMany: ({ where }) => Promise.resolve(rows.filter((r) => matches(r, where))),
    findUnique: ({ where }) => {
      const row = rows.find((r) => matches(r, where));
      return Promise.resolve(row ? { id: String(row.id) } : null);
    },
  };
}

// Cast justified: the fake implements exactly the delegate methods the check
// calls, with looser argument types than the structural interface names.
const prisma = {
  organization: delegate('organization'),
  orgMembership: delegate('orgMembership'),
  fund: delegate('fund'),
  fundAssignment: delegate('fundAssignment'),
  brokerageAccount: delegate('brokerageAccount'),
  notificationEvent: delegate('notificationEvent'),
  notificationDelivery: delegate('notificationDelivery'),
  notificationPreference: delegate('notificationPreference'),
} as unknown as TenantScopePrisma;

const MODELS = new Set(['FundAssignment', 'BrokerageAccount']);
const target = (field: string): ReturnType<typeof classifyMutationField> => classifyMutationField(field, MODELS);

describe('tenantScopeOf', () => {
  it('checks a create payload\'s tenant against the caller\'s entitlement', async () => {
    const create = (fundId: string): Promise<string> =>
      tenantScopeOf(prisma, 'BrokerageAccount', target('createOneBrokerageAccount'), { data: { fund: { connect: { id: fundId } } } }, ME);
    expect(await create(MY_FUND)).toBe('in_scope');
    expect(await create(OTHER_FUND)).toBe('out_of_scope');
  });

  it('checks the addressed row of an update or delete, not just its existence', async () => {
    const update = (id: string): Promise<string> =>
      tenantScopeOf(prisma, 'BrokerageAccount', target('updateOneBrokerageAccount'), { where: { id }, data: {} }, ME);
    expect(await update('ba-mine')).toBe('in_scope');
    expect(await update('ba-other')).toBe('out_of_scope');
    expect(
      await tenantScopeOf(prisma, 'FundAssignment', target('deleteOneFundAssignment'), { where: { id: 'fa-other' } }, ME)
    ).toBe('out_of_scope');
    expect(await tenantScopeOf(prisma, 'FundAssignment', target('updateOneFundAssignment'), { data: {} }, ME)).toBe('out_of_scope');
  });

  it('refuses an upsert onto another tenant\'s existing row, whatever its create payload says', async () => {
    const upsert = (id: string, fundId: string): Promise<string> =>
      tenantScopeOf(
        prisma,
        'BrokerageAccount',
        target('upsertOneBrokerageAccount'),
        { where: { id }, create: { fund: { connect: { id: fundId } } }, update: {} },
        ME
      );
    expect(await upsert('ba-other', MY_FUND)).toBe('out_of_scope');
    expect(await upsert('ba-mine', MY_FUND)).toBe('in_scope');
    expect(await upsert('ba-new', MY_FUND)).toBe('in_scope');
    expect(await upsert('ba-new', OTHER_FUND)).toBe('out_of_scope');
  });
});
