import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "Googlebot",
          "Google-Extended",
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
          "Amazonbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}