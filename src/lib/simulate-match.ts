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

/* ------------------------------------------------------------------ */
/* Knockout ties + many-run odds (used by the Arena Cup and Arena Odds) */
/* ------------------------------------------------------------------ */

export interface KnockoutResult {
  teamAGoals: number;
  teamBGoals: number;
  extraTime: { a: number; b: number } | null;
  penalties: { a: number; b: number } | null;
  winnerId: string;
  decidedBy: "regular" | "extra-time" | "penalties";
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** 90 minutes; if level, 30 minutes of extra time; if still level, penalties. */
export function simulateKnockout(teamA: Team, teamB: Team): KnockoutResult {
  const reg = simulateMatch(teamA, teamB);
  if (reg.outcome !== "DRAW") {
    return {
      teamAGoals: reg.teamAGoals,
      teamBGoals: reg.teamBGoals,
      extraTime: null,
      penalties: null,
      winnerId: reg.outcome === "A" ? teamA.id : teamB.id,
      decidedBy: "regular",
    };
  }

  const etA = samplePoisson(expectedGoals(teamA, teamB) / 3);
  const etB = samplePoisson(expectedGoals(teamB, teamA) / 3);
  if (etA !== etB) {
    return {
      teamAGoals: reg.teamAGoals,
      teamBGoals: reg.teamBGoals,
      extraTime: { a: etA, b: etB },
      penalties: null,
      winnerId: etA > etB ? teamA.id : teamB.id,
      decidedBy: "extra-time",
    };
  }

  const edge = (teamA.stats.overall - teamB.stats.overall) / 400;
  const pA = clamp(0.75 + edge, 0.68, 0.82);
  const pB = clamp(0.75 - edge, 0.68, 0.82);
  let a = 0;
  let b = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < pA) a += 1;
    if (Math.random() < pB) b += 1;
  }
  while (a === b) {
    if (Math.random() < pA) a += 1;
    if (Math.random() < pB) b += 1;
  }
  return {
    teamAGoals: reg.teamAGoals,
    teamBGoals: reg.teamBGoals,
    extraTime: { a: etA, b: etB },
    penalties: { a, b },
    winnerId: a > b ? teamA.id : teamB.id,
    decidedBy: "penalties",
  };
}

export interface OddsSummary {
  runs: number;
  aWinPct: number;
  drawPct: number;
  bWinPct: number;
  avgGoalsA: number;
  avgGoalsB: number;
  topScorelines: Array<{ score: string; pct: number }>;
}

/** Monte-Carlo: replay the matchup `runs` times and summarize. */
export function simulateMany(teamA: Team, teamB: Team, runs = 2000): OddsSummary {
  let aWins = 0;
  let draws = 0;
  let bWins = 0;
  let goalsA = 0;
  let goalsB = 0;
  const scorelines = new Map<string, number>();
  for (let i = 0; i < runs; i++) {
    const r = simulateMatch(teamA, teamB);
    if (r.outcome === "A") aWins += 1;
    else if (r.outcome === "B") bWins += 1;
    else draws += 1;
    goalsA += r.teamAGoals;
    goalsB += r.teamBGoals;
    const key = `${r.teamAGoals}–${r.teamBGoals}`;
    scorelines.set(key, (scorelines.get(key) ?? 0) + 1);
  }
  const topScorelines = [...scorelines.entries()]
    .sort((x, y) => y[1] - x[1])
    .slice(0, 5)
    .map(([score, count]) => ({ score, pct: (count / runs) * 100 }));
  return {
    runs,
    aWinPct: (aWins / runs) * 100,
    drawPct: (draws / runs) * 100,
    bWinPct: (bWins / runs) * 100,
    avgGoalsA: goalsA / runs,
    avgGoalsB: goalsB / runs,
    topScorelines,
  };
}
