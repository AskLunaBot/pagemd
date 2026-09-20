import { asJsonObject } from "@/utils/as-json-object.ts";

import type { JsonArray, JsonObject, JsonValue } from "@/types/json-value.ts";

export function jsonString(
  object: JsonObject,
  key: string,
): string | undefined {
  const value = object[key];
  if (typeof value === "string") {
    return value;
  }
  return undefined;
}

export function jsonObject(
  value: JsonValue | undefined,
): JsonObject | undefined {
  if (value === undefined) {
    return undefined;
  }
  return asJsonObject(value);
}

export function jsonArray(object: JsonObject, key: string): JsonValue[] {
  return copyArray(object[key]);
}

function copyArray(value: JsonValue | undefined): JsonValue[] {
  if (!isJsonArray(value)) {
    return [];
  }
  const items: JsonValue[] = [];
  for (const item of value) {
    items.push(item);
  }
  return items;
}

function isJsonArray(value: JsonValue | undefined): value is JsonArray {
  return Array.isArray(value);
}
