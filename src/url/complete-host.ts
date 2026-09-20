import { isLocalhostHost } from "./is-localhost.ts";

export type CompletedHost = {
  readonly value: string;
  readonly warning?: string;
};

export function completeHost(raw: string): CompletedHost {
  if (hasScheme(raw)) {
    return { value: raw };
  }
  const slash = raw.indexOf("/");
  const hostPart = hostAndPath(raw, slash).host;
  const pathPart = hostAndPath(raw, slash).path;
  const hostname = hostNameOf(hostPart);
  if (hostname.includes(".") || isLocalhostHost(hostname)) {
    return { value: raw };
  }
  if (!isBareHostLabel(hostname)) {
    return { value: raw };
  }
  const completed = `${withCom(hostPart)}${pathPart}`;
  return { value: completed, warning: `Completed ${raw} → ${completed}` };
}

function hostAndPath(
  raw: string,
  slash: number,
): { readonly host: string; readonly path: string } {
  if (slash === -1) {
    return { host: raw, path: "" };
  }
  return { host: raw.slice(0, slash), path: raw.slice(slash) };
}

function hasScheme(raw: string): boolean {
  return /^[a-z][a-z0-9+.-]*:/iu.test(raw);
}

function hostNameOf(hostPart: string): string {
  let value = hostPart;
  const at = hostPart.lastIndexOf("@");
  if (at !== -1) {
    value = hostPart.slice(at + 1);
  }
  const colon = value.indexOf(":");
  if (colon === -1) {
    return value.toLowerCase();
  }
  return value.slice(0, colon).toLowerCase();
}

export function isBareHostLabel(hostname: string): boolean {
  return /^[a-z0-9-]+$/u.test(hostname) && hostname.length > 0;
}

function withCom(hostPart: string): string {
  const colon = hostPart.indexOf(":");
  if (colon === -1) {
    return `${hostPart}.com`;
  }
  return `${hostPart.slice(0, colon)}.com${hostPart.slice(colon)}`;
}
