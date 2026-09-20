import { absolutizeMarkdown } from "./absolutize.ts";
import { appendJsonLd } from "./append-json-ld.ts";
import { extractJsonLdBlocks } from "./extract-json-ld.ts";
import { extractMainHtml } from "./extract-main.ts";
import { createTurndownService } from "./turndown-factory.ts";

export function htmlToMarkdownDefault(
  html: string,
  context: { readonly url: string },
): string {
  const jsonLd = extractJsonLdBlocks(html);
  const main = extractMainHtml(html);
  const markdown = createTurndownService().turndown(main).trim();
  return appendJsonLd(absolutizeMarkdown(markdown, context.url), jsonLd);
}
