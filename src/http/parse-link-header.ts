import { parseOneLink } from "./parse-one-link.ts";

import type { ParsedLink } from "./link-item.ts";

export function parseLinkHeader(header: string, baseUrl: string): ParsedLink[] {
  const links: ParsedLink[] = [];
  for (const part of header.split(",")) {
    const parsed = parseOneLink(part.trim(), baseUrl);
    if (parsed !== undefined) {
      links.push(parsed);
    }
  }
  return links;
}
