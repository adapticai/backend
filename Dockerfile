# syntax=docker/dockerfile:1.7
# Multi-stage production image for @adaptic/backend.
#
# Stage layout:
#   1. deps     - install full dependency tree (dev + prod) for the build
#   2. builder  - run the 8-step codegen pipeline + dual tsc compilation, then prune to prod deps
#   3. runtime  - distroless-style slim runtime, copy only the artifacts needed at runtime
#
# The entrypoint is the compiled Apollo Server, preceded by
# `prisma migrate deploy` against DIRECT_DATABASE_URL.
#
# Migrations used to run as a separate Cloud Run Job (see cloudbuild.yaml)
# before each revision was promoted. The 2026-09-12 move to Railway retired
# that job without replacing it, so from then on nothing applied migrations at
# all: a schema field could ship, be published, and be served while the column
# behind it did not exist, and the first query selecting it failed in
# production. A schema and its migration have to arrive together, so the
# migration now runs where the image runs.
#
# It fails the boot rather than degrading. A server answering queries against a
# schema the database does not have is worse than one that does not start: the
# first failure is then a deploy that visibly refuses, not a resolver error
# reaching a caller. Concurrent replicas are safe — `migrate deploy` takes a
# Postgres advisory lock, so one applies while the others wait.

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS deps
ENV HUSKY=0
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install --no-audit --no-fund --include=dev

FROM node:${NODE_VERSION}-bookworm-slim AS builder
# `npm run build` type-checks the whole generated surface in one `tsc` pass —
# every Prisma model, its TypeGraphQL resolvers, and the generated selection
# sets and CRUD functions. That working set grows with the schema, so the heap
# ceiling is a function of model count, not of this Dockerfile. At 6144 MB
# `tsc` aborts with SIGABRT (exit 134, "Ineffective mark-compacts near heap
# limit"), which surfaces as an opaque Cloud Build step failure rather than a
# type error. Measured: 6144 aborts, 8192 completes; 12288 is that plus
# headroom for the next models added. Keep this at least a few GB below the
# build machine's RAM (cloudbuild.yaml `machineType`) so V8 hits its own limit
# and reports a heap error, instead of the kernel OOM-killing the container and
# reporting exit 137 with no diagnosis at all.
ENV HUSKY=0 \
    SKIP_PRISMA_VERSION_CHECK=true \
    NODE_OPTIONS=--max-old-space-size=12288
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm run build \
  && npm prune --omit=dev \
  && rm -rf /root/.npm /tmp/* /var/tmp/*

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=8080 \
    HUSKY=0
WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates tini \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --uid 1001 --gid 0 --shell /sbin/nologin --home /app adaptic
COPY --from=builder --chown=adaptic:0 /app/node_modules ./node_modules
COPY --from=builder --chown=adaptic:0 /app/dist ./dist
COPY --from=builder --chown=adaptic:0 /app/prisma ./prisma
COPY --from=builder --chown=adaptic:0 /app/package.json ./package.json
USER adaptic
EXPOSE 8080
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.prisma || { echo '[migrate] FATAL: database migration failed - refusing to serve against a drifted schema. Fix the failed migration (see log above) and redeploy.'; exit 1; }; exec node dist/server.js"]
