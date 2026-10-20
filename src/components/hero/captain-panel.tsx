import type { Captain, Team } from "@/types";
import { TeamLogo } from "@/components/teams/team-logo";
import { CaptainPortrait } from "@/components/captains/captain-portrait";

/**
 * The captain visual: a rounded panel holding the captain portrait (a
 * generated poster by default, or a real photo once one is added — see
 * CaptainPortrait), a vignette fading into the page, and an
 * accent-colored glow behind it. The framing doesn't change either way.
 */
export function CaptainPanel({ team, captain }: { team: Team; captain: Captain }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="bg-accent-glow absolute -inset-8 -z-10 opacity-60 blur-2xl transition-colors duration-500"
      />
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl border border-arena-line bg-arena-charcoal shadow-elevated lg:ml-auto lg:mr-0 lg:max-w-[440px]">
        <CaptainPortrait
          captain={captain}
          team={team}
          priority
          sizes="(min-width: 1024px) 40vw, 90vw"
        />
        <div aria-hidden className="bg-arena-vignette absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
          <TeamLogo
            team={team}
            size={40}
            className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          />
          <div className="min-w-0">
            <p className="truncate text-display-sm text-arena-fog">{captain.name}</p>
            <p className="truncate text-body-sm text-arena-mist">
              {captain.position} · #{captain.number} · {captain.nationality}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
