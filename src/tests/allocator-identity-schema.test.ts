import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import {
  AuditWorkspace,
  OrganizationKind,
  OrgRole,
  Prisma,
  RoleScopeType,
  Workspace,
  WorkspaceRole,
} from '@prisma/client';

import { AuditorGrant } from '../generated/selectionSets/AuditorGrant';
import { EntityGroup } from '../generated/selectionSets/EntityGroup';
import { RoleAssignment } from '../generated/selectionSets/RoleAssignment';
import { Organization } from '../generated/selectionSets/Organization';
import { OrgMembership } from '../generated/selectionSets/OrgMembership';
import { Investor } from '../generated/selectionSets/Investor';
import { AuditLog } from '../generated/selectionSets/AuditLog';

/**
 * The Wave 2 identity contract (AG-10, AG-29, GAP-MO-ORG-02, GAP-MO-WALL-03):
 * the model, field and enum names the platform codes sign-in and the Phase B
 * views against. They are frozen, so a rename fails here before it reaches a
 * consumer; new enum members are appended, never renamed.
 */

type FieldSpec = {
  name: string;
  type: string;
  isList?: boolean;
  isRequired: boolean;
};

function fieldsOf(model: string): Map<string, Prisma.DMMF.Field> {
  const found = Prisma.dmmf.datamodel.models.find((m) => m.name === model);
  if (!found) throw new Error(`model ${model} is not in the schema`);
  return new Map(found.fields.map((f) => [f.name, f]));
}

function expectFields(model: string, specs: FieldSpec[]): void {
  const fields = fieldsOf(model);
  for (const spec of specs) {
    const field = fields.get(spec.name);
    expect(field, `${model}.${spec.name}`).toBeDefined();
    expect(
      {
        type: field?.type,
        isList: field?.isList,
        isRequired: field?.isRequired,
      },
      `${model}.${spec.name}`
    ).toEqual({
      type: spec.type,
      isList: spec.isList ?? false,
      isRequired: spec.isRequired,
    });
  }
}

/** The names a selection-set string selects at its top level. */
function selected(selection: string): string[] {
  return selection
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[A-Za-z_]+$/.test(line));
}

describe('frozen enums', () => {
  it('carries the allocator roles appended to OrgRole', () => {
    expect(Object.values(OrgRole).slice(-3)).toEqual([
      'ALLOCATOR_PRINCIPAL',
      'INVESTMENT_LEAD',
      'OPERATIONS_LEAD',
    ]);
  });

  it('names the organization kinds, workspaces, scope types, workspace roles and audit workspaces', () => {
    expect(Object.values(OrganizationKind)).toEqual([
      'MANAGER',
      'ALLOCATOR_OFFICE',
    ]);
    expect(Object.values(Workspace)).toEqual(['STRATEGY', 'FUND', 'SHARED']);
    expect(Object.values(RoleScopeType)).toEqual([
      'ORGANIZATION',
      'FUND',
      'SLEEVE',
    ]);
    expect(Object.values(WorkspaceRole)).toEqual([
      'COO',
      'SECOND_APPROVER',
      'OVERSIGHT',
      'VERIFIER',
    ]);
    expect(Object.values(AuditWorkspace)).toEqual([
      'STRATEGY',
      'FUND',
      'SHARED',
      'ORGANISATION',
    ]);
  });
});

describe('frozen fields', () => {
  it('extends Organization, Investor, OrgMembership and AuditLog', () => {
    expectFields('Organization', [
      { name: 'kind', type: 'OrganizationKind', isRequired: true },
      { name: 'timeZone', type: 'String', isRequired: false },
    ]);
    expectFields('Investor', [
      { name: 'parentInvestorId', type: 'String', isRequired: false },
      { name: 'registrationNumber', type: 'String', isRequired: false },
      { name: 'officeOrganizationId', type: 'String', isRequired: false },
    ]);
    expectFields('OrgMembership', [
      { name: 'entityScopeAll', type: 'Boolean', isRequired: true },
      {
        name: 'entityScopeIds',
        type: 'String',
        isList: true,
        isRequired: true,
      },
    ]);
    expectFields('AuditLog', [
      { name: 'workspace', type: 'AuditWorkspace', isRequired: false },
    ]);
    expect(fieldsOf('Organization').get('kind')?.default).toBe('MANAGER');
    expect(fieldsOf('OrgMembership').get('entityScopeAll')?.default).toBe(
      false
    );
  });

  it('builds EntityGroup, AuditorGrant and RoleAssignment', () => {
    expectFields('EntityGroup', [
      { name: 'id', type: 'String', isRequired: true },
      { name: 'officeId', type: 'String', isRequired: true },
      { name: 'name', type: 'String', isRequired: true },
      { name: 'investorIds', type: 'String', isList: true, isRequired: true },
      { name: 'createdAt', type: 'DateTime', isRequired: true },
      { name: 'updatedAt', type: 'DateTime', isRequired: true },
    ]);
    expectFields('AuditorGrant', [
      { name: 'officeOrganizationId', type: 'String', isRequired: true },
      { name: 'userId', type: 'String', isRequired: true },
      { name: 'entityIds', type: 'String', isList: true, isRequired: true },
      { name: 'periodFrom', type: 'DateTime', isRequired: true },
      { name: 'periodTo', type: 'DateTime', isRequired: true },
      { name: 'expiresAt', type: 'DateTime', isRequired: true },
      { name: 'revokedAt', type: 'DateTime', isRequired: false },
      { name: 'grantedById', type: 'String', isRequired: true },
      { name: 'createdAt', type: 'DateTime', isRequired: true },
    ]);
    expectFields('RoleAssignment', [
      { name: 'organizationId', type: 'String', isRequired: true },
      { name: 'userId', type: 'String', isRequired: true },
      { name: 'role', type: 'WorkspaceRole', isRequired: true },
      { name: 'workspace', type: 'Workspace', isRequired: true },
      { name: 'scopeType', type: 'RoleScopeType', isRequired: true },
      { name: 'scopeId', type: 'String', isRequired: false },
      { name: 'startsAt', type: 'DateTime', isRequired: true },
      { name: 'endsAt', type: 'DateTime', isRequired: false },
      { name: 'grantedById', type: 'String', isRequired: true },
      { name: 'createdAt', type: 'DateTime', isRequired: true },
    ]);
  });
});

describe('generated selection sets (the adaptic.* read contract)', () => {
  it('select every scalar of the new models', () => {
    expect(selected(EntityGroup)).toEqual([
      'id',
      'officeId',
      'name',
      'investorIds',
      'createdAt',
      'updatedAt',
    ]);
    expect(selected(AuditorGrant)).toEqual([
      'id',
      'officeOrganizationId',
      'userId',
      'entityIds',
      'periodFrom',
      'periodTo',
      'expiresAt',
      'revokedAt',
      'grantedById',
      'createdAt',
    ]);
    expect(selected(RoleAssignment)).toEqual([
      'id',
      'organizationId',
      'userId',
      'role',
      'workspace',
      'scopeType',
      'scopeId',
      'startsAt',
      'endsAt',
      'grantedById',
      'createdAt',
    ]);
  });

  it('select the new columns on the extended models, and none of the access back-relations', () => {
    expect(selected(Organization)).toEqual(
      expect.arrayContaining(['kind', 'timeZone'])
    );
    expect(selected(OrgMembership)).toEqual(
      expect.arrayContaining(['entityScopeAll', 'entityScopeIds'])
    );
    expect(selected(Investor)).toEqual(
      expect.arrayContaining([
        'parentInvestorId',
        'registrationNumber',
        'officeOrganizationId',
      ])
    );
    expect(selected(AuditLog)).toEqual(expect.arrayContaining(['workspace']));
    for (const relation of [
      'roleAssignments',
      'auditorGrants',
      'entityGroups',
      'officeInvestors',
    ]) {
      expect(Organization, relation).not.toMatch(
        new RegExp(`\\b${relation}\\b`)
      );
    }
    for (const relation of [
      'parentInvestor',
      'childInvestors',
      'officeOrganization',
    ]) {
      expect(selected(Investor), relation).not.toContain(relation);
    }
  });
});

describe('migration 20261123090000_allocator_identity_roles', () => {
  const sql = readFileSync(
    join(
      __dirname,
      '..',
      '..',
      'prisma',
      'migrations',
      '20261123090000_allocator_identity_roles',
      'migration.sql'
    ),
    'utf8'
  )
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  it('is additive: it drops, renames and retypes nothing', () => {
    expect(sql).not.toMatch(/\bDROP\b/i);
    expect(sql).not.toMatch(/\bRENAME\b/i);
    expect(sql).not.toMatch(/ALTER\s+COLUMN/i);
  });

  it('adds every new column to an existing table as nullable or with a default', () => {
    const added = sql.match(/ADD COLUMN\s+"[^"]+"[^,;]*/g) ?? [];
    expect(added.length).toBe(8);
    for (const column of added) {
      expect(
        column.includes('NOT NULL') ? column.includes('DEFAULT') : true,
        column
      ).toBe(true);
    }
  });

  it('holds the invariants Prisma cannot state as check constraints', () => {
    expect(sql).toContain('CHECK ("periodFrom" <= "periodTo")');
    expect(sql).toContain('CHECK ("endsAt" IS NULL OR "endsAt" > "startsAt")');
    expect(sql).toContain(
      `CHECK (("scopeType" = 'ORGANIZATION') = ("scopeId" IS NULL))`
    );
    expect(sql).toContain(
      'CHECK ("parentInvestorId" IS NULL OR "parentInvestorId" <> "id")'
    );
  });
});
