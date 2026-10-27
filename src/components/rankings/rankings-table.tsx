"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RankingEntry, RankingRegion, Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamLogo } from "@/components/teams/team-logo";

const REGIONS: Array<RankingRegion | "All"> = ["All", "England", "Spain", "Germany", "Italy", "France", "Portugal"];

type SortKey = "overall" | "attack" | "midfield" | "defense" | "trophies";

const COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: "overall", label: "Rating" },
  { key: "attack", label: "Attack" },
  { key: "midfield", label: "Midfield" },
  { key: "defense", label: "Defense" },
  { key: "trophies", label: "Trophies" },
];

function valueFor(team: Team, key: SortKey) {
  return key === "trophies" ? team.trophies : team.stats[key];
}

export function RankingsTable({ rankings, teams }: { rankings: RankingEntry[]; teams: Team[] }) {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("All");
  const [sortKey, setSortKey] = useState<SortKey>("overall");

  const rows = useMemo(() => {
    const filtered = region === "All" ? rankings : rankings.filter((r) => r.region === region);
    return filtered
      .map((entry) => ({ entry, team: teams.find((t) => t.id === entry.teamId) }))
      .filter((row): row is { entry: RankingEntry; team: Team } => !!row.team)
      .sort(
        (a, b) =>
          valueFor(b.team, sortKey) - valueFor(a.team, sortKey) ||
          b.team.stats.overall - a.team.stats.overall
      );
  }, [rankings, teams, region, sortKey]);

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
              <th className="py-3 pr-4 font-normal">#</th>
              <th className="py-3 pr-4 font-normal">Team</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="py-3 pr-4 font-normal" aria-sort={sortKey === col.key ? "descending" : "none"}>
                  <button
                    type="button"
                    onClick={() => setSortKey(col.key)}
                    className={cx("transition-colors hover:text-arena-fog", sortKey === col.key && "text-arena-fog")}
                  >
                    {col.label}
                    {sortKey === col.key ? " ↓" : ""}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ team }, index) => (
              <tr key={team.id} className="border-b border-arena-line last:border-b-0">
                <td className="py-3 pr-4 text-body-sm text-arena-mist">{index + 1}</td>
                <td className="py-3 pr-4">
                  <Link href={`/teams/${team.slug}`} className="flex items-center gap-3 text-body-sm text-arena-fog hover:text-accent">
                    <TeamLogo team={team} size={24} />
                    {team.name}
                  </Link>
                </td>
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className={cx("py-3 pr-4 text-body-sm", sortKey === col.key ? "text-arena-fog" : "text-arena-mist")}
                  >
                    {valueFor(team, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
