import type { PagemdErrorCode } from "./error-codes.ts";
import type { PagemdErrorDetails } from "./error-details.ts";

export class PagemdError extends Error {
  readonly code: PagemdErrorCode;
  readonly hint: string;
  readonly url?: string;
  readonly status?: number;
  readonly details?: PagemdErrorDetails;

  constructor(options: {
    code: PagemdErrorCode;
    message: string;
    hint: string;
    url?: string;
    status?: number;
    details?: PagemdErrorDetails;
  }) {
    super(options.message);
    this.name = "PagemdError";
    this.code = options.code;
    this.hint = options.hint;
    if (options.url !== undefined) {
      this.url = options.url;
    }
    if (options.status !== undefined) {
      this.status = options.status;
    }
    if (options.details !== undefined) {
      this.details = options.details;
    }
  }
}
