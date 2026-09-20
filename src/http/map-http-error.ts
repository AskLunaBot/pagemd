import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { parseRetryAfterSeconds } from "./parse-retry-after.ts";
import { readHeader } from "./read-header.ts";

export function mapHttpStatus(
  status: number,
  url: string,
  headers: Headers,
): never {
  if (status === 404 || status === 410) {
    throw new MdFetchError({
      code: "not_found",
      message: `HTTP ${status} for ${url}`,
      hint: `${helpHint("discover")} The path is missing, not a soft 404.`,
      url,
      status,
    });
  }
  if (status === 403) {
    throw new MdFetchError({
      code: "blocked",
      message: `HTTP 403 for ${url}`,
      hint: "The site blocked this fetch. Inject a custom fetch, do not spoof GPTBot.",
      url,
      status,
    });
  }
  if (status === 429) {
    throw rateLimitedError(url, headers);
  }
  throw new MdFetchError({
    code: "http_error",
    message: `HTTP ${status} for ${url}`,
    hint: helpHint(),
    url,
    status,
  });
}

function rateLimitedError(url: string, headers: Headers): MdFetchError {
  const retryAfter = parseRetryAfterSeconds(readHeader(headers, "retry-after"));
  if (retryAfter === undefined) {
    return new MdFetchError({
      code: "rate_limited",
      message: `HTTP 429 for ${url}`,
      hint: "Wait and retry. The server sent 429 Too Many Requests.",
      url,
      status: 429,
    });
  }
  return new MdFetchError({
    code: "rate_limited",
    message: `HTTP 429 for ${url}`,
    hint: `Wait ${retryAfter} seconds (Retry-After) and retry.`,
    url,
    status: 429,
    details: { retryAfterSeconds: retryAfter },
  });
}
