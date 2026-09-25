import Link from "next/link";

/**
 * Compact clash mark (two opposing wedges) + wordmark. Uses currentColor
 * so it inherits text-accent — once team data drives --accent, the mark
 * re-themes with the rest of the UI for free.
 */
export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-arena-fog"
      aria-label="Football Battle Arena — home"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-accent"
      >
        <polygon points="4,7 4,25 15,16" fill="currentColor" />
        <polygon points="28,7 28,25 17,16" fill="currentColor" opacity="0.45" />
      </svg>
      <span className="font-display text-display-sm leading-none">
        BATTLE<span className="text-accent">XI</span>
      </span>
    </Link>
  );
}