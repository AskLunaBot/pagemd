export const rfcLinkRelations = [
  "alternate",
  "describedby",
  "sitemap",
  "service-desc",
  "service-doc",
  "api-catalog",
] as const;

export type RfcLinkRelation = (typeof rfcLinkRelations)[number];

export const rfcLinkRelationSet: ReadonlySet<string> = new Set(
  rfcLinkRelations,
);
