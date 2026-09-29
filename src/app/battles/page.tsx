import type { Metadata } from "next";
import { teams } from "@/data/teams";
import { getFeaturedBattles } from "@/data/battles";
import { Container } from "@/components/ui/container";
import { BattleComparator } from "@/components/battles/battle-comparator";
import { FeaturedBattleCard } from "@/components/battles/featured-battle-card";

export const metadata: Metadata = {
  title: "Battles",
  description: "Compare any two clubs head-to-head — a visual stat comparison, not a match prediction.",
};

export default function BattlesPage() {
  const featured = getFeaturedBattles();

  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Battles</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          Pick any two clubs and compare them stat for stat. A visual comparison built from the
          arena&rsquo;s own ratings — not a real match prediction.
        </p>
        <div className="mt-10">
          <BattleComparator teams={teams} />
        </div>
      </Container>

      <div className="mt-16 border-t border-arena-line py-14">
        <Container>
          <h2 className="text-display-md">Featured Battles</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((battle) => (
              <FeaturedBattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        </Container>
      </div>
    </main>
  );
}
