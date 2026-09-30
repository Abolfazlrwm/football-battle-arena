"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SearchOverlay } from "./search-overlay";

interface SearchContextValue {
  open: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

/** Provides global search state + the Cmd/Ctrl+K shortcut to the whole app. */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SearchContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <SearchOverlay open={isOpen} onClose={() => setIsOpen(false)} />
    </SearchContext.Provider>
  );
}
