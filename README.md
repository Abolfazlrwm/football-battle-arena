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
