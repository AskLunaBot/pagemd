import { withOptional } from "@/utils/optional.ts";

import type { FetchMarkdownResult, FetchSource } from "@/types/result-types.ts";

export function fetchResult(input: {
  readonly url: string;
  readonly finalUrl: string;
  readonly markdown: string;
  readonly source: FetchSource;
  readonly contentType?: string;
  readonly warnings?: string[];
}): FetchMarkdownResult {
  return {
    url: input.url,
    finalUrl: input.finalUrl,
    markdown: ensureTrailingNewline(input.markdown),
    source: input.source,
    ...withOptional("contentType", input.contentType),
    fromCache: false,
    warnings: input.warnings ?? [],
  };
}

function ensureTrailingNewline(markdown: string): string {
  if (markdown.endsWith("\n")) {
    return markdown;
  }
  return `${markdown}\n`;
}
