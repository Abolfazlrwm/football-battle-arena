import type { Metadata } from "next";
import { rankings } from "@/data/rankings";
import { teams } from "@/data/teams";
import { Container } from "@/components/ui/container";
import { RankingsTable } from "@/components/rankings/rankings-table";

export const metadata: Metadata = {
  title: "Rankings",
  description: "The arena's own comparison ranking across all 12 clubs — not an official league table.",
};

export default function RankingsPage() {
  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Rankings</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          The arena&rsquo;s own comparison ranking, based on each club&rsquo;s overall rating —
          not an official standings table.
        </p>
        <RankingsTable rankings={rankings} teams={teams} />
      </Container>
    </main>
  );
}
