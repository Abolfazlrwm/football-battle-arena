# Contributing to Football Battle Arena

Thanks for considering a contribution! This project follows a few simple
rules that keep it healthy. Please read this before opening a pull request.

## How to contribute

1. **Open an issue first** for anything bigger than a typo — describe the
   problem or the feature so we can agree on the approach before code is written.
2. **Fork the repo** and create a topic branch from `main`:
   `git checkout -b feat/my-change`
3. **Make your change** with focused commits (one logical change per commit).
4. **Add or update tests** for anything you change. A fix without a test
   that reproduces the bug will likely be asked for one.
5. **Run the checks below locally** and make sure they pass.
6. **Open a pull request** with a short description: what changed, why,
   and how you tested it.

## Project setup & checks

The site is a Next.js (App Router) + TypeScript app:

```bash
npm ci                 # install exactly what the lockfile pins
npm run dev            # local dev server
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm test               # vitest unit tests
npm run test:coverage  # unit tests, gated by coverage thresholds
npm run build          # production build
npm run test:e2e       # Playwright smoke suite (run `npm run build` first)
npm run verify         # lint + typecheck + coverage in one go
```

CI runs lint, typecheck, coverage-gated unit tests, the production build,
and the e2e suite as separate jobs — `npm run verify` covers the first
three locally if you want a single pre-push check.

## Ground rules

- Keep the public behavior stable unless the issue explicitly calls for a change.
- Match the existing code style; don't mix reformatting with functional changes.
- Write commit messages in the imperative mood, e.g. `fix: handle empty payload`.
- New dependencies need a justification in the PR description.

## Releases

Releases are tags, not branches. When a version is ready:

1. Update `CHANGELOG.md` with a `## [x.y.z] - YYYY-MM-DD` section describing
   the notable changes.
2. Bump `"version"` in `package.json` and commit (e.g. `chore: release v0.3.0`).
3. Tag and push: `git tag -a vX.Y.Z -m "vX.Y.Z" && git push origin vX.Y.Z`.

The tag triggers the release workflow (`.github/workflows/release.yml`),
which re-runs the full verification, builds, and publishes the GitHub
release with the notes extracted from the CHANGELOG section you wrote —
so an entry there is what users actually see on the release page.

## Reporting bugs

Use the bug report issue template and include reproduction steps, the
expected behavior, and your environment. The more reproducible the report,
the faster the fix.
