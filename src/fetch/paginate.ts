import type { FetchMarkdownResult } from "@/types/result-types.ts";

export type PaginateRequest = {
  readonly result: FetchMarkdownResult;
  readonly maxCharacters: number;
  readonly page: number;
  readonly pageSize: number;
};

export function paginateMarkdown(
  request: PaginateRequest,
): FetchMarkdownResult {
  const limited = truncate(request.result, request.maxCharacters);
  if (request.pageSize <= 0) {
    return limited;
  }
  const blocks = splitHeadingBlocks(limited.markdown);
  const start = (request.page - 1) * request.pageSize;
  const slice = blocks.slice(start, start + request.pageSize);
  return {
    ...limited,
    markdown: slice.join("\n\n"),
    hasMore: start + request.pageSize < blocks.length,
  };
}

function truncate(
  result: FetchMarkdownResult,
  maxCharacters: number,
): FetchMarkdownResult {
  if (result.markdown.length <= maxCharacters) {
    return result;
  }
  return {
    ...result,
    markdown: `${result.markdown.slice(0, maxCharacters)}\n`,
    hasMore: true,
    warnings: [...result.warnings, `Truncated to ${maxCharacters} characters.`],
  };
}

function splitHeadingBlocks(markdown: string): string[] {
  const parts = markdown.split(/\n(?=##?\s)/u);
  if (parts.length === 0) {
    return [markdown];
  }
  return parts;
}
