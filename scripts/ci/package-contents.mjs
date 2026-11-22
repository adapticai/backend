// @ts-check
/**
 * Package-contents check: every file an emitted entry loads is in the pack list.
 *
 * `prepare-package.mjs` assembles `dist/` and `package-npm.json` decides which
 * parts of it reach the registry (`files`). Those are two separate lists with
 * nothing tying them together, so a module in a shipped directory can import a
 * directory that is not shipped. Nothing fails at build time: `tsc` resolved the
 * import against the source tree, and the registry accepts whatever `npm pack`
 * selects. The consumer finds out at `require()` / `import` time, with
 * "Cannot find module '../../auth/totp.cjs'".
 *
 * This check closes that gap at the one place both facts are known. It asks npm
 * what it would pack (`npm pack --dry-run --json`: the same selection `npm
 * publish` makes), starts from every concrete entry the manifest declares
 * (`main`, `module`, `types`, and each non-wildcard `exports` target), follows
 * every relative `require()` / `import` / `export ... from` / `import()` /
 * `import type` through the files it reaches, and reports each target that is
 * not in the pack list. A target that exists on disk but is not packed is the
 * `files` omission this exists to catch; a target that exists nowhere is an
 * emit defect. The two are labelled apart because the remedies differ.
 *
 * Resolution follows the loader that will actually read the file:
 *
 *   .cjs   exact path, then `.js` / `.json` / `.node`, then `index.*` in a directory
 *   .mjs   exact path only (ES module specifiers are never extension-searched)
 *   .d.ts  `.d.ts` / `.d.mts` / `.d.cts` siblings of the specifier, then `index.d.ts`
 *
 * Specifiers are read with the TypeScript scanner, not a pattern, so an import
 * quoted inside a comment or a string is not an import. Bare specifiers
 * (`@prisma/client`, `node:fs`) are other packages' business and are skipped,
 * as are wildcard `exports` subpaths: those name a family of files, not an entry.
 *
 * Exit codes ({@link EXIT}). A package whose pack list or entries could not be
 * read is UNKNOWN, never complete: an absent answer must not read as a pass.
 *
 *   node scripts/ci/package-contents.mjs [--root dist]
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { posix, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Process exit codes. MISSING is an established defect; UNKNOWN is the absence of an answer. */
export const EXIT = Object.freeze({
  /** Every file reached from every entry is in the pack list. */
  COMPLETE: 0,
  /** At least one reached import has no target in the pack list. */
  MISSING: 1,
  /** The pack list, the manifest or an entry could not be read; nothing was established. */
  UNKNOWN: 2,
  /** The command line was invalid; nothing was read. */
  USAGE: 64,
});

/** Output of `npm pack --dry-run --json` on the full package is several MB. */
const PACK_OUTPUT_LIMIT_BYTES = 512 * 1024 * 1024;

/** Extensions Node's CommonJS loader appends to a bare specifier, in its order. */
const CJS_EXTENSIONS = ['.js', '.json', '.node'];

/** The `.d.*` declaration extension that pairs with each runtime extension. */
const DECLARATION_FOR_RUNTIME = new Map([
  ['.js', '.d.ts'],
  ['.cjs', '.d.cts'],
  ['.mjs', '.d.mts'],
]);

/** Thrown when a fact the check depends on cannot be read. */
export class UnreadableError extends Error {}

/**
 * @typedef {'cjs' | 'esm' | 'types' | 'leaf'} Kind
 *   Which resolution rules apply to the imports inside a file. `leaf` files
 *   (JSON, native addons) are followed to but not parsed.
 *
 * @typedef {{ field: string, path: string }} Entry
 *   A concrete manifest entry, with the manifest field that declared it.
 *
 * @typedef {{
 *   from: string,
 *   spec: string,
 *   target: string,
 *   onDisk: boolean,
 *   chain: string[],
 * }} Unresolved
 *   One import with no target in the pack list. `target` is the package-relative
 *   path the loader would have tried first; `onDisk` says whether any candidate
 *   exists in the build output (excluded by `files`) or none does (never emitted).
 *
 * @typedef {{
 *   entries: Entry[],
 *   reached: number,
 *   packed: number,
 *   unresolved: Unresolved[],
 *   missingEntries: Entry[],
 * }} Report
 */

/**
 * Runs `npm pack --dry-run --json` in `root` and returns the packed paths.
 *
 * @param {string} root
 * @returns {string[]}
 */
export function readPackList(root) {
  const run = spawnSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: PACK_OUTPUT_LIMIT_BYTES,
  });
  if (run.error !== undefined) {
    throw new UnreadableError(`npm pack could not start in ${root}: ${run.error.message}`);
  }
  if (run.status !== 0) {
    throw new UnreadableError(`npm pack exited ${run.status} in ${root}: ${String(run.stderr).trim().split('\n').slice(-3).join(' | ')}`);
  }
  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(run.stdout);
  } catch (error) {
    throw new UnreadableError(`npm pack printed no JSON in ${root}: ${error instanceof Error ? error.message : String(error)}`);
  }
  const first = Array.isArray(parsed) ? parsed[0] : undefined;
  const files = first !== null && typeof first === 'object' ? /** @type {{ files?: unknown }} */ (first).files : undefined;
  if (!Array.isArray(files) || files.length === 0) {
    throw new UnreadableError(`npm pack listed no files in ${root}`);
  }
  return files.map((file) => String(file.path));
}

/**
 * Every concrete entry the manifest declares. Wildcard `exports` subpaths are
 * skipped: `./*` names a family, and there is no single file to start from.
 *
 * @param {Record<string, unknown>} manifest
 * @returns {Entry[]}
 */
export function entryPoints(manifest) {
  /** @type {Map<string, Entry>} */
  const found = new Map();
  /** @param {string} field @param {unknown} value */
  const add = (field, value) => {
    if (typeof value !== 'string' || value.includes('*')) {
      return;
    }
    const path = posix.normalize(value);
    if (!found.has(path)) {
      found.set(path, { field, path });
    }
  };
  /** @param {string} field @param {unknown} value */
  const walk = (field, value) => {
    if (typeof value === 'string') {
      add(field, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => walk(field, item));
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => walk(`${field}.${key}`, child));
    }
  };
  add('main', manifest.main);
  add('module', manifest.module);
  add('types', manifest.types);
  add('typings', manifest.typings);
  walk('exports', manifest.exports);
  return [...found.values()];
}

/**
 * Which rules read the imports inside `path`.
 *
 * @param {string} path
 * @param {boolean} packageIsModule `"type": "module"` in the manifest
 * @returns {Kind}
 */
export function kindOf(path, packageIsModule) {
  if (/\.d\.[cm]?ts$/.test(path)) {
    return 'types';
  }
  if (path.endsWith('.cjs')) {
    return 'cjs';
  }
  if (path.endsWith('.mjs')) {
    return 'esm';
  }
  if (path.endsWith('.js')) {
    return packageIsModule ? 'esm' : 'cjs';
  }
  return 'leaf';
}

/**
 * The package-relative paths a loader would try for `spec` imported from
 * `from`, in its order. Empty when the specifier leaves the package.
 *
 * @param {string} from package-relative path of the importing file
 * @param {string} spec relative specifier, `./x` or `../x`
 * @param {Kind} kind rules of the importing file
 * @returns {string[]}
 */
export function candidatesFor(from, spec, kind) {
  const base = posix.normalize(posix.join(posix.dirname(from), spec));
  if (base === '..' || base.startsWith('../') || posix.isAbsolute(base)) {
    return [];
  }
  if (kind === 'esm') {
    return [base];
  }
  if (kind === 'cjs') {
    return [
      base,
      ...CJS_EXTENSIONS.map((extension) => `${base}${extension}`),
      ...CJS_EXTENSIONS.map((extension) => `${base}/index${extension}`),
    ];
  }
  if (/\.(d\.[cm]?ts|json|node)$/.test(base)) {
    return [base];
  }
  const extension = posix.extname(base);
  const declaration = DECLARATION_FOR_RUNTIME.get(extension);
  return [
    ...(declaration === undefined ? [] : [`${base.slice(0, -extension.length)}${declaration}`]),
    `${base}.d.ts`,
    `${base}.d.mts`,
    `${base}.d.cts`,
    `${base}/index.d.ts`,
  ];
}

/**
 * Relative specifiers imported by `source`, found with the TypeScript scanner
 * so comments and string contents never count.
 *
 * @param {(text: string) => { importedFiles: Array<{ fileName: string }> }} preProcess
 * @param {string} source
 * @returns {string[]}
 */
export function relativeSpecifiers(preProcess, source) {
  const specs = new Set();
  for (const imported of preProcess(source).importedFiles) {
    if (imported.fileName.startsWith('./') || imported.fileName.startsWith('../')) {
      specs.add(imported.fileName);
    }
  }
  return [...specs];
}

/**
 * Walks the import graph from every entry and reports what is not packed.
 *
 * @param {object} input
 * @param {string} input.root package directory (where `package.json` and the entries live)
 * @param {Record<string, unknown>} input.manifest parsed `package.json`
 * @param {string[]} input.packList paths npm would pack, relative to `root`, `/`-separated
 * @param {(path: string) => string} input.readText reads a package-relative path
 * @param {(path: string) => boolean} input.existsOnDisk whether a package-relative path exists in the build output
 * @param {(text: string) => { importedFiles: Array<{ fileName: string }> }} input.preProcess
 * @returns {Report}
 */
export function checkPackage({ manifest, packList, readText, existsOnDisk, preProcess }) {
  const packed = new Set(packList);
  const packageIsModule = manifest.type === 'module';
  const entries = entryPoints(manifest);
  /** @type {Entry[]} */
  const missingEntries = [];
  /** @type {Unresolved[]} */
  const unresolved = [];
  /** @type {Map<string, string[]>} path -> chain of paths that led to it */
  const reached = new Map();
  /** @type {string[]} */
  const queue = [];

  for (const entry of entries) {
    if (!packed.has(entry.path)) {
      missingEntries.push(entry);
    } else if (!reached.has(entry.path)) {
      reached.set(entry.path, [entry.path]);
      queue.push(entry.path);
    }
  }

  while (queue.length > 0) {
    const current = /** @type {string} */ (queue.shift());
    const kind = kindOf(current, packageIsModule);
    if (kind === 'leaf') {
      continue;
    }
    const chain = /** @type {string[]} */ (reached.get(current));
    let source;
    try {
      source = readText(current);
    } catch (error) {
      throw new UnreadableError(`cannot read ${current}: ${error instanceof Error ? error.message : String(error)}`);
    }
    for (const spec of relativeSpecifiers(preProcess, source)) {
      const candidates = candidatesFor(current, spec, kind);
      const hit = candidates.find((candidate) => packed.has(candidate));
      if (hit === undefined) {
        unresolved.push({
          from: current,
          spec,
          target: candidates[0] ?? posix.normalize(posix.join(posix.dirname(current), spec)),
          onDisk: candidates.some((candidate) => existsOnDisk(candidate)),
          chain,
        });
      } else if (!reached.has(hit)) {
        reached.set(hit, [...chain, hit]);
        queue.push(hit);
      }
    }
  }

  return { entries, reached: reached.size, packed: packed.size, unresolved, missingEntries };
}

/**
 * The top-level directories that hold unpacked-but-existing targets: what to
 * add to `files`.
 *
 * @param {Unresolved[]} unresolved
 * @returns {string[]}
 */
export function directoriesToShip(unresolved) {
  const directories = new Set();
  for (const item of unresolved) {
    if (item.onDisk && item.target.includes('/')) {
      directories.add(`${item.target.split('/')[0]}/`);
    }
  }
  return [...directories].sort();
}

/**
 * @typedef {{
 *   packList: (root: string) => string[],
 *   readText: (absolutePath: string) => string,
 *   exists: (absolutePath: string) => boolean,
 *   loadScanner: () => Promise<(text: string) => { importedFiles: Array<{ fileName: string }> }>,
 *   out: (line: string) => void,
 * }} Deps
 */

/** @returns {Promise<(text: string) => { importedFiles: Array<{ fileName: string }> }>} */
async function loadTypeScriptScanner() {
  try {
    const ts = (await import('typescript')).default;
    return (text) => ts.preProcessFile(text, true, true);
  } catch (error) {
    throw new UnreadableError(`the typescript package is needed to scan imports and could not be loaded: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** @type {Deps} */
export const processDeps = {
  packList: readPackList,
  readText: (absolutePath) => readFileSync(absolutePath, 'utf8'),
  exists: (absolutePath) => existsSync(absolutePath),
  loadScanner: loadTypeScriptScanner,
  out: (line) => process.stdout.write(`${line}\n`),
};

/**
 * @param {Deps} deps
 * @param {string} path absolute path of `package.json`
 * @returns {Record<string, unknown>}
 */
function readManifest(deps, path) {
  try {
    const parsed = JSON.parse(deps.readText(path));
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('not a JSON object');
    }
    return parsed;
  } catch (error) {
    throw new UnreadableError(`cannot read the manifest ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * @param {string[]} argv
 * @returns {{ ok: true, root: string } | { ok: false, error: string }}
 */
export function parseArgs(argv) {
  let root = 'dist';
  for (let i = 0; i < argv.length; i += 2) {
    if (argv[i] !== '--root') {
      return { ok: false, error: `unknown argument ${argv[i]}` };
    }
    const value = argv[i + 1];
    if (value === undefined || value === '') {
      return { ok: false, error: '--root needs a directory' };
    }
    root = value;
  }
  return { ok: true, root };
}

/**
 * @param {string[]} argv
 * @param {Deps} deps
 * @returns {Promise<number>} one of {@link EXIT}
 */
export async function main(argv, deps) {
  const args = parseArgs(argv);
  if (!args.ok) {
    deps.out(`USAGE ${args.error}. Usage: package-contents.mjs [--root dist]`);
    return EXIT.USAGE;
  }
  const root = resolve(args.root);
  /** @param {string} relative */
  const absolute = (relative) => resolve(root, ...relative.split('/'));
  try {
    const manifest = readManifest(deps, absolute('package.json'));
    const packList = deps.packList(root).map((path) => path.split(sep).join('/'));
    const preProcess = await deps.loadScanner();
    const report = checkPackage({
      manifest,
      packList,
      readText: (path) => deps.readText(absolute(path)),
      existsOnDisk: (path) => deps.exists(absolute(path)),
      preProcess,
    });
    if (report.entries.length === 0) {
      throw new UnreadableError('the manifest declares no concrete entry (main, module, types or exports)');
    }
    deps.out(`package-contents: ${report.entries.length} entries (${report.entries.map((e) => e.path).join(', ')}); ${report.reached} of ${report.packed} packed files reached; ${report.unresolved.length} unresolved imports; ${report.missingEntries.length} entries not packed`);
    for (const entry of report.missingEntries) {
      deps.out(`MISSING ENTRY ${entry.path} (manifest field ${entry.field}) is not in the pack list`);
    }
    for (const item of report.unresolved) {
      const why = item.onDisk ? 'exists in the build output but is excluded from the pack list by package-npm.json "files"' : 'does not exist in the build output';
      deps.out(`MISSING ${item.target}: required as '${item.spec}' by ${item.from} — ${why}. Reached via ${item.chain.join(' -> ')}`);
    }
    const ship = directoriesToShip(report.unresolved);
    if (ship.length > 0) {
      deps.out(`Add to package-npm.json "files": ${ship.join(', ')}`);
    }
    if (report.unresolved.length > 0 || report.missingEntries.length > 0) {
      return EXIT.MISSING;
    }
    deps.out('COMPLETE: every relative import reachable from an entry resolves inside the pack list.');
    return EXIT.COMPLETE;
  } catch (error) {
    if (error instanceof UnreadableError) {
      deps.out(`UNKNOWN ${error.message}`);
      return EXIT.UNKNOWN;
    }
    throw error;
  }
}

const invokedPath = process.argv[1];
if (invokedPath !== undefined && import.meta.url === pathToFileURL(invokedPath).href) {
  process.exitCode = await main(process.argv.slice(2), processDeps);
}
