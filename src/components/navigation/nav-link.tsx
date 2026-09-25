"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/cx";
import type { NavLinkItem } from "./nav-links";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  item,
  className,
  onNavigate,
}: {
  item: NavLinkItem;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cx(
        "relative py-2 font-body text-label uppercase text-arena-mist transition-colors",
        "hover:text-arena-fog",
        active &&
          "text-arena-fog after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent",
        className
      )}
    >
      {item.label}
    </Link>
  );
}