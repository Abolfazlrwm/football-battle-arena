"use client";

import { useMemo, useState } from "react";
import type { Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamCard } from "./team-card";

const LEAGUES = ["All", "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1"] as const;

export function TeamsDirectory({ teams }: { teams: Team[] }) {
  const [query, setQuery] = useState("");
  const [league, setLeague] = useState<(typeof LEAGUES)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return teams.filter((t) => {
      const matchesLeague = league === "All" || t.league === league;
      const matchesQuery = q === "" || t.name.toLowerCase().includes(q);
      return matchesLeague && matchesQuery;
    });
  }, [teams, query, league]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams…"
          aria-label="Search teams"
          className="h-11 w-full rounded-sm border border-arena-line bg-arena-charcoal px-4 text-body-sm text-arena-fog placeholder:text-arena-smoke focus-visible:border-accent sm:max-w-xs"
        />
        <div className="scrollbar-hide flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter by league">
          {LEAGUES.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={league === l}
              onClick={() => setLeague(l)}
              className={cx(
                "shrink-0 rounded-sm border px-3.5 py-2 text-body-sm transition-colors",
                league === l
                  ? "border-accent bg-arena-charcoal-raised text-arena-fog"
                  : "border-arena-line text-arena-mist hover:text-arena-fog"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-body text-arena-mist">No teams match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
}
