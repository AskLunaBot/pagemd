import { parsePositiveNumber, parseSwitch } from "@/cli/flag-value.ts";

import type { ParsedCli } from "@/cli/parsed.ts";

export function withDiscoverFlags(
  draft: ParsedCli,
  name: string,
  value: string,
): ParsedCli | undefined {
  if (name === "--protocol") {
    return {
      ...draft,
      protocolIds: value.split(",").map((item) => item.trim()),
    };
  }
  if (name === "--expand-skills") {
    return { ...draft, expandSkills: parseSwitch(name, value) };
  }
  if (name === "--limit") {
    return { ...draft, limit: parsePositiveNumber(name, value) };
  }
  return undefined;
}
