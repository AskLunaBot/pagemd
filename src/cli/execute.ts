import { thrownError } from "@/utils/thrown.ts";

import { asMdFetchError } from "./as-error.ts";
import { exitCodeFor } from "./exit-code.ts";
import { needsHelp } from "./needs-help.ts";
import { parseArgv } from "./parse.ts";
import { renderFailure, renderHelp, renderSuccess } from "./render.ts";
import { runAction } from "./run.ts";
import { safeParse } from "./safe-parse.ts";

import type { CliExecResult } from "./exec-result.ts";
import type { CliHost } from "./host.ts";
import type { CreateMdFetchOptions } from "@/types/options.ts";

export async function executeCli(
  argv: string[],
  host: CliHost,
  defaults: CreateMdFetchOptions = {},
): Promise<CliExecResult> {
  try {
    return await executeOk(argv, host, defaults);
  } catch (error) {
    return executeFail(argv, thrownError(error));
  }
}

async function executeOk(
  argv: string[],
  host: CliHost,
  defaults: CreateMdFetchOptions,
): Promise<CliExecResult> {
  const parsed = parseArgv(argv);
  if (needsHelp(parsed, host.stdinIsTty)) {
    return { stdout: renderHelp(parsed), stderr: "", exitCode: 0 };
  }
  const data = await runAction(parsed, host, defaults);
  return { stdout: renderSuccess(parsed, data), stderr: "", exitCode: 0 };
}

function executeFail(argv: string[], error: Error): CliExecResult {
  const parsed = safeParse(argv);
  const wrapped = asMdFetchError(error);
  const rendered = renderFailure(parsed, wrapped);
  if (parsed.json) {
    return {
      stdout: rendered,
      stderr: "",
      exitCode: exitCodeFor(wrapped.code),
    };
  }
  return { stdout: "", stderr: rendered, exitCode: exitCodeFor(wrapped.code) };
}
