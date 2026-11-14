/**
 * TOTP enrolment, confirmation, verification and removal against the
 * `user_totps` table. The resolver (`./UserTotpResolver.ts`) authorises the
 * caller and supplies the clock and the key; this module owns the database
 * effects and the order they happen in, so each step is a single conditional
 * write that a concurrent request cannot interleave with:
 *
 * - enrolment overwrites only a PENDING enrolment, never a confirmed one;
 * - a code is accepted only by a write conditional on its time step being
 *   later than the last accepted one, so it cannot be replayed;
 * - a recovery code is removed by `array_remove` conditional on its presence,
 *   so two requests presenting it cannot both succeed, and two requests
 *   presenting different codes cannot restore each other's.
 *
 * @module resolvers/custom/user-totp-service
 */

import { Prisma, type PrismaClient } from '@prisma/client';

import {
  decryptTotpSecret,
  encryptTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  otpauthUri,
  TOTP_DIGITS,
  verifyTotp,
} from '../../auth/totp';

/** Issuer shown in the authenticator app. */
export const TOTP_ISSUER = 'Adaptic';

/** What enrolment returns: the only time the secret and the codes leave the server. */
export interface TotpEnrollment {
  readonly otpauthUri: string;
  readonly recoveryCodes: readonly string[];
}

/** The outcome of a verification. */
export interface TotpVerification {
  readonly ok: boolean;
  readonly recoveryUsed: boolean;
}

/** Why an operation could not run, as distinct from a code that was wrong. */
export type TotpFailure =
  'user_not_found' | 'already_enabled' | 'not_enrolled' | 'not_enabled';

/** Raised for a {@link TotpFailure}; the resolver maps it onto a GraphQL error. */
export class TotpStateError extends Error {
  constructor(readonly failure: TotpFailure) {
    super(failure);
    this.name = 'TotpStateError';
  }
}

/** The slice of the Prisma client this module uses. */
export type TotpPrisma = Pick<
  PrismaClient,
  'user' | 'userTotp' | '$executeRaw'
>;

const SIX_DIGITS = new RegExp(`^\\d{${TOTP_DIGITS}}$`);

/**
 * Enrol (or re-enrol a pending) TOTP for a user. A confirmed enrolment is
 * never overwritten: it must be disabled first, so a stolen service call
 * cannot silently swap a user's second factor.
 */
export async function enrollTotp(
  prisma: TotpPrisma,
  userId: string,
  key: Buffer
): Promise<TotpEnrollment> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  if (!user) throw new TotpStateError('user_not_found');

  const secret = generateTotpSecret();
  const recoveryCodes = generateRecoveryCodes();
  const data = {
    secretEnc: encryptTotpSecret(secret, key),
    recoveryCodesHash: recoveryCodes.map(hashRecoveryCode),
    enabledAt: null,
    lastUsedStep: null,
  };

  const replaced = await prisma.userTotp.updateMany({
    where: { userId, enabledAt: null },
    data,
  });
  if (replaced.count === 0) {
    try {
      await prisma.userTotp.create({ data: { userId, ...data } });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new TotpStateError('already_enabled');
      }
      throw error;
    }
  }
  return {
    otpauthUri: otpauthUri(secret, user.email ?? user.id, TOTP_ISSUER),
    recoveryCodes,
  };
}

/** Confirm a pending enrolment with a current code; sets `enabledAt`. */
export async function confirmTotp(
  prisma: TotpPrisma,
  userId: string,
  code: string,
  key: Buffer,
  nowMs: number
): Promise<boolean> {
  const row = await prisma.userTotp.findUnique({
    where: { userId },
    select: { secretEnc: true, enabledAt: true, lastUsedStep: true },
  });
  if (!row) throw new TotpStateError('not_enrolled');
  if (row.enabledAt) throw new TotpStateError('already_enabled');
  const step = verifyTotp(
    decryptTotpSecret(row.secretEnc, key),
    code,
    nowMs,
    row.lastUsedStep
  );
  if (step === null) return false;
  const confirmed = await prisma.userTotp.updateMany({
    where: { userId, enabledAt: null, secretEnc: row.secretEnc },
    data: { enabledAt: new Date(nowMs), lastUsedStep: step },
  });
  return confirmed.count === 1;
}

/**
 * Verify a code for a confirmed enrolment: a six-digit TOTP code, or else a
 * recovery code, which is consumed.
 */
export async function verifyTotpCode(
  prisma: TotpPrisma,
  userId: string,
  code: string,
  key: Buffer,
  nowMs: number
): Promise<TotpVerification> {
  const row = await prisma.userTotp.findUnique({
    where: { userId },
    select: { secretEnc: true, enabledAt: true, lastUsedStep: true },
  });
  if (!row) throw new TotpStateError('not_enrolled');
  if (!row.enabledAt) throw new TotpStateError('not_enabled');

  const trimmed = code.replace(/\s+/g, '');
  if (SIX_DIGITS.test(trimmed)) {
    const step = verifyTotp(
      decryptTotpSecret(row.secretEnc, key),
      trimmed,
      nowMs,
      row.lastUsedStep
    );
    if (step === null) return { ok: false, recoveryUsed: false };
    const accepted = await prisma.userTotp.updateMany({
      where: {
        userId,
        OR: [{ lastUsedStep: null }, { lastUsedStep: { lt: step } }],
      },
      data: { lastUsedStep: step },
    });
    return { ok: accepted.count === 1, recoveryUsed: false };
  }

  const hash = hashRecoveryCode(trimmed);
  const consumed = await prisma.$executeRaw`
    UPDATE "user_totps"
       SET "recoveryCodesHash" = array_remove("recoveryCodesHash", ${hash}),
           "updatedAt" = NOW()
     WHERE "userId" = ${userId}::uuid
       AND "enabledAt" IS NOT NULL
       AND ${hash} = ANY("recoveryCodesHash")`;
  return consumed === 1
    ? { ok: true, recoveryUsed: true }
    : { ok: false, recoveryUsed: false };
}

/**
 * A user's enrolment state, without any secret material: whether an enrolment
 * row exists (pending or confirmed), whether it is confirmed, and when.
 */
export interface TotpStatus {
  readonly enrolled: boolean;
  readonly enabled: boolean;
  readonly enabledAt: Date | null;
}

/**
 * Read a user's enrolment state. Selects only `enabledAt`, so neither the
 * ciphertext nor the recovery-code hashes are ever loaded for this read.
 */
export async function readTotpStatus(
  prisma: TotpPrisma,
  userId: string
): Promise<TotpStatus> {
  const row = await prisma.userTotp.findUnique({
    where: { userId },
    select: { enabledAt: true },
  });
  if (!row) return { enrolled: false, enabled: false, enabledAt: null };
  return {
    enrolled: true,
    enabled: row.enabledAt !== null,
    enabledAt: row.enabledAt,
  };
}

/** Remove a user's enrolment. Returns whether one existed. */
export async function disableTotp(
  prisma: TotpPrisma,
  userId: string
): Promise<boolean> {
  const removed = await prisma.userTotp.deleteMany({ where: { userId } });
  return removed.count > 0;
}
