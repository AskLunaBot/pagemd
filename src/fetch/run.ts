import { MdFetchError } from "@/types/errors.ts";
import { parseInput } from "@/url/parse-input.ts";
import { defaultMaxCharacters } from "@/utils/defaults.ts";
import { isSwitchOn } from "@/utils/is-switch-on.ts";

import { paginateMarkdown } from "./paginate.ts";
import { tryAcceptMarkdown } from "./try-accept-markdown.ts";
import { tryHtmlConvert } from "./try-html.ts";
import { tryLinkAlternate } from "./try-link-alternate.ts";
import { tryMarkdownUrl } from "./try-md-url.ts";

import type { FetchMarkdownOptions } from "@/types/options.ts";
import type { FetchMarkdownResult } from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function runFetch(
  runtime: MdFetchRuntime,
  input: string,
  options: FetchMarkdownOptions = {},
): Promise<FetchMarkdownResult> {
  const normalized = parseInput(input);
  const cacheKey = `fetch:${normalized.href}`;
  const cached = await runtime.cache?.get(cacheKey);
  if (cached !== undefined) {
    return { ...cached, fromCache: true };
  }
  const result = paginateMarkdown({
    result: await resolveSource(runtime, normalized.href, options),
    maxCharacters: options.maxCharacters ?? defaultMaxCharacters,
    page: options.page ?? 1,
    pageSize: options.pageSize ?? 0,
  });
  const withWarnings = mergeWarnings(result, normalized.warnings);
  await runtime.cache?.set(cacheKey, withWarnings);
  return withWarnings;
}

function mergeWarnings(
  result: FetchMarkdownResult,
  extra: string[],
): FetchMarkdownResult {
  if (extra.length === 0) {
    return result;
  }
  return { ...result, warnings: [...extra, ...result.warnings] };
}

async function resolveSource(
  runtime: MdFetchRuntime,
  url: string,
  options: FetchMarkdownOptions,
): Promise<FetchMarkdownResult> {
  if (isSwitchOn(options.acceptMarkdown, "on")) {
    const accepted = await tryAcceptMarkdown(runtime, url);
    if (accepted !== undefined) {
      return accepted;
    }
  }
  return await fallbackSources(runtime, url, options);
}

async function fallbackSources(
  runtime: MdFetchRuntime,
  url: string,
  options: FetchMarkdownOptions,
): Promise<FetchMarkdownResult> {
  if (isSwitchOn(options.markdownUrl, "on")) {
    const twin = await tryMarkdownUrl(runtime, url);
    if (twin !== undefined) {
      return twin;
    }
  }
  if (isSwitchOn(options.linkAlternate, "on")) {
    const alternate = await tryLinkAlternate(runtime, url);
    if (alternate !== undefined) {
      return alternate;
    }
  }
  if (isSwitchOn(options.htmlConvert, "on")) {
    return await tryHtmlConvert(runtime, url);
  }
  throw new MdFetchError({
    code: "unsupported_content_type",
    message: `No markdown source for ${url}`,
    hint: "Enable --html-convert=on or provide a markdown URL.",
    url,
  });
}
