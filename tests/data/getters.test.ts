import { describe, expect, it } from "vitest";
import { AVAILABLE_LOGOS } from "@/data/logos.generated";
import { CAPTAIN_PHOTO_SLUGS } from "@/data/images";
import { battles, getBattleBySlug, getFeaturedBattles } from "@/data/battles";
import { captains, getCaptainById, getCaptainBySlug, getCaptainByTeamId } from "@/data/captains";
import { getLeagueByName, getLeagueBySlug, leagues } from "@/data/leagues";
import { getTeamById, getTeamBySlug, teams } from "@/data/teams";
import { rankings } from "@/data/rankings";

describe("team lookups", () => {
  it("resolves every team by slug and id", () => {
    for (const team of teams) {
      expect(getTeamBySlug(team.slug)?.id).toBe(team.id);
      expect(getTeamById(team.id)?.id).toBe(team.id);
    }
    expect(getTeamBySlug("not-a-club")).toBeUndefined();
    expect(getTeamById("not-a-club")).toBeUndefined();
  });
});

describe("captain lookups", () => {
  it("resolves captains by id, slug, and team", () => {
    for (const captain of captains) {
      expect(getCaptainById(captain.id)?.slug).toBe(captain.slug);
      expect(getCaptainBySlug(captain.slug)?.id).toBe(captain.id);
      expect(getCaptainByTeamId(captain.teamId)?.id).toBe(captain.id);
    }
    expect(getCaptainById("no-one")).toBeUndefined();
    expect(getCaptainBySlug("no-one")).toBeUndefined();
    expect(getCaptainByTeamId("not-a-club")).toBeUndefined();
  });
});

describe("league lookups", () => {
  it("resolves leagues by slug and exact name", () => {
    for (const league of leagues) {
      expect(getLeagueBySlug(league.slug)?.id).toBe(league.id);
      expect(getLeagueByName(league.name)?.id).toBe(league.id);
    }
    expect(getLeagueBySlug("nope")).toBeUndefined();
    expect(getLeagueByName("Nope League")).toBeUndefined();
  });
});

describe("battle lookups", () => {
  it("resolves battles by slug and lists the featured ones", () => {
    for (const battle of battles) {
      expect(getBattleBySlug(battle.slug)?.id).toBe(battle.id);
    }
    expect(getBattleBySlug("no-battle")).toBeUndefined();

    const featured = getFeaturedBattles();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((b) => b.featured)).toBe(true);
  });
});

describe("generated logo manifest", () => {
  it("matches the teams dataset exactly, in both directions", () => {
    const dataSlugs = teams.map((t) => t.slug).sort();
    expect([...AVAILABLE_LOGOS].sort()).toEqual(dataSlugs);
  });

  it("lists photo-backed captain slugs that actually exist", () => {
    const captainSlugs = new Set(captains.map((c) => c.slug));
    for (const slug of CAPTAIN_PHOTO_SLUGS) {
      expect(captainSlugs.has(slug), `${slug} photo with no captain`).toBe(true);
    }
  });
});

describe("rankings derivation", () => {
  it("orders teams by overall rating, best first", () => {
    const byId = new Map(teams.map((t) => [t.id, t.stats.overall]));
    const overalls = rankings.map((r) => byId.get(r.teamId)!);
    for (let i = 1; i < overalls.length; i++) {
      expect(overalls[i]).toBeLessThanOrEqual(overalls[i - 1]);
    }
  });

  it("derives the region from each team's country", () => {
    const byId = new Map(teams.map((t) => [t.id, t.country]));
    for (const entry of rankings) {
      const country = byId.get(entry.teamId)!;
      if (["England", "Spain", "Germany", "Italy", "France", "Portugal"].includes(country)) {
        expect(entry.region).toBe(country);
      } else {
        expect(entry.region).toBe("Europe");
      }
    }
  });
});
