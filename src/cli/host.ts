export type CliHost = {
  readonly cwd: string;
  readonly stdin: string;
  readonly stdinIsTty: boolean;
  readonly readFile: (path: string) => Promise<string>;
};
