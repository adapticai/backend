/**
 * Credential-field guard: caller attribution in the decision log.
 *
 * The metric counts decisions by principal KIND, which is all a bounded label
 * can carry. Deciding whether enforcement is safe, and telling a known service
 * from a leaked service secret, needs to know WHICH caller each decision came
 * from. These cases drive the middleware directly (no generated resolvers are
 * needed, so vitest runs it in-process) and assert the log line carries that
 * attribution:
 *
 * - two non-service callers that send the same operation with the same user
 *   agent from different addresses are logged as two callers, not one;
 * - a service principal's credential read is logged with the `sub` its signed
 *   credential names, and a static token that names no caller is logged as
 *   unattributed rather than dropped.
 */
import { buildSchema, graphql, type GraphQLObjectType } from 'graphql';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { BackendPrincipal } from '../../auth/token-verifier';
import { logger } from '../../utils/logger';
import {
  createCredentialFieldGuardMiddleware,
  resetCredentialFieldGuardLogThrottle,
  type CredentialFieldGuardContext,
  type CredentialFieldGuardMode,
} from '../credential-field-guard';

const FIXED_NOW_MS = 1_800_000_000_000;

/**
 * A real graphql-js schema whose `AlpacaAccount.APISecret` resolver runs the
 * guard exactly as TypeGraphQL's global middleware chain does, so the guard
 * receives a genuine `GraphQLResolveInfo` rather than a hand-built one.
 */
function schemaFor(mode: CredentialFieldGuardMode): ReturnType<typeof buildSchema> {
  const schema = buildSchema(`
    type AlpacaAccount { id: String! APISecret: String! }
    type Query { alpacaAccounts: [AlpacaAccount!]! }
  `);
  const guard = createCredentialFieldGuardMiddleware({
    modeProvider: () => mode,
    now: () => FIXED_NOW_MS,
  });
  const account = schema.getType('AlpacaAccount') as GraphQLObjectType;
  account.getFields().APISecret.resolve = (root, args, context, info) =>
    guard(
      { root, args, context: context as CredentialFieldGuardContext, info },
      () => Promise.resolve('secret-value')
    );
  const query = schema.getQueryType() as GraphQLObjectType;
  query.getFields().alpacaAccounts.resolve = () => [{ id: 'acct-1' }];
  return schema;
}

const schemas = new Map<CredentialFieldGuardMode, ReturnType<typeof buildSchema>>();

/** One schema per mode: the flood cases below execute thousands of requests. */
function cachedSchema(mode: CredentialFieldGuardMode): ReturnType<typeof buildSchema> {
  let schema = schemas.get(mode);
  if (!schema) {
    schema = schemaFor(mode);
    schemas.set(mode, schema);
  }
  return schema;
}

async function resolveSecret(
  mode: 'enforce' | 'shadow',
  principal: BackendPrincipal | null,
  ip: string,
  forwardedFor?: string,
  operationName = 'findManyAlpacaAccount',
  userAgent = 'node'
): Promise<void> {
  const headers: Record<string, string> = { 'user-agent': userAgent };
  if (forwardedFor !== undefined) headers['x-forwarded-for'] = forwardedFor;
  const context: CredentialFieldGuardContext = { principal, req: { ip, headers } };
  await graphql({
    schema: cachedSchema(mode),
    source: `query ${operationName} { alpacaAccounts { id APISecret } }`,
    contextValue: context,
  });
}

/**
 * More distinct keys than the pre-bound throttle held before it cleared its
 * whole map (5,000), so the flood cases exercise that clear as well as the
 * bound that replaced it.
 */
const FLOOD_REQUESTS = 6_000;

/** One caller rotating `X-Forwarded-For` on every request from one edge address. */
async function floodFromEdge(edge: string): Promise<void> {
  for (let i = 0; i < FLOOD_REQUESTS; i += 1) {
    await resolveSecret('shadow', null, edge, `10.${i >> 16}.${(i >> 8) & 255}.${i & 255}, ${edge}`);
  }
}

type LogCall = [string, Record<string, unknown>?];

describe('credential-field guard decision log attribution', () => {
  let warn: ReturnType<typeof vi.spyOn>;
  let info: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetCredentialFieldGuardLogThrottle();
    warn = vi.spyOn(logger, 'warn').mockImplementation(() => logger);
    info = vi.spyOn(logger, 'info').mockImplementation(() => logger);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const guardLines = (spy: ReturnType<typeof vi.spyOn>): Record<string, unknown>[] =>
    (spy.mock.calls as LogCall[])
      .filter(([message]) => message.startsWith('[credential-field-guard]'))
      .map(([, meta]) => meta ?? {});

  it('logs two anonymous callers with the same agent and operation as two callers', async () => {
    await resolveSecret('shadow', null, '198.51.100.7');
    await resolveSecret('shadow', null, '203.0.113.20');

    const lines = guardLines(warn);
    expect(lines.map((l) => l.ip)).toEqual(['198.51.100.7', '203.0.113.20']);
    expect(lines.every((l) => l.decision === 'would_deny')).toBe(true);
  });

  it('tells apart callers that arrive through the same edge address by their forwarded chain', async () => {
    // Behind the production edge `req.ip` is the edge pool, so an operator's
    // laptop and a hosted service share it; the forwarded chain differs.
    const edge = '152.233.12.241';
    await resolveSecret('shadow', null, edge, '198.51.100.7, 152.233.12.241');
    await resolveSecret('shadow', null, edge, '203.0.113.20, 152.233.12.241');

    const lines = guardLines(warn);
    expect(lines.map((l) => l.forwardedFor)).toEqual([
      '198.51.100.7, 152.233.12.241',
      '203.0.113.20, 152.233.12.241',
    ]);
    expect(lines.every((l) => l.ip === edge)).toBe(true);
  });

  it('bounds a padded forwarded chain', async () => {
    await resolveSecret('shadow', null, '152.233.12.241', `${'9'.repeat(5000)}`);

    const [line] = guardLines(warn);
    expect(String(line?.forwardedFor).length).toBeLessThanOrEqual(256);
  });

  it('still logs one caller once per window (the throttle is per caller, not removed)', async () => {
    await resolveSecret('shadow', null, '198.51.100.7');
    await resolveSecret('shadow', null, '198.51.100.7');

    expect(guardLines(warn)).toHaveLength(1);
  });

  it('logs a service read with the sub its credential names', async () => {
    await resolveSecret('enforce', { kind: 'server', sub: 'adaptic-engine:host-a:41' }, '10.0.0.4');

    expect(guardLines(info)).toEqual([
      expect.objectContaining({
        decision: 'allowed',
        serviceSub: 'adaptic-engine:host-a:41',
        reference: 'AlpacaAccount.APISecret',
        operationName: 'findManyAlpacaAccount',
      }),
    ]);
    expect(guardLines(warn)).toEqual([]);
  });

  it('logs distinct service holders separately', async () => {
    await resolveSecret('enforce', { kind: 'server', sub: 'adaptic-engine:host-a:41' }, '10.0.0.4');
    await resolveSecret('enforce', { kind: 'server', sub: 'adaptic-audit:laptop:9' }, '10.0.0.4');

    expect(guardLines(info).map((l) => l.serviceSub)).toEqual([
      'adaptic-engine:host-a:41',
      'adaptic-audit:laptop:9',
    ]);
  });

  it('logs a static-token service read as unattributed rather than dropping it', async () => {
    await resolveSecret('enforce', { kind: 'server' }, '10.0.0.4');

    expect(guardLines(info).map((l) => l.serviceSub)).toEqual(['<unattributed>']);
  });

  describe('a caller rotating X-Forwarded-For', () => {
    const EDGE = '152.233.12.241';
    const OTHER_EDGE = '152.233.13.7';

    const decisionLines = (): Record<string, unknown>[] =>
      (warn.mock.calls as LogCall[])
        .filter(([message]) => message.includes('credential access by a non-service principal'))
        .map(([, meta]) => meta ?? {});
    const budgetNotices = (): Record<string, unknown>[] =>
      (warn.mock.calls as LogCall[])
        .filter(([message]) => message.includes('decision log budget spent'))
        .map(([, meta]) => meta ?? {});

    it('logs at most its scope budget plus one notice, not one line per request', async () => {
      await floodFromEdge(EDGE);

      expect(decisionLines().length).toBeLessThanOrEqual(256);
      expect(budgetNotices()).toEqual([expect.objectContaining({ scope: `none|${EDGE}` })]);
    });

    it("does not erase the throttle state of a caller on another edge address", async () => {
      await resolveSecret('shadow', null, OTHER_EDGE, `198.51.100.7, ${OTHER_EDGE}`);
      await floodFromEdge(EDGE);
      await resolveSecret('shadow', null, OTHER_EDGE, `198.51.100.7, ${OTHER_EDGE}`);

      const other = decisionLines().filter((l) => l.ip === OTHER_EDGE);
      expect(other).toHaveLength(1);
    });

    it('does not erase the throttle state of a caller already logged on the same edge', async () => {
      await resolveSecret('shadow', null, EDGE, `198.51.100.7, ${EDGE}`);
      await floodFromEdge(EDGE);
      await resolveSecret('shadow', null, EDGE, `198.51.100.7, ${EDGE}`);

      const legit = decisionLines().filter((l) => l.forwardedFor === `198.51.100.7, ${EDGE}`);
      expect(legit).toHaveLength(1);
    });

    it('cannot spend the service-read budget of the edge it floods', async () => {
      await floodFromEdge(EDGE);
      await resolveSecret('enforce', { kind: 'server', sub: 'adaptic-audit:laptop:9' }, EDGE);

      expect(guardLines(info).map((l) => l.serviceSub)).toEqual(['adaptic-audit:laptop:9']);
    });
  });

  it('bounds a padded user agent and operation name in the line it logs', async () => {
    await resolveSecret('shadow', null, '152.233.12.241', undefined, `Q${'x'.repeat(5_000)}`, 'u'.repeat(5_000));

    const [line] = guardLines(warn);
    expect(String(line?.userAgent).length).toBeLessThanOrEqual(256);
    expect(String(line?.operationName).length).toBeLessThanOrEqual(256);
  });
});
