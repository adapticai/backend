# @adaptic/backend

![Adaptic Readme Banner](https://adaptic-public.s3.ap-southeast-2.amazonaws.com/adaptic-readme-banner.png?=1)

`@adaptic/backend` is the GraphQL/Prisma backend for the Adaptic.ai
trading platform and the **type authority** for the entire monorepo. It
owns the canonical Prisma schema (67 models, 73 enums as of 2026-05-22),
runs Apollo Server 5 + Express, and publishes type-safe CRUD functions,
selection sets, and stringified type definitions consumed by every other
package (`@adaptic/engine`, `@adaptic/utils`, `@adaptic/lumic-utils`, and
the `platform` frontend monorepo).

## Publishing under two names

The publish workflow builds the package **once** and publishes that one `dist/`
tree under two npm names:

| Role | Name | Where it comes from |
| --- | --- | --- |
| canonical | `@adaptic/backend` | `.name` in `package-npm.json` |
| mirror | `@adaptic/backend-legacy` | `MIRROR_NAME` in `.github/workflows/publish.yml` |

Both names always receive the **same version number** and **byte-identical**
contents. That works because no module in the shipped tree resolves its own
package name — there is no self-import anywhere under the published `files` set —
so one tarball is valid under either name. The mirror exists because renaming by
editing `.name` alone does not migrate anyone: pinned consumers keep resolving
the old name and simply stop receiving updates, with no error and no signal.
Publishing both keeps every existing consumer live while they migrate at their
own pace, and the post-publish lockstep assertion fails the job loudly if the two
names ever drift apart in version or file count.

The next version is derived from the **highest** `stable` dist-tag across both
names, so the train continues rather than restarting — and if neither name has a
`stable` release the job fails rather than inventing a version number.

**Do not `npm unpublish` the mirror.** Frozen dependency lineages resolve it
transitively and would break. When every consumer has migrated, delete
`MIRROR_NAME` from the workflow to freeze the old name, then
`npm deprecate` it — in that order, since `npm deprecate` only marks the versions
that exist at the moment it runs.

## Repository status

- **Visibility:** private GitHub repo, public on NPM
- **Branches:** `main` is the production branch and the **sole publisher** of the
  `0.0.x` train — it publishes on npm dist-tag `stable` and moves `latest` to it.
  `platform-alignment` publishes prereleases on the `alignment` tag.
  `stable-release` mirrors `main` and is retained only for compatibility; it
  deliberately does **not** publish, because two branches feeding one version
  train race to the same number and the loser dies on a duplicate-version 403.
- **Publish workflow:** GitHub Actions auto-bumps the version and runs
  `npm publish` on push to a publishing branch; **no manual version bumps are
  required** in PRs.
- **npm name:** the package is `@adaptic/backend`. It was previously published
  as `@adaptic/backend-legacy`, and that name is still published — from the same
  build, at the same version — until every consumer has moved off it. See
  [Publishing under two names](#publishing-under-two-names).

For consumer-facing usage instructions install the NPM package:

```bash
npm install @adaptic/backend
```

and read [`docs/using-adaptic-backend.md`](./docs/using-adaptic-backend.md)
(the canonical usage guide).

## Repository documentation

Live (current) docs:

| Document                           | Purpose                                                          |
| ---------------------------------- | ---------------------------------------------------------------- |
| [`CLAUDE.md`](./CLAUDE.md)         | Claude Code instructions for working in this repo                |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System overview, codegen pipeline, observability       |
| [`docs/REPO_MAP.md`](./docs/REPO_MAP.md)         | Directory map and key files                            |
| [`docs/AGENT_RULES.md`](./docs/AGENT_RULES.md)   | Agent-targeted rules (which files to edit / not edit)  |
| [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md)   | Code conventions and codegen directive syntax          |
| [`docs/PR_CHECKLIST.md`](./docs/PR_CHECKLIST.md) | Pre-merge checklist                                    |
| [`docs/DEBUGGING_PLAYBOOK.md`](./docs/DEBUGGING_PLAYBOOK.md) | Common failure modes and resolutions        |
| [`docs/TESTING_STRATEGY.md`](./docs/TESTING_STRATEGY.md)     | Test layout and coverage thresholds         |
| [`docs/ENVIRONMENT_SETUP.md`](./docs/ENVIRONMENT_SETUP.md)   | Local-dev env-var reference                 |
| [`docs/using-adaptic-backend.md`](./docs/using-adaptic-backend.md) | Consumer-facing usage guide          |
| [`docs/custom-resolvers.md`](./docs/custom-resolvers.md)         | Custom resolver authoring guide          |
| [`docs/deployment/railway-backend.md`](./docs/deployment/railway-backend.md) | Railway deployment runbook |

Archived audit snapshots live under [`docs/audits/`](./docs/audits/). Do
not treat them as current state.

## Build & test

```bash
npm install
npm run build          # full pipeline: clean, generate, fix-imports, generate:selections, generate:functions, generate:strings, tsc, build:server
npm run lint
npm run test
```

## Quick reference

- Schema: [`prisma/schema.prisma`](./prisma/schema.prisma) (67 models, 73 enums)
- Package entry: `src/index.ts` (generated; default-exports the `adaptic.<model>.<op>()` CRUD namespace)
- Server bootstrap: `src/server.ts`
- Apollo Client factory: `src/client.ts`

## License

MIT. See [LICENSE](./LICENSE).

---

This project is part of the [Adaptic.ai](https://adaptic.ai) platform.
