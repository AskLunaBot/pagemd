const jsonLdScriptPattern =
  /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu;

export function extractJsonLdBlocks(html: string): string[] {
  const blocks: string[] = [];
  for (const match of html.matchAll(jsonLdScriptPattern)) {
    const body = match[1]?.trim();
    if (body !== undefined && body.length > 0) {
      blocks.push(body);
    }
  }
  return blocks;
}
