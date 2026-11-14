import 'reflect-metadata';
import { describe, it, expect, vi } from 'vitest';
import { GraphQLError } from 'graphql';

import type { BackendPrincipal } from '../../../auth/token-verifier';
import { UserTotpResolver } from '../UserTotpResolver';

/**
 * `userTotpStatus` answers whether a user's second factor is enrolled and
 * confirmed, for the service principal only, and never loads secret material.
 * The Prisma client is supplied through the GraphQL context
 * (`getPrismaFromContext` reads `ctx.prisma`).
 */

const USER_ID = '11111111-1111-4111-8111-111111111111';
const SERVER: BackendPrincipal = { kind: 'server' };
const USER: BackendPrincipal = { kind: 'user', sub: USER_ID, roles: [] };
const ADMIN: BackendPrincipal = { kind: 'admin', sub: USER_ID, roles: ['admin'] };

function makePrisma(row: { enabledAt: Date | null } | null) {
  return { userTotp: { findUnique: vi.fn().mockResolvedValue(row) } };
}

const resolver = new UserTotpResolver();

async function codeOf(run: () => Promise<unknown>): Promise<unknown> {
  try {
    await run();
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(GraphQLError);
    return (error as GraphQLError).extensions.code;
  }
  return 'resolved';
}

describe('userTotpStatus', () => {
  it('reports no enrolment when the user has no row', async () => {
    const prisma = makePrisma(null);
    await expect(
      resolver.userTotpStatus(USER_ID, { principal: SERVER, prisma })
    ).resolves.toEqual({ enrolled: false, enabled: false, enabledAt: null });
  });

  it('reports a pending enrolment as enrolled but not enabled', async () => {
    const prisma = makePrisma({ enabledAt: null });
    await expect(
      resolver.userTotpStatus(USER_ID, { principal: SERVER, prisma })
    ).resolves.toEqual({ enrolled: true, enabled: false, enabledAt: null });
  });

  it('reports a confirmed enrolment as enabled, with when', async () => {
    const at = new Date('2026-11-14T09:30:00.000Z');
    const prisma = makePrisma({ enabledAt: at });
    await expect(
      resolver.userTotpStatus(USER_ID, { principal: SERVER, prisma })
    ).resolves.toEqual({ enrolled: true, enabled: true, enabledAt: at });
  });

  it('selects only enabledAt, so no secret material is loaded', async () => {
    const prisma = makePrisma({ enabledAt: null });
    await resolver.userTotpStatus(USER_ID, { principal: SERVER, prisma });
    expect(prisma.userTotp.findUnique).toHaveBeenCalledWith({
      where: { userId: USER_ID },
      select: { enabledAt: true },
    });
  });

  it('refuses a user, an admin and an unauthenticated caller without reading', async () => {
    for (const [principal, code] of [
      [USER, 'FORBIDDEN'],
      [ADMIN, 'FORBIDDEN'],
      [null, 'UNAUTHENTICATED'],
    ] as const) {
      const prisma = makePrisma({ enabledAt: new Date() });
      expect(
        await codeOf(() =>
          resolver.userTotpStatus(USER_ID, { principal, prisma })
        )
      ).toBe(code);
      expect(prisma.userTotp.findUnique).not.toHaveBeenCalled();
    }
  });
});
