import type { NextConfig } from "next";

const GITHUB_PAGES = process.env.GITHUB_PAGES === "true";
const BASE_PATH = "/zenithopensourceprojects";

const nextConfig: NextConfig = {
  ...(GITHUB_PAGES
    ? {
        output: "export" as const,
        basePath: BASE_PATH,
        assetPrefix: `${BASE_PATH}/`,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

