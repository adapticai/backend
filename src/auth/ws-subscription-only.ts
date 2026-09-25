/**
 * The `/subscriptions` WebSocket carries subscriptions only.
 *
 * graphql-ws executes whatever operation a Subscribe message carries: a
 * subscription through `subscribe`, a query or a mutation through `execute`.
 * That execution happens outside Apollo's request pipeline, so a query or
 * mutation sent over the socket skips everything the pipeline applies to the
 * same operation over HTTP: the mutation audit trail, the input-validation
 * plugin, the query depth and complexity limits and the GraphQL rate limiter.
 * The socket exists because only it can deliver a subscription; queries and
 * mutations have `POST /graphql`, where all of those apply. So a query or
 * mutation arriving here is refused before anything about it runs: graphql-ws
 * builds no context and calls no resolver, and the caller receives a
 * graphql-ws Error message that names the HTTP endpoint.
 *
 * Every refusal is counted on `graphql_ws_operation_refused_total`. The log
 * line names the operation's type and name and the connection it came from,
 * never its variables, and is throttled per caller and operation per window in
 * the same way as the other guard decision logs, so a caller repeating one
 * refused operation cannot flood the log. The counter still counts every one.
 *
 * @module auth/ws-subscription-only
 */
import { getOperationAST, GraphQLError, parse } from 'graphql';
import type { SubscribeMessage } from 'graphql-ws';
import { Counter } from 'prom-client';

import { metricsRegistry } from '../config/metrics';
import { GuardLogThrottle } from '../middleware/guard-log-throttle';
import { logger } from '../utils/logger';
import { extractHeaderIdentityFromWsExtra } from './graphql-auth-shadow';

/** `extensions.code` on the error a refused operation receives. */
export const WS_OPERATION_REFUSED_CODE = 'OPERATION_NOT_SUPPORTED_OVER_WEBSOCKET';

/** Queries and mutations refused on the socket, by operation type. */
export const wsOperationRefusedTotal = new Counter({
  name: 'graphql_ws_operation_refused_total',
  help:
    'Queries and mutations refused on the /subscriptions WebSocket, by operation type. ' +
    'The socket carries subscriptions only; queries and mutations are served over HTTP /graphql.',
  labelNames: ['operation_type'] as const,
  registers: [metricsRegistry],
});

/** Longest caller-supplied value (operation name, origin, user agent) logged. */
const MAX_ATTRIBUTION_LENGTH = 256;

/** Throttle window for the refusal log line, per caller and operation. */
const LOG_THROTTLE_MS = 10 * 60 * 1000;

/**
 * Distinct caller keys one connection address may log per window. Well above
 * the handful of clients one edge address carries; an address that spends it
 * is rotating caller-supplied values, and the overflow notice says so.
 */
const LOG_KEYS_PER_SCOPE = 256;

/** Distinct connection addresses the throttle tracks per window. */
const LOG_MAX_SCOPES = 64;

const logThrottle = new GuardLogThrottle({
  windowMs: LOG_THROTTLE_MS,
  keysPerScope: LOG_KEYS_PER_SCOPE,
  maxScopes: LOG_MAX_SCOPES,
});

/** The slice of the graphql-ws connection context the refusal reads. */
export interface WsConnectionContext {
  /** `{ socket, request }` for the `ws` integration; read defensively. */
  readonly extra: unknown;
}

function bounded(value: string | undefined): string {
  return value === undefined || value === '' ? '<none>' : value.slice(0, MAX_ATTRIBUTION_LENGTH);
}

/**
 * The graphql-ws `onSubscribe` hook for `/subscriptions`: refuse any operation
 * that is not a subscription, and leave everything else to graphql-ws.
 *
 * The operation is the one graphql-ws would execute: the document's operation
 * named by `operationName`, or its only operation. A document that does not
 * parse throws here, as graphql-ws's own parse does a moment later, so the
 * socket closes exactly as it did before. An operation that cannot be
 * identified is left to graphql-ws, which reports it the way it always has.
 *
 * @param ctx - The graphql-ws connection context
 * @param message - The Subscribe message
 * @returns The refusal for a query or mutation; nothing for a subscription
 */
export function refuseNonSubscriptionOperation(
  ctx: WsConnectionContext,
  message: SubscribeMessage
): GraphQLError[] | undefined {
  const { query, operationName } = message.payload;
  const operation = getOperationAST(parse(query), operationName);
  if (!operation || operation.operation === 'subscription') return undefined;

  const operationType = operation.operation;
  wsOperationRefusedTotal.inc({ operation_type: operationType });
  logRefusal(ctx, operationType, operation.name?.value);

  return [
    new GraphQLError(
      `A ${operationType} cannot be sent over the /subscriptions WebSocket, which carries ` +
        'subscriptions only. Send queries and mutations to POST /graphql.',
      { extensions: { code: WS_OPERATION_REFUSED_CODE } }
    ),
  ];
}

/** Write the refusal line, or the connection's overflow notice, if the throttle admits it. */
function logRefusal(
  ctx: WsConnectionContext,
  operationType: string,
  operationName: string | undefined
): void {
  const identity = extractHeaderIdentityFromWsExtra(ctx.extra);
  const scope = bounded(identity.ip);
  const name = bounded(operationName);
  const origin = bounded(identity.origin);
  const userAgent = bounded(identity.userAgent);

  const verdict = logThrottle.admit(
    scope,
    [operationType, name, origin, userAgent].join('|'),
    Date.now()
  );
  if (verdict.action === 'log') {
    logger.warn('[ws] refused a non-subscription operation on /subscriptions', {
      operationType,
      operationName: name,
      ip: scope,
      origin,
      userAgent,
      dedupWindowMs: LOG_THROTTLE_MS,
    });
  } else if (verdict.action === 'overflow') {
    logger.warn('[ws] refusal log budget spent for a connection address', {
      scope: verdict.scope,
      keysPerScope: LOG_KEYS_PER_SCOPE,
      dedupWindowMs: LOG_THROTTLE_MS,
      consequence:
        'further distinct refused operations from this address are not logged until the ' +
        'window ends; graphql_ws_operation_refused_total still counts every refusal',
    });
  }
}

/** Forget the refusal log throttle's state (tests). */
export function resetWsRefusalLogThrottle(): void {
  logThrottle.reset();
}
