import { errorEnvelope, successEnvelope } from "./envelope.ts";
import { formatErrorText } from "./format-error.ts";
import { helpData } from "./help.ts";
import { withPreface } from "./preface.ts";
import { asJsonObject, envelopeAction, printJson, printText } from "./print.ts";

import type {
  ActionResult,
  BatchResult,
  SingleResult,
} from "./action-result.ts";
import type { ParsedCli } from "./parsed.ts";
import type { MdFetchError } from "@/types/errors.ts";

export function renderHelp(parsed: ParsedCli): string {
  const help = helpData(parsed.action, parsed.explicitAction);
  if (!parsed.json) {
    return printText(help.text);
  }
  const data = asJsonObject(help);
  return printJson(successEnvelope("help", data));
}

export function renderSuccess(parsed: ParsedCli, data: ActionResult): string {
  if (!parsed.json) {
    return printText(textPayload(data));
  }
  const action = envelopeAction(parsed.action, false);
  const payload = asJsonObject(data);
  return printJson(successEnvelope(action, payload));
}

export function renderFailure(parsed: ParsedCli, error: MdFetchError): string {
  if (!parsed.json) {
    return formatErrorText(error);
  }
  const action = envelopeAction(parsed.action, parsed.help);
  return printJson(errorEnvelope(action, error));
}

function textPayload(data: ActionResult): string {
  if (isBatch(data)) {
    return joinPrefaced(data.results);
  }
  return withPreface(data, 0, 1);
}

function joinPrefaced(results: SingleResult[]): string {
  const parts: string[] = [];
  for (const [index, result] of results.entries()) {
    parts.push(withPreface(result, index, results.length).trimEnd());
  }
  return `${parts.join("\n\n")}\n`;
}

function isBatch(data: ActionResult): data is BatchResult {
  return "results" in data;
}
