import { withOptional } from "@/utils/optional.ts";

import type {
  JsonSummary,
  ProtocolDocument,
  ProtocolHit,
} from "@/types/result-types.ts";

export function missHit(id: string, warnings: string[] = []): ProtocolHit {
  return { id, found: false, urls: [], warnings };
}

export type FoundHitInput = {
  readonly id: string;
  readonly urls: string[];
  readonly status?: number;
  readonly contentType?: string;
  readonly summary?: JsonSummary;
  readonly documents?: ProtocolDocument[];
  readonly warnings?: string[];
};

export function foundHit(input: FoundHitInput): ProtocolHit {
  return {
    id: input.id,
    found: true,
    urls: input.urls,
    warnings: input.warnings ?? [],
    ...withOptional("status", input.status),
    ...withOptional("contentType", input.contentType),
    ...withOptional("summary", input.summary),
    ...withOptional("documents", input.documents),
  };
}
