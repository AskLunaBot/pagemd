import { contentTypeOf } from "@/http/content-type.ts";
import { requestPage } from "@/http/request.ts";
import { joinOriginPath } from "@/url/join-origin.ts";

import type { FetchedPage } from "@/http/fetched-page.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function fetchOriginPath(
  runtime: MdFetchRuntime,
  origin: string,
  path: string,
): Promise<FetchedPage> {
  return await requestPage(runtime, joinOriginPath(origin, path), {
    allowErrorStatus: true,
  });
}

export function pageContentType(page: FetchedPage): string | undefined {
  return contentTypeOf(page.headers);
}
