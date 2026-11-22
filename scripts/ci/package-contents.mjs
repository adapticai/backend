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
 * publish` makes), starts from every file a consumer can load by the package's
 * name, follows every relative `require()` / `import` / `export ... from` /
 * `import()` / `import type` through the files it reaches, and reports each
 * target that is not in the pack list.
 *
 * "Every file a consumer can load" is the manifest's concrete entries (`main`,
 * `module`, `types`, each non-wildcard `exports` target) plus every packed file
 * a wildcard `exports` target names. `"./*": { "require": "./*.cjs" }` makes
 * each packed `.cjs` its own public entry (`require('@adaptic/backend/getToken')`
 * loads `getToken.cjs`), so a broken import behind one of them is as much a
 * defect as one behind `main`; a check that started only from `main` would pass
 * a package whose subpaths throw.
 *
 * Each unresolved target carries the reason, because the remedies differ:
 *
 *   excluded         it is in the build output but `files` leaves it out: ship it,
 *                    or stop shipping the file that imports it
 *   not emitted      nothing in the build output answers the specifier: the
 *                    emitted import is wrong (a rewrite step) or the file was never built
 *   outside package  the specifier climbs above the package root, which in an
 *                    installed copy is `node_modules/`, not this repository
 *
 * Resolution follows the loader that will actually read the file:
 *
 *   .cjs   exact path, then `.js` / `.json` / `.node`, then `index.*` in a directory
 *   .mjs   exact path only (ES module specifiers are never extension-searched)
 *   .d.ts  `.d.ts` / `.d.mts` / `.d.cts` siblings of the specifier, then `index.d.ts`
 *
 * Specifiers are read with the TypeScript scanner, not a pattern, so an import
 * quoted inside a comment or a string is not an import. Bare specifiers
 * (`@prisma/client`, `node:fs`) are other packages' business and are skipped.
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
 * @typedef {{ field: string, path: string, wildcard: boolean }} Entry
 *   A file a consumer can load by the package's name, with the manifest field
 *   that makes it loadable. `wildcard` entries were found by matching a
 *   wildcard `exports` target against the pack list, so they are packed by
 *   construction; concrete entries are named outright and may not be.
 *
 * @typedef {'excluded' | 'not-emitted' | 'outside-package'} Reason
 *
 * @typedef {{
 *   from: string,
 *   spec: string,
 *   target: string,
 *   reason: Reason,
 *   chain: string[],
 * }} Unresolved
 *   One import with no target in the pack list. `target` is the package-relative
 *   path the loader would have tried first (for `outside-package`, the specifier
 *   resolved against the importer, which starts with `../`).
 *
 * @typedef {{
 *   entries: Entry[],
 *   reached: number,
 *   packed: number,
 *   unresolved: Unresolved[],
 *   missingEntries: Entry[],
 * }} Report
 */

/** Human-readable form of each {@link Reason}, for the failure lines. */
const REASON_TEXT = Object.freeze({
  excluded: 'exists in the build output but is excluded from the pack list by package-npm.json "files"',
  'not-emitted': 'does not exist in the build output: the emitted specifier is wrong or the file was never built',
  'outside-package': 'resolves above the package root, which in an installed copy is node_modules/, not this repository',
});

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
 * Every `exports` target string with the manifest field path that declares it
 * (`exports../*.require`). Condition objects and fallback arrays are walked;
 * `null` targets (a subpath deliberately closed) declare nothing.
 *
 * @param {unknown} exportsField
 * @returns {Array<{ field: string, target: string }>}
 */
function exportTargets(exportsField) {
  /** @type {Array<{ field: string, target: string }>} */
  const targets = [];
  /** @param {string} field @param {unknown} value */
  const walk = (field, value) => {
    if (typeof value === 'string') {
      targets.push({ field, target: value });
    } else if (Array.isArray(value)) {
      value.forEach((item) => walk(field, item));
    } else if (value !== null && typeof value === 'object') {
      Object.entries(value).forEach(([key, child]) => walk(`${field}.${key}`, child));
    }
  };
  walk('exports', exportsField);
  return targets;
}

/**
 * Matches package-relative paths against a wildcard `exports` target. Node
 * substitutes the subpath for the single `*`, and the substitution may contain
 * `/`, so `./*.cjs` names every `.cjs` at any depth.
 *
 * @param {string} target an `exports` target containing `*`
 * @returns {RegExp}
 */
export function wildcardPattern(target) {
  const [before, after] = posix.normalize(target).split('*', 2).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${before}(.+)${after ?? ''}$`);
}

/**
 * Every file a consumer can load by the package's name: the concrete entries
 * the manifest names (`main`, `module`, `types`, `typings`, each non-wildcard
 * `exports` target) and every packed file a wildcard `exports` target matches.
 * A concrete entry is listed even when it is not packed, so the caller can
 * report it; a wildcard only ever matches what is packed.
 *
 * @param {Record<string, unknown>} manifest
 * @param {string[]} packList paths npm would pack, `/`-separated
 * @returns {Entry[]}
 */
export function entryPoints(manifest, packList) {
  /** @type {Map<string, Entry>} */
  const found = new Map();
  /** @param {string} field @param {string} path @param {boolean} wildcard */
  const add = (field, path, wildcard) => {
    if (!found.has(path)) {
      found.set(path, { field, path, wildcard });
    }
  };
  for (const field of ['main', 'module', 'types', 'typings']) {
    const value = manifest[field];
    if (typeof value === 'string') {
      add(field, posix.normalize(value), false);
    }
  }
  /** @type {Array<{ field: string, pattern: RegExp }>} */
  const wildcards = [];
  for (const { field, target } of exportTargets(manifest.exports)) {
    if (target.includes('*')) {
      wildcards.push({ field, pattern: wildcardPattern(target) });
    } else {
      add(field, posix.normalize(target), false);
    }
  }
  for (const path of packList) {
    const match = wildcards.find(({ pattern }) => pattern.test(path));
    if (match !== undefined) {
      add(match.field, path, true);
    }
  }
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
  const entries = entryPoints(manifest, packList);
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
    }
  }

  /** Visits `current`: every relative import either resolves into the pack list or is recorded. */
  const visit = (/** @type {string} */ current) => {
    const kind = kindOf(current, packageIsModule);
    if (kind === 'leaf') {
      return;
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
        /** @type {Reason} */
        let reason = 'not-emitted';
        if (candidates.length === 0) {
          reason = 'outside-package';
        } else if (candidates.some((candidate) => existsOnDisk(candidate))) {
          reason = 'excluded';
        }
        unresolved.push({
          from: current,
          spec,
          target: candidates[0] ?? posix.normalize(posix.join(posix.dirname(current), spec)),
          reason,
          chain,
        });
      } else if (!reached.has(hit)) {
        reached.set(hit, [...chain, hit]);
        queue.push(hit);
      }
    }
  };

  /**
   * Breadth-first from `seeds`, recording for each newly reached file the chain
   * of imports that first reached it. Named entries are walked before wildcard
   * ones, so a file `main` reaches is reported with its chain from `main`
   * rather than as an entry of its own.
   */
  const walkFrom = (/** @type {Entry[]} */ seeds) => {
    for (const entry of seeds) {
      if (packed.has(entry.path) && !reached.has(entry.path)) {
        reached.set(entry.path, [entry.path]);
        queue.push(entry.path);
      }
    }
    while (queue.length > 0) {
      visit(/** @type {string} */ (queue.shift()));
    }
  };

  walkFrom(entries.filter((entry) => !entry.wildcard));
  walkFrom(entries.filter((entry) => entry.wildcard));

  return { entries, reached: reached.size, packed: packed.size, unresolved, missingEntries };
}

/**
 * What `files` would need to gain for the excluded targets to ship: the
 * top-level directory of a nested target, or the file itself at the root.
 * Only a suggestion: when the importer is the thing that should not ship,
 * excluding the importer is the fix instead.
 *
 * @param {Unresolved[]} unresolved
 * @returns {string[]}
 */
export function directoriesToShip(unresolved) {
  const directories = new Set();
  for (const item of unresolved) {
    if (item.reason === 'excluded') {
      directories.add(item.target.includes('/') ? `${item.target.split('/')[0]}/` : item.target);
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
      throw new UnreadableError('the manifest declares no entry (main, module, types or exports) that names a file');
    }
    const concrete = report.entries.filter((entry) => !entry.wildcard);
    const wildcard = report.entries.length - concrete.length;
    deps.out(`package-contents: ${concrete.length} named entries (${concrete.map((e) => e.path).join(', ')}) and ${wildcard} files loadable through wildcard exports; ${report.reached} of ${report.packed} packed files reached; ${report.unresolved.length} unresolved imports; ${report.missingEntries.length} named entries not packed`);
    for (const entry of report.missingEntries) {
      deps.out(`MISSING ENTRY ${entry.path} (manifest field ${entry.field}) is not in the pack list`);
    }
    for (const item of report.unresolved) {
      deps.out(`MISSING ${item.target}: required as '${item.spec}' by ${item.from} — ${REASON_TEXT[item.reason]}. Reached via ${item.chain.join(' -> ')}`);
    }
    const ship = directoriesToShip(report.unresolved);
    if (ship.length > 0) {
      deps.out(`Ship in package-npm.json "files" (or stop shipping their importers): ${ship.join(', ')}`);
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
