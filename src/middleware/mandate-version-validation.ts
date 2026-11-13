/**
 * Shape validation for the `MandateVersion` JSON columns on every write path.
 *
 * `autonomy`, `triggers` and `instruments` are JSONB, so the database accepts
 * any value; their shapes are checked here before the resolver runs
 * (`src/validators/mandate-version-json.ts`). The check is type-directed: it
 * walks each root Mutation field's arguments along their GraphQL input types
 * and validates every input object whose type is a MandateVersion data input
 * — a `MandateVersion*` input object carrying `autonomy` as a JSON scalar. So
 * `createOneMandateVersion`, `updateOneMandateVersion`, the upserts and the
 * many-variants, and a version created or updated NESTED inside a Mandate
 * write, are all held to the same shape; filter inputs (whose `autonomy` is a
 * JSON filter, not the JSON scalar) are not.
 *
 * Installed like the mutation guard, by wrapping the Mutation fields of the
 * built schema, so reads pay nothing. Install it BEFORE the mutation guard:
 * the guard then wraps it, so authorization is decided before a caller learns
 * anything from a validation message.
 *
 * @module middleware/mandate-version-validation
 */

import {
  defaultFieldResolver,
  getNamedType,
  getNullableType,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLScalarType,
  type GraphQLField,
  type GraphQLInputType,
  type GraphQLSchema,
} from 'graphql';

import {
  mandateVersionJsonViolations,
  type MandateJsonViolation,
} from '../validators/mandate-version-json';

/** Name prefix of every typegraphql-prisma input type for the model. */
const MODEL_INPUT_PREFIX = 'MandateVersion';

/** Whether an input object type is a MandateVersion DATA input (create/update), not a filter. */
function isMandateVersionDataInput(type: GraphQLInputObjectType): boolean {
  if (!type.name.startsWith(MODEL_INPUT_PREFIX)) return false;
  const autonomy = type.getFields().autonomy;
  return (
    autonomy !== undefined &&
    getNamedType(autonomy.type) instanceof GraphQLScalarType
  );
}

function walk(
  value: unknown,
  type: GraphQLInputType,
  path: string,
  violations: MandateJsonViolation[]
): void {
  if (value === null || value === undefined) return;
  const nullable = getNullableType(type);
  if (nullable instanceof GraphQLList) {
    const itemType = nullable.ofType as GraphQLInputType;
    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        walk(item, itemType, `${path}.${index}`, violations)
      );
    } else {
      walk(value, itemType, path, violations);
    }
    return;
  }
  if (!(nullable instanceof GraphQLInputObjectType)) return;
  if (typeof value !== 'object' || Array.isArray(value)) return;
  const record = value as Record<string, unknown>;
  if (isMandateVersionDataInput(nullable)) {
    violations.push(...mandateVersionJsonViolations(record, path));
  }
  const fields = nullable.getFields();
  for (const [key, child] of Object.entries(record)) {
    const field = fields[key];
    if (!field) continue;
    walk(
      child,
      field.type,
      path.length > 0 ? `${path}.${key}` : key,
      violations
    );
  }
}

/**
 * Every MandateVersion JSON shape violation in a mutation's arguments.
 *
 * @param field - The root Mutation field.
 * @param args - Its resolved arguments.
 */
export function findMandateVersionViolations(
  field: Pick<GraphQLField<unknown, unknown>, 'args'>,
  args: Record<string, unknown>
): MandateJsonViolation[] {
  const violations: MandateJsonViolation[] = [];
  for (const arg of field.args) {
    walk(args[arg.name], arg.type, arg.name, violations);
  }
  return violations;
}

/** The `BAD_USER_INPUT` error (HTTP 400) listing the violations. */
export function mandateVersionValidationError(
  violations: readonly MandateJsonViolation[]
): GraphQLError {
  return new GraphQLError(
    `Invalid MandateVersion JSON: ${violations.map((v) => `${v.path}: ${v.message}`).join('; ')}`,
    {
      extensions: { code: 'BAD_USER_INPUT', violations, http: { status: 400 } },
    }
  );
}

const validatedFields = new WeakSet<GraphQLField<unknown, unknown>>();

/**
 * Wrap every root Mutation field of a built schema with the shape check.
 *
 * @param schema - The schema `buildSchema` returned; mutated in place.
 * @returns How many Mutation fields can write a MandateVersion (zero means the
 *   check protects nothing and the codegen naming has drifted).
 */
export function installMandateVersionValidation(schema: GraphQLSchema): number {
  const mutationType = schema.getMutationType();
  if (!mutationType) return 0;
  let covered = 0;
  for (const field of Object.values(mutationType.getFields())) {
    if (validatedFields.has(field) || !reachesMandateVersionData(field))
      continue;
    covered += 1;
    const original = field.resolve ?? defaultFieldResolver;
    field.resolve = (source, args, context, info) => {
      const violations = findMandateVersionViolations(
        field,
        args as Record<string, unknown>
      );
      if (violations.length > 0)
        throw mandateVersionValidationError(violations);
      return original(source, args, context, info);
    };
    validatedFields.add(field);
  }
  return covered;
}

/** Whether any argument of a field can (transitively) carry a MandateVersion data input. */
function reachesMandateVersionData(
  field: GraphQLField<unknown, unknown>
): boolean {
  const seen = new Set<string>();
  const visit = (type: GraphQLInputType): boolean => {
    const named = getNamedType(type);
    if (!(named instanceof GraphQLInputObjectType) || seen.has(named.name))
      return false;
    seen.add(named.name);
    if (isMandateVersionDataInput(named)) return true;
    return Object.values(named.getFields()).some((f) => visit(f.type));
  };
  return field.args.some((arg) => visit(arg.type));
}
