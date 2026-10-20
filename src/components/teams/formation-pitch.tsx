import type { Captain, Team } from "@/types";
import { FORMATION_BLURBS, FORMATION_LAYOUTS, captainSlotIndex } from "@/lib/formations";
import { contrastColor } from "@/lib/color";
import { cx } from "@/lib/cx";
import { TeamLogo } from "./team-logo";

const LINE = "rgba(244,245,247,0.22)";

/**
 * A team's signature formation drawn on a tactical pitch. The captain
 * (the one player we have verified data for) sits on his real line with
 * his shirt number, name, and a "C" armband; the other ten slots are
 * shown by role only — we don't invent names for players we have no
 * data on. Markers "take their positions" with a staggered pop-in.
 */
export function FormationPitch({
  team,
  captain,
  className,
}: {
  team: Team;
  captain?: Captain;
  className?: string;
}) {
  const slots = FORMATION_LAYOUTS[team.formation];
  const captainIndex = captain
    ? captainSlotIndex(team.formation, captain.position, captain.roleHint)
    : -1;
  const shirtText = contrastColor(team.colors.primary);
  const ring = team.colors.secondary;

  return (
    <div className={cx("rounded-md border border-arena-line bg-arena-charcoal p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-label text-arena-mist">Signature Formation</p>
          <p className="mt-1 font-display text-display-md leading-none">{team.formation}</p>
        </div>
        <TeamLogo team={team} size={40} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
      </div>
      <p className="mt-2 text-body-sm text-arena-mist">{FORMATION_BLURBS[team.formation]}</p>

      <div className="bg-pitch relative mt-4 aspect-[2/3] w-full overflow-hidden rounded-md border border-arena-line-strong">
        <svg
          viewBox="0 0 100 150"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        >
          <g fill="none" stroke={LINE} strokeWidth="0.5">
            <rect x="3" y="3" width="94" height="144" />
            <line x1="3" y1="75" x2="97" y2="75" />
            <circle cx="50" cy="75" r="11" />
            <rect x="24" y="3" width="52" height="20" />
            <rect x="38" y="3" width="24" height="8" />
            <rect x="24" y="127" width="52" height="20" />
            <rect x="38" y="139" width="24" height="8" />
            <path d="M 40 23 A 11 11 0 0 0 60 23" />
            <path d="M 40 127 A 11 11 0 0 1 60 127" />
          </g>
        </svg>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.1]"
        >
          <TeamLogo team={team} size={96} />
        </div>

        <ol className="absolute inset-0 m-0 list-none p-0" aria-label={`${team.name} ${team.formation} formation`}>
          {slots.map((slot, i) => {
            const isCaptain = i === captainIndex && !!captain;
            return (
              <li
                key={`${slot.role}-${i}`}
                className="absolute"
                style={{
                  left: `${slot.x}%`,
                  bottom: `${slot.y}%`,
                  transform: "translate(-50%, 50%)",
                }}
              >
                <div
                  className="animate-pop-in flex flex-col items-center gap-1"
                  style={{ animationDelay: `${i * 70}ms` }}
                  title={isCaptain && captain ? `${captain.name} — ${slot.roleName} (captain)` : slot.roleName}
                >
                  <div className="relative">
                    <div
                      className={cx(
                        "flex items-center justify-center rounded-full border-2 font-display font-extrabold shadow-[0_4px_10px_rgba(0,0,0,0.45)]",
                        isCaptain ? "h-10 w-10 text-body" : "h-7 w-7 text-[10px]"
                      )}
                      style={{
                        backgroundColor: team.colors.primary,
                        borderColor: isCaptain ? ring : "rgba(244,245,247,0.35)",
                        color: shirtText,
                        boxShadow: isCaptain ? `0 0 0 3px ${ring}55, 0 6px 14px rgba(0,0,0,0.5)` : undefined,
                      }}
                    >
                      {isCaptain && captain ? captain.number : slot.role}
                    </div>
                    {isCaptain && (
                      <span
                        className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-arena-fog font-body text-[9px] font-bold text-arena-black"
                        aria-hidden="true"
                      >
                        C
                      </span>
                    )}
                  </div>
                  {isCaptain && captain && (
                    <span className="whitespace-nowrap rounded-sm bg-arena-black/80 px-1.5 py-0.5 text-caption text-arena-fog">
                      {captain.name}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-3 text-caption text-arena-smoke">
        The arena&rsquo;s signature shape for {team.shortName}. The captain is shown on his line;
        other positions are illustrative — real line-ups change from match to match.
      </p>
    </div>
  );
}
