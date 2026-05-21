import { loadConfig, saveConfig } from "../config.js";
import type { ParsedArgs } from "../types.js";

export async function unsubscribe(args: ParsedArgs): Promise<void> {
  const orgSlug = args._[1];
  if (!orgSlug) {
    throw new Error("Organization slug is required. Usage: galinum unsubscribe <slug>");
  }
  const config = await loadConfig(args);
  const idx = config.subscriptions.findIndex((s) => s.org === orgSlug);
  if (idx === -1) {
    console.log(`Not subscribed to "${orgSlug}".`);
    return;
  }
  config.subscriptions.splice(idx, 1);
  await saveConfig(args, config);
  console.log(`Unsubscribed from ${orgSlug}.`);
}
