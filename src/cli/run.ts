import { createPagemd } from "@/client/create.ts";

import { discoverOptions, fetchOptions } from "./action-options.ts";
import { clientOptions } from "./client-options.ts";
import { collectTargets } from "./collect-targets.ts";
import { convertOptionsFor } from "./convert-base.ts";
import { missingArgumentError } from "./parse-error.ts";
import { readConvertInput } from "./read-input.ts";

import type { ActionResult, SingleResult } from "./action-result.ts";
import type { CliHost } from "./host.ts";
import type { ParsedCli } from "./parsed.ts";
import type { PagemdClient } from "@/client/create.ts";
import type { CreatePagemdOptions } from "@/types/options.ts";

export async function runAction(
  parsed: ParsedCli,
  host: CliHost,
  defaults: CreatePagemdOptions = {},
): Promise<ActionResult> {
  const client = createPagemd(clientOptions(parsed, defaults));
  return await dispatch(client, parsed, host);
}

async function dispatch(
  client: PagemdClient,
  parsed: ParsedCli,
  host: CliHost,
): Promise<ActionResult> {
  if (parsed.action === "convert") {
    return await runConvert(client, parsed, host);
  }
  if (parsed.action === "discover") {
    return await runMany(requireTargets(parsed), async (target) => {
      return await client.discover(target, discoverOptions(parsed));
    });
  }
  return await runMany(requireTargets(parsed), async (target) => {
    return await client.fetch(target, fetchOptions(parsed));
  });
}

type ConvertJob = {
  readonly client: PagemdClient;
  readonly parsed: ParsedCli;
  readonly host: CliHost;
  readonly filePath?: string;
};

async function runConvert(
  client: PagemdClient,
  parsed: ParsedCli,
  host: CliHost,
): Promise<ActionResult> {
  const files = collectTargets(parsed.positional);
  if (files.length === 0) {
    return await convertOne({ client, parsed, host });
  }
  return await runMany(files, async (file) => {
    return await convertOne({ client, parsed, host, filePath: file });
  });
}

async function convertOne(job: ConvertJob): Promise<SingleResult> {
  return await job.client.convert(
    await readConvertInput(job.host, job.filePath),
    convertOptionsFor(job.parsed, job.host, job.filePath),
  );
}

async function runMany(
  targets: string[],
  run: (target: string) => Promise<SingleResult>,
): Promise<ActionResult> {
  const results = await Promise.all(
    targets.map(async (target) => await run(target)),
  );
  return pack(results);
}

function pack(results: SingleResult[]): ActionResult {
  if (results.length === 1) {
    const only = results[0];
    if (only !== undefined) {
      return only;
    }
  }
  return { results };
}

function requireTargets(parsed: ParsedCli): string[] {
  const targets = collectTargets(parsed.positional);
  if (targets.length === 0) {
    throw missingArgumentError("url", parsed.action);
  }
  return targets;
}
