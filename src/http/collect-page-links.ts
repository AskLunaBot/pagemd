import { parseHtmlLinks } from "./parse-html-links.ts";
import { parseLinkHeader } from "./parse-link-header.ts";
import { readHeader } from "./read-header.ts";

import type { FetchedPage } from "./fetched-page.ts";
import type { ParsedLink } from "./link-item.ts";

export function collectPageLinks(page: FetchedPage): ParsedLink[] {
  const header = readHeader(page.headers, "link");
  const fromHeader = linksFromHeader(header, page.finalUrl);
  return [...fromHeader, ...parseHtmlLinks(page.body, page.finalUrl)];
}

function linksFromHeader(
  header: string | undefined,
  finalUrl: string,
): ParsedLink[] {
  if (header === undefined) {
    return [];
  }
  return parseLinkHeader(header, finalUrl);
}
