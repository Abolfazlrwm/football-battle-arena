import Link from "next/link";
import { Trophy } from "lucide-react";
import { leagues } from "@/data/leagues";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { LeagueCard } from "./league-card";

/** Homepage: the six leagues, plus a call-to-action for the Arena Cup. */
export function LeaguesStrip() {
  return (
    <section className="border-t border-arena-line py-16 lg:py-24">
      <Container>
        <p className="text-label text-arena-mist">Across Europe</p>
        <h2 className="mt-2 text-display-lg">Six leagues, one arena</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-lg border border-arena-line bg-arena-charcoal p-8 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <Trophy size={28} className="mt-1 shrink-0 text-arena-fog" aria-hidden="true" />
            <div>
              <h3 className="text-display-md">The Arena Cup</h3>
              <p className="mt-1 max-w-md text-body-sm text-arena-mist">
                Draw 8 or 16 clubs from every league and play the knockout rounds — extra time and penalties included.
              </p>
            </div>
          </div>
          <Link href="/tournament" className={buttonStyles({ variant: "primary", size: "lg" })}>
            Start a cup
          </Link>
        </div>
      </Container>
    </section>
  );
}
