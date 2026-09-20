import { probeJsonPaths } from "@/discover/json-probe.ts";

import type { ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject } from "@/types/json-value.ts";

const paths = ["/.well-known/api-catalog"];

export const apiCatalogProbe: ProtocolProbe = {
  id: "api-catalog",
  paths,
  probe: async (context) =>
    await probeJsonPaths({ context, id: "api-catalog", paths, summarize }),
};

function summarize(body: JsonObject): {
  readonly keyCount: number;
  readonly keys: string[];
} {
  const keys = Object.keys(body);
  return { keyCount: keys.length, keys };
}
