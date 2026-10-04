"use client";

import { useState } from "react";
import type { Captain, Team } from "@/types";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { cx } from "@/lib/cx";
import { TeamCrest } from "@/components/teams/team-crest";
import { ComparisonRow } from "./comparison-row";
import { VerdictBanner } from "./verdict-banner";

function TeamPicker({
  teams,
  value,
  exclude,
  onChange,
  label,
}: {
  teams: Team[];
  value: string;
  exclude: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <label className="block">
      <span className="text-label text-arena-mist">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-sm border border-arena-line bg-arena-charcoal px-3 text-body-sm text-arena-fog focus-visible:border-accent"
      >
        {teams
          .filter((t) => t.id !== exclude)
          .map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
      </select>
    </label>
  );
}

function TeamSummary({
  team,
  captain,
  align,
}: {
  team: Team;
  captain?: Captain;
  align: "left" | "right";
}) {
  return (
    <div className={cx("flex flex-col gap-2", align === "right" ? "items-end text-right" : "items-start text-left")}>
      <div className={cx("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
        <TeamCrest team={team} size={40} />
        <p className="text-display-sm uppercase">{team.shortName}</p>
      </div>
      {captain && <p className="text-body-sm text-arena-mist">{captain.name}</p>}
    </div>
  );
}

/** Freeform Team A vs Team B comparator — pick any two clubs. */
export function BattleComparator({
  teams,
  defaultAId,
  defaultBId,
}: {
  teams: Team[];
  defaultAId?: string;
  defaultBId?: string;
}) {
  const [aId, setAId] = useState(defaultAId ?? teams[0]?.id);
  const [bId, setBId] = useState(defaultBId ?? teams[1]?.id);

  const teamA = teams.find((t) => t.id === aId) ?? teams[0];
  const teamB = teams.find((t) => t.id === bId) ?? teams[1];
  const captainA = getCaptainByTeamId(teamA.id);
  const captainB = getCaptainByTeamId(teamB.id);
  const accentA = buildAccentVars(teamA.colors)["--accent"];
  const accentB = buildAccentVars(teamB.colors)["--accent"];

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <TeamPicker teams={teams} value={teamA.id} exclude={teamB.id} onChange={setAId} label="Team A" />
        <TeamPicker teams={teams} value={teamB.id} exclude={teamA.id} onChange={setBId} label="Team B" />
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
        <TeamSummary team={teamA} captain={captainA} align="right" />
        <span className="text-display-sm text-arena-smoke">VS</span>
        <TeamSummary team={teamB} captain={captainB} align="left" />
      </div>

      <div className="mt-8">
        <VerdictBanner teamA={teamA} teamB={teamB} accentA={accentA} accentB={accentB} />
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <ComparisonRow label="Overall" aValue={teamA.stats.overall} bValue={teamB.stats.overall} accentA={accentA} accentB={accentB} />
        <ComparisonRow label="Attack" aValue={teamA.stats.attack} bValue={teamB.stats.attack} accentA={accentA} accentB={accentB} />
        <ComparisonRow label="Midfield" aValue={teamA.stats.midfield} bValue={teamB.stats.midfield} accentA={accentA} accentB={accentB} />
        <ComparisonRow label="Defense" aValue={teamA.stats.defense} bValue={teamB.stats.defense} accentA={accentA} accentB={accentB} />
        <ComparisonRow
          label="Trophies"
          aValue={teamA.trophies}
          bValue={teamB.trophies}
          max={Math.max(teamA.trophies, teamB.trophies, 1)}
          accentA={accentA}
          accentB={accentB}
        />
      </div>
    </div>
  );
}
