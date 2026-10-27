"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import type { Captain, Team } from "@/types";
import { leagues } from "@/data/leagues";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { RADAR_AXES, radarValues } from "@/lib/league";
import { cx } from "@/lib/cx";
import { buttonStyles } from "@/components/ui/button";
import { TeamLogo } from "@/components/teams/team-logo";
import { ComparisonRow } from "./comparison-row";
import { VerdictBanner } from "./verdict-banner";
import { MatchSimulator } from "./match-simulator";
import { OddsPanel } from "./odds-panel";
import { RadarChart } from "./radar-chart";

function TeamPicker({
  teams, value, exclude, onChange, label,
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
        {leagues.map((league) => {
          const options = teams.filter((t) => t.league === league.name && t.id !== exclude);
          if (options.length === 0) return null;
          return (
            <optgroup key={league.id} label={league.name}>
              {options.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </label>
  );
}

function TeamSummary({ team, captain, align }: { team: Team; captain?: Captain; align: "left" | "right" }) {
  return (
    <div className={cx("flex flex-col gap-2", align === "right" ? "items-end text-right" : "items-start text-left")}>
      <div className={cx("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
        <TeamLogo team={team} size={40} />
        <p className="text-display-sm uppercase">{team.shortName}</p>
      </div>
      {captain && <p className="text-body-sm text-arena-mist">{captain.name}</p>}
      <p className="text-caption text-arena-smoke">Formation {team.formation}</p>
    </div>
  );
}

/** Freeform Team A vs Team B comparator — pick any two clubs; the URL is shareable. */
export function BattleComparator({
  teams, defaultAId, defaultBId,
}: {
  teams: Team[];
  defaultAId?: string;
  defaultBId?: string;
}) {
  const [aId, setAId] = useState(defaultAId ?? teams[0]?.id);
  const [bId, setBId] = useState(defaultBId ?? teams[1]?.id);
  const [copied, setCopied] = useState(false);

  const teamA = teams.find((t) => t.id === aId) ?? teams[0];
  const teamB = teams.find((t) => t.id === bId) ?? teams[1];
  const captainA = getCaptainByTeamId(teamA.id);
  const captainB = getCaptainByTeamId(teamB.id);
  const accentA = buildAccentVars(teamA.colors)["--accent"];
  const accentB = buildAccentVars(teamB.colors)["--accent"];

  const select = (side: "a" | "b", id: string) => {
    const nextA = side === "a" ? id : teamA.id;
    const nextB = side === "b" ? id : teamB.id;
    if (side === "a") setAId(id); else setBId(id);
    setCopied(false);
    window.history.replaceState(null, "", `?a=${nextA}&b=${nextB}`);
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the address bar already holds the link */
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <TeamPicker teams={teams} value={teamA.id} exclude={teamB.id} onChange={(id) => select("a", id)} label="Team A" />
        <TeamPicker teams={teams} value={teamB.id} exclude={teamA.id} onChange={(id) => select("b", id)} label="Team B" />
      </div>

      <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
        <TeamSummary team={teamA} captain={captainA} align="right" />
        <span className="text-display-sm text-arena-smoke">VS</span>
        <TeamSummary team={teamB} captain={captainB} align="left" />
      </div>

      <div className="mt-5 flex justify-center">
        <button type="button" onClick={share} className={cx(buttonStyles({ variant: "ghost", size: "sm" }), "gap-2")}>
          {copied ? <Check size={16} /> : <Link2 size={16} />}
          {copied ? "Link copied" : "Copy link to this matchup"}
        </button>
      </div>

      <div className="mt-6">
        <VerdictBanner teamA={teamA} teamB={teamB} accentA={accentA} accentB={accentB} />
      </div>

      <div className="mt-8">
        <MatchSimulator key={`${teamA.id}-${teamB.id}`} teamA={teamA} teamB={teamB} accentA={accentA} accentB={accentB} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-arena-line bg-arena-charcoal p-6">
          <p className="text-label text-arena-mist">Shape of the matchup</p>
          <div className="mt-3">
            <RadarChart
              axes={RADAR_AXES}
              series={[
                { label: teamA.shortName, color: accentA, values: radarValues(teamA) },
                { label: teamB.shortName, color: accentB, values: radarValues(teamB) },
              ]}
            />
          </div>
          <div className="mt-2 flex justify-center gap-5 text-caption text-arena-mist">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentA }} />{teamA.shortName}</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: accentB }} />{teamB.shortName}</span>
          </div>
        </div>
        <OddsPanel key={`odds-${teamA.id}-${teamB.id}`} teamA={teamA} teamB={teamB} accentA={accentA} accentB={accentB} />
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
