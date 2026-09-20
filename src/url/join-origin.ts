export function joinOriginPath(origin: string, path: string): string {
  return new URL(path, `${origin}/`).href;
}
