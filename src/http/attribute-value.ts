export function htmlAttribute(tag: string, name: string): string | undefined {
  const pattern = new RegExp(
    `${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "iu",
  );
  const match = pattern.exec(tag);
  const value = match?.[1] ?? match?.[2] ?? match?.[3];
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }
  return value;
}
