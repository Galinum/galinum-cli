import path from "node:path";
import { DEFAULT_CONFIG_PATH } from "./constants.js";
import type { ParsedArgs } from "./types.js";

export function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) {
      args._.push(arg);
      continue;
    }

    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }

    args[key] = next;
    i += 1;
  }
  return args;
}

export function invocationName(): string {
  const argv1 = process.argv[1] ?? "";
  const argv0 = process.argv[0] ?? "";
  const executable = path.basename(argv0);
  if (argv1.includes("/snapshot/") && executable && executable !== "node") {
    return executable;
  }
  const base = path.basename(argv1);
  if (base === "galinum" || base === "galinum-cli") return base;
  return `node ${argv1}`;
}

export function configPath(args: ParsedArgs): string {
  return typeof args.config === "string" ? args.config : DEFAULT_CONFIG_PATH;
}
