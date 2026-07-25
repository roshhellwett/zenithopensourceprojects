import type { Metadata } from "next";
import { SITE_URL } from "@/data/site";

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string; // absolute path e.g. "/os"
  image?: string; // absolute or root-relative
  imageAlt?: string;
  ogType?: "website" | "article" | "profile";
  keywords?: string[];
  robots?: "index" | "noindex";
}

/**
 * Central metadata builder. Every route in the app should call this so
 * titles, descriptions, canonical URLs, and Open Graph tags stay consistent
 * and self-canonical to the route they represent — no accidental leaks
 * pointing every page at the home page.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = "/logo.webp",
  imageAlt = "Zenith Open Source Projects",
  ogType = "website",
  keywords,
  robots = "index",
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return {
    title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: { canonical: url },
    robots:
      robots === "noindex"
        ? { index: false, follow: false }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              "max-video-preview": -1,
              "max-image-preview": "large",
              "max-snippet": -1,
            },
          },
    openGraph: {
      title,
      description,
      url,
      siteName: "Zenith Open Source Projects",
      locale: "en_IN",
      type: ogType,
      images: [
        {
          url: absoluteImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImage],
      creator: "@roshhellwett",
    },
  };
}
