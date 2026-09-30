import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { battles, getBattleBySlug } from "@/data/battles";
import { getTeamById } from "@/data/teams";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { ComparisonRow } from "@/components/battles/comparison-row";
import { cx } from "@/lib/cx";
import type { Captain, Team } from "@/types";

export function generateStaticParams() {
  return battles.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const battle = getBattleBySlug(slug);
  if (!battle) return {};
  const teamA = getTeamById(battle.teamAId);
  const teamB = getTeamById(battle.teamBId);
  const title = `${teamA?.name} vs ${teamB?.name}`;
  const description = `${battle.tagline} — a Football Battle Arena comparison.`;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

function TeamSide({
  team,
  captain,
  align,
}: {
  team: Team;
  captain?: Captain;
  align: "start" | "end";
}) {
  return (
    <div
      className={cx(
        "flex flex-col items-center gap-3 text-center",
        align === "end" ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"
      )}
    >
      <Image
        src={team.logo}
        alt={team.name}
        width={80}
        height={80}
        className="h-16 w-16 rounded-md border border-arena-line-strong sm:h-20 sm:w-20"
      />
      <div>
        <p className="text-display-md uppercase">{team.shortName}</p>
        <p className="text-body-sm text-arena-mist">{team.league}</p>
      </div>
      {captain && (
        <div className="flex items-center gap-2 rounded-sm border border-arena-line bg-arena-charcoal px-3 py-2">
          <Image src={captain.image} alt="" width={28} height={28} className="h-7 w-7 rounded-sm object-cover" />
          <span className="text-body-sm text-arena-fog">{captain.name}</span>
        </div>
      )}
    </div>
  );
}

export default async function BattleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const battle = getBattleBySlug(slug);
  if (!battle) notFound();

  const teamA = getTeamById(battle.teamAId);
  const teamB = getTeamById(battle.teamBId);
  if (!teamA || !teamB) notFound();

  const captainA = getCaptainByTeamId(teamA.id);
  const captainB = getCaptainByTeamId(teamB.id);
  const accentA = buildAccentVars(teamA.colors)["--accent"];
  const accentB = buildAccentVars(teamB.colors)["--accent"];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-arena-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background: `linear-gradient(90deg, ${accentA} 0%, transparent 45%, transparent 55%, ${accentB} 100%)`,
          }}
        />
        <Container size="wide">
          <div className="py-6">
            <Link href="/battles" className="text-body-sm text-arena-mist hover:text-arena-fog">
              ← All Battles
            </Link>
          </div>
          <h1 className="sr-only">
            {teamA.name} vs {teamB.name}
          </h1>
          <div className="grid grid-cols-1 items-center gap-10 pb-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:pb-24">
            <TeamSide team={teamA} captain={captainA} align="end" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-label text-arena-mist">{battle.tagline}</p>
              <p className="text-display-2xl text-arena-smoke">VS</p>
            </div>
            <TeamSide team={teamB} captain={captainB} align="start" />
          </div>
        </Container>
      </section>

      <Container size="narrow">
        <div className="py-14">
          <h2 className="text-center text-display-md">Head to Head</h2>
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

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={`/teams/${teamA.slug}`} className={buttonStyles({ variant: "secondary" })}>
              View {teamA.shortName}
            </Link>
            <Link href={`/teams/${teamB.slug}`} className={buttonStyles({ variant: "secondary" })}>
              View {teamB.shortName}
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
