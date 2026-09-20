import { jsonArray, jsonObject, jsonString } from "@/discover/json-field.ts";
import { probeJsonPaths } from "@/discover/json-probe.ts";

import type { ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject } from "@/types/json-value.ts";

const paths = [
  "/.well-known/mcp/server-card.json",
  "/.well-known/mcp-server.json",
];

export const mcpServerCardProbe: ProtocolProbe = {
  id: "mcp-server-card",
  paths,
  probe: async (context) =>
    await probeJsonPaths({ context, id: "mcp-server-card", paths, summarize }),
};

function summarize(body: JsonObject): {
  readonly name: string;
  readonly toolCount: number;
} {
  const info = jsonObject(body["serverInfo"]);
  const tools = jsonArray(body, "tools");
  return {
    name: jsonString(info ?? {}, "name") ?? jsonString(body, "name") ?? "",
    toolCount: tools.length,
  };
}
