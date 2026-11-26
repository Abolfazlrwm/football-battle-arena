# Changelog

All notable changes to this project are documented in this file. The
format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and versions follow [Semantic Versioning](https://semver.org/).

## [0.3.0] - 2026-11-26

### Added

- A real quality gate around the codebase: the unit suite grew from 22 to
  88 tests and is now coverage-gated (~97% statements over the pure lib
  core, 100% over the datasets). New suites cover the accent-color
  system, formation geometry, the search index, the tournament bracket,
  the knockout/odds simulator, and dataset integrity (unique slugs,
  two-way captain/team links, on-disk logos, the generated manifest
  matching the data).
- A Playwright smoke suite — eight checks against the production build
  covering every route group, a team and captain detail page, and the
  themed 404.
- Release automation: pushing a `v*` tag re-runs the full verification,
  builds, and publishes a GitHub release with notes extracted from the
  matching CHANGELOG section.
- Security scanning: CodeQL on push, PR, and a weekly schedule;
  dependency review on pull requests.
- A 1200×630 social card (`public/og.png`) wired into the Open Graph and
  Twitter metadata — link shares previously rendered with no image.
- Community health files: `SUPPORT.md`, `CODEOWNERS`, an issue-template
  config that routes questions to Discussions, and `.editorconfig`.

### Changed

- CI's single verify job became parallel, independent gates — lint,
  typecheck, unit tests, build, e2e — so a lint slip no longer waits
  behind a full build, and the unit-test job publishes its coverage
  report as an artifact.
- `npm run verify` (lint + typecheck + coverage) is the single
  pre-push check; commits run `eslint --fix` on staged files via husky
  and lint-staged.
- tsconfig: `forceConsistentCasingInFileNames`, `noFallthroughCasesInSwitch`
  and `noImplicitOverride` are on. `noUncheckedIndexedAccess` was
  evaluated and deliberately deferred — it surfaces ~149 call sites
  that want guard refactoring, which deserves its own pass.

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
