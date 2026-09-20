import { withConvertFlags } from "@/convert/flags.ts";
import { withDiscoverFlags } from "@/discover/flags.ts";
import { withFetchFlags } from "@/fetch/flags.ts";

import { takeValue } from "./flag-value.ts";
import { unknownFlagError } from "./parse-error.ts";
import { flagsFor } from "./usage.ts";
import { withGlobalFlags } from "./with-global-flags.ts";

import type { ParsedCli } from "./parsed.ts";
import type { Token } from "./token.ts";
import type { CliAction } from "./usage.ts";

export type FlagCursor = { readonly draft: ParsedCli; readonly next: number };

type FlagWriter = (
  draft: ParsedCli,
  name: string,
  value: string,
) => ParsedCli | undefined;

const writers: readonly FlagWriter[] = [
  withGlobalFlags,
  withFetchFlags,
  withDiscoverFlags,
  withConvertFlags,
];

export function applyFlag(
  cursor: FlagCursor,
  tokens: Token[],
  action: CliAction,
): FlagCursor {
  const token = tokens[cursor.next];
  if (token?.kind !== "flag") {
    return { draft: cursor.draft, next: cursor.next + 1 };
  }
  const allowed = flagsFor(action);
  if (!allowed.includes(token.name)) {
    throw unknownFlagError(token.name, allowed, action);
  }
  return applyKnown(cursor, tokens, token.name);
}

function applyKnown(
  cursor: FlagCursor,
  tokens: Token[],
  name: string,
): FlagCursor {
  if (name === "--json") {
    return { draft: { ...cursor.draft, json: true }, next: cursor.next + 1 };
  }
  if (name === "--help") {
    return { draft: { ...cursor.draft, help: true }, next: cursor.next + 1 };
  }
  const taken = takeValue(tokens, cursor.next, name);
  return {
    draft: withValue(cursor.draft, name, taken.value),
    next: taken.next,
  };
}

function withValue(draft: ParsedCli, name: string, value: string): ParsedCli {
  return actionFlags(draft, name, value);
}

function actionFlags(draft: ParsedCli, name: string, value: string): ParsedCli {
  for (const write of writers) {
    const next = write(draft, name, value);
    if (next !== undefined) {
      return next;
    }
  }
  return draft;
}
