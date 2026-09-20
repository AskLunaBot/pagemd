/* oxlint-disable unicorn/no-process-exit -- CLI process exit codes. */

import { readFile } from "node:fs/promises";
import { text } from "node:stream/consumers";

import { createMdFetchCommand } from "./command.ts";

import type { MdFetchCommandContext } from "./command.ts";

async function main(): Promise<void> {
  const command = createMdFetchCommand(await nodeContext());
  const result = await command.execute(process.argv.slice(2));
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.exitCode);
}

async function nodeContext(): Promise<MdFetchCommandContext> {
  return {
    cwd: process.cwd(),
    stdinIsTty: process.stdin.isTTY,
    stdin: await nodeStdin(),
    readFile: async (path) => await readFile(path, "utf8"),
  };
}

async function nodeStdin(): Promise<string> {
  if (process.stdin.isTTY) {
    return "";
  }
  return await text(process.stdin);
}

await main();
