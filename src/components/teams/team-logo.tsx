"use client";

import { useState } from "react";
import Image from "next/image";
import type { Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamCrest } from "./team-crest";

/**
 * Every team logo in the app renders through this component. It loads
 * the real file at /public/logos/{slug}.webp and, if that file is
 * missing or fails to load, falls back to the generated <TeamCrest>
 * badge — so logos can be added or replaced one at a time with no code
 * changes. See public/logos/README.md.
 */
export function TeamLogo({
  team,
  size = 40,
  className,
}: {
  team: Team;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <TeamCrest team={team} size={size} className={className} />;
  }

  return (
    <Image
      src={`/logos/${team.slug}.webp`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cx("object-contain", className)}
      onError={() => setFailed(true)}
    />
  );
}
