import { jsonObject, jsonString } from "./json-field.ts";

import type { JsonValue } from "@/types/json-value.ts";

export function skillNamesFrom(skills: JsonValue[], limit: number): string[] {
  const names: string[] = [];
  for (const skill of skills) {
    const name = nameOf(skill);
    if (name !== undefined && names.length < limit) {
      names.push(name);
    }
  }
  return names;
}

export function skillMarkdownUrls(
  skills: JsonValue[],
  origin: string,
  limit: number,
): string[] {
  const urls: string[] = [];
  for (const skill of skills) {
    const href = markdownHref(skill, origin);
    if (href !== undefined && urls.length < limit) {
      urls.push(href);
    }
  }
  return urls;
}

function nameOf(skill: JsonValue): string | undefined {
  const object = jsonObject(skill);
  if (object === undefined) {
    return undefined;
  }
  return jsonString(object, "name");
}

function markdownHref(skill: JsonValue, origin: string): string | undefined {
  const object = jsonObject(skill);
  if (object === undefined) {
    return undefined;
  }
  const href = jsonString(object, "skill-md") ?? jsonString(object, "url");
  if (href === undefined) {
    return undefined;
  }
  return new URL(href, `${origin}/`).href;
}
