export function stripWrappingQuotes(value: string): string {
  const trimmed = value.trim();
  const first = trimmed.at(0);
  const last = trimmed.at(-1);
  if (first === undefined || last === undefined) {
    return trimmed;
  }
  if (first === last && (first === '"' || first === "'")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
