import { expect, test } from "bun:test";

import { parseArgv } from "@/cli/parse.ts";
import { renderFailure, renderHelp, renderSuccess } from "@/cli/render.ts";
import { MdFetchError } from "@/types/errors.ts";

test("unknown action suggests discover", () => {
  expect(() => parseArgv(["discver", "https://example.com"])).toThrow(
    MdFetchError,
  );
  try {
    parseArgv(["discver", "https://example.com"]);
  } catch (error) {
    expect(error).toBeInstanceOf(MdFetchError);
    if (error instanceof MdFetchError) {
      expect(error.code).toBe("unknown_action");
      expect(error.details?.didYouMean).toBe("discover");
      expect(error.hint).toContain("--help");
      const json = renderFailure(
        {
          action: "unknown",
          explicitAction: false,
          json: true,
          help: false,
          positional: [],
          cache: "lru",
        },
        error,
      );
      expect(json).toContain('"ok": false');
      expect(json).toContain('"action": "unknown"');
      expect(json).toContain("discover");
    }
  }
});

test("help is json when --json is set", () => {
  const parsed = parseArgv(["--json", "--help"]);
  const output = renderHelp(parsed);
  expect(output).toContain('"ok": true');
  expect(output).toContain('"action": "help"');
  expect(output).toContain("fetch");
  expect(output).toContain("discover");
});

test("root --help lists every verb and flag", () => {
  const parsed = parseArgv(["--help"]);
  const output = renderHelp(parsed);
  expect(output).toContain("mdfetch fetch <url> [url...]");
  expect(output).toContain("mdfetch discover <url> [url...]");
  expect(output).toContain("mdfetch convert [file...]");
  expect(output).not.toContain("There are no short aliases");
  expect(output).toContain("--accept-markdown");
  expect(output).toContain("--protocol");
  expect(output).toContain("--base-url");
  expect(output).toContain("--json");
  expect(output).toContain("\n\nVerbs:\n");
  expect(parsed.explicitAction).toBe(false);
});

test("rejects short aliases", () => {
  expect(() => parseArgv(["-j", "https://example.com"])).toThrow();
});

test("parses repeatable --header and retry", () => {
  const parsed = parseArgv([
    "--header",
    "Cookie: a=1",
    "--header",
    "X-Test: yes",
    "--retry",
    "2",
    "--retry-delay-ms",
    "50",
    "https://example.com",
  ]);
  expect(parsed.headers).toEqual(["Cookie: a=1", "X-Test: yes"]);
  expect(parsed.retry).toBe(2);
  expect(parsed.retryDelayMs).toBe(50);
});

test("parses --cache false", () => {
  const spaced = parseArgv(["--cache", "false", "https://example.com"]);
  const inline = parseArgv(["--cache=false", "https://example.com"]);
  expect(spaced.cache).toBe("false");
  expect(inline.cache).toBe("false");
  expect(spaced.action).toBe("fetch");
});

test("rejects --cache off", () => {
  expect(() => parseArgv(["--cache", "off", "https://example.com"])).toThrow(
    MdFetchError,
  );
});

test("parses discover expand-skills", () => {
  const parsed = parseArgv([
    "discover",
    "--expand-skills",
    "on",
    "https://example.com",
  ]);
  expect(parsed.action).toBe("discover");
  expect(parsed.expandSkills).toBe("on");
  expect(parsed.positional).toEqual(["https://example.com"]);
});

test("fetch --help lists fetch flags only", () => {
  const output = renderHelp(parseArgv(["fetch", "--help"]));
  expect(output).toContain("--accept-markdown");
  expect(output).not.toContain("--protocol");
  expect(output).not.toContain('"ok": true');
});

test("discover --help lists discover flags only", () => {
  const output = renderHelp(parseArgv(["discover", "--help"]));
  expect(output).toContain("--protocol");
  expect(output).toContain("--expand-skills");
  expect(output).not.toContain("--accept-markdown");
  expect(output).not.toContain('"ok": true');
});

test("without --json discover is a markdown catalog", () => {
  const output = renderSuccess(
    {
      action: "discover",
      explicitAction: true,
      json: false,
      help: false,
      positional: ["https://example.com"],
      cache: "lru",
    },
    {
      url: "https://example.com/",
      origin: "https://example.com",
      protocols: [
        {
          id: "llms-txt",
          found: true,
          urls: ["https://example.com/llms.txt"],
          warnings: [],
        },
      ],
      warnings: [],
    },
  );
  expect(output).toContain("# https://example.com");
  expect(output).toContain("## llms-txt");
  expect(output).toContain("mdfetch discover:");
  expect(output).not.toContain('"ok":');
});

test("without --json success is markdown, not envelope", () => {
  const output = renderSuccess(
    {
      action: "fetch",
      explicitAction: false,
      json: false,
      help: false,
      positional: ["https://example.com"],
      cache: "lru",
    },
    {
      url: "https://example.com",
      finalUrl: "https://example.com",
      markdown: "# Hello\n",
      source: "html-convert",
      fromCache: false,
      warnings: [],
    },
  );
  expect(output).toContain("# Hello");
  expect(output).toContain("mdfetch: https://example.com");
  expect(output).toContain("source: html-convert");
  expect(output).not.toContain('"ok":');
});

test("treats a bare host as fetch", () => {
  const parsed = parseArgv(["google"]);
  expect(parsed.action).toBe("fetch");
  expect(parsed.positional).toEqual(["google"]);
});

test("splits comma-separated urls", () => {
  const parsed = parseArgv(["google,example.com"]);
  expect(parsed.action).toBe("fetch");
  expect(parsed.positional).toEqual(["google,example.com"]);
});
