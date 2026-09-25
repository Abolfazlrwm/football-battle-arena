"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonStyles } from "@/components/ui/button";
import { cx } from "@/lib/cx";
import { navLinks } from "./nav-links";
import { NavLink } from "./nav-link";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile panel on route change. Adjusting state during render
  // (rather than in an effect) is the recommended pattern for "reset on
  // prop change" — React bails out before committing, so there's no
  // extra render or flash of the open panel.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  // Compact the bar once the page has scrolled past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes the mobile panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header
      className={cx(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,padding] duration-300",
        scrolled
          ? "border-arena-line bg-arena-black/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <Container size="wide">
        <div
          className={cx(
            "flex items-center justify-between transition-[padding] duration-300",
            scrolled ? "py-3" : "py-5"
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navLinks.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-sm text-arena-mist transition-colors hover:bg-arena-charcoal hover:text-arena-fog sm:flex"
            >
              <Search size={18} strokeWidth={1.75} />
            </button>

            <Link
              href="/teams"
              className={cx(buttonStyles({ variant: "primary", size: "sm" }), "hidden md:inline-flex")}
            >
              Enter Arena
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-arena-fog transition-colors hover:bg-arena-charcoal md:hidden"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.75} />
              ) : (
                <Menu size={20} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onNavigate={() => setMobileOpen(false)} />
    </header>
  );
}