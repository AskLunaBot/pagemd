export type FetchedPage = {
  readonly url: string;
  readonly finalUrl: string;
  readonly status: number;
  readonly headers: Headers;
  readonly body: string;
  readonly ok: boolean;
};
