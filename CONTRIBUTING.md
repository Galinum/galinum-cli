# Contributing

Thanks for your interest in improving `galinum-cli`.

## Development

```bash
git clone https://github.com/Galinum/galinum-cli.git
cd galinum-cli
pnpm install
pnpm test
```

The CLI has zero **runtime** dependencies; dev dependencies are managed with pnpm. Build once, then run directly:

```bash
pnpm build
node dist/bin.js help
```

## Project layout

```
src/bin.ts              Entry point — shebang shim that invokes cli.ts.
src/cli.ts              Arg parsing and command dispatch.
src/commands/           One file per CLI command.
src/api.ts              HTTP wrapper (fetch + error type).
src/config.ts           Read/write ~/.galinum/config.json.
src/agent.ts            Identify and ensure-identified flows.
src/messages.ts         Fetch and ack helpers.
src/constants.ts        Default URLs, paths, regexes.
src/args.ts             Argv parser.
src/types.ts            Shared interfaces.
test/                   node --test suites.
dist/                   Compiled output (gitignored, published to npm).
```

## Build pipeline

- `pnpm build` — compile `src/` → `dist/` and mark the bin executable.
- `pnpm typecheck` — type-check without emitting.
- `pnpm test` — compile `src/` + `test/` and run the node test runner.
- `npm publish` automatically runs `prepublishOnly` (test + build) before uploading.

## Pull requests

- Keep changes focused — one concern per PR.
- Match the existing style: double quotes, semicolons, strict TypeScript, no comments unless intent isn't obvious from the code.
- Add a test if you change a parser or a command's behavior.
- Update `CHANGELOG.md` under `## [Unreleased]`.

## Reporting issues

Open a GitHub issue at <https://github.com/Galinum/galinum-cli/issues>. Include:

- The command you ran.
- Your Node.js version (`node --version`).
- The exact output (redact bearer keys from `~/.galinum/config.json` if you paste config).

## Releases

Maintainers cut releases by tagging `vX.Y.Z` on `main`. The release workflow runs typecheck + tests + build, then publishes to npm with provenance.
