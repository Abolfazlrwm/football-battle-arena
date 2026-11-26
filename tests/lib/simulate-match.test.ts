import { describe, expect, it } from "vitest";
import { simulateKnockout, simulateMatch, simulateMany } from "@/lib/simulate-match";
import { teams } from "@/data/teams";
import type { Team } from "@/types";

const giant = teams[0];
const underdog = teams[teams.length - 1];

function makeTeam(id: string, stats: [number, number, number, number]): Team {
  const [overall, attack, midfield, defense] = stats;
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
    trophies: 1,
    stats: { overall, attack, midfield, defense },
    description: "",
  };
}

describe("simulateMatch", () => {
  it("matches every event to the goal count, with unique minutes in 1–90", () => {
    const r = simulateMatch(giant, underdog);
    expect(r.events).toHaveLength(r.teamAGoals + r.teamBGoals);
    const minutes = r.events.map((e) => e.minute);
    expect(new Set(minutes).size).toBe(minutes.length);
    for (const minute of minutes) {
      expect(minute).toBeGreaterThanOrEqual(1);
      expect(minute).toBeLessThanOrEqual(90);
    }
  });

  it("labels the outcome consistently with the scoreline", () => {
    for (let i = 0; i < 20; i++) {
      const r = simulateMatch(giant, underdog);
      const expected = r.teamAGoals > r.teamBGoals ? "A" : r.teamBGoals > r.teamAGoals ? "B" : "DRAW";
      expect(r.outcome).toBe(expected);
    }
  });

  it("credits goals to the right teams", () => {
    const r = simulateMatch(giant, underdog);
    const byA = r.events.filter((e) => e.teamId === giant.id).length;
    const byB = r.events.filter((e) => e.teamId === underdog.id).length;
    expect(byA).toBe(r.teamAGoals);
    expect(byB).toBe(r.teamBGoals);
  });

  it("favors the much stronger team across many runs but allows upsets", () => {
    const monster = makeTeam("monster", [99, 99, 99, 99]);
    const minnow = makeTeam("minnow", [60, 60, 60, 60]);
    let wins = 0;
    const runs = 300;
    for (let i = 0; i < runs; i++) {
      const r = simulateMatch(monster, minnow);
      if (r.outcome === "A") wins += 1;
    }
    // Strong team should usually win — without being guaranteed.
    expect(wins).toBeGreaterThan(runs * 0.55);
    expect(wins).toBeLessThan(runs);
  });
});

describe("simulateKnockout", () => {
  it("always names a winner, in every conceivable way a tie can end", () => {
    for (let i = 0; i < 120; i++) {
      const r = simulateKnockout(giant, underdog);
      expect(["regular", "extra-time", "penalties"]).toContain(r.decidedBy);
      expect([giant.id, underdog.id]).toContain(r.winnerId);
      // The recorded scoreline must agree with who was declared the winner.
      const winnerIsA = r.winnerId === giant.id;
      if (r.decidedBy === "regular") {
        expect(r.extraTime).toBeNull();
        expect(r.penalties).toBeNull();
        expect(winnerIsA ? r.teamAGoals : r.teamBGoals).toBeGreaterThan(
          winnerIsA ? r.teamBGoals : r.teamAGoals
        );
      } else {
        expect(r.extraTime).not.toBeNull();
        const et = r.extraTime!;
        const etAWon = et.a > et.b;
        // Penalties decide only when extra time ends level.
        if (r.decidedBy === "extra-time") {
          expect(et.a).not.toBe(et.b);
          expect(r.penalties).toBeNull();
          expect(r.winnerId).toBe(etAWon ? giant.id : underdog.id);
        } else {
          expect(et.a).toBe(et.b);
          const pens = r.penalties!;
          expect(pens.a).not.toBe(pens.b);
          expect(r.winnerId).toBe(pens.a > pens.b ? giant.id : underdog.id);
        }
      }
    }
  });

  it("gives the stronger team the tie-break edge in shootouts", () => {
    const monster = makeTeam("monster", [99, 99, 99, 99]);
    const minnow = makeTeam("minnow", [60, 60, 60, 60]);
    let monsterWins = 0;
    let shootouts = 0;
    for (let i = 0; i < 150; i++) {
      const r = simulateKnockout(monster, minnow);
      if (r.decidedBy === "penalties") {
        shootouts += 1;
        if (r.winnerId === "monster") monsterWins += 1;
      }
    }
    if (shootouts > 5) {
      expect(monsterWins).toBeGreaterThan(shootouts / 2);
    }
  });
});

describe("simulateMany", () => {
  it("summarizes exactly as many runs as requested", () => {
    const odds = simulateMany(giant, underdog, 300);
    expect(odds.runs).toBe(300);
  });

  it("reports outcome percentages that account for every run", () => {
    const odds = simulateMany(giant, underdog, 200);
    expect(odds.aWinPct + odds.drawPct + odds.bWinPct).toBeCloseTo(100);
    expect(odds.aWinPct).toBeGreaterThan(odds.bWinPct); // giant favored
    expect(odds.avgGoalsA).toBeGreaterThanOrEqual(0);
    expect(odds.avgGoalsB).toBeGreaterThanOrEqual(0);
  });

  it("returns at most five scorelines, ordered by frequency", () => {
    const odds = simulateMany(giant, underdog, 400);
    expect(odds.topScorelines.length).toBeGreaterThan(0);
    expect(odds.topScorelines.length).toBeLessThanOrEqual(5);
    const pcts = odds.topScorelines.map((s) => s.pct);
    for (let i = 1; i < pcts.length; i++) {
      expect(pcts[i]).toBeLessThanOrEqual(pcts[i - 1]);
    }
    expect(odds.topScorelines[0].score).toMatch(/^\d+–\d+$/);
  });
});
