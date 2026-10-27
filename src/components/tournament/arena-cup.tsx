"use client";

import { useState } from "react";
import { FastForward, Play, Shuffle, Trophy } from "lucide-react";
import type { Team } from "@/types";
import {
  buildBracket, champion, nextRoundIndex, playNextRound, roundName, winnerOf,
  type Bracket, type FieldSize, type SeedingMode, type Tie,
} from "@/lib/tournament";
import { buildAccentVars } from "@/lib/color";
import { TeamLogo } from "@/components/teams/team-logo";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";

function scoreLine(tie: Tie, side: "a" | "b") {
  const r = tie.result;
  if (!r) return "";
  const goals = side === "a" ? r.teamAGoals : r.teamBGoals;
  const et = r.extraTime ? (side === "a" ? r.extraTime.a : r.extraTime.b) : 0;
  return String(goals + et);
}

function TieCard({ tie }: { tie: Tie }) {
  const winner = winnerOf(tie);
  const r = tie.result;
  const tag = r?.penalties
    ? `Pens ${r.penalties.a}–${r.penalties.b}`
    : r?.extraTime
      ? "After extra time"
      : null;

  const row = (team: Team | null, side: "a" | "b") => (
    <div
      className={cx(
        "flex items-center gap-2.5 px-3 py-2",
        winner && team && winner.id !== team.id && "opacity-45"
      )}
    >
      {team ? <TeamLogo team={team} size={22} /> : <span className="h-[22px] w-[22px] rounded-full bg-arena-charcoal-raised" />}
      <span className={cx("flex-1 truncate text-body-sm", winner?.id === team?.id ? "font-semibold text-arena-fog" : "text-arena-mist")}>
        {team ? team.shortName : "TBD"}
      </span>
      <span className="w-5 text-right text-body-sm tabular-nums text-arena-fog">{scoreLine(tie, side)}</span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-md border border-arena-line bg-arena-charcoal">
      {row(tie.a, "a")}
      <div className="border-t border-arena-line" />
      {row(tie.b, "b")}
      {tag && <p className="border-t border-arena-line px-3 py-1 text-caption text-arena-smoke">{tag}</p>}
    </div>
  );
}

/** Single-elimination cup: draw a field, play round by round (or all at once), crown a champion. */
export function ArenaCup({ teams }: { teams: Team[] }) {
  const [size, setSize] = useState<FieldSize>(16);
  const [mode, setMode] = useState<SeedingMode>("rating");
  const [bracket, setBracket] = useState<Bracket>(() => buildBracket(teams, 16, "rating"));

  const redraw = (nextSize = size, nextMode = mode) => setBracket(buildBracket(teams, nextSize, nextMode));
  const upcoming = nextRoundIndex(bracket);
  const winner = champion(bracket);
  const accent = winner ? buildAccentVars(winner.colors)["--accent"] : undefined;

  const playAll = () => {
    let b = bracket;
    while (nextRoundIndex(b) !== -1) b = playNextRound(b);
    setBracket(b);
  };

  const chip = (active: boolean) =>
    cx("rounded-sm border px-3.5 py-2 text-body-sm transition-colors", active
      ? "border-accent bg-arena-charcoal-raised text-arena-fog"
      : "border-arena-line text-arena-mist hover:text-arena-fog");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2" role="group" aria-label="Field size">
          {([8, 16] as FieldSize[]).map((n) => (
            <button key={n} type="button" className={chip(size === n)} onClick={() => { setSize(n); redraw(n, mode); }}>
              {n} teams
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2" role="group" aria-label="Seeding">
          <button type="button" className={chip(mode === "rating")} onClick={() => { setMode("rating"); redraw(size, "rating"); }}>
            Seeded by rating
          </button>
          <button type="button" className={chip(mode === "random")} onClick={() => { setMode("random"); redraw(size, "random"); }}>
            Random draw
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={upcoming === -1} onClick={() => setBracket(playNextRound(bracket))} className={cx(buttonStyles({ variant: "primary" }), "gap-2")}>
          <Play size={18} />
          {upcoming === -1 ? "Cup complete" : `Play ${roundName(bracket[upcoming].length * 2)}`}
        </button>
        <button type="button" disabled={upcoming === -1} onClick={playAll} className={cx(buttonStyles({ variant: "secondary" }), "gap-2")}>
          <FastForward size={18} /> Play all
        </button>
        <button type="button" onClick={() => redraw()} className={cx(buttonStyles({ variant: "ghost" }), "gap-2")}>
          <Shuffle size={18} /> New draw
        </button>
      </div>

      {winner && (
        <div
          className="mt-6 flex flex-col items-center gap-2 rounded-lg border border-arena-line bg-arena-charcoal px-6 py-8 text-center"
          style={{ boxShadow: `0 0 60px -20px ${accent}` }}
        >
          <Trophy size={26} className="text-arena-fog" aria-hidden="true" />
          <TeamLogo team={winner} size={96} className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
          <p className="text-label text-arena-mist">Arena Cup champions</p>
          <p className="text-display-lg uppercase">{winner.name}</p>
        </div>
      )}

      <div className="mt-8 overflow-x-auto pb-4">
        <div className="flex min-w-max gap-6">
          {bracket.map((round, r) => (
            <section key={r} aria-label={roundName(round.length * 2)} className="flex w-56 flex-col">
              <h3 className="mb-3 text-label text-arena-mist">{roundName(round.length * 2)}</h3>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {round.map((tie) => (
                  <TieCard key={tie.id} tie={tie} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <p className="mt-2 text-caption text-arena-smoke">
        Every match is simulated from the arena&rsquo;s own ratings, with extra time and penalties if level — not real fixtures or results.
      </p>
    </div>
  );
}
