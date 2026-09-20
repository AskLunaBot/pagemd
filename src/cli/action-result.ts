import type {
  ConvertResult,
  DiscoverResult,
  FetchMarkdownResult,
} from "@/types/result-types.ts";

export type SingleResult = FetchMarkdownResult | DiscoverResult | ConvertResult;

export type BatchResult = { readonly results: SingleResult[] };

export type ActionResult = SingleResult | BatchResult;
