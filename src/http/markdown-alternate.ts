import { collectPageLinks } from "./collect-page-links.ts";

import type { FetchedPage } from "./fetched-page.ts";

export function markdownAlternateUrls(page: FetchedPage): string[] {
  const urls: string[] = [];
  for (const link of collectPageLinks(page)) {
    if (link.relation === "alternate" && isMarkdownType(link.type)) {
      urls.push(link.href);
    }
  }
  return urls;
}

function isMarkdownType(type: string | undefined): boolean {
  if (type === undefined) {
    return false;
  }
  return type.includes("markdown");
}
