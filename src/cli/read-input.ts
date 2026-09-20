import { resolveHostPath } from "./posix-path.ts";

import type { CliHost } from "./host.ts";

export async function readConvertInput(
  host: CliHost,
  filePath: string | undefined,
): Promise<string> {
  if (filePath === undefined) {
    return host.stdin;
  }
  return await host.readFile(resolveHostPath(host.cwd, filePath));
}
