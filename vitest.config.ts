import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'src/generated/**', 'src/modules/**'],
    testTimeout: 10000,
    hookTimeout: 10000,
    // The generator suite runs the full codegen in-process, and its logger
    // emits tens of thousands of warn lines. With console interception ON,
    // every line is forwarded over the vitest worker-RPC channel, which can
    // starve it past its timeout and fail the run with an unhandled
    // "[vitest-worker]: Timeout calling onTaskUpdate" error even when all
    // tests pass (observed on the CI publish gate, run 31244014211).
    // Writing console output straight to stdout removes the RPC flood
    // without hiding any output.
    disableConsoleIntercept: true,
    server: {
      deps: {
        // `graphql` 16 publishes `main: index.js` (CJS) and `module:
        // index.mjs` with no `exports` map. Vite resolves it through `module`,
        // while an externalized ESM dependency gets `main` through Node's own
        // resolver — two live copies of the library in one process. Any schema
        // built on one side then fails `instanceOf` on the other with
        // "Cannot use GraphQLSchema from another module or realm".
        //
        // graphql-ws validates the document BEFORE it invokes the `context`
        // callback, so the realm mismatch aborts a subscription before any
        // auth code runs and closes the socket with 4500 — indistinguishable
        // from a genuine rejection to a test that only checks the close code.
        // Inlining graphql-ws routes it through the same resolver as the test
        // files, leaving exactly one `graphql` instance.
        inline: [/(?:^|\/)graphql-ws(?:\/|$)/],
      },
    },
    // The generator writes through src/utils/logger.ts (raw process.stdout,
    // not console), so interception is not the only flood path — the sheer
    // stdout volume through the forked worker's IPC pipe can still starve
    // the task-update RPC. Suppress sub-error log noise at the source for
    // test runs; production default (LOG_LEVEL unset → debug) is unchanged.
    env: {
      LOG_LEVEL: 'error',
    },
    coverage: {
      provider: 'v8',
      reporter: [
        'text',
        'text-summary',
        'json',
        'json-summary',
        'lcov',
        'html',
      ],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/generated/**',
        'src/modules/**',
        'src/resolvers/**',
        'node_modules/**',
        // Generated per-model CRUD surface (written by generate:functions):
        // one PascalCase file per Prisma model plus the generated barrel.
        // ~1.3M lines of machine output that swamped the coverage
        // denominator to 0.24% the first time this job ever ran with
        // codegen present. Coverage thresholds are for HAND-WRITTEN code.
        'src/[A-Z]*.ts',
        'src/index.ts',
      ],
      // Ratchet floors calibrated 2026-08-08 against the HAND-WRITTEN
      // surface (generated CRUD excluded above): measured 49.4% lines /
      // 87.3% branches / 76.5% funcs. The old 60/50/40/60 numbers were
      // aspirational fiction — they had never once been evaluated in CI,
      // and against the pre-exclusion denominator they measured 0.24%.
      // Floors sit just under measured reality so any regression fails;
      // raise them as coverage grows.
      // CI (clean checkout + fresh codegen) measures lower than a local
      // working tree (38.99% lines on run 31251731594); floors calibrate to
      // the ENFORCEMENT environment.
      thresholds: {
        lines: 35,
        functions: 70,
        branches: 80,
        statements: 35,
      },
    },
  },
});
