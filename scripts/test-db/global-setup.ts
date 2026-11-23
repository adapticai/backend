/**
 * Vitest global setup: a throwaway Postgres for the suites that measure the
 * served schema against a real database.
 *
 * Those suites (the access, desk, lane, health and restatement harnesses) used
 * to run only when someone exported a database URL by hand, and skipped
 * otherwise. A skipped suite reads as a pass, so a guard they alone prove
 * could be deleted with every gate green. This setup removes the condition:
 * every run (`npm test`, `npm run test:coverage`, a bare `npx vitest run`)
 * provisions a fresh cluster, migrates it, and hands each suite its own
 * database, and the suites fail rather than skip when theirs is missing.
 *
 * - Binaries: `initdb` / `pg_ctl` from PATH, Homebrew, or the Debian layout
 *   GitHub's Ubuntu runners ship (`/usr/lib/postgresql/<v>/bin`); failing
 *   those, a `postgres` container through docker. None of them is an error,
 *   never a skip.
 * - Databases: one template migrated to the head of `prisma/migrations`, and
 *   one migrated to the migration before `PRE_CUTOFF_MIGRATION` (built from a
 *   copy of `prisma/`, never by moving files in the tree). Each suite gets its
 *   own `CREATE DATABASE … TEMPLATE` copy, so no suite sees another's rows.
 * - A variable already set in the environment is left alone: a run pointed at
 *   a database of its own keeps it.
 *
 * The cluster is stopped and its directory removed on teardown.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/** The migration the pre-migration fixture stops before. */
export const PRE_CUTOFF_MIGRATION = '20261123090000_allocator_identity_roles';

const ROOT = resolve(__dirname, '..', '..');
const SUPERUSER = 'postgres';
const DOCKER_IMAGE = 'postgres:16';
const READY_TIMEOUT_MS = 60_000;
const READY_POLL_MS = 500;

/** Which database each suite's variable points at, and which template it copies. */
const DATABASES: ReadonlyArray<{
  env: string;
  db: string;
  template: 'head' | 'pre';
}> = [
  { env: 'ACCESS_IT_DATABASE_URL', db: 'access_it', template: 'head' },
  { env: 'ACCESS_PRE_DATABASE_URL', db: 'access_pre', template: 'pre' },
  { env: 'DESK_IT_DATABASE_URL', db: 'desk_it', template: 'head' },
  { env: 'LANE_IT_DATABASE_URL', db: 'lane_it', template: 'head' },
  { env: 'HEALTH_IT_DATABASE_URL', db: 'health_it', template: 'head' },
  {
    env: 'RESTATEMENT_TEST_DATABASE_URL',
    db: 'restatement_it',
    template: 'head',
  },
];

interface Cluster {
  readonly port: number;
  stop(): void;
}

function log(message: string): void {
  process.stdout.write(`[test-db] ${message}\n`);
}

/** The directory holding `initdb` and `pg_ctl`, or `null` when none is installed. */
function findPostgresBin(): string | null {
  const which = spawnSync('sh', ['-c', 'command -v initdb'], {
    encoding: 'utf8',
  });
  const onPath = which.status === 0 ? which.stdout.trim() : '';
  if (onPath) return resolve(onPath, '..');
  const candidates: string[] = [];
  for (const base of ['/opt/homebrew/opt', '/usr/local/opt']) {
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base)
      .filter((n) => n.startsWith('postgresql'))
      .sort()
      .reverse()) {
      candidates.push(join(base, name, 'bin'));
    }
  }
  if (existsSync('/usr/lib/postgresql')) {
    for (const version of readdirSync('/usr/lib/postgresql').sort(
      (a, b) => Number(b) - Number(a)
    )) {
      candidates.push(join('/usr/lib/postgresql', version, 'bin'));
    }
  }
  return (
    candidates.find(
      (dir) =>
        existsSync(join(dir, 'initdb')) && existsSync(join(dir, 'pg_ctl'))
    ) ?? null
  );
}

function freePort(): Promise<number> {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      server.close(() => {
        if (address && typeof address === 'object') resolvePort(address.port);
        else reject(new Error('no port was assigned'));
      });
    });
  });
}

function startLocalCluster(bin: string, port: number): Cluster {
  const dir = mkdtempSync(join(tmpdir(), 'backend-test-db-'));
  const data = join(dir, 'data');
  execFileSync(
    join(bin, 'initdb'),
    ['-D', data, '-U', SUPERUSER, '--auth=trust', '-E', 'UTF8', '--no-locale'],
    {
      stdio: 'pipe',
    }
  );
  execFileSync(
    join(bin, 'pg_ctl'),
    [
      '-D',
      data,
      '-l',
      join(dir, 'postgres.log'),
      '-o',
      `-p ${port} -k ${dir} -c listen_addresses=127.0.0.1 -c fsync=off -c synchronous_commit=off -c max_connections=300`,
      '-w',
      'start',
    ],
    { stdio: 'pipe' }
  );
  runSql = (statement: string): void => {
    execFileSync(
      join(bin, 'psql'),
      ['-h', '127.0.0.1', '-p', String(port), '-U', SUPERUSER, '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-c', statement],
      { stdio: 'pipe' }
    );
  };
  log(`cluster ${data} on 127.0.0.1:${port} (${bin})`);
  return {
    port,
    stop: () => {
      spawnSync(join(bin, 'pg_ctl'), ['-D', data, '-m', 'immediate', 'stop'], {
        stdio: 'pipe',
      });
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

function startDockerCluster(port: number): Cluster {
  const name = `backend-test-db-${process.pid}-${port}`;
  execFileSync(
    'docker',
    [
      'run',
      '-d',
      '--rm',
      '--name',
      name,
      '-p',
      `127.0.0.1:${port}:5432`,
      '-e',
      'POSTGRES_HOST_AUTH_METHOD=trust',
      DOCKER_IMAGE,
    ],
    { stdio: 'pipe' }
  );
  runSql = (statement: string): void => {
    execFileSync('docker', ['exec', name, 'psql', '-U', SUPERUSER, '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-c', statement], {
      stdio: 'pipe',
    });
  };
  log(`container ${name} (${DOCKER_IMAGE}) on 127.0.0.1:${port}`);
  return {
    port,
    stop: () => void spawnSync('docker', ['rm', '-f', name], { stdio: 'pipe' }),
  };
}

function urlFor(port: number, db: string): string {
  return `postgresql://${SUPERUSER}@127.0.0.1:${port}/${db}`;
}

/**
 * Runs one statement as the superuser, outside any transaction (CREATE
 * DATABASE needs that); set by whichever cluster started.
 */
let runSql: ((statement: string) => void) | null = null;

function sql(port: number, statement: string): void {
  if (!runSql) throw new Error(`no test database is running on port ${port}`);
  runSql(statement);
}

async function waitReady(port: number): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  let last: unknown;
  while (Date.now() < deadline) {
    try {
      sql(port, 'SELECT 1');
      return;
    } catch (error: unknown) {
      last = error;
      await new Promise((r) => setTimeout(r, READY_POLL_MS));
    }
  }
  throw new Error(
    `test database on port ${port} never became ready: ${String(last)}`
  );
}

function migrate(port: number, db: string, schemaPath: string): void {
  const url = urlFor(port, db);
  execFileSync('npx', ['prisma', 'migrate', 'deploy', '--schema', schemaPath], {
    cwd: ROOT,
    stdio: 'pipe',
    env: {
      ...process.env,
      DATABASE_URL: url,
      DIRECT_DATABASE_URL: url,
      SKIP_PRISMA_VERSION_CHECK: 'true',
    },
  });
}

/** A copy of `prisma/` holding only the migrations before {@link PRE_CUTOFF_MIGRATION}. */
function preMigrationSchema(): { schema: string; cleanup: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'backend-test-db-pre-'));
  const migrations = join(ROOT, 'prisma', 'migrations');
  cpSync(join(ROOT, 'prisma', 'schema.prisma'), join(dir, 'schema.prisma'));
  for (const entry of readdirSync(migrations)) {
    if (entry === 'migration_lock.toml' || entry < PRE_CUTOFF_MIGRATION) {
      cpSync(join(migrations, entry), join(dir, 'migrations', entry), {
        recursive: true,
      });
    }
  }
  if (!existsSync(join(migrations, PRE_CUTOFF_MIGRATION))) {
    throw new Error(
      `${PRE_CUTOFF_MIGRATION} is not in prisma/migrations; update PRE_CUTOFF_MIGRATION`
    );
  }
  return {
    schema: join(dir, 'schema.prisma'),
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
}

export default async function setup(): Promise<() => void> {
  const missing = DATABASES.filter(({ env }) => !process.env[env]);
  if (missing.length === 0) {
    log('every suite database is set in the environment; provisioning nothing');
    return () => undefined;
  }
  const port = await freePort();
  const bin = findPostgresBin();
  let cluster: Cluster;
  if (bin) {
    cluster = startLocalCluster(bin, port);
  } else if (spawnSync('docker', ['info'], { stdio: 'pipe' }).status === 0) {
    cluster = startDockerCluster(port);
  } else {
    throw new Error(
      'No Postgres for the database suites: install PostgreSQL (initdb and pg_ctl on PATH, Homebrew, or /usr/lib/postgresql) or start docker. These suites fail rather than skip.'
    );
  }
  try {
    await waitReady(port);
    const started = Date.now();
    sql(port, 'CREATE DATABASE tpl_head');
    migrate(port, 'tpl_head', join(ROOT, 'prisma', 'schema.prisma'));
    if (missing.some(({ template }) => template === 'pre')) {
      const pre = preMigrationSchema();
      try {
        sql(port, 'CREATE DATABASE tpl_pre');
        migrate(port, 'tpl_pre', pre.schema);
      } finally {
        pre.cleanup();
      }
    }
    for (const { env, db, template } of missing) {
      sql(port, `CREATE DATABASE ${db} TEMPLATE tpl_${template}`);
      process.env[env] = urlFor(port, db);
    }
    log(
      `migrated and copied ${missing.length} databases in ${Math.round((Date.now() - started) / 1000)}s`
    );
  } catch (error: unknown) {
    cluster.stop();
    throw error;
  }
  return () => cluster.stop();
}
