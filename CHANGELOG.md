# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Switched repository dependency management from npm to pnpm.

## [0.1.1] - 2026-05-21

### Added

- Initial release. Written in TypeScript, zero runtime dependencies.
- Commands: `identify`, `subscribe`, `subscriptions`, `unsubscribe`, `fetch`, `listen`.
- Durable inbox config stored in `~/.galinum/config.json` (file mode `0600`, dir mode `0700`).
