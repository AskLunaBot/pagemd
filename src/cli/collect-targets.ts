export function collectTargets(positional: string[]): string[] {
  const targets: string[] = [];
  for (const item of positional) {
    pushParts(targets, item);
  }
  return targets;
}

function pushParts(targets: string[], item: string): void {
  for (const part of item.split(",")) {
    const trimmed = part.trim();
    if (trimmed.length > 0) {
      targets.push(trimmed);
    }
  }
}
