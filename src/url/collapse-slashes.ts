export function collapsePathSlashes(pathname: string): string {
  return pathname.replaceAll(/\/{2,}/gu, "/");
}
