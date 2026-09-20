import { runConvert } from "@/convert/run.ts";
import { htmlToMarkdownDefault } from "@/convert/turndown.ts";
import { runDiscover } from "@/discover/run.ts";
import { runFetch } from "@/fetch/run.ts";
import { isHtml as isHtmlDefault } from "@/http/is-html.ts";
import { createMemoryCache } from "@/utils/cache.ts";
import {
  defaultMaxBytes,
  defaultRetry,
  defaultRetryDelayMs,
  defaultTimeoutMs,
} from "@/utils/defaults.ts";
import { withOptional } from "@/utils/optional.ts";
import { defaultUserAgent } from "@/utils/package-version.ts";

import type {
  CacheStore,
  ConvertOptions,
  CreateMdFetchOptions,
  DiscoverOptions,
  FetchMarkdownOptions,
} from "@/types/options.ts";
import type {
  ConvertResult,
  DiscoverResult,
  FetchMarkdownResult,
} from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export type MdFetchClient = {
  readonly fetch: (
    input: string | URL,
    options?: FetchMarkdownOptions,
  ) => Promise<FetchMarkdownResult>;
  readonly discover: (
    input: string | URL,
    options?: DiscoverOptions,
  ) => Promise<DiscoverResult>;
  readonly convert: (
    html: string,
    options?: ConvertOptions,
  ) => Promise<ConvertResult>;
};

export function createMdFetch(
  options: CreateMdFetchOptions = {},
): MdFetchClient {
  return bindClient(runtimeFrom(options));
}

export const mdfetch: MdFetchClient = createMdFetch();

function runtimeFrom(options: CreateMdFetchOptions): MdFetchRuntime {
  const cache = resolveCache(options.cache);
  return { ...runtimeCore(options), ...withOptional("cache", cache) };
}

function runtimeCore(
  options: CreateMdFetchOptions,
): Omit<MdFetchRuntime, "cache"> {
  return {
    fetch: pick(options.fetch, globalThis.fetch),
    htmlToMarkdown: pick(options.htmlToMarkdown, htmlToMarkdownDefault),
    isHtml: pick(options.isHtml, isHtmlDefault),
    extraHeaders: options.headers ?? {},
    userAgent: pick(options.userAgent, defaultUserAgent),
    timeoutMs: pick(options.timeoutMs, defaultTimeoutMs),
    retry: pick(options.retry, defaultRetry),
    retryDelayMs: pick(options.retryDelayMs, defaultRetryDelayMs),
    followRedirects: pick(options.followRedirects, true),
    maxBytes: pick(options.maxBytes, defaultMaxBytes),
  };
}

function pick<Value>(value: Value | undefined, fallback: Value): Value {
  if (value === undefined) {
    return fallback;
  }
  return value;
}

function resolveCache(
  cache: CreateMdFetchOptions["cache"],
): CacheStore | undefined {
  if (cache === "false") {
    return undefined;
  }
  if (cache === undefined) {
    return createMemoryCache();
  }
  return cache;
}

function bindClient(runtime: MdFetchRuntime): MdFetchClient {
  return {
    fetch: async (input, fetchOptions) =>
      await runFetch(runtime, String(input), fetchOptions),
    discover: async (input, discoverOptions) =>
      await runDiscover(runtime, String(input), discoverOptions),
    convert: async (html, convertOptions) =>
      await runConvert(runtime, html, convertOptions),
  };
}
