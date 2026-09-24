/**
 * Which nested relation writes a `user` principal may make. Pure; no I/O.
 *
 * ## Why each hop is judged on its own
 *
 * A root mutation's authorization proves one thing: the caller may write THAT
 * row (they own the account, it is their user row, it sits in a tenant they
 * are entitled to). A nested write walks from that row along a relation into
 * another model's rows, and from there into another's. Nothing about the
 * root's proof survives the first hop into rows the caller does not own:
 * `updateOneUser(self) → managedFunds → operator.update` edits a different
 * person's user row, and `updateOneAlpacaAccount(own) → brokerageAccount →
 * fund → …` reaches every account the fund is bridged to.
 *
 * So each nested container is decided against the model that HOLDS the
 * relation (its parent), the relation itself, whether the parent row is being
 * created or updated, and its depth — never against the root. The rule is an
 * allowlist; everything not named here is refused:
 *
 * - **Entitlement rows are never written nested.** `OrgMembership`,
 *   `FundAssignment` and a fund's `manager` / `operator` relations are what
 *   fund entitlement is read from (`resolveEntitlement`), and fund
 *   entitlement authorises writes to every account bridged to the fund. A
 *   nested write to them has no scope check of its own, so it would let a
 *   caller mint the entitlement it is then checked against.
 * - **`connect` may only move the parent row, never the connected one.** When
 *   the foreign key sits on the parent (`FundAssignment.fund`), a `connect`
 *   writes only the parent; when it sits on the connected row
 *   (`Organization.funds`, `User.alpacaAccounts`), the connected row — someone
 *   else's — is re-pointed. Only the first kind is admitted, and then only:
 *   - into a user-authored (`authenticated`) model;
 *   - into a tenant-scoped model while the parent row is being CREATED (the
 *     root's tenant check reads exactly that connect); re-tenanting an
 *     existing row is refused;
 *   - into the caller's own `User` row while the parent is being created;
 *   - into `AlpacaAccount` only as the policy's own account on a root
 *     TradingPolicy create, whose ownership check reads that connect.
 * - **Content writes into an owned model** (account, policy, user row) are
 *   admitted only on the three edges whose target row is the ROOT row's own
 *   counterpart, and only at depth 1: an account's own policy, a policy's own
 *   account, and a brokerage binding's own engine account. The root decision
 *   has already authorised that exact account.
 * - **New user-authored rows** (`create` into an `authenticated` model) may be
 *   attached anywhere the walk is otherwise admitted.
 * - `set`, `disconnect`, `delete`, `deleteMany`, `updateMany`,
 *   `connectOrCreate` and `createMany` are never admitted nested.
 *
 * @module auth/nested-write-policy
 */

import { ruleFor, type MutationAuthReason } from './mutation-authorization';
import type { NestedWrite } from './nested-write-inspector';

/** Where a relation's foreign key lives, as the Prisma data model states it. */
export interface RelationFacts {
  /**
   * Whether `model.relation` holds the foreign key (Prisma
   * `relationFromFields` is non-empty on that side). `undefined` for a
   * relation the facts do not know, which every rule treats as "not on the
   * parent" — the refusing answer.
   */
  fkOnParent(model: string, relation: string): boolean | undefined;
}

/** The models fund entitlement is read from. */
export const ENTITLEMENT_MODELS: ReadonlySet<string> = new Set(['OrgMembership', 'FundAssignment']);

/** The relations that name a fund's manager or operator, from either side. */
export const ENTITLEMENT_RELATIONS: ReadonlySet<string> = new Set([
  'Fund.manager',
  'Fund.operator',
  'User.managedFunds',
  'User.operatedFunds',
]);

/**
 * `Parent.relation` edges on which a user may write an owned model's content,
 * with the operations allowed. Each edge reaches the root row's own
 * counterpart, which the root decision has already authorised.
 */
const OWNED_CONTENT_EDGES: ReadonlyMap<string, ReadonlySet<string>> = new Map([
  ['AlpacaAccount.tradingPolicy', new Set(['create', 'update', 'upsert'])],
  ['TradingPolicy.alpacaAccount', new Set(['update'])],
  ['BrokerageAccount.engineAccount', new Set(['create', 'update', 'upsert'])],
]);

/** Why a nested write was refused (a bounded metric label). */
export type NestedWriteRefusal = Extract<
  MutationAuthReason,
  'nested_write_not_user_writable' | 'nested_entitlement_write'
>;

function connectAllowed(write: NestedWrite, callerId: string, relations: RelationFacts): boolean {
  if (relations.fkOnParent(write.parentModel, write.relation) !== true) return false;
  const policy = ruleFor(write.model).policy;
  switch (policy) {
    case 'self':
      return (
        write.parentMode === 'create' &&
        write.connectIds !== null &&
        write.connectIds.length > 0 &&
        write.connectIds.every((id) => id === callerId)
      );
    case 'authenticated':
      return true;
    case 'tenant_scoped':
      return write.parentMode === 'create';
    case 'account_owned':
      return (
        write.depth === 1 &&
        write.parentMode === 'create' &&
        `${write.parentModel}.${write.relation}` === 'TradingPolicy.alpacaAccount'
      );
    default:
      return false;
  }
}

function contentWriteAllowed(write: NestedWrite, operation: string): boolean {
  const policy = ruleFor(write.model).policy;
  if (operation === 'create' && policy === 'authenticated') return true;
  if (policy !== 'account_owned' || write.depth !== 1) return false;
  return OWNED_CONTENT_EDGES.get(`${write.parentModel}.${write.relation}`)?.has(operation) === true;
}

/**
 * Whether a user principal may make one nested write.
 *
 * @param write - The nested container, with its parent context.
 * @param callerId - The user principal's subject (`User.id`).
 * @param relations - Foreign-key placement per relation.
 * @returns `null` when the write is admitted, otherwise the refusal reason.
 */
export function nestedWriteRefusalForUser(
  write: NestedWrite,
  callerId: string,
  relations: RelationFacts
): NestedWriteRefusal | null {
  if (
    ENTITLEMENT_MODELS.has(write.model) ||
    ENTITLEMENT_RELATIONS.has(`${write.parentModel}.${write.relation}`)
  ) {
    return 'nested_entitlement_write';
  }
  for (const operation of write.operations) {
    const allowed =
      operation === 'connect'
        ? connectAllowed(write, callerId, relations)
        : operation === 'create' || operation === 'update' || operation === 'upsert'
          ? contentWriteAllowed(write, operation)
          : false;
    if (!allowed) return 'nested_write_not_user_writable';
  }
  return null;
}

/**
 * Whether a nested container writes rows of its OWN model. A container whose
 * only operation is `connect` over a relation whose foreign key sits on the
 * parent writes only the parent row (it sets the parent's key); anything else
 * — a create, an update, a connect that re-points the connected row, a
 * disconnect — writes the nested model. The guard decides a mutation at the
 * strictest mode among the models it writes, so this is what decides whether
 * an escalated nested model governs the mutation.
 *
 * @param write - The nested container.
 * @param relations - Foreign-key placement per relation.
 */
export function writesNestedModelRows(write: NestedWrite, relations: RelationFacts): boolean {
  const onlyConnect = write.operations.length > 0 && write.operations.every((op) => op === 'connect');
  return !(onlyConnect && relations.fkOnParent(write.parentModel, write.relation) === true);
}

/**
 * The first refusal among a mutation's nested writes, entitlement refusals
 * first (they are the more specific signal), or `null` when all are admitted.
 */
export function firstNestedRefusal(
  writes: readonly NestedWrite[],
  callerId: string,
  relations: RelationFacts
): NestedWriteRefusal | null {
  let refusal: NestedWriteRefusal | null = null;
  for (const write of writes) {
    const reason = nestedWriteRefusalForUser(write, callerId, relations);
    if (reason === 'nested_entitlement_write') return reason;
    refusal ??= reason;
  }
  return refusal;
}
