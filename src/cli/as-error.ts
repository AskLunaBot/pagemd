import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

export function asMdFetchError(error: Error): MdFetchError {
  if (error instanceof MdFetchError) {
    return error;
  }
  return new MdFetchError({
    code: "http_error",
    message: error.message,
    hint: helpHint(),
  });
}
