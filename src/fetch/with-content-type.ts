import { contentTypeOf } from "@/http/content-type.ts";

import type { FetchedPage } from "@/http/fetched-page.ts";

export function contentTypeFields(
  page: FetchedPage,
): { contentType: string } | object {
  const contentType = contentTypeOf(page.headers);
  if (contentType === undefined) {
    return {};
  }
  return { contentType };
}
