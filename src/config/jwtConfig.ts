/**
 * Centralized JWT_SECRET configuration with environment-aware validation.
 *
 * - In production (NODE_ENV=production): throws a startup error if JWT_SECRET
 *   is missing or shorter than 32 characters.
 * - In development: logs a warning and falls back to a local-only default.
 *
 * This module is designed to be imported once at startup so that any
 * misconfiguration is caught immediately rather than at the first request.
 */

import { logger } from '../utils/logger';

const MINIMUM_SECRET_LENGTH = 32;
const DEV_FALLBACK_SECRET =
  'development_secret_key_for_local_testing_only_do_not_use_in_production';

const isProduction = process.env.NODE_ENV === 'production';

function resolveJwtSecret(): string {
  // Try JWT_SECRET first, then fall back to NEXTAUTH_SECRET for compatibility
  // Trimmed so a stray newline or space from a pasted dashboard value cannot
  // make this differ from the same secret as `service-token.ts` reads it (that
  // module trims), which would defeat its JWT_SECRET collision check. A
  // whitespace-only JWT_SECRET counts as unset and falls through.
  const secret =
    process.env.JWT_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

  if (!secret) {
    if (isProduction) {
      logger.error(
        '[SECURITY] FATAL: JWT_SECRET environment variable is not set. ' +
          'The server cannot start in production without a valid JWT_SECRET. ' +
          'Set JWT_SECRET to a cryptographically random string of at least ' +
          `${MINIMUM_SECRET_LENGTH} characters.`
      );
      throw new Error(
        'JWT_SECRET is required in production. Set the JWT_SECRET environment variable.'
      );
    }

    logger.warn(
      '[SECURITY] WARNING: JWT_SECRET is not set. Using an insecure development ' +
        'fallback. This is acceptable for local development only. ' +
        'Do NOT deploy to production without setting JWT_SECRET.'
    );
    return DEV_FALLBACK_SECRET;
  }

  if (secret.length < MINIMUM_SECRET_LENGTH) {
    if (isProduction) {
      logger.error(
        `[SECURITY] FATAL: JWT_SECRET is too short (${secret.length} characters). ` +
          `A minimum of ${MINIMUM_SECRET_LENGTH} characters is required in production.`
      );
      throw new Error(
        `JWT_SECRET must be at least ${MINIMUM_SECRET_LENGTH} characters in production. ` +
          `Current length: ${secret.length}.`
      );
    }

    logger.warn(
      `[SECURITY] WARNING: JWT_SECRET is only ${secret.length} characters. ` +
        `A minimum of ${MINIMUM_SECRET_LENGTH} characters is recommended. ` +
        'This warning will become a fatal error in production.'
    );
  }

  return secret;
}

/**
 * The validated JWT secret for this environment.
 * Resolved once at import time; will throw in production if invalid.
 */
export const jwtSecret: string = resolveJwtSecret();
