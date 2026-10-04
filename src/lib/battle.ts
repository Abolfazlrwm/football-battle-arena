import type { Team } from "@/types";

/**
 * Computes a weighted "edge" between two teams from the arena's own
 * ratings. This is explicitly NOT a real match prediction — there's no
 * fixture, no home advantage, no form, no injuries. It's a transparent,
 * reproducible comparison: overall counts most, the three phase-of-play
 * stats split the rest evenly. Every consumer of this (BattleComparator,
 * the battle detail page) shows the disclaimer alongside it.
 */

const WEIGHTS = {
  overall: 0.4,
  attack: 0.2,
  midfield: 0.2,
  defense: 0.2,
} as const;

function weightedScore(team: Team): number {
  const { overall, attack, midfield, defense } = team.stats;
  return (
    overall * WEIGHTS.overall +
    attack * WEIGHTS.attack +
    midfield * WEIGHTS.midfield +
    defense * WEIGHTS.defense
  );
}

export interface BattleVerdict {
  /** Winning team's id, or null if the two scores are a near-tie. */
  winnerId: string | null;
  scoreA: number;
  scoreB: number;
  /** Share of (scoreA + scoreB) each team holds, as 0–100. */
  pctA: number;
  pctB: number;
  /** Absolute point gap between the two weighted scores. */
  margin: number;
  /** Human-readable summary, e.g. "Real Madrid has a clear edge". */
  summary: string;
}

const TIE_THRESHOLD = 0.5;
const CLEAR_EDGE_THRESHOLD = 6;

export function computeBattleVerdict(teamA: Team, teamB: Team): BattleVerdict {
  const scoreA = weightedScore(teamA);
  const scoreB = weightedScore(teamB);
  const diff = scoreA - scoreB;
  const margin = Math.abs(diff);
  const total = scoreA + scoreB || 1;

  let winnerId: string | null = null;
  let summary: string;

  if (margin < TIE_THRESHOLD) {
    summary = "Too close to call";
  } else {
    const winner = diff > 0 ? teamA : teamB;
    winnerId = winner.id;
    summary =
      margin >= CLEAR_EDGE_THRESHOLD
        ? `${winner.shortName} has a clear edge`
        : `${winner.shortName} has a slight edge`;
  }

  return {
    winnerId,
    scoreA,
    scoreB,
    pctA: (scoreA / total) * 100,
    pctB: (scoreB / total) * 100,
    margin,
    summary,
  };
}
