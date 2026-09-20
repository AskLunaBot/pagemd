import { parseCacheMode, parsePositiveNumber } from "./flag-value.ts";

import type { ParsedCli } from "./parsed.ts";

type FlagApplier = (draft: ParsedCli, value: string) => ParsedCli;

const globalAppliers: Readonly<Record<string, FlagApplier>> = {
  "--user-agent": (draft, value) => ({ ...draft, userAgent: value }),
  "--header": (draft, value) => ({
    ...draft,
    headers: [...(draft.headers ?? []), value],
  }),
  "--timeout-ms": (draft, value) => ({
    ...draft,
    timeoutMs: parsePositiveNumber("--timeout-ms", value),
  }),
  "--retry": (draft, value) => ({
    ...draft,
    retry: parsePositiveNumber("--retry", value),
  }),
  "--retry-delay-ms": (draft, value) => ({
    ...draft,
    retryDelayMs: parsePositiveNumber("--retry-delay-ms", value),
  }),
  "--max-bytes": (draft, value) => ({
    ...draft,
    maxBytes: parsePositiveNumber("--max-bytes", value),
  }),
  "--cache": (draft, value) => ({ ...draft, cache: parseCacheMode(value) }),
};

export function withGlobalFlags(
  draft: ParsedCli,
  name: string,
  value: string,
): ParsedCli | undefined {
  const apply = globalAppliers[name];
  if (apply === undefined) {
    return undefined;
  }
  return apply(draft, value);
}
