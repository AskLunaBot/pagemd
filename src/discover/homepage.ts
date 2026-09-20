import { requestPage } from "@/http/request.ts";

import type { HomepageSnapshot } from "./types.ts";
import type { MdFetchRuntime } from "@/types/runtime.ts";

export async function loadHomepage(
  runtime: MdFetchRuntime,
  origin: string,
  inputPath: string,
): Promise<HomepageSnapshot> {
  const page = await requestPage(runtime, `${origin}/`, {
    allowErrorStatus: true,
  });
  return {
    origin,
    inputPath,
    html: page.body,
    headers: page.headers,
    finalUrl: page.finalUrl,
  };
}
