export function absolutizeMarkdown(markdown: string, baseUrl: string): string {
  return rewriteHtmlRefs(rewriteMarkdownRefs(markdown, baseUrl), baseUrl);
}

function rewriteMarkdownRefs(markdown: string, baseUrl: string): string {
  return markdown.replaceAll(
    /\]\((?!https?:|mailto:|data:|#|\/\/)([^)\s]+)([^)]*)\)/gu,
    (_full, path: string, rest: string) => {
      return `](${absolutize(path, baseUrl)}${rest})`;
    },
  );
}

function rewriteHtmlRefs(markdown: string, baseUrl: string): string {
  return markdown.replaceAll(
    /\b(href|src)=(["'])(?!https?:|mailto:|data:|#|\/\/)([^"']+)\2/giu,
    (_full, ...groups: string[]) => rewriteHtmlMatch(groups, baseUrl),
  );
}

function rewriteHtmlMatch(groups: string[], baseUrl: string): string {
  const attr = groups[0] ?? "href";
  const quote = groups[1] ?? '"';
  const path = groups[2] ?? "";
  return `${attr}=${quote}${absolutize(path, baseUrl)}${quote}`;
}

function absolutize(path: string, baseUrl: string): string {
  try {
    return new URL(path, baseUrl).href;
  } catch {
    return path;
  }
}
