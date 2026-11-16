/**
 * A signed-in user's strategy drafts: the only user writes to `Strategy`
 * (G-STR-08).
 *
 * The generated `Strategy` mutations stay `service_only` for a user
 * principal: they accept every column, including the operator-governed ones
 * (`desk`, `lifecycleState`, `origin`, `manifestHash`, `key`), and their
 * nested inputs reach `StrategySubscription` and `Trade`. Teaching the
 * generic guard which of those a user may set would make every future
 * column user-writable until someone remembered to forbid it. These four
 * operations instead take only the fields a draft author owns, so an
 * operator-governed column is not expressible in the input at all:
 *
 * - `createStrategyDraft` stamps `ownerUserId` from the principal, `origin`
 *   USER and `lifecycleState` DRAFT, and leaves `desk` null (an operator
 *   assigns the desk, because the desk picks the autonomy matrix).
 * - `saveStrategyDraft`, `deleteStrategyDraft` and `recordStrategyDraftBacktest`
 *   each write in ONE conditional statement whose filter is the author, the
 *   DRAFT state, the undeleted row and the revision (`updatedAt`) the editor
 *   read. A write that matches nothing — another write, a submission or a
 *   delete got there first — changes nothing and answers `STALE`. This is the
 *   compare-and-set the generated `updateMany` gave the platform, run here
 *   under a service-side filter the caller cannot widen.
 * - A save that changes the spec clears the recorded backtest, so a backtest
 *   never attests a spec it was not run against; a recorded backtest carries
 *   the hash of the stored spec (`./strategy-spec-hash.ts`), checked here.
 *
 * Every operation stamps a fresh `updatedAt` strictly later than the revision
 * it matched, so a second writer holding the old revision can never match the
 * new row even within the same millisecond.
 *
 * @module resolvers/custom/strategy-draft-service
 */

import { randomUUID } from 'node:crypto';

import type { Prisma } from '@prisma/client';

import type { BackendPrincipal } from '../../auth/token-verifier';
import { canonicalJson, specHash } from './strategy-spec-hash';

/** The authoring kinds a draft may have (`StrategyKind`). */
export type DraftKind = 'thematic' | 'signal';

/** The lifecycle state every user-written draft is in. */
export const DRAFT_STATE = 'DRAFT';

/** Longest display name (`Strategy.displayName` is VarChar(128)). */
export const MAX_DISPLAY_NAME = 128;

/** Longest backtest job id stored. */
export const MAX_JOB_ID = 128;

/** Largest canonical spec accepted, in UTF-16 code units. */
export const MAX_SPEC_CHARS = 65_536;

/** How a draft write ended. */
export type DraftWriteStatus =
  'WRITTEN' | 'NOT_FOUND' | 'NOT_DRAFT' | 'STALE' | 'SPEC_MISMATCH';

/** The outcome of a draft write. `revision` is set only when the write landed. */
export interface DraftWriteOutcome {
  readonly status: DraftWriteStatus;
  readonly id: string;
  readonly revision: Date | null;
}

/** A refusal the resolver maps onto a GraphQL error. */
export class StrategyDraftRefusal extends Error {
  constructor(
    readonly code: 'UNAUTHENTICATED' | 'FORBIDDEN' | 'BAD_USER_INPUT',
    message: string
  ) {
    super(message);
    this.name = 'StrategyDraftRefusal';
  }
}

/** The row facts a write is decided on. */
interface DraftFacts {
  readonly id: string;
  readonly lifecycleState: string;
  readonly spec: Prisma.JsonValue | null;
  readonly updatedAt: Date;
}

/** The slice of the Prisma client the drafts use. */
export interface StrategyDraftPrisma {
  readonly strategy: {
    findFirst(args: {
      where: Prisma.StrategyWhereInput;
      select: { id: true; lifecycleState: true; spec: true; updatedAt: true };
    }): Promise<DraftFacts | null>;
    create(args: {
      data: Prisma.StrategyUncheckedCreateInput;
      select: { id: true; updatedAt: true };
    }): Promise<{ id: string; updatedAt: Date }>;
    updateMany(args: {
      where: Prisma.StrategyWhereInput;
      data: Prisma.StrategyUncheckedUpdateManyInput;
    }): Promise<{ count: number }>;
  };
}

/** A source of the current time; injectable for tests. */
export type Clock = () => Date;

/**
 * The person a draft write acts for. A draft has a human author, so a
 * service principal (which names no person) is refused, as is no principal.
 *
 * @param principal - The verified caller.
 * @returns The author's user id.
 * @throws {StrategyDraftRefusal} When the caller is not a signed-in person.
 */
export function draftAuthor(
  principal: BackendPrincipal | null | undefined
): string {
  if (!principal)
    throw new StrategyDraftRefusal(
      'UNAUTHENTICATED',
      'Sign in to write a strategy draft.'
    );
  if (principal.kind === 'server') {
    throw new StrategyDraftRefusal(
      'FORBIDDEN',
      'A strategy draft is written by its author, not by a service.'
    );
  }
  return principal.sub;
}

/** The trimmed display name, or a refusal. */
function displayNameOf(raw: string): string {
  const name = raw.trim();
  if (name.length === 0 || name.length > MAX_DISPLAY_NAME) {
    throw new StrategyDraftRefusal(
      'BAD_USER_INPUT',
      `A draft name is 1–${MAX_DISPLAY_NAME} characters.`
    );
  }
  return name;
}

/** The spec as a JSON object of bounded size, or a refusal. */
function specOf(raw: unknown): Prisma.InputJsonObject {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new StrategyDraftRefusal(
      'BAD_USER_INPUT',
      'A draft spec is a JSON object.'
    );
  }
  let text: string;
  try {
    text = canonicalJson(raw);
  } catch (error: unknown) {
    throw new StrategyDraftRefusal(
      'BAD_USER_INPUT',
      error instanceof Error ? error.message : 'A draft spec is not JSON.'
    );
  }
  if (text.length > MAX_SPEC_CHARS) {
    throw new StrategyDraftRefusal(
      'BAD_USER_INPUT',
      `A draft spec is at most ${MAX_SPEC_CHARS} characters.`
    );
  }
  return raw as Prisma.InputJsonObject;
}

/** The filter that finds an author's own undeleted authored strategy. */
function ownWhere(id: string, authorId: string): Prisma.StrategyWhereInput {
  return { id, ownerUserId: authorId, deletedAt: null, kind: { not: null } };
}

/** A stamp strictly later than the revision a write matched. */
function nextStamp(clock: Clock, revision: Date): Date {
  const now = clock();
  return now.getTime() > revision.getTime()
    ? now
    : new Date(revision.getTime() + 1);
}

/**
 * Read the facts a write is decided on, answering the refusal outcome when the
 * row is not the author's draft at the revision.
 */
async function draftAtRevision(
  prisma: StrategyDraftPrisma,
  id: string,
  authorId: string,
  revision: Date
): Promise<
  | { facts: DraftFacts; refusal?: undefined }
  | { facts?: undefined; refusal: DraftWriteOutcome }
> {
  const facts = await prisma.strategy.findFirst({
    where: ownWhere(id, authorId),
    select: { id: true, lifecycleState: true, spec: true, updatedAt: true },
  });
  if (facts === null)
    return { refusal: { status: 'NOT_FOUND', id, revision: null } };
  if (facts.lifecycleState !== DRAFT_STATE)
    return { refusal: { status: 'NOT_DRAFT', id, revision: null } };
  if (facts.updatedAt.getTime() !== revision.getTime())
    return { refusal: { status: 'STALE', id, revision: null } };
  return { facts };
}

/** Write `data` to the row only while it is still the author's draft at `revision`. */
async function writeIfAtRevision(
  prisma: StrategyDraftPrisma,
  input: { id: string; authorId: string; revision: Date; clock: Clock },
  data: Prisma.StrategyUncheckedUpdateManyInput
): Promise<DraftWriteOutcome> {
  const stamp = nextStamp(input.clock, input.revision);
  const result = await prisma.strategy.updateMany({
    where: {
      ...ownWhere(input.id, input.authorId),
      lifecycleState: DRAFT_STATE,
      updatedAt: input.revision,
    },
    data: { ...data, updatedAt: stamp },
  });
  return result.count === 1
    ? { status: 'WRITTEN', id: input.id, revision: stamp }
    : { status: 'STALE', id: input.id, revision: null };
}

/**
 * Create a draft owned by the caller.
 *
 * @param prisma - The client.
 * @param principal - The caller.
 * @param input - The kind, name and spec.
 * @returns `WRITTEN` with the new id and revision.
 */
export async function createStrategyDraft(
  prisma: StrategyDraftPrisma,
  principal: BackendPrincipal | null | undefined,
  input: { kind: DraftKind; displayName: string; spec: unknown }
): Promise<DraftWriteOutcome> {
  const authorId = draftAuthor(principal);
  const displayName = displayNameOf(input.displayName);
  const spec = specOf(input.spec);
  const row = await prisma.strategy.create({
    data: {
      key: `desk-${input.kind}-${randomUUID()}`,
      displayName,
      origin: 'USER',
      lifecycleState: DRAFT_STATE,
      kind: input.kind,
      spec,
      ownerUserId: authorId,
    },
    select: { id: true, updatedAt: true },
  });
  return { status: 'WRITTEN', id: row.id, revision: row.updatedAt };
}

/**
 * Save a draft's name and spec at the revision the editor read. A changed
 * spec clears the recorded backtest.
 *
 * @param prisma - The client.
 * @param principal - The caller.
 * @param input - The draft, its revision, and the new name and spec.
 * @param clock - The time source.
 * @returns The outcome.
 */
export async function saveStrategyDraft(
  prisma: StrategyDraftPrisma,
  principal: BackendPrincipal | null | undefined,
  input: {
    id: string;
    expectedRevision: Date;
    displayName: string;
    spec: unknown;
  },
  clock: Clock = () => new Date()
): Promise<DraftWriteOutcome> {
  const authorId = draftAuthor(principal);
  const displayName = displayNameOf(input.displayName);
  const spec = specOf(input.spec);
  const read = await draftAtRevision(
    prisma,
    input.id,
    authorId,
    input.expectedRevision
  );
  if (read.refusal) return read.refusal;
  const specChanged =
    read.facts.spec === null || specHash(read.facts.spec) !== specHash(spec);
  return writeIfAtRevision(
    prisma,
    { id: input.id, authorId, revision: input.expectedRevision, clock },
    specChanged
      ? { displayName, spec, backtestJobId: null, backtestSpecHash: null }
      : { displayName, spec }
  );
}

/**
 * Soft-delete a draft at the revision the editor read.
 *
 * @param prisma - The client.
 * @param principal - The caller.
 * @param input - The draft and its revision.
 * @param clock - The time source.
 * @returns The outcome.
 */
export async function deleteStrategyDraft(
  prisma: StrategyDraftPrisma,
  principal: BackendPrincipal | null | undefined,
  input: { id: string; expectedRevision: Date },
  clock: Clock = () => new Date()
): Promise<DraftWriteOutcome> {
  const authorId = draftAuthor(principal);
  const read = await draftAtRevision(
    prisma,
    input.id,
    authorId,
    input.expectedRevision
  );
  if (read.refusal) return read.refusal;
  return writeIfAtRevision(
    prisma,
    { id: input.id, authorId, revision: input.expectedRevision, clock },
    { deletedAt: clock() }
  );
}

/**
 * Record the backtest a draft was run against. The hash the caller names must
 * be the hash of the spec stored at that revision (`SPEC_MISMATCH`
 * otherwise), so the record cannot attest any other spec. Whether the job
 * exists and finished is the engine's to say when the draft is submitted.
 *
 * @param prisma - The client.
 * @param principal - The caller.
 * @param input - The draft, its revision, the job and the spec hash it ran on.
 * @param clock - The time source.
 * @returns The outcome.
 */
export async function recordStrategyDraftBacktest(
  prisma: StrategyDraftPrisma,
  principal: BackendPrincipal | null | undefined,
  input: {
    id: string;
    expectedRevision: Date;
    jobId: string;
    specHash: string;
  },
  clock: Clock = () => new Date()
): Promise<DraftWriteOutcome> {
  const authorId = draftAuthor(principal);
  const jobId = input.jobId.trim();
  if (jobId.length === 0 || jobId.length > MAX_JOB_ID) {
    throw new StrategyDraftRefusal(
      'BAD_USER_INPUT',
      `A backtest job id is 1–${MAX_JOB_ID} characters.`
    );
  }
  const read = await draftAtRevision(
    prisma,
    input.id,
    authorId,
    input.expectedRevision
  );
  if (read.refusal) return read.refusal;
  if (
    read.facts.spec === null ||
    specHash(read.facts.spec) !== input.specHash
  ) {
    return { status: 'SPEC_MISMATCH', id: input.id, revision: null };
  }
  return writeIfAtRevision(
    prisma,
    { id: input.id, authorId, revision: input.expectedRevision, clock },
    { backtestJobId: jobId, backtestSpecHash: input.specHash }
  );
}
