export const pagemdErrorCodes = [
  "unknown_action",
  "unknown_flag",
  "invalid_flag_value",
  "missing_argument",
  "invalid_url",
  "unreachable",
  "timeout",
  "http_error",
  "blocked",
  "rate_limited",
  "not_found",
  "empty_content",
  "too_large",
  "conversion_failed",
  "unsupported_content_type",
] as const;

export type PagemdErrorCode = (typeof pagemdErrorCodes)[number];
