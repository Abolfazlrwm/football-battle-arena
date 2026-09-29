import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { captains, getCaptainBySlug } from "@/data/captains";
import { getTeamById } from "@/data/teams";
import { buildAccentVars } from "@/lib/color";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatBar } from "@/components/ui/stat-bar";
import { buttonStyles } from "@/components/ui/button";

export function generateStaticParams() {
  return captains.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const captain = getCaptainBySlug(slug);
  if (!captain) return {};
  return { title: captain.name, description: captain.bio };
}

export default async function CaptainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const captain = getCaptainBySlug(slug);
  if (!captain) notFound();

  const team = getTeamById(captain.teamId);
  if (!team) notFound();

  const accentVars = buildAccentVars(team.colors);

  return (
    <main style={accentVars as CSSProperties}>
      <section className="relative overflow-hidden border-b border-arena-line">
        <div aria-hidden className="bg-accent-glow absolute inset-x-0 top-0 -z-10 h-[480px] opacity-30" />
        <Container size="wide">
          <div className="grid gap-10 py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
            <div>
              <Link href="/captains" className="text-body-sm text-arena-mist hover:text-arena-fog">
                ← All Captains
              </Link>
              <p className="mt-4 text-label text-arena-mist">
                {team.name} · #{captain.number}
              </p>
              <h1 className="mt-2 text-display-xl uppercase">{captain.name}</h1>
              <p className="mt-2 text-body-lg text-arena-mist">
                {captain.position} · {captain.nationality}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Badge variant="accent">Rating {captain.rating}</Badge>
                <Badge variant="outline">{captain.position}</Badge>
                <Badge variant="outline">{captain.nationality}</Badge>
              </div>

              <p className="mt-6 max-w-md text-body text-arena-mist">{captain.bio}</p>

              <Link
                href={`/teams/${team.slug}`}
                className={buttonStyles({ variant: "secondary", size: "lg", className: "mt-8" })}
              >
                View {team.shortName}
              </Link>
            </div>

            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl border border-arena-line bg-arena-charcoal shadow-elevated lg:max-w-none">
              <div aria-hidden className="bg-arena-texture absolute inset-0 opacity-[0.06]" />
              <Image
                src={captain.image}
                alt={`${captain.name}, captain of ${team.name}`}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
                priority
              />
              <div aria-hidden className="bg-arena-vignette absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
                <Image
                  src={team.logo}
                  alt=""
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-sm border border-arena-line-strong"
                />
                <p className="text-body-sm text-arena-mist">{team.name}</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid gap-10 py-14 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-display-md">Attacking &amp; Technical</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <StatBar label="Pace" value={captain.stats.pace} accent />
              <StatBar label="Shooting" value={captain.stats.shooting} accent />
              <StatBar label="Passing" value={captain.stats.passing} accent />
              <StatBar label="Dribbling" value={captain.stats.dribbling} accent />
            </div>

            <h2 className="mt-12 text-display-md">Physical &amp; Defensive</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <StatBar label="Defending" value={captain.stats.defending} accent />
              <StatBar label="Physical" value={captain.stats.physical} accent />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <p className="text-label text-arena-mist">Club</p>
              <div className="mt-3 flex items-center gap-3">
                <Image
                  src={team.logo}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-md border border-arena-line-strong"
                />
                <div>
                  <p className="text-display-sm">{team.shortName}</p>
                  <p className="text-body-sm text-arena-mist">{team.league}</p>
                </div>
              </div>
              <Link
                href={`/teams/${team.slug}`}
                className={buttonStyles({ variant: "secondary", size: "sm", className: "mt-4 w-full" })}
              >
                View Team
              </Link>
            </Card>

            <Card>
              <p className="text-label text-arena-mist">Profile</p>
              <dl className="mt-3 flex flex-col gap-2 text-body-sm">
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Position</dt>
                  <dd className="text-arena-fog">{captain.position}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Number</dt>
                  <dd className="text-arena-fog">#{captain.number}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Nationality</dt>
                  <dd className="text-arena-fog">{captain.nationality}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-arena-mist">Rating</dt>
                  <dd className="text-arena-fog">{captain.rating}</dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
