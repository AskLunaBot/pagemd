import { withOptional } from "@/utils/optional.ts";

import type { ParsedCli } from "./parsed.ts";
import type { DiscoverOptions, FetchMarkdownOptions } from "@/types/options.ts";

export function discoverOptions(parsed: ParsedCli): DiscoverOptions {
  return {
    ...withOptional("protocolIds", parsed.protocolIds),
    ...withOptional("expandSkills", parsed.expandSkills),
    ...withOptional("limit", parsed.limit),
  };
}

export function fetchOptions(parsed: ParsedCli): FetchMarkdownOptions {
  return {
    ...withOptional("acceptMarkdown", parsed.acceptMarkdown),
    ...withOptional("markdownUrl", parsed.markdownUrl),
    ...withOptional("linkAlternate", parsed.linkAlternate),
    ...withOptional("htmlConvert", parsed.htmlConvert),
    ...withOptional("maxCharacters", parsed.maxCharacters),
    ...withOptional("page", parsed.page),
    ...withOptional("pageSize", parsed.pageSize),
  };
}
