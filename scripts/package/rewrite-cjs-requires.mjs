// @ts-check
/**
 * Rewrite of the relative `require()` specifiers in the package's CommonJS
 * output, used by prepare-package.mjs after it renames tsc's `.js` output to
 * `.cjs`.
 *
 * tsc emits extensionless specifiers ("./Foo", "./resolvers/crud"). Node's
 * CommonJS resolver probes only `.js`, `.json` and `.node`, so once the files
 * are renamed every such specifier must name its target explicitly. Which
 * target is decided by what exists on disk: "<spec>.cjs" when a file of that
 * name exists, else "<spec>/index.cjs" when the specifier names a directory.
 * Appending ".cjs" without that check turns every directory import
 * ("./enums", "./models", "./<Model>/args") into a path that does not exist.
 * A specifier that already carries an extension, or whose target exists in
 * neither form, is left as written, so the package closure check
 * (scripts/ci/check-package-closure.mjs) reports it instead of a rewrite
 * hiding it behind a plausible-looking name.
 */
import path from 'node:path';

/** Specifiers that already name a loadable file. */
const HAS_EXTENSION = /\.(?:cjs|mjs|js|json|node)$/;

/** A relative `require("./x")` / `require('../../x')` call. */
const RELATIVE_REQUIRE = /require\s*\(\s*(['"])((?:\.\/|(?:\.\.\/)+)[^'"]+)\1\s*\)/g;

/**
 * Rewrite the relative require specifiers in one CommonJS file.
 *
 * @param {string} content The file's source.
 * @param {string} dir Absolute directory of the file, which specifiers resolve against.
 * @param {(absolutePath: string) => boolean} exists Whether a file exists at an absolute path.
 * @returns {{ content: string, changed: boolean }} The rewritten source and whether anything changed.
 */
export function rewriteCjsRequires(content, dir, exists) {
  let changed = false;
  const updated = content.replace(RELATIVE_REQUIRE, (match, quote, spec) => {
    if (HAS_EXTENSION.test(spec)) return match;
    const target = path.resolve(dir, spec);
    if (exists(`${target}.cjs`)) {
      changed = true;
      return `require(${quote}${spec}.cjs${quote})`;
    }
    if (exists(path.join(target, 'index.cjs'))) {
      changed = true;
      return `require(${quote}${spec}/index.cjs${quote})`;
    }
    return match;
  });
  return { content: updated, changed };
}
