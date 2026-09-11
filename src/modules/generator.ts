import path from 'path';
import fs from 'fs';
import pluralize from 'pluralize';
import { FieldDefinition, FieldType, InputTypePaths } from './types';
import { capitalizeFirstLetter, lowerCaseFirstLetter } from './utils';
import { getInputTypeDefinition } from './parser';
import { selectionSets } from '../generated/selectionSets';
import { logger } from '../utils/logger';

type ModelName = keyof typeof selectionSets;

/**
 * Detect Prisma Json scalar field types in TypeGraphQL-generated input types.
 *
 * Prisma's generated `*UpdateInput` types declare JSON fields directly as
 * `Prisma.InputJsonValue` (no `*FieldUpdateOperationsInput` wrapper). When the
 * engine sends an update mutation, the JSON value must be passed RAW —
 * wrapping it in `{ set: value }` causes Prisma to persist the literal
 * `{ set: value }` object as the stored JSON, because the `InputJsonValue`
 * scalar accepts any JSON shape without interpreting the `set` operator.
 *
 * This helper centralises the detection so both top-level and nested update
 * paths emit raw values for JSON fields, while still wrapping non-JSON scalar
 * fields with their `{ set: value }` operators (which IS the correct Prisma
 * update syntax for String/Int/Boolean/DateTime/Enum scalars).
 *
 * Production incident (2026-04-11, stable Wave 31): the scheduler state
 * persister's `Configuration` rows were stored as
 * `{"set":{"taskId":"...","version":1,"lastRunIso":"..."}}` because the update
 * codegen path was wrapping the JSON payload. This silently corrupted every
 * update path for every JSON field across all 62 models until detected here.
 */
const isJsonValueFieldType = (type: FieldType): boolean => {
  return (
    type.name === 'Prisma.InputJsonValue' ||
    type.name === 'Prisma.JsonValue' ||
    type.name === 'Prisma.Json' ||
    type.name === 'JsonValue' ||
    type.name === 'Json'
  );
};

type OperationType =
  | 'create'
  | 'createMany'
  | 'update'
  | 'updateWithoutId'
  | 'updateMany'
  | 'where'
  | 'updateWhere' // Special where clause for update mutations - only uses 'id' as identifier
  | 'findMany'
  | 'none'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'get'
  | 'getAll';

/**
 * Constructs a variables object for GraphQL operations.
 * @param propsAccessor - The accessor string for properties.
 * @param modelPath - Path to the input type file.
 * @param rootModelName - Name of the root model.
 * @param inputsPath - Path to the inputs directory.
 * @param operationType - Type of the operation (create, update, etc.).
 * @param depth - Current recursion depth.
 * @param maxDepth - Maximum allowed depth for recursion.
 * @returns Variables object as a string.
 */
const constructVariablesObject = (
  propsAccessor: string,
  modelPath: string | null = null,
  rootModelName: string,
  inputsPath: string | null = null,
  modelsPath: string | null = null,
  operationType: OperationType = 'none',
  depth: number = 0,
  maxDepth: number = 5
): string => {
  let fields: FieldDefinition[] = [];
  let inputPath: string | null = null;

  if (modelPath && fs.existsSync(modelPath)) {
    fields = getInputTypeDefinition(modelPath);
  } else {
    inputPath = path.join(inputsPath || '', `${rootModelName}.ts`);
    if (fs.existsSync(inputPath)) {
      fields = getInputTypeDefinition(inputPath);
    } else {
      logger.warn(`Warning: Model file does not exist: ${inputPath}`);
      return '';
    }
  }

  if (depth >= maxDepth) {
    return '';
  }

  let variablesObject = '';

  fields.forEach((field) => {
    // Skip auto-generated meta fields during create operations.
    // Only skip when the field is nullable (i.e., the schema supplies a
    // default via `@default(...)` / `@updatedAt`, so the GraphQL input
    // marks the field optional). Non-nullable variants (e.g.
    // `TradeAuditEvent.createdAt BigInt` / `SignalLineage.createdAt BigInt`,
    // both lacking a `@default`) require the caller to supply the value
    // and must NOT be silently dropped from the mutation variables.
    if (
      ['create', 'createMany'].includes(operationType) &&
      ['id', 'createdAt', 'updatedAt'].includes(field.name) &&
      field.type.isNullable
    ) {
      return;
    }

    // Skip meta fields during updateWithoutId operations
    if (
      operationType === 'updateWithoutId' &&
      ['id', 'createdAt', 'updatedAt'].includes(field.name)
    ) {
      return;
    }

    let accessor = `${propsAccessor}.${field.name}`;

    switch (operationType) {
      case 'create':
      case 'createMany':
        variablesObject += handleCreateOperation(
          field,
          accessor,
          inputsPath,
          modelsPath,
          depth,
          maxDepth
        );
        break;
      case 'update':
      case 'updateMany':
      case 'upsert':
      case 'updateWithoutId':
        variablesObject += handleUpdateOperation(
          field,
          accessor,
          inputsPath,
          modelsPath,
          depth,
          maxDepth
        );
        break;
      case 'where':
      case 'findMany':
      case 'get':
        variablesObject += handleWhereOperation(
          field,
          accessor,
          inputsPath,
          modelsPath,
          depth,
          maxDepth
        );
        break;
      case 'updateWhere':
        // For update mutations, the where clause should ONLY use 'id' as the identifier.
        // Other unique fields like 'alpacaOrderId' should NOT be in the where clause
        // because they may be the fields being SET (not looked up by).
        // This prevents unique constraint violations when updating unique fields.
        variablesObject += handleUpdateWhereOperation(
          field,
          accessor,
          inputsPath,
          modelsPath,
          depth,
          maxDepth
        );
        break;
      // Handle other operation types as needed
      default:
        break;
    }
  });

  return variablesObject;
};

const handleCreateOperation = (
  field: FieldDefinition,
  accessor: string,
  inputsPath: string | null,
  modelsPath: string | null,
  depth: number,
  maxDepth: number
): string => {
  const indent = '  '.repeat(depth + 1);
  if (depth >= maxDepth) {
    return '';
  }

  if (field.type.isScalar && field.type.isSetObject) {
    return `${indent}${field.name}: ${accessor} !== undefined ? {\n${indent}  set: ${accessor} \n${indent}} : undefined,\n`;
  } else if (field.type.isScalar) {
    return `${indent}${field.name}: ${accessor} !== undefined ? ${accessor} : undefined,\n`;
  } else {
    if (depth + 1 >= maxDepth) {
      return '';
    }

    const nestedInputTypeName = capitalizeFirstLetter(field.type.name);
    const nestedInputTypePath = path.join(
      inputsPath || '',
      `${nestedInputTypeName}.ts`
    );

    if (!fs.existsSync(nestedInputTypePath)) {
      logger.warn(
        `Nested model input type file does not exist: ${nestedInputTypePath}`
      );
      return '';
    }

    const nestedItems = getInputTypeDefinition(nestedInputTypePath);

    // Try to find 'connectOrCreate' field
    const connectOrCreateField = nestedItems.find(
      (item) => item.name === 'connectOrCreate'
    );
    if (!connectOrCreateField) {
      logger.warn(`No 'connectOrCreate' field found in ${nestedInputTypePath}`);
      return '';
    }

    const operationField = connectOrCreateField;
    const operationFieldName = 'connectOrCreate';
    const operationInputTypeName = operationField.type.name;
    const operationInputTypePath = path.join(
      inputsPath || '',
      `${operationInputTypeName}.ts`
    );
    const operationInputItems = getInputTypeDefinition(operationInputTypePath);

    const whereField = operationInputItems.find(
      (item) => item.name === 'where'
    );
    const createField =
      operationInputItems.find((item) => item.name === 'create') ||
      operationInputItems.find((item) => item.name === 'data');

    if (!whereField || !createField) {
      logger.warn(
        `Missing 'where', 'update', or 'create' fields in ${operationInputTypePath}`
      );
      return '';
    }

    const whereInputTypeName = whereField?.type.name;
    const whereInputTypePath = path.join(
      inputsPath || '',
      `${whereInputTypeName}.ts`
    );
    const whereFields = getInputTypeDefinition(whereInputTypePath);

    const createInputTypeName = createField?.type.name;
    const createInputTypePath = path.join(
      inputsPath || '',
      `${createInputTypeName}.ts`
    );
    const createFields = getInputTypeDefinition(createInputTypePath);

    if (
      createFields.length === 0 ||
      !createFields ||
      !whereFields ||
      whereFields.length === 0
    ) {
      logger.warn(
        `No fields found in create input type: ${createInputTypePath}`
      );
      return '';
    }

    // Add dynamic handling for cases where accessor is an object with only one field 'id'. If so, use 'connect' instead of 'connectOrCreate', and use accessor.id instead of accessor.
    const openingLine = field.type.isList
      ? `Array.isArray(${accessor}) && ${accessor}.length > 0 &&  ${accessor}.every((item: unknown) => typeof item === 'object' && item !== null && 'id' in item && Object.keys(item).length === 1) ? {
    ${indent}connect: ${indent} ${accessor}.map((item) => ({
    ${indent}   id: item.id
    ${indent}}))\n }\n : { ${operationFieldName}: ${accessor}.map((item) => ({\n`
      : `typeof ${accessor} === 'object' && Object.keys(${accessor}).length === 1 && Object.keys(${accessor})[0] === 'id'
    ? { connect: {
     ${indent} id: ${accessor}.id
     ${indent} }
    ${indent}}
    : { ${operationFieldName}: {\n`;

    const closingLine = field.type.isList
      ? `${indent}  }))\n`
      : `${indent}  }\n`;

    if (depth + 2 >= maxDepth) {
      return '';
    }

    let code =
      `${indent}${field.name}: ${accessor} ? \n` +
      `${indent}  ${openingLine}` +
      `${indent}    where: {\n` +
      whereFields
        .map((whereField) => {
          if (isUniqueField(whereField.name)) {
            const nestedAccessor = field.type.isList
              ? `item.${whereField.name}`
              : `${accessor}.${whereField.name}`;
            if (
              isUniqueField(whereField.name) &&
              whereField.type.isScalar &&
              whereField.type.isFilterObject
            ) {
              return `${indent}      ${whereField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          equals: ${nestedAccessor} \n ${indent}        } : undefined,\n`;
            } else if (
              whereField.type.isScalar &&
              isUniqueField(whereField.name)
            ) {
              return `${indent}      ${whereField.name}: ${nestedAccessor} !== undefined ? ${nestedAccessor} : undefined,\n`;
            } else {
              if (depth + 1 >= maxDepth) {
                return '';
              }
              return `${handleCreateOperation(whereField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            }
          }
        })
        .join('') +
      `${indent}    },\n`;

    if (createFields && createFields.length > 0) {
      if (depth + 2 >= maxDepth) {
        return '';
      }
      code +=
        `${indent}    create: {\n` +
        createFields
          .map((createField) => {
            // Only skip auto-managed meta fields when the GraphQL input
            // marks them optional (i.e., schema supplies a default). For
            // non-nullable variants the caller must provide the value.
            if (
              ['id', 'createdAt', 'updatedAt'].includes(createField.name) &&
              createField.type.isNullable
            ) {
              return '';
            }
            const nestedAccessor = field.type.isList
              ? `item.${createField.name}`
              : `${accessor}.${createField.name}`;

            if (createField.type.isScalar && createField.type.isSetObject) {
              return `${indent}      ${createField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          set: ${nestedAccessor} \n ${indent}        } : undefined,\n`;
            } else if (createField.type.isScalar) {
              return `${indent}      ${createField.name}: ${nestedAccessor} !== undefined ? ${nestedAccessor} : undefined,\n`;
            } else {
              if (depth + 2 >= maxDepth) {
                return '';
              }
              return `${handleCreateOperation(createField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            }
          })
          .join('') +
        `${indent}    },\n`;
    }

    code += `${closingLine}` + `${indent}} : undefined,\n`;

    return code;
  }
};

const handleUpdateOperation = (
  field: FieldDefinition,
  accessor: string,
  inputsPath: string | null,
  modelsPath: string | null,
  depth: number,
  maxDepth: number
): string => {
  const indent = '  '.repeat(depth + 1);
  if (depth >= maxDepth) {
    return '';
  }

  // JSON scalar fields (Prisma.InputJsonValue) MUST be emitted raw.
  // TypeGraphQL-Prisma generates these as `Prisma.InputJsonValue` in the
  // *UpdateInput types — they do NOT use the `*FieldUpdateOperationsInput`
  // wrapper that other scalars (String/Int/Boolean/DateTime/Enum) use.
  // Wrapping a raw JSON payload in `{ set: value }` causes Prisma to persist
  // the literal operator envelope as the stored JSON, corrupting the row.
  // See the `isJsonValueFieldType` helper at the top of this file for the
  // full production-incident context (Wave 31, scheduler Configuration rows).
  if (isJsonValueFieldType(field.type)) {
    return `${indent}${field.name}: ${accessor} !== undefined ? ${accessor} : undefined,\n`;
  }
  // Scalar or updatable fields:
  if (
    (field.type.isScalar && field.type.isFieldUpdate) ||
    field.type.isFieldUpdate ||
    (field.type.isScalar && field.type.isSetObject)
  ) {
    return `${indent}${field.name}: ${accessor} !== undefined ? {\n${indent}          set: ${accessor} \n ${indent}        } : undefined,\n`;
  } else {
    if (depth + 1 >= maxDepth) {
      return '';
    }

    const nestedInputTypeName = capitalizeFirstLetter(field.type.name);
    const nestedInputTypePath = path.join(
      inputsPath || '',
      `${nestedInputTypeName}.ts`
    );

    if (!fs.existsSync(nestedInputTypePath)) {
      logger.warn(
        `Nested model input type file does not exist: ${nestedInputTypePath}`
      );
      return '';
    }

    const nestedItems = getInputTypeDefinition(nestedInputTypePath);

    // Try to find 'upsert' field
    const upsertField = nestedItems.find((item) => item.name === 'upsert');
    if (!upsertField) {
      logger.warn(`No 'upsert' field found in ${nestedInputTypePath}`);
      return '';
    }

    const operationField = upsertField;
    const operationFieldName = 'upsert';
    const operationInputTypeName = operationField.type.name;
    const operationInputTypePath = path.join(
      inputsPath || '',
      `${operationInputTypeName}.ts`
    );
    const operationInputItems = getInputTypeDefinition(operationInputTypePath);

    const whereField = operationInputItems.find(
      (item) => item.name === 'where'
    );
    const updateField = operationInputItems.find(
      (item) => item.name === 'update' || item.name === 'data'
    );
    const createField =
      operationInputItems.find((item) => item.name === 'create') ||
      operationInputItems.find((item) => item.name === 'data');

    if (!whereField || !updateField) {
      logger.warn(
        `Missing 'where', 'update', or 'create' fields in ${operationInputTypePath}`
      );
      return '';
    }

    const whereInputTypeName = whereField?.type.name;
    const whereInputTypePath = path.join(
      inputsPath || '',
      `${whereInputTypeName}.ts`
    );
    const whereFields = getInputTypeDefinition(whereInputTypePath);

    const updateInputTypeName = updateField?.type.name;
    const updateInputTypePath = path.join(
      inputsPath || '',
      `${updateInputTypeName}.ts`
    );
    const updateFields = getInputTypeDefinition(updateInputTypePath);

    const createInputTypeName = createField?.type.name;
    const createInputTypePath = path.join(
      inputsPath || '',
      `${createInputTypeName}.ts`
    );
    const createFields = getInputTypeDefinition(createInputTypePath);

    if (
      !updateFields ||
      updateFields.length === 0 ||
      !createFields ||
      createFields.length === 0 ||
      !whereFields ||
      whereFields.length === 0
    ) {
      logger.warn(
        `No fields found in update input type: ${updateInputTypePath}`
      );
      return '';
    }

    // Dynamic handling for cases where accessor is {id: ...} or {symbol: ...} only or array of such objects:
    const singleIdCondition = `typeof ${accessor} === 'object' && Object.keys(${accessor}).length === 1 && (Object.keys(${accessor})[0] === 'id' || Object.keys(${accessor})[0] === 'symbol')`;
    const arrayOfIdCondition = `Array.isArray(${accessor}) && ${accessor}.length > 0 && ${accessor}.every((item: unknown) => typeof item === 'object' && item !== null && ('id' in item || 'symbol' in item) && Object.keys(item).length === 1)`;

    const openingLine = field.type.isList
      ? `${arrayOfIdCondition} ? {
${indent}connect: ${accessor}.map((item) => ({
${indent}  id: item.id
${indent}}))
} : { ${operationFieldName}: ${accessor}.map((item) => ({\n`
      : `${singleIdCondition}
? {
${indent}connect: {
${indent}  id: ${accessor}.id
${indent}}
} : { ${operationFieldName}: {\n`;

    const closingLine = field.type.isList
      ? `${indent}  }))\n`
      : `${indent}  }\n`;

    if (depth + 2 >= maxDepth) {
      return '';
    }

    let code =
      `${indent}${field.name}: ${accessor} ? \n` +
      `${indent}${openingLine}` +
      `${indent}    where: {\n` +
      whereFields
        .map((whereField) => {
          if (isUniqueField(whereField.name)) {
            const nestedAccessor = field.type.isList
              ? `item.${whereField.name}`
              : `${accessor}.${whereField.name}`;
            if (
              isUniqueField(whereField.name) &&
              ((whereField.type.isScalar && whereField.type.isFilterObject) ||
                whereField.type.isFilterObject)
            ) {
              return `${indent}      ${whereField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          equals: ${nestedAccessor}\n${indent}        } : undefined,\n`;
            } else if (
              isUniqueField(whereField.name) &&
              whereField.type.isScalar
            ) {
              return `${indent}      ${whereField.name}: ${nestedAccessor} !== undefined ? ${nestedAccessor} : undefined,\n`;
            } else {
              if (depth + 1 >= maxDepth) {
                return '';
              }
              return `${handleUpdateOperation(whereField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            }
          }
          return '';
        })
        .join('') +
      `${indent}    },\n`;

    if (
      operationFieldName === 'upsert' &&
      updateFields &&
      updateFields.length > 0
    ) {
      if (depth + 2 >= maxDepth) {
        return '';
      }
      code +=
        `${indent}    update: {\n` +
        updateFields
          .map((updateField) => {
            const nestedAccessor = field.type.isList
              ? `item.${updateField.name}`
              : `${accessor}.${updateField.name}`;
            // JSON scalar fields must be emitted raw — see Wave 31 note on
            // the top-level handler above and the `isJsonValueFieldType`
            // helper at the top of this file.
            if (isJsonValueFieldType(updateField.type)) {
              return `${indent}      ${updateField.name}: ${nestedAccessor} !== undefined ? ${nestedAccessor} : undefined,\n`;
            }
            if (updateField.type.isScalar) {
              return `${indent}      ${updateField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          set: ${nestedAccessor}\n${indent}        } : undefined,\n`;
            } else if (
              updateField.type.isFieldUpdate ||
              (updateField.type.isScalar && updateField.type.isSetObject)
            ) {
              if (['id', 'createdAt', 'updatedAt'].includes(updateField.name)) {
                return '';
              }
              return `${indent}      ${updateField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          set: ${nestedAccessor}\n${indent}        } : undefined,\n`;
            } else if (updateField.type.isNullable) {
              if (depth + 2 >= maxDepth) {
                return '';
              }
              return `${handleUpdateOperation(updateField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            } else {
              if (depth + 2 >= maxDepth) {
                return '';
              }
              return `${handleUpdateOperation(updateField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            }
          })
          .join('') +
        `${indent}    },\n`;
    }

    if (
      operationFieldName === 'upsert' &&
      createFields &&
      createFields.length > 0
    ) {
      if (depth + 2 >= maxDepth) {
        return '';
      }
      code +=
        `${indent}    create: {\n` +
        createFields
          .map((createField) => {
            // Only skip auto-managed meta fields when the GraphQL input
            // marks them optional (i.e., schema supplies a default).
            if (
              ['id', 'createdAt', 'updatedAt'].includes(createField.name) &&
              createField.type.isNullable
            ) {
              return '';
            }
            const nestedAccessor = field.type.isList
              ? `item.${createField.name}`
              : `${accessor}.${createField.name}`;
            if (createField.type.isScalar && createField.type.isSetObject) {
              return `${indent}      ${createField.name}: ${nestedAccessor} !== undefined ? {\n${indent}          set: ${nestedAccessor} \n ${indent}        } : undefined,\n`;
            } else if (createField.type.isScalar) {
              return `${indent}      ${createField.name}: ${nestedAccessor} !== undefined ? ${nestedAccessor} : undefined,\n`;
            } else {
              if (depth + 2 >= maxDepth) {
                return '';
              }
              return `${handleCreateOperation(createField, nestedAccessor, inputsPath, modelsPath, depth + 1, maxDepth)}`;
            }
          })
          .join('') +
        `${indent}    },\n`;
    }

    code += `${closingLine}${indent}} : undefined,\n`;

    return code;
  }
};

/**
 * Generates the JSON object string for the 'where' field in a GraphQL query.
 * This function traverses the field definitions and constructs the appropriate
 * 'where' conditions based on scalar and relational fields.
 *
 * @param field - The current field definition being processed.
 * @param accessor - The accessor string to retrieve the value for the field.
 * @param inputsPath - The path to the input type definitions.
 * @param modelsPath - The path to the model definitions.
 * @param depth - The current depth of recursion.
 * @param maxDepth - The maximum allowed depth of recursion to prevent infinite loops.
 * @returns A string representing the 'where' condition for the field.
 */
const handleWhereOperation = (
  field: FieldDefinition,
  accessor: string,
  inputsPath: string | null,
  modelsPath: string | null,
  depth: number,
  maxDepth: number
): string => {
  const indent = '  '.repeat(depth + 1);
  if (depth >= maxDepth) {
    return '';
  }

  if (field.type.isScalar) {
    // Check if the scalar field requires an "equals" wrapper
    if (field.type.isFilterObject && isUniqueField(field.name)) {
      return `${indent}${field.name}: ${accessor} !== undefined ? {\n${indent}  equals: ${accessor} \n${indent}} : undefined,\n`;
    } else if (isUniqueField(field.name)) {
      // Handle regular scalar fields without "equals" wrapper
      return `${indent}${field.name}: ${accessor} !== undefined ? ${accessor} : undefined,\n`;
    } else {
      return '';
    }
  } else {
    // Handle relational fields
    if (depth + 1 >= maxDepth) {
      return '';
    }

    const nestedFilterTypeName =
      capitalizeFirstLetter(field.type.name) + 'Filter';
    const nestedFilterTypePath = path.join(
      inputsPath || '',
      `${nestedFilterTypeName}.ts`
    );

    if (!fs.existsSync(nestedFilterTypePath)) {
      logger.warn(
        `Nested filter type file does not exist: ${nestedFilterTypePath}`
      );
      return '';
    }

    const nestedFilterFields = getInputTypeDefinition(nestedFilterTypePath);

    if (nestedFilterFields.length === 0) {
      logger.warn(
        `No fields found in nested filter type: ${nestedFilterTypePath}`
      );
      return '';
    }

    let condition = '';

    if (field.type.isList) {
      // If the field is a list, use some or every conditions
      condition +=
        `${indent}${field.name}: ${accessor} !== undefined ? {\n` +
        `${indent}  some: {\n` +
        nestedFilterFields
          .map((nestedField) => {
            const nestedAccessor = `${accessor}.${nestedField.name}`;
            return handleWhereOperation(
              nestedField,
              nestedAccessor,
              inputsPath,
              modelsPath,
              depth + 2,
              maxDepth
            );
          })
          .join('') +
        `${indent}  }\n` +
        `${indent}} : undefined,\n`;
    } else {
      // If the field is a single relation, apply the nested filter directly
      condition +=
        `${indent}${field.name}: ${accessor} !== undefined ? {\n` +
        nestedFilterFields
          .map((nestedField) => {
            const nestedAccessor = `${accessor}.${nestedField.name}`;
            return handleWhereOperation(
              nestedField,
              nestedAccessor,
              inputsPath,
              modelsPath,
              depth + 2,
              maxDepth
            );
          })
          .join('') +
        `${indent}} : undefined,\n`;
    }

    return condition;
  }
};

/**
 * Handles the 'updateWhere' operation type for where clause generation in update mutations.
 *
 * CRITICAL: For update mutations, the where clause should ONLY use 'id' as the identifier.
 * This prevents unique constraint violations when updating other unique fields like 'alpacaOrderId'.
 *
 * Example problem this solves:
 * When calling adaptic.action.update({ id: "abc", alpacaOrderId: "new-order-id" }),
 * the old code would put alpacaOrderId in BOTH the where clause (for lookup) AND the data
 * clause (for setting). This causes Prisma to fail because:
 * 1. It tries to find an action where alpacaOrderId = "new-order-id" (which doesn't exist yet)
 * 2. OR if another action has that alpacaOrderId, it causes a unique constraint violation
 *
 * The fix: where clause only uses 'id', and alpacaOrderId only goes in the data clause.
 */
const handleUpdateWhereOperation = (
  field: FieldDefinition,
  accessor: string,
  inputsPath: string | null,
  modelsPath: string | null,
  depth: number,
  maxDepth: number
): string => {
  const indent = '  '.repeat(depth + 1);
  if (depth >= maxDepth) {
    return '';
  }

  if (isReservedField(field.name)) {
    return '';
  }

  // For update mutations, ONLY 'id' should be in the where clause
  // All other unique fields should NOT be used for identification
  // because they may be the fields being updated (not looked up by)
  if (field.name === 'id') {
    return `${indent}${field.name}: ${accessor} !== undefined ? ${accessor} : undefined,\n`;
  }

  // Skip all other fields in the update where clause
  // They will be handled in the data clause instead
  return '';
};

/**
 * Checks if a field name is reserved and should be skipped.
 * @param name - The field name to check.
 * @returns Boolean indicating if the field is reserved.
 */
const isReservedField = (name: string): boolean => {
  const reservedFields = [
    'AND',
    'OR',
    'NOT',
    'connect',
    'disconnect',
    'set',
    'update',
    'create',
    'delete',
    'connectOrCreate',
    'upsert',
    'createMany',
    'deleteMany',
    'updateMany',
    'some',
    'none',
    'every',
  ];
  return reservedFields.includes(name);
};

/**
 * Checks if a field name is unique and should be used for filtering in
 * generated `where` clauses (for `update`, `upsert`, `delete`).
 *
 * NOTE: This is a name-based heuristic, not a schema-driven check. It can
 * produce wrong results in two directions:
 *   1. Fields that ARE `@unique` in the Prisma schema but whose names are
 *      not in this list get omitted from the `where` clause. Those models'
 *      `upsert`/`update` calls will fail with a Prisma error like
 *      "WhereUniqueInput needs at least one of id or <field>". The fix is
 *      to add the field name to this list (or refactor the generator to
 *      read `@unique` directly from the parsed Prisma DMMF).
 *   2. Fields with a listed name that are NOT unique in a given model end
 *      up in the `where` clause as additional filters. This usually works
 *      because Prisma allows additional filter conditions alongside a
 *      unique identifier, but can silently mask bugs.
 *
 * The long-term fix is to pass the model's actual unique fields into this
 * check from the DMMF rather than relying on a hardcoded name list. Until
 * that refactor lands, additions here should be driven by real encountered
 * upsert/update failures across models.
 *
 * @param name - The field name to check.
 * @returns Boolean indicating if the field is unique.
 */

const isUniqueField = (name: string): boolean => {
  // if name includes "Id", return true
  if (name.includes('Id')) {
    return true;
  }

  // return true if the field matches any of the unique fields
  const uniqueFields = [
    'id',
    'email',
    'username',
    'alpacaAccountId',
    'tradeId',
    'alpacaOrderId',
    'providerAccountId',
    'slug',
    'name',
    'title',
    'url',
    'key',
    'configKey', // Configuration.configKey is @unique — required for scheduler-state-persister upsert/update to work correctly.
    'handle',
    'symbol',
    'clientOrderId',
    'status',
    'type',
  ];
  return uniqueFields.includes(name);
};

/**
 * Generates CRUD operations for a given model.
 * @param modelName - Name of the model.
 * @param modelsPath - Path to the models directory.
 * @param inputsPath - Path to the inputs directory.
 * @param functionsOutputPath - Path to output generated functions.
 * @returns Generated TypeScript code for CRUD operations.
 */
export const generateModelFunctions = (
  modelName: string,
  modelsPath: string,
  inputsPath: string,
  functionsOutputPath: string
): string | null => {
  const capitalModelName = capitalizeFirstLetter(
    modelName
  ) as ModelName as string;
  const pluralModelName = pluralize(capitalModelName); // Accurate pluralization

  const inputTypes: InputTypePaths = {
    create: `${capitalModelName}CreateInput.ts`,
    createMany: `${capitalModelName}CreateManyInput.ts`,
    update: `${capitalModelName}UpdateInput.ts`,
    updateMany: `${capitalModelName}UpdateManyMutationInput.ts`,
    whereUnique: `${capitalModelName}WhereUniqueInput.ts`,
    scalarWhere: `${capitalModelName}ScalarWhereInput.ts`,
    where: `${capitalModelName}WhereInput.ts`,
  };

  const inputTypePaths: InputTypePaths = {
    create: path.join(inputsPath, inputTypes.create),
    createMany: path.join(inputsPath, inputTypes.createMany),
    update: path.join(inputsPath, inputTypes.update),
    updateMany: path.join(inputsPath, inputTypes.updateMany),
    whereUnique: path.join(inputsPath, inputTypes.whereUnique),
    scalarWhere: path.join(inputsPath, inputTypes.scalarWhere),
    where: path.join(inputsPath, inputTypes.where),
  };

  // Add validation import for Allocation model
  const allocationValidationImport =
    capitalModelName === 'Allocation'
      ? `import { assertValidAllocation } from './validators/allocation-validator';\n`
      : '';

  const imports = `
import { ${capitalModelName} as ${capitalModelName}Type } from './generated/typegraphql-prisma/models/${capitalModelName}';
import { getApolloClient, ApolloClientType, NormalizedCacheObject, getApolloModules } from './client';
import { removeUndefinedProps } from './utils';
import { logger } from './utils/logger';
${allocationValidationImport}  `;

  const operations = `
  ${imports}
  /**
   * CRUD operations for the ${capitalModelName} model.
   */

  const selectionSet = \`
    ${selectionSets[capitalModelName]}
  \`;

  export const ${modelName} = {

    /**
     * Create a new ${capitalModelName} record.
     * @param props - Properties for the new record.
     * @param client - Apollo Client instance.
     * @returns The created ${capitalModelName} or null.
     */

    /**
     * Create a new ${capitalModelName} record.
     * Enhanced with connection resilience against Prisma connection errors.
     * @param props - Properties for the new record.
     * @param globalClient - Apollo Client instance.
     * @returns The created ${capitalModelName} or null.
     */
    async create(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<${capitalModelName}Type> {
      ${
        capitalModelName === 'Allocation'
          ? `// Validate allocation percentages before creating
      assertValidAllocation({
        equities: props.equities,
        optionsContracts: props.optionsContracts,
        futures: props.futures,
        etfs: props.etfs,
        forex: props.forex,
        crypto: props.crypto
      });

      `
          : ''
      }// Maximum number of retries for database connection issues
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let lastError: unknown = null;

      // Retry loop to handle potential database connection issues
      while (retryCount < MAX_RETRIES) {
        try {
          const [modules, client] = await Promise.all([
            getApolloModules(),
            globalClient
              ? Promise.resolve(globalClient)
              : getApolloClient()
          ]);

          const { gql, ApolloError } = modules;

          const CREATE_ONE_${capitalModelName.toUpperCase()} = gql\`
              mutation createOne${capitalModelName}($data: ${capitalModelName}CreateInput!) {
                createOne${capitalModelName}(data: $data) {
                  \${selectionSet}
                }
              }
           \`;

          const variables = {
            data: {
              ${constructVariablesObject(
                'props',
                inputTypePaths.create,
                capitalModelName,
                inputsPath,
                modelsPath,
                'create'
              )}
            },
          };

          const filteredVariables = removeUndefinedProps(variables);

          const response = await client.mutate({
            mutation: CREATE_ONE_${capitalModelName.toUpperCase()},
            variables: filteredVariables,
            // Don't cache mutations, but ensure we're using the freshest context
            fetchPolicy: 'no-cache'
          });

          if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
          if (response && response.data && response.data.createOne${capitalModelName}) {
            return response.data.createOne${capitalModelName};
          } else {
            return null as unknown as ${capitalModelName}Type;
          }
        } catch (caughtError: unknown) {
          const error = caughtError as Error & { networkError?: { message?: string } };
          lastError = error;

          // Check for constraint violations FIRST - these are NEVER retryable
          const isConstraintViolation =
            error.message?.includes('violates check constraint') ||
            error.message?.includes('violates unique constraint') ||
            error.message?.includes('violates foreign key constraint') ||
            error.message?.includes('unique constraint') ||
            error.message?.includes('23514') ||
            error.message?.includes('23505') ||
            error.message?.includes('P2002') ||
            error.message?.includes('P2003');

          if (isConstraintViolation) {
            const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
            logger.error("Non-retryable constraint violation in createOne${capitalModelName}", {
              operation: 'createOne${capitalModelName}',
              model: '${capitalModelName}',
              error: String(error),
              constraintName: constraintMatch ? constraintMatch[1] : undefined,
              errorCategory: 'CONSTRAINT_VIOLATION',
              isRetryable: false,
            });
            throw error;
          }

          // Check if this is a database connection error that we should retry.
          // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
          // pool exhaustion, and transient gateway statuses. Must stay consistent
          // with the transient classifier in client.ts (onError link + enqueueOperation).
          const isConnectionError =
            error.message?.includes('Server has closed the connection') ||
            error.message?.includes('Cannot reach database server') ||
            error.message?.includes('Connection timed out') ||
            error.message?.includes('aborted due to timeout') ||
            error.message?.includes('TimeoutError') ||
            error.message?.includes('fetch failed') ||
            error.message?.includes('socket hang up') ||
            error.message?.includes('ECONNRESET') ||
            error.message?.includes('ECONNREFUSED') ||
            error.message?.includes('ETIMEDOUT') ||
            error.message?.includes('Connection pool timeout') ||
            error.message?.includes('P2024') ||
            error.message?.includes('status code 408') ||
            error.message?.includes('status code 502') ||
            error.message?.includes('status code 503') ||
            error.message?.includes('status code 504') ||
            error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
            (error.networkError && (
              error.networkError.message?.includes('Failed to fetch') ||
              error.networkError.message?.includes('fetch failed') ||
              error.networkError.message?.includes('aborted due to timeout') ||
              error.networkError.message?.includes('TimeoutError')
            ));

          if (isConnectionError && retryCount < MAX_RETRIES - 1) {
            retryCount++;
            const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
            logger.warn("Database connection error in createOne${capitalModelName}, retrying...", {
              operation: 'createOne${capitalModelName}',
              model: '${capitalModelName}',
              attempt: retryCount,
              maxRetries: MAX_RETRIES,
            });
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          // Log structured error details and rethrow.
          // Demote transient failures to WARN with explicit transient+recoveryHint
          // metadata so log analytics can distinguish recoverable upstream retries
          // from true defects.
          if (isConnectionError) {
            logger.warn("Database create operation failed (transient after retries)", {
              operation: 'createOne${capitalModelName}',
              model: '${capitalModelName}',
              error: String(error),
              isRetryable: true,
              transient: true,
              recoveryHint: "Upstream caller should retry on next cycle",
            });
          } else {
            logger.error("Database create operation failed", {
              operation: 'createOne${capitalModelName}',
              model: '${capitalModelName}',
              error: String(error),
              isRetryable: false,
            });
          }
          throw error;
        }
      }

      // If we exhausted retries, throw the last error
      throw lastError;
    },

  /**
   * Create multiple ${capitalModelName} records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of ${capitalModelName} objects for the new records.
   * @param globalClient - Apollo Client instance.
   * @param options - Optional control flags (e.g., skipDuplicates).
   * @returns The count of created records or null.
   */
  async createMany(props: ${capitalModelName}Type[], globalClient?: ApolloClientType<NormalizedCacheObject>, options?: { skipDuplicates?: boolean }): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const CREATE_MANY_${capitalModelName.toUpperCase()} = gql\`
          mutation createMany${capitalModelName}($data: [${capitalModelName}CreateManyInput!]!, $skipDuplicates: Boolean) {
            createMany${capitalModelName}(data: $data, skipDuplicates: $skipDuplicates) {
              count
            }
          }\`;

        const variables = {
          data: props.map(prop => ({
    ${constructVariablesObject(
      'prop',
      inputTypePaths.createMany,
      capitalModelName,
      inputsPath,
      modelsPath,
      'createMany'
    )}      })),
          ...(options?.skipDuplicates ? { skipDuplicates: true } : {}),
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: CREATE_MANY_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.createMany${capitalModelName}) {
          return response.data.createMany${capitalModelName};
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
          logger.warn("Duplicate key in createMany${capitalModelName} (expected during overlapping fetches)", {
            operation: 'createMany${capitalModelName}',
            model: '${capitalModelName}',
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in createMany${capitalModelName}, retrying...", {
            operation: 'createMany${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database createMany operation failed (transient after retries)", {
            operation: 'createMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database createMany operation failed", {
            operation: 'createMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update a single ${capitalModelName} record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated ${capitalModelName} or null.
   */
  async update(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<${capitalModelName}Type> {
    ${
      capitalModelName === 'Allocation'
        ? `// Validate allocation percentages before updating
    assertValidAllocation({
      equities: props.equities,
      optionsContracts: props.optionsContracts,
      futures: props.futures,
      etfs: props.etfs,
      forex: props.forex,
      crypto: props.crypto
    });

    `
        : ''
    }// Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_ONE_${capitalModelName.toUpperCase()} = gql\`
          mutation updateOne${capitalModelName}($data: ${capitalModelName}UpdateInput!, $where: ${capitalModelName}WhereUniqueInput!) {
            updateOne${capitalModelName}(data: $data, where: $where) {
              \${selectionSet}
            }
          }\`;

        const variables = {
          where: {
          ${constructVariablesObject(
            'props',
            inputTypePaths.whereUnique,
            capitalModelName,
            inputsPath,
            modelsPath,
            'updateWhere' // Use updateWhere to only include 'id' in the where clause, preventing unique constraint violations when updating other unique fields
          )}      },
          data: {
    ${constructVariablesObject(
      'props',
      inputTypePaths.update,
      capitalModelName,
      inputsPath,
      modelsPath,
      'update'
    )}      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_ONE_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateOne${capitalModelName}) {
          return response.data.updateOne${capitalModelName};
        } else {
          return null as unknown as ${capitalModelName}Type;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateOne${capitalModelName}", {
            operation: 'updateOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateOne${capitalModelName}, retrying...", {
            operation: 'updateOne${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database update operation failed (transient after retries)", {
            operation: 'updateOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database update operation failed", {
            operation: 'updateOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Upsert a single ${capitalModelName} record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to update.
   * @param globalClient - Apollo Client instance.
   * @returns The updated ${capitalModelName} or null.
   */
  async upsert(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<${capitalModelName}Type> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPSERT_ONE_${capitalModelName.toUpperCase()} = gql\`
          mutation upsertOne${capitalModelName}($where: ${capitalModelName}WhereUniqueInput!, $create: ${capitalModelName}CreateInput!, $update: ${capitalModelName}UpdateInput!) {
            upsertOne${capitalModelName}(where: $where, create: $create, update: $update) {
              \${selectionSet}
            }
          }\`;

        const variables = {
          where: {
          ${constructVariablesObject(
            'props',
            inputTypePaths.whereUnique,
            capitalModelName,
            inputsPath,
            modelsPath,
            'where'
          )}      },
          create: {
      ${constructVariablesObject(
        'props',
        inputTypePaths.create,
        capitalModelName,
        inputsPath,
        modelsPath,
        'create'
      )}      },
          update: {
    ${constructVariablesObject(
      'props',
      inputTypePaths.update,
      capitalModelName,
      inputsPath,
      modelsPath,
      'updateWithoutId'
    )}      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPSERT_ONE_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.upsertOne${capitalModelName}) {
          return response.data.upsertOne${capitalModelName};
        } else {
          return null as unknown as ${capitalModelName}Type;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in upsertOne${capitalModelName}", {
            operation: 'upsertOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in upsertOne${capitalModelName}, retrying...", {
            operation: 'upsertOne${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database upsert operation failed (transient after retries)", {
            operation: 'upsertOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database upsert operation failed", {
            operation: 'upsertOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Update multiple ${capitalModelName} records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Array of ${capitalModelName} objects for the updated records.
   * @param globalClient - Apollo Client instance.
   * @returns The count of created records or null.
   */
  async updateMany(props: ${capitalModelName}Type[], globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<{ count: number } | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const UPDATE_MANY_${capitalModelName.toUpperCase()} = gql\`
          mutation updateMany${capitalModelName}($data: [${capitalModelName}CreateManyInput!]!) {
            updateMany${capitalModelName}(data: $data) {
              count
            }
          }\`;

        const variables = props.map(prop => ({
          where: {
            ${constructVariablesObject(
              'prop',
              inputTypePaths.whereUnique,
              capitalModelName,
              inputsPath,
              modelsPath,
              'updateWhere' // Use updateWhere to only include 'id' in the where clause
            )}
          },
          data: {
            ${constructVariablesObject(
              'prop',
              inputTypePaths.update,
              capitalModelName,
              inputsPath,
              modelsPath,
              'updateMany'
            )}
          },
        }));

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: UPDATE_MANY_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.updateMany${capitalModelName}) {
          return response.data.updateMany${capitalModelName};
        } else {
          return null;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in updateMany${capitalModelName}", {
            operation: 'updateMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in updateMany${capitalModelName}, retrying...", {
            operation: 'updateMany${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database updateMany operation failed (transient after retries)", {
            operation: 'updateMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database updateMany operation failed", {
            operation: 'updateMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Delete a single ${capitalModelName} record.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record to delete.
   * @param globalClient - Apollo Client instance.
   * @returns The deleted ${capitalModelName} or null.
   */
  async delete(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<${capitalModelName}Type> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const DELETE_ONE_${capitalModelName.toUpperCase()} = gql\`
          mutation deleteOne${capitalModelName}($where: ${capitalModelName}WhereUniqueInput!) {
            deleteOne${capitalModelName}(where: $where) {
              id
            }
          }\`;

        const variables = {
          where: {
            id: props.id ? props.id : undefined,
          }
        };

        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.mutate({
          mutation: DELETE_ONE_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          // Don't cache mutations, but ensure we're using the freshest context
          fetchPolicy: 'no-cache'
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.deleteOne${capitalModelName}) {
          return response.data.deleteOne${capitalModelName};
        } else {
          return null as unknown as ${capitalModelName}Type;
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check for constraint violations FIRST - these are NEVER retryable
        // (e.g., foreign key constraints preventing deletion)
        const isConstraintViolation =
          error.message?.includes('violates check constraint') ||
          error.message?.includes('violates unique constraint') ||
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('unique constraint') ||
          error.message?.includes('23514') ||
          error.message?.includes('23505') ||
          error.message?.includes('23503') ||
          error.message?.includes('P2002') ||
          error.message?.includes('P2003') ||
          error.message?.includes('P2014');

        if (isConstraintViolation) {
          const constraintMatch = error.message?.match(/constraint\\s+"([^"]+)"/);
          logger.error("Non-retryable constraint violation in deleteOne${capitalModelName}", {
            operation: 'deleteOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            constraintName: constraintMatch ? constraintMatch[1] : undefined,
            errorCategory: 'CONSTRAINT_VIOLATION',
            isRetryable: false,
          });
          throw error;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in deleteOne${capitalModelName}, retrying...", {
            operation: 'deleteOne${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
            recordId: props.id,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database delete operation failed (transient after retries)", {
            operation: 'deleteOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database delete operation failed", {
            operation: 'deleteOne${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            recordId: props.id,
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve a single ${capitalModelName} record by ID.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Properties to identify the record.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns The retrieved ${capitalModelName} or null.
   */
  async get(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<${capitalModelName}Type | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_${capitalModelName.toUpperCase()} = gql\`
          query get${capitalModelName}($where: ${capitalModelName}WhereUniqueInput!) {
            get${capitalModelName}(where: $where) {
              \${selectionSet}
            }
          }\`;

        const variables = {
          where: whereInput ? whereInput : {
          ${constructVariablesObject(
            'props',
            inputTypePaths.whereUnique,
            capitalModelName,
            inputsPath,
            modelsPath,
            'where'
          )}},
        };
        const filteredVariables = removeUndefinedProps(variables);

        const response = await client.query({
          query: GET_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.get${capitalModelName} ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ${capitalModelName} found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in get${capitalModelName}, retrying...", {
            operation: 'get${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database get operation failed (transient after retries)", {
            operation: 'get${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database get operation failed", {
            operation: 'get${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Retrieve all ${pluralModelName} records.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param globalClient - Apollo Client instance.
   * @returns An array of ${capitalModelName} records or null.
   */
  async getAll(globalClient?: ApolloClientType<NormalizedCacheObject>): Promise<${capitalModelName}Type[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const GET_ALL_${capitalModelName.toUpperCase()} = gql\`
          query getAll${capitalModelName} {
            ${lowerCaseFirstLetter(pluralModelName)} {
              \${selectionSet}
            }
          }\`;

        const response = await client.query({
          query: GET_ALL_${capitalModelName.toUpperCase()},
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        return response.data?.${lowerCaseFirstLetter(pluralModelName)} ?? null;
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ${capitalModelName} found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in getAll${capitalModelName}, retrying...", {
            operation: 'getAll${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database getAll operation failed (transient after retries)", {
            operation: 'getAll${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database getAll operation failed", {
            operation: 'getAll${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  },

  /**
   * Find multiple ${capitalModelName} records based on conditions.
   * Enhanced with connection resilience against Prisma connection errors.
   * @param props - Conditions to find records.
   * @param globalClient - Apollo Client instance.
   * @param whereInput - Optional custom where input.
   * @returns An array of found ${capitalModelName} records or null.
   */
  async findMany(props: ${capitalModelName}Type, globalClient?: ApolloClientType<NormalizedCacheObject>, whereInput?: Record<string, unknown>): Promise<${capitalModelName}Type[] | null> {
    // Maximum number of retries for database connection issues
    const MAX_RETRIES = 3;
    let retryCount = 0;
    let lastError: unknown = null;

    // Retry loop to handle potential database connection issues
    while (retryCount < MAX_RETRIES) {
      try {
        const [modules, client] = await Promise.all([
          getApolloModules(),
          globalClient
            ? Promise.resolve(globalClient)
            : getApolloClient()
        ]);

        const { gql, ApolloError } = modules;

        const FIND_MANY_${capitalModelName.toUpperCase()} = gql\`
          query findMany${capitalModelName}($where: ${capitalModelName}WhereInput!) {
            ${lowerCaseFirstLetter(pluralModelName)}(where: $where) {
              \${selectionSet}
            }
          }\`;

        const variables = {
          where: whereInput ? whereInput : {
    ${constructVariablesObject(
      'props',
      inputTypePaths.where,
      capitalModelName,
      inputsPath,
      modelsPath,
      'findMany'
    )}      },
        };

        const filteredVariables = removeUndefinedProps(variables);

        // Validate that we have at least one filter criteria
        // GraphQL requires a non-empty where clause for findMany
        if (!filteredVariables || !filteredVariables.where || Object.keys(filteredVariables.where).length === 0) {
          throw new Error(\`findMany${capitalModelName} requires at least one filter criterion. Received empty where clause.\`);
        }

        const response = await client.query({
          query: FIND_MANY_${capitalModelName.toUpperCase()},
          variables: filteredVariables,
          fetchPolicy: 'network-only', // Force network request to avoid stale cache
        });

        if (response.errors && response.errors.length > 0) throw new Error(response.errors[0].message);
        if (response && response.data && response.data.${lowerCaseFirstLetter(pluralModelName)}) {
          return response.data.${lowerCaseFirstLetter(pluralModelName)};
        } else {
          return [] as ${capitalModelName}Type[];
        }
      } catch (caughtError: unknown) {
        const error = caughtError as Error & { networkError?: { message?: string } };
        lastError = error;

        // Check if this is a "No record found" error - this is an expected condition, not a failure
        if (error.message === 'No ${capitalModelName} found') {
          return null;
        }

        // Check if this is a database connection error that we should retry.
        // Covers undici/fetch timeouts, Prisma Accelerate transients, connection
        // pool exhaustion, and transient gateway statuses. Must stay consistent
        // with the transient classifier in client.ts (onError link + enqueueOperation).
        const isConnectionError =
          error.message?.includes('Server has closed the connection') ||
          error.message?.includes('Cannot reach database server') ||
          error.message?.includes('Connection timed out') ||
          error.message?.includes('aborted due to timeout') ||
          error.message?.includes('TimeoutError') ||
          error.message?.includes('fetch failed') ||
          error.message?.includes('socket hang up') ||
          error.message?.includes('ECONNRESET') ||
          error.message?.includes('ECONNREFUSED') ||
          error.message?.includes('ETIMEDOUT') ||
          error.message?.includes('Connection pool timeout') ||
          error.message?.includes('P2024') ||
          error.message?.includes('status code 408') ||
          error.message?.includes('status code 502') ||
          error.message?.includes('status code 503') ||
          error.message?.includes('status code 504') ||
          error.message?.includes('Accelerate') || // Prisma Accelerate proxy errors
          (error.networkError && (
            error.networkError.message?.includes('Failed to fetch') ||
            error.networkError.message?.includes('fetch failed') ||
            error.networkError.message?.includes('aborted due to timeout') ||
            error.networkError.message?.includes('TimeoutError')
          ));

        if (isConnectionError && retryCount < MAX_RETRIES - 1) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 100; // Exponential backoff: 200ms, 400ms, 800ms
          logger.warn("Database connection error in findMany${capitalModelName}, retrying...", {
            operation: 'findMany${capitalModelName}',
            model: '${capitalModelName}',
            attempt: retryCount,
            maxRetries: MAX_RETRIES,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Log structured error details and rethrow (transient -> WARN).
        if (isConnectionError) {
          logger.warn("Database findMany operation failed (transient after retries)", {
            operation: 'findMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: true,
            transient: true,
            recoveryHint: "Upstream caller should retry on next cycle",
          });
        } else {
          logger.error("Database findMany operation failed", {
            operation: 'findMany${capitalModelName}',
            model: '${capitalModelName}',
            error: String(error),
            isRetryable: false,
          });
        }
        throw error;
      }
    }

    // If we exhausted retries, throw the last error
    throw lastError;
  }
};
`;

  // Write the generated operations to a file
  const outputFilePath = path.join(functionsOutputPath, `${modelName}.ts`);
  try {
    fs.writeFileSync(outputFilePath, operations, 'utf-8');
  } catch (error) {
    logger.error(`Failed to write functions for model ${modelName}`, {
      error: String(error),
    });
    return null;
  }

  return operations;
};
