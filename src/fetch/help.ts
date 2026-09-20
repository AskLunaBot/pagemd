export function fetchHelpText(): string {
  return `pagemd fetch <url> [url...]

Fetch a page as Markdown. This is the default verb when the first
argument looks like a URL.

Args:
  <url>    Page to fetch. Space or comma separated.
           Bare hosts get https://. google → https://google.com/

Flags:
  --accept-markdown on|off   Try Accept: text/markdown first. Default on.
  --md-url on|off            Try URL.md / index.md twins. Default on.
  --link-alternate on|off    Follow RFC Link / rel=alternate. Default on.
  --html-convert on|off      Convert HTML with Turndown. Default on.
  --max-chars <number>       Truncate markdown. Default 100000.
  --page <number>            Heading-block page. Default 1.
  --page-size <number>       Blocks per page. 0 disables paging.
  --user-agent <string>
  --header <Name: value>     Repeatable extra request headers.
  --timeout-ms <number>      Default 15000.
  --retry <number>           Extra attempts after timeout/429/5xx. Default 0.
  --retry-delay-ms <number>  Default 1000. 429 uses Retry-After.
  --max-bytes <number>       Default 2000000.
  --cache lru|false          Default lru.
  --json                     JSON envelope instead of Markdown.
  --help
`;
}
