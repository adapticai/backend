import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  recordShadowAuthMiss,
  recordAuthContextOutcome,
  isShadowAuthLoggingDisabled,
  GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV,
  graphqlAuthContextEvaluationsTotal,
  extractOperationName,
  extractOperationNameFromArgs,
  extractHeaderIdentityFromWsExtra,
  headerToString,
  _resetShadowAuthStateForTests,
  type GraphqlTransport,
  type AuthContextOutcome,
  type ShadowAuthIdentity,
} from '../graphql-auth-shadow';
import { logger } from '../../utils/logger';

/**
 * Unit tests for the GraphQL context-layer authentication SHADOW observer.
 *
 * The observe-only contract is safety-critical: recording a would-deny MUST NOT
 * block or throw, MUST always count on the bounded Prometheus series, and MUST
 * throttle the identity log to one line per distinct caller per window so it
 * cannot flood Cloud Logging. These properties gate the enforcement runbook, so
 * they are proven here in isolation.
 */

async function outcomeCount(
  transport: GraphqlTransport,
  outcome: AuthContextOutcome
): Promise<number> {
  const metric = await graphqlAuthContextEvaluationsTotal.get();
  const sample = metric.values.find(
    (v) => v.labels.transport === transport && v.labels.outcome === outcome
  );
  return sample?.value ?? 0;
}

const HTTP_IDENTITY: ShadowAuthIdentity = {
  transport: 'http',
  operationName: 'GetFunds',
  origin: 'https://os.adaptic.ai',
  ip: '203.0.113.7',
  userAgent: 'Mozilla/5.0',
  authHeaderPresent: false,
};

describe('isShadowAuthLoggingDisabled', () => {
  it('defaults to false (logging ON) when unset or unrecognised', () => {
    expect(isShadowAuthLoggingDisabled({})).toBe(false);
    expect(
      isShadowAuthLoggingDisabled({
        [GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV]: 'bogus',
      })
    ).toBe(false);
    expect(
      isShadowAuthLoggingDisabled({
        [GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV]: 'false',
      })
    ).toBe(false);
  });

  it('is true only for explicit true / 1', () => {
    expect(
      isShadowAuthLoggingDisabled({
        [GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV]: 'true',
      })
    ).toBe(true);
    expect(
      isShadowAuthLoggingDisabled({
        [GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV]: ' TRUE ',
      })
    ).toBe(true);
    expect(
      isShadowAuthLoggingDisabled({
        [GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV]: '1',
      })
    ).toBe(true);
  });
});

describe('extraction helpers', () => {
  it('headerToString folds arrays to the first value and rejects non-strings', () => {
    expect(headerToString('abc')).toBe('abc');
    expect(headerToString(['first', 'second'])).toBe('first');
    expect(headerToString(undefined)).toBeUndefined();
    expect(headerToString(42)).toBeUndefined();
    expect(headerToString([])).toBeUndefined();
  });

  it('extractOperationName reads a non-empty operationName from a body-like object', () => {
    expect(extractOperationName({ operationName: 'GetFunds' })).toBe(
      'GetFunds'
    );
    expect(extractOperationName({ operationName: '' })).toBeUndefined();
    expect(extractOperationName({})).toBeUndefined();
    expect(extractOperationName(null)).toBeUndefined();
    expect(extractOperationName('not-an-object')).toBeUndefined();
  });

  it('extractOperationNameFromArgs reads operationName from ExecutionArgs-like input', () => {
    expect(extractOperationNameFromArgs({ operationName: 'OnTrade' })).toBe(
      'OnTrade'
    );
    expect(extractOperationNameFromArgs({ operationName: '' })).toBeUndefined();
    expect(extractOperationNameFromArgs(undefined)).toBeUndefined();
  });

  it('extractHeaderIdentityFromWsExtra pulls origin / UA / IP tolerantly', () => {
    expect(
      extractHeaderIdentityFromWsExtra({
        request: {
          headers: { origin: 'https://os.adaptic.ai', 'user-agent': 'UA' },
          socket: { remoteAddress: '198.51.100.4' },
        },
      })
    ).toEqual({
      origin: 'https://os.adaptic.ai',
      userAgent: 'UA',
      ip: '198.51.100.4',
    });
    expect(extractHeaderIdentityFromWsExtra(undefined)).toEqual({});
    expect(extractHeaderIdentityFromWsExtra({ request: null })).toEqual({});
    expect(extractHeaderIdentityFromWsExtra({ request: {} })).toEqual({
      origin: undefined,
      userAgent: undefined,
      ip: undefined,
    });
  });
});

describe('recordAuthContextOutcome', () => {
  it('increments the bounded evaluations counter for the given transport + outcome', async () => {
    const before = await outcomeCount('http', 'authenticated');
    recordAuthContextOutcome('http', 'authenticated');
    expect(await outcomeCount('http', 'authenticated')).toBe(before + 1);

    const wsBefore = await outcomeCount('ws', 'invalid_token');
    recordAuthContextOutcome('ws', 'invalid_token');
    expect(await outcomeCount('ws', 'invalid_token')).toBe(wsBefore + 1);
  });
});

describe('recordShadowAuthMiss', () => {
  beforeEach(() => {
    delete process.env[GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV];
    _resetShadowAuthStateForTests();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete process.env[GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV];
  });

  it('counts every would-deny on outcome="no_principal" (never blocks, never throws)', async () => {
    const before = await outcomeCount('http', 'no_principal');
    expect(() => recordShadowAuthMiss(HTTP_IDENTITY)).not.toThrow();
    expect(() => recordShadowAuthMiss(HTTP_IDENTITY)).not.toThrow();
    expect(await outcomeCount('http', 'no_principal')).toBe(before + 2);
  });

  it('throttles the identity log to one line per (transport, operationName, origin) window', () => {
    const warnSpy = vi
      .spyOn(logger, 'warn')
      .mockImplementation(() => undefined);

    // First sighting of the key -> emits.
    recordShadowAuthMiss(HTTP_IDENTITY);
    // Same key within the window -> suppressed.
    recordShadowAuthMiss(HTTP_IDENTITY);
    recordShadowAuthMiss(HTTP_IDENTITY);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    // A different operationName is a different key -> emits again.
    recordShadowAuthMiss({ ...HTTP_IDENTITY, operationName: 'GetTrades' });
    expect(warnSpy).toHaveBeenCalledTimes(2);

    // A different origin is a different key -> emits again.
    recordShadowAuthMiss({ ...HTTP_IDENTITY, origin: 'https://adaptic.ai' });
    expect(warnSpy).toHaveBeenCalledTimes(3);
  });

  it('suppresses the log when logging is disabled but still counts', async () => {
    process.env[GRAPHQL_AUTH_SHADOW_LOG_DISABLED_ENV] = 'true';
    const warnSpy = vi
      .spyOn(logger, 'warn')
      .mockImplementation(() => undefined);
    const before = await outcomeCount('ws', 'no_principal');

    recordShadowAuthMiss({ ...HTTP_IDENTITY, transport: 'ws' });

    expect(warnSpy).not.toHaveBeenCalled();
    expect(await outcomeCount('ws', 'no_principal')).toBe(before + 1);
  });
});
