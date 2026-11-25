# Changelog

All notable changes to this project are documented in this file. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and versions follow [Semantic Versioning](https://semver.org/).

## [0.2.0] - 2026-11-25

### Changed

- Every club logo is now a true 256×256 transparent WebP. Twelve files had
  drifted from the documented spec — five were misnamed PNGs (the largest,
  Benfica's, weighed 642 KB), and several others carried a baked-in white
  or checkerboard background. All are rebuilt to the spec and now weigh
  6–17 KB.

### Removed

- The leftover placeholder-image pipeline: `Team.logo`, `Team.heroImage`
  and `Captain.image` carried placehold.co URLs that nothing in the UI
  read anymore (crests and captain posters are generated from team
  colors), and `next.config.ts` kept a `remotePatterns` entry only for
  them.
- Dead code: the unused `getRankingsByRegion` export, the public
  `normalize` export in the search index (used only in its own file), the
  empty `src/hooks/` directory, and stale `.gitkeep` files in directories
  that have long since been populated.
- The orphan `public/logos/juventus.jpeg` (the `.webp` is canonical).

### Fixed

- Internal comments still described an unbuilt roadmap — references to a
  "master spec" and to numbered phases that had already shipped were
  rewritten to describe the code as it is now.
- CI pins `actions/setup-node` to v5 to match `actions/checkout@v7`, and
  the project declares its Node.js engine requirement (>=20.9.0, the
  Next.js 16 floor) in `package.json`.
- `vitest.config` is now ESM (`.mts`), clearing the config-loading
  warning in test output.

## [0.1.0] - 2026-11-04

### Added

- Initial public release: 24 clubs across 6 leagues with captain profiles
  and formation pitches; the battle comparison system with a verdict
  calculator, a playable Poisson match simulator and 2,000-run Monte-Carlo
  Arena Odds; the Arena Cup knockout bracket with extra time and
  penalties; a full home-and-away season simulator; sortable, filterable
  rankings; global search (Cmd/Ctrl+K); sitemap, robots and OG metadata.
- 22 Vitest unit tests over the core logic (verdict math, match and
  knockout simulation, season table, classname utility) and a
  lint/test/build CI pipeline.
