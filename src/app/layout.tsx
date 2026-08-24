import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI News Orbit — Agentic AI news",
    template: "%s · AI News Orbit",
  },
  description:
    "Continuously updated intelligence on AI agents, agentic systems, frameworks, protocols, coding agents, computer-use agents, and enterprise deployments.",
  metadataBase: new URL("https://ai-news-orbit.vercel.app"),
  openGraph: {
    title: "AI News Orbit",
    description: "Curated news on agentic AI.",
    type: "website",
    siteName: "AI News Orbit",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI News Orbit",
    description: "Curated news on agentic AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
