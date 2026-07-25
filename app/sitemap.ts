import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

export const dynamic = "force-static";

/**
 * Sitemap intentionally omits `lastModified`. The build timestamp is not
 * an authentic per-page modification date, and shipping `new Date()` on
 * every entry flags as inauthentic to crawlers.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/os", priority: 1.0, changeFrequency: "weekly" },
    { path: "/site", priority: 1.0, changeFrequency: "weekly" },
    { path: "/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.5, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.5, changeFrequency: "yearly" },
    { path: "/open-source", priority: 0.6, changeFrequency: "monthly" },
    { path: "/security", priority: 0.5, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
