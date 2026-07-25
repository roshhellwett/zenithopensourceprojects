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
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Zenith Open Source Projects – Roshan Kr Singh | Civic Tech & Developer Tools",
    template: "%s",
  },
  description:
    "Zenith Open Source Projects is an open-source software registry and civic-tech ecosystem founded by independent developer Roshan Kr Singh (@roshhellwett) in India. Featuring Project Sentinel, ZeroGapVote, AI tools, and system utilities.",
  keywords: [
    "zenith open source projects",
    "zenith open source",
    "zenith projects",
    "zenith registry",
    "zenith software",
    "roshan kr singh zenith",
    "roshhellwett",
    "roshan kr singh",
    "what is zenith open source projects",
    "zenith civic tech",
    "project sentinel news",
    "project zerogapvote",
    "project cortex ai",
    "open source india",
    "civic tech india",
    "windows utilities",
    "ai news aggregator",
    "github projects",
  ],
  authors: [
    { name: "Roshan Kr Singh", url: "https://github.com/roshhellwett" },
  ],
  creator: "Roshan Kr Singh",
  publisher: "Zenith Open Source Projects",
  robots: {
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
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  manifest: "/manifest.json",
  verification: {
    google: ["CWEIddbWw_sSmzFyikcyLv3jLzWUYDb-0V5JUNUjmvw"],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  openGraph: {
    title: "Zenith Open Source Projects – Roshan Kr Singh",
    description:
      "The official open-source software registry and civic-tech ecosystem by Roshan Kr Singh (@roshhellwett). Featuring Project Sentinel, ZeroGapVote, and developer utilities.",
    url: SITE_URL,
    siteName: "Zenith Open Source Projects",
    locale: "en_IN",
    type: "website",
    countryName: "India",
    images: [
      {
        url: `${SITE_URL}/logo.webp`,
        width: 512,
        height: 512,
        alt: "Zenith Open Source Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Open Source Projects – Roshan Kr Singh",
    description:
      "Open-source software registry and civic-tech ecosystem by Roshan Kr Singh (@roshhellwett).",
    images: [`${SITE_URL}/logo.webp`],
    creator: "@roshhellwett",
  },
};

export const viewport: Viewport = {
  themeColor: "#e1d7c2",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  userScalable: true,
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
        <div className="crt-overlay" aria-hidden="true" />
        <main id="main-content">
          {children}
        </main>
        <SpeedInsights />
      </body>
    </html>
  );
}
