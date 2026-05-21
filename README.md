# galinum-cli

> Universal agent inbox. Any product can send messages through the Galinum SDK; any agent can read them through this CLI.

[![npm version](https://img.shields.io/npm/v/@galinum/cli.svg)](https://www.npmjs.com/package/@galinum/cli)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![CI](https://github.com/Galinum/galinum-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/Galinum/galinum-cli/actions/workflows/ci.yml)

Agents typically have no inbox. They run, they exit, and any message that arrives in between is lost.

`galinum` gives every agent a durable inbox. Products publish messages through the Galinum SDK, the CLI polls or listens, and the agent reads them on the next turn. Works in any harness — Claude Code, Codex, your own runtime.

## Install

```bash
npm install -g @galinum/cli
```

Requires Node.js 20 or later. Written in TypeScript; zero runtime dependencies.

## Quick start

```bash
# 1. Create an identity for this agent (stored in ~/.galinum/config.json)
galinum identify --name "my-agent" --harness codex

# 2. Subscribe using an invite code from a product
galinum subscribe inv_xxxxxxxxxxxxxxxx

# 3. Read pending messages
galinum fetch

# Or keep listening
galinum listen
```

## Commands

### `identify`

Create and store this agent's Galinum identity.

```bash
galinum identify --name <name> [--harness <value>] [--email <email>] [--reset]
```

| Flag | Meaning |
| --- | --- |
| `--name` | Human-readable agent name. |
| `--harness` | The runtime this agent runs in (`claude-code`, `codex`, `custom`, …). |
| `--email` | Optional contact email. |
| `--reset` | Replace an existing stored identity. |

### `subscribe`

Subscribe to an organization's inbox using an invite code.

```bash
galinum subscribe <invite-code>
```

Invite codes follow the format `inv_<16-128 url-safe chars>`.

### `subscriptions`

List local subscriptions.

```bash
galinum subscriptions
```

### `unsubscribe`

Remove a local subscription.

```bash
galinum unsubscribe <organization-slug>
```

### `fetch`

Fetch pending messages once. Messages are acknowledged after they are printed.

```bash
galinum fetch [organization-slug]
```

### `listen`

Continuously poll for new messages.

```bash
galinum listen [organization-slug] [--interval-seconds 30]
```

`Ctrl+C` stops cleanly.

## Global flags

| Flag | Purpose |
| --- | --- |
| `--config <path>` | Override config location (default: `~/.galinum/config.json`). |
| `--base-url <url>` | Override the Galinum API base URL (useful for staging). |

## Configuration

The CLI stores state in `~/.galinum/config.json` (file mode `0600`, directory mode `0700`):

```json
{
  "agent": {
    "id": "agt_…",
    "name": "my-agent",
    "harness": "codex",
    "contact_email": null,
    "key": "<bearer key>"
  },
  "subscriptions": [
    {
      "org": "acme",
      "baseUrl": "https://galinum.com",
      "inboxId": "ibx_…",
      "key": "<bearer key>"
    }
  ]
}
```

The `key` fields are bearer tokens — treat the file like an SSH key.

## Integrating with agent harnesses

`galinum fetch` exits cleanly when there are no pending messages, so it's safe to call frequently from a session-start or pre-task hook. Example:

```bash
# In your agent's startup hook
galinum fetch --quiet || true
```

Long-running agents can run `galinum listen` in the background and pipe its output into the conversation.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports and small PRs welcome.

## License

[Apache-2.0](LICENSE) © Galinum
