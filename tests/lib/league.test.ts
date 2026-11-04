import { describe, expect, it } from "vitest";
import { averageStats, radarValues, simulateSeason, teamsInLeague } from "@/lib/league";
import { teams } from "@/data/teams";

describe("teamsInLeague", () => {
  it("only returns teams of the requested league, strongest first", () => {
    const leagueName = teams[0].league;
    const rows = teamsInLeague(leagueName);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((t) => t.league === leagueName)).toBe(true);
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].stats.overall).toBeGreaterThanOrEqual(rows[i].stats.overall);
    }
  });

  it("returns an empty list for an unknown league", () => {
    expect(teamsInLeague("Nonexistent League")).toEqual([]);
  });
});

describe("averageStats", () => {
  it("computes the mean of each stat", () => {
    const one = averageStats([teams[0]]);
    expect(one.overall).toBe(teams[0].stats.overall);
    const two = averageStats([teams[0], teams[1]]);
    expect(two.overall).toBeCloseTo((teams[0].stats.overall + teams[1].stats.overall) / 2);
  });

  it("never divides by zero on an empty list", () => {
    const empty = averageStats([]);
    expect(Number.isFinite(empty.overall)).toBe(true);
  });
});

describe("simulateSeason", () => {
  const leagueName = teams[0].league;
  const list = teamsInLeague(leagueName);
  const table = simulateSeason(list);
  const n = list.length;

  it("gives every team two fixtures against each opponent (home and away)", () => {
    for (const row of table) expect(row.played).toBe(2 * (n - 1));
  });

  it("books goals symmetrically: total goals for equals total goals against", () => {
    const gf = table.reduce((acc, r) => acc + r.gf, 0);
    const ga = table.reduce((acc, r) => acc + r.ga, 0);
    expect(gf).toBe(ga);
  });

  it("keeps points consistent with won/drawn/lost", () => {
    for (const row of table) {
      expect(row.won + row.drawn + row.lost).toBe(row.played);
      expect(row.points).toBe(3 * row.won + row.drawn);
    }
  });

  it("sorts by points, then goal difference, then goals for", () => {
    for (let i = 1; i < table.length; i++) {
      const prev = table[i - 1];
      const cur = table[i];
      const key = (r: typeof prev) => [r.points, r.gf - r.ga, r.gf];
      const [p1, p2, p3] = key(prev);
      const [c1, c2, c3] = key(cur);
      expect(p1).toBeGreaterThanOrEqual(c1);
      if (p1 === c1) expect(p2).toBeGreaterThanOrEqual(c2);
      if (p1 === c1 && p2 === c2) expect(p3).toBeGreaterThanOrEqual(c3);
    }
  });
});

describe("radarValues", () => {
  it("stays inside the 0.05–1 range for every axis", () => {
    for (const team of teams.slice(0, 10)) {
      const values = radarValues(team);
      expect(values).toHaveLength(5);
      for (const v of values) {
        expect(v).toBeGreaterThanOrEqual(0.05);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });
});
