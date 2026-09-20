export function linkParameterMap(rest: string): Map<string, string> {
  const parameters = new Map<string, string>();
  const pattern = /(\w+)=(?:"([^"]*)"|([^;,\s]+))/gu;
  for (const match of rest.matchAll(pattern)) {
    const key = match[1];
    const value = match[2] ?? match[3];
    if (key !== undefined && value !== undefined) {
      parameters.set(key.toLowerCase(), value);
    }
  }
  return parameters;
}
