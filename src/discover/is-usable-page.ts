import type { FetchedPage } from "@/http/fetched-page.ts";
import type { IsHtml } from "@/types/options.ts";

export function isUsableDocument(page: FetchedPage, isHtml: IsHtml): boolean {
  if (!page.ok || page.body.trim().length === 0) {
    return false;
  }
  return !isHtml(page.body);
}
