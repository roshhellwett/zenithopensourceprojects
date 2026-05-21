import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://zenithopensourceprojects.vercel.app";

// 1. Standard Metadata with Favicon
export const metadata: Metadata = {
  title: "Zenith Open Source Projects – Roshan Kr Singh (@roshhellwett)",
  description:
    "Explore open source Telegram bots, Windows utilities, GRUB themes, audio pipelines, and logic simulators by Roshan Kr Singh (@roshhellwett). Built with one rule: be useful, be transparent, be free.",
  keywords: [
    "roshhellwett",
    "roshan kr singh",
    "zenith open source projects",
    "open source",
    "telegram bot",
    "civic tech india",
    "windows utilities",
    "grub themes",
    "ai news aggregator",
    "project sentinel",
    "developer tools",
    "indian open source",
    "github projects",
  ],
  authors: [
    { name: "Roshan Kr Singh", url: "https://github.com/roshhellwett" },
  ],
  creator: "Roshan Kr Singh",
  publisher: "Roshan Kr Singh",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "CWEIddbWw_sSmzFyikcyLv3jLzWUYDb-0V5JUNUjmvw",
  },
  openGraph: {
    title: "Zenith Open Source Projects – Roshan Kr Singh",
    description:
      "A curated collection of open source tools, bots, and system experiments by Roshan Kr Singh. Telegram bots, Windows utilities, GRUB themes, AI news, and more.",
    url: SITE_URL,
    siteName: "Zenith Open Source Projects",
    locale: "en_IN",
    type: "website",
    countryName: "India",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Open Source Projects",
    description:
      "Open source Telegram bots, Windows tools, GRUB themes, and more by @roshhellwett.",
    creator: "@roshhellwett",
    creatorId: "roshhellwett",
  },
};

// 2. Viewport with theme color
export const viewport: Viewport = {
  themeColor: "#4A7FA7",
};

// 3. Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Zenith Open Source Projects",
              url: SITE_URL,
              description:
                "A curated collection of open source tools, bots, and system experiments by Roshan Kr Singh.",
              author: {
                "@type": "Person",
                name: "Roshan Kr Singh",
                url: "https://github.com/roshhellwett",
                sameAs: [
                  "https://github.com/roshhellwett",
                  "https://x.com/roshhellwett",
                ],
              },
              inLanguage: "en-IN",
              isAccessibleForFree: true,
              license: "https://opensource.org/licenses/MIT",
            }),
          }}
        />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
