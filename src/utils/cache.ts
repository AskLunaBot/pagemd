import { lruCacheCapacity } from "./defaults.ts";

import type { CacheStore } from "@/types/options.ts";
import type { FetchMarkdownResult } from "@/types/result-types.ts";

export function createMemoryCache(capacity = lruCacheCapacity): CacheStore {
  const entries = new Map<string, FetchMarkdownResult>();
  return {
    get: async (key) => await Promise.resolve(read(entries, key)),
    set: async (key, value) => {
      write(entries, { key, value, capacity });
      await Promise.resolve();
    },
  };
}

function read(
  entries: Map<string, FetchMarkdownResult>,
  key: string,
): FetchMarkdownResult | undefined {
  const value = entries.get(key);
  if (value === undefined) {
    return value;
  }
  entries.delete(key);
  entries.set(key, value);
  return value;
}

type CacheWrite = {
  readonly key: string;
  readonly value: FetchMarkdownResult;
  readonly capacity: number;
};

function write(
  entries: Map<string, FetchMarkdownResult>,
  input: CacheWrite,
): void {
  entries.delete(input.key);
  entries.set(input.key, input.value);
  evict(entries, input.capacity);
}

function evict(
  entries: Map<string, FetchMarkdownResult>,
  capacity: number,
): void {
  if (entries.size <= capacity) {
    return;
  }
  const oldest = entries.keys().next().value;
  if (oldest !== undefined) {
    entries.delete(oldest);
  }
}
