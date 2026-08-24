import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AgentSignal — The signal in agentic AI",
    template: "%s · AgentSignal",
  },
  description:
    "Continuously updated intelligence on AI agents, agentic systems, frameworks, protocols, coding agents, computer-use agents, and enterprise deployments.",
  metadataBase: new URL("https://agentsignal.vercel.app"),
  openGraph: {
    title: "AgentSignal",
    description: "The signal in agentic AI.",
    type: "website",
    siteName: "AgentSignal",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentSignal",
    description: "The signal in agentic AI.",
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
