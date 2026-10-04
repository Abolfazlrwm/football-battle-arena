import type { Captain, Team } from "@/types";

/**
 * Centralized image configuration (see the master spec's IMAGES
 * section). Every team/captain visual in the data files is generated
 * here, from the team's own colors, rather than pointing at scraped or
 * licensed photography/crests.
 *
 * For production, replace the three functions below with real, licensed
 * assets (crests, stadium photography, player portraits) — nothing else
 * in the app needs to change, since every consumer reads `logo`,
 * `heroImage`, and `image` off the Team/Captain objects, never this
 * file directly.
 */

const PLACEHOLDER_HOST = "https://placehold.co";

function hex(color: string) {
  return color.replace("#", "");
}

function placeholderUrl(
  width: number,
  height: number,
  background: string,
  foreground: string,
  label: string
) {
  // .png: placehold.co defaults to SVG, which next/image blocks by
  // default for security. Requesting a raster format keeps image
  // optimization fully enabled without loosening that setting.
  return `${PLACEHOLDER_HOST}/${width}x${height}/${hex(background)}/${hex(
    foreground
  )}.png?text=${encodeURIComponent(label)}&font=roboto`;
}

type TeamColorSource = Pick<Team, "shortName" | "colors">;

/**
 * Raster placeholder for `Team.logo`. Nothing in the UI reads this
 * anymore — every on-screen crest renders through the original vector
 * <TeamCrest> component instead (see src/components/teams/team-crest.tsx),
 * since that avoids both the external image request and any real club
 * crest. This stays available for contexts that need a flat image URL
 * rather than a React component (e.g. a future OG-image or favicon).
 */
export function teamLogoImage(team: TeamColorSource): string {
  return placeholderUrl(256, 256, team.colors.primary, team.colors.secondary, team.shortName);
}

export function teamHeroImage(team: TeamColorSource): string {
  return placeholderUrl(1600, 2000, team.colors.secondary, team.colors.primary, team.shortName);
}

export function captainPortraitImage(
  captain: Pick<Captain, "name">,
  team: TeamColorSource
): string {
  return placeholderUrl(1200, 1500, team.colors.primary, team.colors.secondary, captain.name);
}
