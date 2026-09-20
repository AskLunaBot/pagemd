import { withOptional } from "@/utils/optional.ts";

export type LlmsSection = {
  readonly title: string;
  readonly url: string;
  readonly notes?: string;
};

export function parseLlmsTxt(
  markdown: string,
  limit: number,
): {
  readonly title?: string;
  readonly summary?: string;
  readonly sections: LlmsSection[];
} {
  const lines = markdown.split(/\r?\n/u);
  const title = heading(lines);
  const summary = blockquote(lines);
  return {
    ...withOptional("title", title),
    ...withOptional("summary", summary),
    sections: linkItems(lines, limit),
  };
}

function nonempty(value: string | undefined): string | undefined {
  if (value === undefined || value.length === 0) {
    return undefined;
  }
  return value;
}

function heading(lines: string[]): string | undefined {
  const line = lines.find((item) => item.startsWith("# "));
  return line?.slice(2).trim();
}

function blockquote(lines: string[]): string | undefined {
  const line = lines.find((item) => item.startsWith("> "));
  return line?.slice(2).trim();
}

function linkItems(lines: string[], limit: number): LlmsSection[] {
  const sections: LlmsSection[] = [];
  for (const line of lines) {
    const section = sectionFromLine(line);
    if (section !== undefined && sections.length < limit) {
      sections.push(section);
    }
  }
  return sections;
}

function sectionFromLine(line: string): LlmsSection | undefined {
  const match =
    /^- \[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?$/u.exec(line.trim()) ?? undefined;
  if (match === undefined) {
    return undefined;
  }
  const title = match[1];
  const url = match[2];
  const notes = match[3];
  if (title === undefined || url === undefined) {
    return undefined;
  }
  return { title, url, ...withOptional("notes", nonempty(notes)) };
}
