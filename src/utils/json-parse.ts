/* oxlint-disable typescript/no-unsafe-assignment -- JSON.parse is untyped. */

import { asJsonObject } from "./as-json-object.ts";

import type { JsonObject, JsonValue } from "@/types/json-value.ts";

export function parseJsonObject(text: string): JsonObject | undefined {
  const parsed = parseJsonValue(text);
  if (parsed === undefined) {
    return undefined;
  }
  return asJsonObject(parsed);
}

function parseJsonValue(text: string): JsonValue | undefined {
  try {
    const parsed: JsonValue = JSON.parse(text);
    return parsed;
  } catch {
    return undefined;
  }
}
