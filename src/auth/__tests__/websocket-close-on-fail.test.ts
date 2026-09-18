/**
 * Integration test: when a graphql-ws connection presents a Bearer token that
 * fails verification, the WebSocket connection MUST close — it must never be
 * downgraded to a context that keeps streaming subscription data.
 *
 * The historical regression this test guards against:
 *
 *   ```ts
 *   if (token.startsWith('ya29.')) {
 *     user = { provider: 'google', token };  // unverified principal!
 *   }
 *   ```
 *
 * which combined with a `return { prisma: global.prisma, authError: '...' }`
 * fall-through to silently keep subscriptions open without authentication.
 *
 * The test drives a real graphql-ws server over a real WebSocket and wires in
 * `decideWsAuth` / `unauthenticatedWsError` — the SAME functions `server.ts`
 * uses for `/subscriptions` — so a regression in the production decision fails
 * this suite rather than a re-implementation of it.
 *
 * Two properties make the negative assertions meaningful:
 *
 *  1. A valid-token CONTROL case asserts the socket stays OPEN and a `next`
 *     message arrives. "No data was delivered" proves nothing unless the same
 *     harness can be shown to deliver data when authentication succeeds.
 *  2. Every case asserts the production decision actually ran. A transport or
 *     module-resolution fault that prevents graphql-ws from ever invoking the
 *     `context` callback now fails the suite instead of silently satisfying
 *     every "did not happen" expectation.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  vi,
} from 'vitest';
import { createServer, type Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { buildSchema as buildGraphQLSchema } from 'graphql';
import jwt from 'jsonwebtoken';

// ---------------------------------------------------------------------------
// Test-time env setup — must precede the `ws-auth-context` import below.
// ---------------------------------------------------------------------------
const TEST_SECRET =
  'test-secret-for-cortex-p0-002-ws-suite-32-chars-min-required';

vi.hoisted(() => {
  const secret =
    'test-secret-for-cortex-p0-002-ws-suite-32-chars-min-required';
  process.env.JWT_SECRET = secret;
  process.env.NEXTAUTH_SECRET = secret;
  // Leave GOOGLE_OAUTH_CLIENT_IDS empty so Google verification is disabled in
  // this test environment. Path 3 will not run and the verifier surfaces the
  // local-JWT failure or the structural rejection.
  delete process.env.GOOGLE_OAUTH_CLIENT_IDS;
  delete process.env.SERVER_AUTH_TOKEN;
});

import { decideWsAuth, unauthenticatedWsError } from '../ws-auth-context';

// ---------------------------------------------------------------------------
// Tiny GraphQL schema with one subscription so graphql-ws has something to
// route. The subscription resolves immediately, which is what lets the
// valid-token control prove the harness can deliver data at all.
// ---------------------------------------------------------------------------
const schema = buildGraphQLSchema(`
  type Query { hello: String }
  type Subscription { ping: String }
`);

const PING_PAYLOAD = 'pong';

/**
 * Counts every invocation of the production auth decision by the graphql-ws
 * `context` callback. Assertions read it to prove the decision under test was
 * actually reached, rather than the socket dying earlier for an unrelated
 * reason.
 */
let contextInvocations = 0;

/** A JWT this environment's verifier accepts, for the control case. */
function validToken(): string {
  return jwt.sign({ sub: 'user-under-test', roles: ['user'] }, TEST_SECRET, {
    expiresIn: '5m',
  });
}

// ---------------------------------------------------------------------------
// Spin up an HTTP server + WebSocket server bound to a random port so the
// test runs hermetically.
// ---------------------------------------------------------------------------
let httpServer: HttpServer;
let wsServer: WebSocketServer;
let port: number;

beforeAll(
  () =>
    new Promise<void>((resolve, reject) => {
      httpServer = createServer();
      wsServer = new WebSocketServer({
        server: httpServer,
        path: '/subscriptions',
      });

      useServer(
        {
          schema,
          roots: {
            subscription: {
              ping: async function* (): AsyncGenerator<{ ping: string }> {
                yield { ping: PING_PAYLOAD };
              },
            },
          },
          context: async (ctx) => {
            contextInvocations += 1;
            const authHeader =
              (ctx.connectionParams as { authorization?: string } | undefined)
                ?.authorization ?? '';
            const decision = await decideWsAuth(authHeader);
            if (decision.kind === 'rejected') {
              throw unauthenticatedWsError(decision.reason);
            }
            return { decision };
          },
        },
        wsServer
      );

      httpServer.on('error', reject);
      httpServer.listen(0, () => {
        const address = httpServer.address();
        if (typeof address === 'object' && address !== null) {
          port = address.port;
          resolve();
        } else {
          reject(new Error('Server did not bind to a port'));
        }
      });
    })
);

afterAll(
  () =>
    new Promise<void>((resolve) => {
      wsServer.close(() => httpServer.close(() => resolve()));
    })
);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface SubscribeOutcome {
  /** True when the server closed the socket before the settle window elapsed. */
  closed: boolean;
  closeCode: number | null;
  closeReason: string | null;
  /** True when at least one `next` (subscription data) message arrived. */
  sawNext: boolean;
  /** True when the production auth decision ran for this connection. */
  contextRan: boolean;
}

/**
 * How long to hold a connection open before declaring it "not closed".
 *
 * The rejection path closes in single-digit milliseconds; this window only has
 * to be long enough that a failure to close is distinguishable from a slow
 * close, and it is the full cost of the control case.
 */
const SETTLE_MS = 1200;

/**
 * Open a graphql-transport-ws connection, send ConnectionInit + Subscribe, and
 * report what the server did: closed (with code/reason), delivered data, or
 * neither within the settle window.
 *
 * A socket-level `error` rejects rather than resolving. An unreachable or
 * mis-wired server must surface as a failure, not as an outcome whose every
 * "did not happen" field is trivially satisfied.
 */
function subscribeWithAuth(authorization: string): Promise<SubscribeOutcome> {
  const invocationsBefore = contextInvocations;
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `ws://localhost:${port}/subscriptions`,
      'graphql-transport-ws'
    );

    let sawNext = false;
    let settled = false;

    const finish = (outcome: Omit<SubscribeOutcome, 'contextRan'>): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({
        ...outcome,
        contextRan: contextInvocations > invocationsBefore,
      });
    };

    const timer = setTimeout(() => {
      ws.close();
      finish({ closed: false, closeCode: null, closeReason: null, sawNext });
    }, SETTLE_MS);

    ws.on('open', () => {
      ws.send(
        JSON.stringify({
          type: 'connection_init',
          payload: { authorization },
        })
      );
    });

    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString()) as { type: string };
      if (msg.type === 'connection_ack') {
        // graphql-ws invokes `context` lazily, on subscribe — not on
        // connection_init — so the decision under test only runs once a
        // Subscribe message is sent.
        ws.send(
          JSON.stringify({
            id: '1',
            type: 'subscribe',
            payload: { query: 'subscription { ping }' },
          })
        );
      } else if (msg.type === 'next') {
        sawNext = true;
      }
    });

    ws.on('close', (code, reasonBuffer) => {
      finish({
        closed: true,
        closeCode: code,
        closeReason: reasonBuffer.toString(),
        sawNext,
      });
    });

    ws.on('error', (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(err);
    });
  });
}

describe('WebSocket auth-failure closing semantics', () => {
  // graphql-ws closes the socket when the `context` callback throws: the throw
  // propagates out of its message handler, which closes with
  // CloseCode.InternalServerError (4500) and puts the error message in the
  // close reason. Asserting the reason as well as the code is what separates
  // "closed because authentication failed" from "closed because something else
  // crashed" — a distinction a bare `code >= 4000` check cannot make.

  it('CONTROL: a valid token keeps the socket OPEN and delivers subscription data', async () => {
    const outcome = await subscribeWithAuth(`Bearer ${validToken()}`);

    expect(
      outcome.contextRan,
      'the production auth decision never ran — the harness is not exercising it'
    ).toBe(true);
    expect(
      outcome.sawNext,
      'an authenticated subscription delivered no data — the negative assertions below would be vacuous'
    ).toBe(true);
    expect(
      outcome.closed,
      `an authenticated socket was closed (code=${String(outcome.closeCode)}, reason=${String(outcome.closeReason)})`
    ).toBe(false);
  });

  const rejectedCredentials: ReadonlyArray<readonly [string, string]> = [
    [
      'opaque ya29.… Google access token',
      'ya29.A0AbVbY6Eabc_opaque_access_token_should_be_rejected',
    ],
    ['clearly malformed token (2 segments)', 'aa.bb'],
    [
      'JWT signed with the wrong secret',
      jwt.sign(
        { sub: 'attacker' },
        'a-different-secret-that-is-at-least-32-characters-long',
        { expiresIn: '5m' }
      ),
    ],
  ];

  it.each(rejectedCredentials)(
    '%s closes the socket (4500 / "Unauthenticated") and delivers no data',
    async (_name, token) => {
      const outcome = await subscribeWithAuth(`Bearer ${token}`);

      expect(
        outcome.contextRan,
        'the production auth decision never ran — the harness is not exercising it'
      ).toBe(true);
      expect(
        outcome.closed,
        `socket stayed open for an unverifiable token (sawNext=${String(outcome.sawNext)})`
      ).toBe(true);
      expect(outcome.closeCode).toBe(4500);
      expect(
        outcome.closeReason,
        'socket closed for a reason other than the auth rejection'
      ).toBe('Unauthenticated');
      expect(
        outcome.sawNext,
        'subscription data was delivered to an unauthenticated socket'
      ).toBe(false);
    }
  );

});
