import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RadarStrike — Autonomous Competitor Intelligence & Churn Engine",
  description:
    "Real-time competitive landscape radar powered by Tavily AI Search, MongoDB Atlas Vector Search, and Vercel AI Gateway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-cyan-500/20 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
