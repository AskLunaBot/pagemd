import { foundHit, missHit } from "@/discover/hit.ts";
import { collectPageLinks } from "@/http/collect-page-links.ts";
import { requestPage } from "@/http/request.ts";

import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { ProtocolHit } from "@/types/result-types.ts";

export const linkRelsProbe: ProtocolProbe = {
  id: "link-rels",
  paths: ["/"],
  probe: probeLinkRels,
};

function htmlBody(body: string, homepageHtml: string): string {
  if (body.length === 0) {
    return homepageHtml;
  }
  return body;
}

async function probeLinkRels(context: ProbeContext): Promise<ProtocolHit> {
  const page = await requestPage(context.runtime, `${context.origin}/`, {
    allowErrorStatus: true,
  });
  const links = collectPageLinks({
    ...page,
    body: htmlBody(page.body, context.homepage.html),
  });
  if (links.length === 0) {
    return missHit("link-rels");
  }
  return foundHit({
    id: "link-rels",
    urls: links.map((link) => link.href),
    status: page.status,
    summary: { relations: links.map((link) => link.relation) },
  });
}
