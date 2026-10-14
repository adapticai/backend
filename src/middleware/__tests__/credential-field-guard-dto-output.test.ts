/**
 * A hand-written credential DTO is guarded on the same terms as the model
 * column it carries.
 *
 * `indexGeneratedTypes` derives the guarded output surface from
 * typegraphql-prisma's naming rules, so it covers `AlpacaAccount`,
 * `AlpacaAccountGroupBy`, `CreateManyAndReturnAlpacaAccount` and the rest
 * without being told. A type the generator never produces is invisible to
 * those rules — which is exactly what a dedicated server-only credential DTO
 * is.
 *
 * The DTO's own resolver carries a principal check, and that check is not what
 * this proves. A GraphQL type is reachable from whatever resolver returns it,
 * and the next resolver to return this one inherits no check at all; a guard
 * that stops at the generated names would serve the column there. So the
 * guard claims the DTO's columns independently, and the two layers fail
 * separately rather than together.
 *
 * @module middleware/__tests__/credential-field-guard-dto-output.test
 */
import { describe, expect, it } from 'vitest';

import {
  credentialOutputFieldsFor,
  findCredentialOutputField,
} from '../credential-field-guard';

/** The server-only DTO that serves an account's broker credentials. */
const DTO = 'AlpacaAccountCredentials';

describe('hand-written credential output types', () => {
  it('claims the DTO columns the generator would not name', () => {
    expect(credentialOutputFieldsFor(DTO)).toEqual(new Set(['APIKey', 'APISecret']));
  });

  it('identifies a credential read on the DTO, field by field', () => {
    for (const fieldName of ['APIKey', 'APISecret']) {
      expect(
        findCredentialOutputField({ parentType: { name: DTO }, fieldName }),
      ).toBe(`${DTO}.${fieldName}`);
    }
  });

  it('leaves the DTO’s non-credential fields alone', () => {
    // Over-claiming is its own defect: a guard that refused `accountId` would
    // make the DTO unreadable by the one principal it exists to serve.
    for (const fieldName of ['accountId', 'type']) {
      expect(
        findCredentialOutputField({ parentType: { name: DTO }, fieldName }),
      ).toBeUndefined();
    }
  });

  it('still claims the generated types, so the DTO entry is additive', () => {
    expect(credentialOutputFieldsFor('AlpacaAccount')).toEqual(
      new Set(['APIKey', 'APISecret']),
    );
    expect(
      findCredentialOutputField({
        parentType: { name: 'CreateManyAndReturnAlpacaAccount' },
        fieldName: 'APISecret',
      }),
    ).toBe('CreateManyAndReturnAlpacaAccount.APISecret');
  });

  it('claims nothing for an unrelated type', () => {
    expect(credentialOutputFieldsFor('TradeCredentialsSummary')).toBeUndefined();
  });
});
