import type { Team } from "@/types";

/**
 * A playable match simulation — distinct from /lib/battle.ts's static
 * "edge" calculator. This produces an actual scoreline with goal
 * minutes, re-rolled fresh on every call, so the same matchup can end
 * differently each time (including upsets). Still clearly a game
 * mechanic, not a real prediction — every surface that uses this
 * labels it "Simulated".
 *
 * Model: each team's expected goals (lambda) comes from its attacking
 * strength (attack + half midfield) against the opponent's defensive
 * strength (defense + half midfield) — the same attack-vs-defense
 * matchup idea real expected-goals models use. Actual goals are drawn
 * from a Poisson distribution around that lambda, so a stronger team
 * is favored but not guaranteed.
 */

export interface MatchEvent {
  minute: number;
  teamId: string;
}

export interface MatchResult {
  teamAGoals: number;
  teamBGoals: number;
  events: MatchEvent[];
  outcome: "A" | "B" | "DRAW";
}

/** Knuth's algorithm — simple, well-known Poisson sampler. */
function samplePoisson(lambda: number): number {
  const limit = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k += 1;
    p *= Math.random();
  } while (p > limit);
  return k - 1;
}

const BASELINE_GOALS = 1.35;
const STRENGTH_DIVISOR = 35;
const MAX_LAMBDA = 5;
const MIN_LAMBDA = 0.15;

function expectedGoals(attacker: Team, defender: Team): number {
  const attackPower = attacker.stats.attack * 0.6 + attacker.stats.midfield * 0.4;
  const defensePower = defender.stats.defense * 0.6 + defender.stats.midfield * 0.4;
  const diff = (attackPower - defensePower) / STRENGTH_DIVISOR;
  return Math.min(MAX_LAMBDA, Math.max(MIN_LAMBDA, BASELINE_GOALS + diff));
}

export function simulateMatch(teamA: Team, teamB: Team): MatchResult {
  const goalsA = samplePoisson(expectedGoals(teamA, teamB));
  const goalsB = samplePoisson(expectedGoals(teamB, teamA));

  const usedMinutes = new Set<number>();
  function randomMinute(): number {
    let minute: number;
    do {
      minute = 1 + Math.floor(Math.random() * 90);
    } while (usedMinutes.has(minute));
    usedMinutes.add(minute);
    return minute;
  }

  const events: MatchEvent[] = [
    ...Array.from({ length: goalsA }, () => ({ minute: randomMinute(), teamId: teamA.id })),
    ...Array.from({ length: goalsB }, () => ({ minute: randomMinute(), teamId: teamB.id })),
  ].sort((a, b) => a.minute - b.minute);

  const outcome = goalsA > goalsB ? "A" : goalsB > goalsA ? "B" : "DRAW";

  return { teamAGoals: goalsA, teamBGoals: goalsB, events, outcome };
}
