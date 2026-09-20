import type { RequestOptions } from "./request-options.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

export function requestHeaders(
  runtime: PagemdRuntime,
  options: RequestOptions,
): Headers {
  const headers = new Headers(runtime.extraHeaders);
  if (!headers.has("user-agent")) {
    headers.set("user-agent", runtime.userAgent);
  }
  headers.set("accept", options.accept ?? "*/*");
  return headers;
}
