import { MdFetchError } from "@/types/errors.ts";

export function retryDelayMs(error: Error, fallbackMs: number): number {
  if (!(error instanceof MdFetchError)) {
    return fallbackMs;
  }
  const after = error.details?.retryAfterSeconds;
  if (after === undefined) {
    return fallbackMs;
  }
  return after * 1000;
}
