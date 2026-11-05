// @ts-check
/**
 * Package closure check: every relative module a shipped file loads must
 * itself ship in the npm tarball.
 *
 * The published package is assembled from `dist/` through the `files`
 * allow-list in `package-npm.json`. That list is maintained by hand while
 * `dist/` grows with the source tree, so a new source directory compiles,
 * passes every build and test step, and is then silently left out of the
 * tarball. Any shipped module that requires it throws MODULE_NOT_FOUND in a
 * consumer's process, and nothing in the build can see it, because `dist/`
 * itself is complete. The only faithful view of what a consumer receives is
 * the pack list npm computes, so that list is what this check reads.
 *
 * Two independent readings, both against the pack list:
 *
 * 1. Static. For every shipped `.cjs`, `.mjs` and `.js` file, each relative
 *    `require()`, `import ... from`, `export ... from` and `import()`
 *    specifier is resolved the way Node resolves it for that module system
 *    (CommonJS tries the exact path, then `.js`/`.json`/`.node`, then
 *    `index.*` in a directory; ESM accepts the exact path only). A specifier
 *    whose target is not in the pack list is a defect, named as
 *    `file -> specifier`.
 * 2. Dynamic. The tarball is packed for real, extracted, and every CommonJS
 *    entry point the package `exports` map serves is `require`d in a child
 *    process. A missing RELATIVE module fails the check; a missing bare
 *    (third-party) dependency is reported but does not, because a consumer's
 *    install supplies those and this check is about what the tarball carries.
 *
 * Usage:
 *   node scripts/ci/check-package-closure.mjs [--dist DIR] [--no-load]
 *        [--keep-extracted DIR] [--node-path DIR]
 *
 * `--keep-extracted DIR` leaves the extracted tarball at `DIR/package`, so a
 * later step (the publish workflow's skip-if-unchanged diff) compares the
 * same file set a consumer would receive instead of the raw `dist/` tree.
 *
 * Exit codes are listed in {@link EXIT}.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/** Process exit codes. */
export const EXIT = Object.freeze({
  /** Every relative specifier resolves inside the pack and every entry loads. */
  OK: 0,
  /** At least one shipped module loads a relative module the tarball lacks. */
  UNRESOLVED: 1,
  /** The check could not run (bad arguments, `npm pack` failed, no package.json). */
  ERROR: 2,
});

/** Entry points that start a process when loaded rather than exporting an API. */
export const NON_LOADABLE_ENTRIES = Object.freeze(['server.cjs']);

/**
 * Specifiers that deliberately reach outside the package and are loaded
 * inside a guard that reports an honest fallback when they are absent.
 * Each entry names the file, the exact specifier and why the miss is safe,
 * so the exemption is reviewable and cannot widen to a different module.
 */
export const GUARDED_OPTIONAL_SPECIFIERS = Object.freeze([
  Object.freeze({
    file: 'health.cjs',
    spec: '../package.json',
    reason:
      'reads the running service\'s own package.json for the /health version; inside try/catch with an explicit "unknown" fallback, and meaningless inside a consumer install',
  }),
  Object.freeze({
    file: 'config/tracing.cjs',
    spec: '../../package.json',
    reason:
      'reads the running service\'s own package.json for the trace resource version; inside try/catch with an explicit "unknown" fallback, and meaningless inside a consumer install',
  }),
]);

/**
 * Whether an unresolved specifier is one of the reviewed guarded optional reads.
 *
 * @param {Unresolved} u The unresolved pair.
 * @returns {boolean} True when exempt.
 */
export function isGuardedOptional(u) {
  return GUARDED_OPTIONAL_SPECIFIERS.some((g) => g.file === u.file && g.spec === u.spec);
}

/** Extensions whose content is JavaScript that can load other modules. */
const SCANNED_EXTENSIONS = /\.(?:cjs|mjs|js)$/;

/** CommonJS extension probing order (Node's `Module._extensions`). */
const CJS_EXTENSIONS = Object.freeze(['.js', '.json', '.node']);

/**
 * @typedef {object} Specifier
 * @property {string} spec The literal specifier text.
 * @property {'require' | 'import'} kind How it is loaded: CommonJS `require` or an ESM import form.
 */

/**
 * @typedef {object} Unresolved
 * @property {string} file Pack-relative path of the module holding the specifier.
 * @property {string} spec The specifier that does not resolve inside the pack.
 */

/**
 * Parse the output of `npm pack --json` into the set of shipped paths.
 *
 * @param {string} json Raw stdout of `npm pack --json` (or `--dry-run --json`).
 * @returns {{ files: Set<string>, filename: string | undefined }} Shipped paths, POSIX, relative to the package root.
 */
export function parsePackList(json) {
  /** @type {unknown} */
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('npm pack --json returned no package entry');
  }
  const entry = /** @type {{ files?: Array<{ path?: unknown }>, filename?: unknown }} */ (parsed[0]);
  if (!Array.isArray(entry.files)) {
    throw new Error('npm pack --json entry has no files list');
  }
  const files = new Set();
  for (const f of entry.files) {
    if (typeof f.path === 'string') files.add(f.path.split('\\').join('/'));
  }
  return { files, filename: typeof entry.filename === 'string' ? entry.filename : undefined };
}

/**
 * Extract the relative module specifiers a JavaScript source loads.
 *
 * The source is parsed into a syntax tree rather than scanned with a regular
 * expression, so a specifier inside a comment or a string is not reported and
 * a regex literal containing a quote does not hide the code after it. Only
 * specifiers starting with `./` or `../` are returned: bare specifiers name
 * dependencies the consumer installs, not files the tarball carries.
 *
 * The loading kind follows the file's module system: a `.cjs` file (or a
 * `.js` file in a CommonJS package) is resolved with CommonJS rules, an
 * `.mjs` file (or `.js` in an ESM package) with ESM rules, which accept the
 * exact path only.
 *
 * @param {string} source File content.
 * @param {'require' | 'import'} kind The module system of the file holding the source.
 * @param {string} [fileName] Name used for parse diagnostics.
 * @returns {Specifier[]} Relative specifiers with their loading kind.
 */
export function extractRelativeSpecifiers(source, kind, fileName = 'module.js') {
  /** @type {Specifier[]} */
  const out = [];
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, false, ts.ScriptKind.JS);
  /** @param {ts.Node | undefined} node */
  const record = (node) => {
    if (node && ts.isStringLiteralLike(node) && /^\.\.?\//.test(node.text)) {
      out.push({ spec: node.text, kind });
    }
  };
  /** @param {ts.Node} node */
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      record(node.moduleSpecifier);
    } else if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const isRequire = ts.isIdentifier(callee) && callee.text === 'require';
      const isDynamicImport = callee.kind === ts.SyntaxKind.ImportKeyword;
      if ((isRequire || isDynamicImport) && node.arguments.length > 0) record(node.arguments[0]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return out;
}

/**
 * The module system a shipped JavaScript file is loaded under.
 *
 * @param {string} file Pack-relative path.
 * @param {'module' | 'commonjs'} packageType The package's `type` field.
 * @returns {'require' | 'import'} CommonJS (`require`) or ESM (`import`) resolution.
 */
export function moduleKindOf(file, packageType) {
  if (file.endsWith('.cjs')) return 'require';
  if (file.endsWith('.mjs')) return 'import';
  return packageType === 'module' ? 'import' : 'require';
}

/**
 * Resolve a relative specifier against the pack list the way Node would.
 *
 * @param {string} fromFile Pack-relative path of the importing module.
 * @param {Specifier} specifier The specifier to resolve.
 * @param {Set<string>} packFiles Shipped paths.
 * @returns {string | null} The shipped path it resolves to, or null when nothing in the pack satisfies it.
 */
export function resolveInPack(fromFile, specifier, packFiles) {
  const target = posix.normalize(posix.join(posix.dirname(fromFile), specifier.spec));
  if (target.startsWith('../')) return null;
  if (packFiles.has(target)) return target;
  if (specifier.kind === 'import') return null;
  for (const ext of CJS_EXTENSIONS) {
    if (packFiles.has(`${target}${ext}`)) return `${target}${ext}`;
  }
  for (const ext of CJS_EXTENSIONS) {
    const index = posix.join(target, `index${ext}`);
    if (packFiles.has(index)) return index;
  }
  return null;
}

/**
 * Find every relative specifier in the shipped modules that does not resolve
 * inside the pack.
 *
 * @param {Set<string>} packFiles Shipped paths.
 * @param {(path: string) => string} readFile Reads a shipped file's content by pack-relative path.
 * @param {'module' | 'commonjs'} [packageType] The package's `type` field, which decides how `.js` files load.
 * @returns {Unresolved[]} Unresolved `file -> specifier` pairs, sorted for stable output.
 */
export function findUnresolved(packFiles, readFile, packageType = 'commonjs') {
  /** @type {Unresolved[]} */
  const unresolved = [];
  for (const file of [...packFiles].sort()) {
    if (!SCANNED_EXTENSIONS.test(file)) continue;
    const seen = new Set();
    for (const specifier of extractRelativeSpecifiers(readFile(file), moduleKindOf(file, packageType), file)) {
      const key = `${specifier.kind}:${specifier.spec}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (resolveInPack(file, specifier, packFiles) === null) {
        unresolved.push({ file, spec: specifier.spec });
      }
    }
  }
  return unresolved;
}

/**
 * The CommonJS entry points a consumer can reach through the package's
 * `main` and `exports` map.
 *
 * A `./*` wildcard export serves every root-level file matching its target
 * pattern, so each one is an entry point.
 *
 * @param {Record<string, unknown>} packageJson The shipped package.json.
 * @param {Set<string>} packFiles Shipped paths.
 * @returns {string[]} Pack-relative entry paths that exist in the pack, sorted.
 */
export function commonJsEntryPoints(packageJson, packFiles) {
  const entries = new Set();
  /** @param {unknown} target */
  const add = (target) => {
    if (typeof target !== 'string') return;
    const path = posix.normalize(target);
    if (!path.includes('*')) {
      entries.add(path);
      return;
    }
    const [prefix, suffix] = path.split('*');
    for (const f of packFiles) {
      if (f.startsWith(prefix) && f.endsWith(suffix)) {
        const middle = f.slice(prefix.length, f.length - suffix.length);
        if (!middle.includes('/')) entries.add(f);
      }
    }
  };
  add(packageJson.main);
  const exportsMap = packageJson.exports;
  if (exportsMap && typeof exportsMap === 'object') {
    for (const value of Object.values(exportsMap)) {
      if (typeof value === 'string') add(value);
      else if (value && typeof value === 'object') {
        add(/** @type {Record<string, unknown>} */ (value).require);
      }
    }
  }
  return [...entries].filter((e) => packFiles.has(e)).sort();
}

/**
 * Child-process program that requires each entry and prints one JSON line per
 * entry: `{entry, ok}` or `{entry, ok:false, missing, code, message}`.
 */
const LOADER_SOURCE = `
const path = require('node:path');
const root = process.argv[1];
const entries = JSON.parse(process.argv[2]);
for (const entry of entries) {
  try {
    require(path.join(root, entry));
    process.stdout.write(JSON.stringify({ entry, ok: true }) + '\\n');
  } catch (err) {
    const message = err && err.message ? String(err.message) : String(err);
    const m = /Cannot find module '([^']+)'/.exec(message);
    process.stdout.write(JSON.stringify({
      entry, ok: false, code: err && err.code, missing: m ? m[1] : null,
      message: message.split('\\n')[0],
    }) + '\\n');
  }
}
`;

/**
 * @typedef {object} LoadResult
 * @property {string} entry Pack-relative entry path.
 * @property {boolean} ok Whether the entry loaded.
 * @property {string | null} [missing] The module named by a MODULE_NOT_FOUND error.
 * @property {string} [code] The error code.
 * @property {string} [message] First line of the error message.
 */

/**
 * Classify one entry's load result.
 *
 * A missing module named by a relative or absolute path is a file the tarball
 * should have carried. A missing bare specifier is a dependency the consumer
 * installs, so it does not count against the tarball. Any other load error is
 * a defect in the entry itself and fails the check.
 *
 * @param {LoadResult} result The child's report for one entry.
 * @returns {'ok' | 'external' | 'defect'} The verdict.
 */
export function classifyLoad(result) {
  if (result.ok) return 'ok';
  if (result.code === 'MODULE_NOT_FOUND' && typeof result.missing === 'string') {
    return /^(?:\.\.?\/|\/)/.test(result.missing) ? 'defect' : 'external';
  }
  return 'defect';
}

/**
 * Require each entry point from an extracted package in a child process.
 *
 * @param {string} packageRoot Directory holding the extracted package.json.
 * @param {string[]} entries Pack-relative entry paths.
 * @param {string | undefined} nodePath Directory to resolve third-party dependencies from.
 * @returns {LoadResult[]} One result per entry.
 */
export function loadEntryPoints(packageRoot, entries, nodePath) {
  const child = spawnSync(process.execPath, ['-e', LOADER_SOURCE, packageRoot, JSON.stringify(entries)], {
    cwd: packageRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, NODE_PATH: nodePath ?? '', LOG_LEVEL: 'error' },
  });
  /** @type {LoadResult[]} */
  const results = [];
  for (const line of (child.stdout ?? '').split('\n')) {
    if (!line.startsWith('{"entry"')) continue;
    results.push(/** @type {LoadResult} */ (JSON.parse(line)));
  }
  const reported = new Set(results.map((r) => r.entry));
  for (const entry of entries) {
    if (!reported.has(entry)) {
      results.push({
        entry,
        ok: false,
        message: `loader exited (status ${child.status}, signal ${child.signal}) before reporting this entry`,
      });
    }
  }
  return results;
}

/**
 * @param {string[]} argv CLI arguments after the script path.
 * @returns {{ dist: string, load: boolean, keepExtracted: string | undefined, nodePath: string | undefined }}
 */
export function parseArgs(argv) {
  const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
  /** @type {{ dist: string, load: boolean, keepExtracted: string | undefined, nodePath: string | undefined }} */
  const args = {
    dist: join(repoRoot, 'dist'),
    load: true,
    keepExtracted: undefined,
    nodePath: join(repoRoot, 'node_modules'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--no-load') args.load = false;
    else if (flag === '--dist' || flag === '--keep-extracted' || flag === '--node-path') {
      const value = argv[i + 1];
      if (value === undefined) throw new Error(`${flag} needs a value`);
      i += 1;
      if (flag === '--dist') args.dist = resolve(value);
      else if (flag === '--keep-extracted') args.keepExtracted = resolve(value);
      else args.nodePath = resolve(value);
    } else {
      throw new Error(`unknown argument: ${flag}`);
    }
  }
  return args;
}

/**
 * Run the check.
 *
 * @param {string[]} argv CLI arguments after the script path.
 * @param {{ log: (line: string) => void, error: (line: string) => void }} [io] Output sinks.
 * @returns {number} Exit code from {@link EXIT}.
 */
export function main(argv, io = { log: (l) => console.log(l), error: (l) => console.error(l) }) {
  /** @type {ReturnType<typeof parseArgs>} */
  let args;
  try {
    args = parseArgs(argv);
  } catch (err) {
    io.error(`check-package-closure: ${err instanceof Error ? err.message : String(err)}`);
    return EXIT.ERROR;
  }
  const packageJsonPath = join(args.dist, 'package.json');
  if (!existsSync(packageJsonPath)) {
    io.error(`check-package-closure: no package.json in ${args.dist} — run the package build first`);
    return EXIT.ERROR;
  }

  const workDir = mkdtempSync(join(tmpdir(), 'package-closure-'));
  try {
    const pack = spawnSync('npm', ['pack', '--json', '--ignore-scripts', '--pack-destination', workDir], {
      cwd: args.dist,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
    });
    if (pack.status !== 0) {
      io.error(`check-package-closure: npm pack failed (status ${pack.status}): ${pack.stderr}`);
      return EXIT.ERROR;
    }
    const { files, filename } = parsePackList(pack.stdout);
    io.log(`check-package-closure: ${files.size} files in the pack (${filename ?? 'unnamed tarball'})`);

    const distPackageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const packageType = distPackageJson.type === 'module' ? 'module' : 'commonjs';
    const found = findUnresolved(files, (p) => readFileSync(join(args.dist, p), 'utf8'), packageType);
    const unresolved = found.filter((u) => !isGuardedOptional(u));
    for (const u of found.filter(isGuardedOptional)) {
      io.log(`guarded optional ${u.file} -> ${u.spec} (exempt: reviewed guarded read)`);
    }
    for (const u of unresolved) io.error(`UNRESOLVED ${u.file} -> ${u.spec}`);
    io.log(`check-package-closure: ${unresolved.length} unresolved relative specifier(s)`);

    let loadDefects = 0;
    const extractRoot = args.keepExtracted ?? join(workDir, 'extract');
    if (args.load || args.keepExtracted) {
      if (filename === undefined) {
        io.error('check-package-closure: npm pack reported no tarball filename');
        return EXIT.ERROR;
      }
      rmSync(join(extractRoot, 'package'), { recursive: true, force: true });
      mkdirSync(extractRoot, { recursive: true });
      const tar = spawnSync('tar', ['-xzf', join(workDir, filename), '-C', extractRoot], { encoding: 'utf8' });
      if (tar.status !== 0) {
        io.error(`check-package-closure: extracting the tarball failed: ${tar.stderr}`);
        return EXIT.ERROR;
      }
    }
    if (args.load) {
      const packageRoot = join(extractRoot, 'package');
      const packageJson = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
      const entries = commonJsEntryPoints(packageJson, files).filter(
        (e) => !NON_LOADABLE_ENTRIES.includes(posix.basename(e))
      );
      const results = loadEntryPoints(packageRoot, entries, args.nodePath);
      let external = 0;
      for (const r of results) {
        const verdict = classifyLoad(r);
        if (verdict === 'defect') {
          loadDefects += 1;
          io.error(`LOAD-FAILED ${r.entry}: ${r.message ?? 'unknown error'}`);
        } else if (verdict === 'external') {
          external += 1;
          io.log(`load ${r.entry}: third-party module '${r.missing}' not installed here (not a packaging defect)`);
        }
      }
      io.log(
        `check-package-closure: loaded ${results.length - loadDefects - external}/${results.length} CommonJS entry point(s); ${loadDefects} failed, ${external} blocked only by an uninstalled third-party module`
      );
    }

    if (unresolved.length > 0 || loadDefects > 0) {
      io.error('check-package-closure: FAIL — the tarball does not carry every module its shipped files load. Add the missing paths to `files` in package-npm.json or fix the specifier rewrite in prepare-package.mjs.');
      return EXIT.UNRESOLVED;
    }
    io.log('check-package-closure: PASS');
    return EXIT.OK;
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

/* c8 ignore next 3 */
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}

