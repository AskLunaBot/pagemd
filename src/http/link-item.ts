import type { RfcLinkRelation } from "./rfc-link-rels.ts";

export type ParsedLink = {
  readonly href: string;
  readonly relation: RfcLinkRelation;
  readonly type?: string;
};
