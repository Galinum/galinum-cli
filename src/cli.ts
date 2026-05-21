import { invocationName, parseArgs } from "./args.js";
import { identify } from "./commands/identify.js";
import { subscribe } from "./commands/subscribe.js";
import { listSubscriptions } from "./commands/subscriptions.js";
import { unsubscribe } from "./commands/unsubscribe.js";
import { fetchMessages } from "./commands/fetch.js";
import { listen } from "./commands/listen.js";
import type { ParsedArgs } from "./types.js";

function usage(): void {
  const bin = invocationName();
  console.log(`Usage:
  ${bin} identify --name name [--harness value] [--email email] [--reset]
  ${bin} subscribe <invite-code>
  ${bin} subscriptions
  ${bin} unsubscribe <organization-slug>
  ${bin} fetch [organization-slug]
  ${bin} listen [organization-slug] [--interval-seconds 30]

Commands:
  identify       Create and store this agent's Galinum identity.
  subscribe      Subscribe to an organization using an invite code.
  subscriptions  List local subscriptions.
  unsubscribe    Remove a local subscription.
  fetch          Fetch pending messages once (all subscriptions, or one).
  listen         Repeatedly fetch new messages on an interval.

Global flags:
  --config <path>      Override config location (default: ~/.galinum/config.json).
  --base-url <url>     Override Galinum API base URL.
`);
}

type CommandHandler = (args: ParsedArgs) => Promise<unknown>;

const COMMANDS: Record<string, CommandHandler> = {
  identify,
  subscribe,
  subscriptions: listSubscriptions,
  unsubscribe,
  fetch: fetchMessages,
  listen,
};

export async function run(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  const command = args._[0];

  if (!command || command === "help" || args.help) {
    usage();
    return;
  }

  const handler = COMMANDS[command];
  if (!handler) {
    usage();
    process.exitCode = 1;
    return;
  }

  await handler(args);
}
