import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { battles } from "@/data/battles";
import { captains } from "@/data/captains";
import { leagues } from "@/data/leagues";
import { rankings } from "@/data/rankings";
import { teams } from "@/data/teams";
import { FORMATION_LAYOUTS } from "@/lib/formations";

const HEX = /^#[0-9A-Fa-f]{6}$/;
const FORMATIONS = Object.keys(FORMATION_LAYOUTS);
const teamIds = new Set(teams.map((t) => t.id));
const captainIds = new Set(captains.map((c) => c.id));
const leagueNames = new Set(leagues.map((l) => l.name));

function unique(values: Array<string | number>, what: string) {
  expect(new Set(values).size, what).toBe(values.length);
}

describe("teams dataset", () => {
  it("holds 24 clubs with unique ids and slugs", () => {
    expect(teams).toHaveLength(24);
    unique(teams.map((t) => t.id), "ids");
    unique(teams.map((t) => t.slug), "slugs");
  });

  it("carries well-formed brand colors and ratings", () => {
    for (const team of teams) {
      expect(HEX.test(team.colors.primary), team.id).toBe(true);
      expect(HEX.test(team.colors.secondary), team.id).toBe(true);
      for (const stat of Object.values(team.stats)) {
        expect(stat, `${team.id} stat`).toBeGreaterThanOrEqual(1);
        expect(stat, `${team.id} stat`).toBeLessThanOrEqual(100);
      }
      expect(team.founded).toBeGreaterThan(1850);
      expect(team.trophies).toBeGreaterThanOrEqual(0);
      expect(team.name.length).toBeGreaterThan(0);
      expect(team.stadium.length).toBeGreaterThan(0);
    }
  });

  it("ships a 256×256-spec logo file for every club", () => {
    for (const team of teams) {
      const file = join(process.cwd(), "public", "logos", `${team.slug}.webp`);
      expect(existsSync(file), `${team.slug}.webp missing`).toBe(true);
    }
  });

  it("only assigns formations and leagues that exist", () => {
    for (const team of teams) {
      expect(FORMATIONS, team.id).toContain(team.formation);
      expect(leagueNames.has(team.league), `${team.id} league`).toBe(true);
    }
  });

  it("links every captain assignment in both directions", () => {
    for (const team of teams) {
      expect(captainIds.has(team.captainId), `${team.id} captainId`).toBe(true);
      const captain = captains.find((c) => c.id === team.captainId);
      expect(captain?.teamId, `${team.id} ↔ ${team.captainId}`).toBe(team.id);
    }
    // And no captain claims a team that didn't claim them back.
    for (const captain of captains) {
      const team = teams.find((t) => t.id === captain.teamId);
      expect(team?.captainId, `${captain.id} teamId`).toBe(captain.id);
    }
  });
});

describe("captains dataset", () => {
  it("has unique slugs and valid ratings, squad numbers, and positions", () => {
    unique(captains.map((c) => c.slug), "slugs");
    for (const captain of captains) {
      expect(captain.rating).toBeGreaterThanOrEqual(1);
      expect(captain.rating).toBeLessThanOrEqual(100);
      expect(captain.number).toBeGreaterThanOrEqual(1);
      expect(captain.number).toBeLessThanOrEqual(99);
      expect(teamIds.has(captain.teamId), `${captain.id} teamId`).toBe(true);
      expect(["Goalkeeper", "Defender", "Midfielder", "Forward"]).toContain(captain.position);
      if (captain.roleHint) {
        expect(["deep", "attacking", "wide", "wide-left", "wide-right"]).toContain(captain.roleHint);
      }
      expect(captain.bio.length).toBeGreaterThan(0);
    }
  });
});

describe("leagues dataset", () => {
  it("covers every league the teams reference, with unique slugs", () => {
    unique(leagues.map((l) => l.slug), "slugs");
    for (const league of leagues) {
      expect(league.tagline.length).toBeGreaterThan(0);
      expect(league.description.length).toBeGreaterThan(0);
    }
    const referenced = new Set(teams.map((t) => t.league));
    expect(referenced).toEqual(leagueNames);
  });
});

describe("battles dataset", () => {
  it("pits two distinct, existing clubs against each other in every battle", () => {
    unique(battles.map((b) => b.slug), "slugs");
    for (const battle of battles) {
      expect(teamIds.has(battle.teamAId), `${battle.id} teamA`).toBe(true);
      expect(teamIds.has(battle.teamBId), `${battle.id} teamB`).toBe(true);
      expect(battle.teamAId, battle.id).not.toBe(battle.teamBId);
      expect(battle.tagline.length).toBeGreaterThan(0);
    }
    expect(battles.some((b) => b.featured)).toBe(true);
  });
});

describe("rankings dataset", () => {
  it("ranks every team exactly once with consecutive positions", () => {
    expect(rankings).toHaveLength(teams.length);
    unique(rankings.map((r) => r.teamId), "teamIds");
    unique(rankings.map((r) => r.rank), "ranks");
    const ranks = rankings.map((r) => r.rank).sort((a, b) => a - b);
    expect(ranks).toEqual(Array.from({ length: teams.length }, (_, i) => i + 1));
    for (const entry of rankings) {
      expect(teamIds.has(entry.teamId)).toBe(true);
    }
  });
});
