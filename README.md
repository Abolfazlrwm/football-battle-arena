# Football Battle Arena

A cinematic, premium football website where every club is presented as a
"Battle Team" led by its captain. Choose your team, meet its captain, and
enter the arena.

Inspired by the interaction model of [battle-arena-gules.vercel.app](https://battle-arena-gules.vercel.app/)
(a monochrome anime 1v1 judging arena) — reimagined for football, with
teams and captains instead of characters, and a visual comparison system
instead of an AI judge.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion / Motion (animation — added in Phase 05)
- Lucide React (icons — added in Phase 03)

## Project structure

```
src/
  app/            Routes (App Router)
  components/
    layout/       Shells, footer, page-level wrappers
    navigation/    Navbar, mobile menu
    hero/          Captain hero engine
    teams/         Team cards, directory, detail
    captains/      Captain gallery, detail
    battles/       Battle comparison system
    rankings/      Rankings table
    ui/            Reusable primitives (buttons, badges, cards)
  data/            Centralized team/captain/ranking/battle data
  lib/             Utilities
  types/           Shared TypeScript types
  hooks/           Shared React hooks
```

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

## Development plan

This project is being built in 20 reviewable phases (foundation → design
system → navigation → data model → hero → ... → final QA). Each phase
ends in its own commit. This repo currently contains **Phase 01 —
Project Foundation** only.

## Visual assets

### Team logos — `public/logos/{slug}.webp`
Every logo in the UI goes through `TeamLogo` (`src/components/teams/team-logo.tsx`).
It loads `/logos/{slug}.webp` and falls back to a generated vector crest
(`TeamCrest`) if the file is missing, so logos can be added one at a time.
Format: 256×256, transparent WebP, ~7–20 KB each. See `public/logos/README.md`
(including why images saved from a search page often carry a fake checkerboard).

### Captain portraits
Without a licensed photo, each captain gets a generated poster (`CaptainArt`):
team-colored light, a giant outlined shirt number, and the club crest as a
watermark. To use a real photo: put it at `public/captains/{slug}.webp`
(portrait ~4:5, ~800px wide) and add the slug to `CAPTAIN_PHOTO_SLUGS` in
`src/data/images.ts`. Nothing else changes.

### Formations — `src/lib/formations.ts`
Each team has a `formation` (`4-3-3`, `4-2-3-1`, `4-4-2`, `3-5-2`, `3-4-3`) drawn
on a tactical pitch by `FormationPitch`. The captain is placed on his real line
(optionally nudged by `roleHint: "deep" | "attacking" | "wide"` in
`src/data/captains.ts`); the other ten slots show roles only — we don't invent
players we have no data for. Formations are the arena's *signature shapes*, not
confirmed team sheets. To add a shape, add it to `FORMATION_LAYOUTS` and the
`Formation` type.

### Accent colors
`buildAccentVars()` (`src/lib/color.ts`) derives a usable accent per team:
`--accent` (brand), `--accent-readable` (lightened so text/lines/bars stay legible
on the near-black page — Tailwind: `text-accent-readable`, `bg-accent-readable`),
`--accent-strong`, `--accent-soft`, `--accent-contrast`.

## Leagues, clubs & features (v3)

**24 clubs across 6 leagues, four each** — Premier League, La Liga, Bundesliga, Serie A,
Ligue 1, Primeira Liga. Clubs live in `src/data/teams.ts`, captains in
`src/data/captains.ts` (verified against 2026/27 sources — re-check each season, armbands
change), leagues in `src/data/leagues.ts`. Adding a club is one entry in each of the first
two files; add its `{slug}.webp` to `public/logos/` when you have the logo.

| Route | What it does |
|---|---|
| `/leagues`, `/leagues/[slug]` | League hubs: average ratings, clubs ranked, and a **season simulator** (full home-and-away table) |
| `/tournament` | **Arena Cup**: seeded or random 8/16-club knockout with extra time and penalties |
| `/battles` | Any two clubs: verdict, playable match, **Arena Odds** (2,000-run Monte-Carlo), radar chart. The URL is shareable (`?a=napoli&b=juventus`) |
| `/rankings` | Sortable by rating / attack / midfield / defense / trophies, filterable by country |

All results are simulated from the arena's own illustrative ratings (`src/lib/simulate-match.ts`:
Poisson goals around an attack-vs-defense expected-goals estimate) — never real fixtures,
results, or predictions.

### Logo manifest
`npm run dev` / `npm run build` first run `scripts/gen-logo-manifest.mjs`, which writes
`src/data/logos.generated.ts` from the files in `public/logos/`. The app only requests logos
that exist; clubs without one show a generated crest. After adding a logo, restart `npm run dev`.
