import type { MetadataRoute } from "next";
import { teams } from "@/data/teams";
import { captains } from "@/data/captains";
import { battles } from "@/data/battles";
import { leagues } from "@/data/leagues";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/teams", "/leagues", "/captains", "/battles", "/tournament", "/rankings", "/about"].map(
    (path) => ({ url: `${siteUrl}${path}`, lastModified: now })
  );

  const teamRoutes = teams.map((t) => ({ url: `${siteUrl}/teams/${t.slug}`, lastModified: now }));
  const captainRoutes = captains.map((c) => ({
    url: `${siteUrl}/captains/${c.slug}`,
    lastModified: now,
  }));
  const battleRoutes = battles.map((b) => ({
    url: `${siteUrl}/battles/${b.slug}`,
    lastModified: now,
  }));

  const leagueRoutes = leagues.map((l) => ({ url: `${siteUrl}/leagues/${l.slug}`, lastModified: now }));

  return [...staticRoutes, ...leagueRoutes, ...teamRoutes, ...captainRoutes, ...battleRoutes];
}
