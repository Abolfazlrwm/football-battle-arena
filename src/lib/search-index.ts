import { teams, getTeamById } from "@/data/teams";
import { captains } from "@/data/captains";

export interface SearchItem {
  type: "Team" | "Captain" | "League";
  label: string;
  sublabel: string;
  href: string;
  /** Lowercased text the query is matched against (names, short names, club, country...). */
  haystack: string;
}

/** Lowercase + strip accents, so "odegaard" finds "Ødegaard" and "martinez" finds "Martínez". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ø/gi, "o")
    .toLowerCase();
}

/**
 * Every whitespace-separated word of the query must appear somewhere in
 * the item's haystack, in any order ("city man" and "man city" both work).
 */
export function matchesQuery(item: SearchItem, query: string): boolean {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  return tokens.every((token) => item.haystack.includes(token));
}

/** Flat, searchable index across teams, captains, and leagues. */
export function buildSearchIndex(): SearchItem[] {
  const teamItems: SearchItem[] = teams.map((t) => ({
    type: "Team",
    label: t.name,
    sublabel: `${t.league} · ${t.country}`,
    href: `/teams/${t.slug}`,
    haystack: normalize([t.name, t.shortName, t.slug.replace(/-/g, " "), t.league, t.country, t.stadium].join(" ")),
  }));

  const captainItems: SearchItem[] = captains.map((c) => {
    const team = getTeamById(c.teamId);
    return {
      type: "Captain",
      label: c.name,
      sublabel: team ? `${team.shortName} · ${c.position}` : c.position,
      href: `/captains/${c.slug}`,
      haystack: normalize(
        [c.name, c.position, c.nationality, team?.name, team?.shortName].filter(Boolean).join(" ")
      ),
    };
  });

  const leagueNames = Array.from(new Set(teams.map((t) => t.league)));
  const leagueItems: SearchItem[] = leagueNames.map((league) => ({
    type: "League",
    label: league,
    sublabel: "League",
    href: `/teams?league=${encodeURIComponent(league)}`,
    haystack: normalize(league),
  }));

  return [...teamItems, ...captainItems, ...leagueItems];
}
