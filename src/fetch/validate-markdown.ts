import { contentTypeOf } from "@/http/content-type.ts";

import type { FetchedPage } from "@/http/fetched-page.ts";
import type { IsHtml } from "@/types/options.ts";

export function isRealMarkdown(page: FetchedPage, isHtml: IsHtml): boolean {
  if (!page.ok || page.body.trim().length === 0) {
    return false;
  }
  if (isHtml(page.body)) {
    return false;
  }
  const type = contentTypeOf(page.headers);
  if (type?.includes("markdown") === true) {
    return true;
  }
  return looksLikeMarkdown(page.body);
}

function looksLikeMarkdown(body: string): boolean {
  const trimmed = body.trimStart();
  if (trimmed.startsWith("#") || trimmed.startsWith("---")) {
    return true;
  }
  return trimmed.startsWith("```");
}
