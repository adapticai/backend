# adaptic-backend on Google Cloud Run

Deployment guide for running `@adaptic/backend-legacy` (the Apollo / Prisma /
TypeGraphQL API gateway) on Google Cloud Run, fronting AlloyDB over Private
Service Connect.

This document is the runbook. Architecture, command reference, cutover plan,
rollback, and troubleshooting all live here.

---

## TL;DR

- **Compute:** Cloud Run service `adaptic-backend` in `us-east4`
  (8 vCPU / 16 GiB / min=3 / max=100 / concurrency=250).
- **Database:** AlloyDB cluster `adaptic-backend`, instance `primary`,
  POSTGRES_17 in `us-east4`. Managed connection pooling enabled
  (transaction mode, max_client_conn=8000, default_pool_size=120).
- **Networking:** `adaptic-vpc` + `adaptic-us-east4` subnet
  (`10.20.0.0/24`). Cloud Run uses Direct VPC egress to reach the
  AlloyDB PSC consumer endpoint (`10.20.0.100`) without a VPC connector.
- **Identity:** runtime service account `adaptic-run-runtime`, CI service
  account `adaptic-cloud-build`. Both are project-scoped IAM-only;
  no static keys.
- **Secrets:** stored in Secret Manager, mounted into Cloud Run at deploy.
- **CI/CD:** Cloud Build pipeline (`cloudbuild.yaml`) runs prisma
  migrations as a Cloud Run Job before promoting traffic.
- **Public hostname:** `stable-api.adaptic.ai` — DNS-flip cutover from Railway.

## Architecture

```
                      ┌────────────────────────┐
                      │ stable-api.adaptic.ai (Cloud  │
                      │   DNS A → Cloud Run    │
                      └───────────┬────────────┘
                                  │  HTTPS / WSS
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│             Cloud Run service: adaptic-backend              │
│             us-east4, gen2, min=3, max=100                   │
│   - Multi-stage Dockerfile (node:22-bookworm-slim → slim)   │
│   - CMD ["node", "dist/server.js"] (no boot-time migrations)│
│   - /livez (no DB), /readyz (DB), /health (legacy)          │
│   - Apollo Server 5 + Express 4 + graphql-ws subscriptions  │
└─────────────────────┬───────────────────────────────────────┘
                      │ Direct VPC egress
                      │ Subnet adaptic-us-east4 (10.20.0.0/24)
                      ▼
            ┌─────────────────────┐
            │ PSC forwarding rule │
            │   10.20.0.100       │
            └──────────┬──────────┘
                       │ Private Service Connect
                       ▼
        ┌────────────────────────────────┐
        │  AlloyDB primary (us-east4-b)  │
        │  Managed pool :6432 (PgBouncer)│
        │  Direct backend :5432          │
        └────────────────────────────────┘
```

## Resources

| Resource | Name | Notes |
| --- | --- | --- |
| GCP project | `adaptic-438004` | project number 724263936416 |
| VPC | `adaptic-vpc` | custom mode, regional BGP |
| Subnet | `adaptic-us-east4` | 10.20.0.0/24, private Google access ON |
| Firewall | `allow-internal-postgres`, `allow-internal-egress` | tcp:5432 / tcp:6432 / all internal |
| PSC IP | `alloydb-psc-endpoint` | reserved 10.20.0.100 |
| Forwarding rule | `alloydb-psc-fr` | targets AlloyDB service attachment |
| Private DNS zone | `alloydb-psc` | maps `*.alloydb-psc.goog` → PSC IP |
| Artifact Registry | `adaptic-images` | us-east4, Docker format |
| Cloud Run service | `adaptic-backend` | gen2, ingress=internal-and-cloud-load-balancing |
| Cloud Run job | `adaptic-backend-migrate` | runs `npm run migrate` |
| Runtime SA | `adaptic-run-runtime@adaptic-438004.iam.gserviceaccount.com` | alloydb.client + databaseUser + secretAccessor |
| CI SA | `adaptic-cloud-build@adaptic-438004.iam.gserviceaccount.com` | run.admin + artifactregistry.writer |
| AlloyDB cluster | `adaptic-backend` | POSTGRES_17, PSC, continuous PITR |
| AlloyDB instance | `primary` | c4-highmem-16-lssd, ZONAL (REGIONAL recommended) |
| LB anchor IP | `adaptic-backend-lb-ip` | global, static, **8.233.34.153** |
| Backend service | `adaptic-backend-bes` | HTTPS, EXTERNAL_MANAGED, attaches serverless NEG |
| Serverless NEG | `adaptic-backend-neg` | us-east4, points at adaptic-backend Cloud Run |
| URL map (HTTPS) | `adaptic-backend-urlmap` | default service = backend service |
| URL map (HTTP) | `adaptic-backend-http-redirect` | 301 redirect to HTTPS |
| Target HTTPS proxy | `adaptic-backend-https-proxy` | uses managed SSL cert |
| Target HTTP proxy | `adaptic-backend-http-proxy` | uses HTTP redirect URL map |
| Forwarding rule | `adaptic-backend-https-fr` | global, port 443 → HTTPS proxy |
| Forwarding rule | `adaptic-backend-http-fr` | global, port 80 → HTTP redirect proxy |
| Managed SSL cert | `adaptic-backend-cert` | stable-api.adaptic.ai, provisions after DNS cutover |
| Cloud Armor policy | `adaptic-backend-armor` | SQLi/XSS WAF + PHP/scanner blocks + /graphql rate limit |
| Cloud Build SA + bucket | `adaptic-cloud-build`, `gs://adaptic-cloudbuild` | CI identity + source/log storage |

## Secrets (Secret Manager)

All real credentials live in Secret Manager and are mounted into Cloud Run /
the migration Job via `--set-secrets`. Non-secret config (CORS origins,
self-reference URLs) lives in `env-vars.yaml` generated at deploy time.

| Secret | Purpose | Rotation |
| --- | --- | --- |
| `DATABASE_URL` | Pooled AlloyDB endpoint :6432 + `pgbouncer=true` | When DB user password changes |
| `DIRECT_DATABASE_URL` | Direct AlloyDB endpoint :5432 (migrations only) | When DB user password changes |
| `DATABASE_URL_PRISMA_IO` | Prisma Accelerate fallback URL | When Accelerate API key rotates |
| `PULSE_API_KEY` | Prisma Pulse real-time events | When Pulse JWT rotates |
| `JWT_SECRET` | NextAuth/backend JWT signing | Quarterly; logs everyone out |
| `JWT_SALT` | NextAuth token salt | Quarterly; logs everyone out |
| `GOOGLE_OAUTH_CLIENT_IDS` | Google ID-token `aud` allowlist | When client IDs change |

Update a secret: `gcloud secrets versions add <name> --data-file=-`
(then redeploy or wait for the next revision to pull `:latest`).

## CI/CD

The repo's `cloudbuild.yaml` runs the full deploy pipeline:

1. **build** — Multi-stage Docker build of `adaptic-backend:${SHORT_SHA}` and
   `:latest`.
2. **push** — Push both tags to Artifact Registry.
3. **migrate-job-upsert** — Create (or update) the `adaptic-backend-migrate`
   Cloud Run Job with the new image.
4. **migrate-execute** — Run `npm run migrate` in the Job and wait for it to
   finish. (Includes the rolled-back-migration recovery the `npm run
   migrate` script ships with.)
5. **deploy** — Roll out `adaptic-backend:${SHORT_SHA}` to the Cloud Run
   service, shifting 100% traffic on success.

### Manual deploy (one-shot)

```bash
cd backend-legacy
SHORT_SHA=$(git rev-parse --short HEAD)
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=${SHORT_SHA} \
  --service-account=projects/adaptic-438004/serviceAccounts/adaptic-cloud-build@adaptic-438004.iam.gserviceaccount.com \
  --gcs-source-staging-dir=gs://adaptic-cloudbuild/source \
  --region=us-east4 \
  --project=adaptic-438004
```

### GitHub trigger (`stable-release` branch)

The first time a GitHub repo is wired into Cloud Build it requires a
one-time OAuth install in the Cloud Console (the API does not support
this). Once that's done, the CLI can manage triggers.

1. Open: <https://console.cloud.google.com/cloud-build/triggers;region=us-east4/connect?project=724263936416>
2. Choose **GitHub (Cloud Build GitHub App)** as the source and authorize
   the **adapticai** org.
3. Select repository **`backend-legacy`**.
4. Skip the "Create a trigger" step in the wizard — we'll create it via CLI.

Then:

```bash
gcloud builds triggers create github \
  --name=adaptic-backend-stable-release \
  --region=us-east4 \
  --repo-owner=adapticai \
  --repo-name=backend-legacy \
  --branch-pattern=^stable-release$ \
  --build-config=cloudbuild.yaml \
  --service-account=projects/adaptic-438004/serviceAccounts/adaptic-cloud-build@adaptic-438004.iam.gserviceaccount.com \
  --project=adaptic-438004
```

## Cutover plan (Railway → GCP)

The Cloud Run service sits behind a Global HTTPS Load Balancer with Cloud
Armor (SQLi / XSS / scanner blocks + per-IP rate limit on `/graphql`).
Cloud Run ingress is `internal-and-cloud-load-balancing` — direct
`*.run.app` access is rejected at the network layer, so all production
traffic must flow through the LB.

**LB anchor IP: `8.233.34.153`** (static, reserved as `adaptic-backend-lb-ip`).

Before cutover (pre-flight):

1. Confirm the latest Cloud Build run is green:
   ```bash
   gcloud builds list --region=us-east4 --project=adaptic-438004 \
     --filter='status=SUCCESS' --limit=1
   ```
2. Confirm `/readyz` reports `database: connected` through the LB:
   ```bash
   curl -sSL -H 'Host: stable-api.adaptic.ai' http://8.233.34.153/readyz
   ```

Cutover (the moment you flip prod traffic to GCP):

3. **Lower the existing `stable-api.adaptic.ai` DNS TTL** at the registrar
   (currently 3600s). Set it to 60s. Wait at least 1 hour for the old
   long TTL to flush from public resolvers before step 4.
4. **Replace the CNAME with an A record** at the registrar:
   ```
   stable-api.adaptic.ai.   60   IN   A   8.233.34.153
   ```
   (Remove the `CNAME → nvbo4m73.up.railway.app` entry.)
5. **Watch the managed SSL cert provision** — Google's managed cert checks
   DNS every minute. When `stable-api.adaptic.ai` resolves to `8.233.34.153`, the
   cert moves PROVISIONING → ACTIVE within ~10–30 minutes:
   ```bash
   gcloud compute ssl-certificates describe adaptic-backend-cert \
     --global --project=adaptic-438004 \
     --format='value(managed.status,managed.domainStatus)'
   ```
6. **Smoke test over HTTPS** once the cert is ACTIVE:
   ```bash
   curl -fsSL https://stable-api.adaptic.ai/livez
   curl -fsSL https://stable-api.adaptic.ai/readyz
   curl -fsSL -X POST https://stable-api.adaptic.ai/graphql \
     -H 'content-type: application/json' -d '{"query":"{__typename}"}'
   ```
7. **Verify end-to-end** from the engine / app / platform sides — these
   already default to `stable-api.adaptic.ai`, so they pick up the new backend
   transparently as DNS propagates. Watch Cloud Run logs and AlloyDB
   active-connection count for 15 min.
8. **Raise the TTL back** to a reasonable value (300s or 3600s) at the
   registrar once GCP is stable.
9. **Decommission Railway**: stop the `adaptic-backend` service on Railway
   (don't delete — keep for rollback safety) for at least 7 days, then
   delete.

The HTTP listener on the LB (port 80) is an HTTP→HTTPS 301 redirect; do
not curl plain HTTP except for the validation step above.

### Engine / app / utils / platform env-var changes

If you keep `stable-api.adaptic.ai`, **no env-var changes are required** in any of
`engine/`, `utils/`, `app/`, `platform/`, `backend-legacy/`. All consumers
already default to `stable-api.adaptic.ai`.

If you switch to a GCP-native hostname, update these:

| Repo / File | Variable |
| --- | --- |
| `engine/.env` | `GRAPHQL_ENDPOINT`, `BACKEND_HTTPS_URL` |
| `platform/apps/web/.env.production` | `NEXT_PUBLIC_GRAPHQL_URL`, `NEXT_PUBLIC_WS_GRAPHQL_URL`, `NEXT_PUBLIC_BACKEND_HTTPS_URL` |
| `app/.env.production` | `BACKEND_HTTPS_URL`, `NEXT_PUBLIC_BACKEND_HTTPS_URL` |
| `app/netlify/edge-functions/waf-security.ts` | CSP `connect-src` allowlist (if domain leaves `adaptic.ai`) |
| `app/src/lib/auth/security-utils.ts` | CSP `connect-src` allowlist |

## Rollback

Cloud Run rollback is fast (no rebuild required):

```bash
# 1. Identify the previous revision
gcloud run revisions list --service=adaptic-backend --region=us-east4 \
  --project=adaptic-438004 --format="table(metadata.name,status.conditions.status)" --limit=5

# 2. Shift 100% traffic to a known-good revision
gcloud run services update-traffic adaptic-backend \
  --region=us-east4 --project=adaptic-438004 \
  --to-revisions=adaptic-backend-<REVISION>=100
```

To roll back further (e.g. a Prisma migration regression), restore AlloyDB
from continuous backup:

```bash
gcloud alloydb backups list --project=adaptic-438004
gcloud alloydb clusters restore-from-backup ...   # see AlloyDB docs
```

To return to Railway during the rollback window (only valid while the
Railway `adaptic-backend` service is still present and reachable —
Railway is being decommissioned after the migration stabilises):

1. In the Railway dashboard, re-enable the `adaptic-backend` service in
   `adaptic-os/stable` and wait for it to deploy successfully.
2. At the registrar, change the `stable-api.adaptic.ai` A record back to
   a CNAME pointing at the Railway-generated domain shown in the Railway
   service settings (Settings → Networking → Public Networking).
3. Wait for DNS to propagate (~1min at the current TTL=60s).

Once Railway is fully decommissioned, this rollback path no longer
applies — use the Cloud Run `update-traffic --to-revisions=...` command
above to roll back to a known-good revision instead.

## Troubleshooting

### Build fails at `npm install`

The Cloud Build base image (`node:22-bookworm-slim`) ships with npm 10.9 and
the repo's `package-lock.json` is gitignored, so we use `npm install`
(not `npm ci`) inside the Dockerfile. If install fails, regenerate the
lockfile locally with `rm package-lock.json && npm install` and retry.

### Build OOMs during codegen / tsc

Bump `NODE_OPTIONS=--max-old-space-size=N` in the builder stage. The full
codegen + dual-tsc pipeline needs ~6 GiB on Node 22 + TypeScript 5.9.

### `/readyz` returns 503 after deploy

The DB query in `/readyz` is failing. Check:
1. `gcloud run services logs read adaptic-backend --region=us-east4 --limit=50`
2. Confirm `DATABASE_URL` and `DIRECT_DATABASE_URL` in Secret Manager point
   at `7096c942-…us-east4.alloydb-psc.goog:6432` / `:5432` respectively.
3. Confirm the PSC forwarding rule is healthy:
   `gcloud compute forwarding-rules describe alloydb-psc-fr --region=us-east4`
4. Confirm the AlloyDB instance allowlist includes consumer project
   `724263936416`:
   `gcloud alloydb instances describe primary --cluster=adaptic-backend --region=us-east4 --format=json | jq .pscInstanceConfig.allowedConsumerProjects`

### Cold-start latency > 5s

- Verify `--min-instances=3` is set.
- Confirm `--no-cpu-throttling` and `--cpu-boost` are in the service spec.
- Inspect the startup probe failure threshold — `/readyz` should succeed
  within ~30s of process start; longer hints at slow DB connectivity
  (DNS misconfiguration or PSC routing).

### Migration job hangs

`gcloud run jobs executions describe <execution-id> --region=us-east4`
shows logs. If `prisma migrate deploy` is stuck waiting for the advisory
lock, an earlier execution is still running — kill it with
`gcloud run jobs executions cancel`.

### AlloyDB connection storms

Inspect the managed pool:
```bash
gcloud alloydb instances describe primary --cluster=adaptic-backend \
  --region=us-east4 --format="json" | jq .connectionPoolConfig
```

If `max_pool_size` is saturated, raise it:
```bash
gcloud alloydb instances update primary \
  --cluster=adaptic-backend --region=us-east4 \
  --connection-pooling-max-pool-size=160
```

Pool changes are online (no downtime), but new connection-string clients
may see a brief 30s blip while AlloyDB reconciles the change.

## Cost guidance

| Component | Approx. monthly cost (us-east4, 2026) |
| --- | --- |
| Cloud Run (3 min, ~10 avg, 8 vCPU / 16 GiB, CPU always-on) | $600 – 900 |
| Cloud Run egress (10 TiB to internet) | $100 |
| AlloyDB primary `c4-highmem-16-lssd` | $1,800 – 2,100 (unchanged) |
| AlloyDB managed pool | included |
| Artifact Registry (~5 GiB stored) | $1 |
| Secret Manager (10 secrets, 100k accesses) | $1 |
| Cloud Build (1 build / push, ~10 min) | $0.06 per build |
| VPC + PSC + DNS | < $5 |

Total incremental over current Railway: **roughly $600 – 900 / month**,
driven entirely by always-warm Cloud Run capacity sized for institutional
latency targets. Halving min instances to 1 and CPU to 4 vCPU brings this
down to ~$200 / month, at the cost of higher tail latency on the first
request after scale-in.
