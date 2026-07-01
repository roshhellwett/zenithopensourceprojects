import type { NextConfig } from "next";

const GITHUB_PAGES = process.env.GITHUB_PAGES === "true";
const BASE_PATH = "/zenithopensourceprojects";

const nextConfig: NextConfig = {
  // Hide framework identifier
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Security headers (applied to all routes)
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],

  // Image optimization — unoptimized on GitHub Pages (static export)
  images: GITHUB_PAGES
    ? { unoptimized: true, qualities: [25, 50, 75, 80] }
    : { qualities: [25, 50, 75, 80] },

  // GitHub Pages static export config
  ...(GITHUB_PAGES
    ? {
        output: "export" as const,
        basePath: BASE_PATH,
        assetPrefix: `${BASE_PATH}/`,
      }
    : {}),
};

export default nextConfig;
