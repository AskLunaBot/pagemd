import { readHeader } from "./read-header.ts";

export function contentTypeOf(headers: Headers): string | undefined {
  const value = readHeader(headers, "content-type");
  if (value === undefined) {
    return undefined;
  }
  return value.split(";")[0]?.trim().toLowerCase();
}

export function contentTypeIncludes(headers: Headers, part: string): boolean {
  const type = contentTypeOf(headers);
  if (type === undefined) {
    return false;
  }
  return type.includes(part);
}
