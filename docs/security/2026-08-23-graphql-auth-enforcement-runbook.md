# `/graphql` Authentication Enforcement Runbook

- **Date:** 2026-08-23
- **Component:** `@adaptic/backend-legacy` — `src/server.ts` `/graphql` HTTP + WebSocket `context()`
- **Status:** **DEFERRED — DO NOT ENFORCE.** Shadow instrumentation landed; enforcement is gated on the migration below.
- **Owner:** Backend / Platform security
- **Related:** `src/auth/graphql-auth-shadow.ts` (this change), `src/auth/cortex-auth-checker.ts` (resolver-level shadow checker), `src/middleware/rate-limiter.ts` (shadow rate limiting), `src/auth/tenancy-scope.ts` (row-level scoping)

---

## 1. TL;DR

Requiring a verified principal at the `/graphql` context layer today would take down the
entire product. The backend authenticates GraphQL requests **only** from an
`Authorization: Bearer <token>` header, while the live consumers authenticate by
other means (or not at all):

- the **platform** authenticates by **httpOnly session cookie**, which the `/graphql`
  context never reads, and attaches **no** bearer token;
- the **engine**, **utils**, and the **account-audit scripts** reach `/graphql`
  with no verified principal in production.

The current `context()` lets a request with **no token** fall through as
`{ principal: null }` and **allows** it. That null-principal path is the sole thing a
"require a principal" enforcement flip would change — and every consumer above depends on
it. Enforcing now is an outage switch.

This runbook is the staged path from "measured" to "enforced". **The gate is empirical:**
the shadow counter `graphql_auth_context_evaluations_total{outcome="no_principal"}` must be
driven to ~zero for a transport before that transport is enforced.

> The engine's own audit reached the same conclusion (finding **B01-F6**): the
> client-token-gate vs server-verifier contradiction "becomes an engine-wide outage the
> day DR-19 arms it — so it must land BEFORE B-0047's flip."

---

## 2. The architectural gap

`src/server.ts` `/graphql` `context()` (HTTP and WebSocket) is the sole auth gate for
GraphQL. It:

1. reads a token **only** from `req.headers.authorization` (`'Bearer '` prefix) — HTTP —
   or `connectionParams.authorization` — WS;
2. on **no token** → returns `{ user: null, principal: null }` and **allows** the request
   (the would-deny path);
3. on **invalid token** → throws `UNAUTHENTICATED` (HTTP 401 / WS close) — already rejected
   today;
4. on **valid token** → attaches the verified `BackendPrincipal`.

There is **no cookie-reading path**. The platform (cookie auth) and the backend `/graphql`
(Authorization-header auth) speak different auth mechanisms, so even a platform request that
forwarded its session cookie would still land in the null-principal branch.

Two distinct enforcement surfaces exist; do not conflate them:

| Surface            | Mechanism                                                                               | Blast radius                                                                                                        | Flag                                    |
| ------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Resolver-level** | `cortexAuthChecker` denies `@Authorized()` fields for a null/under-privileged principal | ONLY the `@Authorized()` fields today: the 5 investor-relations models (full coverage) + delete mutations elsewhere | `CORTEX_AUTHCHECKER_ENFORCE`            |
| **Context-level**  | reject `principal: null` in `context()`                                                 | **EVERY** unauthenticated caller — entire platform + scripts + engine                                               | _(no flag — code change; this runbook)_ |

This runbook covers the **context-level** surface, which is the dangerous one. The
shadow observer added in this change measures exactly that population.

---

## 3. What shipped in this change (shadow instrumentation, observe-only)

`src/auth/graphql-auth-shadow.ts`, wired into both `context()` callbacks. **No behaviour
change** — nothing is blocked.

### 3.1 Metric (primary signal)

`graphql_auth_context_evaluations_total{transport, outcome}` — Counter on the
backend-legacy Prometheus registry (`GET /metrics`). Increments on **every** context
evaluation.

- `transport ∈ { http, ws }`
- `outcome ∈ { authenticated, no_principal, invalid_token }`

`outcome="no_principal"` is the **would-deny** series — the requests context-level
enforcement would start rejecting. The other two outcomes form the denominator.

Labels are deliberately bounded (6 series). The attacker-controllable identity
(operation name, origin, IP) is **never** a metric label.

Supporting gauge: `graphql_auth_shadow_tracked_keys` (dedup-store cardinality).

### 3.2 Throttled identity log (who)

For each `no_principal` request, a structured `logger.warn` line
`[graphql-auth-shadow] would-deny: unauthenticated /graphql request …` is emitted,
**throttled** to the first occurrence of each `(transport, operationName, origin)` per
10-minute window (fields: `transport`, `operationName`, `origin`, `ip`, `userAgent`,
`authHeaderPresent`). The store is capped at 10 000 keys with an overflow bucket so a
caller rotating spoofed origins/operation names cannot grow memory without bound
(audit B01-backend-legacy-12). Unthrottled per-request logging would flood Cloud Logging
(audit B01-backend-legacy-10) — the counter carries the per-request cardinality instead.

Escape hatch: `GRAPHQL_AUTH_SHADOW_LOG_DISABLED=true` silences the log lines (the counter
is unaffected). Default: logging ON.

### 3.3 How to read it

```
# Cloud Run / GCE: scrape GET /metrics, or query the deploy/ops feed.
# Would-deny rate by transport:
sum by (transport) (rate(graphql_auth_context_evaluations_total{outcome="no_principal"}[5m]))
# Share of traffic that would be denied:
sum(rate(graphql_auth_context_evaluations_total{outcome="no_principal"}[1h]))
  / sum(rate(graphql_auth_context_evaluations_total[1h]))
```

Discover the callers from logs:

```
jsonPayload.message =~ "graphql-auth-shadow"    # group by operationName, origin, ip
```

---

## 4. Unauthenticated callers to fix FIRST (blast-radius inventory)

Every row below reaches `/graphql` with **no verified principal** today and would break
under context-level enforcement. Fix each to present a valid principal (a verified backend
JWT, a Google ID token, or a correctly-shaped `SERVER_AUTH_TOKEN`) **before** enforcing.

| #   | Caller                                    | Where                                                                                                                                                                                           | Current auth                                                                                            | Fix                                                                                                                                                                                   |
| --- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Platform browser Apollo client**        | `platform/packages/database/src/client/apollo-client.ts` (`credentials:'include'`, no `Authorization`, `setTokenProvider` never called) → 29 data-adapters in `apps/web/lib/data-adapters/*.ts` | httpOnly session **cookie** only                                                                        | Attach a per-request bearer (call `setTokenProvider` with the NextAuth session's backend JWT), **or** add a cookie→principal verification path to `context()` (new code — see §7).    |
| 2   | **Platform server-side API routes** (~45) | `apps/web/app/api/**` importing the token-less `@adapticai/database` `apolloClient` (e.g. `broker-credentials/credential-store.ts`)                                                             | none (`credentials:'include'` is a no-op server-side)                                                   | Route server calls through `@adaptic/backend-legacy` `adaptic.*` with a `SERVER_AUTH_TOKEN`, or attach a service JWT.                                                                 |
| 3   | **Engine** `adaptic.*` CRUD path          | `engine/src/apollo-client.ts` — `configureApolloAuth()` is **never called** in prod; `SERVER_AUTH_TOKEN` absent from engine source                                                              | relies on an unset env; the client's JWT-shape gate strips a non-JWT `SERVER_AUTH_TOKEN` before sending | Set a **JWT-shaped** `SERVER_AUTH_TOKEN` in the engine MIG env **and** call `configureApolloAuth()` at boot. Resolve the client-gate vs server-verifier contradiction first (see §5). |
| 4   | **Engine** second local client            | `engine/src/utils/apollo-client.ts` — sends `Bearer ${GRAPHQL_API_KEY}`                                                                                                                         | `GRAPHQL_API_KEY` **is not set in the prod MIG env** (audit 2026-06-02)                                 | Set `GRAPHQL_API_KEY` in the MIG, or converge on the `SERVER_AUTH_TOKEN` path.                                                                                                        |
| 5   | **account-audit scripts** (~90)           | `scripts/account-audit/*.mjs` — token-less `new HttpLink({ uri, fetch })`                                                                                                                       | none — explicitly depend on unauthenticated reads                                                       | Add a shared `Authorization` header from a `SERVER_AUTH_TOKEN`/service JWT in `_idx.mjs`.                                                                                             |
| 6   | **utils**                                 | in-process via the engine's client; standalone runs share the `SERVER_AUTH_TOKEN` fallback + JWT-shape gate                                                                                     | inherits engine posture                                                                                 | Fixed transitively by #3.                                                                                                                                                             |
| 7   | **Platform WS subscriptions**             | `platform/packages/database/src/client/subscription-client.ts` — `connectionParams: () => ({})` ("auth via cookies")                                                                            | none — backend WS reads only `connectionParams.authorization`                                           | Send `connectionParams: { authorization: 'Bearer <jwt>' }`. Enforce the **ws** transport separately (§6).                                                                             |

---

## 5. Prerequisite: resolve the client-gate ⟂ server-verifier contradiction

Before any server-to-server caller can authenticate with `SERVER_AUTH_TOKEN`:

- **Server** (`src/auth/token-verifier.ts`) accepts a principal on an **exact string match**
  to `SERVER_AUTH_TOKEN` (`kind: 'server'`) — an opaque token is fine.
- **Client** (`src/client.ts` `getAuthToken()` → `isValidJwtFormat()`) **refuses to send**
  a token that is not three base64url dot-separated segments — it logs a warning and returns
  `''`, degrading the caller to anonymous.

Net effect: an opaque `SERVER_AUTH_TOKEN` is stripped client-side and never reaches the
verifier. **Pick one** and make both ends agree:

1. **(Recommended)** Issue a **JWT-shaped** service token (sign a long-lived
   `{ sub: 'server', roles: ['server'] }` JWT with the backend `JWT_SECRET`); it passes the
   client gate and verifies as `kind: 'user'`/`admin` server-side. Then #3/#4/#5 can all
   present it.
2. Relax the client JWT-shape gate to allow the configured `SERVER_AUTH_TOKEN` through
   verbatim, keeping the server's exact-match path. (Weaker: opaque tokens on the wire.)

This is finding **B01-F6** and **must land before** the enforcement flip.

---

## 6. Staged rollout

Enforce **per transport**, HTTP and WS independently — their consumer sets differ. Never
flip both at once.

**Phase 0 — Observe (current).** Shadow instrumentation live. Build a dashboard on
`graphql_auth_context_evaluations_total`. Establish the baseline `no_principal` rate and
the caller inventory from the throttled logs. Exit when the caller list is complete and
matches §4 (no surprises).

**Phase 1 — Migrate callers (§4), gated by §5.** Fix callers in dependency order:
backend service token (§5) → engine (#3/#4) → scripts (#5) → platform server routes (#2)
→ platform browser + WS (#1/#7). After each fix, watch its `operationName`/`origin`
disappear from the `no_principal` series. **Do not proceed while any known-legitimate
caller still shows up.**

**Phase 2 — Enforce HTTP.** When `graphql_auth_context_evaluations_total{transport="http",
outcome="no_principal"}` has held at ~zero (only illegitimate/probe traffic) across a full
trading week, change the HTTP `context()` `if (!token)` branch to throw `UNAUTHENTICATED`
instead of returning a null-principal context — mirroring the existing invalid-token throw
(`extensions.http.status: 401` is mandatory; see the inline `context()` comment for why).
Prefer landing this behind an env flag (e.g. `GRAPHQL_REQUIRE_PRINCIPAL_HTTP`) read fresh
per request, matching `CORTEX_AUTHCHECKER_ENFORCE`, so it can be reverted without a deploy.

**Phase 3 — Enforce WS.** Same, for the WS `context()` no-token branch, once
`transport="ws"` `no_principal` is ~zero. Throwing there closes the connection.

**Phase 4 — Resolver-level (optional, separate).** Independently, once §5 holds, graduate
`CORTEX_AUTHCHECKER_ENFORCE` per its own runbook (only affects `@Authorized()` fields).

---

## 7. Alternative: cookie→principal path (if the browser client cannot attach a bearer)

If migrating the platform browser client (#1) to attach a bearer proves impractical, add a
**cookie verification path** to `context()` **before** Phase 2: read the NextAuth session
cookie, verify the session JWT with the shared `JWT_SECRET`, and materialise a
`BackendPrincipal`. This must land and show up as `authenticated` (not `no_principal`) for
platform traffic before HTTP enforcement, or Phase 2 will still break the browser app. CORS
already sends credentials (`credentials: true`), so the cookie is present on cross-origin
requests from the allowed origins.

---

## 8. Verification

Per phase:

- **Phase 0/1:** `sum by (transport,outcome) (rate(graphql_auth_context_evaluations_total[1h]))`
  trends; the `no_principal` series shrinks as callers are fixed; no legitimate
  `operationName`/`origin` remains in the shadow logs.
- **Phase 2 (HTTP):** in a canary, set the flag and confirm (a) authenticated traffic is
  unaffected, (b) a token-less `curl` `POST /graphql` now returns 401 with
  `extensions.code = "UNAUTHENTICATED"`, (c) `/readyz` still healthy, (d) platform smoke
  (`os.adaptic.ai` dashboards render), engine `adaptic.*` calls succeed, and account-audit
  `curve.mjs` still runs. Watch `graphql_errors_total{error_code="UNAUTHENTICATED"}` for a
  spike (= a missed caller) → **roll back immediately** (unset the flag).
- **Phase 3 (WS):** confirm platform subscriptions still connect and receive frames; watch
  WS close rates.

**Rollback:** unset the phase flag (or revert the `context()` branch). Because enforcement
is env-gated and read fresh per request, rollback is immediate and requires no redeploy.

---

## 9. Deploy mechanism note

A push to `stable-release` triggers the `adaptic-backend-stable-branch` **Cloud Build**
trigger (repo `backend-legacy`, `cloudbuild.yaml`, no path filter) → builds the image →
runs `prisma migrate deploy` → `gcloud run deploy` to **Google Cloud Run** service
`adaptic-backend` (project `adaptic-438004`, `us-east4`), which serves
`stable-api.adaptic.ai`. This is a **live production redeploy**, independent of the npm
`publish.yml` pipeline. The shadow instrumentation in this change is dormant until such a
deploy ships it; enabling/rolling back an eventual enforcement flag is an env-var change on
the Cloud Run service, not a code deploy.

> `backend-legacy/CLAUDE.md` still says "Hosted on Railway" — that is **stale**; the live
> GraphQL service is Google Cloud Run.
