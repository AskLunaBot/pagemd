import { expect, test } from "bun:test";

import { posixFileUrl, resolveHostPath } from "@/cli/posix-path.ts";

test("resolves relative posix paths against cwd", () => {
  expect(resolveHostPath("/work", "page.html")).toBe("/work/page.html");
  expect(resolveHostPath("/work/", "page.html")).toBe("/work/page.html");
  expect(resolveHostPath("/work", "/abs.html")).toBe("/abs.html");
});

test("posixFileUrl prefixes file://", () => {
  expect(posixFileUrl("/work/page.html")).toBe("file:///work/page.html");
  expect(posixFileUrl("work/page.html")).toBe("file:///work/page.html");
});
