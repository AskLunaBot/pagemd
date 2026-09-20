import type { ParsedCli } from "./parsed.ts";

export function needsHelp(parsed: ParsedCli, stdinIsTty: boolean): boolean {
  if (parsed.help) {
    return true;
  }
  if (parsed.positional.length > 0) {
    return false;
  }
  if (parsed.action === "convert") {
    return stdinIsTty;
  }
  return true;
}
