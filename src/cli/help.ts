import { convertHelpText } from "@/convert/help.ts";
import { discoverHelpText } from "@/discover/help.ts";
import { fetchHelpText } from "@/fetch/help.ts";

import { actions, allFlags, flagsFor } from "./usage.ts";

import type { CliAction } from "./usage.ts";

export type HelpData = {
  readonly text: string;
  readonly actions: string[];
  readonly flags: string[];
};

export function helpData(action?: string, explicitAction = false): HelpData {
  if (action === "discover" || action === "convert") {
    return actionHelpData(action);
  }
  if (action === "fetch" && explicitAction) {
    return actionHelpData("fetch");
  }
  return { text: rootHelp(), actions: [...actions], flags: allFlags() };
}

function actionHelpData(action: CliAction): HelpData {
  return {
    text: verbHelp(action),
    actions: [...actions],
    flags: flagsFor(action),
  };
}

function verbHelp(action: CliAction): string {
  if (action === "discover") {
    return discoverHelpText();
  }
  if (action === "convert") {
    return convertHelpText();
  }
  return fetchHelpText();
}

function rootHelp(): string {
  return `${rootIntro()}

${rootVerbs()}

${rootGlobalFlags()}

${rootVerbFlags()}
`;
}

function rootIntro(): string {
  return `mdfetch — fetch Markdown for humans and agents

Usage:
  mdfetch <url> [url...]
  mdfetch fetch <url> [url...]
  mdfetch discover <url> [url...]
  mdfetch convert [file...]
  mdfetch --help
  mdfetch <verb> --help`;
}

function rootVerbs(): string {
  return `Verbs:
  fetch      Page → Markdown. Default when the first arg looks like a URL.
             Args: <url> [url...]  Comma or space separated. google → google.com
  discover   Probe origin agent resources only (llms.txt, well-known, …).
             Args: <url> [url...]
  convert    Local HTML → Markdown. Reads stdin when no file is given.
             Args: [file...]  Relative links follow --base-url or the file URL.`;
}

function rootGlobalFlags(): string {
  return `Global flags (every verb):
  --json                     JSON envelope instead of text/Markdown.
  --help                     Show this help, or verb help with <verb> --help.
  --user-agent <string>      Default mdfetch/<version>.
  --header <Name: value>     Extra request header. Repeatable. Accept is owned by fetch.
  --timeout-ms <number>      Default 15000.
  --retry <number>           Extra attempts after timeout/429/5xx. Default 0.
  --retry-delay-ms <number>  Wait between retries. Default 1000. 429 uses Retry-After.
  --max-bytes <number>       Default 2000000.
  --cache lru|false          Default lru.`;
}

function rootVerbFlags(): string {
  return `fetch flags:
  --accept-markdown on|off   Try Accept: text/markdown first. Default on.
  --md-url on|off            Try URL.md / index.md twins. Default on.
  --link-alternate on|off    Follow RFC Link / rel=alternate. Default on.
  --html-convert on|off      Convert HTML with Turndown. Default on.
  --max-chars <number>       Truncate markdown. Default 100000.
  --page <number>            Heading-block page. Default 1.
  --page-size <number>       Blocks per page. 0 disables paging.

discover flags:
  --protocol <id,id>         Limit protocol probes.
  --expand-skills on|off     Fetch skill-md / url documents. Default off.
  --limit <number>           Max links/documents per protocol. Default 50.

convert flags:
  --base-url <url>           Resolve relative links.`;
}
