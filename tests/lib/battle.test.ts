import { describe, expect, it } from "vitest";
import { computeBattleVerdict } from "@/lib/battle";
import type { Team } from "@/types";

function makeTeam(id: string, shortName: string, stats: [number, number, number, number]): Team {
  const [overall, attack, midfield, defense] = stats;
  return {
    id,
    slug: id,
    name: id,
    shortName,
    country: "Testland",
    league: "Test League",
    founded: 1900,
    stadium: "Test Arena",
    colors: { primary: "#000000", secondary: "#FFFFFF" },
    logo: "",
    heroImage: "",
    captainId: "",
    formation: "4-3-3",
    trophies: 10,
    stats: { overall, attack, midfield, defense },
    description: "",
  };
}

const real = makeTeam("real-madrid", "Real Madrid", [95, 94, 93, 88]);
const weaker = makeTeam("test-fc", "Test FC", [72, 70, 71, 74]);

describe("computeBattleVerdict", () => {
  it("weights the four stats 0.4 / 0.2 / 0.2 / 0.2", () => {
    const a = makeTeam("a", "A", [80, 60, 60, 60]); // 0.4*80 + 0.6*60 = 68
    const b = makeTeam("b", "B", [60, 80, 80, 80]); // 0.4*60 + 0.6*80 = 72
    const v = computeBattleVerdict(a, b);
    expect(v.scoreA).toBeCloseTo(68);
    expect(v.scoreB).toBeCloseTo(72);
    expect(v.winnerId).toBe("b");
  });

  it("favors the stronger team and names it in the summary", () => {
    const v = computeBattleVerdict(real, weaker);
    expect(v.winnerId).toBe("real-madrid");
    expect(v.summary).toBe("Real Madrid has a clear edge");
    expect(v.margin).toBeGreaterThanOrEqual(6);
  });

  it("calls near-equal teams too close to call", () => {
    const a = makeTeam("a", "A", [80, 80, 80, 80]);
    const b = makeTeam("b", "B", [80.4, 79.8, 80.1, 80.2]);
    const v = computeBattleVerdict(a, b);
    expect(v.winnerId).toBeNull();
    expect(v.summary).toBe("Too close to call");
    expect(v.margin).toBeLessThan(0.5);
  });

  it("uses slight edge between the tie and clear thresholds", () => {
    const a = makeTeam("a", "A", [82, 82, 82, 82]); // 82
    const b = makeTeam("b", "B", [78, 78, 78, 78]); // 78 — margin 4
    const v = computeBattleVerdict(a, b);
    expect(v.summary).toBe("A has a slight edge");
  });

  it("splits the share percentages to 100", () => {
    const v = computeBattleVerdict(real, weaker);
    expect(v.pctA + v.pctB).toBeCloseTo(100);
    expect(v.pctA).toBeGreaterThan(v.pctB);
  });

  it("is symmetric in margin and flipped in winner", () => {
    const ab = computeBattleVerdict(real, weaker);
    const ba = computeBattleVerdict(weaker, real);
    expect(ab.margin).toBeCloseTo(ba.margin);
    expect(ab.winnerId).toBe("real-madrid");
    expect(ba.winnerId).toBe("real-madrid");
  });
});
