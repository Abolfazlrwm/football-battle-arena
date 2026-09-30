import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description: "What Football Battle Arena is, and what it isn't.",
};

export default function AboutPage() {
  return (
    <main className="py-16 lg:py-24">
      <Container size="narrow">
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">About</h1>

        <div className="mt-8 flex flex-col gap-6 text-body-lg text-arena-mist">
          <p>
            Football Battle Arena presents football clubs as competing teams
            inside an interactive arena. Choose your team, meet its captain, and
            compare it against any other club — stat for stat.
          </p>
          <p>
            Every club is represented by its current captain. Team and captain
            ratings — Attack, Midfield, Defense, and the overall score used
            throughout the site — are the arena&rsquo;s own illustrative
            comparison figures, not an official strength index or a real match
            prediction.
          </p>
          <p>
            Club crests and player photography shown here are placeholders
            generated from each team&rsquo;s real colors, standing in for
            licensed assets. Club names, colors, stadiums, and captains are
            accurate to the best of our sources at the time of writing.
          </p>
          <p>
            This is an independent concept project with no affiliation to any
            football club, league, or federation.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/teams" className={buttonStyles({ variant: "primary" })}>
            Browse Teams
          </Link>
          <Link href="/battles" className={buttonStyles({ variant: "secondary" })}>
            Start a Battle
          </Link>
        </div>
      </Container>
    </main>
  );
}
