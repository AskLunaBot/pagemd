import { parseInput } from "./parse-input.ts";

export function originFromInput(raw: string): string {
  return parseInput(raw).origin;
}
