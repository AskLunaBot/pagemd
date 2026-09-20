export type FetchSource =
  | "accept-markdown"
  | "md-url"
  | "link-alternate"
  | "html-convert"
  | "injected";

export type FetchMarkdownResult = {
  readonly url: string;
  readonly finalUrl: string;
  readonly markdown: string;
  readonly source: FetchSource;
  readonly contentType?: string;
  readonly title?: string;
  readonly description?: string;
  readonly canonical?: string;
  readonly tokenEstimate?: number;
  readonly fromCache: boolean;
  readonly warnings: string[];
  readonly hasMore?: boolean;
};

export type ConvertResult = {
  readonly markdown: string;
  readonly warnings: string[];
  readonly baseUrl?: string;
};

export type ProtocolDocument = {
  readonly url: string;
  readonly markdown: string;
};

export type ProtocolHit = {
  readonly id: string;
  readonly found: boolean;
  readonly urls: string[];
  readonly status?: number;
  readonly contentType?: string;
  readonly summary?: JsonSummary;
  readonly documents?: ProtocolDocument[];
  readonly warnings: string[];
};

export type JsonSummary = Readonly<
  Record<string, string | number | boolean | readonly string[]>
>;

export type DiscoverResult = {
  readonly url: string;
  readonly origin: string;
  readonly protocols: ProtocolHit[];
  readonly warnings: string[];
};
