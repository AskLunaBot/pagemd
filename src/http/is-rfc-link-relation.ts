import { rfcLinkRelationSet } from "./rfc-link-rels.ts";

import type { RfcLinkRelation } from "./rfc-link-rels.ts";

export function isRfcLinkRelation(value: string): value is RfcLinkRelation {
  return rfcLinkRelationSet.has(value);
}
