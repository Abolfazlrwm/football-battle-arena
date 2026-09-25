import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
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