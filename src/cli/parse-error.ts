import { MdFetchError } from "@/types/errors.ts";
import { didYouMean } from "@/utils/did-you-mean.ts";
import { helpHint } from "@/utils/help-hint.ts";

export function unknownActionError(
  value: string,
  allowed: string[],
): MdFetchError {
  return new MdFetchError({
    code: "unknown_action",
    message: `Unknown action "${value}".`,
    hint: helpHint(),
    details: suggestionDetails(value, allowed),
  });
}

export function unknownFlagError(
  flag: string,
  allowed: string[],
  action?: string,
): MdFetchError {
  return new MdFetchError({
    code: "unknown_flag",
    message: `Unknown flag "${flag}".`,
    hint: `${helpHint(action)} Flags do not have short aliases.`,
    details: { flag, ...suggestionDetails(flag, allowed) },
  });
}

export function invalidFlagValueError(
  flag: string,
  value: string,
  allowed: string[],
): MdFetchError {
  return new MdFetchError({
    code: "invalid_flag_value",
    message: `Invalid value for ${flag}: "${value}".`,
    hint: helpHint(),
    details: { flag, value, allowed },
  });
}

export function missingArgumentError(
  what: string,
  action?: string,
): MdFetchError {
  return new MdFetchError({
    code: "missing_argument",
    message: `Missing ${what}.`,
    hint: helpHint(action),
  });
}

function suggestionDetails(
  value: string,
  allowed: string[],
): { readonly allowed: string[]; readonly didYouMean?: string } {
  const suggestion = didYouMean(value, allowed);
  if (suggestion === undefined) {
    return { allowed };
  }
  return { allowed, didYouMean: suggestion };
}
