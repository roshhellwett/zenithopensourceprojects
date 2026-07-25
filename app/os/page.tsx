import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import OsClient from "./OsClient";

export const metadata: Metadata = buildMetadata({
  title: "Zenith OS — Desktop workspace for open source projects",
  description:
    "Step into Zenith OS: a retro desktop workspace that boots into the open-source registry by Roshan Kr Singh — projects, telemetry, stack, and an AI assistant, all in one interactive shell.",
  path: "/os",
  image: "/og/os.png",
  imageAlt: "Zenith OS — retro desktop workspace",
  keywords: [
    "zenith os",
    "zenith open source projects",
    "roshan kr singh",
    "roshhellwett",
    "open source registry",
    "civic tech india",
    "developer portfolio os",
  ],
});

export default function OsPage() {
  return <OsClient />;
}
