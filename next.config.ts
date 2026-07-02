import type { NextConfig } from "next";

const GITHUB_PAGES = process.env.GITHUB_PAGES === "true";
const BASE_PATH = "/zenithopensourceprojects";

const nextConfig: NextConfig = {
  // Hide framework identifier
  poweredByHeader: false,

  // Enable compression
  compress: true,

  // Security headers (applied to all routes — proxy.ts also sets CSP/HSTS)
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],

  // Image optimization — unoptimized on GitHub Pages (static export)
  images: GITHUB_PAGES
    ? { unoptimized: true }
    : {},

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
