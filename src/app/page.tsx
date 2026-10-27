import { Hero } from "@/components/hero/hero";
import { FeaturedTeams } from "@/components/teams/featured-teams";
import { LeaguesStrip } from "@/components/leagues/leagues-strip";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedTeams />
      <LeaguesStrip />
    </main>
  );
}
