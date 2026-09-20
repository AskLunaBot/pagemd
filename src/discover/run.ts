import { parseInput } from "@/url/parse-input.ts";
import { defaultDiscoverLimit } from "@/utils/defaults.ts";
import { isSwitchOn } from "@/utils/is-switch-on.ts";

import { loadHomepage } from "./homepage.ts";
import { selectProbes } from "./select-probes.ts";

import type { ProbeContext } from "./types.ts";
import type { DiscoverOptions } from "@/types/options.ts";
import type { DiscoverResult, ProtocolHit } from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function runDiscover(
  runtime: MdFetchRuntime,
  input: string,
  options: DiscoverOptions = {},
): Promise<DiscoverResult> {
  const normalized = parseInput(input);
  const homepage = await loadHomepage(
    runtime,
    normalized.origin,
    normalized.pathname,
  );
  const context: ProbeContext = {
    runtime,
    origin: normalized.origin,
    inputPath: normalized.pathname,
    homepage,
    expandSkills: isSwitchOn(options.expandSkills, "off"),
    limit: options.limit ?? defaultDiscoverLimit,
  };
  const hits = await Promise.all(
    selectProbes(options.protocolIds).map(
      async (probe) => await probe.probe(context),
    ),
  );
  return assemble(normalized, hits);
}

function assemble(
  normalized: {
    readonly href: string;
    readonly origin: string;
    readonly warnings: string[];
  },
  protocols: ProtocolHit[],
): DiscoverResult {
  const warnings = [
    ...normalized.warnings,
    ...protocols.flatMap((hit) => hit.warnings),
  ];
  return {
    url: normalized.href,
    origin: normalized.origin,
    protocols,
    warnings,
  };
}
