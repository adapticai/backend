/**
 * Check if a value is a plain object (created via {} or new Object()), as opposed
 * to a class instance (Date, Decimal, Buffer, etc.) that should be treated as a leaf.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Recursively removes undefined properties from an object or array.
 *
 * Object properties whose value is `null` are PRESERVED. In a Prisma update an
 * omitted field is left untouched while `{ set: null }` clears it, so dropping
 * null would silently turn every "clear this field" into a no-op that still
 * reports success.
 *
 * This utility is called by generated CRUD functions to clean GraphQL variables
 * before passing them to Apollo Client. The input objects contain Prisma-typed
 * fields (Date, Decimal, bigint, JsonValue, nested relations, etc.) which cannot
 * be enumerated exhaustively. The return value is used as Apollo OperationVariables.
 *
 * Class instances (Date, Decimal, etc.) are preserved as leaf values — only plain
 * objects and arrays are recursed into. This prevents Decimal objects (which have
 * no own enumerable keys) from being incorrectly stripped as "empty objects".
 *
 * We use Record<string, unknown> for the parameter to accept all generated Prisma
 * input shapes without needing to enumerate every possible field type.
 */
export function removeUndefinedProps(
  obj: Record<string, unknown> | Record<string, unknown>[] | unknown
): Record<string, unknown> | undefined {
  if (Array.isArray(obj)) {
    return obj
      .map((item) => removeUndefinedProps(item))
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          (!isPlainObject(item) || Object.keys(item).length > 0)
      ) as unknown as Record<string, unknown>;
  } else if (isPlainObject(obj)) {
    const record = obj;
    return Object.keys(record).reduce((acc: Record<string, unknown>, key) => {
      const value = record[key];

      // `null` is a VALUE and survives; only `undefined` is an absence.
      //
      // The two mean opposite things in a Prisma update: an omitted field is
      // left alone, `{ set: null }` clears it. Treating them alike made
      // clearing a nullable field impossible on every generated model —
      // `update({ id, field: null })` returned the unchanged row with no error,
      // because this function emptied `{ set: null }` to `{}` and the
      // empty-object rule below then dropped the field entirely. A write that
      // reports success while changing nothing is worse than one that fails.
      //
      // Short-circuited here rather than by relaxing the guards below, because
      // those also govern array items and the scalar tail, where dropping null
      // is long-standing behaviour this correction has no reason to disturb.
      if (value === null) {
        acc[key] = null;
        return acc;
      }

      if (value !== undefined) {
        let cleanedValue: unknown;

        if (key === 'where' && isPlainObject(value)) {
          const whereObj = value;
          if (
            Object.prototype.hasOwnProperty.call(whereObj, 'id') &&
            whereObj.id !== undefined
          ) {
            // Retain only the 'id' field within 'where'
            cleanedValue = {
              id: removeUndefinedProps(whereObj.id as Record<string, unknown>),
            };
          } else {
            // Process 'where' object normally if 'id' is undefined or doesn't exist
            cleanedValue = removeUndefinedProps(
              value as Record<string, unknown>
            );
          }
        } else {
          // Process other keys normally
          cleanedValue = removeUndefinedProps(value as Record<string, unknown>);
        }

        if (
          cleanedValue !== undefined &&
          cleanedValue !== null &&
          (!isPlainObject(cleanedValue) || Object.keys(cleanedValue).length > 0)
        ) {
          acc[key] = cleanedValue;
        }
      }

      return acc;
    }, {});
  }

  return obj !== undefined && obj !== null
    ? (obj as Record<string, unknown>)
    : undefined;
}
