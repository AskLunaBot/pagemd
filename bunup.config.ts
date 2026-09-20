import { chmod } from "node:fs/promises";

import { defineConfig } from "bunup";

export default defineConfig([
  {
    name: "node",
    entry: "src/index.ts",
    sourceBase: "./src",
    format: "esm",
    target: "node",
    splitting: false,
    packages: "bundle",
    minify: false,
    dts: true,
    clean: true,
  },
  {
    name: "browser",
    entry: "src/browser.ts",
    sourceBase: "./src",
    format: "esm",
    target: "browser",
    splitting: false,
    packages: "bundle",
    minify: false,
    dts: false,
    clean: false,
  },
  {
    name: "cli",
    entry: "src/cli/cli.ts",
    sourceBase: "./src/cli",
    format: "esm",
    target: "node",
    splitting: false,
    packages: "bundle",
    minify: false,
    dts: false,
    clean: false,
    banner: "#!/usr/bin/env node",
    onSuccess: async (): Promise<void> => {
      await chmod("dist/cli.js", 0o755);
    },
  },
]);
