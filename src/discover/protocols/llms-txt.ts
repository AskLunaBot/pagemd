import { fetchOriginPath } from "@/discover/fetch-origin-path.ts";
import { foundHit, missHit } from "@/discover/hit.ts";
import { isUsableDocument } from "@/discover/is-usable-page.ts";
import { parseLlmsTxt } from "@/discover/parse-llms-txt.ts";

import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { ProtocolHit } from "@/types/result-types.ts";

export const llmsTxtProbe: ProtocolProbe = {
  id: "llms-txt",
  paths: ["/llms.txt"],
  probe: probeLlmsTxt,
};

async function probeLlmsTxt(context: ProbeContext): Promise<ProtocolHit> {
  const trimmedPath = context.inputPath.replace(/\/$/u, "");
  const candidates = unique([`${trimmedPath}/llms.txt`, "/llms.txt"]);
  return await tryCandidates({ context, candidates, index: 0 });
}

type CandidateWalk = {
  readonly context: ProbeContext;
  readonly candidates: string[];
  readonly index: number;
};

async function tryCandidates(walk: CandidateWalk): Promise<ProtocolHit> {
  const path = walk.candidates[walk.index];
  if (path === undefined) {
    return missHit("llms-txt");
  }
  const page = await fetchOriginPath(
    walk.context.runtime,
    walk.context.origin,
    path,
  );
  if (isUsableDocument(page, walk.context.runtime.isHtml)) {
    const parsed = parseLlmsTxt(page.body, walk.context.limit);
    return foundHit({
      id: "llms-txt",
      urls: [page.finalUrl],
      status: page.status,
      contentType: "text/markdown",
      summary: {
        title: parsed.title ?? "",
        sectionCount: parsed.sections.length,
      },
    });
  }
  return await tryCandidates({
    context: walk.context,
    candidates: walk.candidates,
    index: walk.index + 1,
  });
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}
