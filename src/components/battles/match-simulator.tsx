"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import type { Team } from "@/types";
import { simulateMatch, type MatchEvent, type MatchResult } from "@/lib/simulate-match";
import { TeamLogo } from "@/components/teams/team-logo";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { contrastColor } from "@/lib/color";

type Phase = "idle" | "playing" | "finished";

const TICK_MS = 30;

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
  const latestGoal = revealed.length > 0 ? revealed[revealed.length - 1] : null;
  const winnerAccent = result?.outcome === "A" ? accentA : result?.outcome === "B" ? accentB : undefined;

  /** Winner glows + scales up after full time; loser dims. Draw/idle: neutral. */
  function crestStyle(side: "A" | "B"): React.CSSProperties | undefined {
    if (phase !== "finished" || !result || result.outcome === "DRAW") return undefined;
    const isWinner = result.outcome === side;
    const accent = side === "A" ? accentA : accentB;
    return isWinner
      ? { filter: `drop-shadow(0 0 10px ${accent})`, transform: "scale(1.15)" }
      : { opacity: 0.45 };
  }

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
            className="order-1 transition-[transform,filter,opacity] duration-500 sm:order-2"
            style={crestStyle("A")}
          >
            <TeamLogo team={teamA} size={44} />
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
            className="transition-[transform,filter,opacity] duration-500"
            style={crestStyle("B")}
          >
            <TeamLogo team={teamB} size={44} />
          </span>
          <p className="text-body-sm text-arena-fog">{teamB.shortName}</p>
        </div>
      </div>

      <div className="relative mt-5 h-7">
        <AnimatePresence>
          {phase === "playing" && latestGoal && (
            <motion.div
              key={`goal-${latestGoal.teamId}-${latestGoal.minute}`}
              initial={{ opacity: 0, scale: 0.8, y: 4 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1.08, 1, 1], y: 0 }}
              transition={{ duration: 1.1, times: [0, 0.15, 0.7, 1] }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="rounded-sm px-3 py-0.5 font-display text-display-sm uppercase tracking-wide"
                style={{
                  backgroundColor: latestGoal.teamId === teamA.id ? accentA : accentB,
                  color: contrastColor(latestGoal.teamId === teamA.id ? accentA : accentB),
                }}
              >
                Goal! {latestGoal.teamId === teamA.id ? teamA.shortName : teamB.shortName}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase !== "idle" && (
        <div className="mt-1" aria-hidden="true">
          <div className="relative h-1.5 rounded-full bg-arena-charcoal-raised">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-arena-fog/25"
              style={{ width: `${(clock / 90) * 100}%` }}
            />
            {revealed.map((event) => (
              <span
                key={`pin-${event.teamId}-${event.minute}`}
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-arena-charcoal"
                style={{
                  left: `${(event.minute / 90) * 100}%`,
                  backgroundColor: event.teamId === teamA.id ? accentA : accentB,
                }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-caption text-arena-smoke">
            <span>0&rsquo;</span>
            <span>45&rsquo;</span>
            <span>90&rsquo;</span>
          </div>
        </div>
      )}

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
