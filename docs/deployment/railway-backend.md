# adaptic-backend on Railway

Deployment runbook for `@adaptic/backend` — the Apollo / Prisma /
TypeGraphQL API gateway that is the system of record for Tier B domain data.

> Replaces the former Cloud Run + AlloyDB runbook. That Google Cloud project is
> decommissioned; nothing in it is reachable. Read the old runbook out of git
> history if you need the historical topology, never as current state.

---

## TL;DR

- **Compute:** Railway service `adaptic-backend`, project `adaptic-os`,
  environment `production`.
- **Deploys from:** `main`, automatically on push. `main` has been the
  production branch since the 2026-09-12 cutover.
- **Port:** `8080`, serving both HTTP and the WebSocket upgrade.
- **Database:** managed Postgres in the same project
  (`postgres.railway.internal:5432`).

## Endpoints

| Surface         | Path             | Public hostname                      |
| --------------- | ---------------- | ------------------------------------ |
| Health          | `/health`        | unauthenticated                      |
| GraphQL         | `/graphql`       | `https://api.adaptic.ai/graphql`     |
| GraphQL over WS | `/subscriptions` | `wss://wss.adaptic.ai/subscriptions` |

`stable-api.adaptic.ai` is a kept-alive compatibility alias for the same
service. Prefer `api.adaptic.ai` in anything written from here on.

> **`wss.adaptic.ai` is the BACKEND**, not the engine. It previously resolved to
> the engine; under the current scheme the engine's WebSocket is
> `engine-wss.adaptic.ai`. Treat every `wss.adaptic.ai` reference in older code
> or docs as suspect until you have classified which service it meant.

## Calling this service from another service

Inside the Railway project, address it by **private networking**. Calling the
public `*.up.railway.app` domain from a sibling service hairpins at the edge and
returns 503 without the request ever reaching the service — this caused a live
P0.

```text
http://adaptic-backend.railway.internal:8080/graphql
ws://adaptic-backend.railway.internal:8080/subscriptions
```

Browser-facing values (`NEXT_PUBLIC_*`) must stay on the **public** hostnames: a
browser cannot resolve `.railway.internal`. Getting this backwards breaks either
every service-to-service call or the entire UI, so classify each URL by who
dials it before you change it.

## Deploy

A push to `main` builds and redeploys. The npm publish pipeline
(`.github/workflows/publish.yml`) is independent of the service deploy — a push
can publish the package, redeploy the service, or both.

Schema changes reach consumers through npm, not through the deploy: edit the
Prisma schema, `npm run generate`, update selectionSet strings, publish, then
bump consumers. See the root `CLAUDE.md` dependency-update chain.

## Verify and roll back

```bash
curl -sS https://api.adaptic.ai/health
../scripts/ops-feed.sh status          # deployed revision + service health
```

Roll back by redeploying the previous successful deployment from the Railway
dashboard. Never `npm unpublish` a consumed package version — publish a
follow-up patch instead.
