import { withOptional } from "@/utils/optional.ts";

import { isRfcLinkRelation } from "./is-rfc-link-relation.ts";
import { linkParameterMap } from "./link-parameters.ts";

import type { ParsedLink } from "./link-item.ts";

export function parseOneLink(
  part: string,
  baseUrl: string,
): ParsedLink | undefined {
  const match = /^<([^>]+)>\s*(.*)$/u.exec(part) ?? undefined;
  if (match === undefined) {
    return undefined;
  }
  const hrefRaw = match[1];
  if (hrefRaw === undefined) {
    return undefined;
  }
  const parameters = linkParameterMap(match[2] ?? "");
  const relation = parameters.get("rel");
  if (relation === undefined || !isRfcLinkRelation(relation)) {
    return undefined;
  }
  const mediaType = parameters.get("type");
  return {
    href: new URL(hrefRaw, baseUrl).href,
    relation,
    ...withOptional("type", mediaType),
  };
}
