import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GraphQLError } from 'graphql';
import type { PrismaClient } from '@prisma/client';
import {
  AlpacaAccountCredentialsResolver,
  isServerPrincipal,
  alpacaCredentialAccessTotal,
  type AlpacaAccountCredentialsContext,
} from '../AlpacaAccountCredentialsResolver';
import type { BackendPrincipal } from '../../../auth/token-verifier';

/**
 * CORTEX-P0-001 (phase-2 readiness) unit tests for the server-only Alpaca
 * credential resolver.
 *
 * The security-critical property is the server-principal gate: the credential
 * material MUST be returned ONLY to a `{ kind: 'server' }` principal, and EVERY
 * other caller (user, admin, unauthenticated) MUST be rejected with a FORBIDDEN
 * error before Prisma is ever touched. These properties are the precondition for
 * migrating the engine onto this path and subsequently excising the ordinary
 * APIKey/APISecret fields, so they are proven in isolation here.
 */

const ACCOUNT_ID = '11111111-1111-1111-1111-111111111111';
const USER_SUB = '99999999-9999-9999-9999-999999999999';

const SERVER_PRINCIPAL: BackendPrincipal = { kind: 'server' };
const USER_PRINCIPAL: BackendPrincipal = {
  kind: 'user',
  sub: USER_SUB,
  roles: ['user'],
};
const ADMIN_PRINCIPAL: BackendPrincipal = {
  kind: 'admin',
  sub: USER_SUB,
  roles: ['admin'],
};

interface AlpacaAccountRow {
  id: string;
  type: string;
  APIKey: string;
  APISecret: string;
}

/**
 * Build a resolver context with a stubbed Prisma client whose
 * `alpacaAccount.findUnique` resolves to the supplied row (or `null`). The mock
 * is returned so tests can assert whether the DB was reached.
 */
function buildContext(
  principal: BackendPrincipal | null,
  row: AlpacaAccountRow | null
): {
  ctx: AlpacaAccountCredentialsContext;
  findUnique: ReturnType<typeof vi.fn>;
} {
  const findUnique = vi.fn().mockResolvedValue(row);
  const prisma = {
    alpacaAccount: { findUnique },
  } as unknown as PrismaClient;
  return { ctx: { prisma, principal }, findUnique };
}

/** Read the current value of the access counter for a given outcome label. */
async function accessCount(outcome: string): Promise<number> {
  const metric = await alpacaCredentialAccessTotal.get();
  const sample = metric.values.find((v) => v.labels.outcome === outcome);
  return sample?.value ?? 0;
}

describe('isServerPrincipal', () => {
  it('is true only for a server-kind principal', () => {
    expect(isServerPrincipal(SERVER_PRINCIPAL)).toBe(true);
    expect(isServerPrincipal(USER_PRINCIPAL)).toBe(false);
    expect(isServerPrincipal(ADMIN_PRINCIPAL)).toBe(false);
    expect(isServerPrincipal(null)).toBe(false);
    expect(isServerPrincipal(undefined)).toBe(false);
  });
});

describe('AlpacaAccountCredentialsResolver.alpacaAccountCredentials', () => {
  let resolver: AlpacaAccountCredentialsResolver;

  beforeEach(() => {
    resolver = new AlpacaAccountCredentialsResolver();
  });

  it('returns credentials for a server principal', async () => {
    const row: AlpacaAccountRow = {
      id: ACCOUNT_ID,
      type: 'LIVE',
      APIKey: 'AK-live-key',
      APISecret: 'AK-live-secret',
    };
    const before = await accessCount('granted');
    const { ctx, findUnique } = buildContext(SERVER_PRINCIPAL, row);

    const result = await resolver.alpacaAccountCredentials(ACCOUNT_ID, ctx);

    expect(result).toEqual({
      accountId: ACCOUNT_ID,
      type: 'LIVE',
      APIKey: 'AK-live-key',
      APISecret: 'AK-live-secret',
    });
    expect(findUnique).toHaveBeenCalledOnce();
    expect(await accessCount('granted')).toBe(before + 1);
  });

  it('returns null when the server principal requests an unknown account', async () => {
    const before = await accessCount('not_found');
    const { ctx, findUnique } = buildContext(SERVER_PRINCIPAL, null);

    const result = await resolver.alpacaAccountCredentials(ACCOUNT_ID, ctx);

    expect(result).toBeNull();
    expect(findUnique).toHaveBeenCalledOnce();
    expect(await accessCount('not_found')).toBe(before + 1);
  });

  it('rejects a user principal with FORBIDDEN and never touches Prisma', async () => {
    const before = await accessCount('denied_non_server');
    const { ctx, findUnique } = buildContext(USER_PRINCIPAL, null);

    await expect(
      resolver.alpacaAccountCredentials(ACCOUNT_ID, ctx)
    ).rejects.toThrowError(GraphQLError);
    expect(findUnique).not.toHaveBeenCalled();
    expect(await accessCount('denied_non_server')).toBe(before + 1);
  });

  it('rejects an admin principal (admin is not server)', async () => {
    const { ctx, findUnique } = buildContext(ADMIN_PRINCIPAL, null);

    await expect(
      resolver.alpacaAccountCredentials(ACCOUNT_ID, ctx)
    ).rejects.toMatchObject({ extensions: { code: 'FORBIDDEN' } });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('rejects an unauthenticated (null principal) caller', async () => {
    const { ctx, findUnique } = buildContext(null, null);

    await expect(
      resolver.alpacaAccountCredentials(ACCOUNT_ID, ctx)
    ).rejects.toMatchObject({ extensions: { code: 'FORBIDDEN' } });
    expect(findUnique).not.toHaveBeenCalled();
  });
});
