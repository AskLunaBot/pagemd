import type { ProtocolHit } from "@/types/result-types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export type HomepageSnapshot = {
  readonly origin: string;
  readonly inputPath: string;
  readonly html: string;
  readonly headers: Headers;
  readonly finalUrl: string;
};

export type ProbeContext = {
  readonly runtime: MdFetchRuntime;
  readonly origin: string;
  readonly inputPath: string;
  readonly homepage: HomepageSnapshot;
  readonly expandSkills: boolean;
  readonly limit: number;
};

export type ProtocolProbe = {
  readonly id: string;
  readonly paths: string[];
  readonly probe: (context: ProbeContext) => Promise<ProtocolHit>;
};
