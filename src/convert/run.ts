import { withOptional } from "@/utils/optional.ts";

import { htmlToMarkdownDefault } from "./turndown.ts";

import type { ConvertOptions } from "@/types/options.ts";
import type { ConvertResult } from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function runConvert(
  runtime: MdFetchRuntime,
  html: string,
  options: ConvertOptions = {},
): Promise<ConvertResult> {
  const baseUrl = options.baseUrl ?? "https://example.invalid/";
  const markdown = await runtime.htmlToMarkdown(html, { url: baseUrl });
  if (markdown.trim().length === 0 && html.trim().length > 0) {
    return convertPayload(
      htmlToMarkdownDefault(html, { url: baseUrl }),
      baseUrl,
    );
  }
  return convertPayload(`${markdown.trim()}\n`, baseUrl);
}

function convertPayload(markdown: string, baseUrl: string): ConvertResult {
  return {
    markdown,
    warnings: [],
    ...withOptional("baseUrl", explicitBase(baseUrl)),
  };
}

function explicitBase(baseUrl: string): string | undefined {
  if (baseUrl === "https://example.invalid/") {
    return undefined;
  }
  return baseUrl;
}
