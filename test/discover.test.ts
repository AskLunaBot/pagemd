import { expect, test } from "bun:test";

import { formatDiscoverText } from "@/discover/text.ts";
import { createPagemd } from "@/index.ts";

test("discovers llms.txt on origin", async () => {
  const client = createPagemd({
    cache: { get: async () => undefined, set: async () => undefined },
    fetch: async (input) => {
      if (input.endsWith("/llms.txt")) {
        return new Response(
          "# Acme\n\n> Docs\n\n## Docs\n\n- [Quickstart](https://example.com/docs)\n",
          { status: 200, headers: { "content-type": "text/markdown" } },
        );
      }
      return new Response("<html><body>home</body></html>", {
        status: 200,
        headers: { "content-type": "text/html" },
      });
    },
  });
  const result = await client.discover("https://example.com", {
    protocolIds: ["llms-txt"],
  });
  const hit = result.protocols[0];
  expect(hit?.id).toBe("llms-txt");
  expect(hit?.found).toBe(true);
  expect(formatDiscoverText(result)).toContain("# https://example.com");
  expect(formatDiscoverText(result)).toContain("## llms-txt");
});

test("expands agent skills markdown when asked", async () => {
  const client = createPagemd({
    cache: { get: async () => undefined, set: async () => undefined },
    fetch: async (input) => await mockSkillFetch(input),
  });
  const result = await client.discover("https://example.com", {
    protocolIds: ["agent-skills"],
    expandSkills: "on",
  });
  const hit = result.protocols[0];
  expect(hit?.found).toBe(true);
  expect(hit?.summary?.["expandedCount"]).toBe(1);
  expect(hit?.documents?.[0]?.markdown).toContain("# Skill");
});

test("warns when A2A card paths disagree", async () => {
  const client = createPagemd({
    cache: { get: async () => undefined, set: async () => undefined },
    fetch: async (input) => await mockA2aFetch(input),
  });
  const result = await client.discover("https://example.com", {
    protocolIds: ["a2a-agent-card"],
  });
  const hit = result.protocols[0];
  expect(hit?.found).toBe(true);
  expect(hit?.urls).toHaveLength(2);
  expect(result.warnings[0]).toContain("agent-card.json");
});

async function mockSkillFetch(url: string): Promise<Response> {
  if (url.endsWith("/.well-known/agent-skills/index.json")) {
    return jsonResponse({
      skills: [{ name: "demo", "skill-md": "/skills/demo/SKILL.md" }],
    });
  }
  if (url.endsWith("/skills/demo/SKILL.md")) {
    return new Response("# Skill\n\nDo the thing.\n", {
      status: 200,
      headers: { "content-type": "text/markdown" },
    });
  }
  return htmlHome();
}

async function mockA2aFetch(url: string): Promise<Response> {
  if (url.endsWith("/.well-known/agent-card.json")) {
    return jsonResponse({ name: "current", skills: [] });
  }
  if (url.endsWith("/.well-known/agent.json")) {
    return jsonResponse({ name: "legacy", skills: [] });
  }
  return htmlHome();
}

function jsonResponse(body: object): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function htmlHome(): Response {
  return new Response("<html><body>home</body></html>", {
    status: 200,
    headers: { "content-type": "text/html" },
  });
}
