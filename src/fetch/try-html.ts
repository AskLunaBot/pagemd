import { requestPage } from "@/http/request.ts";
import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { isEmptyShell } from "./empty-html.ts";
import { fetchResult } from "./result.ts";

import type { FetchMarkdownResult } from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function tryHtmlConvert(
  runtime: MdFetchRuntime,
  url: string,
): Promise<FetchMarkdownResult> {
  const page = await requestPage(runtime, url, { accept: "text/html" });
  if (isEmptyShell(page.body, runtime.isHtml)) {
    throw new MdFetchError({
      code: "empty_content",
      message: `No readable HTML at ${url}`,
      hint: `${helpHint("discover")} This may be a SPA. Use a browser for rendered HTML.`,
      url,
      status: page.status,
    });
  }
  const markdown = await runtime.htmlToMarkdown(page.body, {
    url: page.finalUrl,
  });
  if (markdown.trim().length === 0) {
    throw new MdFetchError({
      code: "conversion_failed",
      message: `HTML to Markdown produced empty output for ${url}`,
      hint: "Inject htmlToMarkdown or fetch a content page.",
      url,
    });
  }
  return fetchResult({
    url,
    finalUrl: page.finalUrl,
    markdown,
    source: "html-convert",
    contentType: "text/html",
  });
}
