import { expandSkillMarkdown } from "@/discover/expand-skill-markdown.ts";
import { foundHit, missHit } from "@/discover/hit.ts";
import { fetchJsonDocument } from "@/discover/json-document.ts";
import { jsonArray, jsonString } from "@/discover/json-field.ts";
import { skillMarkdownUrls, skillNamesFrom } from "@/discover/skill-fields.ts";
import { withOptional } from "@/utils/optional.ts";

import type { JsonDocument } from "@/discover/json-document.ts";
import type { ProbeContext, ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject, JsonValue } from "@/types/json-value.ts";
import type { ProtocolDocument, ProtocolHit } from "@/types/result-types.ts";

export const agentSkillsProbe: ProtocolProbe = {
  id: "agent-skills",
  paths: ["/.well-known/agent-skills/index.json"],
  probe: probeAgentSkills,
};

async function probeAgentSkills(context: ProbeContext): Promise<ProtocolHit> {
  const document = await fetchJsonDocument(
    context.runtime,
    context.origin,
    "/.well-known/agent-skills/index.json",
  );
  if (document === undefined) {
    return missHit("agent-skills");
  }
  return await withSkills(context, document);
}

async function withSkills(
  context: ProbeContext,
  document: JsonDocument,
): Promise<ProtocolHit> {
  const skills = jsonArray(document.body, "skills");
  const markdownUrls = skillMarkdownUrls(skills, context.origin, context.limit);
  const expanded = await skillDocuments(context, markdownUrls);
  const documents = nonemptyDocuments(expanded);
  return foundHit({
    id: "agent-skills",
    urls: [document.url],
    status: document.status,
    summary: skillSummary({
      body: document.body,
      skills,
      markdownUrlCount: markdownUrls.length,
      expandedCount: expanded.length,
    }),
    ...withOptional("documents", documents),
    ...withOptional("contentType", document.contentType),
  });
}

async function skillDocuments(
  context: ProbeContext,
  markdownUrls: string[],
): Promise<ProtocolDocument[]> {
  if (!context.expandSkills) {
    return [];
  }
  return await expandSkillMarkdown(context.runtime, markdownUrls);
}

function nonemptyDocuments(
  documents: ProtocolDocument[],
): ProtocolDocument[] | undefined {
  if (documents.length === 0) {
    return undefined;
  }
  return documents;
}

type SkillSummaryInput = {
  readonly body: JsonObject;
  readonly skills: JsonValue[];
  readonly markdownUrlCount: number;
  readonly expandedCount: number;
};

function skillSummary(input: SkillSummaryInput): {
  readonly schema: string;
  readonly skillCount: number;
  readonly names: string[];
  readonly markdownUrlCount: number;
  readonly expandedCount: number;
} {
  return {
    schema:
      jsonString(input.body, "$schema") ??
      "https://schemas.agentskills.io/discovery/0.1.0/schema.json",
    skillCount: input.skills.length,
    names: skillNamesFrom(input.skills, 50),
    markdownUrlCount: input.markdownUrlCount,
    expandedCount: input.expandedCount,
  };
}
