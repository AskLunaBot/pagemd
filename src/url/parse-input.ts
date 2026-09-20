import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { collapsePathSlashes } from "./collapse-slashes.ts";
import { completeHost } from "./complete-host.ts";
import { isLocalhostHost } from "./is-localhost.ts";
import { stripWrappingQuotes } from "./strip-quotes.ts";
import { ensureScheme } from "./with-https.ts";

export type NormalizedUrl = {
  readonly href: string;
  readonly origin: string;
  readonly pathname: string;
  readonly warnings: string[];
};

function invalidUrl(raw: string): never {
  throw new MdFetchError({
    code: "invalid_url",
    message: `Invalid URL: ${raw}`,
    hint: `${helpHint()} Example: mdfetch --json https://better-auth.com/docs/installation`,
  });
}

export function parseInput(raw: string): NormalizedUrl {
  const stripped = stripWrappingQuotes(raw);
  if (stripped.length === 0) {
    invalidUrl(raw);
  }
  const completed = completeHost(stripped);
  const withScheme = ensureScheme(completed.value, looksLocal(completed.value));
  return withHostWarning(normalizeParsed(withScheme), completed.warning);
}

function withHostWarning(
  parsed: NormalizedUrl,
  warning: string | undefined,
): NormalizedUrl {
  if (warning === undefined) {
    return parsed;
  }
  return { ...parsed, warnings: [warning] };
}

function looksLocal(raw: string): boolean {
  const host = raw.replace(/^[a-z][a-z0-9+.-]*:\/\//iu, "").split("/")[0] ?? "";
  return isLocalhostHost(host.split(":")[0] ?? host);
}

function normalizeParsed(href: string): NormalizedUrl {
  let parsed: URL;
  try {
    parsed = new URL(href);
  } catch {
    invalidUrl(href);
  }
  parsed.pathname = collapsePathSlashes(parsed.pathname);
  return {
    href: parsed.href,
    origin: parsed.origin,
    pathname: parsed.pathname,
    warnings: [],
  };
}
