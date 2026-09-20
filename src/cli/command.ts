import { executeCli } from "./execute.ts";

import type { CliExecResult } from "./exec-result.ts";
import type { CliHost } from "./host.ts";
import type { CreatePagemdOptions } from "@/types/options.ts";

export type { CliExecResult } from "./exec-result.ts";

export type PagemdCommandContext = CreatePagemdOptions & {
  readonly cwd?: string;
  readonly stdin?: string;
  readonly stdinIsTty?: boolean;
  readonly readFile?: (path: string) => Promise<string>;
};

export type PagemdCommand = {
  readonly execute: (args: string[]) => Promise<CliExecResult>;
};

/**
 * A bash-command shape: bind host IO once, then `execute(argv)`.
 */
export function createPagemdCommand(
  ctx: PagemdCommandContext = {},
): PagemdCommand {
  return { execute: async (args) => await executeCli(args, toHost(ctx), ctx) };
}

function toHost(ctx: PagemdCommandContext): CliHost {
  return {
    cwd: ctx.cwd ?? "/",
    stdin: ctx.stdin ?? "",
    stdinIsTty: ctx.stdinIsTty ?? ctx.stdin === undefined,
    readFile: ctx.readFile ?? missingFile,
  };
}

async function missingFile(path: string): Promise<string> {
  return await Promise.reject(new Error(`No filesystem; cannot read ${path}.`));
}
