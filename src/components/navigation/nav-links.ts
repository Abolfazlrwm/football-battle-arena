export interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Static route list for the primary nav — the site's information
 * architecture, nothing more.
 */
export const navLinks: NavLinkItem[] = [
  { label: "Arena", href: "/" },
  { label: "Teams", href: "/teams" },
  { label: "Leagues", href: "/leagues" },
  { label: "Battles", href: "/battles" },
  { label: "Cup", href: "/tournament" },
  { label: "Rankings", href: "/rankings" },
  { label: "Captains", href: "/captains" },
  { label: "About", href: "/about" },
];
