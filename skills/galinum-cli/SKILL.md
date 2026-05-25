---
name: galinum-cli
description: >
  Use the Galinum CLI as an agent inbox. Load this skill when an agent needs to
  install Galinum, identify itself, subscribe to a project invite, fetch durable
  messages, listen briefly for incoming messages, or manage local subscriptions.
license: Apache-2.0
metadata:
  author: Galinum
  source: https://github.com/Galinum/galinum-cli
  homepage: https://galinum.com
inputs:
  - name: GALINUM_INVITE_CODE
    description: Invite code from the operator or product prompt, formatted like inv_...
    required: false
---

# Galinum CLI

## Install

Check whether the CLI is already installed:

```bash
galinum help
```

If it is missing, install it:

```bash
curl -fsSL https://galinum.com/install.sh | bash
```

Fallback:

```bash
npm install -g @galinum/cli
```

## Agent Rules

- Run the commands yourself. Do not ask the operator to perform CLI setup.
- Never print `~/.galinum/config.json`, bearer keys, or full command output that contains secrets.
- Use `galinum fetch` for normal inbox checks. Messages are acknowledged after they are printed.
- Relay received message title, body, and payload as-is unless the operator asks you to summarize.
- Use `galinum listen` only when actively waiting for a specific message; do not leave it running indefinitely.
- If no subscription exists, ask for an invite code or use the invite code already present in the operator prompt.

## Setup

Identify this agent:

```bash
galinum identify --name "${AGENT_NAME:-agent}" --harness "${AGENT_HARNESS:-codex}"
```

Subscribe with an invite:

```bash
galinum subscribe <invite-code>
```

Verify inbox access:

```bash
galinum fetch
```

## Commands

| Command | Purpose |
| --- | --- |
| `galinum identify --name <name> [--harness <value>] [--reset]` | Create or replace this agent's stored identity. |
| `galinum subscribe <invite-code>` | Subscribe this agent to a project inbox. |
| `galinum subscriptions` | List local subscriptions. |
| `galinum unsubscribe <project-slug>` | Remove local credentials for one project. |
| `galinum fetch [project-slug]` | Fetch pending messages once. |
| `galinum listen [project-slug] [--interval-seconds 30]` | Poll repeatedly while the process runs. |
| `galinum status` | Inspect local identity and subscriptions without printing keys. |

## Common Issues

| Symptom | Action |
| --- | --- |
| `No subscriptions` | Run `galinum subscribe <invite-code>`. |
| `Invalid invite code` | Ask the operator for the exact `inv_...` code again. |
| Stored identity has no key | Run `galinum identify --reset --name "${AGENT_NAME:-agent}" --harness "${AGENT_HARNESS:-codex}"`. |
| `galinum` command not found after install | Restart the shell, then run `npm bin -g` or check the npm global prefix bin directory. |
