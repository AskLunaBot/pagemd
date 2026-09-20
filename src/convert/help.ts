export function convertHelpText(): string {
  return `mdfetch convert [file...]

Convert HTML to Markdown. Reads stdin when no file is given.

Args:
  [file...]   HTML file paths. Omit to read stdin.

Flags:
  --base-url <url>           Rewrite relative links. Default: the file URL.
  --json                     JSON envelope instead of Markdown.
  --help
`;
}
