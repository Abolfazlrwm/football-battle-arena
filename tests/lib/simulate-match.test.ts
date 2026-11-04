import { describe, expect, it } from "vitest";
import { simulateMatch } from "@/lib/simulate-match";
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
    logo: "",
    heroImage: "",
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
