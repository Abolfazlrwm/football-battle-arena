export interface NavLinkItem {
  label: string;
  href: string;
}

/**
 * Static route list for the primary nav. Not football data — just the
 * site's information architecture, per the URL structure in the master
 * spec. Several of these routes don't have pages yet (built in later
 * phases); the links exist now so the nav is complete from day one.
 */
export const navLinks: NavLinkItem[] = [
  { label: "Arena", href: "/" },
  { label: "Teams", href: "/teams" },
  { label: "Battles", href: "/battles" },
  { label: "Rankings", href: "/rankings" },
  { label: "Captains", href: "/captains" },
  { label: "About", href: "/about" },
];