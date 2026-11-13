/**
 * Shapes of the JSON columns on `MandateVersion` (G-MAN-01): the autonomy
 * matrix, the escalation triggers and the instrument permissions.
 *
 * Postgres stores them as JSONB, which accepts any value, and the engine and
 * the desk both read them as typed structures. A malformed write would be
 * accepted at the database and fail at every reader, so the shape is checked
 * at the write boundary instead (`src/middleware/mandate-version-validation.ts`).
 * The shapes mirror the platform's `lib/desk/types/mandate.ts`; `null` means
 * the version sets none, as the schema documents.
 *
 * @module validators/mandate-version-json
 */

import { z } from 'zod';

/** A matrix cell: what the desk may do without a human. */
export const MatrixTierSchema = z.enum([
  'auto',
  'notify',
  'approve',
  'forbidden',
]);

/** The four size buckets of one action, smallest first. */
const MatrixRowSchema = z.tuple([
  MatrixTierSchema,
  MatrixTierSchema,
  MatrixTierSchema,
  MatrixTierSchema,
]);

/** One scope of the matrix: a row for each governed action. */
export const AutonomyScopeSchema = z
  .object({
    open: MatrixRowSchema,
    add: MatrixRowSchema,
    reduce: MatrixRowSchema,
    close: MatrixRowSchema,
    hedge: MatrixRowSchema,
    'new-instrument': MatrixRowSchema,
  })
  .strict();

/** `MandateVersion.autonomy`: the matrix for all desks and for each desk. */
export const MandateAutonomySchema = z
  .object({
    all: AutonomyScopeSchema,
    event: AutonomyScopeSchema,
    thematic: AutonomyScopeSchema,
    systematic: AutonomyScopeSchema,
  })
  .strict();

/** One escalation trigger. `deadlineMinutes: null` means the decision is immediate. */
export const EscalationTriggerSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    condition: z.string().min(1),
    route: z.string().min(1),
    deadlineMinutes: z.number().int().positive().nullable(),
    defaultAction: z.string().min(1),
    enabled: z.boolean(),
  })
  .strict();

/** `MandateVersion.triggers`. */
export const MandateTriggersSchema = z.array(EscalationTriggerSchema);

/** `MandateVersion.instruments`. */
export const MandateInstrumentsSchema = z.array(
  z
    .object({
      id: z.string().min(1),
      label: z.string().min(1),
      enabled: z.boolean(),
    })
    .strict()
);

/** The validated JSON columns, by field name. */
export const MANDATE_VERSION_JSON_SCHEMAS: ReadonlyMap<string, z.ZodTypeAny> =
  new Map<string, z.ZodTypeAny>([
    ['autonomy', MandateAutonomySchema.nullable()],
    ['triggers', MandateTriggersSchema.nullable()],
    ['instruments', MandateInstrumentsSchema.nullable()],
  ]);

/** One shape violation, located by argument path. */
export interface MandateJsonViolation {
  /** Argument path to the offending value, e.g. `data.autonomy.all.open.4`. */
  readonly path: string;
  readonly message: string;
}

/**
 * Validate the JSON columns present in one MandateVersion data object. Fields
 * the object does not set are not checked: an update that leaves `autonomy`
 * alone has nothing to validate.
 *
 * @param data - A MandateVersion create or update data object.
 * @param basePath - The argument path of `data`, for messages.
 * @returns Every violation found; empty when the object is admissible.
 */
export function mandateVersionJsonViolations(
  data: Readonly<Record<string, unknown>>,
  basePath: string
): MandateJsonViolation[] {
  const violations: MandateJsonViolation[] = [];
  for (const [field, schema] of MANDATE_VERSION_JSON_SCHEMAS) {
    if (!(field in data) || data[field] === undefined) continue;
    const result = schema.safeParse(data[field]);
    if (result.success) continue;
    for (const issue of result.error.issues) {
      violations.push({
        path: [basePath, field, ...issue.path.map(String)]
          .filter((p) => p.length > 0)
          .join('.'),
        message: issue.message,
      });
    }
  }
  return violations;
}
