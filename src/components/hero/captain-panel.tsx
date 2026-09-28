import Image from "next/image";
import type { Captain, Team } from "@/types";

/**
 * The captain image treatment: rounded panel, cover-fit image, a
 * vignette fading into the page, an accent-colored glow behind it, and
 * a very faint dot texture — all built with existing design-system
 * tokens/utilities. Real photography can drop straight into `image`
 * (see /data/images.ts) once licensed assets exist; the framing,
 * gradient, and glow around it don't need to change.
 */
export function CaptainPanel({ team, captain }: { team: Team; captain: Captain }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="bg-accent-glow absolute -inset-8 -z-10 opacity-60 blur-2xl transition-colors duration-500"
      />
      <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl border border-arena-line bg-arena-charcoal shadow-elevated lg:max-w-none">
        <div aria-hidden className="bg-arena-texture absolute inset-0 opacity-[0.06]" />
        <Image
          src={captain.image}
          alt={`${captain.name}, captain of ${team.name}`}
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
          priority
        />
        <div aria-hidden className="bg-arena-vignette absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-6">
          <Image
            src={team.logo}
            alt=""
            aria-hidden="true"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-sm border border-arena-line-strong"
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
