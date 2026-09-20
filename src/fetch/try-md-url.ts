import { requestPage } from "@/http/request.ts";
import { markdownUrlVariants } from "@/url/variants.ts";

import { markdownFromPage } from "./page-markdown.ts";
import { fetchResult } from "./result.ts";
import { contentTypeFields } from "./with-content-type.ts";

import type { FetchMarkdownResult } from "@/types/result-types.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

export async function tryMarkdownUrl(
  runtime: PagemdRuntime,
  url: string,
): Promise<FetchMarkdownResult | undefined> {
  return await tryVariants({
    runtime,
    url,
    variants: markdownUrlVariants(url),
    index: 0,
  });
}

type VariantWalk = {
  readonly runtime: PagemdRuntime;
  readonly url: string;
  readonly variants: string[];
  readonly index: number;
};

async function tryVariants(
  walk: VariantWalk,
): Promise<FetchMarkdownResult | undefined> {
  const candidate = walk.variants[walk.index];
  if (candidate === undefined) {
    return undefined;
  }
  const page = await requestPage(walk.runtime, candidate, {
    allowErrorStatus: true,
  });
  const markdown = markdownFromPage(page, walk.runtime.isHtml);
  if (markdown !== undefined) {
    return fetchResult({
      url: walk.url,
      finalUrl: page.finalUrl,
      markdown,
      source: "md-url",
      ...contentTypeFields(page),
    });
  }
  return await tryVariants({
    runtime: walk.runtime,
    url: walk.url,
    variants: walk.variants,
    index: walk.index + 1,
  });
}
