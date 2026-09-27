export type CaptainPosition = "Goalkeeper" | "Defender" | "Midfielder" | "Forward";

/**
 * The arena's own 0–100 attribute ratings for the captain card/detail
 * page (Phase 10) — a stylized comparison stat, not an official rating.
 */
export interface CaptainStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Captain {
  id: string;
  slug: string;
  name: string;
  /** References Team.id in /data/teams.ts. */
  teamId: string;
  position: CaptainPosition;
  /** Current club squad number. */
  number: number;
  nationality: string;
  /** Placeholder image URL — see /data/images.ts. */
  image: string;
  /** Arena overall rating, 0–100. */
  rating: number;
  stats: CaptainStats;
  bio: string;
}
