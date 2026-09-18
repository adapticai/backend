#!/usr/bin/env node
/**
 * Thin wrapper delegating this repo's LLM eval gate to the shared harness in
 * `@adaptic/utils` (backlog W0-03).
 *
 * The harness lives in one repo because the gate has to grade every repo
 * against the SAME comparators and the same tolerances. Four copies of an eval
 * harness would drift, and the drift would show up as one repo quietly holding
 * a lower bar than the others.
 *
 * If the harness cannot be located, this wrapper exits NON-ZERO and says so. A
 * wrapper that exited 0 on a missing harness would report the gate as green in
 * exactly the situation where it graded nothing — which is the failure mode an
 * eval gate exists to prevent, reproduced inside the gate itself.
 *
 * Usage: `node scripts/run-llm-evals.mjs [harness flags...]`
 * Environment: `LLM_EVAL_HARNESS` names the harness explicitly. When it is set
 * it is the ONLY candidate, because an explicit override that silently fell
 * back to a different harness would grade something other than what was asked
 * for.
 *
 * @module scripts/run-llm-evals
 */

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Exit code used when the harness cannot be located. */
const EXIT_HARNESS_MISSING = 2;

/** Exit code used when the harness process is killed by a signal rather than exiting. */
const EXIT_HARNESS_SIGNALLED = 1;

/** This repository's root, derived from this file's location. */
const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

/** The workspace root holding the sibling repos. */
const WORKSPACE_ROOT = dirname(REPO_ROOT);

/** Relative path of the harness inside the utils package. */
const HARNESS_RELATIVE = join("scripts", "run-llm-evals.mjs");

const override = process.env.LLM_EVAL_HARNESS;
const candidates =
  typeof override === "string" && override.length > 0
    ? [override]
    : [
        join(WORKSPACE_ROOT, "utils", HARNESS_RELATIVE),
        join(REPO_ROOT, "node_modules", "@adaptic", "utils", HARNESS_RELATIVE),
      ];

const harness = candidates.find((candidate) => existsSync(candidate));

if (harness === undefined) {
  console.error(
    "LLM eval gate: the shared harness could not be located. Looked at:\n" +
      candidates.map((candidate) => `  - ${candidate}`).join("\n") +
      "\nCheck out the utils repo beside this one, or set LLM_EVAL_HARNESS to the harness path. " +
      "This wrapper fails rather than passing, because a gate that grades nothing must never report green.",
  );
  process.exit(EXIT_HARNESS_MISSING);
}

const result = spawnSync(process.execPath, [harness, ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exit(result.status === null ? EXIT_HARNESS_SIGNALLED : result.status);
