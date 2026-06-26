import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/data/site";
import { StructuredData } from "@/components/StructuredData";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zenith – We make open source tools for civic engineers",
  description:
    "Explore open source civic-tech tools, AI news aggregators, transparent voting blueprints, Telegram bots, Windows utilities, and more by Roshan Kr Singh (@roshhellwett). Built with one rule: be useful, be transparent, be free.",
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
    // apple icon not bundled — uncomment and add the file to public/ to enable
  },
  manifest: "/manifest.json",
  verification: {
    google: "CWEIddbWw_sSmzFyikcyLv3jLzWUYDb-0V5JUNUjmvw",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
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
    // images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Zenith Open Source Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Open Source Projects",
    description:
      "Open source Telegram bots, Windows tools, GRUB themes, and more by @roshhellwett.",
    creator: "@roshhellwett",
    creatorId: "roshhellwett",
    // images: [`${SITE_URL}/og-image.png`],
  },
};

export const viewport: Viewport = {
  themeColor: "#e1d7c2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${ibmPlexSans.variable} ${sourceCodePro.variable} antialiased`}
      >
        {/* Skip to content — accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <StructuredData />
        <main id="main-content">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
