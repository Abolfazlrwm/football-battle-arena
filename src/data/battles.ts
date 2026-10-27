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
  {
    id: "atletico-madrid-vs-real-madrid",
    slug: "atletico-madrid-vs-real-madrid",
    teamAId: "atletico-madrid",
    teamBId: "real-madrid",
    tagline: "Madrid Derby",
    featured: true,
  },
  {
    id: "benfica-vs-sporting-cp",
    slug: "benfica-vs-sporting-cp",
    teamAId: "benfica",
    teamBId: "sporting-cp",
    tagline: "Lisbon Derby",
    featured: true,
  },
  {
    id: "marseille-vs-psg",
    slug: "marseille-vs-psg",
    teamAId: "marseille",
    teamBId: "psg",
    tagline: "Le Classique",
    featured: true,
  },
  {
    id: "real-madrid-vs-manchester-city",
    slug: "real-madrid-vs-manchester-city",
    teamAId: "real-madrid",
    teamBId: "manchester-city",
    tagline: "Champions League Heavyweights",
    featured: true,
  },
  {
    id: "porto-vs-benfica",
    slug: "porto-vs-benfica",
    teamAId: "porto",
    teamBId: "benfica",
    tagline: "O Clássico",
    featured: false,
  },
  {
    id: "napoli-vs-juventus",
    slug: "napoli-vs-juventus",
    teamAId: "napoli",
    teamBId: "juventus",
    tagline: "Serie A Showdown",
    featured: false,
  },
  {
    id: "bayer-leverkusen-vs-rb-leipzig",
    slug: "bayer-leverkusen-vs-rb-leipzig",
    teamAId: "bayer-leverkusen",
    teamBId: "rb-leipzig",
    tagline: "Bundesliga Contenders",
    featured: false,
  },
  {
    id: "lyon-vs-monaco",
    slug: "lyon-vs-monaco",
    teamAId: "lyon",
    teamBId: "monaco",
    tagline: "Ligue 1 Contenders",
    featured: false,
  },
  {
    id: "athletic-club-vs-sc-braga",
    slug: "athletic-club-vs-sc-braga",
    teamAId: "athletic-club",
    teamBId: "sc-braga",
    tagline: "Dark Horse Duel",
    featured: false,
  },
];

export function getBattleBySlug(slug: string): Battle | undefined {
  return battles.find((b) => b.slug === slug);
}

export function getFeaturedBattles(): Battle[] {
  return battles.filter((b) => b.featured);
}
