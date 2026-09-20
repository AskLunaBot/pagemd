import { MdFetchError } from "@/types/errors.ts";
import { helpHint } from "@/utils/help-hint.ts";

export function parseHeaderLine(line: string): {
  readonly name: string;
  readonly value: string;
} {
  const separator = line.indexOf(":");
  if (separator <= 0) {
    throw invalidHeader(line);
  }
  const name = line.slice(0, separator).trim();
  if (name.length === 0) {
    throw invalidHeader(line);
  }
  return { name, value: line.slice(separator + 1).trim() };
}

function invalidHeader(value: string): MdFetchError {
  return new MdFetchError({
    code: "invalid_flag_value",
    message: `Invalid header "${value}".`,
    hint: `${helpHint()} Use --header "Name: value".`,
    details: { flag: "--header", value },
  });
}
