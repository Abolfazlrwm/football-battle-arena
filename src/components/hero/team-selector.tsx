"use client";

import { useEffect, useRef } from "react";
import type { Team } from "@/types";
import { cx } from "@/lib/cx";
import { TeamLogo } from "@/components/teams/team-logo";

/**
 * Horizontal, always-scrollable strip (see the master spec's TEAM
 * SELECTOR section: "large cinematic selector" on desktop, "horizontal
 * scroll / snap carousel" on mobile — one implementation serves both,
 * since this many clubs don't comfortably fit on one row at a legible size
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
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the active team in view: center it in the strip when it changes.
  // (Horizontal scroll on the strip only — never scrolls the page.)
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !active) return;
    const target = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left: Math.max(0, target) });
  }, [selectedId]);

  return (
    <div className="border-t border-arena-line">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Select a team"
        className="scrollbar-hide flex scroll-px-6 snap-x snap-proximity gap-3 overflow-x-auto scroll-smooth px-6 py-5 sm:scroll-px-8 sm:px-8"
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
                  ? "border-accent-readable bg-arena-charcoal-raised"
                  : "border-arena-line bg-transparent hover:border-arena-line-strong hover:bg-arena-charcoal"
              )}
            >
              <TeamLogo team={team} size={32} className="shrink-0" />
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
