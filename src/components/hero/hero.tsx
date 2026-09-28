"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { teams, getTeamById } from "@/data/teams";
import { getCaptainByTeamId } from "@/data/captains";
import { buildAccentVars } from "@/lib/color";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { StatBar } from "@/components/ui/stat-bar";
import { TeamSelector } from "./team-selector";
import { CaptainPanel } from "./captain-panel";

const DEFAULT_TEAM_ID = "real-madrid";

/**
 * The cinematic hero: pick a team, its captain becomes the visual
 * subject, --accent re-themes the whole panel through the cascade (see
 * /lib/color.ts), and the switch animates rather than jump-cuts (see
 * the master spec's HERO INTERACTION section).
 */
export function Hero() {
  const [selectedId, setSelectedId] = useState(DEFAULT_TEAM_ID);
  const team = getTeamById(selectedId) ?? teams[0];
  const captain = getCaptainByTeamId(team.id);
  const accentVars = useMemo(() => buildAccentVars(team.colors), [team]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        style={accentVars as CSSProperties}
        className="relative overflow-hidden border-b border-arena-line"
      >
        <div
          aria-hidden
          className="bg-accent-glow absolute inset-x-0 top-0 -z-10 h-[520px] opacity-30 transition-colors duration-500"
        />

        <Container size="wide">
          <div className="grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <p className="text-label text-arena-mist">Football Battle Arena</p>
                <h1 className="mt-3 text-display-2xl uppercase text-arena-fog">{team.name}</h1>
                <p className="mt-4 max-w-md text-body-lg text-arena-mist">{team.description}</p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/teams" className={buttonStyles({ variant: "primary", size: "lg" })}>
                    Enter Arena
                  </Link>
                  <Link
                    href={`/teams/${team.slug}`}
                    className={buttonStyles({ variant: "secondary", size: "lg" })}
                  >
                    View Team
                  </Link>
                </div>

                <div className="mt-10 grid max-w-sm grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5">
                  <StatBar label="Attack" value={team.stats.attack} accent />
                  <StatBar label="Midfield" value={team.stats.midfield} accent />
                  <StatBar label="Defense" value={team.stats.defense} accent />
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {captain && (
                <motion.div
                  key={captain.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <CaptainPanel team={team} captain={captain} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>

        <TeamSelector teams={teams} selectedId={team.id} onSelect={setSelectedId} />
      </section>
    </MotionConfig>
  );
}
