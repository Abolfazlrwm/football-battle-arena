import type { Team } from "@/types";
import { teams } from "@/data/teams";
import { simulateMatch } from "@/lib/simulate-match";

export function teamsInLeague(leagueName: string): Team[] {
  return teams
    .filter((t) => t.league === leagueName)
    .sort((a, b) => b.stats.overall - a.stats.overall);
}

export function averageStats(list: Team[]) {
  const n = list.length || 1;
  const sum = (pick: (t: Team) => number) => list.reduce((acc, t) => acc + pick(t), 0) / n;
  return {
    overall: sum((t) => t.stats.overall),
    attack: sum((t) => t.stats.attack),
    midfield: sum((t) => t.stats.midfield),
    defense: sum((t) => t.stats.defense),
  };
}

export interface TableRow {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
}

/** A full double round-robin season between the given teams. */
export function simulateSeason(list: Team[]): TableRow[] {
  const rows = new Map<string, TableRow>(
    list.map((team) => [team.id, { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }])
  );
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (i === j) continue; // each ordered pair = one home fixture
      const home = list[i];
      const away = list[j];
      const r = simulateMatch(home, away);
      const h = rows.get(home.id)!;
      const a = rows.get(away.id)!;
      h.played += 1;
      a.played += 1;
      h.gf += r.teamAGoals;
      h.ga += r.teamBGoals;
      a.gf += r.teamBGoals;
      a.ga += r.teamAGoals;
      if (r.outcome === "A") {
        h.won += 1; h.points += 3; a.lost += 1;
      } else if (r.outcome === "B") {
        a.won += 1; a.points += 3; h.lost += 1;
      } else {
        h.drawn += 1; a.drawn += 1; h.points += 1; a.points += 1;
      }
    }
  }
  return [...rows.values()].sort(
    (x, y) => y.points - x.points || y.gf - y.ga - (x.gf - x.ga) || y.gf - x.gf
  );
}

/** 0–1 radar coordinates: ratings are zoomed (60–100) so differences are visible. */
export function radarValues(team: Team): number[] {
  const norm = (v: number) => Math.min(1, Math.max(0.05, (v - 60) / 40));
  return [
    norm(team.stats.attack),
    norm(team.stats.midfield),
    norm(team.stats.defense),
    norm(team.stats.overall),
    Math.min(1, Math.max(0.05, Math.sqrt(team.trophies / 100))),
  ];
}
export const RADAR_AXES = ["Attack", "Midfield", "Defense", "Overall", "Pedigree"];
