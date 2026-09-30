import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <Container size="narrow" className="text-center">
        <p className="text-label text-arena-mist">404</p>
        <h1 className="mt-3 text-display-xl">Off the Pitch</h1>
        <p className="mt-4 text-body-lg text-arena-mist">
          This page doesn&rsquo;t exist in the arena. It may have moved, or the match never
          happened.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonStyles({ variant: "primary" })}>
            Back to the Arena
          </Link>
          <Link href="/teams" className={buttonStyles({ variant: "secondary" })}>
            Browse Teams
          </Link>
        </div>
      </Container>
    </main>
  );
}
