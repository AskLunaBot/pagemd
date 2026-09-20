import { withOptional } from "@/utils/optional.ts";

import { htmlAttribute } from "./attribute-value.ts";
import { htmlLinkTagPattern } from "./html-link-pattern.ts";
import { isRfcLinkRelation } from "./is-rfc-link-relation.ts";

import type { ParsedLink } from "./link-item.ts";

export function parseHtmlLinks(html: string, baseUrl: string): ParsedLink[] {
  const links: ParsedLink[] = [];
  for (const match of html.matchAll(htmlLinkTagPattern)) {
    const parsed = parsedFromMatch(match[1], baseUrl);
    if (parsed !== undefined) {
      links.push(parsed);
    }
  }
  return links;
}

function parsedFromMatch(
  tag: string | undefined,
  baseUrl: string,
): ParsedLink | undefined {
  if (tag === undefined) {
    return undefined;
  }
  return fromTag(tag, baseUrl);
}

function fromTag(tag: string, baseUrl: string): ParsedLink | undefined {
  const href = htmlAttribute(tag, "href");
  const relation = htmlAttribute(tag, "rel")?.toLowerCase();
  if (
    href === undefined ||
    relation === undefined ||
    !isRfcLinkRelation(relation)
  ) {
    return undefined;
  }
  const mediaType = htmlAttribute(tag, "type");
  return {
    href: new URL(href, baseUrl).href,
    relation,
    ...withOptional("type", mediaType),
  };
}
