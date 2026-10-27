"use client";

import { useState } from "react";
import { Play, RotateCcw, Trophy } from "lucide-react";
import type { Team } from "@/types";
import { simulateSeason, type TableRow } from "@/lib/league";
import { TeamLogo } from "@/components/teams/team-logo";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";

/** Plays a full home-and-away season between the league's clubs and shows the table. */
export function SeasonSimulator({ teams, leagueName }: { teams: Team[]; leagueName: string }) {
  const [table, setTable] = useState<TableRow[] | null>(null);
  const champion = table?.[0]?.team;

  return (
    <div className="rounded-md border border-arena-line bg-arena-charcoal p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-label text-arena-mist">Season Simulator</p>
          <p className="mt-1 text-body-sm text-arena-mist">
            A home-and-away season between these {teams.length} clubs ({teams.length * (teams.length - 1)} matches).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTable(simulateSeason(teams))}
          className={cx(buttonStyles({ variant: "primary" }), "gap-2")}
        >
          {table ? <RotateCcw size={18} /> : <Play size={18} />}
          {table ? "Simulate Again" : "Simulate Season"}
        </button>
      </div>

      {table && champion && (
        <>
          <div className="mt-5 flex items-center gap-3 rounded-md bg-arena-charcoal-raised px-4 py-3">
            <Trophy size={20} className="text-arena-fog" aria-hidden="true" />
            <TeamLogo team={champion} size={32} />
            <p className="text-body font-semibold text-arena-fog">{champion.name}</p>
            <p className="text-body-sm text-arena-mist">{leagueName} champions</p>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <thead>
                <tr className="border-b border-arena-line text-label text-arena-mist">
                  {["#", "Team", "P", "W", "D", "L", "GD", "Pts"].map((h) => (
                    <th key={h} className="py-2 pr-3 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => (
                  <tr key={row.team.id} className="border-b border-arena-line last:border-b-0">
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">{i + 1}</td>
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2.5 text-body-sm text-arena-fog">
                        <TeamLogo team={row.team} size={22} />
                        {row.team.shortName}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">{row.played}</td>
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">{row.won}</td>
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">{row.drawn}</td>
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">{row.lost}</td>
                    <td className="py-2.5 pr-3 text-body-sm text-arena-mist">
                      {row.gf - row.ga > 0 ? "+" : ""}
                      {row.gf - row.ga}
                    </td>
                    <td className="py-2.5 pr-3 text-body-sm font-semibold text-arena-fog">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="mt-4 text-caption text-arena-smoke">
        A simulated season from the arena&rsquo;s ratings — not a real fixture list or table.
      </p>
    </div>
  );
}
