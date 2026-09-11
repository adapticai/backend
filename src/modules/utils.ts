// src/modules/utils.ts

// Function to capitalize the first letter, ensuring the value is not undefined
export function capitalizeFirstLetter(str: string | undefined): string {
  if (!str) {
    throw new Error('Model name is undefined');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// function to convert first letter to lowercase
export function lowerCaseFirstLetter(string: string): string {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

/**
 * Removes undefined properties from an object recursively.
 *
 * Preserves the structural shape of the input so consumers can keep using the
 * filtered value with the same type as the original. Pure primitives and
 * `null` values pass through untouched.
 *
 * @param obj - The object to filter.
 * @returns A new object without undefined properties.
 */
export const removeUndefinedProps = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeUndefinedProps(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .reduce<Record<string, unknown>>((acc, [k, v]) => {
        acc[k] = removeUndefinedProps(v);
        return acc;
      }, {}) as T;
  }
  return obj;
};
