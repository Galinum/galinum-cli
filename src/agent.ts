import { normalizeBaseUrl, requestJson } from "./api.js";
import { saveConfig } from "./config.js";
import type { AgentIdentity, Config, IdentifyPayload, ParsedArgs } from "./types.js";

export function agentPayload(args: ParsedArgs): IdentifyPayload {
  return {
    name: typeof args.name === "string" ? args.name : "agent",
    harness: typeof args.harness === "string" ? args.harness : null,
  };
}

export function sameAgentMetadata(agent: AgentIdentity, payload: IdentifyPayload): boolean {
  return (
    agent.name === payload.name &&
    (agent.harness ?? null) === payload.harness
  );
}

export async function createAgent(
  args: ParsedArgs,
  payload: IdentifyPayload,
): Promise<AgentIdentity> {
  const baseUrl = normalizeBaseUrl(args["base-url"]);
  const data = (await requestJson(`${baseUrl}/api/agents/identify`, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as Partial<AgentIdentity> | null;

  if (!data?.id || !data?.name || !data?.key) {
    throw new Error("Server response missing agent identity");
  }
  return {
    id: data.id,
    name: data.name,
    harness: data.harness ?? null,
    key: data.key,
  };
}

export async function ensureIdentified(
  args: ParsedArgs,
  config: Config,
): Promise<AgentIdentity> {
  if (config.agent?.key) return config.agent;
  if (config.agent) {
    throw new Error(
      `Stored identity ${config.agent.id} has no agent key. Re-run \`galinum identify --reset\` to create a new identity.`,
    );
  }
  config.agent = await createAgent(args, agentPayload({ ...args, name: "agent", _: args._ }));
  await saveConfig(args, config);
  console.log(`Identified as ${config.agent.id}.`);
  return config.agent;
}
