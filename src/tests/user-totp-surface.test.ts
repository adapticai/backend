import { describe, it, expect, beforeAll } from 'vitest';
import { runTsNodeHarness } from '../middleware/__tests__/ts-node-harness';
import { credentialEnumValuesFor } from '../middleware/credential-field-guard';

/**
 * The served GraphQL schema never returns the UserTotp secret or the
 * recovery-code hashes, and never accepts them as a filter or sort key.
 *
 * `@TypeGraphQL.omit(output: true, input: ["where", "orderBy"])` on each column
 * removes it from every output type (the model, groupBy, min/max aggregates,
 * bulk-write return rows) and from every predicate input, while leaving it on
 * the create and update inputs so an enrolment can be written. The one place
 * typegraphql-prisma still names the column is `UserTotpScalarFieldEnum`
 * (`groupBy(by:)`, `distinct`), which the credential-field guard claims.
 *
 * The schema is built out of process (`user-totp-surface.harness.ts`) because
 * the generated resolvers need `emitDecoratorMetadata`.
 */

interface TotpSurfaceReport {
  outputs: string[];
  predicates: string[];
  writeInputs: string[];
  enumValues: string[];
  userTotpFields: string[];
  totpMutationOutputs: Record<string, string[]>;
}

const HARNESS_TIMEOUT_MS = 300_000;

describe('UserTotp secrets on the served GraphQL schema', () => {
  let report: TotpSurfaceReport;

  beforeAll(async () => {
    report = await runTsNodeHarness<TotpSurfaceReport>(
      'src/tests/user-totp-surface.harness.ts',
      HARNESS_TIMEOUT_MS
    );
  }, HARNESS_TIMEOUT_MS + 30_000);

  it('builds the UserTotp type the harness inspects', () => {
    expect(report.userTotpFields).toEqual([
      'createdAt',
      'enabledAt',
      'id',
      'lastUsedStep',
      'updatedAt',
      'user',
      'userId',
    ]);
  });

  it('no output type returns them', () => {
    expect(report.outputs).toEqual([]);
  });

  it('the TOTP mutations are served, and only enrolment returns secret material', () => {
    expect(report.totpMutationOutputs).toEqual({
      enrollUserTotp: ['otpauthUri', 'recoveryCodes'],
      confirmUserTotp: ['ok'],
      verifyUserTotp: ['ok', 'recoveryUsed'],
      disableUserTotp: ['ok'],
    });
  });

  it('no filter, sort or having input accepts them', () => {
    expect(report.predicates).toEqual([]);
  });

  it('the create and update inputs still accept them, so enrolment can be written', () => {
    expect(report.writeInputs).toEqual(
      expect.arrayContaining([
        'UserTotpCreateInput.secretEnc',
        'UserTotpCreateInput.recoveryCodesHash',
        'UserTotpUpdateInput.secretEnc',
        'UserTotpUpdateInput.recoveryCodesHash',
      ])
    );
  });

  it('every enum value that names them is claimed by the credential-field guard', () => {
    const unclaimed = report.enumValues.filter((ref) => {
      const [typeName, value] = ref.split('.');
      return !(credentialEnumValuesFor(typeName)?.has(value) ?? false);
    });
    expect(unclaimed).toEqual([]);
  });
});
