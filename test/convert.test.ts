import { expect, test } from "bun:test";

import { createMdFetch, isHtml } from "@/index.ts";

test("converts headings and strips scripts", async () => {
  const client = createMdFetch({
    cache: { get: async () => undefined, set: async () => undefined },
  });
  const result = await client.convert(
    "<h1>Hello</h1><script>alert(1)</script><p>World</p>",
    { baseUrl: "https://example.com/" },
  );
  expect(result.markdown).toContain("# Hello");
  expect(result.markdown).toContain("World");
  expect(result.markdown).not.toContain("alert");
});

test("rewrites relative links against baseUrl", async () => {
  const client = createMdFetch({
    cache: { get: async () => undefined, set: async () => undefined },
  });
  const result = await client.convert(
    '<p><a href="/docs">Docs</a><img src="logo.png" alt="Logo"></p>',
    { baseUrl: "https://example.com/app/" },
  );
  expect(result.markdown).toContain("https://example.com/docs");
  expect(result.markdown).toContain("https://example.com/app/logo.png");
  expect(result.baseUrl).toBe("https://example.com/app/");
});

test("isHtml is a best-guess, not a validator", () => {
  expect(isHtml("<html></html>")).toBe(true);
  expect(isHtml("  <p>Hi</p>  ")).toBe(true);
  expect(isHtml("# Title\n\nHello")).toBe(false);
  expect(isHtml("<html>")).toBe(false);
});
