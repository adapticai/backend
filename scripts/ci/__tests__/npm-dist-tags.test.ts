/**
 * The registry reader behind the publish workflow's dist-tag lockstep
 * (scripts/ci/npm-dist-tags.mjs).
 *
 * The registry is faked at the `fetch` seam and time at the `sleep`/`now`
 * seam, so a wait of hours runs in milliseconds and every poll is countable.
 * The registry states replayed here are the ones measured on npm for this
 * package: `latest` left one release behind `stable` on @adaptic/backend, and
 * a release the registry took over an hour to show after the publish returned.
 */
import { spawn } from 'node:child_process';
import { createServer, type Server } from 'node:http';
import { join } from 'node:path';
import {
  EXIT,
  converge,
  distTagsUrl,
  escapePackageName,
  main,
  parseArgs,
  readDistTags,
  sameBuild,
  versionUrl,
} from '../npm-dist-tags.mjs';

const REGISTRY = 'https://registry.npmjs.org';
const CANONICAL = '@adaptic/backend';
const MIRROR = '@adaptic/backend-legacy';
const NAMES = [MIRROR, CANONICAL];
const RELEASE = '0.0.1044';
const PREVIOUS = '0.0.1043';
const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;

type Reply = { status: number; body?: unknown } | Error;

interface FakeRequest {
  url: string;
  headers: Record<string, string> | undefined;
}

interface Fake {
  deps: Parameters<typeof main>[1];
  requests: FakeRequest[];
  logs: string[];
  errors: string[];
  elapsedMs: () => number;
}

/**
 * A registry that answers each URL from a script of replies (the last reply
 * repeats), on a clock that advances only when the code under test sleeps.
 */
function fakeRegistry(routes: Record<string, Reply[]>, options: { frozenClock?: boolean } = {}): Fake {
  let clock = 0;
  const requests: FakeRequest[] = [];
  const served = new Map<string, number>();
  const logs: string[] = [];
  const errors: string[] = [];
  const deps: Fake['deps'] = {
    fetch: async (url: string, init?: { headers?: Record<string, string> }) => {
      requests.push({ url, headers: init?.headers });
      const replies = routes[url];
      if (replies === undefined) {
        throw new Error(`fake registry has no route for ${url}`);
      }
      const index = served.get(url) ?? 0;
      served.set(url, index + 1);
      const reply = replies[Math.min(index, replies.length - 1)];
      if (reply instanceof Error) {
        throw reply;
      }
      return { status: reply.status, json: async (): Promise<unknown> => reply.body };
    },
    sleep: async (ms: number): Promise<void> => {
      if (!options.frozenClock) {
        clock += ms;
      }
    },
    now: (): number => clock,
    log: (line: string): void => {
      logs.push(line);
    },
    error: (line: string): void => {
      errors.push(line);
    },
  };
  return { deps, requests, logs, errors, elapsedMs: () => clock };
}

function tags(value: Record<string, string>): Reply {
  return { status: 200, body: value };
}

function repeat(reply: Reply, times: number): Reply[] {
  return Array.from({ length: times }, () => reply);
}

const tagsAt = (name: string): string => distTagsUrl(REGISTRY, name);

describe('registry addressing', () => {
  it('escapes a scoped name the way the registry routes it', () => {
    expect(escapePackageName(CANONICAL)).toBe('@adaptic%2Fbackend');
    expect(escapePackageName('plain-name')).toBe('plain-name');
  });

  it('reads dist-tags from the uncached endpoint, not the CDN-cached package document', async () => {
    const fake = fakeRegistry({
      'https://registry.npmjs.org/-/package/@adaptic%2Fbackend/dist-tags': [tags({ stable: RELEASE })],
    });
    const read = await readDistTags(`${REGISTRY}/`, CANONICAL, fake.deps);
    expect(read).toEqual({ ok: true, value: { stable: RELEASE } });
    expect(fake.requests).toHaveLength(1);
    expect(fake.requests[0].url).toBe('https://registry.npmjs.org/-/package/@adaptic%2Fbackend/dist-tags');
    expect(fake.requests[0].headers?.['cache-control']).toBe('no-cache');
  });

  it('reads a release file count from the version document', () => {
    expect(versionUrl(REGISTRY, MIRROR, RELEASE)).toBe('https://registry.npmjs.org/@adaptic%2Fbackend-legacy/0.0.1044');
  });
});

describe('converge', () => {
  const spec = {
    registry: REGISTRY,
    version: RELEASE,
    names: NAMES,
    tags: ['stable', 'latest'],
    timeoutMs: 30 * MINUTE_MS,
    intervalMs: MINUTE_MS,
  };

  it('converges once every name and tag reads the expected release', async () => {
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE, latest: RELEASE })],
      [tagsAt(CANONICAL)]: [tags({ stable: PREVIOUS, latest: PREVIOUS }), tags({ stable: RELEASE, latest: RELEASE })],
    });
    const result = await converge(spec, fake.deps);
    expect(result.status).toBe('converged');
    expect(result.polls).toBe(2);
    expect(result.pairs.every((p) => p.state === 'match')).toBe(true);
  });

  it('positive control: latest left one release behind on one name is DIVERGED, naming the pair', async () => {
    // The registry state this lane was opened on: stable moved on both names,
    // latest moved on the mirror only.
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE, latest: RELEASE })],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE, latest: PREVIOUS })],
    });
    const result = await converge(spec, fake.deps);
    expect(result.status).toBe('diverged');
    const mismatched = result.pairs.filter((p) => p.state !== 'match');
    expect(mismatched).toEqual([
      { name: CANONICAL, tag: 'latest', state: 'mismatch', seen: PREVIOUS, reason: null },
    ]);
    // Bounded: it waited the whole window, then stopped.
    expect(result.polls).toBe(31);
    expect(fake.elapsedMs()).toBe(30 * MINUTE_MS);
  });

  it('waits through the registry processing lag instead of reporting the previous release as drift', async () => {
    // 85 minutes of the previous release, then the new one: the longest lag
    // measured between `npm publish` returning and the registry showing the
    // release on @adaptic/backend.
    const lagPolls = 85;
    const routes = {
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE })],
      [tagsAt(CANONICAL)]: [...repeat(tags({ stable: PREVIOUS }), lagPolls), tags({ stable: RELEASE })],
    };
    const wide = fakeRegistry(routes);
    const result = await converge({ ...spec, tags: ['stable'], timeoutMs: 150 * MINUTE_MS }, wide.deps);
    expect(result.status).toBe('converged');
    expect(result.polls).toBe(lagPolls + 1);
    expect(wide.elapsedMs()).toBe(lagPolls * MINUTE_MS);

    // The five-minute window the in-job assertion used reports the same
    // healthy release as drifted — which is how it failed on every run.
    const narrow = fakeRegistry(routes);
    const short = await converge(
      { ...spec, tags: ['stable'], timeoutMs: 5 * MINUTE_MS, intervalMs: 10 * SECOND_MS },
      narrow.deps,
    );
    expect(short.status).toBe('diverged');
  });

  it('a timeout of zero is exactly one poll', async () => {
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: PREVIOUS })],
      [tagsAt(CANONICAL)]: [tags({ stable: PREVIOUS })],
    });
    const result = await converge({ ...spec, tags: ['stable'], timeoutMs: 0 }, fake.deps);
    expect(result.polls).toBe(1);
    expect(fake.requests).toHaveLength(2);
    expect(result.status).toBe('diverged');
  });

  it('a clock that never advances still ends the wait', async () => {
    const fake = fakeRegistry(
      {
        [tagsAt(MIRROR)]: [tags({ stable: PREVIOUS })],
        [tagsAt(CANONICAL)]: [tags({ stable: PREVIOUS })],
      },
      { frozenClock: true },
    );
    const result = await converge({ ...spec, tags: ['stable'], timeoutMs: 10 * MINUTE_MS }, fake.deps);
    expect(result.polls).toBe(11);
    expect(result.status).toBe('diverged');
  });

  it('a tag missing from a package the registry shows is a mismatch, not agreement', async () => {
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE, latest: RELEASE })],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE })],
    });
    const result = await converge({ ...spec, timeoutMs: 0 }, fake.deps);
    expect(result.status).toBe('diverged');
    expect(result.pairs.find((p) => p.name === CANONICAL && p.tag === 'latest')).toEqual({
      name: CANONICAL,
      tag: 'latest',
      state: 'mismatch',
      seen: null,
      reason: null,
    });
  });

  it('a name that cannot be read is UNKNOWN — never a tag value, never agreement', async () => {
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [new Error('socket hang up')],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE, latest: RELEASE })],
    });
    const result = await converge({ ...spec, timeoutMs: 0 }, fake.deps);
    expect(result.status).toBe('unknown');
    const unreadable = result.pairs.filter((p) => p.name === MIRROR);
    expect(unreadable.map((p) => [p.state, p.seen])).toEqual([
      ['unreadable', null],
      ['unreadable', null],
    ]);
    expect(unreadable[0].reason).toContain('socket hang up');
  });

  it('a concrete mismatch outranks an unreadable name', async () => {
    const fake = fakeRegistry({
      [tagsAt(MIRROR)]: [{ status: 503 }],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE, latest: PREVIOUS })],
    });
    const result = await converge({ ...spec, timeoutMs: 0 }, fake.deps);
    expect(result.status).toBe('diverged');
  });

  it('retries a transport error or 5xx inside one read, and stops at the bound', async () => {
    const recovering = fakeRegistry({
      [tagsAt(CANONICAL)]: [{ status: 503 }, new Error('ECONNRESET'), tags({ stable: RELEASE })],
    });
    expect(await readDistTags(REGISTRY, CANONICAL, recovering.deps)).toEqual({ ok: true, value: { stable: RELEASE } });
    expect(recovering.requests).toHaveLength(3);

    const down = fakeRegistry({ [tagsAt(CANONICAL)]: [{ status: 502 }] });
    const read = await readDistTags(REGISTRY, CANONICAL, down.deps);
    expect(read.ok).toBe(false);
    expect(down.requests).toHaveLength(3);
  });

  it('does not spend retries on a name the registry will not show', async () => {
    const fake = fakeRegistry({ [tagsAt(CANONICAL)]: [{ status: 401, body: 'Unauthorized' }] });
    const read = await readDistTags(REGISTRY, CANONICAL, fake.deps);
    expect(read).toEqual({ ok: false, reason: 'HTTP 401 (the registry does not show this name or version)' });
    expect(fake.requests).toHaveLength(1);
  });

  it('rejects a dist-tags body that is not a map of strings', async () => {
    const fake = fakeRegistry({ [tagsAt(CANONICAL)]: [tags({ stable: RELEASE }), { status: 200, body: { stable: 1044 } }] });
    expect((await readDistTags(REGISTRY, CANONICAL, fake.deps)).ok).toBe(true);
    expect(await readDistTags(REGISTRY, CANONICAL, fake.deps)).toEqual({ ok: false, reason: 'dist-tag "stable" is not a string' });
  });
});

describe('same-build', () => {
  const at = (name: string): string => versionUrl(REGISTRY, name, RELEASE);
  const doc = (fileCount: unknown): Reply => ({ status: 200, body: { name: CANONICAL, version: RELEASE, dist: { fileCount } } });
  const spec = { registry: REGISTRY, version: RELEASE, names: NAMES };

  it('agrees when every name carries the same file count', async () => {
    const fake = fakeRegistry({ [at(MIRROR)]: [doc(59464)], [at(CANONICAL)]: [doc(59464)] });
    expect((await sameBuild(spec, fake.deps)).status).toBe('converged');
  });

  it('fails when the file counts differ', async () => {
    const fake = fakeRegistry({ [at(MIRROR)]: [doc(59464)], [at(CANONICAL)]: [doc(59380)] });
    expect((await sameBuild(spec, fake.deps)).status).toBe('diverged');
  });

  it('an unreadable or missing file count is UNKNOWN, not zero and not agreement', async () => {
    const missing = fakeRegistry({ [at(MIRROR)]: [doc(59464)], [at(CANONICAL)]: [doc(undefined)] });
    expect((await sameBuild(spec, missing.deps)).status).toBe('unknown');
    const absent = fakeRegistry({ [at(MIRROR)]: [doc(59464)], [at(CANONICAL)]: [{ status: 404 }] });
    expect((await sameBuild(spec, absent.deps)).status).toBe('unknown');
  });
});

describe('command line', () => {
  const converged = (): Fake =>
    fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE, latest: RELEASE })],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE, latest: RELEASE })],
    });

  it('exits CONVERGED, DIVERGED and UNKNOWN for the three outcomes', async () => {
    const args = ['converge', '--version', RELEASE, '--names', NAMES.join(','), '--tags', 'stable,latest'];
    expect(await main(args, converged().deps)).toBe(EXIT.CONVERGED);

    const split = fakeRegistry({
      [tagsAt(MIRROR)]: [tags({ stable: RELEASE, latest: RELEASE })],
      [tagsAt(CANONICAL)]: [tags({ stable: RELEASE, latest: PREVIOUS })],
    });
    expect(await main(args, split.deps)).toBe(EXIT.DIVERGED);
    expect(split.errors.join('\n')).toContain(`${CANONICAL} latest=${PREVIOUS} (MISMATCH), expected ${RELEASE}`);

    const dark = fakeRegistry({
      [tagsAt(MIRROR)]: [new Error('ETIMEDOUT')],
      [tagsAt(CANONICAL)]: [new Error('ETIMEDOUT')],
    });
    expect(await main(args, dark.deps)).toBe(EXIT.UNKNOWN);
  });

  it('the workflow positive control (an unpublishable version) exits DIVERGED against real-shaped tags', async () => {
    const args = ['converge', '--version', '0.0.0-lockstep-positive-control', '--names', NAMES.join(','), '--tags', 'stable', '--timeout-seconds', '0'];
    expect(await main(args, converged().deps)).toBe(EXIT.DIVERGED);
  });

  it('refuses an invalid command line before reading anything', async () => {
    const cases: string[][] = [
      ['converge', '--version', RELEASE, '--names', `${MIRROR},`, '--tags', 'stable'],
      ['converge', '--version', '', '--names', CANONICAL, '--tags', 'stable'],
      ['converge', '--version', RELEASE, '--names', CANONICAL, '--tags', 'stable', '--interval-seconds', '0'],
      ['converge', '--version', RELEASE, '--names', CANONICAL, '--tags', 'stable', '--timeout-seconds', '-5'],
      ['converge', '--version', RELEASE, '--names', CANONICAL, '--tags', 'stable', '--bogus', 'x'],
      ['converge', '--version', RELEASE, '--names', CANONICAL],
      ['tag', '--version', RELEASE, '--names', CANONICAL],
    ];
    for (const argv of cases) {
      const fake = converged();
      expect(await main(argv, fake.deps)).toBe(EXIT.USAGE);
      expect(fake.requests).toHaveLength(0);
    }
    expect(parseArgs(['same-build', '--version', RELEASE, '--names', NAMES.join(',')]).tags).toEqual([]);
  });
});

describe('the script as the workflow runs it', () => {
  const scriptPath = join(__dirname, '..', 'npm-dist-tags.mjs');
  let server: Server;
  let registry: string;
  const served: Record<string, Record<string, string>> = {};

  beforeAll(async () => {
    server = createServer((req, res) => {
      const body = req.url === undefined ? undefined : served[req.url];
      res.statusCode = body === undefined ? 404 : 200;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(body ?? 'Not found'));
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('the fake registry has no TCP address');
    }
    registry = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  function run(args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [scriptPath, ...args, '--registry', registry]);
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });
      child.on('error', reject);
      child.on('close', (code) => resolve({ code, stdout, stderr }));
    });
  }

  it('sets the process exit code from real HTTP reads', async () => {
    served['/-/package/@adaptic%2Fbackend-legacy/dist-tags'] = { stable: RELEASE, latest: RELEASE };
    served['/-/package/@adaptic%2Fbackend/dist-tags'] = { stable: RELEASE, latest: PREVIOUS };
    const args = ['converge', '--version', RELEASE, '--names', NAMES.join(','), '--tags', 'stable,latest', '--timeout-seconds', '0'];

    const split = await run(args);
    expect(split.code).toBe(EXIT.DIVERGED);
    expect(split.stderr).toContain(`::error::${CANONICAL} latest=${PREVIOUS} (MISMATCH)`);

    served['/-/package/@adaptic%2Fbackend/dist-tags'] = { stable: RELEASE, latest: RELEASE };
    const healed = await run(args);
    expect(healed.code).toBe(EXIT.CONVERGED);
    expect(healed.stdout).toContain('Lockstep OK');

    const usage = await run(['converge', '--version', RELEASE, '--names', `${MIRROR},`, '--tags', 'stable']);
    expect(usage.code).toBe(EXIT.USAGE);
  });
});
