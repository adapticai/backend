# `/graphql` Mutation Authorization Runbook

- **Date:** 2026-09-24
- **Component:** `@adaptic/backend`: `src/middleware/mutation-auth-guard.ts` (`installMutationAuthGuard`, which wraps every root Mutation field of the built schema; reads pay nothing, benchmarked 4.5 vs 4.5 ms per 500x8 query, where a global middleware cost +1.4 ms), `src/auth/mutation-authorization.ts` (pure decision), `src/middleware/trading-policy-audit.ts` (attributed audit rows)
- **Status:** ships in **shadow** (`MUTATION_AUTH_MODE` unset). Nothing is refused on first deploy.
- **Related:** `2026-08-23-graphql-auth-enforcement-runbook.md` (context-level auth, the broader programme), `src/middleware/credential-field-guard.ts` (read side of stored credentials)

---

## 1. The defect

The `/graphql` context admits a request with no bearer token as a null principal, and typegraphql-prisma generates a create/update/upsert/delete mutation for every model. Put those two facts together and any caller that can reach `api.adaptic.ai` can rewrite the system of record. That includes `TradingPolicy.realtimeTradingEnabled`, the switch that arms a LIVE brokerage account. Nothing recorded who made such a write:

- the generic `audit-logger` plugin stores `userId` only for a UUID subject. A service write or an anonymous one is `null`.
- it records nothing for a mutation that failed or was refused.
- it reads the payload from `variables`, so an inline-argument mutation records as empty.
- it copied broker keys into `AuditLog.changedFields` verbatim. The existing table holds such rows. See §7.

## 2. What the guard does

For every **root Mutation field**, including each field of an aliased or multi-field operation, which is decided separately:

| Principal | Admitted |
| --- | --- |
| `server`: the engine's service JWT (`BACKEND_SERVICE_JWT_SECRET`) or `SERVER_AUTH_TOKEN` | every mutation |
| `admin` | every mutation |
| `user` | only where the product has an ownership model (below) |
| none | nothing (`UNAUTHENTICATED`, HTTP 401) |

User write rules (`MODEL_WRITE_RULES`; every model not listed is service-only):

| Rule | Models | Condition |
| --- | --- | --- |
| `account_owned` | `TradingPolicy` (create/update/upsert), `AlpacaAccount` (create/update) | the caller owns every touched account (`AlpacaAccount.userId`), or is entitled to the fund it is bound to (OrgMembership / FundAssignment, the same entitlement the tenancy scoping uses). Bulk (`…Many`) is never user-writable. |
| `self` | `User` (update) | the `where` names the caller's own row |
| `tenant_scoped` | Organization, OrgMembership, Fund, FundAssignment, BrokerageAccount, Notification* | admitted; the row scope comes from the tenancy middleware (`TENANCY_SCOPING_MODE`) |
| `authenticated` | Configuration (upsert), DashboardLayout (upsert), Mandate (create/update), MandateVersion (update), MandateApproval (create), Alert (update), AuditLog (create), Customer (update), InvestorTransaction (update) | any verified user, for the listed actions only |
| `resolver_authorized` | `updateOrgTradingDefaults`, `updateFundTradingOverrides` | the resolver runs its own check |

Nested writes are inspected by input type. A user may create, update or upsert the account, policy or user row nested under an owned root. A user may not `connect`, `set`, `disconnect`, `connectOrCreate` or delete through one: that can re-point a row the user does not own. The single exception is a `connect` of the caller's own `User` row. Every nested `tradingPolicy: {…}` write is also audited.

Refusals carry `extensions.code` (`UNAUTHENTICATED` → 401, `FORBIDDEN` → 403) and a bounded `extensions.reason`. They never echo an argument.

## 3. TradingPolicy audit rows

Every TradingPolicy write, root or nested, whatever the principal and whatever the mode, writes the following to `AuditLog` (`modelName = 'TradingPolicy'`):

1. an **attempt** row **before** the resolver runs: `metadata.actor` (principal kind, subject, email, IP, user agent, origin), `metadata.changeReason` (the caller's `X-Adaptic-Change-Reason` header), `decision` + `authorizationReason` + `effectiveMode`, `tradingSwitchTouched`, and `accounts[]` with each account's type (LIVE/PAPER) and the policy's switch values **before** the write. `changedFields.requested` holds the redacted arguments.
2. a **result** row afterwards (`outcome: succeeded|failed`, `errorCode`, `attemptId`).

A refused write produces the attempt row only (`outcome: denied`). Under **enforce**, if the attempt row cannot be written, the mutation is refused (`AUDIT_UNAVAILABLE`, 503): a LIVE-flag write is never executed unattributed. Under shadow it proceeds and `graphql_mutation_audit_write_failures_total{phase}` counts the loss. A switch write on a LIVE account also logs `[mutation-auth] trading-switch write on a LIVE account` at warn, unthrottled.

The engine's service JWT `sub` (`adaptic-engine:<host>:<pid>`) is now carried on the server principal, so an engine write is attributed to the process that made it.

Query the trail:

```sql
select timestamp, "operationName", metadata->'actor' as actor, metadata->>'changeReason' as reason,
       metadata->>'decision' as decision, metadata->'accounts' as accounts, "changedFields"
from audit_logs
where "modelName" = 'TradingPolicy' and metadata->>'source' = 'mutation-auth-guard'
order by timestamp desc limit 50;
```

## 4. Modes and graduation

| Variable | Values | Default |
| --- | --- | --- |
| `MUTATION_AUTH_MODE` | `shadow` \| `enforce` \| `off` | **unset = `shadow`**. A set-but-unrecognised value = `enforce` (fails closed). |
| `MUTATION_AUTH_ENFORCE_MODELS` | comma-separated Prisma model names | empty. Listed models enforce while the global mode is `shadow`. |

If the guard itself cannot evaluate a mutation (an internal error), the mutation is refused with `MUTATION_AUTH_UNAVAILABLE` (503) whenever anything is enforced: the global mode is `enforce`, any model is escalated, or the escalation list cannot be read. It is admitted only in pure shadow or off, where the guard refuses nothing anyway. The event is counted as `reason="guard_error"`.

Both are read per request. Changing a Railway variable takes effect without a code deploy, though Railway restarts the service to apply a variable change.

Signals:

```
# would-deny callers, per mutation / principal / reason
sum by (mutation, principal_kind, reason) (increase(graphql_mutation_authorization_total{decision="would_deny"}[1h]))
# the guard is live (any decision at all)
sum(increase(graphql_mutation_authorization_total[1h]))
# lost audit rows
increase(graphql_mutation_audit_write_failures_total[1h])
```

Logs: `[mutation-auth] mutation refused by authorization policy`, throttled per (decision, mutation, principal kind, reason, user agent, IP) per 10 min.

**Stage 1: contain the capital-bearing models (target: the first session after deploy).** Deploy with the variables unset. Read one hour of the would-deny series. For `TradingPolicy` and `AlpacaAccount`, every would-deny row must be an actor you intend to cut off: the anonymous script, `curl`, or an operator script that has not yet migrated (§5, #5). Then set `MUTATION_AUTH_ENFORCE_MODELS=TradingPolicy,AlpacaAccount`. The engine is unaffected: its writes present a service principal (§5, #1). Confirm with `graphql_mutation_authorization_total{mutation=~".*TradingPolicy|.*AlpacaAccount",principal_kind="server",decision="allowed"}` rising.

**Stage 2: every model.** Migrate the anonymous callers in §5. Enforce globally (`MUTATION_AUTH_MODE=enforce`) only when `decision="would_deny"` has held at zero for legitimate callers across a full trading week.

**Rollback.** Unset the variable, or set `MUTATION_AUTH_MODE=off`. `off` stops the authorization decision. It keeps the TradingPolicy audit rows.

## 5. Mutation caller inventory

Measured from source on 2026-09-24 by grepping each repo for generated mutation fields and `adaptic.<model>.<write>()` calls. Principal = what the caller presents to `/graphql` today.

| # | Caller | Mutations (models) | Principal today | Under enforce |
| --- | --- | --- | --- | --- |
| 1 | **Engine** `adaptic.*` + `getServerApolloClient` (one `@adaptic/backend` module singleton, provider installed by `initializeBackendServiceAuth()` at boot; the engine refuses to boot without it) | trade (create/update/delete), action (update/upsert), alert (create/update/delete/…Many), tradingPolicy (create/update), policyOverlay, alpacaAccount (create/update), auditLog, configuration, optionsPosition(+Event), signalLineage, strategyHealthSnapshot, riskEscalationEvent, notificationEvent, investor(+Transaction), accountDecisionRecord, tradeAuditEvent.createMany | `server` (service JWT, `sub=adaptic-engine:<host>:<pid>`) | admitted |
| 1b | Engine second client `src/utils/apollo-client.ts` | same | `GRAPHQL_API_KEY` if set, else the service JWT | admitted if `GRAPHQL_API_KEY` is unset or is a server token. **Verify it is not set to a user JWT.** |
| 1c | `@adaptic/lumic-utils` → its **own nested** `@adaptic/utils@0.1.45` → nested `@adaptic/backend-legacy@0.0.1008` (separate module state, no token provider) | alpacaAccount.update, allocation.create/update | **none** | refused if reached. Confirm in the would-deny logs (UA `node`, Railway egress IP) whether any engine path reaches it. The fix is to dedupe the lumic-utils dependency onto the engine's copy. |
| 2 | Platform server routes (`apps/web/app/api/**`, `packages/database/src/queries/*`) via `@adapticai/database` with `setBackendTokenProvider(mintBackendToken)` | fund-provider: upsertOneTradingPolicy, updateOneAlpacaAccount, create/update/deleteOneBrokerageAccount, createOneFund; team: FundAssignment; members: OrgMembership; mandates: Mandate/MandateVersion/MandateApproval; preferences: upsertOneConfiguration; dashboard: upsertOneDashboardLayout; profile: updateOneUser; kyc: updateOneCustomer; capital ledger: updateOneInvestorTransaction; compliance: updateOneAlert; notifications: NotificationEvent/Delivery/Preference, createOneAuditLog; broker-credentials: BrokerageAccount | `user` (HS256 JWT on `JWT_SECRET`, `sub` = User.id, **roles never include `admin`**, 2-min TTL) when a session exists | admitted by the rules in §2. Fund operators writing a fund-bound account's policy pass through fund entitlement. |
| 2b | Platform auth adapter + invitations (`packages/database/src/queries/user.ts`, `app/api/invitations`) | createOneUser, createOne/deleteOne Session, createOne/deleteOne Account (OAuth tokens), VerificationToken (create/deleteMany), deleteOneUser | **none** during sign-in (no session yet); `user` for invitations | **refused**: service-only models. These must present a **service** principal (platform server holding a service credential) before `User`/`Session`/`Account`/`VerificationToken` are enforced. A user must never mint a `VerificationToken`: that is a sign-in-as-anyone primitive. |
| 2c | Platform browser (`'use client'` `lib/data-adapters/mutations.ts`; hooks `use-watchlist`, `use-redemption`, `use-subscription-processing`, `use-trading-settings`) | updateOneCustomer, createOneAuditLog (KYC), updateOneAlert, fund mandate, watchlist (User), redemption/subscription (IR models), org/fund trading settings | **none**. The auth link short-circuits in the browser by design. | **refused**. These must move behind a server route (which presents the user JWT) before their models are enforced. |
| 3 | `app` repo (adaptic.ai / stable.adaptic.ai): `api/waitlist/apply`, `lib/auth/account-linking.ts`, `lib/user.ts` | waitlistEntry.create, account.upsert, accountLinkingRequest (create/update), user (create/update/delete) | **none** unless the host sets a JWT-shaped `SERVER_AUTH_TOKEN` | **refused**. Present a service principal server-side. |
| 4 | Backend-internal crons/jobs | Prisma directly (not `/graphql`) | n/a | unaffected |
| 5 | **Operator scripts** (`~/adapticai/scripts/account-audit/*.mjs`, `scripts/llm/*.mjs`): set-live*, live-go, sync-paper-to-live, dr1-disable-fdb-realtime, write-live-protection, clear-esc, set-exposure/maxpos/rungs/trail, apply-config-changes, apply-model-parity, x-set-escalation-overrides, arm-paper-*, set-paper-autonomy-full, set-adaptic-opus5, update-alpaca-keys, x-config-reconcile, align-account-models, set-alias-routing-mode | tradingPolicy.update / updateOneTradingPolicy (**several write `realtimeTradingEnabled` on LIVE accounts**), alpacaAccount.update (keys), configuration.create/update | **none**: token-less `HttpLink`, and the backend client strips a non-JWT `SERVER_AUTH_TOKEN` | **refused** once TradingPolicy is escalated, which is the point: these anonymous writers are the unattributable LIVE-flag flips. Migrate each to a service credential with an operator subject (for example `sub=operator:<name>`) and an `X-Adaptic-Change-Reason` header, so every operator flip is attributed. |

Principals that are legitimately allowed but deserve tightening, listed so that nobody widens a rule to fix one:
- `Configuration` is `authenticated` (upsert). It also holds system rows that scripts write (LLM alias routing). A user-keyed ownership rule is needed before global enforce stops being the only protection for those rows.
- `BrokerageAccount` is `tenant_scoped`. Its row check needs `TENANCY_SCOPING_MODE=enforce`. In shadow, a verified user can update any brokerage account.
- The platform strips the `admin` role when minting the backend JWT, so a platform operator is a `user` here. Operator-only writes (KYC decision) therefore run under the `authenticated` rule.

## 6. Verification

- `npx vitest run src/auth/__tests__/mutation-authorization.test.ts src/middleware/__tests__/mutation-auth-guard.test.ts`. The guard suite drives the **generated** TradingPolicy / AlpacaAccount / User resolvers through a real ApolloServer with the production HTTP-status plugin (anonymous → 401, cross-account → 403, service → allowed, aliased/nested/steal cases, error bodies without secrets, audit rows, audit-down behaviour).
- After deploy: `graphql_mutation_authorization_total` > 0, and the engine's writes appear as `principal_kind="server",decision="allowed"`. A token-less `curl` `updateOneTradingPolicy` against a **PAPER** fixture account is not needed. The would-deny series from real traffic is the evidence, and no production write is made to prove the hole.

## 7. Related exposure found while building this (not closed here)

`AuditLog.changedFields` already holds broker credentials from earlier mutations. Measured 2026-09-24 as presence classes only: 20 rows with non-empty `AlpacaAccount` `APIKey`/`APISecret` values, the newest from 2026-07-07. `auditLogs` is readable anonymously. This change stops new copies at both writers. The existing rows need a scrub, and `AuditLog` reads need a service/admin rule. Both are owned by the credential-guard workstream.
