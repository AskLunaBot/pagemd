import TurndownService from "turndown";

export function createTurndownService(): TurndownService {
  const service = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    hr: "---",
    fence: "```",
  });
  service.remove(["script", "style", "footer", "nav", "noscript"]);
  return service;
}
