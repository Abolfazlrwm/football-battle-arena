import type { RankingEntry, RankingRegion } from "@/types";
import { teams } from "./teams";

/**
 * Rankings are derived from each team's arena `stats.overall` rating —
 * they are the site's own comparison ranking (see the master spec's
 * RANKINGS section), not an official league table or world ranking.
 */

const COUNTRY_REGION: Record<string, RankingRegion> = {
  England: "England",
  Spain: "Spain",
  Germany: "Germany",
  Italy: "Italy",
  France: "France",
};

function regionFor(country: string): RankingRegion {
  return COUNTRY_REGION[country] ?? "Europe";
}

export const rankings: RankingEntry[] = [...teams]
  .sort((a, b) => b.stats.overall - a.stats.overall)
  .map((t, index) => ({
    rank: index + 1,
    teamId: t.id,
    region: regionFor(t.country),
  }));

export function getRankingsByRegion(region: RankingRegion | "All"): RankingEntry[] {
  if (region === "All") return rankings;
  return rankings.filter((r) => r.region === region);
}
