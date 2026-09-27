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
  return `${PLACEHOLDER_HOST}/${width}x${height}/${hex(background)}/${hex(
    foreground
  )}?text=${encodeURIComponent(label)}&font=roboto`;
}

type TeamColorSource = Pick<Team, "shortName" | "colors">;

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
