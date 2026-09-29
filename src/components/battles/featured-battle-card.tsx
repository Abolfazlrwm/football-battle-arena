import Image from "next/image";
import Link from "next/link";
import type { Battle } from "@/types";
import { getTeamById } from "@/data/teams";

export function FeaturedBattleCard({ battle }: { battle: Battle }) {
  const teamA = getTeamById(battle.teamAId);
  const teamB = getTeamById(battle.teamBId);
  if (!teamA || !teamB) return null;

  return (
    <Link
      href={`/battles/${battle.slug}`}
      className="block rounded-md border border-arena-line bg-arena-charcoal p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-arena-line-strong hover:shadow-elevated"
    >
      <p className="text-label text-arena-mist">{battle.tagline}</p>
      <div className="mt-4 flex items-center justify-center gap-4">
        <Image src={teamA.logo} alt={teamA.name} width={44} height={44} className="h-11 w-11 rounded-sm" />
        <span className="text-display-sm text-arena-smoke">VS</span>
        <Image src={teamB.logo} alt={teamB.name} width={44} height={44} className="h-11 w-11 rounded-sm" />
      </div>
      <p className="mt-4 text-center text-body-sm text-arena-mist">
        {teamA.shortName} vs {teamB.shortName}
      </p>
    </Link>
  );
}
