import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Captain } from "@/types";
import { getTeamById } from "@/data/teams";
import { buildAccentVars } from "@/lib/color";
import { Badge } from "@/components/ui/badge";

/**
 * Gallery card for /captains and the "related" strip on team detail
 * pages. Portrait crop, hover zoom (see master spec's CAPTAINS
 * section: "Hover: image becomes larger"), themed with the captain's
 * own club accent.
 */
export function CaptainCard({ captain }: { captain: Captain }) {
  const team = getTeamById(captain.teamId);
  if (!team) return null;
  const accentVars = buildAccentVars(team.colors);

  return (
    <Link
      href={`/captains/${captain.slug}`}
      style={accentVars as CSSProperties}
      className="group relative block aspect-[3/4] overflow-hidden rounded-md border border-arena-line bg-arena-charcoal shadow-card transition-[border-color,box-shadow] duration-300 hover:border-accent hover:shadow-elevated"
    >
      <Image
        src={captain.image}
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
        <Badge variant="accent">{captain.rating}</Badge>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="truncate text-body font-semibold text-arena-fog">{captain.name}</p>
        <p className="truncate text-caption text-arena-mist">
          {captain.position} · {team.shortName}
        </p>
      </div>
    </Link>
  );
}
