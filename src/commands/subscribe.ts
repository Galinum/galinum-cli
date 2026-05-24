import { INVITE_CODE_REGEX } from "../constants.js";
import { normalizeBaseUrl, requestJson } from "../api.js";
import { loadConfig, saveConfig } from "../config.js";
import { ensureIdentified } from "../agent.js";
import type { ParsedArgs } from "../types.js";

interface SubscribeResponse {
  id?: string;
  key?: string;
  project?: { id?: string };
}

export async function subscribe(args: ParsedArgs): Promise<void> {
  const inviteCode = args._[1];
  if (!inviteCode) {
    throw new Error("Invite code is required. Usage: galinum subscribe <invite-code>");
  }
  if (!INVITE_CODE_REGEX.test(inviteCode)) {
    throw new Error(
      `Invalid invite code "${inviteCode}". Expected format: inv_<16-128 url-safe chars>.`,
    );
  }

  const baseUrl = normalizeBaseUrl(args["base-url"]);
  const config = await loadConfig(args);
  const agent = await ensureIdentified(args, config);

  const data = (await requestJson(`${baseUrl}/api/agent-inboxes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${agent.key}` },
    body: JSON.stringify({ invite_code: inviteCode }),
  })) as SubscribeResponse | null;

  const project = data?.project?.id;
  if (!project || !data?.id || !data?.key) {
    throw new Error("Server response missing inbox credentials");
  }

  const existing = config.subscriptions.findIndex((s) => s.project === project);
  if (existing !== -1) config.subscriptions.splice(existing, 1);

  config.subscriptions.push({
    project,
    baseUrl,
    inboxId: data.id,
    key: data.key,
  });

  const file = await saveConfig(args, config);

  console.log(`Subscribed to ${project}.`);
  console.log(`Inbox ID: ${data.id}`);
  console.log(`Config: ${file}`);
}
