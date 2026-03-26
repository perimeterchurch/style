import { readdirSync } from "node:fs";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-context";
import { TopNav } from "@/components/site/top-nav";
import { SearchPalette } from "@/components/site/search-palette";

import "./globals.css";

const availableThemes = readdirSync("registry/themes")
  .filter((f) => f.endsWith(".json") && f !== "default.json")
  .map((f) => f.replace(".json", ""))
  .sort();

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Perimeter Church Design System",
  description:
    "shadcn-compatible component registry for Perimeter Church projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider availableThemes={availableThemes}>
          <TopNav />
          {children}
          <SearchPalette />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
