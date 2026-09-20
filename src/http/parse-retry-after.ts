export function parseRetryAfterSeconds(
  value: string | undefined,
): number | undefined {
  if (value === undefined) {
    return undefined;
  }
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return asNumber;
  }
  const date = Date.parse(value);
  if (Number.isNaN(date)) {
    return undefined;
  }
  const now = Date.now();
  return Math.max(0, Math.ceil((date - now) / 1000));
}
