import Link from "next/link";
import { teams } from "@/data/teams";
import { Container } from "@/components/ui/container";
import { TeamCard } from "./team-card";

/** A curated subset for the homepage — the full 12 live at /teams. */
const FEATURED_IDS = [
  "real-madrid",
  "barcelona",
  "manchester-city",
  "liverpool",
  "bayern-munich",
  "inter-milan",
];

export function FeaturedTeams() {
  const featured = teams.filter((t) => FEATURED_IDS.includes(t.id));

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-label text-arena-mist">The Arena</p>
            <h2 className="mt-2 text-display-lg">Featured Teams</h2>
          </div>
          <Link
            href="/teams"
            className="hidden shrink-0 text-body-sm text-accent hover:text-accent-strong sm:inline-flex"
          >
            View all teams →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>

        <Link
          href="/teams"
          className="mt-6 inline-flex text-body-sm text-accent hover:text-accent-strong sm:hidden"
        >
          View all teams →
        </Link>
      </Container>
    </section>
  );
}
