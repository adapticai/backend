# Graveyard — 2026-05 source-tree markdown

This directory holds markdown files that previously lived inside `src/middleware/`
and `src/plugins/` and were point-in-time task-completion records or
integration checklists rather than durable documentation.

They are kept (rather than deleted) only as a historical reference for the
2026-02 input-validation and query-depth-limiter rollouts. **Do not link to
them from current documentation.** The infrastructure they describe has since
been wired into `src/server.ts` as part of the 2026-05-22 readability sweep —
see `docs/audits/2026-05-22-readability/README.md` for the wire/delete
decisions.

| File                                  | Original location                          | Purpose                                                                                  |
| ------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `middleware-INTEGRATION.md`           | `src/middleware/INTEGRATION.md`            | Integration steps for `createValidationPlugin()` — now done in `server.ts`.              |
| `middleware-CHECKLIST.md`             | `src/middleware/CHECKLIST.md`              | Pre/post-integration checkboxes from the validation rollout.                             |
| `middleware-SUMMARY.md`               | `src/middleware/SUMMARY.md`                | Implementation summary duplicating top-level `VALIDATION_IMPLEMENTATION.md` (also archived). |
| `plugins-IMPLEMENTATION_SUMMARY.md`   | `src/plugins/IMPLEMENTATION_SUMMARY.md`    | Implementation summary for `query-depth-limiter` and `error-sanitizer` plugins.          |

Live integration documentation for these subsystems lives at
`docs/middleware/README.md` and `docs/plugins/README.md`.
