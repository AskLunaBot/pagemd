import { MdFetchError } from "@/types/errors.ts";

export function shouldRetry(error: Error): boolean {
  if (!(error instanceof MdFetchError)) {
    return false;
  }
  if (error.code === "timeout" || error.code === "unreachable") {
    return true;
  }
  if (error.code === "rate_limited") {
    return true;
  }
  return retryableStatus(error.status);
}

function retryableStatus(status: number | undefined): boolean {
  if (status === undefined) {
    return false;
  }
  if (status === 408 || status === 425 || status === 429) {
    return true;
  }
  return status >= 500;
}
