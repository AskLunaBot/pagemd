const localhostHosts = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function isLocalhostHost(hostname: string): boolean {
  return localhostHosts.has(hostname.toLowerCase());
}
