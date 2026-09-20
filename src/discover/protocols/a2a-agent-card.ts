import { foundHit, missHit } from "@/discover/hit.ts";
import { fetchJsonDocument } from "@/discover/json-document.ts";
import { jsonArray, jsonString } from "@/discover/json-field.ts";
import { withOptional } from "@/utils/optional.ts";

import type { JsonDocument } from "@/discover/json-document.ts";
import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject } from "@/types/json-value.ts";
import type { ProtocolHit } from "@/types/result-types.ts";

const currentPath = "/.well-known/agent-card.json";
const legacyPath = "/.well-known/agent.json";

export const a2aAgentCardProbe: ProtocolProbe = {
  id: "a2a-agent-card",
  paths: [currentPath, legacyPath],
  probe: probeA2a,
};

async function probeA2a(context: ProbeContext): Promise<ProtocolHit> {
  const current = await fetchJsonDocument(
    context.runtime,
    context.origin,
    currentPath,
  );
  const legacy = await fetchJsonDocument(
    context.runtime,
    context.origin,
    legacyPath,
  );
  const chosen = current ?? legacy;
  if (chosen === undefined) {
    return missHit("a2a-agent-card");
  }
  return foundHit({
    id: "a2a-agent-card",
    urls: foundUrls(current, legacy),
    status: chosen.status,
    summary: summarize(chosen.body),
    warnings: mismatchWarnings(current, legacy),
    ...withOptional("contentType", chosen.contentType),
  });
}

function foundUrls(
  current: JsonDocument | undefined,
  legacy: JsonDocument | undefined,
): string[] {
  const urls: string[] = [];
  if (current !== undefined) {
    urls.push(current.url);
  }
  if (legacy !== undefined) {
    urls.push(legacy.url);
  }
  return urls;
}

function mismatchWarnings(
  current: JsonDocument | undefined,
  legacy: JsonDocument | undefined,
): string[] {
  if (current === undefined || legacy === undefined) {
    return [];
  }
  if (stableJson(current.body) === stableJson(legacy.body)) {
    return [];
  }
  return [
    "A2A agent-card.json and agent.json both exist and differ. Prefer agent-card.json.",
  ];
}

function summarize(body: JsonObject): {
  readonly name: string;
  readonly description: string;
  readonly skillCount: number;
} {
  return {
    name: jsonString(body, "name") ?? "",
    description: jsonString(body, "description") ?? "",
    skillCount: jsonArray(body, "skills").length,
  };
}

function stableJson(body: JsonObject): string {
  return JSON.stringify(body);
}
