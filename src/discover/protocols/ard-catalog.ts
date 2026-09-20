import { jsonArray, jsonString } from "@/discover/json-field.ts";
import { probeJsonPaths } from "@/discover/json-probe.ts";

import type { ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject } from "@/types/json-value.ts";

const paths = ["/.well-known/ard.json", "/.well-known/ai-catalog.json"];

export const ardCatalogProbe: ProtocolProbe = {
  id: "ard-catalog",
  paths,
  probe: async (context) =>
    await probeJsonPaths({ context, id: "ard-catalog", paths, summarize }),
};

function summarize(body: JsonObject): {
  readonly specVersion: string;
  readonly entryCount: number;
} {
  return {
    specVersion: jsonString(body, "specVersion") ?? "",
    entryCount: jsonArray(body, "entries").length,
  };
}
