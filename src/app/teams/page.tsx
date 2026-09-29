import type { Metadata } from "next";
import { teams } from "@/data/teams";
import { Container } from "@/components/ui/container";
import { TeamsDirectory } from "@/components/teams/teams-directory";

export const metadata: Metadata = {
  title: "Teams",
  description: "Browse all clubs in the Football Battle Arena — twelve teams across five leagues.",
};

export default function TeamsPage() {
  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Teams</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          Twelve clubs, five leagues. Search by name or filter by league to find your team.
        </p>
        <TeamsDirectory teams={teams} />
      </Container>
    </main>
  );
}
