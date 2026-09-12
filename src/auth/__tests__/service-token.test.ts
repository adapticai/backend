import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';

/**
 * `jwtConfig.ts` reads `process.env.JWT_SECRET` once at import time, and
 * `service-token.ts` compares the service secret against it. Both env values
 * must therefore be in place before the static imports below evaluate.
 */
const TEST_JWT_SECRET = vi.hoisted(() => {
  const secret = 'user-session-secret-for-service-token-suite-only-not-real';
  process.env.JWT_SECRET = secret;
  process.env.NEXTAUTH_SECRET = secret;
  delete process.env.SERVER_AUTH_TOKEN;
  return secret;
});

vi.mock('google-auth-library', () => ({
  OAuth2Client: class {
    verifyIdToken(): never {
      throw new Error('google verification not exercised in this suite');
    }
  },
}));

import {
  verifyServiceToken,
  SERVICE_TOKEN_ISSUER,
  SERVICE_TOKEN_AUDIENCE,
  MAX_SERVICE_TOKEN_LIFETIME_SEC,
  MINIMUM_SERVICE_SECRET_LENGTH,
} from '../service-token';
import { verifyBackendToken, AuthError } from '../token-verifier';

/** A service secret distinct from the user-session secret, per the contract. */
const SERVICE_SECRET =
  'dedicated-service-secret-for-suite-only-distinct-from-user-secret';

interface MintOptions {
  readonly secret?: string;
  readonly issuer?: string;
  readonly audience?: string;
  readonly sub?: string | null;
  readonly lifetimeSec?: number | null;
  readonly issuedAtSec?: number;
}

/**
 * Mint a service-shaped HS256 token, with every bound claim overridable so a
 * test can vary exactly one dimension at a time.
 */
function mint(options: MintOptions = {}): string {
  const nowSec = options.issuedAtSec ?? Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    iss: options.issuer ?? SERVICE_TOKEN_ISSUER,
    aud: options.audience ?? SERVICE_TOKEN_AUDIENCE,
    iat: nowSec,
  };
  if (options.sub !== null) payload.sub = options.sub ?? 'adaptic-engine:test';
  if (options.lifetimeSec !== null) {
    payload.exp = nowSec + (options.lifetimeSec ?? 900);
  }
  return jwt.sign(payload, options.secret ?? SERVICE_SECRET, {
    algorithm: 'HS256',
  });
}

describe('verifyServiceToken', () => {
  beforeEach(() => {
    process.env.BACKEND_SERVICE_JWT_SECRET = SERVICE_SECRET;
  });

  afterEach(() => {
    delete process.env.BACKEND_SERVICE_JWT_SECRET;
    vi.useRealTimers();
  });

  it('yields a server principal for a correctly bound credential', () => {
    expect(verifyServiceToken(mint())).toEqual({ kind: 'server' });
  });

  it('is unavailable — not permissive — when no secret is provisioned', () => {
    const token = mint();
    delete process.env.BACKEND_SERVICE_JWT_SECRET;
    // Null means "keep looking", and every remaining path rejects this token.
    expect(verifyServiceToken(token)).toBeNull();
  });

  it('stays disabled rather than weakening when the secret is too short', () => {
    process.env.BACKEND_SERVICE_JWT_SECRET = 'x'.repeat(
      MINIMUM_SERVICE_SECRET_LENGTH - 1
    );
    expect(verifyServiceToken(mint())).toBeNull();
  });

  it('refuses to operate when the service secret equals the user secret', () => {
    process.env.BACKEND_SERVICE_JWT_SECRET = TEST_JWT_SECRET;
    // A user-session JWT must never be able to become a service principal.
    expect(() => verifyServiceToken(mint({ secret: TEST_JWT_SECRET }))).toThrow(
      AuthError
    );
    try {
      verifyServiceToken(mint({ secret: TEST_JWT_SECRET }));
    } catch (error) {
      expect((error as AuthError).reason).toBe('misconfigured');
    }
  });

  it('falls through for a token signed with the user-session secret', () => {
    expect(verifyServiceToken(mint({ secret: TEST_JWT_SECRET }))).toBeNull();
  });

  it('falls through for a token signed with an unrelated secret', () => {
    expect(
      verifyServiceToken(mint({ secret: 'attacker-supplied-secret-value-xxxx' }))
    ).toBeNull();
  });

  it('rejects an expired credential as expired, not as a forgery', () => {
    const staleIat = Math.floor(Date.now() / 1000) - 7200;
    try {
      verifyServiceToken(mint({ issuedAtSec: staleIat, lifetimeSec: 900 }));
      expect.unreachable('expired service token must throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AuthError);
      expect((error as AuthError).reason).toBe('expired');
    }
  });

  it('rejects a credential minted for a different audience', () => {
    try {
      verifyServiceToken(mint({ audience: 'some-other-service' }));
      expect.unreachable('wrong-audience service token must throw');
    } catch (error) {
      expect((error as AuthError).reason).toBe('bad_audience');
    }
  });

  it('rejects a credential carrying a foreign issuer', () => {
    try {
      verifyServiceToken(mint({ issuer: 'not-adaptic' }));
      expect.unreachable('wrong-issuer service token must throw');
    } catch (error) {
      expect((error as AuthError).reason).toBe('bad_audience');
    }
  });

  it('rejects an unattributable credential with no sub', () => {
    try {
      verifyServiceToken(mint({ sub: null }));
      expect.unreachable('sub-less service token must throw');
    } catch (error) {
      expect((error as AuthError).reason).toBe('malformed');
    }
  });

  it('rejects a non-expiring credential', () => {
    try {
      verifyServiceToken(mint({ lifetimeSec: null }));
      expect.unreachable('exp-less service token must throw');
    } catch (error) {
      expect((error as AuthError).reason).toBe('malformed');
    }
  });

  it('rejects a credential whose lifetime exceeds the ceiling', () => {
    try {
      verifyServiceToken(
        mint({ lifetimeSec: MAX_SERVICE_TOKEN_LIFETIME_SEC + 60 })
      );
      expect.unreachable('over-long service token must throw');
    } catch (error) {
      expect((error as AuthError).reason).toBe('bad_audience');
    }
  });

  it('rejects an unsigned alg:none forgery', () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const forged = jwt.sign(
      {
        iss: SERVICE_TOKEN_ISSUER,
        aud: SERVICE_TOKEN_AUDIENCE,
        sub: 'forged',
        iat: nowSec,
        exp: nowSec + 900,
      },
      '',
      { algorithm: 'none' }
    );
    expect(verifyServiceToken(forged)).toBeNull();
  });
});

describe('verifyBackendToken — service path integration', () => {
  beforeEach(() => {
    process.env.BACKEND_SERVICE_JWT_SECRET = SERVICE_SECRET;
  });

  afterEach(() => {
    delete process.env.BACKEND_SERVICE_JWT_SECRET;
  });

  it('promotes an engine credential to a server principal end to end', async () => {
    await expect(verifyBackendToken(mint())).resolves.toEqual({
      kind: 'server',
    });
  });

  it('rejects an invalid service credential rather than admitting it', async () => {
    const forged = mint({ secret: 'wrong-secret-that-is-long-enough-here-ok' });
    await expect(verifyBackendToken(forged)).rejects.toBeInstanceOf(AuthError);
  });

  it('leaves ordinary user JWTs byte-identical in outcome', async () => {
    // The no-op proof for the correct-input partition: adding the service path
    // must not perturb any token that already worked.
    const userToken = jwt.sign(
      { sub: 'user-123', roles: ['user'], email: 'u@example.com' },
      TEST_JWT_SECRET,
      { algorithm: 'HS256', expiresIn: '1h' }
    );
    const withService = await verifyBackendToken(userToken);

    delete process.env.BACKEND_SERVICE_JWT_SECRET;
    const withoutService = await verifyBackendToken(userToken);

    expect(withService).toEqual(withoutService);
    expect(withService).toMatchObject({ kind: 'user', sub: 'user-123' });
  });

  it('still rejects an anonymous empty token', async () => {
    await expect(verifyBackendToken('')).rejects.toBeInstanceOf(AuthError);
  });
});
