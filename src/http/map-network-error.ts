import { PagemdError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { isAbortError } from "./abort-error.ts";

export function mapNetworkError(
  caught: Error | PagemdError,
  url: string,
): PagemdError {
  if (caught instanceof PagemdError) {
    return caught;
  }
  if (isAbortError(caught)) {
    return new PagemdError({
      code: "timeout",
      message: `Timed out fetching ${url}`,
      hint: "Raise --timeout-ms or check the host.",
      url,
    });
  }
  return new PagemdError({
    code: "unreachable",
    message: `${caught.message}: ${url}`,
    hint: helpHint(),
    url,
  });
}
