import type { ParsedCli } from "@/cli/parsed.ts";

export function withConvertFlags(
  draft: ParsedCli,
  name: string,
  value: string,
): ParsedCli | undefined {
  if (name === "--base-url") {
    return { ...draft, baseUrl: value };
  }
  return undefined;
}
