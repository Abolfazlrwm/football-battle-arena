export interface TeamColors {
  /** Hex, e.g. "#FFFFFF" — the team's primary shirt/identity color. */
  primary: string;
  /** Hex — the team's secondary/trim color. */
  secondary: string;
}

/**
 * The arena's own 0–100 comparison ratings — not an official club
 * strength index. Used to drive stat bars and the battle comparison
 * system (Phases 05/11/12).
 */
export interface TeamStats {
  overall: number;
  attack: number;
  midfield: number;
  defense: number;
}

/**
 * A club's signature tactical shape, used to draw its formation pitch
 * (see /lib/formations.ts). Illustrative: real lineups change match to
 * match, so this is the arena's representative shape for the club's
 * identity, not a confirmed team sheet.
 */
export type Formation = "4-3-3" | "4-2-3-1" | "4-4-2" | "3-5-2" | "3-4-3";

export interface Team {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  founded: number;
  stadium: string;
  colors: TeamColors;
  /** Placeholder image URL — see /data/images.ts. */
  logo: string;
  /** Placeholder image URL — see /data/images.ts. */
  heroImage: string;
  /** References Captain.id in /data/captains.ts. */
  captainId: string;
  formation: Formation;
  stats: TeamStats;
  /**
   * Approximate count of major honours (league + top continental
   * competition + primary domestic cup). A simplified, illustrative
   * figure for the arena — not an exact official tally, since clubs
   * and outlets count "major trophies" differently.
   */
  trophies: number;
  description: string;
}
