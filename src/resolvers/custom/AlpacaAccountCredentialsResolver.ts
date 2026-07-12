import * as TypeGraphQL from 'type-graphql';
import type { PrismaClient } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { Counter } from 'prom-client';
import { AlpacaAccountCredentials } from './AlpacaAccountCredentials';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { metricsRegistry } from '../../config/metrics';
import { logger } from '../../utils/logger';

/**
 * GraphQL resolver context consumed by {@link AlpacaAccountCredentialsResolver}.
 *
 * `principal` is the verified {@link BackendPrincipal} attached to the context in
 * `server.ts` (`null`/`undefined` for an unauthenticated caller). `prisma` is the
 * shared global client. This is the same context shape every custom resolver and
 * the tenancy-scoping / authChecker middleware read.
 */
export interface AlpacaAccountCredentialsContext {
  prisma: PrismaClient;
  principal?: BackendPrincipal | null;
}

/**
 * Outcome label for {@link alpacaCredentialAccessTotal}. `granted` is emitted for
 * a successful server-principal read; `denied_non_server` for any non-server (or
 * unauthenticated) caller that is rejected; `not_found` when the server principal
 * requested credentials for an account id that does not exist.
 */
type CredentialAccessOutcome = 'granted' | 'denied_non_server' | 'not_found';

/**
 * Counts calls to the server-only `alpacaAccountCredentials` query by outcome.
 *
 * This is the observability signal that proves, once the engine migrates onto
 * this path, that credential reads originate ONLY from the server principal — any
 * `denied_non_server` sample indicates a misdirected or hostile caller reaching
 * the credential surface. It carries no account id or secret material, only the
 * discriminated outcome.
 */
export const alpacaCredentialAccessTotal = new Counter({
  name: 'cortex_alpaca_credential_access_total',
  help: 'Calls to the server-only alpacaAccountCredentials query, by outcome',
  labelNames: ['outcome'] as const,
  registers: [metricsRegistry],
});

/**
 * Whether the given principal is the trusted server-to-server caller. Mirrors the
 * `server`-kind bypass in {@link cortexAuthChecker} and the tenancy-scoping
 * middleware: only `{ kind: 'server' }` — established by an exact
 * `SERVER_AUTH_TOKEN` match in {@link verifyBackendToken} — is a server principal.
 *
 * @param principal - The verified principal, or `null`/`undefined` when the caller
 *   presented no (or an unverifiable) token.
 * @returns `true` only for a `server`-kind principal.
 */
export function isServerPrincipal(
  principal: BackendPrincipal | null | undefined
): principal is { kind: 'server' } {
  return principal?.kind === 'server';
}

/**
 * CORTEX-P0-001 (phase-2 readiness) — server-only Alpaca credential resolver.
 *
 * Exposes a single `alpacaAccountCredentials(accountId)` query that returns the
 * Alpaca API key/secret for an account ONLY to the engine's `server` principal.
 * This is the dedicated, principal-gated fetch path the engine will switch to;
 * once it does, the ordinary `AlpacaAccount.APIKey` / `APISecret` fields become
 * excisable (GQL.SKIP + regenerate) in a separate, later PR. This resolver does
 * NOT remove or alter those existing fields, and the engine is NOT wired to this
 * query here — both are deliberately deferred to their own change sets.
 *
 * SECURITY CONTRACT — the gate is enforced in-resolver and fails CLOSED,
 * independent of the (still shadow-mode, default-off) CORTEX authChecker: a
 * non-server or unauthenticated caller receives a `FORBIDDEN` error and NEVER any
 * credential bytes. Because the gate does not rely on an `@Authorized()`
 * decorator, it is active the moment this resolver is registered — it is not
 * itself gated behind any enforcement flag.
 */
@TypeGraphQL.Resolver((_of) => AlpacaAccountCredentials)
export class AlpacaAccountCredentialsResolver {
  /**
   * Fetch the Alpaca API credentials for a single account. Server-principal only.
   *
   * @param accountId - The `AlpacaAccount.id` whose credentials are requested.
   * @param ctx - Resolver context carrying the verified principal and Prisma client.
   * @returns The account's credential material, or `null` when no account with
   *   that id exists.
   * @throws {GraphQLError} `FORBIDDEN` when the caller is not the server principal.
   */
  @TypeGraphQL.Query((_returns) => AlpacaAccountCredentials, {
    nullable: true,
    description:
      'Server-only: resolve Alpaca API credentials for an account. Requires the server principal; all other callers are rejected with FORBIDDEN.',
  })
  async alpacaAccountCredentials(
    @TypeGraphQL.Arg('accountId', (_type) => String) accountId: string,
    @TypeGraphQL.Ctx() ctx: AlpacaAccountCredentialsContext
  ): Promise<AlpacaAccountCredentials | null> {
    const principal = ctx.principal ?? null;

    if (!isServerPrincipal(principal)) {
      alpacaCredentialAccessTotal.inc({ outcome: 'denied_non_server' });
      logger.warn(
        '[cortex-credentials] denied non-server access to alpacaAccountCredentials',
        {
          principalKind: principal?.kind ?? 'none',
        }
      );
      throw new GraphQLError(
        'alpacaAccountCredentials is restricted to the server principal',
        {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        }
      );
    }

    const account = await ctx.prisma.alpacaAccount.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        type: true,
        APIKey: true,
        APISecret: true,
      },
    });

    if (!account) {
      alpacaCredentialAccessTotal.inc({ outcome: 'not_found' });
      logger.warn(
        '[cortex-credentials] server requested credentials for unknown account',
        { accountId }
      );
      return null;
    }

    alpacaCredentialAccessTotal.inc({ outcome: 'granted' });
    logger.info('[cortex-credentials] server credential read', {
      accountId: account.id,
    });

    return {
      accountId: account.id,
      type: account.type,
      APIKey: account.APIKey,
      APISecret: account.APISecret,
    };
  }
}
