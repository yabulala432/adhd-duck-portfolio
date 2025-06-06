import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yeabsira Yonas",
  description: "Created with Next.js",
  keywords: "Yeabsira Yonas, Next.js, React, Web Development",
  authors: [{ name: "Yeabsira Yonas" }],
  generator: "Next.js",
  creator: "Yeabsira Yonas",
  openGraph: {
    title: "Yeabsira Yonas",
    description: "Created with Next.js",
    url: "https://yeabsirayonas.com",
    siteName: "Yeabsira Yonas",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/121499744?v=4",
        width: 1200,
        height: 630,
        alt: "Yeabsira Yonas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yeabsira Yonas",
    description: "Created with Next.js",
    images: ["https://avatars.githubusercontent.com/u/121499744?v=4"],
    creator: "@yeabsirayonas",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
