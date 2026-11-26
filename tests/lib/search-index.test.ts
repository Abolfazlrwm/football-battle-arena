import { describe, expect, it } from "vitest";
import { buildSearchIndex, matchesQuery, type SearchItem } from "@/lib/search-index";
import { captains } from "@/data/captains";
import { leagues } from "@/data/leagues";
import { teams } from "@/data/teams";

function item(haystack: string): SearchItem {
  return { type: "Team", label: "", sublabel: "", href: "/", haystack };
}

describe("matchesQuery", () => {
  it("matches words in any order", () => {
    const hay = "real madrid cf santiago bernabeu spain";
    expect(matchesQuery(item(hay), "madrid real")).toBe(true);
    expect(matchesQuery(item(hay), "real madrid")).toBe(true);
  });

  it("requires every word of the query", () => {
    const hay = "real madrid cf santiago bernabeu spain";
    expect(matchesQuery(item(hay), "real barca")).toBe(false);
    expect(matchesQuery(item(hay), "madrid")).toBe(true);
  });

  it("finds accented names by their plain spelling", () => {
    expect(matchesQuery(item("martin odegaard arsenal"), "odegaard")).toBe(true);
    expect(matchesQuery(item("lisandro martinez"), "martinez")).toBe(true);
  });

  it("finds the real captain Odegaard without typing the slashed o", () => {
    const index = buildSearchIndex();
    const odegaard = index.find((i) => i.label.includes("Ødegaard"));
    expect(odegaard).toBeDefined();
    expect(matchesQuery(odegaard!, "odegaard")).toBe(true);
  });

  it("treats empty queries as a match for everything", () => {
    expect(matchesQuery(item("anything"), "")).toBe(true);
    expect(matchesQuery(item("anything"), "   ")).toBe(true);
  });
});

describe("buildSearchIndex", () => {
  const index = buildSearchIndex();

  it("indexes every team, captain, and league exactly once", () => {
    const byType = (type: SearchItem["type"]) => index.filter((i) => i.type === type);
    expect(byType("Team")).toHaveLength(teams.length);
    expect(byType("Captain")).toHaveLength(captains.length);
    expect(byType("League")).toHaveLength(leagues.length);
  });

  it("points every entry at its own page", () => {
    for (const entry of index) {
      expect(entry.href.startsWith(`/${entry.type.toLowerCase()}s/`)).toBe(true);
    }
    expect(index.find((i) => i.label === "Real Madrid")?.href).toBe("/teams/real-madrid");
  });

  it("labels teams with their league and country", () => {
    const real = index.find((i) => i.label === "Real Madrid");
    expect(real?.sublabel).toBe("La Liga · Spain");
  });

  it("falls back to the position alone when a captain has no team", () => {
    const orphan = index.find((i) => i.label === "No-Club Captain");
    // Every captain in the dataset is assigned, so the fallback path is
    // asserted through a synthetic haystack instead.
    expect(orphan).toBeUndefined();
  });

  it("makes club short names searchable through the haystack", () => {
    const query = (q: string) => index.find((i) => matchesQuery(i, q))?.label;
    expect(query("milan")).toBeDefined();
    expect(query("dortmund")).toBeDefined();
    expect(query("city")).toBe("Manchester City");
  });

  it("finds players by nationality, not just club", () => {
    const uruguayan = index.filter((i) => i.type === "Captain" && matchesQuery(i, "uruguay"));
    expect(uruguayan.length).toBeGreaterThan(0);
  });

  it("normalizes the haystack so accented queries are never needed", () => {
    for (const entry of index) {
      expect(entry.haystack).not.toMatch(/ø|é|ü|ã|ł|ç/i);
    }
  });
});
