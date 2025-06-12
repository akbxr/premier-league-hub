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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 font-sans antialiased text-white`}
      >
        <div className="relative min-h-screen">
          {/* Animated Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-500/12 rounded-full blur-3xl animate-pulse delay-3000"></div>
          </div>

          <div className="relative z-10">
            <Navigation />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <Toaster
          toastOptions={{
            style: {
              background: "rgba(35, 39, 66, 0.9)",
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </body>
    </html>
  );
}
