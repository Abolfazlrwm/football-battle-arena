import type { Captain, Team } from "@/types";
import { contrastColor } from "@/lib/color";
import { cx } from "@/lib/cx";

/** Small round "shirt number" chip used where a captain appears at a few dozen pixels. */
export function CaptainAvatar({
  captain,
  team,
  size = 40,
  className,
}: {
  captain: Captain;
  team: Team;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 font-display font-extrabold",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        backgroundColor: team.colors.primary,
        borderColor: team.colors.secondary,
        color: contrastColor(team.colors.primary),
      }}
    >
      {captain.number}
    </span>
  );
}
