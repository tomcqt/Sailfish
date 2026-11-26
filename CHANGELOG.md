# Changelog

All notable changes to Sailfish are documented here.
The format follows Keep a Changelog, and the project uses Semantic Versioning.

## [0.0.5] - 2026-11-20

### Added

- Service worker that routes proxied requests.
- ProxyService: Scramjet controller with a libcurl transport.

## [0.0.4] - 2026-11-19

### Added

- Wisp in the Vite dev server.
- Scramjet and controller runtime served at fixed paths and loaded before the app.

## [0.0.3] - 2026-11-18

### Added

- Fastify production server with SPA fallback.
- Wisp WebSocket endpoint at /wisp/.

## [0.0.2] - 2026-11-18

### Added

- `@/` import alias, Vitest with jsdom, Prettier and ESLint rules.
- Continuous integration on GitHub Actions.

## [0.0.1] - 2026-11-18

### Added

- Project scaffold (Vite, React, TypeScript)
- AGPL-3.0 license, README, and changelog.

## [Unreleased]

### Added

- Fastify server with a Wisp endpoint at /wisp/.
- Service worker and Scramjet controller with a libcurl transport.
- PoC page that loads sites through the proxy.
- Input normalizing for the omnibar.
