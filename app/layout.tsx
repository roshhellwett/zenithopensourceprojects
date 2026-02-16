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

// 1. Standard Metadata with Favicon
export const metadata: Metadata = {
  title: "Zenith Open Source Projects – Roshan Kr Singh (@roshhellwett)",
  description:
    "Explore open source Telegram bots, Windows utilities, GRUB themes, audio pipelines, and logic simulators by Roshan Kr Singh (@roshhellwett).",
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
  openGraph: {
    title: "Zenith Open Source Projects",
    description:
      "A curated collection of open source tools, bots, and system experiments by Roshan Kr Singh.",
    url: "https://zenithopensourceprojects.vercel.app",
    siteName: "Zenith Open Source Projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith Open Source Projects",
    description:
      "Open source Telegram bots, Windows tools, GRUB themes, and more by @roshhellwett.",
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
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
