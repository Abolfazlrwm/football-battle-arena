import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // /data/images.ts generates placeholder team/captain art here until
    // real, licensed photography replaces it (see that file's header).
    remotePatterns: [{ protocol: "https", hostname: "placehold.co" }],
  },
};

export default nextConfig;
