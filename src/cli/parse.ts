import { isBareHostLabel } from "@/url/complete-host.ts";
import { didYouMean } from "@/utils/did-you-mean.ts";

import { applyFlag } from "./apply-flag.ts";
import { unknownActionError } from "./parse-error.ts";
import { tokenize } from "./token.ts";
import { actions, flagTakesValue } from "./usage.ts";

import type { FlagCursor } from "./apply-flag.ts";
import type { ParsedCli } from "./parsed.ts";
import type { Token, WordToken } from "./token.ts";
import type { CliAction } from "./usage.ts";

const empty: ParsedCli = {
  action: "fetch",
  explicitAction: false,
  json: false,
  help: false,
  positional: [],
  cache: "lru",
};

type PeekedAction = { readonly action: CliAction; readonly explicit: boolean };

export function parseArgv(argv: string[]): ParsedCli {
  const tokens = tokenize(argv);
  const peeked = peekAction(tokens);
  return walk({
    tokens,
    index: 0,
    draft: { ...empty, action: peeked.action, explicitAction: peeked.explicit },
    positional: [],
  });
}

function peekAction(tokens: Token[]): PeekedAction {
  const first = firstPositional(tokens, 0);
  if (first === undefined) {
    return { action: "fetch", explicit: false };
  }
  if (
    first.value === "fetch" ||
    first.value === "discover" ||
    first.value === "convert"
  ) {
    return { action: first.value, explicit: true };
  }
  return inferFetchOrThrow(first.value);
}

function inferFetchOrThrow(value: string): PeekedAction {
  const allowed = [...actions];
  if (didYouMean(value, allowed) !== undefined) {
    throw unknownActionError(value, allowed);
  }
  if (looksLikeUrl(value) || looksLikeBareHost(value)) {
    return { action: "fetch", explicit: false };
  }
  throw unknownActionError(value, allowed);
}

function firstPositional(
  tokens: Token[],
  index: number,
): WordToken | undefined {
  const token = tokens[index];
  if (token === undefined) {
    return undefined;
  }
  if (token.kind === "word") {
    return token;
  }
  return firstPositional(tokens, nextAfterFlag(tokens, index, token));
}

function nextAfterFlag(
  tokens: Token[],
  index: number,
  token: Extract<Token, { kind: "flag" }>,
): number {
  if (token.value !== undefined || !flagTakesValue(token.name)) {
    return index + 1;
  }
  const following = tokens[index + 1];
  if (following?.kind === "word") {
    return index + 2;
  }
  return index + 1;
}

function looksLikeUrl(value: string): boolean {
  if (value.includes(".") || value.includes("://") || value.startsWith("/")) {
    return true;
  }
  return value.includes(",");
}

function looksLikeBareHost(value: string): boolean {
  const host = value.split("/")[0] ?? "";
  return isBareHostLabel(host);
}

type ParseWalk = {
  readonly tokens: Token[];
  readonly index: number;
  readonly draft: ParsedCli;
  readonly positional: string[];
};

function walk(state: ParseWalk): ParsedCli {
  const token = state.tokens[state.index];
  if (token === undefined) {
    return { ...state.draft, positional: state.positional };
  }
  if (token.kind === "word") {
    return walk(withWord(state, token.value));
  }
  const applied = applyFlag(
    toCursor(state),
    state.tokens,
    concreteAction(state.draft),
  );
  return walk(fromCursor(state, applied));
}

function withWord(state: ParseWalk, value: string): ParseWalk {
  return {
    tokens: state.tokens,
    index: state.index + 1,
    draft: state.draft,
    positional: nextPositionals(state, value),
  };
}

function nextPositionals(state: ParseWalk, value: string): string[] {
  const skipAction =
    value === state.draft.action && state.positional.length === 0;
  if (skipAction) {
    return state.positional;
  }
  return [...state.positional, value];
}

function toCursor(state: ParseWalk): FlagCursor {
  return { draft: state.draft, next: state.index };
}

function fromCursor(state: ParseWalk, cursor: FlagCursor): ParseWalk {
  return {
    tokens: state.tokens,
    index: cursor.next,
    draft: cursor.draft,
    positional: state.positional,
  };
}

function concreteAction(draft: ParsedCli): CliAction {
  if (draft.action === "help" || draft.action === "unknown") {
    return "fetch";
  }
  return draft.action;
}
