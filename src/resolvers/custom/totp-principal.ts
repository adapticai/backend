/**
 * The principal check of the TOTP mutations (`./UserTotpResolver.ts`), kept
 * free of decorators so it can be tested without TypeGraphQL's metadata.
 *
 * @module resolvers/custom/totp-principal
 */

import { GraphQLError } from 'graphql';

import type { BackendPrincipal } from '../../auth/token-verifier';

const HTTP_UNAUTHENTICATED = 401;
const HTTP_FORBIDDEN = 403;

/** Refuse any caller but the service principal. */
export function assertServicePrincipal(
  principal: BackendPrincipal | null | undefined
): void {
  if (!principal) {
    throw new GraphQLError(
      'Unauthenticated: TOTP mutations require the service principal',
      {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: HTTP_UNAUTHENTICATED },
        },
      }
    );
  }
  if (principal.kind !== 'server') {
    throw new GraphQLError(
      'Forbidden: TOTP mutations are service-principal only',
      {
        extensions: {
          code: 'FORBIDDEN',
          reason: 'service_principal_only',
          http: { status: HTTP_FORBIDDEN },
        },
      }
    );
  }
}
