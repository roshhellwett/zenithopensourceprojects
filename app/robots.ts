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
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Applebot-Extended",
          "Amazonbot",
          "CCBot",
          "Bytespider",
          "Diffbot",
          "ImagesiftBot",
        ],
        allow: "/",
        disallow: ["/assets/founder/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}