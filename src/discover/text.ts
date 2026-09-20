import type { DiscoverResult, ProtocolHit } from "@/types/result-types.ts";

export function formatDiscoverText(result: DiscoverResult): string {
  const blocks = [
    `# ${result.origin}`,
    "",
    `Probed: ${result.url}`,
    "",
    ...result.protocols.flatMap(formatHit),
    ...warningLines(result.warnings),
  ];
  return `${blocks.join("\n").trimEnd()}\n`;
}

function formatHit(hit: ProtocolHit): string[] {
  return [
    `## ${hit.id}`,
    "",
    `- ${foundLabel(hit.found)}`,
    ...hit.urls.map((url) => `- ${url}`),
    ...summaryLines(hit),
    ...documentLines(hit),
    "",
  ];
}

function foundLabel(found: boolean): string {
  if (found) {
    return "found";
  }
  return "missing";
}

function summaryLines(hit: ProtocolHit): string[] {
  const summary = hit.summary;
  if (summary === undefined) {
    return [];
  }
  return Object.entries(summary).map(([key, value]) => {
    return `- ${key}: ${formatSummaryValue(value)}`;
  });
}

function formatSummaryValue(
  value: string | number | boolean | readonly string[],
): string {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
}

function documentLines(hit: ProtocolHit): string[] {
  if (hit.documents === undefined || hit.documents.length === 0) {
    return [];
  }
  return hit.documents.map((document) => `- document: ${document.url}`);
}

function warningLines(warnings: string[]): string[] {
  if (warnings.length === 0) {
    return [];
  }
  return ["## warnings", "", ...warnings.map((warning) => `- ${warning}`), ""];
}
