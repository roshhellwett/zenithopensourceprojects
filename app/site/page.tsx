import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import SiteClient from "./SiteClient";

export const metadata: Metadata = buildMetadata({
  title: "Zenith Open Source Projects — Civic tech & developer tools",
  description:
    "The public portfolio of Zenith Open Source Projects by Roshan Kr Singh: civic-tech, AI news verification, voting blueprints, Linux audio, and developer utilities — MIT-licensed, fully auditable.",
  path: "/site",
  image: "/og/site.png",
  imageAlt: "Zenith Open Source Projects — civic tech & developer tools",
  keywords: [
    "zenith open source projects",
    "zenith registry",
    "roshan kr singh",
    "roshhellwett",
    "open source india",
    "civic tech",
    "project sentinel",
    "project zerogapvote",
    "ai news aggregator",
    "developer tools india",
  ],
});

export default function SitePage() {
  return <SiteClient />;
}
