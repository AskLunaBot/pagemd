import {
  fetchOriginPath,
  pageContentType,
} from "@/discover/fetch-origin-path.ts";
import { foundHit, missHit } from "@/discover/hit.ts";
import { isUsableDocument } from "@/discover/is-usable-page.ts";
import { withOptional } from "@/utils/optional.ts";

import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { ProtocolHit } from "@/types/result-types.ts";

export const markdownHomeProbe: ProtocolProbe = {
  id: "markdown-home",
  paths: ["/index.md"],
  probe: probeMarkdownHome,
};

async function probeMarkdownHome(context: ProbeContext): Promise<ProtocolHit> {
  const page = await fetchOriginPath(
    context.runtime,
    context.origin,
    "/index.md",
  );
  if (!isUsableDocument(page, context.runtime.isHtml)) {
    return missHit("markdown-home");
  }
  const contentType = pageContentType(page);
  return foundHit({
    id: "markdown-home",
    urls: [page.finalUrl],
    status: page.status,
    ...withOptional("contentType", contentType),
  });
}
