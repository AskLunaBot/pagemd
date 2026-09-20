import { PagemdError } from "@/types/errors.ts";

import { readHeader } from "./read-header.ts";

export async function readLimitedBody(
  response: Response,
  maxBytes: number,
  url: string,
): Promise<string> {
  rejectIfDeclaredTooLarge(response, maxBytes, url);
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > maxBytes) {
    throw tooLarge(maxBytes, url);
  }
  return new TextDecoder().decode(buffer);
}

function rejectIfDeclaredTooLarge(
  response: Response,
  maxBytes: number,
  url: string,
): void {
  const declared = Number(readHeader(response.headers, "content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw tooLarge(maxBytes, url);
  }
}

function tooLarge(maxBytes: number, url: string): PagemdError {
  return new PagemdError({
    code: "too_large",
    message: `Response exceeded ${maxBytes} bytes`,
    hint: "Raise --max-bytes or fetch a smaller page.",
    url,
  });
}
