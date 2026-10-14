/**
 * The publish workflow's dist-tag wiring (.github/workflows/publish.yml).
 *
 * Two kinds of check. Structural ones pin the ordering that decides whether a
 * tag move can land: nothing moves a dist-tag in the publish job, and the
 * `dist-tags` job waits for the release before moving `latest` and asserting.
 * Behavioural ones execute the workflow's own `run:` scripts under `bash -e`
 * (how the runner invokes them) with `node`, `npm` and `git` replaced by
 * recorders, so the shell logic that gates the job — exit-code capture, name
 * lists, tag lists — is tested as written rather than as described.
 */
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parse } from 'yaml';

interface Step {
  id?: string;
  name?: string;
  if?: string;
  run?: string;
  uses?: string;
  env?: Record<string, string>;
}

interface Job {
  needs?: string | string[];
  if?: string;
  'timeout-minutes'?: number;
  env?: Record<string, string>;
  outputs?: Record<string, string>;
  concurrency?: unknown;
  steps: Step[];
}

interface Workflow {
  env?: Record<string, string>;
  concurrency?: { group?: string; 'cancel-in-progress'?: boolean };
  jobs: Record<string, Job>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Narrow the parsed YAML to the fields these checks read, failing loudly on any other shape. */
function asWorkflow(value: unknown): Workflow {
  if (!isRecord(value) || !isRecord(value.jobs)) {
    throw new Error('publish.yml has no jobs map');
  }
  for (const [name, job] of Object.entries(value.jobs)) {
    if (!isRecord(job) || !Array.isArray(job.steps)) {
      throw new Error(`job ${name} has no steps list`);
    }
    for (const step of job.steps) {
      if (!isRecord(step)) {
        throw new Error(`job ${name} has a step that is not a map`);
      }
      if (step.run !== undefined && typeof step.run !== 'string') {
        throw new Error(`job ${name} has a non-string run block`);
      }
    }
  }
  return value as unknown as Workflow;
}

const workflowPath = join(__dirname, '..', '..', '..', '.github', 'workflows', 'publish.yml');
const workflow = asWorkflow(parse(readFileSync(workflowPath, 'utf8')));
const publish = workflow.jobs.publish;
const distTags = workflow.jobs['dist-tags'];

function step(job: Job, id: string): Step {
  const found = job.steps.find((s) => s.id === id);
  if (found === undefined) {
    throw new Error(`no step with id ${id}`);
  }
  return found;
}

function runOf(job: Job, id: string): string {
  const run = step(job, id).run;
  if (run === undefined) {
    throw new Error(`step ${id} has no run block`);
  }
  return run;
}

/** Longest gap measured between `npm publish` returning and the registry showing the release (0.0.1044 on @adaptic/backend). */
const MEASURED_MAX_PROCESSING_LAG_SECONDS = 85 * 60 + 25;

describe('publish.yml dist-tag ordering', () => {
  it('the publish job moves no dist-tag: a move issued before the registry shows the release is not reliably applied', () => {
    const moves = publish.steps.filter((s) => /\bnpm\s+dist-tag\s/.test(s.run ?? ''));
    expect(moves.map((s) => s.name)).toEqual([]);
  });

  it('the dist-tags job reads the registry only through the uncached reader, never `npm view`', () => {
    for (const s of distTags.steps) {
      expect(s.run ?? '').not.toMatch(/npm view/);
    }
    const reads = distTags.steps.filter((s) => (s.run ?? '').includes('npm-dist-tags.mjs'));
    expect(reads.map((s) => s.id)).toEqual(['control', 'materialize', 'assert-lockstep', 'same-build']);
  });

  it('waits for the release, then moves latest, then asserts both tags and the build identity', () => {
    const order = distTags.steps.map((s) => s.id).filter((id): id is string => id !== undefined);
    expect(order).toEqual(['names', 'control', 'materialize', 'promote-latest', 'assert-lockstep', 'same-build']);

    expect(runOf(distTags, 'materialize')).toMatch(/converge[\s\\]+--version "\$NEW_VERSION" --names "\$NAMES" --tags "\$NPM_TAG"/);
    expect(runOf(distTags, 'materialize')).toContain('--timeout-seconds "$MATERIALIZE_TIMEOUT_SECONDS"');
    expect(step(distTags, 'promote-latest').if).toBe("env.BRANCH == 'main'");
    expect(runOf(distTags, 'promote-latest')).toContain('npm dist-tag add "$NAME@$NEW_VERSION" latest');
    expect(runOf(distTags, 'assert-lockstep')).toContain('--tags "$TAGS"');
    expect(runOf(distTags, 'same-build')).toContain('same-build --version "$NEW_VERSION" --names "$NAMES"');
  });

  it('runs after the publish job, even when its branch push failed, and only for a completed publish', () => {
    expect(distTags.needs).toBe('publish');
    expect(distTags.if).toContain('!cancelled()');
    expect(distTags.if).toContain("needs.publish.outputs.published == 'true'");
    expect(publish.outputs).toEqual({
      published: '${{ steps.publish.outputs.published }}',
      package_name: '${{ steps.package_info.outputs.package_name }}',
      new_version: '${{ steps.bump_version.outputs.new_version }}',
      npm_tag: '${{ steps.channel.outputs.npm_tag }}',
      branch: '${{ steps.channel.outputs.branch }}',
    });
    expect(runOf(publish, 'bump_version')).toContain('echo "new_version=$NEW_VERSION" >> "$GITHUB_OUTPUT"');
    expect(runOf(publish, 'package_info')).toContain('echo "package_name=$PACKAGE_NAME" >> "$GITHUB_OUTPUT"');
  });

  it('sizes the waits to the measured registry processing lag and fits them inside the job timeout', () => {
    const env = distTags.env ?? {};
    const materialize = Number(env.MATERIALIZE_TIMEOUT_SECONDS);
    const promote = Number(env.PROMOTE_TIMEOUT_SECONDS);
    expect(materialize).toBeGreaterThan(MEASURED_MAX_PROCESSING_LAG_SECONDS);
    expect(promote).toBeGreaterThan(0);
    expect((distTags['timeout-minutes'] ?? 0) * 60).toBeGreaterThan(materialize + promote);
  });

  it('serializes whole runs, tag convergence included, so two releases are never in the registry queue at once', () => {
    expect(workflow.concurrency?.['cancel-in-progress']).toBe(false);
    expect(publish.concurrency).toBeUndefined();
    expect(distTags.concurrency).toBeUndefined();
  });

  it('declares the mirror once, at workflow level, so retiring it is still a one-line change', () => {
    expect(workflow.env?.MIRROR_NAME).toBe('@adaptic/backend-legacy');
    expect(publish.env?.MIRROR_NAME).toBeUndefined();
    expect(distTags.env?.MIRROR_NAME).toBeUndefined();
  });

  it('the positive-control version is one this pipeline can never publish', () => {
    const control = distTags.env?.CONTROL_VERSION ?? '';
    expect(control).not.toBe('');
    expect(control).not.toMatch(/^0\.0\.\d+$/);
    expect(control).not.toMatch(/^0\.0\.\d+-alignment\.\d+$/);
  });
});

/**
 * Execute one `run:` block the way the runner does (`bash -e <file>`), with
 * `node`, `npm` and `git` on PATH replaced by stubs that append their argv to
 * a log and exit with a scripted code.
 */
function execute(
  run: string,
  env: Record<string, string>,
  stubs: { nodeExit?: number; npm?: string } = {},
  cwd?: string,
): { status: number | null; calls: string[]; githubEnv: string; githubOutput: string; stderr: string } {
  const dir = mkdtempSync(join(tmpdir(), 'publish-wf-'));
  try {
    const bin = join(dir, 'bin');
    mkdirSync(bin);
    const callLog = join(dir, 'calls.log');
    const githubEnv = join(dir, 'github_env');
    const githubOutput = join(dir, 'github_output');
    writeFileSync(callLog, '');
    writeFileSync(githubEnv, '');
    writeFileSync(githubOutput, '');
    const stub = (name: string, body: string): void => {
      const file = join(bin, name);
      writeFileSync(file, `#!/bin/bash\necho "${name} $*" >> "${callLog}"\n${body}\n`);
      chmodSync(file, 0o755);
    };
    stub('node', `exit ${stubs.nodeExit ?? 0}`);
    stub('npm', stubs.npm ?? 'exit 0');
    stub('git', 'exit 0');
    const script = join(dir, 'step.sh');
    writeFileSync(script, run);
    const result = spawnSync('bash', ['-e', script], {
      cwd: cwd ?? dir,
      env: { PATH: `${bin}:${process.env.PATH ?? ''}`, GITHUB_ENV: githubEnv, GITHUB_OUTPUT: githubOutput, ...env },
      encoding: 'utf8',
    });
    return {
      status: result.status,
      calls: readFileSync(callLog, 'utf8').split('\n').filter((l) => l !== ''),
      githubEnv: readFileSync(githubEnv, 'utf8'),
      githubOutput: readFileSync(githubOutput, 'utf8'),
      stderr: result.stderr,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const NAMES = '@adaptic/backend-legacy,@adaptic/backend';
const jobEnv = {
  NEW_VERSION: '0.0.1045',
  NAMES,
  NPM_TAG: 'stable',
  BRANCH: 'main',
  CONTROL_VERSION: '0.0.0-lockstep-positive-control',
  MATERIALIZE_TIMEOUT_SECONDS: '9000',
  PROMOTE_TIMEOUT_SECONDS: '1800',
  POLL_INTERVAL_SECONDS: '60',
};

describe('publish.yml run scripts, executed', () => {
  it('positive control passes only when the check reports DIVERGED (exit 1)', () => {
    const run = runOf(distTags, 'control');
    expect(execute(run, jobEnv, { nodeExit: 1 }).status).toBe(0);
    for (const code of [0, 2, 64]) {
      const result = execute(run, jobEnv, { nodeExit: code });
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(`returned ${code} for a known divergence`);
    }
    expect(execute(run, jobEnv, { nodeExit: 1 }).calls).toEqual([
      `node scripts/ci/npm-dist-tags.mjs converge --version 0.0.0-lockstep-positive-control --names ${NAMES} --tags stable --timeout-seconds 0`,
    ]);
  });

  it('resolves the name list mirror-first, and to the canonical name alone once the mirror is retired', () => {
    const run = runOf(distTags, 'names');
    expect(execute(run, { PACKAGE_NAME: '@adaptic/backend', MIRROR_NAME: '@adaptic/backend-legacy' }).githubEnv).toBe(`NAMES=${NAMES}\n`);
    expect(execute(run, { PACKAGE_NAME: '@adaptic/backend', MIRROR_NAME: '' }).githubEnv).toBe('NAMES=@adaptic/backend\n');
  });

  it('a failed materialization wait fails the step', () => {
    expect(execute(runOf(distTags, 'materialize'), jobEnv, { nodeExit: 1 }).status).not.toBe(0);
    expect(execute(runOf(distTags, 'materialize'), jobEnv, { nodeExit: 2 }).status).not.toBe(0);
    expect(execute(runOf(distTags, 'materialize'), jobEnv, { nodeExit: 0 }).calls).toEqual([
      `node scripts/ci/npm-dist-tags.mjs converge --version 0.0.1045 --names ${NAMES} --tags stable --timeout-seconds 9000 --interval-seconds 60`,
    ]);
  });

  it('moves latest on every published name, mirror first, and stops on a failed move', () => {
    const run = runOf(distTags, 'promote-latest');
    expect(execute(run, jobEnv).calls).toEqual([
      'npm dist-tag add @adaptic/backend-legacy@0.0.1045 latest',
      'npm dist-tag add @adaptic/backend@0.0.1045 latest',
    ]);
    const failing = execute(run, jobEnv, { npm: 'exit 1' });
    expect(failing.status).not.toBe(0);
    expect(failing.calls).toHaveLength(1);
  });

  it('asserts stable AND latest on the production branch, and only the channel tag elsewhere', () => {
    const run = runOf(distTags, 'assert-lockstep');
    expect(execute(run, jobEnv).calls).toEqual([
      `node scripts/ci/npm-dist-tags.mjs converge --version 0.0.1045 --names ${NAMES} --tags stable,latest --timeout-seconds 1800 --interval-seconds 60`,
    ]);
    expect(execute(run, { ...jobEnv, BRANCH: 'platform-alignment', NPM_TAG: 'alignment' }).calls).toEqual([
      `node scripts/ci/npm-dist-tags.mjs converge --version 0.0.1045 --names ${NAMES} --tags alignment --timeout-seconds 1800 --interval-seconds 60`,
    ]);
    expect(execute(run, jobEnv, { nodeExit: 1 }).status).not.toBe(0);
  });

  it('the publish step reports published=true only after every name was published', () => {
    const run = runOf(publish, 'publish');
    const dir = mkdtempSync(join(tmpdir(), 'publish-dist-'));
    try {
      const dist = join(dir, 'dist');
      mkdirSync(dist);
      const manifest = JSON.stringify({ name: '@adaptic/backend', version: '0.0.1045' });
      const env = { PACKAGE_NAME: '@adaptic/backend', MIRROR_NAME: '@adaptic/backend-legacy', NEW_VERSION: '0.0.1045', NPM_TAG: 'stable' };
      // `npm view` finds nothing (not yet published); `npm publish` succeeds
      // unless the manifest names FAIL_NAME.
      const npm = [
        'case "$1" in',
        '  view) exit 0 ;;',
        '  publish) if [ "$(jq -r .name package.json)" = "${FAIL_NAME:-}" ]; then exit 1; fi; exit 0 ;;',
        '  *) exit 0 ;;',
        'esac',
      ].join('\n');

      writeFileSync(join(dist, 'package.json'), manifest);
      const ok = execute(run, env, { npm }, dist);
      expect(ok.status).toBe(0);
      expect(ok.githubOutput).toBe('published=true\n');
      expect(ok.calls.filter((c) => c.startsWith('npm publish'))).toHaveLength(2);

      writeFileSync(join(dist, 'package.json'), manifest);
      const half = execute(run, { ...env, FAIL_NAME: '@adaptic/backend' }, { npm }, dist);
      expect(half.status).not.toBe(0);
      expect(half.githubOutput).toBe('');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
