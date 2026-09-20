import { withOptional } from "@/utils/optional.ts";

import { posixFileUrl, resolveHostPath } from "./posix-path.ts";

import type { CliHost } from "./host.ts";
import type { ParsedCli } from "./parsed.ts";
import type { ConvertOptions } from "@/types/options.ts";

export function convertOptionsFor(
  parsed: ParsedCli,
  host: CliHost,
  filePath: string | undefined,
): ConvertOptions {
  if (parsed.baseUrl !== undefined) {
    return { baseUrl: parsed.baseUrl };
  }
  return withOptional("baseUrl", fileBaseUrl(host, filePath));
}

function fileBaseUrl(
  host: CliHost,
  filePath: string | undefined,
): string | undefined {
  if (filePath === undefined) {
    return undefined;
  }
  return posixFileUrl(resolveHostPath(host.cwd, filePath));
}
