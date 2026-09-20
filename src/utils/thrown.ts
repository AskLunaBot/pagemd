/* oxlint-disable typescript/no-restricted-types -- catch values are untyped. */

export function thrownError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }
  return new Error("Unknown failure");
}
