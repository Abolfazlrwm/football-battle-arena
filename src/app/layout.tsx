import type { Metadata } from "next";
import "@fontsource/big-shoulders-display/600";
import "@fontsource/big-shoulders-display/700";
import "@fontsource/big-shoulders-display/800";
import "@fontsource/big-shoulders-display/900";
import "@fontsource/ibm-plex-sans/400";
import "@fontsource/ibm-plex-sans/500";
import "@fontsource/ibm-plex-sans/600";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";

export const metadata: Metadata = {
  title: {
    default: "Football Battle Arena",
    template: "Football Battle Arena — %s",
  },
  description:
    "Choose your team, meet its captain, and enter the arena. A cinematic football team universe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-arena-black text-arena-fog">
        <Navbar />
        {children}
      </body>
    </html>
  );
}