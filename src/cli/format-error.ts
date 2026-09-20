import type { MdFetchError } from "@/types/errors.ts";

export function formatErrorText(error: MdFetchError): string {
  const lines = [`mdfetch: ${error.message}`, error.hint];
  if (error.details?.didYouMean !== undefined) {
    lines.splice(1, 0, `Did you mean "${error.details.didYouMean}"?`);
  }
  if (error.details?.allowed !== undefined) {
    lines.splice(
      lines.length - 1,
      0,
      `Allowed: ${error.details.allowed.join(", ")}`,
    );
  }
  return `${lines.join("\n")}\n`;
}
