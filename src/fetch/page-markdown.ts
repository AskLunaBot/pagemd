import { isRealMarkdown } from "./validate-markdown.ts";

import type { FetchedPage } from "@/http/fetched-page.ts";
import type { IsHtml } from "@/types/options.ts";

export function markdownFromPage(
  page: FetchedPage,
  isHtml: IsHtml,
): string | undefined {
  if (!isRealMarkdown(page, isHtml)) {
    return undefined;
  }
  return page.body.trim();
}
