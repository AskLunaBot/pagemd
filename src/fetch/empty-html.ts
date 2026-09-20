import type { IsHtml } from "@/types/options.ts";

export function isEmptyShell(body: string, isHtml: IsHtml): boolean {
  if (body.trim().length === 0) {
    return true;
  }
  if (!isHtml(body)) {
    return false;
  }
  const text = body
    .replaceAll(/<script[\s\S]*?<\/script>/giu, " ")
    .replaceAll(/<style[\s\S]*?<\/style>/giu, " ")
    .replaceAll(/<[^>]+>/gu, " ")
    .replaceAll(/\s+/gu, " ")
    .trim();
  return text.length < 40;
}
