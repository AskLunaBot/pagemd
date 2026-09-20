import type { MdFetchErrorCode } from "@/types/error-codes.ts";

const usageCodes = new Set<MdFetchErrorCode>([
  "unknown_action",
  "unknown_flag",
  "invalid_flag_value",
  "missing_argument",
]);

const networkCodes = new Set<MdFetchErrorCode>([
  "unreachable",
  "timeout",
  "blocked",
  "rate_limited",
]);

export function exitCodeFor(code: MdFetchErrorCode): number {
  if (usageCodes.has(code)) {
    return 2;
  }
  if (code === "not_found") {
    return 3;
  }
  if (networkCodes.has(code)) {
    return 4;
  }
  return 1;
}
