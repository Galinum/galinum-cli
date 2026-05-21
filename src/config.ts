import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { configPath } from "./args.js";
import type { AgentIdentity, Config, ParsedArgs, Subscription } from "./types.js";

function emptyConfig(): Config {
  return { subscriptions: [] };
}

function normalizeAgent(agent: unknown): AgentIdentity | null {
  if (!agent || typeof agent !== "object") return null;
  const a = agent as Record<string, unknown>;
  if (typeof a.id !== "string" || typeof a.name !== "string") return null;
  return {
    id: a.id,
    name: a.name,
    harness: typeof a.harness === "string" ? a.harness : null,
    contact_email: typeof a.contact_email === "string" ? a.contact_email : null,
    key: typeof a.key === "string" ? a.key : null,
  };
}

function normalizeConfig(parsed: unknown): Config {
  const p = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;
  const subscriptions = Array.isArray(p.subscriptions)
    ? (p.subscriptions as Subscription[])
    : [];
  const config: Config = { subscriptions };
  const agent = normalizeAgent(p.agent);
  if (agent) config.agent = agent;
  return config;
}

export async function loadConfig(args: ParsedArgs): Promise<Config> {
  const file = configPath(args);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8"));
    return normalizeConfig(parsed);
  } catch {
    return emptyConfig();
  }
}

export async function saveConfig(args: ParsedArgs, config: Config): Promise<string> {
  const file = configPath(args);
  // Restrict permissions — config holds bearer tokens.
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  return file;
}
