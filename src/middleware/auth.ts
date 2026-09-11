import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  verifyBackendToken,
  AuthError,
  type BackendPrincipal,
} from '../auth/token-verifier';
import { logger } from '../utils/logger';

/**
 * Express request shape with the verified principal attached.
 *
 * Legacy code reads `req.user?.role === 'server'`, `req.user.sub`, etc., so we
 * adapt the `BackendPrincipal` discriminated union into the same shape that
 * `audit-logger` and resolver-side guards already expect.
 */
interface AuthUser extends JwtPayload {
  provider?: string;
  token?: string;
  name?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser | string;
  /**
   * The verified `BackendPrincipal` from `verifyBackendToken`. New consumers
   * should prefer this discriminated union over the legacy `user` shape.
   */
  principal?: BackendPrincipal;
}

/**
 * Map a verified `BackendPrincipal` to the legacy `req.user` shape used by
 * existing middleware (audit-logger, authorization checks). New consumers
 * should read `req.principal` directly for the typed union.
 */
function principalToUser(principal: BackendPrincipal): AuthUser {
  switch (principal.kind) {
    case 'server':
      return { sub: 'server', name: 'Server Auth', role: 'server' };
    case 'admin':
      return {
        sub: principal.sub,
        role: 'admin',
        ...(principal.email ? { name: principal.email } : {}),
      };
    case 'user':
      return {
        sub: principal.sub,
        role:
          principal.roles.find((r) => r !== 'user') ??
          principal.roles[0] ??
          'user',
        ...(principal.email ? { name: principal.email } : {}),
      };
  }
}

/**
 * Express middleware that establishes the verified principal from the
 * `Authorization: Bearer …` header. Replaces the historical implementation
 * that prefix-matched `ya29.` and accepted any string as a Google OAuth
 * principal without verification.
 *
 * Failure modes:
 *  - Missing `Authorization` header -> 401 with `{ error: "unauthorized" }`.
 *  - Failed verification -> 401 with `{ error: "invalid_token", reason }`
 *    where `reason` is one of the discriminated `AuthErrorReason` values.
 *
 * Success: sets `req.user` (legacy shape) and `req.principal` (typed union),
 * then calls `next()`.
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization') || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';

  if (!token) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }

  verifyBackendToken(token)
    .then((principal) => {
      req.principal = principal;
      req.user = principalToUser(principal);
      next();
    })
    .catch((e: unknown) => {
      const reason = e instanceof AuthError ? e.reason : 'bad_signature';
      logger.warn('[auth] Express middleware rejected token', { reason });
      res.status(401).json({ error: 'invalid_token', reason });
    });
};
