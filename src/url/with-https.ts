export function ensureScheme(raw: string, isLocal: boolean): string {
  if (/^[a-z][a-z0-9+.-]*:/iu.test(raw)) {
    return raw;
  }
  if (isLocal) {
    return `http://${raw}`;
  }
  return `https://${raw}`;
}
