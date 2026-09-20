import { expect, test } from "bun:test";

import { createPagemdCommand } from "@/index.ts";

test("virtual help is stdout and exit 0", async () => {
  const command = createPagemdCommand();
  const result = await command.execute(["--help"]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toBe("");
  expect(result.stdout).toContain("pagemd fetch <url> [url...]");
});

test("virtual json help is an envelope", async () => {
  const command = createPagemdCommand();
  const result = await command.execute(["--json", "--help"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain('"ok": true');
  expect(result.stdout).toContain('"action": "help"');
});

test("virtual usage error is stderr unless --json", async () => {
  const command = createPagemdCommand();
  const text = await command.execute(["discver"]);
  expect(text.exitCode).toBe(2);
  expect(text.stdout).toBe("");
  expect(text.stderr).toContain('Unknown action "discver"');
  const json = await command.execute(["--json", "discver"]);
  expect(json.exitCode).toBe(2);
  expect(json.stderr).toBe("");
  expect(json.stdout).toContain('"ok": false');
});

test("convert without stdin is help", async () => {
  const command = createPagemdCommand();
  const result = await command.execute(["convert"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("pagemd convert");
});

test("virtual convert reads piped stdin", async () => {
  const command = createPagemdCommand({ stdin: "<h1>Hello</h1>" });
  const result = await command.execute([
    "convert",
    "--base-url",
    "https://example.com/",
  ]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("# Hello");
  expect(result.stdout).toContain("pagemd convert");
});

test("virtual convert reads host files", async () => {
  const files: Readonly<Record<string, string>> = {
    "/work/page.html": "<h1>From file</h1>",
  };
  const command = createPagemdCommand({
    cwd: "/work",
    readFile: async (path) => {
      const html = files[path];
      if (html === undefined) {
        throw new Error(`missing ${path}`);
      }
      return html;
    },
  });
  const result = await command.execute(["convert", "page.html"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("# From file");
  expect(result.stdout).toContain("base-url: file:///work/page.html");
});

test("factory fetch is used for virtual pagemd fetch", async () => {
  const command = createPagemdCommand({
    cache: "false",
    fetch: async () =>
      new Response("# Title\n", {
        status: 200,
        headers: { "content-type": "text/markdown", vary: "Accept" },
      }),
  });
  const result = await command.execute(["--json", "https://example.com/page"]);
  expect(result.exitCode).toBe(0);
  expect(result.stdout).toContain("accept-markdown");
  expect(result.stdout).toContain("# Title");
});
