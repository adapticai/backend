/**
 * The strategy-draft mutations (G-STR-08): `createStrategyDraft`,
 * `saveStrategyDraft`, `deleteStrategyDraft` and `recordStrategyDraftBacktest`.
 *
 * These are the only way a signed-in user writes a `Strategy` row; the
 * generated `Strategy` mutations stay service-only for a user. The rules —
 * the author only, in a fund the author belongs to, the DRAFT state only, no operator-governed column, and a
 * revision compare-and-set in one statement — live in
 * `./strategy-draft-service.ts` and hold in every `MUTATION_AUTH_MODE`; the
 * mutation guard lists these fields as `resolver_authorized` so it defers to
 * them (`src/auth/mutation-authorization.ts`).
 *
 * @module resolvers/custom/StrategyDraftResolver
 */

import * as TypeGraphQL from 'type-graphql';
import * as GraphQLScalars from 'graphql-scalars';
import { GraphQLError } from 'graphql';

import type { BackendPrincipal } from '../../auth/token-verifier';
import { StrategyKind } from '../../generated/typegraphql-prisma/enums/StrategyKind';
import { getPrismaFromContext } from '../../generated/typegraphql-prisma/helpers';
import {
  createStrategyDraft,
  deleteStrategyDraft,
  recordStrategyDraftBacktest,
  saveStrategyDraft,
  StrategyDraftRefusal,
  type DraftWriteOutcome,
  type StrategyDraftPrisma,
} from './strategy-draft-service';

/** How a draft write ended (mirrors `DraftWriteStatus`). */
export enum StrategyDraftWriteStatus {
  WRITTEN = 'WRITTEN',
  NOT_FOUND = 'NOT_FOUND',
  NOT_DRAFT = 'NOT_DRAFT',
  STALE = 'STALE',
  SPEC_MISMATCH = 'SPEC_MISMATCH',
}

TypeGraphQL.registerEnumType(StrategyDraftWriteStatus, {
  name: 'StrategyDraftWriteStatus',
  description:
    "WRITTEN: the write landed. NOT_FOUND: not the caller's draft in a fund they belong to. NOT_DRAFT: submitted or running. STALE: the draft moved since the revision named. SPEC_MISMATCH: the hash is not the stored spec's.",
});

/** The outcome of a draft write. */
@TypeGraphQL.ObjectType('StrategyDraftWrite', {})
export class StrategyDraftWrite {
  @TypeGraphQL.Field((_type) => StrategyDraftWriteStatus)
  status!: StrategyDraftWriteStatus;

  @TypeGraphQL.Field((_type) => String)
  id!: string;

  @TypeGraphQL.Field((_type) => Date, {
    nullable: true,
    description:
      'The new `updatedAt`, the revision the next write must name; null unless WRITTEN.',
  })
  revision!: Date | null;
}

/** GraphQL context fields the resolver reads. */
interface DraftContext {
  principal?: BackendPrincipal | null;
  prisma?: unknown;
}

const HTTP_STATUS: Record<StrategyDraftRefusal['code'], number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  BAD_USER_INPUT: 400,
};

/** Run one operation, mapping a refusal onto a typed GraphQL error. */
async function run(
  operation: () => Promise<DraftWriteOutcome>
): Promise<StrategyDraftWrite> {
  try {
    const outcome = await operation();
    return {
      status: StrategyDraftWriteStatus[outcome.status],
      id: outcome.id,
      revision: outcome.revision,
    };
  } catch (error: unknown) {
    if (error instanceof StrategyDraftRefusal) {
      throw new GraphQLError(error.message, {
        extensions: {
          code: error.code,
          http: { status: HTTP_STATUS[error.code] },
        },
      });
    }
    throw error;
  }
}

function prismaOf(ctx: DraftContext): StrategyDraftPrisma {
  return getPrismaFromContext(ctx) as StrategyDraftPrisma;
}

/** The strategy-draft mutations. See the module documentation. */
@TypeGraphQL.Resolver()
export class StrategyDraftResolver {
  @TypeGraphQL.Mutation((_returns) => StrategyDraftWrite, {
    description:
      'Create a strategy draft owned by the caller, in DRAFT, with no desk, in a fund the caller belongs to (FORBIDDEN otherwise). The fund never changes afterwards.',
  })
  async createStrategyDraft(
    @TypeGraphQL.Arg('fundId', (_type) => String) fundId: string,
    @TypeGraphQL.Arg('kind', (_type) => StrategyKind) kind: StrategyKind,
    @TypeGraphQL.Arg('displayName', (_type) => String) displayName: string,
    @TypeGraphQL.Arg('spec', (_type) => GraphQLScalars.JSONResolver)
    spec: unknown,
    @TypeGraphQL.Ctx() ctx: DraftContext
  ): Promise<StrategyDraftWrite> {
    return run(() =>
      createStrategyDraft(prismaOf(ctx), ctx.principal, {
        fundId,
        kind,
        displayName,
        spec,
      })
    );
  }

  @TypeGraphQL.Mutation((_returns) => StrategyDraftWrite, {
    description:
      "Save the caller's draft at a revision. A changed spec clears the recorded backtest.",
  })
  async saveStrategyDraft(
    @TypeGraphQL.Arg('id', (_type) => String) id: string,
    @TypeGraphQL.Arg('expectedRevision', (_type) => Date)
    expectedRevision: Date,
    @TypeGraphQL.Arg('displayName', (_type) => String) displayName: string,
    @TypeGraphQL.Arg('spec', (_type) => GraphQLScalars.JSONResolver)
    spec: unknown,
    @TypeGraphQL.Ctx() ctx: DraftContext
  ): Promise<StrategyDraftWrite> {
    return run(() =>
      saveStrategyDraft(prismaOf(ctx), ctx.principal, {
        id,
        expectedRevision,
        displayName,
        spec,
      })
    );
  }

  @TypeGraphQL.Mutation((_returns) => StrategyDraftWrite, {
    description: "Soft-delete the caller's draft at a revision.",
  })
  async deleteStrategyDraft(
    @TypeGraphQL.Arg('id', (_type) => String) id: string,
    @TypeGraphQL.Arg('expectedRevision', (_type) => Date)
    expectedRevision: Date,
    @TypeGraphQL.Ctx() ctx: DraftContext
  ): Promise<StrategyDraftWrite> {
    return run(() =>
      deleteStrategyDraft(prismaOf(ctx), ctx.principal, {
        id,
        expectedRevision,
      })
    );
  }

  @TypeGraphQL.Mutation((_returns) => StrategyDraftWrite, {
    description:
      "Record the backtest job run against the caller's draft, bound to the hash of its stored spec.",
  })
  async recordStrategyDraftBacktest(
    @TypeGraphQL.Arg('id', (_type) => String) id: string,
    @TypeGraphQL.Arg('expectedRevision', (_type) => Date)
    expectedRevision: Date,
    @TypeGraphQL.Arg('jobId', (_type) => String) jobId: string,
    @TypeGraphQL.Arg('specHash', (_type) => String) specHash: string,
    @TypeGraphQL.Ctx() ctx: DraftContext
  ): Promise<StrategyDraftWrite> {
    return run(() =>
      recordStrategyDraftBacktest(prismaOf(ctx), ctx.principal, {
        id,
        expectedRevision,
        jobId,
        specHash,
      })
    );
  }
}
