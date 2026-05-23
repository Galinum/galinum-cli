export interface AgentIdentity {
  id: string;
  name: string;
  harness: string | null;
  key: string | null;
}

export interface Subscription {
  org: string;
  baseUrl: string;
  inboxId: string;
  key: string;
}

export interface Config {
  agent?: AgentIdentity;
  subscriptions: Subscription[];
}

export interface ParsedArgs {
  _: string[];
  [key: string]: string | boolean | string[] | undefined;
}

export interface InboxMessage {
  id: string;
  type: string;
  title: string;
  body: string;
  payload: unknown;
  created_at: string;
}

export interface IdentifyPayload {
  name: string;
  harness: string | null;
}
