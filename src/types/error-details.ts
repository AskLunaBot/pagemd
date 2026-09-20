export type PagemdErrorDetails = {
  readonly retryAfterSeconds?: number;
  readonly contentType?: string;
  readonly flag?: string;
  readonly value?: string;
  readonly allowed?: string[];
  readonly didYouMean?: string;
};
