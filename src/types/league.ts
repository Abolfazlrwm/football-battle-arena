import type { RankingRegion } from "./ranking";

export interface League {
  id: string;
  slug: string;
  /** Must match `Team.league` exactly. */
  name: string;
  country: string;
  region: RankingRegion;
  tagline: string;
  description: string;
}
