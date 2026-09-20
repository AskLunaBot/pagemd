import { parsePositiveNumber, parseSwitch } from "@/cli/flag-value.ts";

import type { ParsedCli } from "@/cli/parsed.ts";

type FlagApplier = (draft: ParsedCli, value: string) => ParsedCli;

const fetchAppliers: Readonly<Record<string, FlagApplier>> = {
  "--accept-markdown": (draft, value) => ({
    ...draft,
    acceptMarkdown: parseSwitch("--accept-markdown", value),
  }),
  "--md-url": (draft, value) => ({
    ...draft,
    markdownUrl: parseSwitch("--md-url", value),
  }),
  "--link-alternate": (draft, value) => ({
    ...draft,
    linkAlternate: parseSwitch("--link-alternate", value),
  }),
  "--html-convert": (draft, value) => ({
    ...draft,
    htmlConvert: parseSwitch("--html-convert", value),
  }),
  "--max-chars": (draft, value) => ({
    ...draft,
    maxCharacters: parsePositiveNumber("--max-chars", value),
  }),
  "--page": (draft, value) => ({
    ...draft,
    page: parsePositiveNumber("--page", value),
  }),
  "--page-size": (draft, value) => ({
    ...draft,
    pageSize: parsePositiveNumber("--page-size", value),
  }),
};

export function withFetchFlags(
  draft: ParsedCli,
  name: string,
  value: string,
): ParsedCli | undefined {
  const apply = fetchAppliers[name];
  if (apply === undefined) {
    return undefined;
  }
  return apply(draft, value);
}
