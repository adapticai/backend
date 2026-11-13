/**
 * TOTP second-factor mutations: `enrollUserTotp`, `confirmUserTotp`,
 * `verifyUserTotp`, `disableUserTotp`.
 *
 * Service-principal only. The platform's server calls them with the service
 * token on behalf of a signed-in user whose session it has already verified;
 * no browser or user token may call them, and neither may an admin (a person
 * able to rewrite someone else's second factor has defeated it). The check is
 * made here, in every mode, and the mutation guard enforces the same rule
 * (`SERVICE_PRINCIPAL_ONLY_MODELS`, `ALWAYS_ENFORCED_MUTATION_MODELS` in
 * src/auth/mutation-authorization.ts), so neither layer depends on the other's
 * configuration.
 *
 * The secret leaves the server exactly once, inside the `otpauthUri` of the
 * enrolment response, together with the recovery codes; afterwards only the
 * AES-256-GCM ciphertext and the code hashes are stored, and no GraphQL
 * output type exposes either. `TOTP_ENCRYPTION_KEY` must be set: without it
 * every mutation fails with `TOTP_KEY_UNAVAILABLE` rather than storing or
 * reading a secret any other way.
 *
 * Callers own attempt limiting: a six-digit code over a three-step window is
 * guessed with probability 3e-6 per attempt, so the platform must bound
 * attempts per user before calling `verifyUserTotp`.
 *
 * @module resolvers/custom/UserTotpResolver
 */

import * as TypeGraphQL from 'type-graphql';
import { GraphQLError } from 'graphql';

import { readTotpEncryptionKey, TotpKeyError } from '../../auth/totp';
import type { BackendPrincipal } from '../../auth/token-verifier';
import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import { logger } from '../../utils/logger';
import { assertServicePrincipal } from './totp-principal';
import {
  confirmTotp,
  disableTotp,
  enrollTotp,
  TotpStateError,
  verifyTotpCode,
  type TotpFailure,
  type TotpPrisma,
} from './user-totp-service';

/** The enrolment response: the only output that carries secret material. */
@TypeGraphQL.ObjectType('UserTotpEnrollment', {
  description: 'TOTP enrolment material, returned once and never again.',
})
export class UserTotpEnrollment {
  @TypeGraphQL.Field((_type) => String, {
    description:
      'otpauth:// URI for the authenticator app (contains the secret).',
  })
  otpauthUri!: string;

  @TypeGraphQL.Field((_type) => [String], {
    description: 'Single-use recovery codes, shown once.',
  })
  recoveryCodes!: string[];
}

/** Outcome of confirming or disabling an enrolment. */
@TypeGraphQL.ObjectType('UserTotpResult', {})
export class UserTotpResult {
  @TypeGraphQL.Field((_type) => Boolean)
  ok!: boolean;
}

/** Outcome of verifying a code. */
@TypeGraphQL.ObjectType('UserTotpVerification', {})
export class UserTotpVerification {
  @TypeGraphQL.Field((_type) => Boolean)
  ok!: boolean;

  @TypeGraphQL.Field((_type) => Boolean, {
    description: 'Whether a recovery code (now consumed) was used.',
  })
  recoveryUsed!: boolean;
}

/** GraphQL context fields the resolver reads. */
interface TotpContext {
  principal?: BackendPrincipal | null;
  prisma?: unknown;
}

const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;
const HTTP_UNAVAILABLE = 503;


const FAILURE_STATUS: Record<TotpFailure, number> = {
  user_not_found: HTTP_NOT_FOUND,
  not_enrolled: HTTP_NOT_FOUND,
  not_enabled: HTTP_CONFLICT,
  already_enabled: HTTP_CONFLICT,
};

/** Run one operation with the key, mapping state and key failures onto typed GraphQL errors. */
async function withKey<T>(
  operation: string,
  run: (key: Buffer) => Promise<T>
): Promise<T> {
  let key: Buffer;
  try {
    key = readTotpEncryptionKey();
  } catch (error: unknown) {
    if (error instanceof TotpKeyError) {
      logger.error('[totp] encryption key unavailable; refusing', {
        operation,
        detail: error.message,
      });
      throw new GraphQLError(`TOTP unavailable: ${error.message}`, {
        extensions: {
          code: 'TOTP_KEY_UNAVAILABLE',
          http: { status: HTTP_UNAVAILABLE },
        },
      });
    }
    throw error;
  }
  try {
    return await run(key);
  } catch (error: unknown) {
    if (error instanceof TotpStateError) {
      throw new GraphQLError(`TOTP ${operation} refused: ${error.failure}`, {
        extensions: {
          code: error.failure.toUpperCase(),
          http: { status: FAILURE_STATUS[error.failure] },
        },
      });
    }
    throw error;
  }
}

function prismaOf(ctx: TotpContext): TotpPrisma {
  return getPrismaFromContext(ctx) as TotpPrisma;
}

/** The TOTP mutations. See the module documentation. */
@TypeGraphQL.Resolver()
export class UserTotpResolver {
  @TypeGraphQL.Mutation((_returns) => UserTotpEnrollment, {
    description:
      'Start (or restart a pending) TOTP enrolment. Service principal only.',
  })
  async enrollUserTotp(
    @TypeGraphQL.Arg('userId', (_type) => String) userId: string,
    @TypeGraphQL.Ctx() ctx: TotpContext
  ): Promise<UserTotpEnrollment> {
    assertServicePrincipal(ctx.principal);
    const enrollment = await withKey('enrol', (key) =>
      enrollTotp(prismaOf(ctx), userId, key)
    );
    return {
      otpauthUri: enrollment.otpauthUri,
      recoveryCodes: [...enrollment.recoveryCodes],
    };
  }

  @TypeGraphQL.Mutation((_returns) => UserTotpResult, {
    description:
      'Confirm a pending enrolment with a current code. Service principal only.',
  })
  async confirmUserTotp(
    @TypeGraphQL.Arg('userId', (_type) => String) userId: string,
    @TypeGraphQL.Arg('code', (_type) => String) code: string,
    @TypeGraphQL.Ctx() ctx: TotpContext
  ): Promise<UserTotpResult> {
    assertServicePrincipal(ctx.principal);
    const ok = await withKey('confirm', (key) =>
      confirmTotp(prismaOf(ctx), userId, code, key, Date.now())
    );
    return { ok };
  }

  @TypeGraphQL.Mutation((_returns) => UserTotpVerification, {
    description:
      'Verify a TOTP or recovery code (a recovery code is consumed). Service principal only.',
  })
  async verifyUserTotp(
    @TypeGraphQL.Arg('userId', (_type) => String) userId: string,
    @TypeGraphQL.Arg('code', (_type) => String) code: string,
    @TypeGraphQL.Ctx() ctx: TotpContext
  ): Promise<UserTotpVerification> {
    assertServicePrincipal(ctx.principal);
    const result = await withKey('verify', (key) =>
      verifyTotpCode(prismaOf(ctx), userId, code, key, Date.now())
    );
    return { ok: result.ok, recoveryUsed: result.recoveryUsed };
  }

  @TypeGraphQL.Mutation((_returns) => UserTotpResult, {
    description: 'Remove a TOTP enrolment. Service principal only.',
  })
  async disableUserTotp(
    @TypeGraphQL.Arg('userId', (_type) => String) userId: string,
    @TypeGraphQL.Ctx() ctx: TotpContext
  ): Promise<UserTotpResult> {
    assertServicePrincipal(ctx.principal);
    return { ok: await disableTotp(prismaOf(ctx), userId) };
  }
}
