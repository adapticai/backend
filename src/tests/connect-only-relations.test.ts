/**
 * The generated client writes a relation whose back-relation is omitted from
 * every GraphQL input by `connect: { id }` only (`isConnectOnlyRelation` in
 * src/modules/generator.ts): an access row's user and organization, a group's
 * office, an entity's office and parent. Read from the committed generated
 * functions, which CI regenerates and diffs against the schema, so this pins
 * the shipped surface: the service still names the row by id through the
 * published client, and no nested create or upsert of the related model is
 * emitted.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (model: string): string =>
  readFileSync(join(__dirname, '..', `${model}.ts`), 'utf8');

const CONNECT_ONLY: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['AuditorGrant', ['officeOrganization', 'user']],
  ['RoleAssignment', ['organization', 'user']],
  ['EntityGroup', ['office']],
  ['Investor', ['officeOrganization', 'parentInvestor']],
];

describe('connect-only relations in the generated client', () => {
  it.each(CONNECT_ONLY)(
    '%s writes %j by connect with the id the caller names',
    (model, relations) => {
      const source = read(model);
      for (const relation of relations) {
        expect(source, relation).toContain(
          `${relation}: props.${relation} && props.${relation}.id !== undefined ? { connect: { id: props.${relation}.id } } : undefined,`
        );
        expect(source, relation).not.toMatch(
          new RegExp(`\\b${relation}: props\\.${relation} \\?`)
        );
      }
    }
  );

  it('emits no nested create or upsert for an access row', () => {
    for (const model of ['AuditorGrant', 'RoleAssignment', 'EntityGroup']) {
      const source = read(model);
      expect(source, model).not.toContain('connectOrCreate');
      expect(source, model).not.toContain('upsert: {');
    }
  });

  it("writes an entity's office through a holding's investor by connect as well", () => {
    expect(read('Holding')).toContain(
      'officeOrganization: props.investor.officeOrganization && props.investor.officeOrganization.id !== undefined ? { connect: { id: props.investor.officeOrganization.id } } : undefined,'
    );
  });
});
