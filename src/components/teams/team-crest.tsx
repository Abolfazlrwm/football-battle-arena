import { contrastColor } from "@/lib/color";
import type { Team } from "@/types";

/**
 * An original, generated badge — not a reproduction of any real club
 * crest (see /data/images.ts header: no scraped or licensed marks are
 * bundled here). Built from the team's own colors and initials, so it
 * carries the right identity without any copyright/trademark risk.
 * Swap this out for a real, licensed crest asset once you have one —
 * every call site reads from here, so it's a one-file change.
 */

function initialsFor(team: Pick<Team, "shortName">): string {
  const words = team.shortName.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function TeamCrest({
  team,
  size = 40,
  className,
}: {
  team: Pick<Team, "shortName" | "colors">;
  size?: number;
  className?: string;
}) {
  const initials = initialsFor(team);
  const textColor = contrastColor(team.colors.primary);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M50 4 L92 18 L92 52 C92 76 74 92 50 97 C26 92 8 76 8 52 L8 18 Z"
        fill={team.colors.primary}
        stroke={team.colors.secondary}
        strokeWidth="5"
      />
      <text
        x="50"
        y="60"
        textAnchor="middle"
        fontFamily="var(--font-display), ui-sans-serif, sans-serif"
        fontWeight="800"
        fontSize="32"
        fill={textColor}
      >
        {initials}
      </text>
    </svg>
  );
}
