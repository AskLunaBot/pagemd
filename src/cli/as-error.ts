import { PagemdError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

export function asPagemdError(error: Error): PagemdError {
  if (error instanceof PagemdError) {
    return error;
  }
  return new PagemdError({
    code: "http_error",
    message: error.message,
    hint: helpHint(),
  });
}
