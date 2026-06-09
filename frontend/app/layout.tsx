import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchPad AI — Validate Your Startup Idea in 30 Seconds",
  description: "AI-powered startup validator. Get market analysis, 20 name ideas with live domain availability, competitor map, and investor pitch instantly.",
  openGraph: {
    title: "LaunchPad AI",
    description: "From startup idea to launch-ready in 30 seconds.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
