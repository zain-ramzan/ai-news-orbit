import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "RSS feed",
  description: "Subscribe to AI News Orbit via RSS.",
};

export default function RssPage() {
  const feedUrl = "https://ai-news-orbit.vercel.app/feed.xml";

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">RSS feed</h1>
        <p className="mb-8 text-sm text-[var(--text-secondary)] sm:text-base">
          Subscribe in any RSS reader to get the latest agentic AI stories.
        </p>

        <div className="mb-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:p-5">
          <p className="mb-2 text-sm font-medium text-[var(--text-muted)]">Feed URL</p>
          <code className="block break-all rounded-md bg-[var(--bg-app)] px-3 py-2 text-sm text-[var(--text-primary)]">
            {feedUrl}
          </code>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/feed.xml"
              className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Open feed.xml
            </a>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Back to feed
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
