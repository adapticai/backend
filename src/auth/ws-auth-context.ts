/**
 * WebSocket connection-auth decision for the `/subscriptions` transport.
 *
 * graphql-ws invokes the `context` callback lazily, on Subscribe. Whatever that
 * callback throws terminates the socket: graphql-ws catches it in its message
 * handler and closes with `CloseCode.InternalServerError` (4500), carrying the
 * error message as the close reason. There is deliberately no path that keeps
 * an unverified socket open with a degraded context — a subscription that
 * streams data to a caller whose token did not verify is an authentication
 * bypass, not a degraded mode.
 *
 * The decision is separated from its effects (metrics, logging, Prisma
 * attachment) so the security-relevant predicate is a pure function that can be
 * exercised, and mutation-proven, without booting the server.
 */
import { GraphQLError } from 'graphql';
import {
  verifyBackendToken,
  AuthError,
  type AuthErrorReason,
  type BackendPrincipal,
} from './token-verifier';

/**
 * Outcome of evaluating a WebSocket connection's `authorization` parameter.
 *
 * - `anonymous`: no bearer token presented. The socket opens with a null
 *   principal; the AuthChecker rejects any operation that requires one.
 * - `authenticated`: the token verified to a `BackendPrincipal`.
 * - `rejected`: a token was presented and failed verification. The caller MUST
 *   throw so graphql-ws closes the socket.
 */
export type WsAuthDecision =
  | { kind: 'anonymous' }
  | { kind: 'authenticated'; principal: BackendPrincipal }
  | { kind: 'rejected'; reason: AuthErrorReason };

/**
 * Token verification entry point. Injectable so callers can exercise the
 * decision without provisioning real signing keys.
 */
export type TokenVerifier = (token: string) => Promise<BackendPrincipal>;

/**
 * Extract the raw token from an `Authorization` value. Returns the empty string
 * for anything that is not a well-formed `Bearer <token>` header, which the
 * caller treats as "no token presented" rather than as a malformed token.
 */
export function parseBearerToken(authHeader: string | undefined): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice('Bearer '.length).trim();
}

/**
 * Classify a WebSocket connection's credentials.
 *
 * A presented-but-unverifiable token always yields `rejected`, never
 * `anonymous`. Downgrading a failed verification to an anonymous session would
 * convert an authentication failure into a weaker session that still serves
 * data — the bypass this function exists to make unrepresentable.
 *
 * Verification failures that are not `AuthError` are classified
 * `bad_signature` rather than escaping, so an unexpected verifier fault still
 * fails closed (socket closed) instead of surfacing as an unhandled rejection.
 */
export async function decideWsAuth(
  authHeader: string | undefined,
  verify: TokenVerifier = verifyBackendToken
): Promise<WsAuthDecision> {
  const token = parseBearerToken(authHeader);
  if (!token) return { kind: 'anonymous' };

  try {
    const principal = await verify(token);
    return { kind: 'authenticated', principal };
  } catch (e) {
    const reason: AuthErrorReason =
      e instanceof AuthError ? e.reason : 'bad_signature';
    return { kind: 'rejected', reason };
  }
}

/**
 * The error a rejected WebSocket connection throws from its `context` callback.
 *
 * `extensions.http.status` is carried for symmetry with the HTTP context: the
 * WebSocket transport closes rather than producing an HTTP response, but any
 * future code that funnels a WS rejection into an HTTP reply gets the correct
 * status without a second definition of it.
 */
export function unauthenticatedWsError(reason: AuthErrorReason): GraphQLError {
  return new GraphQLError('Unauthenticated', {
    extensions: {
      code: 'UNAUTHENTICATED',
      reason,
      http: { status: 401 },
    },
  });
}
