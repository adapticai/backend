# CORTEX-P0-001 — Enablement Runbook

**Status:** Readiness mechanism landed; enforcement NOT enabled.
**Audience:** on-call / release engineer flipping the CORTEX guards from shadow to
enforce.
**Golden rule:** every step below is validated against real shadow evidence
BEFORE the next one. Nothing in this sequence is time-boxed to "before market
open" — the enforce flips in particular must never be done immediately before a
US equities open.

CORTEX-P0-001 hardens the `@adaptic/backend-legacy` GraphQL surface in three
independent planes, each shadow-first and default-off:

| Plane | Flag | Shadow signal |
| --- | --- | --- |
| Resolver authorization | `CORTEX_AUTHCHECKER_ENFORCE` | `cortex_authchecker_would_deny_total` |
| Rate limiting | `CORTEX_RATE_LIMIT_ENFORCE` | `cortex_rate_limit_would_block_total` |
| Row-level tenancy | `TENANCY_SCOPING_MODE` (`shadow`→`enforce`) | tenancy would-scope counters |

A fourth, orthogonal workstream — **credential excision** — removes the plaintext
`AlpacaAccount.APIKey` / `APISecret` fields from the GraphQL schema. It has a hard
ordering dependency on the server-only credential resolver and the engine
migration, spelled out below.

---

## Why ordering matters

The engine authenticates to Alpaca with credentials it reads **today** as
ordinary GraphQL fields (`AlpacaAccount.APIKey`, `AlpacaAccount.APISecret`). Those
fields are selectable by any authenticated caller — that is the exposure
CORTEX-P0-001 closes. But they cannot simply be hidden: the moment `GQL.SKIP` is
applied and the package regenerated, the engine's credential read returns
`undefined` and **every account stops trading**.

Therefore the safe path is: build a replacement fetch path FIRST, move the engine
onto it, and only THEN remove the old fields. The same logic applies to any
enforce flag: prove in shadow that no legitimate traffic would be denied BEFORE
failing closed.

---

## Ordered enablement sequence

### (a) Run phase-1 shadow in production and watch the counters

Phase-1 (PR #11) is already merged and default-off: the authChecker and rate
limiter observe-and-count but never deny/block; tenancy stays in `shadow`.

1. Deploy `stable-release` with all flags unset (shadow).
2. Watch, over a representative window (at least one full trading day plus an
   off-hours window; longer is better):
   - `cortex_authchecker_would_deny_total` — must show **no** would-denies for
     legitimate engine (`server`-principal) or platform (`user`/`admin`) traffic.
     Any nonzero `server` would-deny is a bug to fix before proceeding.
   - `cortex_rate_limit_would_block_total` — confirm the thresholds do not clip
     legitimate burst traffic (engine reconnect storms, screener fan-out).
   - tenancy would-scope counters — confirm only genuinely cross-tenant reads are
     flagged.
3. Do not advance until the shadow evidence is clean and understood. This is the
   gate for the entire rollout.

### (b) Annotate resolvers / require principals

Add `@Authorized(...)` decorators (and any required-role declarations) to the
resolvers that should be gated. Until this step the authChecker is inert even in
enforce mode, because TypeGraphQL only invokes the checker for `@Authorized()`
fields. Land these annotations while still in shadow and re-observe (a) — the
counters now reflect the real decorated surface.

### (c) Migrate the engine to the server-only credential resolver

This repo now ships the migration target: the **`alpacaAccountCredentials`**
query (`src/resolvers/custom/AlpacaAccountCredentialsResolver.ts`).

- It returns `APIKey` / `APISecret` (and the `type` discriminator) for an account
  **only** to the engine's `server` principal (established by an exact
  `SERVER_AUTH_TOKEN` match in `verifyBackendToken`). Every non-server or
  unauthenticated caller is rejected with a `FORBIDDEN` error before Prisma is
  touched. The gate is enforced in-resolver and fails closed — it does **not**
  depend on `CORTEX_AUTHCHECKER_ENFORCE`.
- Observability: `cortex_alpaca_credential_access_total{outcome}` counts
  `granted` / `denied_non_server` / `not_found`. After the engine migrates,
  `granted` should track the engine's credential reads and `denied_non_server`
  should stay at zero.

Engine-side change (separate PR, in `~/adapticai/engine`): switch the Alpaca
credential read from selecting `AlpacaAccount.APIKey` / `APISecret` to calling
`alpacaAccountCredentials(accountId)`. Deploy the engine, and confirm via the
counter that all credential reads now flow through the new query and that trading
is unaffected. **The old fields still exist at this point** — the engine can be
rolled back safely.

### (d) Excise the credential fields (separate PR)

Only after (c) is deployed and verified in production:

1. Add `GQL.SKIP=true` to `AlpacaAccount.APIKey` and `AlpacaAccount.APISecret` in
   `backend-legacy/prisma/schema.prisma` (do **not** delete the columns — the
   engine still reads them from Postgres via the server-only resolver's Prisma
   `select`; `GQL.SKIP` only removes them from the GraphQL selection set).
2. Regenerate (`npm run generate`), rebuild, update selection-set strings,
   publish the package on the `stable-release` / `0.0.x` lineage.
3. Consume the new version in the engine and confirm the fields are gone from the
   GraphQL surface while trading continues via `alpacaAccountCredentials`.
4. **Rotate the Alpaca API keys** after excision: any key that was ever
   selectable as a plaintext GraphQL field should be treated as potentially
   exposed and rotated. Do this per account, out of market hours.

> OAuth-linked broker tokens on `LinkedProvider` (`accessToken` / `refreshToken`)
> follow the identical server-only-resolver → migrate → excise → rotate pattern
> in their own change set; they are out of scope for the `AlpacaAccount`
> credential resolver.

### (e) Flip the enforce flags — one at a time, off shadow evidence

Only once (a)–(d) are complete and the shadow counters are clean:

1. Flip **one** flag at a time, never together:
   - `CORTEX_AUTHCHECKER_ENFORCE=true`, or
   - `TENANCY_SCOPING_MODE=enforce`, or
   - `CORTEX_RATE_LIMIT_ENFORCE=true`.
2. After each flip, watch error rates and the corresponding would-deny/would-block
   counter (now denials/blocks) for a full window before the next flip.
3. **Never flip an enforce flag right before or during a US equities market
   open.** Choose a low-risk window with on-call present and a tested rollback
   (each flag reverts to shadow by unsetting the env var — no deploy required).

---

## Rollback

Every guard reverts to inert by unsetting its env var (authChecker, rate limiter)
or setting `TENANCY_SCOPING_MODE=shadow`; no code deploy is needed. The credential
resolver is additive and inert until the engine calls it, and the field excision
(d) is a separate PR that can be reverted independently — but note that once keys
are rotated in (d.4), a rollback of the engine must use the rotated keys.

## Invariants (do not violate)

- Credential resolver + engine migration (c) BEFORE field excision (d).
- Shadow validation (a) BEFORE any enforce flip (e).
- One enforce flag at a time; never immediately before market open.
- Rotate Alpaca keys after excision (d.4).
