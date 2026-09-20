export function readHeader(headers: Headers, name: string): string | undefined {
  const value = headers.get(name) ?? undefined;
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }
  return value;
}
