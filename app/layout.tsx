import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit, Sacramento, Dancing_Script } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  weight: "400",
  variable: "--font-sacramento",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

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
    icon: [{ url: "/favicon.ico" }],
  },
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

export const viewport: Viewport = {
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${sacramento.variable} ${dancingScript.variable} antialiased`}
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
