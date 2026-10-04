import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Team } from "@/types";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { Badge } from "@/components/ui/badge";
import { TeamCrest } from "./team-crest";

/**
 * Reused across the homepage's Featured Teams strip, the /teams
 * directory grid, and the "more from this league" panel on team detail
 * pages — one card, three contexts. Carries its own team accent (see
 * /lib/color.ts) so it reads as that club's identity even inside a
 * neutral list.
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
      <Image
        src={team.heroImage}
        alt=""
        aria-hidden="true"
        fill
        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div aria-hidden className="bg-arena-vignette absolute inset-0" />
      <div
        aria-hidden
        className="bg-accent-glow absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-50"
      />

      <div className="absolute right-3 top-3">
        <Badge variant="accent">{team.stats.overall}</Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-center gap-2.5">
          <TeamCrest
            team={team}
            size={28}
            className="shrink-0 rounded-sm border border-arena-line-strong"
          />
          <div className="min-w-0">
            <p className="truncate text-body font-semibold text-arena-fog">{team.shortName}</p>
            <p className="truncate text-caption text-arena-mist">{team.league}</p>
          </div>
        </div>
        {captain && (
          <p className="mt-2 truncate text-caption text-arena-mist">
            Captain: <span className="text-arena-fog">{captain.name}</span>
          </p>
        )}
      </div>
    </Link>
  );
}
