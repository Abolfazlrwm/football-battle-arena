"use client";

import type { Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamCrest } from "@/components/teams/team-crest";

/**
 * Horizontal, always-scrollable strip (see the master spec's TEAM
 * SELECTOR section: "large cinematic selector" on desktop, "horizontal
 * scroll / snap carousel" on mobile — one implementation serves both,
 * since 12 clubs don't comfortably fit on one row at a legible size
 * regardless of viewport).
 */
export function TeamSelector({
  teams,
  selectedId,
  onSelect,
}: {
  teams: Team[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border-t border-arena-line">
      <div
        role="tablist"
        aria-label="Select a team"
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 py-5 sm:px-8"
      >
        {teams.map((team) => {
          const active = team.id === selectedId;
          return (
            <button
              key={team.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(team.id)}
              className={cx(
                "flex shrink-0 snap-start items-center gap-3 rounded-md border px-4 py-3 transition-colors",
                active
                  ? "border-accent bg-arena-charcoal-raised"
                  : "border-arena-line bg-transparent hover:border-arena-line-strong hover:bg-arena-charcoal"
              )}
            >
              <TeamCrest team={team} size={32} className="shrink-0" />
              <span className="text-left">
                <span
                  className={cx(
                    "block text-body-sm font-medium",
                    active ? "text-arena-fog" : "text-arena-mist"
                  )}
                >
                  {team.shortName}
                </span>
                <span className="block text-caption text-arena-smoke">{team.league}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
