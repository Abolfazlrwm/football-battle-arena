"use client";

import { useMemo, useState } from "react";
import type { Captain, CaptainPosition } from "@/types";
import { cx } from "@/lib/cx";
import { CaptainCard } from "./captain-card";

const POSITIONS: Array<CaptainPosition | "All"> = [
  "All",
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
];

export function CaptainsDirectory({ captains }: { captains: Captain[] }) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<(typeof POSITIONS)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return captains.filter((c) => {
      const matchesPosition = position === "All" || c.position === position;
      const matchesQuery = q === "" || c.name.toLowerCase().includes(q);
      return matchesPosition && matchesQuery;
    });
  }, [captains, query, position]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search captains…"
          aria-label="Search captains"
          className="h-11 w-full rounded-sm border border-arena-line bg-arena-charcoal px-4 text-body-sm text-arena-fog placeholder:text-arena-smoke focus-visible:border-accent sm:max-w-xs"
        />
        <div
          className="scrollbar-hide flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Filter by position"
        >
          {POSITIONS.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={position === p}
              onClick={() => setPosition(p)}
              className={cx(
                "shrink-0 rounded-sm border px-3.5 py-2 text-body-sm transition-colors",
                position === p
                  ? "border-accent bg-arena-charcoal-raised text-arena-fog"
                  : "border-arena-line text-arena-mist hover:text-arena-fog"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-body text-arena-mist">No captains match your search.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((captain) => (
            <CaptainCard key={captain.id} captain={captain} />
          ))}
        </div>
      )}
    </div>
  );
}
