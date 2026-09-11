/**
 * Tests for HTTP Status Mapper Plugin.
 *
 * The plugin's job is single-purpose: inspect the GraphQL errors in the
 * final response and upgrade `response.http.status` for well-known codes.
 * These tests assert each mapping plus the priority order (auth > forbidden
 * > bad-input) and the no-op cases (no errors, unknown codes, non-string
 * codes, incremental delivery).
 */

import { describe, it, expect } from 'vitest';
import type { GraphQLFormattedError } from 'graphql';
import { createHttpStatusMapperPlugin } from '../http-status-mapper';

/**
 * Minimal shape that satisfies the willSendResponse argument we depend on,
 * without dragging in the full GraphQLRequestContext type machinery.
 */
function makeContext(
  errors: GraphQLFormattedError[] | undefined,
  initialStatus = 200
): {
  response: {
    body:
      | { kind: 'single'; singleResult: { errors?: GraphQLFormattedError[] } }
      | { kind: 'incremental' };
    http: { status: number };
  };
} {
  return {
    response: {
      body:
        errors === undefined
          ? { kind: 'single', singleResult: {} }
          : { kind: 'single', singleResult: { errors } },
      http: { status: initialStatus },
    },
  };
}

async function invokePlugin(ctx: ReturnType<typeof makeContext>): Promise<void> {
  const plugin = createHttpStatusMapperPlugin();
  // Each lifecycle hook is optional; assert it exists before calling so a
  // future refactor that removes the listener fails the test rather than
  // silently no-opping.
  const listener = await plugin.requestDidStart!(
    // The plugin's requestDidStart implementation does not read its
    // argument, so an `as never` cast is the lowest-risk way to satisfy
    // the strict signature without inventing a fake GraphQLRequestContext.
    undefined as never
  );
  expect(listener?.willSendResponse).toBeDefined();
  await listener!.willSendResponse!(ctx as never);
}

describe('createHttpStatusMapperPlugin', () => {
  it('maps UNAUTHENTICATED to HTTP 401', async () => {
    const ctx = makeContext([
      { message: 'nope', extensions: { code: 'UNAUTHENTICATED' } },
    ]);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(401);
  });

  it('maps FORBIDDEN to HTTP 403', async () => {
    const ctx = makeContext([
      { message: 'denied', extensions: { code: 'FORBIDDEN' } },
    ]);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(403);
  });

  it('maps BAD_USER_INPUT to HTTP 400', async () => {
    const ctx = makeContext([
      { message: 'bad', extensions: { code: 'BAD_USER_INPUT' } },
    ]);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(400);
  });

  it('prefers 401 over 403 over 400 when multiple errors present', async () => {
    const ctx = makeContext([
      { message: 'bad input', extensions: { code: 'BAD_USER_INPUT' } },
      { message: 'forbidden', extensions: { code: 'FORBIDDEN' } },
      { message: 'unauth', extensions: { code: 'UNAUTHENTICATED' } },
    ]);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(401);
  });

  it('prefers 403 over 400 when no auth error present', async () => {
    const ctx = makeContext([
      { message: 'bad input', extensions: { code: 'BAD_USER_INPUT' } },
      { message: 'forbidden', extensions: { code: 'FORBIDDEN' } },
    ]);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(403);
  });

  it('leaves status untouched for unknown error codes', async () => {
    const ctx = makeContext(
      [
        {
          message: 'internal',
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        },
      ],
      500
    );
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(500);
  });

  it('is a no-op when the response has no errors array', async () => {
    const ctx = makeContext(undefined, 200);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(200);
  });

  it('is a no-op when the errors array is empty', async () => {
    const ctx = makeContext([], 200);
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(200);
  });

  it('ignores errors whose extensions.code is not a string', async () => {
    const ctx = makeContext(
      [
        {
          message: 'weird',
          extensions: { code: 401 as unknown as string },
        },
      ],
      200
    );
    await invokePlugin(ctx);
    expect(ctx.response.http.status).toBe(200);
  });

  it('does not touch the response for incremental delivery', async () => {
    const plugin = createHttpStatusMapperPlugin();
    const listener = await plugin.requestDidStart!(undefined as never);
    const ctx = {
      response: {
        body: { kind: 'incremental' } as const,
        http: { status: 200 },
      },
    };
    await listener!.willSendResponse!(ctx as never);
    expect(ctx.response.http.status).toBe(200);
  });
});
