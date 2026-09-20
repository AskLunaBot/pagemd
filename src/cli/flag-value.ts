import { invalidFlagValueError, missingArgumentError } from "./parse-error.ts";
import { cacheModes, onOff } from "./usage.ts";

import type { Token } from "./token.ts";
import type { CacheMode, SwitchState } from "@/types/options.ts";

export function takeValue(
  tokens: Token[],
  index: number,
  flag: string,
): { readonly value: string; readonly next: number } {
  const inline = tokens[index];
  if (inline?.kind === "flag" && inline.value !== undefined) {
    return { value: inline.value, next: index + 1 };
  }
  const following = tokens[index + 1];
  if (following?.kind === "word") {
    return { value: following.value, next: index + 2 };
  }
  throw missingArgumentError(`value for ${flag}`);
}

export function parseSwitch(flag: string, value: string): SwitchState {
  if (value === "on" || value === "off") {
    return value;
  }
  throw invalidFlagValueError(flag, value, [...onOff]);
}

export function parseCacheMode(value: string): CacheMode {
  if (value === "lru" || value === "false") {
    return value;
  }
  throw invalidFlagValueError("--cache", value, [...cacheModes]);
}

export function parsePositiveNumber(flag: string, value: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw invalidFlagValueError(flag, value, ["a non-negative number"]);
  }
  return parsed;
}
