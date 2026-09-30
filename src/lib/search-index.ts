import { teams } from "@/data/teams";
import { captains } from "@/data/captains";
import { getTeamById } from "@/data/teams";

export interface SearchItem {
  type: "Team" | "Captain" | "League";
  label: string;
  sublabel: string;
  href: string;
}

/** Flat, searchable index across teams, captains, and leagues. */
export function buildSearchIndex(): SearchItem[] {
  const teamItems: SearchItem[] = teams.map((t) => ({
    type: "Team",
    label: t.name,
    sublabel: `${t.league} · ${t.country}`,
    href: `/teams/${t.slug}`,
  }));

  const captainItems: SearchItem[] = captains.map((c) => {
    const team = getTeamById(c.teamId);
    return {
      type: "Captain",
      label: c.name,
      sublabel: team ? `${team.shortName} · ${c.position}` : c.position,
      href: `/captains/${c.slug}`,
    };
  });

  const leagueNames = Array.from(new Set(teams.map((t) => t.league)));
  const leagueItems: SearchItem[] = leagueNames.map((league) => ({
    type: "League",
    label: league,
    sublabel: "League",
    href: `/teams?league=${encodeURIComponent(league)}`,
  }));

  return [...teamItems, ...captainItems, ...leagueItems];
}
