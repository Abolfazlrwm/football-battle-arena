"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import { buildSearchIndex, type SearchItem } from "@/lib/search-index";
import { cx } from "@/lib/cx";

const GROUP_ORDER: SearchItem["type"][] = ["Team", "Captain", "League"];

/**
 * Command-palette style global search. Opened via the navbar's search
 * button or Cmd/Ctrl+K (see SearchProvider). Arrow keys move the active
 * result across all groups, Enter navigates, Escape closes.
 */
export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = q === "" ? index : index.filter((item) => item.label.toLowerCase().includes(q));
    return GROUP_ORDER.flatMap((type) => matches.filter((m) => m.type === type));
  }, [index, query]);

  // Reset the active row whenever the query changes, and reset the query
  // itself whenever the overlay opens. Adjusting state during render
  // (rather than in an effect) avoids an extra cascading render — React
  // bails out before committing. See the Navbar's mobile-menu-close
  // logic for the same pattern.
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setActiveIndex(0);
  }

  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  // Genuine side effects (DOM mutation, focus) stay in an effect.
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.documentElement.style.overflow = "";
      cancelAnimationFrame(id);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = results[activeIndex];
        if (item) {
          router.push(item.href);
          onClose();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, results, activeIndex, router, onClose]);

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
    >
      <div aria-hidden className="absolute inset-0 bg-arena-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-arena-line bg-arena-charcoal shadow-elevated">
        <div className="flex items-center gap-3 border-b border-arena-line px-4">
          <SearchIcon size={18} className="shrink-0 text-arena-mist" strokeWidth={1.75} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, captains, leagues…"
            aria-label="Search"
            className="h-14 flex-1 bg-transparent text-body text-arena-fog placeholder:text-arena-smoke focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 text-arena-mist hover:text-arena-fog"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-body-sm text-arena-mist">No results.</p>
          ) : (
            GROUP_ORDER.map((type) => {
              const groupItems = results.filter((r) => r.type === type);
              if (groupItems.length === 0) return null;
              return (
                <div key={type} className="mb-2 last:mb-0">
                  <p className="px-3 py-1.5 text-label text-arena-smoke">{type}s</p>
                  {groupItems.map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    const active = idx === activeIndex;
                    return (
                      <button
                        key={`${item.type}-${item.href}`}
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          router.push(item.href);
                          onClose();
                        }}
                        className={cx(
                          "flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-left transition-colors",
                          active ? "bg-arena-charcoal-raised" : "hover:bg-arena-charcoal-raised"
                        )}
                      >
                        <span className="text-body-sm text-arena-fog">{item.label}</span>
                        <span className="text-caption text-arena-mist">{item.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
