import type { Battle } from "@/types";

/**
 * Curated matchups for the battle comparison system (Phases 11/12).
 * These are visual stat comparisons, not real match predictions or
 * results — see the master spec's BATTLE SYSTEM section.
 */
export const battles: Battle[] = [
  {
    id: "real-madrid-vs-barcelona",
    slug: "real-madrid-vs-barcelona",
    teamAId: "real-madrid",
    teamBId: "barcelona",
    tagline: "El Clásico",
    featured: true,
  },
  {
    id: "inter-milan-vs-ac-milan",
    slug: "inter-milan-vs-ac-milan",
    teamAId: "inter-milan",
    teamBId: "ac-milan",
    tagline: "Derby della Madonnina",
    featured: true,
  },
  {
    id: "manchester-city-vs-liverpool",
    slug: "manchester-city-vs-liverpool",
    teamAId: "manchester-city",
    teamBId: "liverpool",
    tagline: "Premier League Summit",
    featured: true,
  },
  {
    id: "bayern-munich-vs-borussia-dortmund",
    slug: "bayern-munich-vs-borussia-dortmund",
    teamAId: "bayern-munich",
    teamBId: "borussia-dortmund",
    tagline: "Der Klassiker",
    featured: true,
  },
  {
    id: "manchester-united-vs-arsenal",
    slug: "manchester-united-vs-arsenal",
    teamAId: "manchester-united",
    teamBId: "arsenal",
    tagline: "England's Old Guard",
    featured: false,
  },
  {
    id: "psg-vs-juventus",
    slug: "psg-vs-juventus",
    teamAId: "psg",
    teamBId: "juventus",
    tagline: "European Giants",
    featured: false,
  },
];

export function getBattleBySlug(slug: string): Battle | undefined {
  return battles.find((b) => b.slug === slug);
}

export function getFeaturedBattles(): Battle[] {
  return battles.filter((b) => b.featured);
}
