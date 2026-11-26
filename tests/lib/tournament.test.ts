import { describe, expect, it } from "vitest";
import { buildBracket, champion, nextRoundIndex, playNextRound, roundName, winnerOf } from "@/lib/tournament";
import type { Team } from "@/types";

function makeTeam(id: string, overall: number, trophies = 10): Team {
  return {
    id,
    slug: id,
    name: id,
    shortName: id,
    country: "Testland",
    league: "Test League",
    founded: 1900,
    stadium: "Test Arena",
    colors: { primary: "#000000", secondary: "#FFFFFF" },
    captainId: "",
    formation: "4-3-3",
    trophies,
    stats: { overall, attack: overall, midfield: overall, defense: overall },
    description: "",
  };
}

/** Eight teams, clearly ordered by overall — seeds 1–8. */
const EIGHT = Array.from({ length: 8 }, (_, i) => makeTeam(`t${i + 1}`, 90 - i * 2));

describe("roundName", () => {
  it("names the standard rounds and falls back for unusual sizes", () => {
    expect(roundName(2)).toBe("Final");
    expect(roundName(4)).toBe("Semi-finals");
    expect(roundName(8)).toBe("Quarter-finals");
    expect(roundName(16)).toBe("Round of 16");
    expect(roundName(32)).toBe("Round of 32");
  });
});

describe("buildBracket", () => {
  it("builds the full round structure for an 8-team field", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    expect(bracket).toHaveLength(3);
    expect(bracket.map((r) => r.length)).toEqual([4, 2, 1]);
    expect(bracket[0].map((t) => t.id)).toEqual(["r8-0", "r8-1", "r8-2", "r8-3"]);
  });

  it("seeds by rating so seed 1 meets seed 8 first", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    const first = bracket[0];
    expect(first[0].a?.id).toBe("t1"); // highest overall
    expect(first[0].b?.id).toBe("t8"); // lowest overall
    expect(first[1].a?.id).toBe("t4");
    expect(first[1].b?.id).toBe("t5");
  });

  it("uses trophies to break overall-rating ties", () => {
    // Eight teams, identical overall — seeding falls back to trophies.
    const trophies = [9, 7, 6, 5, 4, 3, 2, 1];
    const tied = trophies.map((t) => makeTeam(`tie-${t}`, 80, t));
    const bracket = buildBracket(tied, 8, "rating");
    expect(bracket[0][0].a?.id).toBe("tie-9"); // most trophies takes seed 1
    expect(bracket[0][0].b?.id).toBe("tie-1"); // fewest takes seed 8
  });

  it("takes exactly `size` distinct teams in random mode", () => {
    const sixteen = Array.from({ length: 16 }, (_, i) => makeTeam(`t${i + 1}`, 85 - i));
    const bracket = buildBracket(sixteen, 8, "random");
    const first = bracket[0].flatMap((t) => [t.a?.id, t.b?.id]);
    expect(new Set(first).size).toBe(8);
    expect(first.every(Boolean)).toBe(true);
  });

  it("leaves later rounds empty until earlier rounds are played", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    expect(bracket[1][0].a).toBeNull();
    expect(bracket[2][0].result).toBeNull();
    expect(nextRoundIndex(bracket)).toBe(0);
  });
});

describe("playing a bracket to completion", () => {
  it("crown a champion and leave no tie unplayed, without mutating the input", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    let current = bracket;
    let roundsPlayed = 0;
    while (nextRoundIndex(current) !== -1) {
      current = playNextRound(current);
      roundsPlayed += 1;
    }
    expect(roundsPlayed).toBe(3);
    expect(champion(current)?.id).toMatch(/^t\d+$/);
    // The original bracket was never touched — all ties still unplayed.
    expect(bracket[0][0].result).toBeNull();
    expect(nextRoundIndex(bracket)).toBe(0);
  });

  it("seeds the next round with the actual winners", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    const played = playNextRound(bracket);
    expect(nextRoundIndex(played)).toBe(1);
    for (const tie of played[1]) {
      const winners = played[0].map((t) => winnerOf(t)?.id);
      expect(winners).toContain(tie.a?.id);
      expect(winners).toContain(tie.b?.id);
    }
  });

  it("is a no-op on a finished bracket", () => {
    let current = buildBracket(EIGHT, 8, "rating");
    for (let i = 0; i < 3; i++) current = playNextRound(current);
    expect(nextRoundIndex(current)).toBe(-1);
    expect(playNextRound(current)).toBe(current);
  });

  it("keeps winnerOf consistent with the recorded result", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    const played = playNextRound(bracket);
    for (const tie of played[0]) {
      const winner = winnerOf(tie);
      expect(winner?.id).toBe(tie.result?.winnerId);
    }
    expect(winnerOf({ id: "x", a: null, b: null, result: null })).toBeNull();
  });

  it("returns no champion while the final is unplayed", () => {
    const bracket = buildBracket(EIGHT, 8, "rating");
    expect(champion(bracket)).toBeNull();
  });
});

describe("16-team bracket", () => {
  it("runs four rounds from the round of 16", () => {
    const sixteen = Array.from({ length: 16 }, (_, i) => makeTeam(`t${i + 1}`, 90 - i));
    const bracket = buildBracket(sixteen, 16, "rating");
    expect(bracket.map((r) => r.length)).toEqual([8, 4, 2, 1]);
    expect(bracket[0][0].a?.id).toBe("t1");
    expect(bracket[0][0].b?.id).toBe("t16");
  });
});
