import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { teams, getTeamBySlug } from "@/data/teams";
import { getCaptainByTeamId } from "@/data/captains";
import { battles } from "@/data/battles";
import { buildAccentVars } from "@/lib/color";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { StatBar } from "@/components/ui/stat-bar";
import { buttonStyles } from "@/components/ui/button";
import { TeamCard } from "@/components/teams/team-card";

export function generateStaticParams() {
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  return { title: team.name, description: team.description };
}

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const captain = getCaptainByTeamId(team.id);
  const accentVars = buildAccentVars(team.colors);
  const relatedBattles = battles.filter((b) => b.teamAId === team.id || b.teamBId === team.id);
  const relatedTeams = teams.filter((t) => t.league === team.league && t.id !== team.id).slice(0, 4);

  return (
    <main style={accentVars as CSSProperties}>
      <section className="relative overflow-hidden border-b border-arena-line">
        <div aria-hidden className="bg-accent-glow absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30" />
        <Container size="wide">
          <div className="flex flex-col gap-6 py-14 lg:flex-row lg:items-end lg:justify-between lg:py-20">
            <div className="flex items-center gap-5">
              <Image
                src={team.logo}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 rounded-md border border-arena-line-strong sm:h-[72px] sm:w-[72px]"
              />
              <div>
                <p className="text-label text-arena-mist">
                  {team.country} · {team.league}
                </p>
                <h1 className="mt-1 text-display-xl uppercase">{team.name}</h1>
                <p className="mt-1 text-body-sm text-arena-mist">
                  {team.stadium} · Est. {team.founded}
                </p>
              </div>
            </div>
            <Link href="/teams" className={buttonStyles({ variant: "secondary" })}>
              ← All Teams
            </Link>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-display-md">Overview</h2>
            <p className="mt-3 text-body-lg text-arena-mist">{team.description}</p>

            <h2 className="mt-12 text-display-md">Team Rating</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <StatBar label="Overall" value={team.stats.overall} accent />
              <StatBar label="Attack" value={team.stats.attack} accent />
              <StatBar label="Midfield" value={team.stats.midfield} accent />
              <StatBar label="Defense" value={team.stats.defense} accent />
            </div>

            {relatedBattles.length > 0 && (
              <>
                <h2 className="mt-12 text-display-md">Battles</h2>
                <div className="mt-5 flex flex-col gap-3">
                  {relatedBattles.map((b) => {
                    const opponentId = b.teamAId === team.id ? b.teamBId : b.teamAId;
                    const opponent = teams.find((t) => t.id === opponentId);
                    return (
                      <Link
                        key={b.id}
                        href={`/battles/${b.slug}`}
                        className="flex items-center justify-between rounded-md border border-arena-line bg-arena-charcoal px-5 py-4 transition-colors hover:border-arena-line-strong hover:bg-arena-charcoal-raised"
                      >
                        <span className="text-body font-medium text-arena-fog">{b.tagline}</span>
                        <span className="text-body-sm text-arena-mist">vs {opponent?.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {captain && (
              <Card>
                <p className="text-label text-arena-mist">Captain</p>
                <div className="mt-3 flex items-center gap-3">
                  <Image
                    src={captain.image}
                    alt=""
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-md border border-arena-line-strong object-cover"
                  />
                  <div>
                    <p className="text-display-sm">{captain.name}</p>
                    <p className="text-body-sm text-arena-mist">
                      {captain.position} · #{captain.number}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/captains/${captain.slug}`}
                  className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}
                >
                  View Captain
                </Link>
              </Card>
            )}

            <Card>
              <p className="text-label text-arena-mist">Club Info</p>
              <dl className="mt-3 flex flex-col gap-2 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Founded</dt>
                  <dd className="text-arena-fog">{team.founded}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Stadium</dt>
                  <dd className="text-arena-fog">{team.stadium}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">League</dt>
                  <dd className="text-arena-fog">{team.league}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Trophies</dt>
                  <dd className="text-arena-fog">{team.trophies}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>

        {relatedTeams.length > 0 && (
          <div className="border-t border-arena-line py-14">
            <h2 className="text-display-md">More from {team.league}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedTeams.map((t) => (
                <TeamCard key={t.id} team={t} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
