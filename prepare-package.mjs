import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Global Namespace
const GLOBAL_NAMESPACE = process.env.GLOBAL_NAMESPACE || 'adaptic';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Recursively retrieves all file paths under the given directory.
 * @param {string} dir - The starting directory.
 * @returns {string[]} - Array of file paths.
 */
function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

/**
 * Returns all JavaScript files in a directory.
 * (Used for generating documentation; assumes files end with .mjs.)
 * @param {string} dir - The directory path.
 * @returns {string[]} - Array of filenames.
 */
function getJavaScriptFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return [];
  }
  const files = fs.readdirSync(dir);
  return files.filter((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    return stat.isFile() && file.endsWith('.mjs') && !file.includes('index');
  });
}

/**
 * Converts the first character of the string to lowercase.
 * @param {string} string - The input string.
 * @returns {string} - The modified string.
 */
function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The input string.
 * @returns {string} - The capitalized string.
 */
export function capitalizeFirstLetter(str) {
  if (!str) {
    throw new Error('Model name is undefined');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a Markdown section documenting each model and its CRUD resolvers.
 * @returns {string} - The generated Markdown section.
 */
function generateModelsSection() {
  const modelFiles = getJavaScriptFiles(modelsDir);
  const enumFiles = getJavaScriptFiles(enumsDir);

  // Extract model and enum names (without the .mjs extension)
  const models = modelFiles.map((file) => path.basename(file, '.mjs'));
  const enums = enumFiles.map((file) => path.basename(file, '.mjs'));

  let section = `### Model TypeStrings, Types, and available CRUD Resolvers\n\n`;
  section += `The \`@adaptic/backend-legacy\` package includes a comprehensive set of CRUD (Create, Read, Update, Delete) resolvers for each of your models. Each model has the following functions (available directly under the \`${GLOBAL_NAMESPACE}\` namespace) and types (under the \`types\` namespace):\n\n`;
  section += `| Model Name | TypeString | Type | CRUD Resolvers |\n`;
  section += `|------------|------------|------------|-----------------|\n`;

  models.forEach((model) => {
    const ModelName = model.charAt(0).toUpperCase() + model.slice(1);
    const typeName = `types.${ModelName}`;
    const typeString = `typeStrings.${ModelName}`;
    const crudResolvers = `\`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.create\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.createMany\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.update\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.delete\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.get\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(
      ModelName
    )}.getAll\`, \`${GLOBAL_NAMESPACE}.${lowerCaseFirstLetter(ModelName)}.findMany\``;
    section += `| ${ModelName} | \`${typeString}\` | \`${typeName}\` | ${crudResolvers} |\n`;
  });

  section += `\n### Enums\n\n`;
  section += `The following enums are available for use under the \`enums\` namespace :\n\n`;
  section += `| Enum Name |\n`;
  section += `|-----------|\n`;
  enums.forEach(async (enumName) => {
    // Dynamic import to retrieve enum keys (for documentation only)
    // (Note: dynamic import here returns a Promise in ESM; if needed, adjust for async.)
    const enumValues = Object.keys(
      await import(path.join(enumsDir, `${enumName}.mjs`))
    );
    section += `| ${enumName} |\n`;
  });

  return section;
}

/**
 * Helper: Reads a file, applies a set of replacements, and writes it back.
 * @param {string} filePath - The path to the file.
 * @param {Array<{regex: RegExp, replacement: string, description: string}>} replacements - Array of replacement rules.
 */
function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  replacements.forEach(({ regex, replacement, description }) => {
    const newContent = content.replace(regex, replacement);
    if (newContent !== content) {
      updated = true;
      console.log(`Updated ${description} in ${filePath}`);
      content = newContent;
    }
  });
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

// -----------------------------------------------------------------------------
// Paths
// -----------------------------------------------------------------------------

const projectRoot = __dirname;
const distDir = path.join(projectRoot, 'dist');
const readmePath = path.join(distDir, 'README.md');
// The ESM (formerly server) folder will now be named "esm"
const esmDir = path.join(distDir, 'esm');
// Models & enums remain in their generated subfolders
const modelsDir = path.join(
  distDir,
  'generated',
  'typegraphql-prisma',
  'models'
);
const enumsDir = path.join(distDir, 'generated', 'typegraphql-prisma', 'enums');

// -----------------------------------------------------------------------------
// Step 0: Rename "server" folder to "esm" (if it exists)
// -----------------------------------------------------------------------------
try {
  const serverDir = path.join(distDir, 'server');
  if (fs.existsSync(serverDir)) {
    fs.renameSync(serverDir, esmDir);
    console.log('Renamed "server" folder to "esm".');
  } else {
    console.log(
      'No "server" folder found; assuming "esm" folder already exists.'
    );
  }
} catch (err) {
  console.error('Error renaming "server" folder to "esm":', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 1: Copy package-npm.json and README-npm.md to dist as package.json and README.md
// -----------------------------------------------------------------------------
try {
  fs.copyFileSync(
    path.join(projectRoot, 'package-npm.json'),
    path.join(distDir, 'package.json')
  );
  fs.copyFileSync(path.join(projectRoot, 'README-npm.md'), readmePath);
  console.log('Copied package.json and README.md to dist.');
} catch (err) {
  console.error('Error copying package.json or README.md:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 2: Update package.json exports for ESM and CJS (including types)
// -----------------------------------------------------------------------------
try {
  const packageJsonPath = path.join(distDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.type = 'module'; // Set package as ESM by default

  // With this configuration:
  // - Files in the root (non‑esm) are renamed to .cjs (CommonJS).
  // - Files in the esm folder are renamed to .mjs (ESM).
  packageJson.exports = {
    '.': {
      import: './esm/index.mjs',
      require: './index.cjs',
      types: './index.d.ts',
    },
    './*': {
      import: './esm/*.mjs',
      require: './*.cjs',
      types: './*.d.ts',
    },
  };

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );
  console.log('Updated package.json exports for ESM and CJS, including types.');
} catch (err) {
  console.error('Error updating package.json exports:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 3: Rename files based on location
//   • Files in dist/esm: rename .js → .mjs (ESM)
//   • All other files in dist (excluding esm): rename .js → .cjs (CJS)
// -----------------------------------------------------------------------------

// Step 3a: Process files in the esm folder
try {
  if (fs.existsSync(esmDir)) {
    const esmFiles = getFilesRecursively(esmDir);
    esmFiles.forEach((file) => {
      if (file.endsWith('.js')) {
        const newFile = file.replace(/\.js$/, '.mjs');
        fs.renameSync(file, newFile);
        console.log(`Renamed ${file} to ${newFile} (ESM in esm folder).`);
      }
    });
  } else {
    console.log('No esm folder found in dist.');
  }
} catch (err) {
  console.error('Error processing dist/esm:', err);
  process.exit(1);
}

// Step 3b: Process all other files in dist (exclude those under esm)
try {
  const allFiles = getFilesRecursively(distDir);
  // Exclude files that start with the esm folder path
  const cjsFiles = allFiles.filter(
    (file) => !file.startsWith(esmDir) && file.endsWith('.js')
  );
  cjsFiles.forEach((file) => {
    const newFile = file.replace(/\.js$/, '.cjs');
    fs.renameSync(file, newFile);
    console.log(`Renamed ${file} to ${newFile} (CJS in non-esm folder).`);
  });
} catch (err) {
  console.error('Error processing dist for CJS files:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 4: Update import paths in entry files
//   • For index.cjs in dist, update generated/typeStrings import to use .cjs
//   • For esm/index.mjs, update generated/typeStrings import to use .mjs
// -----------------------------------------------------------------------------

try {
  const esmIndexPath = path.join(esmDir, 'index.mjs');
  if (fs.existsSync(esmIndexPath)) {
    let content = fs.readFileSync(esmIndexPath, 'utf8');
    content = content.replace(
      /\.\/generated\/typeStrings\/index/g,
      './generated/typeStrings/index.mjs'
    );
    fs.writeFileSync(esmIndexPath, content, 'utf8');
    console.log(
      'Updated import in esm/index.mjs for "./generated/typeStrings/index" to use .mjs extension.'
    );
  } else {
    console.log('esm/index.mjs not found, skipping update for esm/index.mjs.');
  }
} catch (err) {
  console.error('Error updating import in esm/index.mjs:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 5: Update README.md with the Models and CRUD Resolvers section
// -----------------------------------------------------------------------------
try {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  // Remove any existing Models and CRUD Resolvers section
  readmeContent = readmeContent.replace(
    /### Models and CRUD Resolvers[\s\S]*?(?=###|$)/,
    ''
  );
  // Append the new section
  readmeContent += `\n${generateModelsSection()}\n`;
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log('Updated README.md with Models and CRUD Resolvers section.');
} catch (err) {
  console.error('Error updating README.md:', err);
  process.exit(1);
}

// Update all references in README.md to match GLOBAL_NAMESPACE
try {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  readmeContent = readmeContent.replace(/adaptic/g, GLOBAL_NAMESPACE);
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log('Updated README.md with GLOBAL_NAMESPACE (lowercase).');
} catch (err) {
  console.error('Error updating README.md (lowercase):', err);
  process.exit(1);
}

try {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  readmeContent = readmeContent.replace(
    /Adaptic/g,
    capitalizeFirstLetter(GLOBAL_NAMESPACE)
  );
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log('Updated README.md with GLOBAL_NAMESPACE (capitalized).');
} catch (err) {
  console.error('Error updating README.md (capitalized):', err);
  process.exit(1);
}

try {
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  readmeContent = readmeContent.replace(
    /ADAPTIC/g,
    GLOBAL_NAMESPACE.toUpperCase()
  );
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log('Updated README.md with GLOBAL_NAMESPACE (uppercase).');
} catch (err) {
  console.error('Error updating README.md (uppercase):', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 6: Update internal import/require statements in built files
//   • In .mjs files, ensure relative imports include a .mjs extension.
//   • In .cjs files, update require() calls to include a .cjs extension.
// -----------------------------------------------------------------------------

// 6a-0: Specifically update the imports in index.mjs which is causing the server issue
try {
  const indexMjsPath = path.join(esmDir, 'index.mjs');
  if (fs.existsSync(indexMjsPath)) {
    let content = fs.readFileSync(indexMjsPath, 'utf8');

    // Update the specific client import in index.mjs
    content = content.replace(
      /export\s+\{\s*([^}]*)\s*\}\s+from\s+(['"])\.\/client\2;/g,
      'export { $1 } from "./client.mjs";'
    );

    // Update the type imports in index.mjs
    content = content.replace(
      /export\s+type\s+\{\s*([^}]*)\s*\}\s+from\s+(['"])\.\/client\2;/g,
      'export type { $1 } from "./client.mjs";'
    );

    // Update the typeStrings import in index.mjs
    content = content.replace(
      /export\s+\*\s+from\s+(['"])\.\/generated\/typeStrings\/index\1;/g,
      'export * from "./generated/typeStrings/index.mjs";'
    );

    // Update the enums import in index.mjs (export * as enums from ...)
    content = content.replace(
      /export\s+\*\s+as\s+enums\s+from\s+(['"])\.\/generated\/typegraphql-prisma\/enums\/index\1;/g,
      'export * as enums from "./generated/typegraphql-prisma/enums/index.mjs";'
    );

    // Fix directory import for resolvers/custom to include /index.mjs
    content = content.replace(
      /export\s+\*\s+from\s+(['"])\.\/resolvers\/custom\1;/g,
      'export * from "./resolvers/custom/index.mjs";'
    );

    // Also fix if it already has /index but missing .mjs
    content = content.replace(
      /export\s+\*\s+from\s+(['"])\.\/resolvers\/custom\/index\1;/g,
      'export * from "./resolvers/custom/index.mjs";'
    );

    fs.writeFileSync(indexMjsPath, content, 'utf8');
    console.log('Updated imports in esm/index.mjs');
  } else {
    console.log('esm/index.mjs not found, skipping update for imports.');
  }
} catch (err) {
  console.error('Error updating imports in esm/index.mjs:', err);
  process.exit(1);
}

// 6a: Update import statements in .mjs files (including index.mjs but excluding other known entry files)
try {
  const mjsFiles = getFilesRecursively(distDir).filter((file) =>
    file.endsWith('.mjs')
  );
  mjsFiles.forEach((file) => {
    const baseName = path.basename(file);
    // Don't skip index.mjs since we need to update its imports too
    if (
      ['utils.mjs', 'client.mjs', 'prismaClient.mjs'].includes(baseName) &&
      baseName !== 'index.mjs'
    ) {
      return;
    }
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
      return;
    }
    // Update relative imports to include the .mjs extension (only if not already ending with .mjs)
    // Matches both ./ and ../ patterns (any number of ../)
    let updatedContent = content.replace(
      /import\s+((?:\*\s+as\s+\w+)|(?:\{[^}]+\})|(?:\w+))\s+from\s+(['"])(\.\.?\/[^'"]+)\2;/g,
      (match, p1, p2, p3) => {
        // Skip if already has .mjs extension
        if (p3.endsWith('.mjs')) return match;
        return `import ${p1} from ${p2}${p3}.mjs${p2};`;
      }
    );

    // Update relative re-exports to include the .mjs extension (export { X } from './Y')
    // Matches both ./ and ../ patterns (any number of ../)
    updatedContent = updatedContent.replace(
      /export\s+\{\s*([^}]+)\s*\}\s+from\s+(['"])(\.\.?\/[^'"]+)\2;/g,
      (match, p1, p2, p3) => {
        // Skip if already has .mjs extension
        if (p3.endsWith('.mjs')) return match;
        return `export { ${p1} } from ${p2}${p3}.mjs${p2};`;
      }
    );

    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated relative imports in ${file}`);
  });
  console.log('Updated import statements in .mjs files.');
} catch (err) {
  console.error('Error updating import statements in .mjs files:', err);
  process.exit(1);
}

// 6b: Update specific import in esm/client.mjs for "./getToken" → "./getToken.mjs"
try {
  const clientMjsPath = path.join(esmDir, 'client.mjs');
  updateFile(clientMjsPath, [
    {
      regex: /import\s+{ getToken }\s+from\s+(['"])\.\/getToken\1;/g,
      replacement: 'import { getToken } from "./getToken.mjs";',
      description: 'getToken import',
    },
  ]);
} catch (err) {
  console.error('Error updating import in esm/client.mjs for getToken:', err);
  process.exit(1);
}

// 6c: Update specific import in esm/client.mjs for "./apollo-client.server" → "./apollo-client.server.mjs"
try {
  const clientMjsPath = path.join(esmDir, 'client.mjs');
  updateFile(clientMjsPath, [
    {
      regex:
        /import\s+({[^}]*}|(?:\*\s+as\s+\w+)|\w+)\s+from\s+(['"])(\.\/apollo-client\.server)(?!\.mjs)(['"]);?/g,
      replacement: 'import $1 from $2./apollo-client.server.mjs$4;',
      description: 'apollo-client.server import',
    },
    {
      regex:
        /return\s*\(\s*await\s*import\s*\(\s*(['"])(\.\/apollo-client\.server)(?!\.mjs)(['"])\s*\)\s*\)/g,
      replacement: 'return (await import($1./apollo-client.server.mjs$3))',
      description: 'apollo-client.server dynamic import',
    },
  ]);
} catch (err) {
  console.error(
    'Error updating import in esm/client.mjs for apollo-client.server:',
    err
  );
  process.exit(1);
}

// 6d: Update specific import in esm/client.mjs for "./apollo-client.client" → "./apollo-client.client.mjs"
try {
  const clientMjsPath = path.join(esmDir, 'client.mjs');
  updateFile(clientMjsPath, [
    {
      regex:
        /import\s+({[^}]*}|(?:\*\s+as\s+\w+)|\w+)\s+from\s+(['"])(\.\/apollo-client\.client)(?!\.mjs)(['"]);?/g,
      replacement: 'import $1 from $2./apollo-client.client.mjs$4;',
      description: 'apollo-client.client import',
    },
    {
      regex:
        /return\s*\(\s*await\s*import\s*\(\s*(['"])(\.\/apollo-client\.client)(?!\.mjs)(['"])\s*\)\s*\)/g,
      replacement: 'return (await import($1./apollo-client.client.mjs$3))',
      description: 'apollo-client.client dynamic import',
    },
  ]);
} catch (err) {
  console.error(
    'Error updating import in esm/client.mjs for apollo-client.client:',
    err
  );
  process.exit(1);
}

// 6e: Update require() calls in .cjs files (excluding known files)
try {
  const cjsFiles = getFilesRecursively(distDir).filter((file) =>
    file.endsWith('.cjs')
  );
  cjsFiles.forEach((file) => {
    const baseName = path.basename(file);
    if (['utils.cjs', 'client.cjs', 'prismaClient.cjs'].includes(baseName)) {
      return;
    }
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
      return;
    }
    const updatedContent = content.replace(
      /require\s*\(\s*(['"])\.\/([^'"]+)(?!\.cjs)(['"])\s*\)/g,
      (match, p1, p2, p3) => `require(${p1}./${p2}.cjs${p3})`
    );
    fs.writeFileSync(file, updatedContent, 'utf8');
    console.log(`Updated require() calls in ${file}`);
  });
  console.log('Updated require() statements in .cjs files.');
} catch (err) {
  console.error('Error updating require() statements in .cjs files:', err);
  process.exit(1);
}

// 6e-2: Extension-fix ALL relative require() specifiers in .cjs files.
//
// Step 6e only matches same-directory specifiers AND excludes
// utils/client/prismaClient.cjs (blanket-append would corrupt their package
// imports), with 6f-6h hand-patching three specs it then missed others
// (client.cjs/prismaClient.cjs "./utils/logger"). Parent-relative
// "../../generated/..." requires from the custom resolvers were never
// rewritten at all. In a "type": "module" package Node's CJS
// resolver never auto-appends .cjs, so the published CJS entry
// (index.cjs → resolvers/custom/index.cjs) threw MODULE_NOT_FOUND for every
// consumer — broken in every published version through 0.0.1002, dormant
// only because the engine/app consume the ESM surface. Existence-guarded:
// a specifier is rewritten only when the resolved "<target>.cjs" (or
// "<target>/index.cjs") actually exists in dist, so a spec that already
// resolves (json, explicit extension, package import) is never touched.
try {
  const cjsFiles = getFilesRecursively(distDir).filter((file) =>
    file.endsWith('.cjs')
  );
  cjsFiles.forEach((file) => {
    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (err) {
      console.error(`Error reading file ${file}:`, err);
      return;
    }
    const dir = path.dirname(file);
    let changed = false;
    const updatedContent = content.replace(
      /require\s*\(\s*(['"])((?:\.\/|(?:\.\.\/)+)[^'"]+)\1\s*\)/g,
      (match, quote, spec) => {
        if (/\.(cjs|mjs|js|json|node)$/.test(spec)) return match;
        const target = path.resolve(dir, spec);
        if (fs.existsSync(`${target}.cjs`)) {
          changed = true;
          return `require(${quote}${spec}.cjs${quote})`;
        }
        if (fs.existsSync(path.join(target, 'index.cjs'))) {
          changed = true;
          return `require(${quote}${spec}/index.cjs${quote})`;
        }
        return match;
      }
    );
    if (changed) {
      fs.writeFileSync(file, updatedContent, 'utf8');
      console.log(`Extension-fixed parent-relative require() in ${file}`);
    }
  });
  console.log('Extension-fixed parent-relative require() specifiers.');
} catch (err) {
  console.error('Error extension-fixing parent-relative require():', err);
}

// 6f: Update specific require() in client.cjs for "./getToken" → "./getToken.cjs"
try {
  const clientCjsPath = path.join(distDir, 'client.cjs');
  updateFile(clientCjsPath, [
    {
      regex: /require\s*\(\s*(['"])\.\/getToken\1\s*\)/g,
      replacement: 'require($1./getToken.cjs$1)',
      description: 'getToken require',
    },
  ]);
} catch (err) {
  console.error('Error updating require() in client.cjs for getToken:', err);
  process.exit(1);
}

// 6g: Update specific require() in client.cjs for "./apollo-client.server" → "./apollo-client.server.cjs"
try {
  const clientCjsPath = path.join(distDir, 'client.cjs');
  updateFile(clientCjsPath, [
    {
      regex:
        /require\s*\(\s*(['"])(\.\/apollo-client\.server)(?!\.cjs)(['"])\s*\)/g,
      replacement: 'require($1./apollo-client.server.cjs$3)',
      description: 'apollo-client.server require',
    },
  ]);
} catch (err) {
  console.error(
    'Error updating require() in client.cjs for apollo-client.server:',
    err
  );
  process.exit(1);
}

// 6h: Update specific require() in client.cjs for "./apollo-client.client" → "./apollo-client.client.cjs"
try {
  const clientCjsPath = path.join(distDir, 'client.cjs');
  updateFile(clientCjsPath, [
    {
      regex:
        /require\s*\(\s*(['"])(\.\/apollo-client\.client)(?!\.cjs)(['"])\s*\)/g,
      replacement: 'require($1./apollo-client.client.cjs$3)',
      description: 'apollo-client.client require',
    },
  ]);
} catch (err) {
  console.error(
    'Error updating require() in client.cjs for apollo-client.client:',
    err
  );
  process.exit(1);
}

// 6i: Update require() in apollo-client.server.mjs to use import syntax
try {
  const apolloClientServerMjsPath = path.join(
    esmDir,
    'apollo-client.server.mjs'
  );
  updateFile(apolloClientServerMjsPath, [
    {
      regex: /const pkg = require\("@apollo\/client"\);/g,
      replacement: 'import * as pkg from "@apollo/client";',
      description: 'apollo-client.server mjs require-to-import',
    },
    {
      regex:
        /const contextPkg = require\(['"]@apollo\/client\/link\/context\/context\.cjs['"]\);/g,
      replacement:
        'import * as contextPkg from "@apollo/client/link/context/context.cjs";',
      description: 'apollo-client.server contextPkg require-to-import',
    },
    {
      regex:
        /const errorPkg = require\(['"]@apollo\/client\/link\/error\/error\.cjs['"]\);/g,
      replacement:
        'import * as errorPkg from "@apollo/client/link/error/error.cjs";',
      description: 'apollo-client.server errorPkg require-to-import',
    },
  ]);
} catch (err) {
  console.error('Error updating require() in apollo-client.server.mjs:', err);
  process.exit(1);
}

// 6j: Update require() in apollo-client.client.mjs to use import syntax
try {
  const apolloClientClientMjsPath = path.join(
    esmDir,
    'apollo-client.client.mjs'
  );
  updateFile(apolloClientClientMjsPath, [
    {
      regex: /const pkg = require\("@apollo\/client"\);/g,
      replacement: 'import * as pkg from "@apollo/client";',
      description: 'apollo-client.client mjs require-to-import',
    },
  ]);
} catch (err) {
  console.error('Error updating require() in apollo-client.client.mjs:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 7: Replace all instances of "findUniqueOrThrow" with "findUnique" in resolvers
// -----------------------------------------------------------------------------
try {
  const resolversDir = path.join(
    distDir,
    'generated',
    'typegraphql-prisma',
    'resolvers'
  );
  const resolverFiles = getFilesRecursively(resolversDir);
  resolverFiles.forEach((file) => {
    if (/\.(mjs|cjs|js)$/.test(file)) {
      let content;
      try {
        content = fs.readFileSync(file, 'utf8');
      } catch (err) {
        console.error(`Error reading file ${file}:`, err);
        return;
      }
      const newContent = content.replace(/findUniqueOrThrow/g, 'findUnique');
      if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(
          `Replaced "findUniqueOrThrow" with "findUnique" in ${file}`
        );
      }
    }
  });
  console.log('Replaced "findUniqueOrThrow" with "findUnique" in resolvers.');
} catch (err) {
  console.error('Error replacing "findUniqueOrThrow" in resolvers:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 8: Ensure client.mjs exists and is properly referenced in index.mjs
// -----------------------------------------------------------------------------
try {
  const esmDir = path.join(distDir, 'esm');
  const indexMjsPath = path.join(esmDir, 'index.mjs');
  const clientMjsPath = path.join(esmDir, 'client.mjs');

  // Check if client.mjs exists, if not, look for client.js and rename it
  if (
    !fs.existsSync(clientMjsPath) &&
    fs.existsSync(path.join(esmDir, 'client.js'))
  ) {
    fs.renameSync(path.join(esmDir, 'client.js'), clientMjsPath);
    console.log('Renamed client.js to client.mjs');
  }

  // Make sure index.mjs references client.mjs with extension
  if (fs.existsSync(indexMjsPath)) {
    let content = fs.readFileSync(indexMjsPath, 'utf8');

    // Fix the client import in index.mjs (direct and forceful approach)
    if (content.includes('./client') && !content.includes('./client.mjs')) {
      content = content.replace(/['"]\.\/client['"]/g, '"./client.mjs"');
      fs.writeFileSync(indexMjsPath, content, 'utf8');
      console.log('Fixed client.mjs reference in index.mjs (forced method)');
    }
  }

  // Verify client.mjs exists, if not, create it
  if (!fs.existsSync(clientMjsPath)) {
    console.error(
      'ERROR: client.mjs still not found. Creating a placeholder to prevent runtime errors.'
    );
    // Get the content from client.ts to create client.mjs
    const clientTsPath = path.join(projectRoot, 'src', 'client.ts');
    if (fs.existsSync(clientTsPath)) {
      console.log('Using client.ts as source for client.mjs');
      const clientContent = fs.readFileSync(clientTsPath, 'utf8');
      // Convert the TypeScript to JavaScript (basic conversion)
      const jsContent = clientContent
        .replace(/import\s+type/g, '// import type')
        .replace(/export\s+type/g, '// export type')
        .replace(/:\s*\w+(\[\])?/g, '')
        .replace(/<[^>]+>/g, '');
      fs.writeFileSync(clientMjsPath, jsContent, 'utf8');
    } else {
      // Create a minimal client.mjs that exports the necessary functions
      console.log('Creating minimal client.mjs');
      const minimalContent = `// Minimal client.mjs placeholder
export const getApolloClient = async () => {
  throw new Error('ApolloClient not properly initialized. Check @adaptic/backend-legacy package.');
};

export const getApolloModules = async () => {
  throw new Error('ApolloModules not properly initialized. Check @adaptic/backend-legacy package.');
};

export const configureConnectionPool = () => {
  throw new Error('Connection pool not properly initialized. Check @adaptic/backend-legacy package.');
};

export const client = Promise.resolve(null);
`;
      fs.writeFileSync(clientMjsPath, minimalContent, 'utf8');
    }
  }

  // Ensure apollo-client.client.mjs and apollo-client.server.mjs exist too
  const apolloClientClientMjsPath = path.join(
    esmDir,
    'apollo-client.client.mjs'
  );
  const apolloClientServerMjsPath = path.join(
    esmDir,
    'apollo-client.server.mjs'
  );

  if (
    !fs.existsSync(apolloClientClientMjsPath) &&
    fs.existsSync(path.join(esmDir, 'apollo-client.client.js'))
  ) {
    fs.renameSync(
      path.join(esmDir, 'apollo-client.client.js'),
      apolloClientClientMjsPath
    );
    console.log('Renamed apollo-client.client.js to apollo-client.client.mjs');
  }

  if (
    !fs.existsSync(apolloClientServerMjsPath) &&
    fs.existsSync(path.join(esmDir, 'apollo-client.server.js'))
  ) {
    fs.renameSync(
      path.join(esmDir, 'apollo-client.server.js'),
      apolloClientServerMjsPath
    );
    console.log('Renamed apollo-client.server.js to apollo-client.server.mjs');
  }
} catch (err) {
  console.error(
    'Error ensuring client.mjs exists and is properly referenced:',
    err
  );
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 9: Comprehensive ESM import fix — resolve all remaining bare imports
// This catches anything missed by the specific fixes above, especially:
//   - Directory imports that need /index.mjs (not .mjs)
//   - export * from patterns
//   - export type patterns
//   - Any other from "./X" without proper extension
// -----------------------------------------------------------------------------

/**
 * Resolves an import path against the filesystem to determine the correct
 * .mjs extension or /index.mjs suffix.
 * @param {string} importPath - The relative import path from the source file.
 * @param {string} fileDir - The directory containing the importing file.
 * @returns {string} - The corrected import path.
 */
function resolveEsmImportPath(importPath, fileDir) {
  // Already has a recognized extension — check if it's correct
  if (/\.(mjs|js|cjs|json)$/.test(importPath)) {
    // Check for misapplied extension: ./foo.mjs where ./foo/ is actually a directory
    const withoutExt = importPath.replace(/\.(mjs|js|cjs)$/, '');
    const resolvedDir = path.resolve(fileDir, withoutExt);
    if (fs.existsSync(resolvedDir) && fs.statSync(resolvedDir).isDirectory()) {
      // The base path is a directory — fix to /index.mjs
      return `${withoutExt}/index.mjs`;
    }
    return importPath;
  }

  // No extension — resolve against filesystem
  const resolvedPath = path.resolve(fileDir, importPath);

  // Check if it's a directory
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    return `${importPath}/index.mjs`;
  }

  // It's a file — add .mjs extension
  return `${importPath}.mjs`;
}

/**
 * Fix all relative import/export paths in a single .mjs file.
 * Handles: import, export, export *, export * as, export type, re-exports.
 * @param {string} filePath - Absolute path to the .mjs file.
 * @returns {boolean} - Whether any changes were made.
 */
function fixMjsFileImports(filePath) {
  const fileDir = path.dirname(filePath);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content;

  // Fix all from "..." patterns with double quotes
  content = content.replace(/from "(\.\.?\/[^"]+)"/g, (match, importPath) => {
    const fixed = resolveEsmImportPath(importPath, fileDir);
    return fixed === importPath ? match : `from "${fixed}"`;
  });

  // Fix all from '...' patterns with single quotes
  content = content.replace(/from '(\.\.?\/[^']+)'/g, (match, importPath) => {
    const fixed = resolveEsmImportPath(importPath, fileDir);
    return fixed === importPath ? match : `from '${fixed}'`;
  });

  if (content !== before) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

/**
 * Recursively walk a directory and fix all .mjs file imports.
 * @param {string} dirPath - Directory to process.
 * @returns {number} - Number of files that were modified.
 */
function fixAllEsmImports(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  let fixedCount = 0;

  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.mjs')) {
        if (fixMjsFileImports(fullPath)) {
          fixedCount++;
        }
      }
    }
  }

  walkDir(dirPath);
  return fixedCount;
}

try {
  console.log('Running comprehensive ESM import fix on all .mjs files...');
  const fixedFileCount = fixAllEsmImports(esmDir);
  console.log(`Comprehensive ESM import fix: ${fixedFileCount} files updated.`);
} catch (err) {
  console.error('Error during comprehensive ESM import fix:', err);
  process.exit(1);
}

// -----------------------------------------------------------------------------
// Step 10: Finalize Build
// -----------------------------------------------------------------------------
console.log('Package preparation completed successfully.');
