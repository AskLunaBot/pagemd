import { PagemdError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { protocolIds } from "./protocol-ids.ts";
import { probeById, protocolProbes } from "./registry.ts";

import type { ProtocolProbe } from "./types.ts";

export function selectProbes(ids: string[] | undefined): ProtocolProbe[] {
  if (ids === undefined || ids.length === 0) {
    return [...protocolProbes];
  }
  return ids.map(requireProbe);
}

function requireProbe(id: string): ProtocolProbe {
  const probe = probeById(id);
  if (probe === undefined) {
    throw new PagemdError({
      code: "invalid_flag_value",
      message: `Unknown protocol "${id}".`,
      hint: helpHint("discover"),
      details: { flag: "--protocol", value: id, allowed: [...protocolIds] },
    });
  }
  return probe;
}
