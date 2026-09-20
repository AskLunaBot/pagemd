import { thrownError } from "@/utils/thrown.ts";

import { mapHttpStatus } from "./map-http-error.ts";
import { performFetch } from "./perform-fetch.ts";
import { readLimitedBody } from "./read-limited-body.ts";
import { retryDelayMs } from "./retry-delay.ts";
import { shouldRetry } from "./should-retry.ts";
import { sleep } from "./sleep.ts";

import type { FetchedPage } from "./fetched-page.ts";
import type { RequestOptions } from "./request-options.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export type { RequestOptions } from "./request-options.ts";

type RetryWalk = {
  readonly runtime: MdFetchRuntime;
  readonly url: string;
  readonly options: RequestOptions;
  readonly remaining: number;
};

export async function requestPage(
  runtime: MdFetchRuntime,
  url: string,
  options: RequestOptions = {},
): Promise<FetchedPage> {
  return await requestWithRetry({
    runtime,
    url,
    options,
    remaining: runtime.retry,
  });
}

async function requestWithRetry(walk: RetryWalk): Promise<FetchedPage> {
  try {
    return await requestOnce(walk);
  } catch (error) {
    return await retryOrThrow(walk, thrownError(error));
  }
}

async function retryOrThrow(
  walk: RetryWalk,
  error: Error,
): Promise<FetchedPage> {
  if (walk.remaining <= 0 || !shouldRetry(error)) {
    throw error;
  }
  await sleep(retryDelayMs(error, walk.runtime.retryDelayMs));
  return await requestWithRetry({
    runtime: walk.runtime,
    url: walk.url,
    options: walk.options,
    remaining: walk.remaining - 1,
  });
}

async function requestOnce(walk: RetryWalk): Promise<FetchedPage> {
  const response = await performFetch(walk.runtime, walk.url, walk.options);
  const body = await readBody(walk, response);
  return toPage({ url: walk.url, response, body, options: walk.options });
}

async function readBody(walk: RetryWalk, response: Response): Promise<string> {
  if (walk.options.method === "HEAD") {
    return "";
  }
  return await readLimitedBody(response, walk.runtime.maxBytes, walk.url);
}

function responseUrl(response: Response, fallback: string): string {
  if (response.url.length === 0) {
    return fallback;
  }
  return response.url;
}

type PageParts = {
  readonly url: string;
  readonly response: Response;
  readonly body: string;
  readonly options: RequestOptions;
};

function toPage(parts: PageParts): FetchedPage {
  if (!parts.response.ok && parts.options.allowErrorStatus !== true) {
    mapHttpStatus(parts.response.status, parts.url, parts.response.headers);
  }
  return {
    url: parts.url,
    finalUrl: responseUrl(parts.response, parts.url),
    status: parts.response.status,
    headers: parts.response.headers,
    body: parts.body,
    ok: parts.response.ok,
  };
}
