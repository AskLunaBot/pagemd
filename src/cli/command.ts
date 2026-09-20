import { executeCli } from "./execute.ts";

import type { CliExecResult } from "./exec-result.ts";
import type { CliHost } from "./host.ts";
import type { CreateMdFetchOptions } from "@/types/options.ts";

export type { CliExecResult } from "./exec-result.ts";

export type MdFetchCommandContext = CreateMdFetchOptions & {
  readonly cwd?: string;
  readonly stdin?: string;
  readonly stdinIsTty?: boolean;
  readonly readFile?: (path: string) => Promise<string>;
};

export type MdFetchCommand = {
  readonly execute: (args: string[]) => Promise<CliExecResult>;
};

/**
 * A bash-command shape: bind host IO once, then `execute(argv)`.
 */
export function createMdFetchCommand(
  ctx: MdFetchCommandContext = {},
): MdFetchCommand {
  return { execute: async (args) => await executeCli(args, toHost(ctx), ctx) };
}

function toHost(ctx: MdFetchCommandContext): CliHost {
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
