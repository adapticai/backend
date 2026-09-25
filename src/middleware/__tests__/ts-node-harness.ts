/**
 * Run an out-of-process ts-node harness and return the JSON it prints between
 * `<<<RESULTS>>>` and `<<<END>>>`.
 *
 * The guard harnesses build schemas from the generated resolvers, which need
 * `emitDecoratorMetadata`, so they cannot run inside vitest's esbuild
 * transform. A run costs tens of seconds of CPU, and far longer on a loaded
 * machine, so the child is awaited, never spawned synchronously: a synchronous
 * spawn blocks the vitest worker's event loop for the whole run, the worker
 * cannot answer the runner's RPC in that time, and once the block outlasts
 * vitest's 60 s RPC timeout the run records an unhandled
 * `Timeout calling "onTaskUpdate"` error and exits 1 even though every
 * assertion passed.
 *
 * The child is killed at `timeoutMs` and the failure says so. Set the calling
 * hook's timeout above it, so a hung harness fails its suite with this reason
 * rather than with a bare hook timeout that leaves the child running.
 */
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/** Repository root, resolved from `src/middleware/__tests__`. */
const REPO_ROOT = path.resolve(__dirname, '../../..');

/** Largest harness stdout accepted, in bytes. */
const MAX_OUTPUT_BYTES = 64 * 1024 * 1024;

/** Characters of harness output quoted in a failure message. */
const FAILURE_TAIL_CHARS = 2000;

const RESULTS = /<<<RESULTS>>>(.*)<<<END>>>/s;

/** The fields Node attaches to a rejected `execFile`. */
interface ExecFileFailure {
  code?: number | string | null;
  killed?: boolean;
  signal?: NodeJS.Signals | null;
  stderr?: string;
}

function describeFailure(failure: ExecFileFailure, timeoutMs: number): string {
  if (failure.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER') {
    return `printed more than ${MAX_OUTPUT_BYTES} bytes`;
  }
  if (failure.killed) return `was killed after ${timeoutMs} ms`;
  if (failure.signal) return `was terminated by ${failure.signal}`;
  return `exited with code ${String(failure.code)}`;
}

/**
 * Run `harnessPath` (relative to the repository root) under ts-node and parse
 * its results.
 *
 * @param harnessPath - Harness file, relative to the repository root.
 * @param timeoutMs - Wall-clock budget; the child is killed when it runs out.
 * @returns The parsed results object.
 */
export async function runTsNodeHarness<T>(harnessPath: string, timeoutMs: number): Promise<T> {
  let stdout: string;
  try {
    ({ stdout } = await execFileAsync(
      path.join(REPO_ROOT, 'node_modules/.bin/ts-node'),
      ['--transpile-only', harnessPath],
      {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        env: { ...process.env, LOG_LEVEL: 'error' },
        maxBuffer: MAX_OUTPUT_BYTES,
        timeout: timeoutMs,
        killSignal: 'SIGKILL',
      }
    ));
  } catch (error) {
    const failure = error as ExecFileFailure;
    throw new Error(
      `harness ${harnessPath} ${describeFailure(failure, timeoutMs)}:\n` +
        (failure.stderr ?? '').slice(-FAILURE_TAIL_CHARS)
    );
  }
  const match = RESULTS.exec(stdout);
  if (!match) {
    throw new Error(
      `harness ${harnessPath} printed no results:\n${stdout.slice(-FAILURE_TAIL_CHARS)}`
    );
  }
  return JSON.parse(match[1]) as T;
}
