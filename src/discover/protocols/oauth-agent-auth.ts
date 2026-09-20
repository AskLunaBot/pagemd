import { jsonArray, jsonString } from "@/discover/json-field.ts";
import { probeJsonPaths } from "@/discover/json-probe.ts";

import type { ProtocolProbe } from "@/discover/types.ts";
import type { JsonObject } from "@/types/json-value.ts";

const paths = [
  "/.well-known/oauth-protected-resource",
  "/.well-known/oauth-authorization-server",
];

export const oauthAgentAuthProbe: ProtocolProbe = {
  id: "oauth-agent-auth",
  paths,
  probe: async (context) =>
    await probeJsonPaths({ context, id: "oauth-agent-auth", paths, summarize }),
};

function summarize(body: JsonObject): {
  readonly resource: string;
  readonly authorizationServers: number;
} {
  return {
    resource: jsonString(body, "resource") ?? jsonString(body, "issuer") ?? "",
    authorizationServers: jsonArray(body, "authorization_servers").length,
  };
}
