"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import type { Team } from "@/types";
import { simulateMatch, type MatchEvent, type MatchResult } from "@/lib/simulate-match";
import { TeamCrest } from "@/components/teams/team-crest";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";

type Phase = "idle" | "playing" | "finished";

const TICK_MS = 26;

/**
 * The playable companion to <VerdictBanner>: actually "kicks off" the
 * match using /lib/simulate-match.ts, plays out goal events on a
 * running clock, and lands on a real win/loss/draw result. Re-rollable
 * ("Simulate Again") since it's a game mechanic, not a single verdict.
 */
export function MatchSimulator({
  teamA,
  teamB,
  accentA,
  accentB,
}: {
  teamA: Team;
  teamB: Team;
  accentA: string;
  accentB: string;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [clock, setClock] = useState(0);
  const [revealed, setRevealed] = useState<MatchEvent[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => clearTimer, []);

  function start() {
    clearTimer();
    const fresh = simulateMatch(teamA, teamB);
    setResult(fresh);
    setRevealed([]);
    setClock(0);
    setPhase("playing");

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setClock(90);
      setRevealed(fresh.events);
      setPhase("finished");
      return;
    }

    let minute = 0;
    intervalRef.current = setInterval(() => {
      minute += 1;
      setClock(minute);
      setRevealed((prev) => {
        const due = fresh.events.filter((e) => e.minute === minute);
        return due.length ? [...prev, ...due] : prev;
      });
      if (minute >= 90) {
        clearTimer();
        setPhase("finished");
      }
    }, TICK_MS);
  }

  const goalsA = revealed.filter((e) => e.teamId === teamA.id).length;
  const goalsB = revealed.filter((e) => e.teamId === teamB.id).length;
  const winnerAccent = result?.outcome === "A" ? accentA : result?.outcome === "B" ? accentB : undefined;

  return (
    <div className="rounded-md border border-arena-line bg-arena-charcoal p-6">
      <div className="flex items-center justify-between">
        <p className="text-label text-arena-mist">Simulated Match</p>
        {phase === "playing" && (
          <span className="flex items-center gap-1.5 text-caption text-arena-mist">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
            {clock}&rsquo;
          </span>
        )}
        {phase === "finished" && <span className="text-caption text-arena-smoke">Full Time</span>}
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-end">
          <p className="order-2 text-body-sm text-arena-fog sm:order-1">{teamA.shortName}</p>
          <span
            className="order-1 rounded-md sm:order-2"
            style={
              phase === "finished" && result?.outcome === "A"
                ? { boxShadow: `0 0 0 2px ${accentA}` }
                : undefined
            }
          >
            <TeamCrest team={teamA} size={36} />
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-sm bg-arena-charcoal-raised px-4 py-2 font-display text-display-md tabular-nums">
          <motion.span
            key={`a-${goalsA}`}
            initial={{ scale: 1.4, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {phase === "idle" ? "–" : goalsA}
          </motion.span>
          <span className="text-arena-smoke">:</span>
          <motion.span
            key={`b-${goalsB}`}
            initial={{ scale: 1.4, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {phase === "idle" ? "–" : goalsB}
          </motion.span>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <span
            className="rounded-md"
            style={
              phase === "finished" && result?.outcome === "B"
                ? { boxShadow: `0 0 0 2px ${accentB}` }
                : undefined
            }
          >
            <TeamCrest team={teamB} size={36} />
          </span>
          <p className="text-body-sm text-arena-fog">{teamB.shortName}</p>
        </div>
      </div>

      <div className="mt-5 flex min-h-[2.5rem] flex-col-reverse">
        <AnimatePresence initial={false}>
          {revealed
            .slice(-4)
            .reverse()
            .map((event) => {
              const scoringTeam = event.teamId === teamA.id ? teamA : teamB;
              return (
                <motion.div
                  key={`${event.teamId}-${event.minute}`}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 py-1 text-body-sm text-arena-mist"
                >
                  <span className="text-arena-fog">⚽ {event.minute}&rsquo;</span>
                  <span>Goal — {scoringTeam.name}</span>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {phase === "finished" && result && (
        <div className="mt-4 border-t border-arena-line pt-4 text-center">
          <p className="text-display-sm" style={{ color: winnerAccent }}>
            {result.outcome === "DRAW"
              ? "Draw"
              : `${result.outcome === "A" ? teamA.shortName : teamB.shortName} win`}
          </p>
          <p className="mt-1 text-body-sm text-arena-mist">
            Final score {result.teamAGoals}&ndash;{result.teamBGoals}
          </p>
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={start}
          disabled={phase === "playing"}
          className={cx(buttonStyles({ variant: "primary" }), "gap-2")}
        >
          {phase === "finished" ? <RotateCcw size={18} /> : <Play size={18} />}
          {phase === "idle" ? "Simulate Match" : phase === "playing" ? "Playing…" : "Simulate Again"}
        </button>
      </div>

      <p className="mt-3 text-center text-caption text-arena-smoke">
        A simulated result from the arena&rsquo;s ratings — not a real match.
      </p>
    </div>
  );
}
