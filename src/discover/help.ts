import { protocolIds } from "./protocol-ids.ts";

export function discoverHelpText(): string {
  return `pagemd discover <url> [url...]

Probe origin and homepage agent resources. Does not fetch page bodies
beyond the listed protocol documents.

Args:
  <url>    Site to probe. Only the origin well-known paths are used.

Flags:
  --protocol <id,id>         ${protocolIds.join(", ")}
  --expand-skills on|off     Fetch skill-md / url documents. Default off.
  --limit <number>           Max links/documents per protocol. Default 50.
  --user-agent <string>
  --header <Name: value>
  --timeout-ms <number>
  --retry <number>
  --retry-delay-ms <number>
  --max-bytes <number>
  --cache lru|false
  --json                     JSON envelope instead of Markdown catalog.
  --help
`;
}
