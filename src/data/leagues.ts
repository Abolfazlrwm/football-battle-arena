import type { League } from "@/types";

/**
 * The six leagues in the arena, in display order. `name` must match
 * `Team.league` exactly — teams are grouped by it everywhere.
 */
export const leagues: League[] = [
  {
    id: "premier-league",
    slug: "premier-league",
    name: "Premier League",
    country: "England",
    region: "England",
    tagline: "The most-watched league on earth",
    description:
      "England's top flight: relentless pace, deep squads, and the deepest broadcast audience in club football.",
  },
  {
    id: "la-liga",
    slug: "la-liga",
    name: "La Liga",
    country: "Spain",
    region: "Spain",
    tagline: "Technique, tradition, and two giants",
    description:
      "Spain's top flight, home to the Madrid–Barcelona rivalry and a tradition of technical, possession-minded football.",
  },
  {
    id: "bundesliga",
    slug: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    region: "Germany",
    tagline: "Packed stadiums, fast transitions",
    description:
      "Germany's top flight: the best-attended stadiums in Europe, fan ownership, and a reputation for high-tempo attacking play.",
  },
  {
    id: "serie-a",
    slug: "serie-a",
    name: "Serie A",
    country: "Italy",
    region: "Italy",
    tagline: "Tactics first",
    description:
      "Italy's top flight: a league that prizes tactical discipline, with some of the continent's most decorated clubs.",
  },
  {
    id: "ligue-1",
    slug: "ligue-1",
    name: "Ligue 1",
    country: "France",
    region: "France",
    tagline: "Talent factory",
    description:
      "France's top flight: a deep academy culture that supplies Europe's biggest clubs with young talent.",
  },
  {
    id: "primeira-liga",
    slug: "primeira-liga",
    name: "Primeira Liga",
    country: "Portugal",
    region: "Portugal",
    tagline: "The big three and their rivals",
    description:
      "Portugal's top flight, dominated by Benfica, Porto, and Sporting — a proven pipeline for emerging talent.",
  },
];

export function getLeagueBySlug(slug: string): League | undefined {
  return leagues.find((l) => l.slug === slug);
}

export function getLeagueByName(name: string): League | undefined {
  return leagues.find((l) => l.name === name);
}
