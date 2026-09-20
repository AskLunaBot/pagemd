const mainPatterns = [
  /<main\b[^>]*>([\s\S]*?)<\/main>/iu,
  /<article\b[^>]*>([\s\S]*?)<\/article>/iu,
  /<[^>]*role=["']main["'][^>]*>([\s\S]*?)<\/[^>]+>/iu,
];

export function extractMainHtml(html: string): string {
  for (const pattern of mainPatterns) {
    const match = pattern.exec(html);
    const inner = match?.[1];
    if (inner !== undefined && inner.trim().length > 0) {
      return inner;
    }
  }
  const body = /<body\b[^>]*>([\s\S]*?)<\/body>/iu.exec(html)?.[1];
  if (body === undefined) {
    return html;
  }
  return body;
}
