/**
 * Best-guess HTML detector. There is no reliable way to validate HTML.
 *
 * @param value - Raw response body.
 *
 * @returns True when trimmed text is longer than 7, starts with `<`, and ends
 *   with `>`.
 */
export function isHtml(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length <= 7) {
    return false;
  }
  if (!trimmed.startsWith("<")) {
    return false;
  }
  return trimmed.endsWith(">");
}
