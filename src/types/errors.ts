import type { MdFetchErrorCode } from "./error-codes.ts";
import type { MdFetchErrorDetails } from "./error-details.ts";

export class MdFetchError extends Error {
  readonly code: MdFetchErrorCode;
  readonly hint: string;
  readonly url?: string;
  readonly status?: number;
  readonly details?: MdFetchErrorDetails;

  constructor(options: {
    code: MdFetchErrorCode;
    message: string;
    hint: string;
    url?: string;
    status?: number;
    details?: MdFetchErrorDetails;
  }) {
    super(options.message);
    this.name = "MdFetchError";
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
