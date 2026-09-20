import { contentTypeOf } from "@/http/content-type.ts";
import { requestPage } from "@/http/request.ts";
import { withOptional } from "@/utils/optional.ts";

import { markdownFromPage } from "./page-markdown.ts";
import { fetchResult } from "./result.ts";

import type { FetchMarkdownResult } from "@/types/result-types.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

const acceptHeader = "text/markdown;q=1.0, text/plain;q=0.8, text/html;q=0.5";

export async function tryAcceptMarkdown(
  runtime: PagemdRuntime,
  url: string,
): Promise<FetchMarkdownResult | undefined> {
  const page = await requestPage(runtime, url, { accept: acceptHeader });
  const markdown = markdownFromPage(page, runtime.isHtml);
  if (markdown === undefined) {
    return undefined;
  }
  const contentType = contentTypeOf(page.headers);
  const warnings: string[] = [];
  const vary = page.headers.get("vary") ?? undefined;
  if (vary === undefined || !vary.toLowerCase().includes("accept")) {
    warnings.push("Markdown negotiation succeeded without Vary: Accept.");
  }
  return fetchResult({
    url,
    finalUrl: page.finalUrl,
    markdown,
    source: "accept-markdown",
    ...withOptional("contentType", contentType),
    warnings,
  });
}
