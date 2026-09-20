import { formatDiscoverText } from "@/discover/text.ts";

import type { SingleResult } from "./action-result.ts";
import type {
  ConvertResult,
  DiscoverResult,
  FetchMarkdownResult,
} from "@/types/result-types.ts";

export function withPreface(
  result: SingleResult,
  index: number,
  total: number,
): string {
  const lines = ["<!--", ...prefaceLines(result)];
  if (total > 1) {
    lines.push(`index: ${index + 1}/${total}`);
  }
  lines.push("-->", "", bodyOf(result));
  return `${lines.join("\n").trimEnd()}\n`;
}

function prefaceLines(result: SingleResult): string[] {
  if (isFetchResult(result)) {
    return fetchLines(result);
  }
  if (isDiscoverResult(result)) {
    return discoverLines(result);
  }
  return convertLines(result);
}

function fetchLines(result: FetchMarkdownResult): string[] {
  const lines = [
    `pagemd: ${result.url}`,
    `final-url: ${result.finalUrl}`,
    `source: ${result.source}`,
  ];
  if (result.contentType !== undefined) {
    lines.push(`content-type: ${result.contentType}`);
  }
  pushWarnings(lines, result.warnings);
  return lines;
}

function discoverLines(result: DiscoverResult): string[] {
  const lines = [`pagemd discover: ${result.url}`, `origin: ${result.origin}`];
  pushWarnings(lines, result.warnings);
  return lines;
}

function convertLines(result: ConvertResult): string[] {
  const lines = ["pagemd convert"];
  if (result.baseUrl !== undefined) {
    lines.push(`base-url: ${result.baseUrl}`);
  }
  pushWarnings(lines, result.warnings);
  return lines;
}

function pushWarnings(lines: string[], warnings: string[]): void {
  for (const warning of warnings) {
    lines.push(`warning: ${warning}`);
  }
}

function bodyOf(result: SingleResult): string {
  if ("markdown" in result) {
    return result.markdown;
  }
  return formatDiscoverText(result);
}

function isFetchResult(result: SingleResult): result is FetchMarkdownResult {
  return "source" in result;
}

function isDiscoverResult(result: SingleResult): result is DiscoverResult {
  return "protocols" in result;
}
