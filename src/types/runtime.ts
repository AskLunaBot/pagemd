import type {
  CacheStore,
  FetchLike,
  HtmlToMarkdown,
  IsHtml,
} from "./options.ts";

export type MdFetchRuntime = {
  readonly fetch: FetchLike;
  readonly htmlToMarkdown: HtmlToMarkdown;
  readonly isHtml: IsHtml;
  readonly cache?: CacheStore;
  readonly userAgent: string;
  readonly extraHeaders: Readonly<Record<string, string>>;
  readonly timeoutMs: number;
  readonly retry: number;
  readonly retryDelayMs: number;
  readonly followRedirects: boolean;
  readonly maxBytes: number;
};
