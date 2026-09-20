import { isJsonContentType } from "@/http/is-json-type.ts";
import { parseJsonObject } from "@/utils/json-parse.ts";

import { fetchOriginPath, pageContentType } from "./fetch-origin-path.ts";

import type { JsonObject } from "@/types/json-value.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

export type JsonDocument = {
  readonly url: string;
  readonly status: number;
  readonly contentType: string | undefined;
  readonly body: JsonObject;
};

export async function fetchJsonDocument(
  runtime: PagemdRuntime,
  origin: string,
  path: string,
): Promise<JsonDocument | undefined> {
  const page = await fetchOriginPath(runtime, origin, path);
  const contentType = pageContentType(page);
  const body = parseJsonObject(page.body);
  if (!page.ok || !isJsonContentType(contentType) || body === undefined) {
    return undefined;
  }
  return { url: page.finalUrl, status: page.status, contentType, body };
}
