import { requestPage } from "@/http/request.ts";

import { isUsableDocument } from "./is-usable-page.ts";

import type { ProtocolDocument } from "@/types/result-types.ts";
import type { PagemdRuntime } from "@/types/runtime.ts";

export async function expandSkillMarkdown(
  runtime: PagemdRuntime,
  urls: string[],
): Promise<ProtocolDocument[]> {
  const pages = await Promise.all(
    urls.map(async (url) => await loadSkillPage(runtime, url)),
  );
  const documents: ProtocolDocument[] = [];
  for (const page of pages) {
    if (page !== undefined) {
      documents.push(page);
    }
  }
  return documents;
}

async function loadSkillPage(
  runtime: PagemdRuntime,
  url: string,
): Promise<ProtocolDocument | undefined> {
  const page = await requestPage(runtime, url, { allowErrorStatus: true });
  if (!isUsableDocument(page, runtime.isHtml)) {
    return undefined;
  }
  return { url: page.finalUrl, markdown: page.body };
}
