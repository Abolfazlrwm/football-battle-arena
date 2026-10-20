import Link from "next/link";
import type { CSSProperties } from "react";
import type { Team } from "@/types";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { Badge } from "@/components/ui/badge";
import { TeamLogo } from "./team-logo";

/**
 * Reused across the homepage's Featured Teams strip, the /teams
 * directory grid, and the "more from this league" panel on team detail
 * pages. The club crest is the hero of the card, lit by the team's own
 * accent color (see /lib/color.ts), so each card reads as that club's
 * identity even inside a neutral grid.
 */
export function TeamCard({ team }: { team: Team }) {
  const captain = getCaptainByTeamId(team.id);
  const accentVars = buildAccentVars(team.colors);

  return (
    <Link
      href={`/teams/${team.slug}`}
      style={accentVars as CSSProperties}
      className="group relative block aspect-[3/4] overflow-hidden rounded-md border border-arena-line bg-arena-charcoal shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-elevated"
    >
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(90% 62% at 50% 30%, color-mix(in oklab, var(--accent) 42%, transparent) 0%, transparent 72%), linear-gradient(180deg, color-mix(in oklab, var(--accent) 14%, var(--arena-charcoal)) 0%, var(--arena-black) 100%)",
        }}
      />
      <div aria-hidden className="bg-arena-texture absolute inset-0 opacity-[0.05]" />

      <div className="absolute inset-x-0 top-[9%] flex justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110">
        <TeamLogo
          team={team}
          size={128}
          className="h-24 w-24 drop-shadow-[0_12px_26px_rgba(0,0,0,0.6)] sm:h-28 sm:w-28"
        />
      </div>

      <div aria-hidden className="bg-arena-vignette absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="bg-accent-glow absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-40"
      />

      <div className="absolute right-3 top-3">
        <Badge variant="accent">{team.stats.overall}</Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="truncate text-display-sm uppercase text-arena-fog">{team.shortName}</p>
        <p className="mt-0.5 truncate text-caption text-arena-mist">
          {team.league} · {team.formation}
        </p>
        {captain && (
          <p className="mt-2 truncate text-caption text-arena-mist">
            Captain: <span className="text-arena-fog">{captain.name}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
