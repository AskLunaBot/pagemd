import type { JsonObject, JsonValue } from "@/types/json-value.ts";

export function asJsonObject(value: JsonValue): JsonObject | undefined {
  if (!isPlainJsonObject(value)) {
    return undefined;
  }
  const result: Record<string, JsonValue> = {};
  for (const [key, field] of Object.entries(value)) {
    result[key] = field;
  }
  return result;
}

function isPlainJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === "object" && !Array.isArray(value);
}
