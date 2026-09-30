import type { Metadata, Viewport } from "next";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/ibm-plex-sans/400";
import "@fontsource/ibm-plex-sans/500";
import "@fontsource/ibm-plex-sans/600";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/layout/footer";
import { SearchProvider } from "@/components/search/search-provider";

// Set NEXT_PUBLIC_SITE_URL once deployed (see .env.example) — it's what
// Open Graph tags, canonical links, robots.txt, and sitemap.xml resolve
// against. Falls back to localhost so local builds still work.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteTitle = "Football Battle Arena";
const siteDescription =
  "Choose your team, meet its captain, and enter the arena. A cinematic football team universe.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "Football Battle Arena — %s",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: siteTitle,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-arena-black text-arena-fog">
        <SearchProvider>
          <Navbar />
          {children}
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
