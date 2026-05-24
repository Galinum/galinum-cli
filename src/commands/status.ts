import { configPath } from "../args.js";
import { loadConfig } from "../config.js";
import type { ParsedArgs } from "../types.js";

function padLabel(label: string, width = 9): string {
  return label.length >= width ? `${label} ` : label.padEnd(width);
}

export async function status(args: ParsedArgs): Promise<void> {
  const file = configPath(args);
  const config = await loadConfig(args);

  console.log(`Config: ${file}`);
  console.log("");

  if (!config.agent) {
    console.log("Agent identity: none. Run `galinum identify --name <name>` to create one.");
  } else {
    console.log("Agent identity:");
    console.log(`  ${padLabel("id")}${config.agent.id}`);
    console.log(`  ${padLabel("name")}${config.agent.name}`);
    console.log(`  ${padLabel("harness")}${config.agent.harness ?? "(none)"}`);
    console.log(`  ${padLabel("key")}${config.agent.key ? "present" : "missing"}`);
  }

  console.log("");

  if (config.subscriptions.length === 0) {
    console.log("Subscriptions: none. Run `galinum subscribe <invite-code>` to add one.");
    return;
  }

  console.log(`Subscriptions (${config.subscriptions.length}):`);
  for (const sub of config.subscriptions) {
    console.log(`  ${sub.org}\t${sub.inboxId}\t${sub.baseUrl}`);
  }
}
