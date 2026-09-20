import type { CliAction } from "./usage.ts";
import type { CacheMode, SwitchState } from "@/types/options.ts";

export type ParsedCli = {
  readonly action: CliAction | "help" | "unknown";
  readonly explicitAction: boolean;
  readonly json: boolean;
  readonly help: boolean;
  readonly positional: string[];
  readonly userAgent?: string;
  readonly headers?: string[];
  readonly timeoutMs?: number;
  readonly retry?: number;
  readonly retryDelayMs?: number;
  readonly maxBytes?: number;
  readonly cache: CacheMode;
  readonly acceptMarkdown?: SwitchState;
  readonly markdownUrl?: SwitchState;
  readonly linkAlternate?: SwitchState;
  readonly htmlConvert?: SwitchState;
  readonly maxCharacters?: number;
  readonly page?: number;
  readonly pageSize?: number;
  readonly protocolIds?: string[];
  readonly expandSkills?: SwitchState;
  readonly limit?: number;
  readonly baseUrl?: string;
};
