/**
 * The package closure check (scripts/ci/check-package-closure.mjs) and the
 * CommonJS specifier rewrite it guards (scripts/package/rewrite-cjs-requires.mjs).
 *
 * The end-to-end cases build a miniature package directory, run the real
 * checker over it — a real `npm pack`, a real extraction and a real `require`
 * of each entry point in a child process — and read its exit code and output.
 * The fixture shapes are the ones measured in the published tarball: a root
 * `prismaClient.cjs` requiring a `middleware/` module the `files` allow-list
 * left out, and a generated `args.index.cjs` requiring `./X/args.cjs` where
 * only the directory `X/args/` exists.
 */
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import {
  EXIT,
  classifyLoad,
  commonJsEntryPoints,
  extractRelativeSpecifiers,
  findUnresolved,
  isGuardedOptional,
  main,
  resolveInPack,
} from '../check-package-closure.mjs';
import { rewriteCjsRequires } from '../../package/rewrite-cjs-requires.mjs';

const PACK_TIMEOUT_MS = 60_000;

const BASE_FILES = ['package.json', '*.cjs', '*.d.ts'];

let root: string;

function writeTree(files: Record<string, string>): void {
  for (const [rel, content] of Object.entries(files)) {
    const abs = join(root, rel);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
}

function packageJson(files: string[]): string {
  return JSON.stringify({
    name: '@fixture/closure',
    version: '0.0.1',
    type: 'module',
    main: 'index.cjs',
    files,
    exports: {
      '.': { require: './index.cjs' },
      './*': { require: './*.cjs' },
    },
  });
}

function run(args: string[] = []): { code: number; out: string } {
  const lines: string[] = [];
  const code = main(['--dist', root, ...args], {
    log: (l: string) => lines.push(l),
    error: (l: string) => lines.push(l),
  });
  return { code, out: lines.join('\n') };
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'closure-fixture-'));
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('check-package-closure end to end (real npm pack)', () => {
  it(
    'fails and names the pair when a shipped entry requires a directory the files list omits',
    () => {
      writeTree({
        'package.json': packageJson(BASE_FILES),
        'index.cjs': "module.exports = require('./prismaClient.cjs');\n",
        'prismaClient.cjs': "module.exports = require('./middleware/x.cjs');\n",
        'middleware/x.cjs': 'module.exports = { redacted: true };\n',
      });
      const { code, out } = run();
      expect(code).toBe(EXIT.UNRESOLVED);
      expect(out).toContain('UNRESOLVED prismaClient.cjs -> ./middleware/x.cjs');
      expect(out).toContain("LOAD-FAILED prismaClient.cjs: Cannot find module './middleware/x.cjs'");
    },
    PACK_TIMEOUT_MS
  );

  it(
    'passes once the omitted directory is in the files list',
    () => {
      writeTree({
        'package.json': packageJson([...BASE_FILES, 'middleware/']),
        'index.cjs': "module.exports = require('./prismaClient.cjs');\n",
        'prismaClient.cjs': "module.exports = require('./middleware/x.cjs');\n",
        'middleware/x.cjs': 'module.exports = { redacted: true };\n',
      });
      const { code, out } = run();
      expect(out).toContain('0 unresolved relative specifier(s)');
      expect(out).toContain('loaded 2/2 CommonJS entry point(s); 0 failed');
      expect(code).toBe(EXIT.OK);
    },
    PACK_TIMEOUT_MS
  );

  it(
    'fails a require of "./X/args.cjs" when only the directory X/args/ ships',
    () => {
      writeTree({
        'package.json': packageJson([...BASE_FILES, 'generated/']),
        'index.cjs': "module.exports = require('./generated/args.index.cjs');\n",
        'generated/args.index.cjs': "module.exports = require('./ABTest/args.cjs');\n",
        'generated/ABTest/args/index.cjs': 'module.exports = {};\n',
      });
      const { code, out } = run();
      expect(code).toBe(EXIT.UNRESOLVED);
      expect(out).toContain('UNRESOLVED generated/args.index.cjs -> ./ABTest/args.cjs');
    },
    PACK_TIMEOUT_MS
  );

  it(
    'treats an uninstalled third-party dependency as the consumer\'s, not a packaging defect',
    () => {
      writeTree({
        'package.json': packageJson(BASE_FILES),
        'index.cjs': "module.exports = require('some-dependency-that-is-not-installed');\n",
      });
      const { code, out } = run(['--node-path', join(root, 'no-such-node-modules')]);
      expect(out).toContain("third-party module 'some-dependency-that-is-not-installed' not installed here");
      expect(code).toBe(EXIT.OK);
    },
    PACK_TIMEOUT_MS
  );

  it(
    'fails an entry that throws for a reason other than a missing module',
    () => {
      writeTree({
        'package.json': packageJson(BASE_FILES),
        'index.cjs': "throw new TypeError('boom at load');\n",
      });
      const { code, out } = run();
      expect(code).toBe(EXIT.UNRESOLVED);
      expect(out).toContain('LOAD-FAILED index.cjs: boom at load');
    },
    PACK_TIMEOUT_MS
  );

  it(
    'leaves the extracted tarball for the publish diff when asked, without __tests__ the files list negates',
    () => {
      const keep = join(root, 'kept');
      writeTree({
        'package.json': packageJson([...BASE_FILES, 'middleware/', '!**/__tests__']),
        'index.cjs': "module.exports = require('./middleware/x.cjs');\n",
        'middleware/x.cjs': 'module.exports = 1;\n',
        'middleware/__tests__/x.test.cjs': "require('../../nowhere');\n",
      });
      const { code } = run(['--keep-extracted', keep, '--no-load']);
      expect(code).toBe(EXIT.OK);
      expect(existsSync(join(keep, 'package', 'middleware', 'x.cjs'))).toBe(true);
      expect(existsSync(join(keep, 'package', 'middleware', '__tests__'))).toBe(false);
    },
    PACK_TIMEOUT_MS
  );

  it('reports ERROR when there is no package.json to pack', () => {
    const { code, out } = run();
    expect(code).toBe(EXIT.ERROR);
    expect(out).toContain('no package.json');
  });
});

describe('extractRelativeSpecifiers', () => {
  it('reads require, import, export-from, side-effect and dynamic import forms', () => {
    const src = [
      "const a = require('./a');",
      "import b from './b.mjs';",
      "export * from '../c.mjs';",
      "import './d.mjs';",
      "const e = import('./e.mjs');",
      "const dep = require('lodash');",
    ].join('\n');
    expect(extractRelativeSpecifiers(src, 'import').map((s) => s.spec)).toEqual([
      './a',
      './b.mjs',
      '../c.mjs',
      './d.mjs',
      './e.mjs',
    ]);
  });

  it('ignores specifiers inside comments and strings', () => {
    const src = [
      "/** import { x } from './plugins/x.mjs'; */",
      "// require('./commented')",
      'const s = "require(\'./in-a-string\')";',
    ].join('\n');
    expect(extractRelativeSpecifiers(src, 'require')).toEqual([]);
  });

  it('still sees a require that follows a regex literal containing a quote', () => {
    const src = "const r = /['\"]/; const i = require('./after-regex');";
    expect(extractRelativeSpecifiers(src, 'require').map((s) => s.spec)).toEqual(['./after-regex']);
  });
});

describe('resolveInPack', () => {
  const pack = new Set(['a.cjs', 'lib/index.js', 'd/index.cjs', 'm.mjs', 'data.json']);

  it('accepts an exact shipped path for both module systems', () => {
    expect(resolveInPack('x.cjs', { spec: './a.cjs', kind: 'require' }, pack)).toBe('a.cjs');
    expect(resolveInPack('x.mjs', { spec: './m.mjs', kind: 'import' }, pack)).toBe('m.mjs');
  });

  it('applies CommonJS probing (extension, then directory index.js) only to require', () => {
    expect(resolveInPack('x.cjs', { spec: './data', kind: 'require' }, pack)).toBe('data.json');
    expect(resolveInPack('x.cjs', { spec: './lib', kind: 'require' }, pack)).toBe('lib/index.js');
    expect(resolveInPack('x.mjs', { spec: './lib', kind: 'import' }, pack)).toBeNull();
  });

  it('does not let CommonJS find a directory index.cjs, as Node does not', () => {
    expect(resolveInPack('x.cjs', { spec: './d', kind: 'require' }, pack)).toBeNull();
  });

  it('rejects a path that escapes the package root', () => {
    expect(resolveInPack('x.cjs', { spec: '../package.json', kind: 'require' }, pack)).toBeNull();
  });
});

describe('findUnresolved', () => {
  it('names each unresolved file -> specifier pair once', () => {
    const files: Record<string, string> = {
      'prismaClient.cjs': "require('./middleware/x.cjs'); require('./middleware/x.cjs'); require('./ok.cjs');",
      'ok.cjs': '',
      'types.d.ts': "import './not-scanned';",
    };
    const pack = new Set(Object.keys(files));
    expect(findUnresolved(pack, (p) => files[p])).toEqual([
      { file: 'prismaClient.cjs', spec: './middleware/x.cjs' },
    ]);
  });

  it('resolves .js files by the package type', () => {
    const files: Record<string, string> = { 'a.js': "require('./b');", 'b.js': '' };
    const pack = new Set(Object.keys(files));
    expect(findUnresolved(pack, (p) => files[p], 'commonjs')).toEqual([]);
    expect(findUnresolved(pack, (p) => files[p], 'module')).toEqual([{ file: 'a.js', spec: './b' }]);
  });
});

describe('commonJsEntryPoints', () => {
  it('expands main, the "." export and a root-only "./*" wildcard', () => {
    const pack = new Set(['index.cjs', 'client.cjs', 'nested/deep.cjs', 'esm/index.mjs', 'x.d.ts']);
    expect(
      commonJsEntryPoints(
        { main: 'index.cjs', exports: { '.': { require: './index.cjs' }, './*': { require: './*.cjs' } } },
        pack
      )
    ).toEqual(['client.cjs', 'index.cjs']);
  });
});

describe('classifyLoad', () => {
  it('splits a missing relative module (defect) from a missing dependency (external)', () => {
    expect(classifyLoad({ entry: 'a.cjs', ok: true })).toBe('ok');
    expect(classifyLoad({ entry: 'a.cjs', ok: false, code: 'MODULE_NOT_FOUND', missing: './x.cjs' })).toBe('defect');
    expect(classifyLoad({ entry: 'a.cjs', ok: false, code: 'MODULE_NOT_FOUND', missing: '/abs/x.cjs' })).toBe('defect');
    expect(classifyLoad({ entry: 'a.cjs', ok: false, code: 'MODULE_NOT_FOUND', missing: 'lodash' })).toBe('external');
    expect(classifyLoad({ entry: 'a.cjs', ok: false, code: 'ERR_REQUIRE_ESM', missing: null })).toBe('defect');
    expect(classifyLoad({ entry: 'a.cjs', ok: false })).toBe('defect');
  });
});

describe('isGuardedOptional', () => {
  it('exempts only the exact reviewed file and specifier', () => {
    expect(isGuardedOptional({ file: 'health.cjs', spec: '../package.json' })).toBe(true);
    expect(isGuardedOptional({ file: 'health.cjs', spec: './middleware/x.cjs' })).toBe(false);
    expect(isGuardedOptional({ file: 'other.cjs', spec: '../package.json' })).toBe(false);
  });
});

describe('rewriteCjsRequires', () => {
  const existing = new Set([
    '/dist/generated/resolvers/crud/ABTest/args/index.cjs',
    '/dist/generated/enums/index.cjs',
    '/dist/generated/models.cjs',
    '/dist/generated/models/index.cjs',
    '/dist/utils/logger.cjs',
  ]);
  const exists = (p: string): boolean => existing.has(p);

  it('points a directory specifier at its index.cjs instead of appending .cjs', () => {
    const { content, changed } = rewriteCjsRequires(
      'require("./ABTest/args");',
      '/dist/generated/resolvers/crud',
      exists
    );
    expect(changed).toBe(true);
    expect(content).toBe('require("./ABTest/args/index.cjs");');
  });

  it('prefers the file when both a file and a directory of that name exist, as tsc resolved it', () => {
    expect(rewriteCjsRequires("require('./models');", '/dist/generated', exists).content).toBe(
      "require('./models.cjs');"
    );
    expect(rewriteCjsRequires("require('./enums');", '/dist/generated', exists).content).toBe(
      "require('./enums/index.cjs');"
    );
  });

  it('rewrites parent-relative specifiers', () => {
    expect(rewriteCjsRequires("require('../utils/logger');", '/dist/middleware', exists).content).toBe(
      "require('../utils/logger.cjs');"
    );
  });

  it('leaves extensioned, bare and unresolvable specifiers exactly as written', () => {
    const src = "require('./x.json'); require('lodash'); require('./missing');";
    expect(rewriteCjsRequires(src, '/dist', exists)).toEqual({ content: src, changed: false });
  });
});
