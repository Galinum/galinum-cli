import { requestJson } from "./api.js";
import type { InboxMessage, Subscription } from "./types.js";

export function printMessage(orgSlug: string, message: InboxMessage): void {
  console.log("");
  console.log(`[${orgSlug}] [${message.created_at}] ${message.title}`);
  console.log(`Type: ${message.type}`);
  console.log(message.body);
  if (message.payload !== null && message.payload !== undefined) {
    console.log("Payload:");
    console.log(JSON.stringify(message.payload, null, 2));
  }
}

async function ackMessages(subscription: Subscription, messageIds: string[]): Promise<void> {
  if (messageIds.length === 0) return;
  const url = `${subscription.baseUrl}/api/agent-inbox/messages?inbox_id=${encodeURIComponent(subscription.inboxId)}`;
  await requestJson(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${subscription.key}` },
    body: JSON.stringify({ message_ids: messageIds }),
  });
}

export async function fetchSubscription(
  subscription: Subscription,
  quiet: boolean,
): Promise<number> {
  const url = `${subscription.baseUrl}/api/agent-inbox/messages?inbox_id=${encodeURIComponent(subscription.inboxId)}`;
  const data = (await requestJson(url, {
    headers: { Authorization: `Bearer ${subscription.key}` },
  })) as { messages?: InboxMessage[] } | null;

  const messages = Array.isArray(data?.messages) ? data.messages : [];
  if (messages.length === 0) {
    if (!quiet) console.log(`[${subscription.org}] No pending messages.`);
    return 0;
  }
  for (const message of messages) printMessage(subscription.org, message);
  await ackMessages(
    subscription,
    messages.map((m) => m.id),
  );
  return messages.length;
}
