import type { Metadata } from "next";
import { captains } from "@/data/captains";
import { Container } from "@/components/ui/container";
import { CaptainsDirectory } from "@/components/captains/captains-directory";

export const metadata: Metadata = {
  title: "Captains",
  description: "The twelve captains leading the Football Battle Arena's clubs.",
};

export default function CaptainsPage() {
  return (
    <main className="py-16 lg:py-20">
      <Container>
        <p className="text-label text-arena-mist">Football Battle Arena</p>
        <h1 className="mt-2 text-display-xl">Captains</h1>
        <p className="mt-3 max-w-xl text-body-lg text-arena-mist">
          The players wearing the armband — search by name or filter by position.
        </p>
        <CaptainsDirectory captains={captains} />
      </Container>
    </main>
  );
}
