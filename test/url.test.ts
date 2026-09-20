import { expect, test } from "bun:test";

import { parseInput } from "@/url/parse-input.ts";
import { markdownUrlVariants } from "@/url/variants.ts";

test("completes bare domains with https", () => {
  expect(parseInput("example.com/docs").href).toBe("https://example.com/docs");
});

test("completes a single label to .com", () => {
  const parsed = parseInput("google");
  expect(parsed.href).toBe("https://google.com/");
  expect(parsed.warnings[0]).toContain("google.com");
});

test("builds markdown twins", () => {
  const variants = markdownUrlVariants(
    "https://better-auth.com/docs/installation",
  );
  expect(variants).toContain("https://better-auth.com/docs/installation.md");
  expect(variants).toContain(
    "https://better-auth.com/docs/installation/index.md",
  );
});

test("root path only tries index.md, not /.md", () => {
  const variants = markdownUrlVariants("https://example.com/");
  expect(variants).toEqual(["https://example.com/index.md"]);
});
