import { markdownAlternateUrls } from "@/http/markdown-alternate.ts";
import { requestPage } from "@/http/request.ts";

import { markdownFromPage } from "./page-markdown.ts";
import { fetchResult } from "./result.ts";
import { contentTypeFields } from "./with-content-type.ts";

import type { FetchMarkdownResult } from "@/types/result-types.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

export async function tryLinkAlternate(
  runtime: PagemdRuntime,
  url: string,
): Promise<FetchMarkdownResult | undefined> {
  const page = await requestPage(runtime, url);
  return await tryLinks({
    runtime,
    url,
    links: markdownAlternateUrls(page),
    index: 0,
  });
}

type LinkWalk = {
  readonly runtime: PagemdRuntime;
  readonly url: string;
  readonly links: string[];
  readonly index: number;
};

async function tryLinks(
  walk: LinkWalk,
): Promise<FetchMarkdownResult | undefined> {
  const href = walk.links[walk.index];
  if (href === undefined) {
    return undefined;
  }
  const page = await requestPage(walk.runtime, href, {
    allowErrorStatus: true,
  });
  const markdown = markdownFromPage(page, walk.runtime.isHtml);
  if (markdown !== undefined) {
    return fetchResult({
      url: walk.url,
      finalUrl: page.finalUrl,
      markdown,
      source: "link-alternate",
      ...contentTypeFields(page),
    });
  }
  return await tryLinks({
    runtime: walk.runtime,
    url: walk.url,
    links: walk.links,
    index: walk.index + 1,
  });
}
