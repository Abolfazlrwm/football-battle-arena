import type { Team } from "@/types";
import { computeBattleVerdict } from "@/lib/battle";

/**
 * The "who wins" banner: a split bar sized by each team's weighted
 * score share, plus a plain-language summary. Deliberately framed as
 * the arena's own comparison, not a match prediction — see
 * /lib/battle.ts for exactly what goes into the number.
 */
export function VerdictBanner({
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
  const verdict = computeBattleVerdict(teamA, teamB);

  return (
    <div className="rounded-md border border-arena-line bg-arena-charcoal p-5">
      <div className="flex items-center justify-between gap-4 text-body-sm">
        <span className="font-medium text-arena-fog">{teamA.shortName}</span>
        <span className="text-center text-arena-fog">{verdict.summary}</span>
        <span className="font-medium text-arena-fog">{teamB.shortName}</span>
      </div>

      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-arena-charcoal-raised">
        <div
          className="h-full transition-[width] duration-500 ease-out"
          style={{ width: `${verdict.pctA}%`, backgroundColor: accentA }}
        />
        <div
          className="h-full transition-[width] duration-500 ease-out"
          style={{ width: `${verdict.pctB}%`, backgroundColor: accentB }}
        />
      </div>

      <p className="mt-3 text-caption text-arena-smoke">
        Based on the arena&rsquo;s own weighted ratings — not a real match prediction.
      </p>
    </div>
  );
}
