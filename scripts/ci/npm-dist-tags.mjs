// @ts-check
/**
 * Registry reads behind the publish workflow's dist-tag lockstep
 * (`.github/workflows/publish.yml`, job `dist-tags`).
 *
 * The workflow publishes one build under every active package name and must
 * then prove that each name's dist-tags point at the release it just made. Two
 * properties of the npm registry decide how that proof has to be read:
 *
 * 1. A publish is accepted before it exists. `npm publish` returns once the
 *    registry has queued the tarball ("Your package is being processed"); the
 *    version, and the dist-tag the publish carries, appear only when processing
 *    finishes. The registry's own `time[<version>]` field records that moment,
 *    and for this package it trails the publish by many minutes — long enough
 *    that any check, or any further dist-tag move, issued straight after the
 *    publish is acting on a version the registry does not have yet.
 * 2. The package document (`/<name>`, what `npm view` reads) is served through
 *    a CDN with `cache-control: max-age=300`, so it can answer from a copy up to
 *    five minutes old. The dist-tags endpoint (`/-/package/<name>/dist-tags`)
 *    and the version document (`/<name>/<version>`) are served uncached.
 *
 * So every read here goes to an uncached endpoint, and the convergence check
 * waits for an EXACT expected value inside a bounded window, re-reading on
 * every poll. A read that fails is reported as unreadable — never as a tag
 * value, and never as agreement.
 *
 * Commands (exit codes in {@link EXIT}):
 *
 *   converge   --version V --names a,b --tags t1,t2
 *              [--timeout-seconds N] [--interval-seconds M] [--registry URL]
 *     Polls until every (name, tag) pair reads exactly V, or the window
 *     closes. `--timeout-seconds 0` is a single poll.
 *
 *   same-build --version V --names a,b [--registry URL]
 *     Confirms every name's V carries the same `dist.fileCount`. The tarballs
 *     differ only in their `name` field, so shasums and unpacked sizes legally
 *     differ while the file count cannot.
 *
 * Zero dependencies and plain ESM, so the workflow can run it with nothing but
 * a checkout and Node 20.
 */

import { pathToFileURL } from 'node:url';

/** Registry used when `--registry` is not given. */
export const DEFAULT_REGISTRY = 'https://registry.npmjs.org';

/**
 * Process exit codes. DIVERGED and UNKNOWN are kept apart because they mean
 * different things to a caller: DIVERGED is an established fact (the registry
 * answered with a different value), UNKNOWN is the absence of one.
 */
export const EXIT = Object.freeze({
  /** Every pair read the expected value. */
  CONVERGED: 0,
  /** At least one pair was read and holds a different value. */
  DIVERGED: 1,
  /** Nothing contradicted the expectation, but at least one pair could not be read. */
  UNKNOWN: 2,
  /** The command line was invalid; nothing was read. */
  USAGE: 64,
});

/** Per-request timeout, so a hung connection costs one poll rather than the window. */
const REQUEST_TIMEOUT_MS = 30_000;

/** Attempts per read for transport errors and retryable statuses (429, 5xx). */
const READ_ATTEMPTS = 3;

/** Pause between those attempts. */
const READ_RETRY_DELAY_MS = 5_000;

/** Attempts and pause for the version-document read behind `same-build`. */
const FILE_COUNT_ATTEMPTS = 10;
const FILE_COUNT_RETRY_DELAY_MS = 30_000;

/** Default convergence window and poll interval when the flags are omitted. */
const DEFAULT_TIMEOUT_SECONDS = 0;
const DEFAULT_INTERVAL_SECONDS = 30;

const MS_PER_SECOND = 1000;
const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;
const HTTP_NOT_FOUND = 404;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR_FLOOR = 500;

/**
 * @typedef {(input: string, init?: { headers?: Record<string, string>, signal?: AbortSignal }) =>
 *   Promise<{ status: number, json: () => Promise<unknown> }>} FetchLike
 */

/**
 * @typedef {object} Deps
 * @property {FetchLike} fetch      HTTP client (the global `fetch` in production).
 * @property {(ms: number) => Promise<void>} sleep  Waits between polls and retries.
 * @property {() => number} now     Milliseconds on a monotonic-enough clock.
 * @property {(line: string) => void} log    Progress output (stdout).
 * @property {(line: string) => void} error  Failure output (stderr).
 */

/**
 * @typedef {{ ok: true, value: T } | { ok: false, reason: string }} Read
 * @template T
 */

/**
 * @typedef {object} PairState
 * @property {string} name
 * @property {string} tag
 * @property {'match' | 'mismatch' | 'unreadable'} state
 * @property {string | null} seen   The value read; null when the tag is absent or the read failed.
 * @property {string | null} reason Why a read failed; null when it succeeded.
 */

/**
 * @typedef {object} ConvergeResult
 * @property {'converged' | 'diverged' | 'unknown'} status
 * @property {number} polls
 * @property {number} elapsedMs
 * @property {PairState[]} pairs  The state of every pair at the final poll.
 */

/**
 * The registry's path segment for a package name. A scoped name keeps its `@`
 * and escapes the `/`; that is the form the registry routes.
 *
 * @param {string} name
 * @returns {string}
 */
export function escapePackageName(name) {
  if (name.startsWith('@')) {
    return `@${encodeURIComponent(name.slice(1))}`;
  }
  return encodeURIComponent(name);
}

/**
 * @param {string} registry
 * @returns {string}
 */
function trimRegistry(registry) {
  return registry.replace(/\/+$/, '');
}

/**
 * The uncached dist-tags URL for a package.
 *
 * @param {string} registry
 * @param {string} name
 * @returns {string}
 */
export function distTagsUrl(registry, name) {
  return `${trimRegistry(registry)}/-/package/${escapePackageName(name)}/dist-tags`;
}

/**
 * The uncached version-document URL for one release of a package.
 *
 * @param {string} registry
 * @param {string} name
 * @param {string} version
 * @returns {string}
 */
export function versionUrl(registry, name, version) {
  return `${trimRegistry(registry)}/${escapePackageName(name)}/${encodeURIComponent(version)}`;
}

/**
 * @param {unknown} err
 * @returns {string}
 */
function describeError(err) {
  return err instanceof Error ? err.message : String(err);
}

/**
 * @param {number} status
 * @returns {boolean}
 */
function isRetryableStatus(status) {
  return status === HTTP_TOO_MANY_REQUESTS || status >= HTTP_SERVER_ERROR_FLOOR;
}

/**
 * GET a JSON document, retrying transport errors and retryable statuses. A
 * definitive non-200 answer (a 401 or 404 for a name the registry will not
 * show) is returned at once: retrying it would only spend the budget.
 *
 * @param {string} url
 * @param {Deps} deps
 * @param {number} attempts
 * @param {number} retryDelayMs
 * @returns {Promise<Read<unknown>>}
 */
async function getJson(url, deps, attempts, retryDelayMs) {
  /** @type {string} */
  let reason = 'no attempt made';
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await deps.fetch(url, {
        headers: { accept: 'application/json', 'cache-control': 'no-cache' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (res.status === HTTP_OK) {
        try {
          return { ok: true, value: await res.json() };
        } catch (err) {
          reason = `HTTP 200 with an unparseable body (${describeError(err)})`;
        }
      } else if (res.status === HTTP_NOT_FOUND || res.status === HTTP_UNAUTHORIZED) {
        return { ok: false, reason: `HTTP ${res.status} (the registry does not show this name or version)` };
      } else {
        reason = `HTTP ${res.status}`;
        if (!isRetryableStatus(res.status)) {
          return { ok: false, reason };
        }
      }
    } catch (err) {
      reason = `request failed (${describeError(err)})`;
    }
    if (attempt < attempts) {
      await deps.sleep(retryDelayMs);
    }
  }
  return { ok: false, reason: `${reason} after ${attempts} attempts` };
}

/**
 * Read a package's dist-tags from the uncached endpoint.
 *
 * @param {string} registry
 * @param {string} name
 * @param {Deps} deps
 * @returns {Promise<Read<Record<string, string>>>}
 */
export async function readDistTags(registry, name, deps) {
  const read = await getJson(distTagsUrl(registry, name), deps, READ_ATTEMPTS, READ_RETRY_DELAY_MS);
  if (!read.ok) {
    return read;
  }
  const body = read.value;
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, reason: 'dist-tags body is not an object' };
  }
  /** @type {Record<string, string>} */
  const tags = {};
  for (const [tag, value] of Object.entries(body)) {
    if (typeof value !== 'string') {
      return { ok: false, reason: `dist-tag "${tag}" is not a string` };
    }
    tags[tag] = value;
  }
  return { ok: true, value: tags };
}

/**
 * Read one release's `dist.fileCount` from the uncached version document.
 *
 * @param {string} registry
 * @param {string} name
 * @param {string} version
 * @param {Deps} deps
 * @returns {Promise<Read<number>>}
 */
export async function readFileCount(registry, name, version, deps) {
  const read = await getJson(versionUrl(registry, name, version), deps, FILE_COUNT_ATTEMPTS, FILE_COUNT_RETRY_DELAY_MS);
  if (!read.ok) {
    return read;
  }
  const body = read.value;
  if (body === null || typeof body !== 'object') {
    return { ok: false, reason: 'version document is not an object' };
  }
  const dist = /** @type {{ dist?: unknown }} */ (body).dist;
  if (dist === null || typeof dist !== 'object') {
    return { ok: false, reason: 'version document has no dist block' };
  }
  const fileCount = /** @type {{ fileCount?: unknown }} */ (dist).fileCount;
  if (typeof fileCount !== 'number' || !Number.isInteger(fileCount) || fileCount < 0) {
    return { ok: false, reason: 'version document has no integer dist.fileCount' };
  }
  return { ok: true, value: fileCount };
}

/**
 * Read every name once and classify every (name, tag) pair against the
 * expected version.
 *
 * @param {{ registry: string, version: string, names: string[], tags: string[] }} spec
 * @param {Deps} deps
 * @returns {Promise<PairState[]>}
 */
export async function pollPairs(spec, deps) {
  /** @type {PairState[]} */
  const pairs = [];
  for (const name of spec.names) {
    const read = await readDistTags(spec.registry, name, deps);
    for (const tag of spec.tags) {
      if (!read.ok) {
        pairs.push({ name, tag, state: 'unreadable', seen: null, reason: read.reason });
        continue;
      }
      const seen = Object.prototype.hasOwnProperty.call(read.value, tag) ? read.value[tag] : null;
      pairs.push({
        name,
        tag,
        state: seen === spec.version ? 'match' : 'mismatch',
        seen,
        reason: null,
      });
    }
  }
  return pairs;
}

/**
 * @param {PairState[]} pairs
 * @returns {'converged' | 'diverged' | 'unknown'}
 */
export function classify(pairs) {
  if (pairs.some((p) => p.state === 'mismatch')) {
    return 'diverged';
  }
  if (pairs.some((p) => p.state === 'unreadable')) {
    return 'unknown';
  }
  return 'converged';
}

/**
 * @param {PairState} pair
 * @returns {string}
 */
function describePair(pair) {
  if (pair.state === 'unreadable') {
    return `${pair.name} ${pair.tag}=<unreadable: ${pair.reason}>`;
  }
  const seen = pair.seen === null ? '<no such tag>' : pair.seen;
  return `${pair.name} ${pair.tag}=${seen}${pair.state === 'match' ? '' : ' (MISMATCH)'}`;
}

/**
 * Poll until every (name, tag) pair reads exactly `version`, or the window
 * closes. Bounded twice — by elapsed time and by a poll count derived from it —
 * so a clock that does not advance cannot turn the wait into an endless loop.
 *
 * @param {{ registry: string, version: string, names: string[], tags: string[],
 *           timeoutMs: number, intervalMs: number }} spec
 * @param {Deps} deps
 * @returns {Promise<ConvergeResult>}
 */
export async function converge(spec, deps) {
  const start = deps.now();
  const maxPolls = Math.floor(spec.timeoutMs / spec.intervalMs) + 1;
  /** @type {PairState[]} */
  let pairs = [];
  let polls = 0;
  for (;;) {
    pairs = await pollPairs(spec, deps);
    polls += 1;
    const elapsedMs = deps.now() - start;
    const status = classify(pairs);
    deps.log(
      `poll ${polls} (+${Math.round(elapsedMs / MS_PER_SECOND)}s, expecting ${spec.version}): ${pairs.map(describePair).join('; ')}`,
    );
    if (status === 'converged') {
      return { status, polls, elapsedMs, pairs };
    }
    if (polls >= maxPolls || elapsedMs + spec.intervalMs > spec.timeoutMs) {
      return { status, polls, elapsedMs, pairs };
    }
    await deps.sleep(spec.intervalMs);
  }
}

/**
 * Compare `dist.fileCount` across every name's release of `version`.
 *
 * @param {{ registry: string, version: string, names: string[] }} spec
 * @param {Deps} deps
 * @returns {Promise<{ status: 'converged' | 'diverged' | 'unknown',
 *                     counts: { name: string, read: Read<number> }[] }>}
 */
export async function sameBuild(spec, deps) {
  /** @type {{ name: string, read: Read<number> }[]} */
  const counts = [];
  for (const name of spec.names) {
    counts.push({ name, read: await readFileCount(spec.registry, name, spec.version, deps) });
  }
  if (counts.some((c) => !c.read.ok)) {
    return { status: 'unknown', counts };
  }
  const values = new Set(counts.map((c) => (c.read.ok ? c.read.value : null)));
  return { status: values.size === 1 ? 'converged' : 'diverged', counts };
}

/**
 * @typedef {object} Args
 * @property {string} command
 * @property {string} version
 * @property {string[]} names
 * @property {string[]} tags
 * @property {number} timeoutSeconds
 * @property {number} intervalSeconds
 * @property {string} registry
 */

/**
 * @param {string | undefined} raw
 * @returns {string[]}
 */
function splitList(raw) {
  if (raw === undefined) {
    return [];
  }
  return raw.split(',').map((s) => s.trim());
}

/**
 * @param {string | undefined} raw
 * @param {number} fallback
 * @param {string} flag
 * @returns {number}
 */
function parseSeconds(raw, fallback, flag) {
  if (raw === undefined) {
    return fallback;
  }
  if (!/^\d+$/.test(raw)) {
    throw new Error(`${flag} must be a whole number of seconds, got "${raw}"`);
  }
  return Number(raw);
}

/**
 * Parse and validate the command line. Every list entry must be non-empty: a
 * name list built as "${MIRROR_NAME:+$MIRROR_NAME,}$PACKAGE_NAME" with an
 * unset PACKAGE_NAME must fail here, not quietly check one name fewer.
 *
 * @param {string[]} argv
 * @returns {Args}
 */
export function parseArgs(argv) {
  const [command, ...rest] = argv;
  if (command !== 'converge' && command !== 'same-build') {
    throw new Error(`unknown command "${command ?? ''}" (expected converge or same-build)`);
  }
  /** @type {Record<string, string>} */
  const flags = {};
  for (let i = 0; i < rest.length; i += 2) {
    const key = rest[i];
    const value = rest[i + 1];
    if (!key.startsWith('--') || value === undefined) {
      throw new Error(`expected "--flag value" pairs, got "${key}"`);
    }
    flags[key.slice(2)] = value;
  }
  const known = new Set(['version', 'names', 'tags', 'timeout-seconds', 'interval-seconds', 'registry']);
  for (const key of Object.keys(flags)) {
    if (!known.has(key)) {
      throw new Error(`unknown flag --${key}`);
    }
  }
  const version = flags.version ?? '';
  if (version.trim() === '') {
    throw new Error('--version is required and must not be empty');
  }
  const names = splitList(flags.names);
  if (names.length === 0 || names.some((n) => n === '')) {
    throw new Error(`--names must be a comma-separated list with no empty entries, got "${flags.names ?? ''}"`);
  }
  const tags = splitList(flags.tags);
  if (command === 'converge' && (tags.length === 0 || tags.some((t) => t === ''))) {
    throw new Error(`--tags must be a comma-separated list with no empty entries, got "${flags.tags ?? ''}"`);
  }
  const timeoutSeconds = parseSeconds(flags['timeout-seconds'], DEFAULT_TIMEOUT_SECONDS, '--timeout-seconds');
  const intervalSeconds = parseSeconds(flags['interval-seconds'], DEFAULT_INTERVAL_SECONDS, '--interval-seconds');
  if (intervalSeconds === 0) {
    throw new Error('--interval-seconds must be at least 1');
  }
  return {
    command,
    version,
    names,
    tags,
    timeoutSeconds,
    intervalSeconds,
    registry: flags.registry ?? DEFAULT_REGISTRY,
  };
}

/**
 * Run one command and return its exit code. Failures are written as GitHub
 * `::error::` annotations so they surface on the run summary.
 *
 * @param {string[]} argv
 * @param {Deps} deps
 * @returns {Promise<number>}
 */
export async function main(argv, deps) {
  /** @type {Args} */
  let args;
  try {
    args = parseArgs(argv);
  } catch (err) {
    deps.error(`::error::npm-dist-tags: ${describeError(err)}`);
    return EXIT.USAGE;
  }

  if (args.command === 'same-build') {
    const result = await sameBuild(args, deps);
    for (const { name, read } of result.counts) {
      deps.log(`${name}@${args.version} dist.fileCount=${read.ok ? read.value : `<unreadable: ${read.reason}>`}`);
    }
    if (result.status === 'converged') {
      deps.log(`Same build: every name's ${args.version} carries the same file count.`);
      return EXIT.CONVERGED;
    }
    if (result.status === 'diverged') {
      deps.error(`::error::fileCount differs across ${args.names.join(', ')} for ${args.version} — the tarballs are not the same build.`);
      return EXIT.DIVERGED;
    }
    deps.error(`::error::could not read dist.fileCount for every name at ${args.version}; the build identity is UNKNOWN, not confirmed.`);
    return EXIT.UNKNOWN;
  }

  const result = await converge(
    {
      registry: args.registry,
      version: args.version,
      names: args.names,
      tags: args.tags,
      timeoutMs: args.timeoutSeconds * MS_PER_SECOND,
      intervalMs: args.intervalSeconds * MS_PER_SECOND,
    },
    deps,
  );
  if (result.status === 'converged') {
    deps.log(`Lockstep OK: ${args.tags.join(', ')} on ${args.names.join(', ')} all read ${args.version} (poll ${result.polls}).`);
    return EXIT.CONVERGED;
  }
  for (const pair of result.pairs) {
    if (pair.state !== 'match') {
      deps.error(`::error::${describePair(pair)}, expected ${args.version} after ${result.polls} poll(s) over ${Math.round(result.elapsedMs / MS_PER_SECOND)}s.`);
    }
  }
  if (result.status === 'diverged') {
    deps.error(`::error::dist-tags diverged: not every name's ${args.tags.join(', ')} reached ${args.version}.`);
    return EXIT.DIVERGED;
  }
  deps.error(`::error::dist-tags UNKNOWN: some names could not be read, so lockstep at ${args.version} is not established.`);
  return EXIT.UNKNOWN;
}

/** @type {Deps} */
const processDeps = {
  fetch: (input, init) => fetch(input, init),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now: () => Date.now(),
  log: (line) => process.stdout.write(`${line}\n`),
  error: (line) => process.stderr.write(`${line}\n`),
};

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(invokedPath).href) {
  process.exitCode = await main(process.argv.slice(2), processDeps);
}
