export function resolveHostPath(cwd: string, filePath: string): string {
  if (isAbsolutePath(filePath)) {
    return filePath;
  }
  const sep = pathSep(cwd);
  if (cwd.endsWith("/") || cwd.endsWith("\\")) {
    return `${cwd}${filePath}`;
  }
  return `${cwd}${sep}${filePath}`;
}

export function posixFileUrl(path: string): string {
  const slash = path.replaceAll("\\", "/");
  if (slash.startsWith("/")) {
    return `file://${slash}`;
  }
  return `file:///${slash}`;
}

function isAbsolutePath(path: string): boolean {
  if (path.startsWith("/") || path.startsWith("\\\\")) {
    return true;
  }
  return path.length > 1 && path.slice(1, 3) === ":\\";
}

function pathSep(cwd: string): string {
  if (cwd.includes("\\") && !cwd.startsWith("/")) {
    return "\\";
  }
  return "/";
}
