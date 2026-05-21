import { loadConfig } from "../config.js";
import type { ParsedArgs } from "../types.js";

export async function listSubscriptions(args: ParsedArgs): Promise<void> {
  const config = await loadConfig(args);
  if (config.subscriptions.length === 0) {
    console.log("No subscriptions. Use `galinum subscribe <invite-code>` to add one.");
    return;
  }
  for (const sub of config.subscriptions) {
    console.log(`${sub.org}\t${sub.inboxId}\t${sub.baseUrl}`);
  }
}
