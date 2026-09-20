import { withOptional } from "@/utils/optional.ts";

import { foundHit, missHit } from "./hit.ts";
import { fetchJsonDocument } from "./json-document.ts";

import type { ProbeContext } from "./types.ts";
import type { JsonObject } from "@/types/json-value.ts";
import type { JsonSummary, ProtocolHit } from "@/types/result-types.ts";

export type JsonProbeRequest = {
  readonly context: ProbeContext;
  readonly id: string;
  readonly paths: string[];
  readonly summarize: (body: JsonObject) => JsonSummary;
};

export async function probeJsonPaths(
  request: JsonProbeRequest,
): Promise<ProtocolHit> {
  return await walk(request, 0);
}

async function walk(
  request: JsonProbeRequest,
  index: number,
): Promise<ProtocolHit> {
  const path = request.paths[index];
  if (path === undefined) {
    return missHit(request.id);
  }
  const document = await fetchJsonDocument(
    request.context.runtime,
    request.context.origin,
    path,
  );
  if (document !== undefined) {
    return foundHit({
      id: request.id,
      urls: [document.url],
      status: document.status,
      summary: request.summarize(document.body),
      ...withOptional("contentType", document.contentType),
    });
  }
  return await walk(request, index + 1);
}
