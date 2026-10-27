import type { Team } from "@/types";
import { simulateKnockout, type KnockoutResult } from "@/lib/simulate-match";

export type FieldSize = 8 | 16;
export type SeedingMode = "rating" | "random";

export interface Tie {
  id: string;
  a: Team | null;
  b: Team | null;
  result: KnockoutResult | null;
}

export type Bracket = Tie[][];

const ROUND_NAMES: Record<number, string> = {
  2: "Final",
  4: "Semi-finals",
  8: "Quarter-finals",
  16: "Round of 16",
};

/** Name of a round given how many teams are in it. */
export function roundName(teamsInRound: number): string {
  return ROUND_NAMES[teamsInRound] ?? `Round of ${teamsInRound}`;
}

/** Standard bracket order so top seeds can only meet late: 8 → 1,8,4,5,2,7,3,6. */
function seedOrder(n: number): number[] {
  if (n === 2) return [1, 2];
  return seedOrder(n / 2).flatMap((seed) => [seed, n + 1 - seed]);
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildBracket(teams: Team[], size: FieldSize, mode: SeedingMode): Bracket {
  const byRating = [...teams].sort(
    (x, y) => y.stats.overall - x.stats.overall || y.trophies - x.trophies
  );
  const field = mode === "random" ? shuffle(teams).slice(0, size) : byRating.slice(0, size);
  const ordered =
    mode === "random" ? field : seedOrder(size).map((seed) => field[seed - 1]);

  const rounds: Bracket = [];
  let teamsInRound = size;
  let first = true;
  while (teamsInRound >= 2) {
    const ties: Tie[] = [];
    for (let i = 0; i < teamsInRound / 2; i++) {
      ties.push({
        id: `r${teamsInRound}-${i}`,
        a: first ? ordered[i * 2] : null,
        b: first ? ordered[i * 2 + 1] : null,
        result: null,
      });
    }
    rounds.push(ties);
    teamsInRound /= 2;
    first = false;
  }
  return rounds;
}

export function winnerOf(tie: Tie): Team | null {
  if (!tie.result) return null;
  return tie.result.winnerId === tie.a?.id ? tie.a : tie.b;
}

/** Index of the first round that still has unplayed ties, or -1 when finished. */
export function nextRoundIndex(bracket: Bracket): number {
  return bracket.findIndex((round) => round.some((tie) => !tie.result));
}

export function champion(bracket: Bracket): Team | null {
  const final = bracket[bracket.length - 1]?.[0];
  return final ? winnerOf(final) : null;
}

/** Plays every tie in the next unfinished round and seeds the following round. */
export function playNextRound(bracket: Bracket): Bracket {
  const r = nextRoundIndex(bracket);
  if (r === -1) return bracket;
  const next = bracket.map((round) => round.map((tie) => ({ ...tie })));
  next[r] = next[r].map((tie) =>
    tie.a && tie.b ? { ...tie, result: simulateKnockout(tie.a, tie.b) } : tie
  );
  if (next[r + 1]) {
    next[r + 1] = next[r + 1].map((tie, i) => ({
      ...tie,
      a: winnerOf(next[r][i * 2]),
      b: winnerOf(next[r][i * 2 + 1]),
    }));
  }
  return next;
}
