import { unknownFlagError } from "./parse-error.ts";
import { flagsFor } from "./usage.ts";

export type FlagToken = {
  readonly kind: "flag";
  readonly name: string;
  readonly value?: string;
};

export type WordToken = { readonly kind: "word"; readonly value: string };

export type Token = FlagToken | WordToken;

export function tokenize(argv: string[]): Token[] {
  return argv.flatMap(toTokens);
}

function toTokens(argument: string): Token[] {
  if (argument === "--") {
    return [];
  }
  if (argument.startsWith("--")) {
    return [flagToken(argument)];
  }
  if (argument.startsWith("-") && argument.length > 1) {
    throw unknownFlagError(argument, [...flagsFor("fetch")]);
  }
  return [{ kind: "word", value: argument }];
}

function flagToken(argument: string): FlagToken {
  const without = argument.slice(2);
  const equal = without.indexOf("=");
  if (equal === -1) {
    return { kind: "flag", name: `--${without}` };
  }
  return {
    kind: "flag",
    name: `--${without.slice(0, equal)}`,
    value: without.slice(equal + 1),
  };
}
