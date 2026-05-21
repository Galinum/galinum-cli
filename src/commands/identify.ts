import { configPath } from "../args.js";
import { loadConfig, saveConfig } from "../config.js";
import { agentPayload, createAgent, sameAgentMetadata } from "../agent.js";
import type { AgentIdentity, ParsedArgs } from "../types.js";

export async function identify(args: ParsedArgs): Promise<AgentIdentity> {
  const config = await loadConfig(args);
  const payload = agentPayload(args);

  if (config.agent && !args.reset) {
    if (!config.agent.key) {
      throw new Error(
        `Stored identity ${config.agent.id} predates agent auth and has no key. Re-run with --reset to create a new identity.`,
      );
    }
    if (sameAgentMetadata(config.agent, payload)) {
      console.log(`Already identified as ${config.agent.id}.`);
      return config.agent;
    }
    throw new Error(
      `Already identified as ${config.agent.id}. To update metadata, edit ${configPath(args)} or re-run with --reset.`,
    );
  }

  config.agent = await createAgent(args, payload);
  const file = await saveConfig(args, config);

  console.log(`Identified as ${config.agent.id}.`);
  console.log(`Config: ${file}`);
  return config.agent;
}
