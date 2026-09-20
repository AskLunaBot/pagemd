import { a2aAgentCardProbe } from "@/discover/protocols/a2a-agent-card.ts";
import { agentSkillsProbe } from "@/discover/protocols/agent-skills.ts";
import { apiCatalogProbe } from "@/discover/protocols/api-catalog.ts";
import { ardCatalogProbe } from "@/discover/protocols/ard-catalog.ts";
import { linkRelsProbe } from "@/discover/protocols/link-rels.ts";
import { llmsTxtProbe } from "@/discover/protocols/llms-txt.ts";
import { markdownHomeProbe } from "@/discover/protocols/markdown-home.ts";
import { mcpServerCardProbe } from "@/discover/protocols/mcp-server-card.ts";
import { oauthAgentAuthProbe } from "@/discover/protocols/oauth-agent-auth.ts";
import { robotsAgentmapProbe } from "@/discover/protocols/robots-agentmap.ts";

import type { ProtocolProbe } from "./types.ts";

export { protocolIds } from "./protocol-ids.ts";

export const protocolProbes: readonly ProtocolProbe[] = [
  llmsTxtProbe,
  markdownHomeProbe,
  linkRelsProbe,
  robotsAgentmapProbe,
  agentSkillsProbe,
  a2aAgentCardProbe,
  mcpServerCardProbe,
  ardCatalogProbe,
  apiCatalogProbe,
  oauthAgentAuthProbe,
];

export function probeById(id: string): ProtocolProbe | undefined {
  return protocolProbes.find((probe) => probe.id === id);
}
