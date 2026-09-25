# `/graphql` Mutation Authorization Runbook

- **Date:** 2026-09-24
- **Component:** `@adaptic/backend`: `src/middleware/mutation-auth-guard.ts` (`installMutationAuthGuard`, which wraps every root Mutation field of the built schema; reads pay nothing, benchmarked 4.5 vs 4.5 ms per 500x8 query, where a global middleware cost +1.4 ms), `src/auth/mutation-authorization.ts` (pure decision), `src/auth/nested-write-policy.ts` (per-hop nested-write rules), `src/auth/user-write-content.ts` (User / AuditLog / Configuration content rules), `src/middleware/mutation-tenant-facts.ts` (the guard's own tenancy check), `src/middleware/trading-policy-audit.ts` (attributed audit rows)
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
| `self` | `User` (update) | the `where` names the caller's own row, and the payload sets only `name`, `image`, `avatarUrl`, `bio`, `jobTitle`, `onboardingComplete`, `signupCategory` (never `role`, `email`, `id`, `customerId`, `plan`, `openaiAPIKey` or any relation): `field_not_user_writable` |
| `tenant_scoped` | Organization, OrgMembership, Fund, FundAssignment, BrokerageAccount, Notification* | the guard checks the scope ITSELF, at its own mode, whatever `TENANCY_SCOPING_MODE` says: a create's tenant (`fund` / `organization` connect) must be one the caller is entitled to; an update / delete / upsert must address a row inside the caller's scope (`tenant_out_of_scope`). Fund entitlement is read from these rows, so a scope that only observed would let a caller mint the access the account rule then checks. |
| `authenticated` | Configuration (upsert), DashboardLayout (upsert), Mandate (create/update), MandateVersion (update), MandateApproval (create), Alert (update), AuditLog (create), Customer (update), InvestorTransaction (update) | any verified user, for the listed actions only. `AuditLog`: refused when `metadata.source` is `mutation-auth-guard` (`reserved_audit_source`) or `userId` names someone else (`audit_actor_mismatch`). `Configuration`: only `where: { configKey: "platform.web.<surface>.user.<own id>" }`, never renamed (`config_key_not_user_scoped`), so a user cannot write system rows such as LLM alias routing. |
| `resolver_authorized` | `updateOrgTradingDefaults`, `updateFundTradingOverrides` | the resolver runs its own check |

**Nested writes** are inspected by input type, and each nested container is decided on its OWN hop: against the model that holds the relation, the relation, whether that parent row is being created or updated, and its depth. The root's authorization is never inherited past the first hop, because a walk that has crossed into another model's rows no longer carries the root's ownership proof (`updateOneUser(self) → managedFunds → operator.update` edits another person's row; `updateOneAlpacaAccount(own) → brokerageAccount → fund → …` reaches every account the fund bridges). The rules (`src/auth/nested-write-policy.ts`), an allowlist:

- **Entitlement rows are never written nested**: any operation on `OrgMembership`, `FundAssignment`, `Fund.manager`, `Fund.operator`, `User.managedFunds`, `User.operatedFunds` is `nested_entitlement_write`.
- **`connect` may only move the parent row, never the connected one** (foreign key on the parent, from the Prisma data model): into an `authenticated` model; into a tenant-scoped model only while the parent is being CREATED (the root's tenant check reads that connect; re-tenanting an existing row is refused); the caller's own `User` row only onto a row being created; `AlpacaAccount` only as a new policy's account on a root TradingPolicy create/upsert (the ownership check reads that id).
- **Owned content** (account, policy) is written nested only at depth 1 on the root's own counterpart: `AlpacaAccount.tradingPolicy` (create/update/upsert), `TradingPolicy.alpacaAccount` (update), `BrokerageAccount.engineAccount` (create/update/upsert).
- **New user-authored rows** (`create` into an `authenticated` model) are admitted.
- `set`, `disconnect`, `delete`, `deleteMany`, `updateMany`, `connectOrCreate`, `createMany` are never admitted nested; nor is any content write into a tenant-scoped, self, or service-only model.

Every nested `tradingPolicy: {…}` write is audited (§3).

Refusals carry `extensions.code` (`UNAUTHENTICATED` → 401, `FORBIDDEN` → 403) and a bounded `extensions.reason`. They never echo an argument.

## 3. TradingPolicy audit rows

Every TradingPolicy write, root or nested, whatever the principal and whatever the mode, writes the following to `AuditLog` (`modelName = 'TradingPolicy'`):

1. an **attempt** row **before** the resolver runs: `metadata.actor` (principal kind, subject, email, IP, user agent, origin), `metadata.changeReason` (the caller's `X-Adaptic-Change-Reason` header), `decision` + `authorizationReason` + `effectiveMode`, `tradingSwitchTouched`, and `accounts[]` with each account's type (LIVE/PAPER) and the policy's switch values **before** the write. `changedFields.requested` holds the redacted arguments and `changedFields.nestedPaths` the argument path of every nested policy write.

   Each `accounts[]` entry is resolved from its OWN argument path, never from the root: `resolution: "resolved"` when the policy's parent AlpacaAccount is named by a unique selector (the root `where`, or a to-many `update`/`upsert` entry's `where`), `"new_account"` when that account is created in the same mutation, `"unresolved"` otherwise (a to-one hop through another model). An unresolved entry carries `alpacaAccountId: null` and the row's `recordId` is `unresolved`; it is never attributed to the root's account.
2. a **result** row afterwards (`outcome: succeeded|failed`, `errorCode`, `attemptId`).

A refused write produces the attempt row only (`outcome: denied`). Under **enforce**, if the attempt row cannot be written, the mutation is refused (`AUDIT_UNAVAILABLE`, 503): a LIVE-flag write is never executed unattributed. The one exception is a **disarm-only** root `updateOneTradingPolicy` (every switch it sets moves to its safe value: `realtimeTradingEnabled=false`, `killSwitchEnabled=true`, `paperTradingOnly=true`, `autonomyMode` ADVISORY_ONLY / EMERGENCY_SAFE_MODE; nothing else but `lastModifiedBy` / `lastModifiedAt` / `version` / its own `id`). Refusing that would block protection exactly when the system is degraded, so it is admitted, counted on `graphql_mutation_audit_bypassed_total{reason="disarm_during_audit_outage"}`, and the full redacted entry is logged at error (`AuditLog unavailable; admitting a disarm-only trading-policy write unaudited`) as the fallback record. Under shadow any write proceeds and `graphql_mutation_audit_write_failures_total{phase}` counts the loss. A switch write on a LIVE account, or on an account the guard could not identify, logs `[mutation-auth] trading-switch write on a LIVE or unidentified account` at warn, unthrottled.

**Where the actor comes from.** HTTP: `req.ip` (trust-proxy resolved), `User-Agent`, `Origin`, `X-Adaptic-Change-Reason`; the header is in the CORS `allowedHeaders`, so a browser caller can send it. WebSocket (`/subscriptions`, which also carries mutations): IP is the socket's remote address, user agent and origin come from the upgrade request, and the change reason from the upgrade request's header or `connectionParams["x-adaptic-change-reason"]` (a browser cannot set headers on an upgrade). The WS reason is per connection, not per operation.

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

Two rules keep an escalation from being bypassed:

- a mutation is decided at the **strictest mode among every model it writes**, root and nested. `updateOneUser → alpacaAccounts → tradingPolicy` is enforced when `TradingPolicy` is, whatever `User`'s mode.
- escalating an **account model** (`TradingPolicy` or `AlpacaAccount`) also escalates the **entitlement-source models** `OrgMembership`, `FundAssignment`, `Fund`, `BrokerageAccount`. The account rule admits a caller on fund entitlement read from those rows; leaving them in shadow would let a user write themselves into a fund and then pass the account check as fund-entitled.

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

**Stage 1: contain the capital-bearing models (target: the first session after deploy).** Deploy with the variables unset. Read one hour of the would-deny series for `TradingPolicy`, `AlpacaAccount` **and the four entitlement-source models** (they escalate together). Every would-deny row must be an actor you intend to cut off: the anonymous script, `curl`, an operator script that has not yet migrated (§5, #5), or one of the platform flows §5a lists. Then set `MUTATION_AUTH_ENFORCE_MODELS=TradingPolicy,AlpacaAccount`. The engine is unaffected: its writes present a service principal (§5, #1). Confirm with `graphql_mutation_authorization_total{mutation=~".*TradingPolicy|.*AlpacaAccount",principal_kind="server",decision="allowed"}` rising.

```
# Stage-1 blast radius, entitlement models included
sum by (mutation, principal_kind, reason) (increase(graphql_mutation_authorization_total{decision="would_deny",mutation=~".*(TradingPolicy|AlpacaAccount|OrgMembership|FundAssignment|Fund|BrokerageAccount)"}[1h]))
# disarm writes admitted during an AuditLog outage
increase(graphql_mutation_audit_bypassed_total[1h])
```

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

### 5a. Platform flows the user rules refuse (migrate before the listed stage)

Measured from the platform source (`apps/web/app/api/**`, `lib/notifications/**`) on 2026-09-25 against the rules in §2. Each GRANTS entitlement or writes another person's row, which is exactly what a user principal must not be able to do for itself; each needs the platform server to present a **service** principal after its own app-side RBAC check (or a `resolver_authorized` custom mutation that verifies the invite or role).

| Flow | Mutation | Refused because | Stage |
| --- | --- | --- | --- |
| Team: add a member to a fund (`funds/[fundId]/team`) | `createOneFundAssignment(user: connect <other user>)` | nested `User` connect is not the caller | Stage 1 (FundAssignment escalates with the account models) |
| Join an org / accept an invite (`org/[orgId]/join`, `invitations/accept`) | `createOneOrgMembership` in an org the caller is not yet in | `tenant_out_of_scope` | Stage 1 |
| Org onboarding owner membership (`org` POST) | `createOneOrgMembership` in the org just created | `tenant_out_of_scope` (the caller is not yet a member) | Stage 1 |
| Fund creation (`funds` POST) | `createOneFund(operator: connect self, fundAssignments: create […])` | `nested_entitlement_write` | Stage 1 |
| Notification dispatch (`lib/notifications/dispatcher`, via `@adapticai/database`'s `apolloClient`, so a user principal inside a request) | `createOneNotificationDelivery(recipient: connect <other user>)` | nested `User` connect is not the caller | Stage 2 |
| Mandate create with rules (`org/[orgId]/mandates`) | nested `rules: { create }` (MandateRule is service-only) | `nested_write_not_user_writable` | Stage 2 |

Admitted and exercised in the guard harness as controls: broker-credentials create and key rotation (`createOneBrokerageAccount` / `updateOneBrokerageAccount` with `engineAccount: { create | upsert }` and `user: connect self`), suspend-trading (`upsertOneTradingPolicy(create: { alpacaAccount: connect })`), fund-provider policy writes, profile, preferences, dashboard, own audit rows.

Principals that are legitimately allowed but deserve tightening, listed so that nobody widens a rule to fix one:
- Tenant scope is tenant-level, not role-level: a member of an org can change any membership's `role` in that org, including their own. Platform RBAC gates this for its own routes; a backend role rule is a follow-up.
- `Mandate`, `MandateVersion`, `Alert`, `Customer`, `InvestorTransaction` are `authenticated`: any verified user can update any row of them. Each needs an ownership rule before global enforce is the only protection.
- The platform strips the `admin` role when minting the backend JWT, so a platform operator is a `user` here. Operator-only writes (KYC decision) therefore run under the `authenticated` rule.

## 6. Verification

- `npx vitest run src/auth/__tests__/mutation-authorization.test.ts src/middleware/__tests__/mutation-auth-guard.test.ts src/middleware/__tests__/mutation-tenant-facts.test.ts`. The guard suite drives the **generated** TradingPolicy / AlpacaAccount / User / Organization / OrgMembership / Fund / FundAssignment / BrokerageAccount / AuditLog / Configuration resolvers through a real ApolloServer with the production HTTP-status plugin (anonymous → 401, cross-account → 403, service → allowed, aliased/nested/steal cases, entitlement minting, multi-hop walks, per-path policy attribution, content rules, error bodies without secrets, audit rows, audit-down and disarm-bypass behaviour), each refusal paired with an admitted control.
- After deploy: `graphql_mutation_authorization_total` > 0, and the engine's writes appear as `principal_kind="server",decision="allowed"`. A token-less `curl` `updateOneTradingPolicy` against a **PAPER** fixture account is not needed. The would-deny series from real traffic is the evidence, and no production write is made to prove the hole.

## 7. Related exposure found while building this (not closed here)

`AuditLog.changedFields` already holds broker credentials from earlier mutations. Measured 2026-09-24 as presence classes only: 20 rows with non-empty `AlpacaAccount` `APIKey`/`APISecret` values, the newest from 2026-07-07. `auditLogs` is readable anonymously. This change stops new copies at both writers. The existing rows need a scrub, and `AuditLog` reads need a service/admin rule. Both are owned by the credential-guard workstream.
