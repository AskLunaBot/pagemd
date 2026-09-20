import { parseHeaderLine } from "./parse-header-line.ts";

export function headersFromLines(
  lines: readonly string[] | undefined,
): Readonly<Record<string, string>> | undefined {
  if (lines === undefined || lines.length === 0) {
    return undefined;
  }
  const result: Record<string, string> = {};
  for (const line of lines) {
    const parsed = parseHeaderLine(line);
    result[parsed.name] = parsed.value;
  }
  return result;
}
