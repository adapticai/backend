/**
 * The package-contents check (scripts/ci/package-contents.mjs): every relative
 * import reachable from a manifest entry must resolve to a file in the pack list.
 *
 * Three layers. Resolution and traversal rules are exercised directly against
 * in-memory packages. The repo's real `package-npm.json` `files` list is then
 * run through the real `npm pack --dry-run` against a fixture laid out the way
 * `prepare-package.mjs` lays out `dist/`, which is what fails when a directory
 * the CommonJS entry needs (`auth/`) falls out of `files`. Last, the exit codes
 * are pinned: an unreadable package is UNKNOWN (2), never a pass.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import ts from 'typescript';
import { parse } from 'yaml';
import {
  EXIT,
  UnreadableError,
  candidatesFor,
  checkPackage,
  directoriesToShip,
  entryPoints,
  kindOf,
  main,
  processDeps,
  wildcardPattern,
} from '../package-contents.mjs';

const PACK_TIMEOUT_MS = 120_000;

const preProcess = (text: string): { importedFiles: Array<{ fileName: string }> } => ts.preProcessFile(text, true, true);

interface Memory {
  files: Record<string, string>;
  packed: string[];
}

function inMemory(files: Record<string, string>, packed: string[] = Object.keys(files)): Memory {
  return { files, packed };
}

function runCheck(memory: Memory, manifest: Record<string, unknown>) {
  return checkPackage({
    manifest,
    packList: memory.packed,
    readText: (path: string) => {
      const text = memory.files[path];
      if (text === undefined) {
        throw new Error(`no such file ${path}`);
      }
      return text;
    },
    existsOnDisk: (path: string) => path in memory.files,
    preProcess,
  });
}

const CJS_MANIFEST = { type: 'module', main: 'index.cjs' };

describe('candidatesFor: the loader of the importing file decides what is tried', () => {
  it('CommonJS tries the exact path, then the extensions Node appends, then a directory index', () => {
    expect(candidatesFor('resolvers/custom/a.cjs', '../../auth/totp.cjs', 'cjs')).toEqual([
      'auth/totp.cjs',
      'auth/totp.cjs.js',
      'auth/totp.cjs.json',
      'auth/totp.cjs.node',
      'auth/totp.cjs/index.js',
      'auth/totp.cjs/index.json',
      'auth/totp.cjs/index.node',
    ]);
  });

  it('an ES module specifier is never extension-searched', () => {
    expect(candidatesFor('esm/a.mjs', './b', 'esm')).toEqual(['esm/b']);
  });

  it('a declaration import tries the declaration file for the specifier, then a directory index', () => {
    expect(candidatesFor('resolvers/a.d.ts', './b.js', 'types')).toEqual([
      'resolvers/b.d.ts',
      'resolvers/b.js.d.ts',
      'resolvers/b.js.d.mts',
      'resolvers/b.js.d.cts',
      'resolvers/b.js/index.d.ts',
    ]);
    expect(candidatesFor('a.d.ts', './b', 'types')).toEqual(['b.d.ts', 'b.d.mts', 'b.d.cts', 'b/index.d.ts']);
    expect(candidatesFor('a.d.ts', './data.json', 'types')).toEqual(['data.json']);
  });

  it('a specifier that leaves the package has no candidates', () => {
    expect(candidatesFor('health.cjs', '../package.json', 'cjs')).toEqual([]);
  });

  it('classifies a file by the loader that reads it', () => {
    expect(kindOf('a.cjs', true)).toBe('cjs');
    expect(kindOf('esm/a.mjs', false)).toBe('esm');
    expect(kindOf('a.d.ts', true)).toBe('types');
    expect(kindOf('a.d.mts', true)).toBe('types');
    expect(kindOf('a.js', true)).toBe('esm');
    expect(kindOf('a.js', false)).toBe('cjs');
    expect(kindOf('data.json', true)).toBe('leaf');
  });
});

describe('entryPoints: every file a consumer can load by the package name', () => {
  const manifest = {
    main: 'index.cjs',
    module: 'esm/index.mjs',
    types: 'index.d.ts',
    exports: {
      '.': { import: './esm/index.mjs', require: './index.cjs', types: './index.d.ts' },
      './*': { import: './esm/*.mjs', require: './*.cjs', types: './*.d.ts' },
    },
  };

  it('names main, module, types and the concrete exports targets, even when they are not packed', () => {
    const entries = entryPoints(manifest, []);
    expect(entries.map((entry) => [entry.path, entry.wildcard]).sort()).toEqual([
      ['esm/index.mjs', false],
      ['index.cjs', false],
      ['index.d.ts', false],
    ]);
  });

  it('adds every packed file a wildcard exports target matches, at any depth, and nothing else', () => {
    const packList = [
      'package.json',
      'README.md',
      'index.cjs',
      'getToken.cjs',
      'auth/totp.cjs',
      'auth/totp.d.ts',
      'esm/index.mjs',
      'esm/getToken.mjs',
      'esm/auth/totp.mjs',
      'generated/typeStrings/index.d.ts',
    ];
    const wildcard = entryPoints(manifest, packList)
      .filter((entry) => entry.wildcard)
      .map((entry) => [entry.path, entry.field])
      .sort();
    expect(wildcard).toEqual([
      ['auth/totp.cjs', 'exports../*.require'],
      ['auth/totp.d.ts', 'exports../*.types'],
      ['esm/auth/totp.mjs', 'exports../*.import'],
      ['esm/getToken.mjs', 'exports../*.import'],
      ['generated/typeStrings/index.d.ts', 'exports../*.types'],
      ['getToken.cjs', 'exports../*.require'],
    ]);
  });

  it('declares nothing for a subpath closed with null', () => {
    expect(entryPoints({ exports: { '.': './index.cjs', './internal/*': null } }, ['index.cjs', 'internal/a.cjs']).map((entry) => entry.path)).toEqual(['index.cjs']);
  });

  it('a wildcard target matches literally around its single star', () => {
    const pattern = wildcardPattern('./*.cjs');
    expect(pattern.test('resolvers/custom/index.cjs')).toBe(true);
    expect(pattern.test('index.mjs')).toBe(false);
    expect(pattern.test('indexXcjs')).toBe(false);
    expect(wildcardPattern('./esm/*.mjs').test('index.mjs')).toBe(false);
    expect(wildcardPattern('./esm/*.mjs').test('esm/resolvers/custom/index.mjs')).toBe(true);
  });
});

describe('checkPackage: reachability from the entries against the pack list', () => {
  it('reports nothing for a package whose every import is packed', () => {
    const memory = inMemory({
      'index.cjs': 'require("./a.cjs");',
      'a.cjs': 'require("./sub/b.cjs"); require("node:fs"); require("@prisma/client");',
      'sub/b.cjs': 'module.exports = 1;',
    });
    const report = runCheck(memory, CJS_MANIFEST);
    expect(report.unresolved).toEqual([]);
    expect(report.reached).toBe(3);
  });

  it('names an import whose target exists in the build output but is not packed, with the chain that reaches it', () => {
    const memory = inMemory(
      {
        'index.cjs': 'require("./resolvers/custom/index.cjs");',
        'resolvers/custom/index.cjs': 'require("./UserTotpResolver.cjs");',
        'resolvers/custom/UserTotpResolver.cjs': 'const totp = require("../../auth/totp.cjs");',
        'auth/totp.cjs': 'module.exports = {};',
      },
      ['index.cjs', 'resolvers/custom/index.cjs', 'resolvers/custom/UserTotpResolver.cjs'],
    );
    const report = runCheck(memory, CJS_MANIFEST);
    expect(report.unresolved).toEqual([
      {
        from: 'resolvers/custom/UserTotpResolver.cjs',
        spec: '../../auth/totp.cjs',
        target: 'auth/totp.cjs',
        reason: 'excluded',
        chain: ['index.cjs', 'resolvers/custom/index.cjs', 'resolvers/custom/UserTotpResolver.cjs'],
      },
    ]);
    expect(directoriesToShip(report.unresolved)).toEqual(['auth/']);
  });

  it('tells a file the packer left out apart from a file the build never emitted', () => {
    const memory = inMemory({ 'index.cjs': 'require("./never-emitted.cjs");' });
    const report = runCheck(memory, CJS_MANIFEST);
    expect(report.unresolved.map((item) => [item.target, item.reason])).toEqual([['never-emitted.cjs', 'not-emitted']]);
    expect(directoriesToShip(report.unresolved)).toEqual([]);
  });

  it('reports a directory specifier rewritten to a file that does not exist as not emitted', () => {
    const memory = inMemory({
      'generated/index.cjs': 'require("./enums.cjs");',
      'generated/enums/index.cjs': 'module.exports = {};',
    });
    const report = runCheck(memory, { type: 'module', main: 'generated/index.cjs' });
    expect(report.unresolved.map((item) => [item.target, item.reason])).toEqual([['generated/enums.cjs', 'not-emitted']]);
  });

  it('reports a specifier that climbs above the package root as outside the package, never as packed or emitted', () => {
    const memory = inMemory({ 'package.json': '{}', 'health.cjs': 'const pkg = require("../package.json");' });
    const report = runCheck(memory, { type: 'module', main: 'health.cjs' });
    expect(report.unresolved.map((item) => [item.target, item.reason])).toEqual([['../package.json', 'outside-package']]);
    expect(directoriesToShip(report.unresolved)).toEqual([]);
  });

  it('suggests a root-level excluded file by name and a nested one by its top-level directory', () => {
    const memory = inMemory(
      { 'index.cjs': 'require("./health.cjs"); require("./config/jwtConfig.cjs");', 'health.cjs': '', 'config/jwtConfig.cjs': '' },
      ['index.cjs'],
    );
    expect(directoriesToShip(runCheck(memory, CJS_MANIFEST).unresolved)).toEqual(['config/', 'health.cjs']);
  });

  it('follows ES module imports and demands the exact file, since ES specifiers are not extension-searched', () => {
    const manifest = { type: 'module', module: 'esm/index.mjs' };
    const memory = inMemory({
      'esm/index.mjs': 'import "./a"; export * from "./b.mjs"; const c = await import("./c.mjs");',
      'esm/a.mjs': '',
      'esm/b.mjs': '',
    });
    const report = runCheck(memory, manifest);
    expect(report.unresolved.map((item) => item.target).sort()).toEqual(['esm/a', 'esm/c.mjs']);
  });

  it('follows declaration files from the types entry, including type-only imports that emit no runtime require', () => {
    const manifest = { type: 'module', types: 'index.d.ts' };
    const files = {
      'index.d.ts': 'export * from "./resolvers/custom/index";',
      'resolvers/custom/index.d.ts': 'export * from "./Totp.js";',
      'resolvers/custom/Totp.d.ts': 'import type { Principal } from "../../auth/token-verifier";',
      'auth/token-verifier.d.ts': 'export interface Principal {}',
    };
    const without = runCheck(inMemory(files, ['index.d.ts', 'resolvers/custom/index.d.ts', 'resolvers/custom/Totp.d.ts']), manifest);
    expect(without.unresolved.map((item) => item.target)).toEqual(['auth/token-verifier.d.ts']);
    const withAuth = runCheck(inMemory(files), manifest);
    expect(withAuth.unresolved).toEqual([]);
  });

  it('does not read an import out of a comment or a string', () => {
    const memory = inMemory({
      'index.cjs': [
        '// const x = require("./commented-out.cjs");',
        '/* import y from "./block-comment.cjs"; */',
        'const text = "require(\'./in-a-string.cjs\')";',
        'module.exports = text;',
      ].join('\n'),
    });
    expect(runCheck(memory, CJS_MANIFEST).unresolved).toEqual([]);
  });

  it('does not report a broken file that no entry reaches', () => {
    const memory = inMemory({
      'index.cjs': 'module.exports = 1;',
      'server.cjs': 'require("./middleware/auth.cjs");',
    });
    expect(runCheck(memory, CJS_MANIFEST).unresolved).toEqual([]);
  });

  it('reports a broken file that only a wildcard export reaches: a subpath is an entry too', () => {
    const memory = inMemory(
      {
        'index.cjs': 'module.exports = 1;',
        'getToken.cjs': 'require("./config/jwtConfig.cjs");',
        'config/jwtConfig.cjs': '',
      },
      ['index.cjs', 'getToken.cjs'],
    );
    const manifest = { ...CJS_MANIFEST, exports: { '.': './index.cjs', './*': './*.cjs' } };
    const report = runCheck(memory, manifest);
    expect(report.unresolved.map((item) => [item.from, item.target, item.reason, item.chain])).toEqual([
      ['getToken.cjs', 'config/jwtConfig.cjs', 'excluded', ['getToken.cjs']],
    ]);
  });

  it('reports an entry that is itself not packed', () => {
    const memory = inMemory({ 'index.cjs': '' }, []);
    expect(runCheck(memory, CJS_MANIFEST).missingEntries.map((entry) => entry.path)).toEqual(['index.cjs']);
  });
});

/** Writes `files` under `root`, creating directories as needed. */
function writeTree(root: string, files: Record<string, string>): void {
  for (const [path, text] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, text);
  }
}

/**
 * The manifest prepare-package.mjs writes into dist: package-npm.json as it is
 * in the repository (its real `files` list and entries), made an ES module
 * package and given the `exports` map step 2 of prepare-package.mjs sets.
 */
function realManifest(): Record<string, unknown> {
  const source: Record<string, unknown> = JSON.parse(readFileSync(join(__dirname, '..', '..', '..', 'package-npm.json'), 'utf8'));
  return {
    ...source,
    version: '0.0.0-fixture',
    type: 'module',
    exports: {
      '.': { import: './esm/index.mjs', require: './index.cjs', types: './index.d.ts' },
      './*': { import: './esm/*.mjs', require: './*.cjs', types: './*.d.ts' },
    },
  };
}

/**
 * The dist layout prepare-package.mjs produces, reduced to one file per import
 * edge that has to hold. The CommonJS entry reaches auth/ through the custom
 * resolvers and readers/ directly; the getToken and prismaClient subpaths reach
 * config/ and middleware/; a directory specifier in the generated tree is
 * rewritten to its index. The server bootstrap (server.cjs, health.cjs,
 * config/tracing.cjs) and a test harness are in the build output with imports
 * that cannot resolve from an installed copy: they are what `files` keeps out.
 */
const DIST_LAYOUT: Record<string, string> = {
  'index.cjs': 'require("./resolvers/custom/index.cjs"); require("./readers/index.cjs");',
  'resolvers/custom/index.cjs': 'require("./UserTotpResolver.cjs");',
  'resolvers/custom/UserTotpResolver.cjs': 'require("../../auth/totp.cjs"); require("../../utils/logger.cjs");',
  'readers/index.cjs': 'require("./intraday-lane-prefs.cjs");',
  'readers/intraday-lane-prefs.cjs': '',
  'utils/logger.cjs': 'module.exports = {};',
  'auth/totp.cjs': 'module.exports = {};',
  'getToken.cjs': 'require("./config/jwtConfig.cjs");',
  'config/jwtConfig.cjs': 'require("../utils/logger.cjs");',
  'prismaClient.cjs': 'require("./middleware/audit-log-write-redaction.cjs");',
  'middleware/audit-log-write-redaction.cjs': 'require("../auth/totp.cjs");',
  'generated/typegraphql-prisma/index.cjs': 'require("./enums/index.cjs");',
  'generated/typegraphql-prisma/enums/index.cjs': '',
  'server.cjs': 'require("./health.cjs"); require("./config/tracing.cjs"); require("./plugins/http-status-mapper.cjs");',
  'health.cjs': 'try { require("../package.json"); } catch {}',
  'config/tracing.cjs': 'try { require("../../package.json"); } catch {}',
  'plugins/http-status-mapper.cjs': '',
  'esm/index.mjs': 'import "./resolvers/custom/index.mjs"; import "./readers/index.mjs";',
  'esm/resolvers/custom/index.mjs': 'import "./UserTotpResolver.mjs";',
  'esm/resolvers/custom/UserTotpResolver.mjs': 'import "../../auth/totp.mjs"; import "../../utils/logger.mjs";',
  'esm/readers/index.mjs': '',
  'esm/utils/logger.mjs': '',
  'esm/auth/totp.mjs': '',
  'esm/middleware/__tests__/audit-log-write-redaction.harness.mjs': 'import "../../prismaClient";',
  'index.d.ts': 'export * from "./resolvers/custom/index"; export * from "./readers/index";',
  'resolvers/custom/index.d.ts': 'export * from "./UserTotpResolver";',
  'resolvers/custom/UserTotpResolver.d.ts': 'import type { BackendPrincipal } from "../../auth/token-verifier";',
  'readers/index.d.ts': 'export {};',
  'auth/token-verifier.d.ts': 'export interface BackendPrincipal {}',
};

interface Run {
  code: number;
  lines: string[];
}

async function checkDirectory(root: string): Promise<Run> {
  const lines: string[] = [];
  const code = await main(['--root', root], { ...processDeps, out: (line: string) => lines.push(line) });
  return { code, lines };
}

describe('the real npm pack against the repo\'s package-npm.json files list', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'package-contents-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  /** Packs the layout under the real manifest with `files` edited by `edit`, and checks it. */
  async function checkWithFiles(edit: (files: string[]) => string[]): Promise<{ code: number; output: string }> {
    const manifest = realManifest();
    manifest.files = edit(manifest.files as string[]);
    writeTree(root, { ...DIST_LAYOUT, 'package.json': JSON.stringify(manifest) });
    const run = await checkDirectory(root);
    return { code: run.code, output: run.lines.join('\n') };
  }

  it('is complete for the layout prepare-package.mjs produces: every entry and subpath loads what it imports', async () => {
    const { code, output } = await checkWithFiles((files) => files);
    expect(output).toContain('COMPLETE');
    expect(code).toBe(EXIT.COMPLETE);
  }, PACK_TIMEOUT_MS);

  it.each([
    ['auth/', "MISSING auth/totp.cjs: required as '../../auth/totp.cjs' by resolvers/custom/UserTotpResolver.cjs", 'index.cjs -> resolvers/custom/index.cjs -> resolvers/custom/UserTotpResolver.cjs'],
    ['readers/', "MISSING readers/index.cjs: required as './readers/index.cjs' by index.cjs", 'Reached via index.cjs'],
    ['config/', "MISSING config/jwtConfig.cjs: required as './config/jwtConfig.cjs' by getToken.cjs", 'Reached via getToken.cjs'],
    ['middleware/', "MISSING middleware/audit-log-write-redaction.cjs: required as './middleware/audit-log-write-redaction.cjs' by prismaClient.cjs", 'Reached via prismaClient.cjs'],
  ])('fails, naming the file and the chain, when %s leaves files', async (directory, missing, chain) => {
    const { code, output } = await checkWithFiles((files) => files.filter((entry) => entry !== directory));
    expect(output).toContain(missing);
    expect(output).toContain('excluded from the pack list by package-npm.json "files"');
    expect(output).toContain(chain);
    expect(output).toContain(`Ship in package-npm.json "files" (or stop shipping their importers): ${directory}`);
    expect(code).toBe(EXIT.MISSING);
  }, PACK_TIMEOUT_MS);

  it.each([
    ['!/server.cjs', "MISSING plugins/http-status-mapper.cjs: required as './plugins/http-status-mapper.cjs' by server.cjs"],
    ['!/health.cjs', "MISSING ../package.json: required as '../package.json' by health.cjs — resolves above the package root"],
    ['!/config/tracing.cjs', "MISSING ../package.json: required as '../../package.json' by config/tracing.cjs — resolves above the package root"],
    ['!**/__tests__/**', "MISSING esm/prismaClient: required as '../../prismaClient' by esm/middleware/__tests__/audit-log-write-redaction.harness.mjs — does not exist in the build output"],
  ])('fails when the exclusion %s is dropped and the file it keeps out ships', async (exclusion, missing) => {
    const { code, output } = await checkWithFiles((files) => files.filter((entry) => entry !== exclusion));
    expect(output).toContain(missing);
    expect(code).toBe(EXIT.MISSING);
  }, PACK_TIMEOUT_MS);

  it('the repo\'s files list ships what the entries import and keeps the server bootstrap and test harnesses out', () => {
    expect(realManifest().files).toEqual(
      expect.arrayContaining(['auth/', 'readers/', 'config/', 'middleware/', '!**/__tests__/**', '!/server.cjs', '!/health.cjs', '!/config/tracing.cjs']),
    );
  });
});

describe('an unreadable package is UNKNOWN, never complete', () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'package-contents-'));
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('exits UNKNOWN when there is no package.json', async () => {
    const run = await checkDirectory(root);
    expect(run.lines.join('\n')).toMatch(/^UNKNOWN cannot read the manifest/);
    expect(run.code).toBe(EXIT.UNKNOWN);
  });

  it('exits UNKNOWN when no entry the manifest declares names a file', async () => {
    writeTree(root, { 'package.json': JSON.stringify({ name: 'x', version: '1.0.0', exports: { './*': './*.cjs' } }), 'a.mjs': '' });
    const run = await checkDirectory(root);
    expect(run.lines.join('\n')).toContain('UNKNOWN the manifest declares no entry');
    expect(run.code).toBe(EXIT.UNKNOWN);
  }, PACK_TIMEOUT_MS);

  it('exits UNKNOWN when the manifest is not valid JSON', async () => {
    writeTree(root, { 'package.json': '{ "name": ' });
    const run = await checkDirectory(root);
    expect(run.lines.join('\n')).toMatch(/^UNKNOWN cannot read the manifest/);
    expect(run.code).toBe(EXIT.UNKNOWN);
  });

  it('exits UNKNOWN when npm cannot produce a pack list', async () => {
    const lines: string[] = [];
    const code = await main(['--root', root], {
      ...processDeps,
      readText: () => JSON.stringify({ main: 'index.cjs' }),
      packList: () => {
        throw new UnreadableError('npm pack exited 1');
      },
      out: (line: string) => lines.push(line),
    });
    expect(lines.join('\n')).toContain('UNKNOWN npm pack exited 1');
    expect(code).toBe(EXIT.UNKNOWN);
  });

  it('exits UNKNOWN when a reached file cannot be read', async () => {
    const lines: string[] = [];
    const code = await main(['--root', root], {
      ...processDeps,
      readText: (path: string) => {
        if (path.endsWith('package.json')) {
          return JSON.stringify({ main: 'index.cjs' });
        }
        throw new Error('EIO');
      },
      packList: () => ['index.cjs', 'package.json'],
      out: (line: string) => lines.push(line),
    });
    expect(lines.join('\n')).toContain('UNKNOWN cannot read index.cjs');
    expect(code).toBe(EXIT.UNKNOWN);
  });

  it('exits USAGE for an argument it does not know', async () => {
    const lines: string[] = [];
    const code = await main(['--roots', 'dist'], { ...processDeps, out: (line: string) => lines.push(line) });
    expect(code).toBe(EXIT.USAGE);
  });
});

describe('the check runs on the real dist, in the build both workflows already run', () => {
  const repoRoot = join(__dirname, '..', '..', '..');

  interface WorkflowStep {
    id?: string;
    name?: string;
    run?: string;
  }
  interface WorkflowFile {
    on?: Record<string, { paths?: string[] }>;
    jobs: Record<string, { steps: WorkflowStep[] }>;
  }

  const manifest: { scripts: Record<string, string> } = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));

  function workflow(name: string): WorkflowFile {
    return parse(readFileSync(join(repoRoot, '.github', 'workflows', name), 'utf8')) as WorkflowFile;
  }

  it('the npm script runs the checker against dist', () => {
    expect(manifest.scripts['check:package-contents']).toBe('node scripts/ci/package-contents.mjs --root dist');
  });

  it('build:package packs dist and then checks it, so an unprepared dist is never the thing checked', () => {
    const chain = manifest.scripts['build:package'].split('&&').map((part) => part.trim());
    expect(chain).toEqual(['npm run build', 'npm run prepare-package-folder', 'npm run check:package-contents']);
  });

  it('publish.yml builds through build:package, and does so before the publish step', () => {
    const steps = workflow('publish.yml').jobs.publish.steps;
    const build = steps.findIndex((item) => item.name === 'Build npm package');
    const publish = steps.findIndex((item) => item.id === 'publish');
    expect(steps[build].run).toBe('npm run build:package');
    expect(build).toBeGreaterThanOrEqual(0);
    expect(publish).toBeGreaterThan(build);
  });

  it('ci.yml builds through build:package on pull requests, and a change to the packaging inputs triggers it', () => {
    const ci = workflow('ci.yml');
    expect(ci.jobs.build.steps.map((item) => item.run)).toContain('npm run build:package');
    for (const trigger of ['pull_request', 'push']) {
      expect(ci.on?.[trigger]?.paths).toEqual(expect.arrayContaining(['package-npm.json', 'prepare-package.mjs']));
    }
  });
});
