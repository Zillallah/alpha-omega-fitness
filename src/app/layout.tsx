import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import Cursor from "@/components/cursor/Cursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

const fraunces = Fraunces({
  // Variable font: axes require `weight: "variable"` (or omitting weight).
  // The wght axis spans 100–900 — set per-element via font-weight in CSS.
  weight: "variable",
  style: ["italic"],
  axes: ["opsz", "SOFT", "WONK"],
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Alpha Omega Fitness — Boot Camp Coaching in Victorville · 8 Years · HYROX Official",
  description:
    "Group training that gets results. Boot camp coaching with Vince and Elena. 8 years in Victor Valley. Official HYROX Gym Affiliate. Start your free trial week.",
  metadataBase: new URL("https://alpha-omega-fitness.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      <body>
        <LenisProvider>
          <Cursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
