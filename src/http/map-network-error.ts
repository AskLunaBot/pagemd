import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

import { isAbortError } from "./abort-error.ts";

export function mapNetworkError(
  caught: Error | MdFetchError,
  url: string,
): MdFetchError {
  if (caught instanceof MdFetchError) {
    return caught;
  }
  if (isAbortError(caught)) {
    return new MdFetchError({
      code: "timeout",
      message: `Timed out fetching ${url}`,
      hint: "Raise --timeout-ms or check the host.",
      url,
    });
  }
  return new MdFetchError({
    code: "unreachable",
    message: `${caught.message}: ${url}`,
    hint: helpHint(),
    url,
  });
}
