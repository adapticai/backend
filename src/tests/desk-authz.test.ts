import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';

/**
 * Desk-model authorization, the TOTP mutations, natural-key upserts, the Ada
 * message delete restriction and the MandateVersion write rules, measured on
 * the served schema against a real Postgres (`desk-authz.harness.ts`).
 *
 * SKIPPED IN CI: it runs only when DESK_IT_DATABASE_URL points at a
 * disposable database the migrations have been applied to, and CI has none.
 * The pure halves of these rules are covered without a database by
 * src/auth/__tests__/desk-authorization.test.ts and totp.test.ts.
 *
 *   DESK_IT_DATABASE_URL=postgresql://postgres@127.0.0.1:5499/desk_it \
 *     npx vitest run src/tests/desk-authz.test.ts
 */

interface StepResult {
  data: Record<string, unknown> | null;
  errors: string[];
  codes: string[];
}

interface Report {
  unauthenticatedReads: Record<string, string[]>;
  crossUser: Record<string, unknown>;
  totpWrites: Record<string, StepResult> & {
    rowAfter: { enabledAt: string | null } | null;
  };
  naturalKey: {
    followRowsAfterTwoServerUpserts: number[];
    userFollowUpsertErrors: string[];
    followRowsAfterUserUpsert: number[];
    otherUserFollowUpsertCodes: string[];
    followRowsAfterOtherUser: number[];
    pushRows: string[];
  };
  conversationDelete: StepResult;
  conversationStillThere: boolean;
  totp: Record<string, unknown>;
  mandate: Record<string, StepResult>;
  notificationPreferenceEnforced: {
    own: string[];
    other: string[];
    expectedOwn: string[];
  };
  unauthenticatedWrite: StepResult;
}

const DATABASE_URL = process.env.DESK_IT_DATABASE_URL;
const HARNESS_TIMEOUT_MS = 300_000;

describe.skipIf(!DATABASE_URL)(
  'desk authorization on the served schema',
  () => {
    let report: Report;

    beforeAll(async () => {
      report = await runTsNodeHarness<Report>(
        'src/tests/desk-authz.harness.ts',
        HARNESS_TIMEOUT_MS
      );
    }, HARNESS_TIMEOUT_MS + 30_000);

    it('refuses an unauthenticated read of every desk model with the staged modes at shadow', () => {
      expect(report.unauthenticatedReads).toEqual({
        follows: ['UNAUTHENTICATED'],
        autoFollowRules: ['UNAUTHENTICATED'],
        pushSubscriptions: ['UNAUTHENTICATED'],
        adaConversations: ['UNAUTHENTICATED'],
        adaMessages: ['UNAUTHENTICATED'],
        userTotps: ['UNAUTHENTICATED'],
        deskDecisions: ['UNAUTHENTICATED'],
        featureFlagOverrides: ['UNAUTHENTICATED'],
      });
    });

    it("does not let a user read another user's Follow, private AdaConversation, messages, PushSubscription, TOTP or override", () => {
      const c = report.crossUser;
      expect(c.ownFollow).not.toBeNull();
      expect(c.ownMessages).toBe(1);
      expect(c.otherFollow).toBeNull();
      expect(c.otherFollows).toEqual([]);
      expect(c.otherPrivateConversation).toBeNull();
      expect(c.otherMessages).toEqual([]);
      expect(c.otherPush).toBeNull();
      expect(c.otherPushes).toEqual([]);
      expect(c.otherTotps).toEqual([]);
      expect(c.otherOverrides).toEqual([]);
      // A conversation shared with the organization is readable by its members.
      expect(c.otherSharedConversation).not.toBeNull();
    });

    it('refuses UserTotp update and delete by a user or admin with mutation-auth mode shadow', () => {
      const w = report.totpWrites;
      for (const step of [
        'userUpdate',
        'userDelete',
        'adminUpdate',
        'adminDelete',
      ]) {
        expect(w[step].codes, step).toEqual(['FORBIDDEN']);
      }
      expect(w.rowAfter).toEqual({ enabledAt: null });
      expect(w.serverDelete.errors).toEqual([]);
    });

    it('upserts a Follow and a PushSubscription by natural key without an id: twice is one row', () => {
      const n = report.naturalKey;
      expect(n.followRowsAfterTwoServerUpserts).toEqual([2]);
      expect(n.userFollowUpsertErrors).toEqual([]);
      expect(n.followRowsAfterUserUpsert).toEqual([0]);
      expect(n.otherUserFollowUpsertCodes).toEqual(['FORBIDDEN']);
      expect(n.followRowsAfterOtherUser).toEqual([0]);
      expect(n.pushRows).toEqual(['p2']);
    });

    it('refuses to delete a conversation that still has messages', () => {
      expect(
        report.conversationDelete.data?.deleteOneAdaConversation ?? null
      ).toBeNull();
      expect(report.conversationDelete.errors.join('\n')).toContain(
        'ada_messages_conversationId_fkey'
      );
      expect(report.conversationStillThere).toBe(true);
    });

    it('enrols, confirms and verifies TOTP for the service principal only, with single-use recovery codes', () => {
      const t = report.totp;
      expect(t.enrollErrors).toEqual([]);
      expect(t.recoveryCodeCount).toBe(10);
      expect(t.storedSecretIsCiphertext).toBe(true);
      expect(t.storedHashesExcludeCodes).toBe(true);
      expect(t.userEnroll).toEqual(['FORBIDDEN']);
      expect(t.adminEnroll).toEqual(['FORBIDDEN']);
      expect(t.unauthVerify).toEqual(['UNAUTHENTICATED']);
      expect(t.confirmWrong).toEqual({ confirmUserTotp: { ok: false } });
      expect(t.confirmRight).toEqual({ confirmUserTotp: { ok: true } });
      expect(t.reEnroll).toEqual(['ALREADY_ENABLED']);
      expect(t.verifyWrong).toEqual({
        verifyUserTotp: { ok: false, recoveryUsed: false },
      });
      expect(t.verifyReplay).toEqual({
        verifyUserTotp: { ok: false, recoveryUsed: false },
      });
      expect(t.verifyNextStep).toEqual({
        verifyUserTotp: { ok: true, recoveryUsed: false },
      });
      expect(t.verifyRecovery).toEqual({
        verifyUserTotp: { ok: true, recoveryUsed: true },
      });
      expect(t.verifyRecoveryAgain).toEqual({
        verifyUserTotp: { ok: false, recoveryUsed: false },
      });
      expect(t.hashesLeft).toBe(9);
      expect(t.missingKey).toEqual(['TOTP_KEY_UNAVAILABLE']);
      expect(t.disable).toEqual({ disableUserTotp: { ok: true } });
    });

    it('validates MandateVersion JSON on direct and nested writes and holds versions to the mandate tenant', () => {
      const m = report.mandate;
      expect(m.invalidAutonomy.codes).toEqual(['BAD_USER_INPUT']);
      expect(m.invalidTrigger.codes).toEqual(['BAD_USER_INPUT']);
      expect(m.invalidNested.codes).toEqual(['BAD_USER_INPUT']);
      expect(m.valid.errors).toEqual([]);
      expect(m.outsideTenant.codes).toEqual(['FORBIDDEN']);
      expect(m.insideTenant.errors).toEqual([]);
    });

    it('scopes a user-equality model under TENANCY_SCOPING_MODE=enforce on the served schema', () => {
      const p = report.notificationPreferenceEnforced;
      expect(p.own).toEqual(p.expectedOwn);
      expect(p.other).toEqual([]);
    });

    it('refuses an unauthenticated desk write with mutation-auth mode shadow', () => {
      expect(report.unauthenticatedWrite.codes).toEqual(['UNAUTHENTICATED']);
    });
  }
);
