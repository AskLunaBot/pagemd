export function withOptional<Key extends string, Value>(
  key: Key,
  value: Value | undefined,
): Partial<Record<Key, Value>> {
  if (value === undefined) {
    return {};
  }
  const result: Partial<Record<Key, Value>> = {};
  result[key] = value;
  return result;
}
