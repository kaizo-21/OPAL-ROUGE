import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/opal/AppWrapper";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Opal & Rouge — Elevated Style. Curated Finds.",
  description:
    "Discover handpicked fashion, accessories, and outfit inspiration for modern women. Opal & Rouge curates affordable fashion finds, outfit ideas, and elegant style inspiration.",
  keywords: [
    "Opal & Rouge",
    "fashion",
    "outfits",
    "accessories",
    "style inspiration",
    "Amazon fashion",
  ],
  openGraph: {
    title: "Opal & Rouge — Elevated Style. Curated Finds.",
    description:
      "Discover handpicked fashion, accessories, and outfit inspiration for modern women.",
    url: "https://opal-rouge.vercel.app",
    siteName: "Opal & Rouge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Opal & Rouge — Elevated Style. Curated Finds.",
    description:
      "Discover handpicked fashion, accessories, and outfit inspiration for modern women.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${jost.variable} antialiased min-h-screen flex flex-col`}
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
