/**
 * The served access reads (AG-29, GAP-MO-ORG-02): `activeAuditorGrants`,
 * `activeRoleAssignments` and `officeEntities`. The rules live in
 * `./allocator-access-service.ts`; this file maps them onto GraphQL, logs and
 * counts every outcome, and turns a refusal into a typed error.
 *
 * @module resolvers/custom/AllocatorAccessResolver
 */

import * as TypeGraphQL from 'type-graphql';
import { GraphQLError } from 'graphql';

import type { BackendPrincipal } from '../../auth/token-verifier';
import { accessReadsTotal } from '../../config/metrics';
import { AuditorGrant } from '../../generated/typegraphql-prisma/models/AuditorGrant';
import { InvestorKycStatus } from '../../generated/typegraphql-prisma/enums/InvestorKycStatus';
import { InvestorStatus } from '../../generated/typegraphql-prisma/enums/InvestorStatus';
import { InvestorType } from '../../generated/typegraphql-prisma/enums/InvestorType';
import { RoleAssignment } from '../../generated/typegraphql-prisma/models/RoleAssignment';
import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import { logger } from '../../utils/logger';
import {
  activeAuditorGrants,
  activeRoleAssignments,
  AllocatorAccessRefusal,
  officeEntities,
  type AllocatorAccessPrisma,
  type AllocatorAccessRefusalCode,
  type OfficeEntityRow,
} from './allocator-access-service';

/**
 * One entity of an allocator office, as `officeEntities` serves it: identity,
 * classification and place in the office's entity tree. Narrow on purpose:
 * holdings, documents and the linked user are read through their own scoped
 * reads, never through this one.
 */
@TypeGraphQL.ObjectType('OfficeEntity', {})
export class OfficeEntity {
  @TypeGraphQL.Field((_type) => String)
  id!: string;

  @TypeGraphQL.Field((_type) => String)
  name!: string;

  @TypeGraphQL.Field((_type) => InvestorType)
  type!: InvestorType;

  @TypeGraphQL.Field((_type) => InvestorStatus)
  status!: InvestorStatus;

  @TypeGraphQL.Field((_type) => InvestorKycStatus)
  kycStatus!: InvestorKycStatus;

  @TypeGraphQL.Field((_type) => String, { nullable: true })
  jurisdiction!: string | null;

  @TypeGraphQL.Field((_type) => String, { nullable: true })
  registrationNumber!: string | null;

  @TypeGraphQL.Field((_type) => String, {
    nullable: true,
    description: 'The parent entity in the office tree; null for a root entity.',
  })
  parentInvestorId!: string | null;

  @TypeGraphQL.Field((_type) => String, { nullable: true })
  officeOrganizationId!: string | null;

  @TypeGraphQL.Field((_type) => String, {
    description: "The fund organization's id (Investor.organizationId).",
  })
  organizationId!: string;
}

/** GraphQL context fields the resolver reads. */
interface AccessContext {
  principal?: BackendPrincipal | null;
  prisma?: unknown;
}

const HTTP_STATUS: Record<AllocatorAccessRefusalCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  BAD_USER_INPUT: 400,
};

/** Run one read, counting its outcome and mapping a refusal onto a typed GraphQL error. */
async function run<T>(
  query: string,
  ctx: AccessContext,
  read: () => Promise<T[]>
): Promise<T[]> {
  const principalKind = ctx.principal?.kind ?? 'none';
  try {
    const rows = await read();
    accessReadsTotal.inc({
      query,
      principal_kind: principalKind,
      outcome: 'served',
    });
    return rows;
  } catch (error: unknown) {
    if (error instanceof AllocatorAccessRefusal) {
      accessReadsTotal.inc({
        query,
        principal_kind: principalKind,
        outcome: error.code,
      });
      logger.warn('[access-read] refused', {
        query,
        principalKind,
        code: error.code,
        reason: error.message,
      });
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
          http: { status: HTTP_STATUS[error.code] },
        },
      });
    }
    accessReadsTotal.inc({
      query,
      principal_kind: principalKind,
      outcome: 'error',
    });
    logger.error('[access-read] failed', {
      query,
      principalKind,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

function prismaOf(ctx: AccessContext): AllocatorAccessPrisma {
  return getPrismaFromContext(ctx) as AllocatorAccessPrisma;
}

/** The served access reads. See the module documentation. */
@TypeGraphQL.Resolver()
export class AllocatorAccessResolver {
  @TypeGraphQL.Query((_returns) => [AuditorGrant], {
    description:
      "The auditor grants active now (not revoked, expiring after now), in the caller's organizations. Filter by issuing office and by auditor.",
  })
  async activeAuditorGrants(
    @TypeGraphQL.Arg('officeOrganizationId', (_type) => String, {
      nullable: true,
    })
    officeOrganizationId: string | null,
    @TypeGraphQL.Arg('userId', (_type) => String, { nullable: true })
    userId: string | null,
    @TypeGraphQL.Ctx() ctx: AccessContext
  ): Promise<AuditorGrant[]> {
    return run('activeAuditorGrants', ctx, () =>
      activeAuditorGrants<AuditorGrant>(prismaOf(ctx), ctx.principal, {
        organizationId: officeOrganizationId,
        userId,
      })
    );
  }

  @TypeGraphQL.Query((_returns) => [RoleAssignment], {
    description:
      "The role assignments active now (started, not yet ended), in the caller's organizations. Filter by organization and by holder.",
  })
  async activeRoleAssignments(
    @TypeGraphQL.Arg('organizationId', (_type) => String, { nullable: true })
    organizationId: string | null,
    @TypeGraphQL.Arg('userId', (_type) => String, { nullable: true })
    userId: string | null,
    @TypeGraphQL.Ctx() ctx: AccessContext
  ): Promise<RoleAssignment[]> {
    return run('activeRoleAssignments', ctx, () =>
      activeRoleAssignments<RoleAssignment>(prismaOf(ctx), ctx.principal, {
        organizationId,
        userId,
      })
    );
  }

  @TypeGraphQL.Query((_returns) => [OfficeEntity], {
    description:
      "The entities an allocator office owns that the viewer may see: their membership's entity scope (every entity only when entityScopeAll is true) plus the entities their active auditor grants for the office name. Empty when neither grants any. A user reads their own view; the service names the viewer.",
  })
  async officeEntities(
    @TypeGraphQL.Arg('officeOrganizationId', (_type) => String)
    officeOrganizationId: string,
    @TypeGraphQL.Arg('userId', (_type) => String, { nullable: true })
    userId: string | null,
    @TypeGraphQL.Ctx() ctx: AccessContext
  ): Promise<OfficeEntityRow[]> {
    return run('officeEntities', ctx, () =>
      officeEntities(prismaOf(ctx), ctx.principal, {
        officeOrganizationId,
        userId,
      })
    );
  }
}
