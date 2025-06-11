import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premier League Hub - Your Ultimate Premier League Experience",
  description:
    "Explore Premier League teams, schedules, standings, and more. Find your favorite Premier League teams and follow them all in one plach details with our modern NBA hub.",
  keywords:
    "Premier League, football, soccer, teams, schedule, standings, matches, sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <Navigation />
        <main className="flex-1">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
