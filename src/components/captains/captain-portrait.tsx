import Image from "next/image";
import type { Captain, Team } from "@/types";
import { CAPTAIN_PHOTO_SLUGS } from "@/data/images";
import { CaptainArt } from "./captain-art";

/**
 * Fills its (relatively positioned) parent. Uses a real photo only for
 * captains listed in CAPTAIN_PHOTO_SLUGS (file at /public/captains/{slug}.webp);
 * everyone else gets the generated <CaptainArt> poster, so there are never
 * failed image requests and never a fake photo.
 */
export function CaptainPortrait({
  captain,
  team,
  priority = false,
  sizes,
}: {
  captain: Captain;
  team: Team;
  priority?: boolean;
  sizes?: string;
}) {
  if (CAPTAIN_PHOTO_SLUGS.includes(captain.slug)) {
    return (
      <Image
        src={`/captains/${captain.slug}.webp`}
        alt={`${captain.name}, captain of ${team.name}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return <CaptainArt captain={captain} team={team} />;
}
