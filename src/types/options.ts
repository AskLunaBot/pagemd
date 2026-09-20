import type { FetchMarkdownResult } from "./result-types.ts";

export type SwitchState = "on" | "off";

export type CacheMode = "lru" | "false";

export type HtmlToMarkdown = (
  html: string,
  context: { readonly url: string },
) => string | Promise<string>;

export type IsHtml = (value: string) => boolean;

export type FetchLike = (
  input: string,
  init?: RequestInit,
) => Promise<Response>;

export type FetchMarkdownOptions = {
  readonly acceptMarkdown?: SwitchState;
  readonly markdownUrl?: SwitchState;
  readonly linkAlternate?: SwitchState;
  readonly htmlConvert?: SwitchState;
  readonly maxCharacters?: number;
  readonly page?: number;
  readonly pageSize?: number;
};

export type DiscoverOptions = {
  readonly protocolIds?: string[];
  readonly expandSkills?: SwitchState;
  readonly limit?: number;
};

export type ConvertOptions = { readonly baseUrl?: string };

export type CacheStore = {
  readonly get: (key: string) => Promise<FetchMarkdownResult | undefined>;
  readonly set: (key: string, value: FetchMarkdownResult) => Promise<void>;
};

export type CreateMdFetchOptions = {
  readonly fetch?: FetchLike;
  readonly htmlToMarkdown?: HtmlToMarkdown;
  readonly isHtml?: IsHtml;
  readonly cache?: "false" | CacheStore;
  readonly userAgent?: string;
  readonly headers?: Readonly<Record<string, string>>;
  readonly timeoutMs?: number;
  readonly retry?: number;
  readonly retryDelayMs?: number;
  readonly followRedirects?: boolean;
  readonly maxBytes?: number;
};
