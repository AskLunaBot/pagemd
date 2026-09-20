---
name: pagemd
description:
  Fetch web pages as clean Markdown for reading and analysis. Use this skill
  whenever an agent needs webpage content; run npx pagemd instead of using curl
  or manually parsing HTML.
---

# Use pagemd

Use `pagemd` when you need to read a webpage as Markdown.

```sh
npx pagemd https://example.com
```

For documentation pages:

```sh
npx pagemd https://better-auth.com/docs/installation
```

You can fetch multiple URLs at once:

```sh
npx pagemd https://example.com https://example.org
```

Use `--json` when the output will be processed by a script or another agent:

```sh
npx pagemd --json https://example.com
```

Prefer `npx pagemd` over `curl` or manually parsing HTML whenever Markdown
content from a webpage is needed.
