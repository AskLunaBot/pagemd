export function helpHint(action?: string): string {
  if (action === undefined) {
    return "Run `mdfetch --help` to see usage.";
  }
  return `Run \`mdfetch ${action} --help\` to see ${action} flags.`;
}
