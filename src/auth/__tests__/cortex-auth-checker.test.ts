import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { ResolverData } from 'type-graphql';
import type { GraphQLResolveInfo } from 'graphql';
import {
  cortexAuthChecker,
  cortexAuthCheckerWouldDenyTotal,
  cortexAuthCheckerEvaluationsTotal,
  evaluateWouldAllow,
  isAuthCheckerEnforced,
  CORTEX_AUTHCHECKER_ENFORCE_ENV,
  type CortexAuthContext,
} from '../cortex-auth-checker';
import type { BackendPrincipal } from '../token-verifier';

/**
 * CORTEX-P0-001 unit tests for the resolver-level authorization AuthChecker.
 *
 * The SHADOW-FIRST contract is safety-critical: with enforcement OFF (default)
 * the checker MUST allow every operation while still counting would-denies; with
 * enforcement ON it MUST fail closed for a would-deny; a server principal MUST
 * always be allowed regardless of mode. These properties gate the shadow→enforce
 * rollout, so they are proven in isolation here.
 */

const USER_SUB = '99999999-9999-9999-9999-999999999999';

function buildResolverData(
  principal: BackendPrincipal | null,
  operationName = 'TestOp',
  fieldName = 'funds'
): ResolverData<CortexAuthContext> {
  const info = {
    fieldName,
    operation: {
      operation: 'query',
      name: { value: operationName },
    },
  } as unknown as GraphQLResolveInfo;

  return {
    root: undefined,
    args: {},
    context: { principal },
    info,
  };
}

/** Read the current value of the would-deny counter for a given reason. */
async function wouldDenyCount(reason: string): Promise<number> {
  const metric = await cortexAuthCheckerWouldDenyTotal.get();
  const sample = metric.values.find((v) => v.labels.reason === reason);
  return sample?.value ?? 0;
}

/** Read the current value of the unconditional evaluations counter. */
async function evaluationsCount(): Promise<number> {
  const metric = await cortexAuthCheckerEvaluationsTotal.get();
  return metric.values[0]?.value ?? 0;
}

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

describe('isAuthCheckerEnforced', () => {
  it('defaults to false (shadow) when unset or unrecognised', () => {
    expect(isAuthCheckerEnforced({})).toBe(false);
    expect(
      isAuthCheckerEnforced({ [CORTEX_AUTHCHECKER_ENFORCE_ENV]: 'bogus' })
    ).toBe(false);
    expect(
      isAuthCheckerEnforced({ [CORTEX_AUTHCHECKER_ENFORCE_ENV]: 'false' })
    ).toBe(false);
  });

  it('is true only for explicit true / 1', () => {
    expect(
      isAuthCheckerEnforced({ [CORTEX_AUTHCHECKER_ENFORCE_ENV]: 'true' })
    ).toBe(true);
    expect(
      isAuthCheckerEnforced({ [CORTEX_AUTHCHECKER_ENFORCE_ENV]: ' TRUE ' })
    ).toBe(true);
    expect(
      isAuthCheckerEnforced({ [CORTEX_AUTHCHECKER_ENFORCE_ENV]: '1' })
    ).toBe(true);
  });
});

describe('evaluateWouldAllow', () => {
  it('denies a null principal as unauthenticated', () => {
    expect(evaluateWouldAllow(null, [])).toEqual({
      wouldAllow: false,
      reason: 'unauthenticated',
    });
  });

  it('always allows a server principal, even with required roles', () => {
    expect(evaluateWouldAllow(SERVER_PRINCIPAL, [])).toEqual({
      wouldAllow: true,
    });
    expect(evaluateWouldAllow(SERVER_PRINCIPAL, ['admin'])).toEqual({
      wouldAllow: true,
    });
  });

  it('allows an authenticated user when no role is required', () => {
    expect(evaluateWouldAllow(USER_PRINCIPAL, [])).toEqual({ wouldAllow: true });
  });

  it('denies a user lacking a required role', () => {
    expect(evaluateWouldAllow(USER_PRINCIPAL, ['admin'])).toEqual({
      wouldAllow: false,
      reason: 'insufficient_role',
    });
  });

  it('allows an admin principal for an admin-gated field', () => {
    expect(evaluateWouldAllow(ADMIN_PRINCIPAL, ['admin'])).toEqual({
      wouldAllow: true,
    });
  });
});

describe('cortexAuthChecker', () => {
  beforeEach(() => {
    delete process.env[CORTEX_AUTHCHECKER_ENFORCE_ENV];
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete process.env[CORTEX_AUTHCHECKER_ENFORCE_ENV];
  });

  it('shadow mode: allows a null-principal op while incrementing the would-deny counter', async () => {
    const before = await wouldDenyCount('unauthenticated');
    const allowed = cortexAuthChecker(buildResolverData(null), []);

    expect(allowed).toBe(true);
    expect(await wouldDenyCount('unauthenticated')).toBe(before + 1);
  });

  it('enforce mode: denies a null-principal op (fail closed)', () => {
    process.env[CORTEX_AUTHCHECKER_ENFORCE_ENV] = 'true';
    const allowed = cortexAuthChecker(buildResolverData(null), []);
    expect(allowed).toBe(false);
  });

  it('always allows a server principal in shadow mode', () => {
    const allowed = cortexAuthChecker(
      buildResolverData(SERVER_PRINCIPAL),
      ['admin']
    );
    expect(allowed).toBe(true);
  });

  it('always allows a server principal in enforce mode', () => {
    process.env[CORTEX_AUTHCHECKER_ENFORCE_ENV] = 'true';
    const allowed = cortexAuthChecker(
      buildResolverData(SERVER_PRINCIPAL),
      ['admin']
    );
    expect(allowed).toBe(true);
  });

  it('enforce mode: denies a user lacking a required role', () => {
    process.env[CORTEX_AUTHCHECKER_ENFORCE_ENV] = 'true';
    const allowed = cortexAuthChecker(
      buildResolverData(USER_PRINCIPAL),
      ['admin']
    );
    expect(allowed).toBe(false);
  });

  // Audit B01-backend-legacy-07: without an unconditional evaluations counter,
  // a flat-zero would-deny series is indistinguishable from "the checker never
  // ran" — the false-confidence pattern that must be excluded before any
  // shadow→enforce graduation.
  it('increments the evaluations counter on an ALLOWED evaluation without touching would-deny', async () => {
    const evalBefore = await evaluationsCount();
    const denyBefore = await wouldDenyCount('unauthenticated');

    const allowed = cortexAuthChecker(buildResolverData(SERVER_PRINCIPAL), []);

    expect(allowed).toBe(true);
    expect(await evaluationsCount()).toBe(evalBefore + 1);
    expect(await wouldDenyCount('unauthenticated')).toBe(denyBefore);
  });

  it('increments the evaluations counter on a would-deny evaluation too', async () => {
    const evalBefore = await evaluationsCount();

    const allowed = cortexAuthChecker(buildResolverData(null), []);

    expect(allowed).toBe(true); // shadow still allows
    expect(await evaluationsCount()).toBe(evalBefore + 1);
  });
});
