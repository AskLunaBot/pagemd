export function appendJsonLd(markdown: string, blocks: string[]): string {
  if (blocks.length === 0) {
    return markdown;
  }
  const fenced = ["", "```json", ...blocks, "```"].join("\n");
  return `${markdown.trimEnd()}\n${fenced}\n`;
}
