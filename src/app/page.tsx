import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-label text-arena-mist">Phase 02 — Design system</p>
      <h1 className="text-display-2xl">
        FOOTBALL
        <br />
        BATTLE ARENA
      </h1>
      <p className="max-w-md text-body text-arena-mist">
        Choose your team. Meet its captain. Enter the arena. The design
        system is now in place — navigation, data, and the hero engine
        come in the phases ahead.
      </p>
      <Link
        href="/design-system"
        className="text-body-sm text-accent underline underline-offset-4 hover:text-accent-strong"
      >
        View the design system reference
      </Link>
    </main>
  );
}
