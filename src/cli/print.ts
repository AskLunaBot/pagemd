/* oxlint-disable unicorn/no-null -- JSON envelope uses null for empty data/error. */

import { parseJsonObject } from "@/utils/json-parse.ts";

import type { EnvelopeAction, JsonEnvelope } from "./envelope.ts";
import type { JsonObject } from "@/types/json-value.ts";

export function printJson(envelope: JsonEnvelope): string {
  const payload = {
    ok: envelope.ok,
    action: envelope.action,
    data: envelope.data ?? null,
    error: envelope.error ?? null,
  };
  return `${JSON.stringify(payload, undefined, 2)}\n`;
}

export function asJsonObject(value: object): JsonObject {
  const parsed = parseJsonObject(JSON.stringify(value));
  if (parsed === undefined) {
    return {};
  }
  return parsed;
}

export function printText(text: string): string {
  if (text.endsWith("\n")) {
    return text;
  }
  return `${text}\n`;
}

export function envelopeAction(action: string, help: boolean): EnvelopeAction {
  if (help) {
    return "help";
  }
  if (
    action === "fetch" ||
    action === "discover" ||
    action === "convert" ||
    action === "unknown"
  ) {
    return action;
  }
  return "unknown";
}
