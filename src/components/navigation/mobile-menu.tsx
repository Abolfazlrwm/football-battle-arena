import Link from "next/link";
import { Search } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { useSearch } from "@/components/search/search-provider";
import { cx } from "@/lib/cx";
import { navLinks } from "./nav-links";
import { NavLink } from "./nav-link";

export function MobileMenu({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const search = useSearch();

  return (
    <div
      id="mobile-menu"
      className={cx(
        "fixed inset-0 top-0 z-40 flex flex-col bg-arena-black/98 backdrop-blur-xl md:hidden",
        "transition-opacity duration-200",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      aria-hidden={!open}
    >
      <div className="px-8 pt-8">
        <button
          type="button"
          onClick={() => {
            onNavigate();
            search.open();
          }}
          className="flex w-full items-center gap-3 rounded-sm border border-arena-line px-4 py-3 text-body-sm text-arena-mist"
        >
          <Search size={18} strokeWidth={1.75} />
          Search teams, captains, leagues…
        </button>
      </div>
      <nav className="flex flex-1 flex-col justify-center gap-1 px-8">
        {navLinks.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            onNavigate={onNavigate}
            className="!text-display-sm border-b border-arena-line py-4 !text-arena-fog after:hidden"
          />
        ))}
      </nav>
      <div className="flex flex-col gap-3 border-t border-arena-line px-8 py-8">
        <Link
          href="/teams"
          onClick={onNavigate}
          className={buttonStyles({ variant: "primary", size: "lg", className: "w-full" })}
        >
          Enter Arena
        </Link>
      </div>
    </div>
  );
}
