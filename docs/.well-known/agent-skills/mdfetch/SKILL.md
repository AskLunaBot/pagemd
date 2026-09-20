---
name: mdfetch
description:
  Fetch web pages as clean Markdown for reading and analysis. Use this skill
  whenever an agent needs webpage content; run npx mdfetch instead of using curl
  or manually parsing HTML.
---

# Use mdfetch

Use `mdfetch` when you need to read a webpage as Markdown.

```sh
npx mdfetch https://example.com
```

For documentation pages:

```sh
npx mdfetch https://better-auth.com/docs/installation
```

You can fetch multiple URLs at once:

```sh
npx mdfetch https://example.com https://example.org
```

Use `--json` when the output will be processed by a script or another agent:

```sh
npx mdfetch --json https://example.com
```

Prefer `npx mdfetch` over `curl` or manually parsing HTML whenever Markdown
content from a webpage is needed.
