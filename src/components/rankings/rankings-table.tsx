"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RankingEntry, RankingRegion, Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamCrest } from "@/components/teams/team-crest";

const REGIONS: Array<RankingRegion | "All"> = ["All", "England", "Spain", "Germany", "Italy", "France"];

export function RankingsTable({ rankings, teams }: { rankings: RankingEntry[]; teams: Team[] }) {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");

  const filtered = useMemo(
    () => (region === "All" ? rankings : rankings.filter((r) => r.region === region)),
    [rankings, region]
  );

  return (
    <div className="mt-8">
      <div className="scrollbar-hide flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter by region">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={region === r}
            onClick={() => setRegion(r)}
            className={cx(
              "shrink-0 rounded-sm border px-3.5 py-2 text-body-sm transition-colors",
              region === r
                ? "border-accent bg-arena-charcoal-raised text-arena-fog"
                : "border-arena-line text-arena-mist hover:text-arena-fog"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-arena-line text-label text-arena-mist">
              <th className="py-3 pr-4 font-normal">Rank</th>
              <th className="py-3 pr-4 font-normal">Team</th>
              <th className="py-3 pr-4 font-normal">Rating</th>
              <th className="py-3 pr-4 font-normal">Attack</th>
              <th className="py-3 pr-4 font-normal">Midfield</th>
              <th className="py-3 pr-4 font-normal">Defense</th>
              <th className="py-3 pr-4 font-normal">Trophies</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry) => {
              const team = teams.find((t) => t.id === entry.teamId);
              if (!team) return null;
              return (
                <tr key={entry.teamId} className="border-b border-arena-line last:border-b-0">
                  <td className="py-3 pr-4 text-body-sm text-arena-mist">{entry.rank}</td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/teams/${team.slug}`}
                      className="flex items-center gap-3 text-body-sm text-arena-fog hover:text-accent"
                    >
                      <TeamCrest team={team} size={24} />
                      {team.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-body-sm text-arena-fog">{team.stats.overall}</td>
                  <td className="py-3 pr-4 text-body-sm text-arena-mist">{team.stats.attack}</td>
                  <td className="py-3 pr-4 text-body-sm text-arena-mist">{team.stats.midfield}</td>
                  <td className="py-3 pr-4 text-body-sm text-arena-mist">{team.stats.defense}</td>
                  <td className="py-3 pr-4 text-body-sm text-arena-mist">{team.trophies}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
