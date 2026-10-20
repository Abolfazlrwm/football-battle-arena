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
