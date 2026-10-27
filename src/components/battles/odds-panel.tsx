"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import type { Team } from "@/types";
import { simulateMany, type OddsSummary } from "@/lib/simulate-match";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";

const RUNS = 2000;

/** "Arena Odds": replays the matchup thousands of times and shows how it tends to go. */
export function OddsPanel({
  teamA,
  teamB,
  accentA,
  accentB,
}: {
  teamA: Team;
  teamB: Team;
  accentA: string;
  accentB: string;
}) {
  const [odds, setOdds] = useState<OddsSummary | null>(null);

  return (
    <div className="rounded-md border border-arena-line bg-arena-charcoal p-6">
      <p className="text-label text-arena-mist">Arena Odds</p>
      {!odds ? (
        <p className="mt-2 text-body-sm text-arena-mist">
          Replay this matchup {RUNS.toLocaleString()} times to see how it tends to go.
        </p>
      ) : (
        <div className="mt-4">
          <div className="flex justify-between text-body-sm">
            <span className="text-arena-fog">
              {teamA.shortName} <strong>{odds.aWinPct.toFixed(1)}%</strong>
            </span>
            <span className="text-arena-mist">Draw {odds.drawPct.toFixed(1)}%</span>
            <span className="text-arena-fog">
              <strong>{odds.bWinPct.toFixed(1)}%</strong> {teamB.shortName}
            </span>
          </div>
          <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-arena-charcoal-raised">
            <div style={{ width: `${odds.aWinPct}%`, backgroundColor: accentA }} />
            <div className="bg-arena-smoke/60" style={{ width: `${odds.drawPct}%` }} />
            <div style={{ width: `${odds.bWinPct}%`, backgroundColor: accentB }} />
          </div>
          <p className="mt-3 text-caption text-arena-mist">
            Average goals: {teamA.shortName} {odds.avgGoalsA.toFixed(2)} · {teamB.shortName}{" "}
            {odds.avgGoalsB.toFixed(2)}
          </p>
          <p className="mt-4 text-label text-arena-smoke">Most common scorelines</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {odds.topScorelines.map((s) => (
              <li key={s.score} className="flex items-center gap-3 text-body-sm">
                <span className="w-12 tabular-nums text-arena-fog">{s.score}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-arena-charcoal-raised">
                  <span className="block h-full rounded-full bg-arena-fog/50" style={{ width: `${Math.min(100, s.pct * 4)}%` }} />
                </span>
                <span className="w-12 text-right text-caption text-arena-mist">{s.pct.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOdds(simulateMany(teamA, teamB, RUNS))}
        className={cx(buttonStyles({ variant: "secondary", size: "sm" }), "mt-5 gap-2")}
      >
        <BarChart3 size={16} />
        {odds ? "Run again" : `Run ${RUNS.toLocaleString()} simulations`}
      </button>
      <p className="mt-3 text-caption text-arena-smoke">
        Based on the arena&rsquo;s own ratings — not a real match prediction.
      </p>
    </div>
  );
}
