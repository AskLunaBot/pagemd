import { parseArgv } from "./parse.ts";

import type { ParsedCli } from "./parsed.ts";

export function safeParse(argv: string[]): ParsedCli {
  try {
    return parseArgv(argv);
  } catch {
    return {
      action: "unknown",
      explicitAction: false,
      json: argv.includes("--json"),
      help: false,
      positional: [],
      cache: "lru",
    };
  }
}
