# @adaptic/backend-legacy

![Adaptic Readme Banner](https://adaptic-public.s3.ap-southeast-2.amazonaws.com/adaptic-readme-banner.png?=1)

`@adaptic/backend-legacy` is the GraphQL/Prisma backend for the Adaptic.ai
trading platform and the **type authority** for the entire monorepo. It
owns the canonical Prisma schema (67 models, 73 enums as of 2026-05-22),
runs Apollo Server 5 + Express, and publishes type-safe CRUD functions,
selection sets, and stringified type definitions consumed by every other
package (`@adaptic/engine`, `@adaptic/utils`, `@adaptic/lumic-utils`, and
the `platform` frontend monorepo).

## Repository status

- **Visibility:** private GitHub repo, public on NPM
- **Branches:** `main` (npm dist-tag `latest`), `stable-release` (dist-tag `stable`)
- **Publish workflow:** GitHub Actions auto-bumps version and runs
  `npm publish` on push to either branch; **no manual version bumps are
  required** in PRs.

For consumer-facing usage instructions install the NPM package:

```bash
npm install @adaptic/backend-legacy
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
| [`docs/deployment/google-cloud-backend.md`](./docs/deployment/google-cloud-backend.md) | Cloud Run + AlloyDB runbook |

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
