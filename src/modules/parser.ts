// src/modules/parser.ts

import fs from 'fs';
import ts from 'typescript';
import { FieldDefinition, FieldType } from './types';
import { URL } from 'url';
import { capitalizeFirstLetter } from './utils';
import path from 'path';
import { logger } from '../utils/logger';

export function isScalarType(typeName: string): boolean {
  if (typeName.startsWith('Enum')) return true;
  if (typeName.startsWith('"')) return true;
  return updatedScalars.has(typeName);
}

export function isSetObjectType(typeName: string): boolean {
  const regex = /^(\w+)(Create|Update|Upsert)(\w+)Input$/;
  const match = typeName.match(regex);

  if (!match) return false;

  const [_, parentModelName, operation, fieldName] = match;
  if (!parentModelName || !operation || !fieldName) return false;

  return true;
}

const SCALAR_TYPES = ['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json'];

function parseSchema(schemaPath: string): Map<string, Set<string>> {
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const models = schemaContent.split(/\n\s*model\s+/).slice(1);
  const modelMap = new Map<string, Set<string>>();

  models.forEach((model) => {
    const lines = model.split('\n');
    const modelName = lines[0].split(/\s+/)[0];
    const scalarArrayFields = new Set<string>();

    lines.slice(1).forEach((line) => {
      const match = line.match(/^\s*(\w+)\s+([\w\[\]]+)/);
      if (match) {
        const [, fieldName, fieldType] = match;
        if (
          fieldType.endsWith('[]') &&
          SCALAR_TYPES.includes(fieldType.slice(0, -2))
        ) {
          scalarArrayFields.add(fieldName);
        }
      }
    });

    if (scalarArrayFields.size > 0) {
      modelMap.set(modelName, scalarArrayFields);
    }
  });

  return modelMap;
}

export function isScalarArrayType(typeName: string): boolean {
  if (typeName.endsWith('[]')) {
    const baseType = typeName.slice(0, -2);
    return isScalarType(baseType);
  }

  if (typeName.startsWith('Array<') && typeName.endsWith('>')) {
    const baseType = typeName.slice(6, -1);
    return isScalarType(baseType);
  }

  if (
    typeName.includes('ListFilter') ||
    typeName.includes('NullableListFilter') ||
    typeName.includes('CreateNestedMany') ||
    typeName.includes('UpdateManyNested')
  ) {
    return true;
  }

  return false;
}

export function isInputObjectType(typeName: string): boolean {
  return typeName.endsWith('Input');
}

function generateInputTypeNames(
  modelMap: Map<string, Set<string>>
): Set<string> {
  const inputTypeNames = new Set<string>();

  const crudOperations = [
    'Create',
    'CreateMany',
    'Update',
    'UpdateMany',
    'Upsert',
  ];
  const whereOperations = ['Where', 'WhereUnique', 'WhereInput'];

  modelMap.forEach((fields, modelName) => {
    fields.forEach((fieldName) => {
      crudOperations.forEach((operation) => {
        inputTypeNames.add(`${modelName}${operation}${fieldName}Input`);
      });

      whereOperations.forEach((operation) => {
        inputTypeNames.add(`${modelName}${operation}${fieldName}Input`);
      });

      inputTypeNames.add(`${modelName}${fieldName}ComparisonInput`);
      inputTypeNames.add(`${fieldName}NullableListFilter`);
      inputTypeNames.add(`${fieldName}ListFilter`);
    });
  });

  return inputTypeNames;
}

export const GRAPHQL_SCALARS = new Set([
  // Basic Scalars
  'String',
  'string',
  'Int',
  'number',
  'Float',
  'float',
  'boolean',
  'Boolean',
  'ID',
  'UUID',
  'Date',
  'DateTime',

  // Prisma Scalars and Filters
  'UuidFilter',
  'Json',
  'JsonValue',
  'Prisma.Json',
  'Prisma.JsonValue',
  'Prisma.JsonFilter',
  'Prisma.InputJsonValue',
  'Prisma.JSONObject',
  'Prisma.JsonNullableFilter',
  'Prisma.JSONValue',
  'JsonNullableFilter',
  'Prisma.JSONValueFilter',
  'BigInt',
  'bigint',
  'Decimal',
  'DecimalJSScalar',
  'Prisma.Decimal',
  'DateTimeFilter',
  'IntFilter',
  'StringFilter',
  'NullableStringFieldUpdateOperationsInput',
  'StringFieldUpdateOperationsInput',
  'StringNullableFilter',
  'BooleanFilter',
  'FloatFilter',
  'BigIntFilter',
  'DecimalFilter',
  'StringNullableListFilter',
  'StringListFilter',
  'IntNullableListFilter',
  'IntListFilter',
  'FloatNullableListFilter',
  'FloatListFilter',
  'DateTimeNullableFilter',
  'DateTimeListFilter',
]);

export function updateGraphQLScalars(schemaPath: string): Set<string> {
  const modelMap = parseSchema(schemaPath);
  const generatedInputTypes = generateInputTypeNames(modelMap);

  generatedInputTypes.forEach((inputType) => GRAPHQL_SCALARS.add(inputType));

  return GRAPHQL_SCALARS;
}

const MAX_RECURSION_DEPTH = 10;
const schemaPath = path.join(__dirname, '../../prisma/schema.prisma');
const updatedScalars = updateGraphQLScalars(schemaPath);

export function getInputTypeDefinition(
  typeFilePath: string | number | Buffer | URL
): FieldDefinition[] {
  if (!fs.existsSync(typeFilePath as string)) {
    logger.warn(`Warning: Input type file does not exist: ${typeFilePath}`);
    return [];
  }

  const content = fs.readFileSync(typeFilePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    typeFilePath as string,
    content,
    ts.ScriptTarget.Latest,
    true
  );

  const fields: FieldDefinition[] = [];
  const visitedNodes = new Set<ts.Node>();
  const visitedTypeNames = new Set<string>(); // Avoid infinite loops in type references

  const visitor = (node: ts.Node, depth = 0) => {
    if (depth > MAX_RECURSION_DEPTH) {
      logger.warn(
        `Max recursion depth exceeded for node: ${node.getText(sourceFile)} `
      );
      return;
    }

    if (visitedNodes.has(node)) {
      return;
    }
    visitedNodes.add(node);

    if (ts.isPropertySignature(node) || ts.isPropertyDeclaration(node)) {
      const field = extractField(node, sourceFile, depth);
      if (field) fields.push(field);
    }

    ts.forEachChild(node, (child) => visitor(child, depth + 1));
  };

  function extractField(
    node: ts.PropertySignature | ts.PropertyDeclaration,
    sf: ts.SourceFile,
    depth: number
  ): FieldDefinition | null {
    const fieldName = node.name.getText(sf);
    const fieldTypeNode = node.type;
    if (!fieldTypeNode) return null;

    const typeInfo = extractTypeInfo(fieldTypeNode, sf, depth) as FieldType;
    if (!typeInfo) return null;

    return {
      name: fieldName,
      type: typeInfo,
    };
  }

  function extractTypeInfo(
    typeNode: ts.TypeNode,
    sf: ts.SourceFile,
    depth = 0
  ): FieldType | null {
    if (depth > MAX_RECURSION_DEPTH) {
      logger.warn(
        `Max recursion depth exceeded for node: ${typeNode.getText(sf)}`
      );
      return null;
    }

    let isNullable = false;
    let isList = false;
    let isScalar = false;
    let isFieldUpdate = false;
    let isFilterObject = false;
    let isSetObject = false;
    let baseType: ts.TypeNode = typeNode;

    // Handle nullable types
    if (ts.isUnionTypeNode(typeNode)) {
      const types = typeNode.types.filter((t) => !isNullOrUndefined(t, sf));
      isNullable = types.length !== typeNode.types.length;
      baseType = types.length === 1 ? types[0] : typeNode;
    }

    // Extract array information
    const arrayInfo = extractArrayInfo(baseType, sf);
    isList = arrayInfo.isList;
    baseType = arrayInfo.baseType;

    // Check for specific type conditions
    if (ts.isTypeReferenceNode(baseType)) {
      const typeName = baseType.typeName.getText(sf);

      if (
        typeName.includes('FieldUpdateOperationsInput') ||
        typeName === 'BoolFieldUpdateOperationsInput' ||
        typeName === 'Prisma.InputJsonValue'
      ) {
        isFieldUpdate = true;
      }
      if (isSetObjectType(typeName)) {
        isSetObject = true;
      }

      // If scalar arrays
      if (isScalarArrayType(typeName)) {
        isScalar = true;
        isList = true;
      }

      if (isInputObjectType(typeName)) {
        isScalar = false;
      }

      let fieldType = handleTypeReference(
        baseType,
        sf,
        isList,
        isNullable,
        depth,
        visitedTypeNames
      );
      fieldType = detectAdditionalListPatterns(fieldType, baseType, sf);
      return fieldType;
    }

    // Handle literal types
    if (ts.isLiteralTypeNode(baseType)) {
      const literalField = handleLiteralType(baseType, isList, isNullable);
      return detectAdditionalListPatterns(literalField, baseType, sf);
    }

    // If we get here, likely a primitive type or unknown
    const typeText = baseType.getText(sf);
    if (isScalarType(typeText)) {
      isScalar = true;
    }

    let field: FieldType = {
      name: typeText,
      isScalar,
      isList,
      isNullable,
      isFieldUpdate,
      isFilterObject,
      isSetObject,
    };

    field = detectAdditionalListPatterns(field, baseType, sf, typeText);

    return field;
  }

  function handleTypeReference(
    node: ts.TypeReferenceNode,
    sf: ts.SourceFile,
    isList: boolean,
    isNullable: boolean,
    depth: number,
    visitedTypeNames: Set<string>
  ): FieldType {
    const typeName = node.typeName.getText(sf);
    const consideredScalar = isScalarType(typeName);
    const isFieldUpdate =
      typeName.includes('FieldUpdateOperationsInput') ||
      typeName.includes('BoolFieldUpdateOperationsInput') ||
      typeName.includes('Prisma.InputJsonValue');

    let isFilterObject = false;
    let isSetObject = false;
    if (typeName.includes('Filter')) {
      isFilterObject = true;
    }
    if (isSetObjectType(typeName)) {
      isSetObject = true;
    }

    // Known patterns for arrays
    if (typeName.includes('NestedInput') && typeName.includes('Many')) {
      isList = true;
    }
    if (typeName.includes('ListRelationFilter')) {
      isList = true;
    }
    if (typeName.includes('CreateNestedMany')) {
      isList = true;
    }
    if (!consideredScalar && typeName.includes('[]')) {
      isList = true;
    }

    let ofType: FieldType[] | undefined;
    if (node.typeArguments && node.typeArguments.length > 0) {
      const genericArgs = node.typeArguments.map((arg) =>
        extractTypeInfo(arg, sf, depth + 1)
      );
      ofType = genericArgs.filter((arg): arg is FieldType => arg !== null);
    }

    const fieldType: FieldType = {
      name: capitalizeFirstLetter(typeName),
      isScalar: consideredScalar,
      isList,
      isNullable,
      isFieldUpdate,
      isFilterObject,
      ofType,
      isSetObject,
    };

    // If not scalar, filter, and ofType is empty, try to resolve interface/type alias fields
    if (!consideredScalar && !isFilterObject) {
      // Avoid infinite recursion on the same type name
      const cleanTypeName = capitalizeFirstLetter(typeName);
      if (!visitedTypeNames.has(cleanTypeName)) {
        visitedTypeNames.add(cleanTypeName);
        const nestedFields = extractObjectDefinitionFields(
          cleanTypeName,
          sf,
          depth + 1,
          visitedTypeNames
        );
        if (nestedFields.length > 0) {
          // Convert the nested fields into a field type's ofType array
          fieldType.ofType = nestedFields.map((f) => f.type);
        }
      }
    }

    return fieldType;
  }

  function extractObjectDefinitionFields(
    typeName: string,
    sf: ts.SourceFile,
    depth: number,
    visitedTypeNames: Set<string>
  ): FieldDefinition[] {
    if (depth > MAX_RECURSION_DEPTH) return [];

    // Try to find InterfaceDeclaration or TypeAliasDeclaration matching typeName
    const foundNode = sf.statements.find(
      (stmt) =>
        (ts.isInterfaceDeclaration(stmt) || ts.isTypeAliasDeclaration(stmt)) &&
        stmt.name?.getText(sf) === typeName
    );

    if (!foundNode) return [];

    let members: ts.NodeArray<ts.TypeElement> | ts.TypeNode | undefined;

    if (ts.isInterfaceDeclaration(foundNode)) {
      members = foundNode.members;
    } else if (ts.isTypeAliasDeclaration(foundNode)) {
      if (ts.isTypeLiteralNode(foundNode.type)) {
        members = foundNode.type.members;
      } else {
        // If it's not a type literal, we cannot directly parse it.
        return [];
      }
    }

    if (!members) return [];
    const resultFields: FieldDefinition[] = [];
    if (Array.isArray(members)) {
      for (const m of members) {
        if (ts.isPropertySignature(m) && m.type) {
          const fieldType = extractTypeInfo(m.type, sf, depth);
          if (fieldType) {
            resultFields.push({ name: m.name.getText(sf), type: fieldType });
          }
        }
      }
    }

    return resultFields;
  }

  function handleLiteralType(
    node: ts.LiteralTypeNode,
    isList: boolean,
    isNullable: boolean
  ): FieldType {
    const literal = node.literal;
    let literalType: string;

    if (ts.isStringLiteral(literal)) {
      literalType = 'string';
    } else if (ts.isNumericLiteral(literal)) {
      literalType = 'number';
    } else if (
      literal.kind === ts.SyntaxKind.TrueKeyword ||
      literal.kind === ts.SyntaxKind.FalseKeyword
    ) {
      literalType = 'boolean';
    } else {
      literalType = 'unknown';
    }

    return {
      name: literalType,
      isScalar: true,
      isList,
      isNullable,
      isFieldUpdate: false,
    };
  }

  function detectAdditionalListPatterns(
    field: FieldType,
    typeNode: ts.TypeNode,
    sf: ts.SourceFile,
    typeText?: string
  ): FieldType {
    const typeName = ts.isTypeReferenceNode(typeNode)
      ? typeNode.typeName.getText(sf)
      : (typeText ?? typeNode.getText(sf));

    if (!field.isList) {
      if (typeName.includes('[]')) {
        field.isList = true;
      }
      if (!field.isList && isScalarType(typeName) && typeName.endsWith('[]')) {
        field.isList = true;
      }
      if (typeName.includes('NestedMany')) {
        field.isList = true;
      }
      if (typeName.includes('ListRelationFilter')) {
        field.isList = true;
      }
      if (typeName.includes('CreateNestedMany')) {
        field.isList = true;
      }
    }

    return field;
  }

  function extractArrayInfo(
    typeNode: ts.TypeNode,
    sf: ts.SourceFile
  ): { isList: boolean; baseType: ts.TypeNode } {
    let isList = false;
    let baseType = typeNode;

    while (
      ts.isArrayTypeNode(baseType) ||
      (ts.isTypeReferenceNode(baseType) &&
        baseType.typeName.getText(sf) === 'Array')
    ) {
      isList = true;
      if (ts.isArrayTypeNode(baseType)) {
        baseType = baseType.elementType;
      } else if (
        ts.isTypeReferenceNode(baseType) &&
        baseType.typeArguments &&
        baseType.typeArguments.length > 0
      ) {
        baseType = baseType.typeArguments[0];
      }
    }

    return { isList, baseType };
  }

  try {
    ts.forEachChild(sourceFile, (child) => visitor(child));
  } catch (e) {
    logger.error('Error processing AST', { error: String(e) });
  }

  return fields;
}

function isNullOrUndefined(
  type: ts.TypeNode,
  sourceFile: ts.SourceFile
): boolean {
  const typeText = type.getText(sourceFile);
  return typeText === 'null' || typeText === 'undefined';
}
