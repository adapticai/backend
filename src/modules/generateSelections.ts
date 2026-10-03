import { promises as fs } from 'fs';
import path from 'path';
import { getDMMF } from '@prisma/internals';
import { DMMF } from '@prisma/generator-helper';
import { logger } from '../utils/logger';
import { isServerOnlyModel } from '../config/server-only-models';

const SCHEMA_PATH = path.join(__dirname, '../../prisma/schema.prisma');
const OUTPUT_DIR = path.join(__dirname, '../../src/generated/selectionSets');
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.ts');
const MAX_DEPTH = 4;

interface MetaTags {
  GQL?: {
    SKIP?: boolean;
    EXCLUDE?: string[];
    INCLUDE?: string[];
    MAX_DEPTH?: number;
  };
}

const isScalarType = (typeName: string, enumNames: Set<string>): boolean => {
  const scalarTypes = new Set([
    'Int',
    'String',
    'Float',
    'Boolean',
    'DateTime',
    'Json',
    'Bytes',
    'BigInt',
    'Decimal',
  ]);
  return scalarTypes.has(typeName) || enumNames.has(typeName);
};

const parseMetaTags = (documentation?: string): MetaTags => {
  const meta: MetaTags = { GQL: {} };
  if (!documentation) return meta;

  const patterns = {
    SKIP: /GQL\.SKIP=(\w+)/,
    EXCLUDE: /GQL\.EXCLUDE=\[(.*?)\]/,
    INCLUDE: /GQL\.INCLUDE=\[(.*?)\]/,
    MAX_DEPTH: /GQL\.MAX_DEPTH=(\d+)/,
  };

  // Parse SKIP
  const skipMatch = documentation.match(patterns.SKIP);
  if (skipMatch) {
    meta.GQL!.SKIP = skipMatch[1].toLowerCase() === 'true';
  }

  // Parse EXCLUDE
  const excludeMatch = documentation.match(patterns.EXCLUDE);
  if (excludeMatch) {
    meta.GQL!.EXCLUDE = excludeMatch[1]
      .split(',')
      .map((field) => field.trim().replace(/['"]/g, ''))
      .filter((field) => field.length > 0);
  }

  // Parse INCLUDE
  const includeMatch = documentation.match(patterns.INCLUDE);
  if (includeMatch) {
    meta.GQL!.INCLUDE = includeMatch[1]
      .split(',')
      .map((field) => field.trim().replace(/['"]/g, ''))
      .filter((field) => field.length > 0);
  }

  // Parse MAX_DEPTH
  const maxDepthMatch = documentation.match(patterns.MAX_DEPTH);
  if (maxDepthMatch) {
    meta.GQL!.MAX_DEPTH = parseInt(maxDepthMatch[1], 10);
  }

  return meta;
};

const generateSelectionSet = (
  model: DMMF.Model,
  dmmf: DMMF.Document,
  currentDepth: number,
  maxDepth: number,
  enumNames: Set<string>,
  ancestors: Set<string> = new Set(),
  cache: Map<string, string> = new Map(),
  parentExcludes: string[] = []
): string => {
  // Check cache first
  const cacheKey = `${model.name}-${currentDepth}-${Array.from(ancestors).join('-')}-${parentExcludes.join(',')}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // Check depth
  if (currentDepth > maxDepth) {
    return 'id';
  }

  // Prevent circular references
  if (ancestors.has(model.name)) {
    return 'id';
  }

  const newAncestors = new Set(ancestors).add(model.name);
  const fields: string[] = [];
  const indent = '  '.repeat(currentDepth);

  // Filter fields based on parent's EXCLUDE directive
  const availableFields = model.fields.filter(
    (field) => !parentExcludes.includes(field.name)
  );

  for (const field of availableFields) {
    const meta = parseMetaTags(field.documentation);

    // Skip if explicitly marked
    if (meta.GQL?.SKIP) continue;

    // Handle included/excluded fields
    if (meta.GQL?.INCLUDE && !meta.GQL.INCLUDE.includes(field.name)) continue;
    if (meta.GQL?.EXCLUDE?.includes(field.name)) continue;

    // Handle scalar types
    if (isScalarType(field.type, enumNames)) {
      fields.push(`${indent}${field.name}`);
      continue;
    }

    // Handle relations
    const relatedModel = dmmf.datamodel.models.find(
      (m) => m.name === field.type
    );
    if (!relatedModel) continue;

    // Pass down any EXCLUDE fields from the current field's meta
    const fieldExcludes = meta.GQL?.EXCLUDE || [];
    const fieldMaxDepth = meta.GQL?.MAX_DEPTH ?? maxDepth;

    const nestedSelection = generateSelectionSet(
      relatedModel,
      dmmf,
      currentDepth + 1,
      fieldMaxDepth,
      enumNames,
      newAncestors,
      cache,
      fieldExcludes // Pass excluded fields to nested selection
    );

    if (nestedSelection.trim()) {
      fields.push(`${indent}${field.name} {\n${nestedSelection}\n${indent}}`);
    }
  }

  const result = fields.join('\n');
  cache.set(cacheKey, result);
  return result;
};

const main = async () => {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');
    const dmmf = await getDMMF({ datamodel: schema });
    const enumNames = new Set(dmmf.datamodel.enums.map((e) => e.name));
    const cache = new Map<string, string>();
    // Server-only models have no GraphQL type to select from.
    const models = dmmf.datamodel.models.filter(
      (model) => !isServerOnlyModel(model.name)
    );

    // Generate selection sets
    for (const model of models) {
      const selectionSet = generateSelectionSet(
        model,
        dmmf,
        1,
        MAX_DEPTH,
        enumNames,
        new Set(),
        cache
      );
      const fileName = `${model.name}.ts`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      const fileContent = `export const ${model.name} = \`\n${selectionSet}\n\`;\n`;
      await fs.writeFile(filePath, fileContent, 'utf-8');
    }

    // Generate index file
    const imports = models
      .map((model) => `import { ${model.name} } from './${model.name}';`)
      .join('\n');

    const exports = `export const selectionSets: Record<string, string> = {
${models.map((model) => `  ${model.name},`).join('\n')}
};\n\nexport default selectionSets;\n`;

    await fs.writeFile(INDEX_FILE, `${imports}\n\n${exports}`, 'utf-8');
  } catch (error) {
    logger.error('Error generating selection sets', { error: String(error) });
    process.exit(1);
  }
};

main();
