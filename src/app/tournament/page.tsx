import type { Metadata } from "next";
import { teams } from "@/data/teams";
import { Container } from "@/components/ui/container";
import { ArenaCup } from "@/components/tournament/arena-cup";

export const metadata: Metadata = {
  title: "Arena Cup",
  description: "Draw a field of clubs and play a knockout cup — round by round or all at once.",
};

export default function TournamentPage() {
  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Arena Cup</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          Pick a field of 8 or 16 clubs from across all six leagues, then play the knockout rounds and crown a champion.
        </p>
        <div className="mt-10">
          <ArenaCup teams={teams} />
        </div>
      </Container>
    </main>
  );
}
