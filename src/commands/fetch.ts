import { loadConfig } from "../config.js";
import { fetchSubscription } from "../messages.js";
import type { ParsedArgs } from "../types.js";

export async function fetchMessages(args: ParsedArgs): Promise<number> {
  const projectSlug = args._[1];
  const quiet = args.quiet === true;
  const config = await loadConfig(args);

  if (config.subscriptions.length === 0) {
    if (!quiet) {
      console.log("No subscriptions. Use `galinum subscribe <invite-code>` first.");
    }
    return 0;
  }
  const targets = projectSlug
    ? config.subscriptions.filter((s) => s.project === projectSlug)
    : config.subscriptions;
  if (targets.length === 0) {
    if (!quiet) console.log(`Not subscribed to "${projectSlug}".`);
    return 0;
  }
  let total = 0;
  for (const sub of targets) {
    total += await fetchSubscription(sub, quiet);
  }
  return total;
}
