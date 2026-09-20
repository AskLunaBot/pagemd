import { headersFromLines } from "@/http/header-record.ts";
import { withOptional } from "@/utils/optional.ts";

import type { ParsedCli } from "./parsed.ts";
import type { CacheMode, CreatePagemdOptions } from "@/types/options.ts";

export function clientOptions(
  parsed: ParsedCli,
  defaults: CreatePagemdOptions,
): CreatePagemdOptions {
  return {
    ...defaults,
    ...withOptional("userAgent", parsed.userAgent),
    ...withOptional("headers", mergeHeaders(defaults.headers, parsed.headers)),
    ...withOptional("timeoutMs", parsed.timeoutMs),
    ...withOptional("retry", parsed.retry),
    ...withOptional("retryDelayMs", parsed.retryDelayMs),
    ...withOptional("maxBytes", parsed.maxBytes),
    ...withOptional("cache", cacheOption(parsed.cache) ?? defaults.cache),
  };
}

function mergeHeaders(
  extra: CreatePagemdOptions["headers"],
  lines: readonly string[] | undefined,
): Readonly<Record<string, string>> | undefined {
  const fromLines = headersFromLines(lines);
  if (extra === undefined) {
    return fromLines;
  }
  if (fromLines === undefined) {
    return extra;
  }
  return { ...extra, ...fromLines };
}

function cacheOption(cache: CacheMode): "false" | undefined {
  if (cache === "false") {
    return cache;
  }
  return undefined;
}
