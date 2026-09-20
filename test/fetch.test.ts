import { expect, test } from "bun:test";

import { createPagemd, pagemd, PagemdError } from "@/index.ts";

test("uses injected fetch for accept-markdown", async () => {
  const client = createPagemd({
    cache: { get: async () => undefined, set: async () => undefined },
    fetch: async (input) =>
      new Response("# Title\n\nHello\n", {
        status: 200,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          vary: "Accept",
          "x-request-url": input,
        },
      }),
  });
  const result = await client.fetch("https://example.com/page");
  expect(result.source).toBe("accept-markdown");
  expect(result.markdown).toContain("# Title");
});

test("falls back to html convert", async () => {
  const client = createPagemd({
    cache: { get: async () => undefined, set: async () => undefined },
    fetch: async () =>
      new Response(
        "<!doctype html><html><body><h1>Example Domain</h1><p>This domain is for use in examples.</p></body></html>",
        { status: 200, headers: { "content-type": "text/html" } },
      ),
  });
  const result = await client.fetch("https://example.com", {
    acceptMarkdown: "off",
    markdownUrl: "off",
    linkAlternate: "off",
  });
  expect(result.source).toBe("html-convert");
  expect(result.markdown).toContain("Example Domain");
});

test("exports a default pagemd client", async () => {
  expect(typeof pagemd.fetch).toBe("function");
  expect(typeof pagemd.discover).toBe("function");
  expect(typeof pagemd.convert).toBe("function");
  const local = await pagemd.convert("<h1>Hi</h1>", {
    baseUrl: "https://example.com/",
  });
  expect(local.markdown).toContain("# Hi");
});

test("sends extra headers and keeps pipeline Accept", async () => {
  let seen: Headers | undefined;
  const client = createPagemd({
    cache: "false",
    userAgent: "pagemd-test",
    headers: { Cookie: "a=1", "User-Agent": "browser-ua" },
    fetch: async (_input, init) => {
      seen = new Headers(init?.headers);
      return new Response("# Ok\n", {
        status: 200,
        headers: { "content-type": "text/markdown", vary: "Accept" },
      });
    },
  });
  await client.fetch("https://example.com/headers");
  expect(seen?.get("cookie")).toBe("a=1");
  expect(seen?.get("user-agent")).toBe("browser-ua");
  expect(seen?.get("accept")).toContain("text/markdown");
});

test("retries 503 then succeeds", async () => {
  let hits = 0;
  const client = createPagemd({
    cache: "false",
    retry: 1,
    retryDelayMs: 0,
    fetch: async () => {
      hits += 1;
      if (hits === 1) {
        return new Response("busy", { status: 503 });
      }
      return new Response("# Ok\n", {
        status: 200,
        headers: { "content-type": "text/markdown", vary: "Accept" },
      });
    },
  });
  const result = await client.fetch("https://example.com/retry");
  expect(hits).toBe(2);
  expect(result.markdown).toContain("# Ok");
});

test("does not retry 404", async () => {
  let hits = 0;
  const client = createPagemd({
    cache: "false",
    retry: 3,
    fetch: async () => {
      hits += 1;
      return new Response("missing", { status: 404 });
    },
  });
  try {
    await client.fetch("https://example.com/missing");
    expect(false).toBe(true);
  } catch (error) {
    expect(error).toBeInstanceOf(PagemdError);
    if (error instanceof PagemdError) {
      expect(error.code).toBe("not_found");
    }
  }
  expect(hits).toBe(1);
});

test("skips 404 text/plain twins and converts HTML last", async () => {
  const requested: string[] = [];
  const client = createPagemd({
    cache: "false",
    fetch: async (input) => {
      requested.push(input);
      if (input.endsWith(".md")) {
        return new Response("Not Found", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      }
      return new Response(
        "<!doctype html><html><body><h1>Repo</h1><p>Hello docs about converting HTML pages into Markdown for agents.</p></body></html>",
        { status: 200, headers: { "content-type": "text/html" } },
      );
    },
  });
  const result = await client.fetch(
    "https://github.com/xberg-io/html-to-markdown",
  );
  expect(requested[0]?.endsWith("/html-to-markdown")).toBe(true);
  expect(requested.some((url) => url.endsWith(".md"))).toBe(true);
  expect(requested.some((url) => url.endsWith("/.md"))).toBe(false);
  expect(result.source).toBe("html-convert");
  expect(result.markdown).toContain("Repo");
});

test("root URL does not request /.md", async () => {
  const requested: string[] = [];
  const client = createPagemd({
    cache: "false",
    fetch: async (input) => {
      requested.push(input);
      if (input.endsWith(".md")) {
        return new Response("The page could not be found", {
          status: 404,
          headers: { "content-type": "text/plain" },
        });
      }
      return new Response(
        "<!doctype html><html><body><h1>Vercel app</h1><p>Home copy for a landing page with enough readable text.</p></body></html>",
        { status: 200, headers: { "content-type": "text/html" } },
      );
    },
  });
  const result = await client.fetch("https://titanic-opus-5-2.vercel.app");
  expect(requested.some((url) => url.endsWith("/.md"))).toBe(false);
  expect(requested).toContain("https://titanic-opus-5-2.vercel.app/index.md");
  expect(result.source).toBe("html-convert");
  expect(result.markdown).toContain("Vercel app");
});

test("cache false skips the store", async () => {
  const hits: string[] = [];
  const client = createPagemd({
    cache: "false",
    fetch: async () => {
      hits.push("fetch");
      return new Response("# Once\n", {
        status: 200,
        headers: { "content-type": "text/markdown", vary: "Accept" },
      });
    },
  });
  await client.fetch("https://example.com/once");
  await client.fetch("https://example.com/once");
  expect(hits).toEqual(["fetch", "fetch"]);
});
