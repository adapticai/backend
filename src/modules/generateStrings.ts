import { promises as fs } from 'fs';
import path from 'path';
import { getDMMF } from '@prisma/internals';
import { DMMF } from '@prisma/generator-helper';
import pluralize from 'pluralize';
import { logger } from '../utils/logger';

const SCHEMA_PATH = path.join(__dirname, '../../prisma/schema.prisma');
const OUTPUT_DIR = path.join(__dirname, '../../src/generated/typeStrings');
const INDEX_FILE = path.join(OUTPUT_DIR, 'index.ts');
const MAX_DEPTH = 5;

const EXCLUDED_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  'slug',
  'alpacaAccountId',
]);

const SCALAR_TYPE_MAP: { [key: string]: string } = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Decimal: 'number',
  Boolean: 'boolean',
  DateTime: 'Date',
  Json: 'any',
};

function schemaEnumToDatamodelEnum(se: DMMF.SchemaEnum): DMMF.DatamodelEnum {
  return {
    name: se.name,
    values: se.values.map((v) => ({ name: v, dbName: null })),
  };
}

const prismaFieldToTsType = (
  field: DMMF.Field,
  includedEnums: Set<string>,
  enumsMap: Map<string, DMMF.DatamodelEnum>
): string => {
  // If field is recognized as an enum or if enumsMap contains its type, treat it as enum
  if (field.kind === 'enum' || enumsMap.has(field.type)) {
    includedEnums.add(field.type);
    return field.type;
  }

  // Otherwise, handle scalars or objects
  if (field.kind === 'scalar') {
    return SCALAR_TYPE_MAP[field.type] || 'any';
  }

  if (field.kind === 'object') {
    return field.type;
  }

  return 'any';
};

const shouldExcludeField = (fieldName: string): boolean => {
  return (
    EXCLUDED_FIELDS.has(fieldName) ||
    fieldName === 'id' ||
    fieldName.endsWith('Id')
  );
};

/** Parsed values produced by parseMetaTags — booleans, single strings, or string arrays. */
type MetaTagValue = boolean | string | string[];

/** Parsed meta-tag map keyed by the directive name (e.g. GQL.SKIP, TYPESTRING.INCLUDE). */
type MetaTagMap = { [key: string]: MetaTagValue };

const parseMetaTags = (
  documentation?: string
): { meta: MetaTagMap; description: string } => {
  const meta: MetaTagMap = {};
  if (!documentation) return { meta, description: '' };

  const metaTagRegex = /([A-Z]+\.[A-Z]+)=((?:\[[^\]]+\])|(?:[^\s]+))/g;
  let match: RegExpExecArray | null;
  let description = documentation;

  while ((match = metaTagRegex.exec(documentation)) !== null) {
    const fullMatch = match[0];
    const key = match[1];
    const value = match[2];

    let parsedValue: MetaTagValue = value;
    if (value.toLowerCase() === 'true') parsedValue = true;
    else if (value.toLowerCase() === 'false') parsedValue = false;
    else if (value.startsWith('[') && value.endsWith(']')) {
      parsedValue = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/['"]/g, ''));
    } else {
      parsedValue = value.replace(/['"]/g, '');
    }

    meta[key] = parsedValue;
    description = description.replace(fullMatch, '').trim();
  }

  return { meta, description };
};

const generateEnumDeclarations = (enums: DMMF.DatamodelEnum[]): string => {
  let enumDeclarations = '';

  for (const enumObj of enums) {
    // Add enum documentation if available
    const enumDescription = enumObj.documentation
      ? `// ${enumObj.documentation}\n`
      : '';

    // Process each enum member
    const values = enumObj.values
      .map((v) => {
        const valueDocumentation =
          'documentation' in v && v.documentation
            ? `  /// ${v.documentation}\n`
            : '';
        return `${valueDocumentation}  ${v.name}`;
      })
      .join('\n\n');

    // Combine enum documentation and members
    enumDeclarations += `${enumDescription}enum ${enumObj.name} {\n${values}\n}\n\n`;
  }

  return enumDeclarations;
};

/**
 * Generates the TypeScript type string for a given Prisma model.
 * @param model - The Prisma model to process.
 * @param models - Map of all Prisma models.
 * @param enums - Map of all Prisma enums.
 * @param includedEnums - Set to track enums included in this type string.
 * @param depth - Current recursion depth.
 * @param ancestors - Set to track ancestor models to prevent infinite recursion.
 * @param indentLevel - Current indentation level for formatting.
 * @param specificIncludeFields - Optional list of fields to include for this specific call.
 * @returns The TypeScript type string.
 */
const generateTypeString = (
  model: DMMF.Model,
  models: Map<string, DMMF.Model>,
  enums: Map<string, DMMF.DatamodelEnum>,
  includedEnums: Set<string>,
  depth: number,
  ancestors: Set<string>,
  indentLevel: number,
  specificIncludeFields?: string[]
): string => {
  if (depth > MAX_DEPTH) {
    return 'any';
  }

  ancestors.add(model.name);
  const indent = (level: number) => '  '.repeat(level);
  const fieldsDeclarations: string[] = [];

  const fieldsToProcess = specificIncludeFields
    ? model.fields.filter((f) => specificIncludeFields.includes(f.name))
    : model.fields;

  for (const field of fieldsToProcess) {
    if (shouldExcludeField(field.name)) continue;

    const { meta: metaTags, description } = parseMetaTags(field.documentation);
    const shouldProcess = shouldProcessField(field, metaTags);

    if (metaTags['TYPESTRING.SKIP'] === true && !shouldProcess) continue;

    const includeFields = metaTags['TYPESTRING.INCLUDE'] as
      | string[]
      | undefined;

    const isOptional = field.isRequired ? '' : '?';
    const isArray = field.isList ? '[]' : '';
    let tsType: string;

    const fieldDescription = description
      ? `${indent(indentLevel + 1)}// ${description}\n`
      : '';

    if (field.kind === 'scalar') {
      tsType = prismaFieldToTsType(field, includedEnums, enums);
    } else if (field.kind === 'enum') {
      tsType = prismaFieldToTsType(field, includedEnums, enums);
    } else if (field.kind === 'object') {
      if (ancestors.has(field.type)) {
        const singularTypeName = field.type;
        const pluralTypeName = pluralize(field.type);
        if (
          field.name.toLowerCase() === singularTypeName.toLowerCase() ||
          field.name.toLowerCase() === pluralTypeName.toLowerCase()
        ) {
          logger.info(
            `Skipping field "${field.name}" in model "${model.name}" as it references the ancestor "${field.type}".`
          );
          continue;
        } else {
          tsType = field.type;
        }
      } else {
        const relatedModel = models.get(field.type);
        if (relatedModel) {
          let nestedType: string;

          if (includeFields && includeFields.length > 0) {
            nestedType = `{\n${includeFields
              .map((f) => {
                const nestedField = relatedModel.fields.find(
                  (nf) => nf.name === f
                );
                if (!nestedField) return '';

                const { meta: nestedMetaTags, description: nestedDescription } =
                  parseMetaTags(nestedField.documentation);
                const nestedShouldProcess = shouldProcessField(
                  nestedField,
                  nestedMetaTags
                );

                if (
                  nestedMetaTags['TYPESTRING.SKIP'] === true &&
                  !nestedShouldProcess
                )
                  return '';

                const nestedIsOptional = nestedField.isRequired ? '' : '?';
                const nestedIsArray = nestedField.isList ? '[]' : '';
                let nestedTsType: string;

                const nestedFieldDescription = nestedDescription
                  ? `${indent(indentLevel + 2)}// ${nestedDescription}\n`
                  : '';

                if (nestedField.kind === 'scalar') {
                  nestedTsType = prismaFieldToTsType(
                    nestedField,
                    includedEnums,
                    enums
                  );
                } else if (nestedField.kind === 'enum') {
                  nestedTsType = prismaFieldToTsType(
                    nestedField,
                    includedEnums,
                    enums
                  );
                } else if (nestedField.kind === 'object') {
                  if (ancestors.has(nestedField.type)) {
                    logger.info(
                      `Skipping nested field "${nestedField.name}" in model "${relatedModel.name}" as it references the ancestor "${nestedField.type}".`
                    );
                    return '';
                  } else {
                    const deeperRelatedModel = models.get(nestedField.type);
                    if (deeperRelatedModel) {
                      const deeperIncludeFields = nestedMetaTags[
                        'TYPESTRING.INCLUDE'
                      ] as string[] | undefined;
                      nestedTsType = generateTypeString(
                        deeperRelatedModel,
                        models,
                        enums,
                        includedEnums,
                        depth + 1,
                        new Set(ancestors),
                        indentLevel + 3,
                        deeperIncludeFields
                      );
                    } else {
                      nestedTsType = 'any';
                    }
                  }
                } else {
                  nestedTsType = 'any';
                }

                return `${nestedFieldDescription}${indent(indentLevel + 2)}${nestedField.name}${nestedIsOptional}: ${nestedTsType}${nestedIsArray};`;
              })
              .filter((line) => line !== '')
              .join('\n')}\n${indent(indentLevel + 1)}}`;
          } else {
            nestedType = generateTypeString(
              relatedModel,
              models,
              enums,
              includedEnums,
              depth + 1,
              new Set(ancestors),
              indentLevel + 1
            );
          }

          tsType = nestedType.startsWith('{')
            ? nestedType
            : `{\n${indent(indentLevel + 2)}${nestedType}\n${indent(indentLevel + 1)}}`;
        } else {
          tsType = 'any';
        }
      }
    } else {
      tsType = 'any';
    }

    fieldsDeclarations.push(
      `${fieldDescription}${indent(indentLevel + 1)}${field.name}${isOptional}: ${tsType}${isArray};`
    );
  }

  ancestors.delete(model.name);
  return `{\n${fieldsDeclarations.join('\n')}\n${indent(indentLevel)}}`;
};

const shouldProcessField = (
  field: DMMF.Field,
  metaTags: MetaTagMap
): boolean => {
  if (metaTags['TYPESTRING.SKIP'] === true) {
    return false;
  }
  if (metaTags['TYPESTRING.INCLUDE']) {
    return true;
  }
  if (field.kind === 'object') {
    return true;
  }
  return false;
};

const generateTypeStrings = async () => {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const files = await fs.readdir(OUTPUT_DIR);
    for (const file of files) {
      if (file !== 'index.ts') {
        await fs.unlink(path.join(OUTPUT_DIR, file));
      }
    }

    const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');
    const dmmf = await getDMMF({ datamodel: schema });

    const allEnums = [
      ...dmmf.datamodel.enums,
      ...(dmmf.schema.enumTypes.prisma ?? []).map(schemaEnumToDatamodelEnum),
      ...(dmmf.schema.enumTypes.model ?? []).map(schemaEnumToDatamodelEnum),
    ];

    const enumsMap = new Map(allEnums.map((e) => [e.name, e]));
    const models = new Map(dmmf.datamodel.models.map((m) => [m.name, m]));

    const exportStatements: string[] = [];

    for (const [modelName, model] of models) {
      const includedEnums = new Set<string>();
      const ancestors = new Set<string>();

      const instructionLine = `// Your response should adhere to the following type definition for the "${model.name}" type.\n// Importantly, DO NOT include any annotations in your response (i.e., remove the ones we have provided for your reference below).\n\n`;

      const typeBody = generateTypeString(
        model,
        models,
        enumsMap,
        includedEnums,
        1,
        ancestors,
        0
      );

      const typeDeclaration = `export type ${model.name} = ${typeBody};\n\n`;

      // Retrieve the enums for this model
      const modelEnums = Array.from(includedEnums).map(
        (name) => enumsMap.get(name) as DMMF.DatamodelEnum
      );
      const enumDeclarations = generateEnumDeclarations(modelEnums);

      const typeString = instructionLine + typeDeclaration + enumDeclarations;

      const fileName = `${model.name}.ts`;
      const filePath = path.join(OUTPUT_DIR, fileName);
      const constName = `${model.name}TypeString`;

      const escapedTypeString = typeString
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$\{/g, '\\${');

      const fileContent = `export const ${constName} = \`\n${escapedTypeString}\`;\n`;
      await fs.writeFile(filePath, fileContent, 'utf-8');
      logger.info(`Generated ${fileName}`);

      const exportName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
      exportStatements.push(`  ${exportName}: ${constName},`);
    }

    const indexContent =
      Array.from(models.keys())
        .map(
          (modelName) =>
            `import { ${modelName}TypeString } from './${modelName}';`
        )
        .join('\n') +
      `\n\nexport const typeStrings = {\n` +
      exportStatements.join('\n') +
      `\n} as const;\n\nexport default typeStrings;`;

    await fs.writeFile(INDEX_FILE, indexContent, 'utf-8');
    logger.info('Generated index.ts');
  } catch (error) {
    logger.error('Error generating type strings', { error: String(error) });
  }
};

generateTypeStrings();
