export function markdownUrlVariants(href: string): string[] {
  const parsed = new URL(href);
  if (parsed.pathname.endsWith(".md")) {
    return [parsed.href];
  }
  return unique([...pathMarkdown(parsed), withIndexMarkdown(parsed)]);
}

function unique(urls: string[]): string[] {
  return [...new Set(urls)];
}

function pathMarkdown(parsed: URL): string[] {
  const trimmed = parsed.pathname.replace(/\/$/u, "");
  if (trimmed.length === 0) {
    return [];
  }
  if (trimmed.endsWith(".html")) {
    return [withPath(parsed, `${trimmed.slice(0, -5)}.md`)];
  }
  return [withPath(parsed, `${trimmed}.md`)];
}

function withIndexMarkdown(parsed: URL): string {
  const base = parsed.pathname.endsWith("/")
    ? parsed.pathname
    : `${parsed.pathname.replace(/\/$/u, "")}/`;
  return withPath(parsed, `${base}index.md`);
}

function withPath(parsed: URL, pathname: string): string {
  const copy = new URL(parsed.href);
  copy.pathname = pathname;
  return copy.href;
}
