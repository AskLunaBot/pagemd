import { fetchOriginPath } from "@/discover/fetch-origin-path.ts";
import { foundHit, missHit } from "@/discover/hit.ts";

import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { ProtocolHit } from "@/types/result-types.ts";

export const robotsAgentmapProbe: ProtocolProbe = {
  id: "robots-agentmap",
  paths: ["/robots.txt"],
  probe: probeRobotsAgentmap,
};

async function probeRobotsAgentmap(
  context: ProbeContext,
): Promise<ProtocolHit> {
  const page = await fetchOriginPath(
    context.runtime,
    context.origin,
    "/robots.txt",
  );
  if (!page.ok) {
    return missHit("robots-agentmap");
  }
  const maps = agentmapUrls(page.body);
  if (maps.length === 0) {
    return missHit("robots-agentmap");
  }
  return foundHit({
    id: "robots-agentmap",
    urls: maps,
    status: page.status,
    summary: { agentmapCount: maps.length },
  });
}

function agentmapUrls(body: string): string[] {
  const urls: string[] = [];
  for (const line of body.split(/\r?\n/u)) {
    const match = /^Agentmap:\s*(\S+)/iu.exec(line.trim());
    const href = match?.[1];
    if (href !== undefined) {
      urls.push(href);
    }
  }
  return urls;
}
