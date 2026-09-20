# pagemd

Fetch pages as Markdown for humans and agents.

Same kernel for CLI (`npx pagemd`, also `bunx` / `deno`) and SDK
(`createPagemd`). The SDK is a Web `fetch` library: Node, Bun, Deno, and
Cloudflare Workers.

Inject `fetch` / `htmlToMarkdown` / `cache` when the host needs cookies, a
proxy, or a browser.

Pipeline: `Accept: text/markdown` → `.md` URL twins → RFC `Link` /
`rel=alternate` → HTML to Markdown (Turndown).

## Install

CLI (npm first):

```sh
npx pagemd --help
npm install -g pagemd
```

Also: `bunx pagemd --help`, `deno run -A npm:pagemd --help`.

SDK:

```sh
npm install pagemd
bun add pagemd
```

`--help` (no verb) lists every verb and flag. `pagemd fetch --help` is
fetch-only. `-j` is an error. Bare hosts complete: `google` →
`https://google.com/`.

## CLI

Without `--json`, stdout is human-readable text / Markdown. With `--json`, every
outcome (success, error, help) is one JSON envelope.

```sh
npx pagemd google
npx pagemd google example.com
npx pagemd https://better-auth.com/docs/installation,https://example.com
npx pagemd fetch --json https://example.com
npx pagemd discover https://example.com
npx pagemd discover --json --protocol llms-txt,agent-skills --expand-skills on https://example.com
npx pagemd convert --base-url https://example.com page.html
```

Unknown verbs and flags fail with `didYouMean`, allowed values, and a help hint:

```
pagemd: Unknown action "discver".
Did you mean "discover"?
Allowed: fetch, discover, convert
Run `pagemd --help` to see usage.
```

`--json` envelope:

```json
{
  "ok": true,
  "action": "fetch",
  "data": { "markdown": "...", "source": "accept-markdown" },
  "error": null
}
```

### Verbs

| argv                             | meaning                                   |
| -------------------------------- | ----------------------------------------- |
| `pagemd <url> [url...]`          | `fetch`; comma or space lists             |
| `pagemd fetch <url> [url...]`    | same, explicit                            |
| `pagemd discover <url> [url...]` | probe agent well-known / homepage signals |
| `pagemd convert [file...]`       | HTML file(s) or stdin → Markdown          |

### Global flags

| Flag               | Values           | Default            |
| ------------------ | ---------------- | ------------------ |
| `--json`           | boolean          | off                |
| `--help`           | boolean          | off                |
| `--user-agent`     | string           | `pagemd/<version>` |
| `--header`         | `Name: value`    | none, repeatable   |
| `--timeout-ms`     | number           | `15000`            |
| `--retry`          | number           | `0`                |
| `--retry-delay-ms` | number           | `1000`             |
| `--max-bytes`      | number           | `2000000`          |
| `--cache`          | `lru` \| `false` | `lru`              |

`fetch`: `--accept-markdown`, `--md-url`, `--link-alternate`, `--html-convert`
(`on`/`off`), `--max-chars`, `--page`, `--page-size`.

`discover`: `--protocol` (comma-separated ids), `--expand-skills on|off`,
`--limit`.

`convert`: `--base-url`.

## SDK

```ts
import { createPagemd, pagemd } from "pagemd";

const page = await pagemd.fetch("better-auth.com/docs/installation");

const client = createPagemd({
  fetch: globalThis.fetch,
  cache: "false",
  userAgent: "pagemd/0.0.1",
  headers: { Cookie: "session=1" },
  timeoutMs: 15_000,
  retry: 2,
  retryDelayMs: 500,
  maxBytes: 2_000_000,
});

const catalog = await client.discover("https://example.com", {
  protocolIds: ["llms-txt", "agent-skills"],
  expandSkills: "on",
});
const local = await client.convert("<h1>Hello</h1>", {
  baseUrl: "https://example.com/",
});
```

Hooks:

- `fetch` — default `globalThis.fetch`. Proxies, cookies, Workers, or a browser
  `page.fetch` go here.
- `htmlToMarkdown(html, ctx)` — default Turndown. JS-only sites inject rendered
  HTML.
- `isHtml(value)` — guess whether a body is HTML. Default: trimmed length `> 7`,
  starts with `<`, ends with `>`. There is no real HTML validator.
- `cache` — omit for in-memory LRU, pass `"false"` to disable, or a
  `{ get, set }` store.
- `headers` — extra request headers. Pipeline `Accept` always wins. `User-Agent`
  here wins over `userAgent`.
- `retry` / `retryDelayMs` — extra attempts on timeout, unreachable, 429, and
  5xx. 429 waits `Retry-After` when present.

The SDK throws `PagemdError` (`code`, `hint`, optional `url` / `status` /
`details`). The JSON envelope is CLI-only. Published JS is ESM: Node uses
Turndown+domino; Workers / Deno / browsers use the DOMParser build. CLI is a
Node ESM file (`#!/usr/bin/env node`) so `npx pagemd` works; Bun and Deno run
that same file.

## Virtual CLI

`createPagemdCommand(ctx)` returns `{ execute(args) }` — a bash command, not a
process. Bind IO (`cwd`, `stdin`, `readFile`) and SDK hooks (`fetch`, `cache`,
…) once. Same argv, help, and `{ stdout, stderr, exitCode }` as the real CLI.
Omit `stdin` to treat convert-without-files as help (TTY). Pass `stdin: ""` for
an empty pipe.

```ts
import { createPagemdCommand } from "pagemd";

const pagemdCmd = createPagemdCommand({
  cwd: "/work",
  stdin: "<h1>Hi</h1>",
  readFile: async (path) => htmlByPath[path],
  fetch: globalThis.fetch,
  cache: "false",
});

await pagemdCmd.execute(["--json", "https://example.com"]);
await pagemdCmd.execute(["convert", "--base-url", "https://example.com"]);
await pagemdCmd.execute(["convert", "page.html"]);
```

Any shell wraps `execute`:

```ts
const cmd = createPagemdCommand({ cwd, stdin, readFile });
return await cmd.execute(args);
```

## Layout

Internal imports use `@/` (`tsconfig` `paths`). Publish from `dist/`
(`bun run build` via bunup). `dist/index.d.ts` is generated from `src/index.ts`.

```
src/
  index.ts
  browser.ts     browser / Deno / worker bundle entry
  cli/           parse, help, --json envelope; `cli.ts` is the bin
  client/        createPagemd
  fetch/         page → Markdown pipeline
  discover/      agent probes; one file per protocol
  convert/       HTML → Markdown
  http/ url/ types/ utils/
```

## Discover protocols

Each protocol lives in `src/discover/protocols/`:

`llms-txt`, `markdown-home`, `link-rels`, `robots-agentmap`, `agent-skills`,
`a2a-agent-card`, `mcp-server-card`, `ard-catalog`, `api-catalog`,
`oauth-agent-auth`.

`--expand-skills on` downloads `skill-md` / `url` documents from the Agent
Skills index. A2A probes both `agent-card.json` and legacy `agent.json` and
warns if both exist and differ.

pagemd consumes these signals. It does not score GEO, handshake MCP, or drive a
browser.
