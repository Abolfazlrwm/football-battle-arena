import Link from "next/link";
import { navLinks } from "@/components/navigation/nav-links";

/**
 * No social links here on purpose: this is a concept project with no
 * real social accounts, and placeholder links to "#" would be a broken
 * promise rather than a helpful affordance. The disclaimer line covers
 * the same ground honestly instead.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-arena-line">
      <div className="arena-container-wide py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-display-sm">
              BATTLE<span className="text-accent">XI</span>
            </p>
            <p className="mt-3 text-body-sm text-arena-mist">
              Choose your team. Meet its captain. Enter the arena. A cinematic
              football team universe built around head-to-head comparisons —
              not real match predictions or official standings.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-4">
            {navLinks
              .filter((link) => link.href !== "/")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-sm text-arena-mist hover:text-arena-fog"
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-arena-line pt-6">
          <p className="text-caption text-arena-smoke">
            © {year} Football Battle Arena — an independent concept project with no
            affiliation to any club, league, or federation. Club colors and stats
            are used illustratively.
          </p>
        </div>
      </div>
    </footer>
  );
}
