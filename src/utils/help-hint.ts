export function helpHint(action?: string): string {
  if (action === undefined) {
    return "Run `pagemd --help` to see usage.";
  }
  return `Run \`pagemd ${action} --help\` to see ${action} flags.`;
}
