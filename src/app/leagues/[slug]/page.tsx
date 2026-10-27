import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { leagues, getLeagueBySlug } from "@/data/leagues";
import { averageStats, teamsInLeague } from "@/lib/league";
import { Container } from "@/components/ui/container";
import { StatBar } from "@/components/ui/stat-bar";
import { TeamCard } from "@/components/teams/team-card";
import { SeasonSimulator } from "@/components/leagues/season-simulator";

export function generateStaticParams() {
  return leagues.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);
  if (!league) return {};
  return { title: league.name, description: league.description, openGraph: { title: league.name, description: league.description } };
}

export default async function LeaguePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const league = getLeagueBySlug(slug);
  if (!league) notFound();

  const list = teamsInLeague(league.name);
  const avg = averageStats(list);

  return (
    <main className="py-14 lg:py-20">
      <Container>
        <Link href="/leagues" className="text-body-sm text-arena-mist hover:text-arena-fog">← All leagues</Link>
        <p className="mt-4 text-label text-arena-mist">{league.country}</p>
        <h1 className="mt-1 text-display-xl uppercase">{league.name}</h1>
        <p className="mt-3 max-w-2xl text-body-lg text-arena-mist">{league.description}</p>

        <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
          <StatBar label="Avg. overall" value={Math.round(avg.overall)} />
          <StatBar label="Avg. attack" value={Math.round(avg.attack)} />
          <StatBar label="Avg. midfield" value={Math.round(avg.midfield)} />
          <StatBar label="Avg. defense" value={Math.round(avg.defense)} />
        </div>

        <h2 className="mt-14 text-display-md">Clubs, ranked by rating</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {list.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        <div className="mt-14">
          <SeasonSimulator teams={list} leagueName={league.name} />
        </div>
      </Container>
    </main>
  );
}
