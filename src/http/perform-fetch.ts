import { thrownError } from "@/utils/thrown.ts";

import { mapNetworkError } from "./map-network-error.ts";
import { requestHeaders } from "./request-headers.ts";

import type { RequestOptions } from "./request-options.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

function requestMethod(method: RequestOptions["method"]): "GET" | "HEAD" {
  if (method === undefined) {
    return "GET";
  }
  return method;
}

function redirectMode(follow: boolean): RequestRedirect {
  if (follow) {
    return "follow";
  }
  return "manual";
}

export async function performFetch(
  runtime: PagemdRuntime,
  url: string,
  options: RequestOptions,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, runtime.timeoutMs);
  try {
    return await runtime.fetch(url, {
      method: requestMethod(options.method),
      redirect: redirectMode(runtime.followRedirects),
      signal: controller.signal,
      headers: requestHeaders(runtime, options),
    });
  } catch (error) {
    throw mapNetworkError(thrownError(error), url);
  } finally {
    clearTimeout(timer);
  }
}
