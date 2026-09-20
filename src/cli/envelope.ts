import { withOptional } from "@/utils/optional.ts";

import type { PagemdError } from "@/types/errors.ts";
import type { JsonObject } from "@/types/json-value.ts";

export type EnvelopeAction =
  | "fetch"
  | "discover"
  | "convert"
  | "help"
  | "unknown";

export type JsonEnvelope = {
  readonly ok: boolean;
  readonly action: EnvelopeAction;
  readonly data: JsonObject | undefined;
  readonly error: JsonObject | undefined;
};

export function successEnvelope(
  action: EnvelopeAction,
  data: JsonObject,
): JsonEnvelope {
  return { ok: true, action, data, error: undefined };
}

export function errorEnvelope(
  action: EnvelopeAction,
  error: PagemdError,
): JsonEnvelope {
  return {
    ok: false,
    action,
    data: undefined,
    error: {
      code: error.code,
      message: error.message,
      hint: error.hint,
      ...withOptional("url", error.url),
      ...withOptional("status", error.status),
      ...withOptional("didYouMean", error.details?.didYouMean),
      ...withOptional("allowed", error.details?.allowed),
    },
  };
}
