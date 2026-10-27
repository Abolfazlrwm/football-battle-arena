import type { Metadata } from "next";
import { leagues } from "@/data/leagues";
import { averageStats, teamsInLeague } from "@/lib/league";
import { Container } from "@/components/ui/container";
import { LeagueCard } from "@/components/leagues/league-card";

export const metadata: Metadata = {
  title: "Leagues",
  description: "Six European leagues, four clubs each — compare them league by league.",
};

export default function LeaguesPage() {
  const strength = leagues
    .map((league) => ({ league, avg: averageStats(teamsInLeague(league.name)).overall }))
    .sort((a, b) => b.avg - a.avg);
  const top = strength[0]?.avg ?? 100;

  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Leagues</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          Six leagues, four clubs each. Open a league to see its clubs ranked and play out a full season.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>

        <h2 className="mt-16 text-display-md">League strength</h2>
        <p className="mt-2 max-w-xl text-body-sm text-arena-mist">
          Average overall rating of the arena&rsquo;s clubs in each league — the arena&rsquo;s own figures, not an official coefficient.
        </p>
        <ul className="mt-6 flex max-w-xl flex-col gap-4">
          {strength.map(({ league, avg }) => (
            <li key={league.id}>
              <div className="mb-1.5 flex justify-between text-label text-arena-mist">
                <span>{league.name}</span>
                <span className="text-arena-fog">{avg.toFixed(1)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-arena-charcoal-raised">
                <div className="h-full rounded-full bg-arena-fog/70" style={{ width: `${((avg - 60) / (top - 60 + 0.001)) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
