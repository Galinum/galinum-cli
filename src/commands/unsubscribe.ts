import { loadConfig, saveConfig } from "../config.js";
import type { ParsedArgs } from "../types.js";

export async function unsubscribe(args: ParsedArgs): Promise<void> {
  const projectSlug = args._[1];
  if (!projectSlug) {
    throw new Error("Project slug is required. Usage: galinum unsubscribe <slug>");
  }
  const config = await loadConfig(args);
  const idx = config.subscriptions.findIndex((s) => s.project === projectSlug);
  if (idx === -1) {
    console.log(`Not subscribed to "${projectSlug}".`);
    return;
  }
  config.subscriptions.splice(idx, 1);
  await saveConfig(args, config);
  console.log(`Unsubscribed from ${projectSlug}.`);
}
