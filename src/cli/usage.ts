export const actions = ["fetch", "discover", "convert"] as const;

export type CliAction = (typeof actions)[number];

export const globalFlags = [
  "--json",
  "--help",
  "--user-agent",
  "--header",
  "--timeout-ms",
  "--retry",
  "--retry-delay-ms",
  "--max-bytes",
  "--cache",
] as const;

export const fetchFlags = [
  "--accept-markdown",
  "--md-url",
  "--link-alternate",
  "--html-convert",
  "--max-chars",
  "--page",
  "--page-size",
] as const;

export const discoverFlags = [
  "--protocol",
  "--expand-skills",
  "--limit",
] as const;

export const convertFlags = ["--base-url"] as const;

export const onOff = ["on", "off"] as const;

export const cacheModes = ["lru", "false"] as const;

export function flagsFor(action: CliAction): string[] {
  if (action === "fetch") {
    return [...globalFlags, ...fetchFlags];
  }
  if (action === "discover") {
    return [...globalFlags, ...discoverFlags];
  }
  return [...globalFlags, ...convertFlags];
}

export function allFlags(): string[] {
  return [...globalFlags, ...fetchFlags, ...discoverFlags, ...convertFlags];
}

const switchFlags = new Set<string>(["--json", "--help"]);

export function flagTakesValue(name: string): boolean {
  return !switchFlags.has(name);
}
