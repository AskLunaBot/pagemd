export function isAbortError(error: Error): boolean {
  return error.name === "AbortError" || error.name === "TimeoutError";
}
