import Link from "next/link";
import type { League } from "@/types";
import { averageStats, teamsInLeague } from "@/lib/league";
import { TeamLogo } from "@/components/teams/team-logo";

export function LeagueCard({ league }: { league: League }) {
  const list = teamsInLeague(league.name);
  const avg = averageStats(list);
  return (
    <Link
      href={`/leagues/${league.slug}`}
      className="group block rounded-md border border-arena-line bg-arena-charcoal p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-arena-line-strong hover:shadow-elevated"
    >
      <p className="text-label text-arena-mist">{league.country}</p>
      <h3 className="mt-1 text-display-md">{league.name}</h3>
      <p className="mt-1 text-body-sm text-arena-mist">{league.tagline}</p>
      <div className="mt-5 flex items-center -space-x-2">
        {list.map((t) => (
          <span key={t.id} className="rounded-full bg-arena-black p-1 ring-2 ring-arena-charcoal">
            <TeamLogo team={t} size={32} />
          </span>
        ))}
      </div>
      <p className="mt-4 text-caption text-arena-smoke">
        {list.length} clubs · avg rating {avg.overall.toFixed(1)}
      </p>
    </Link>
  );
}
