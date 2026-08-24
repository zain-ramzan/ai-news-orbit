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
    <div className="min-h-screen bg-[var(--bg-app)]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          RSS feed
        </h1>
        <p className="mb-8 text-[var(--text-secondary)]">
          Subscribe in any RSS reader to get the latest agentic AI stories.
        </p>

        <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
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
              className="inline-flex items-center rounded-full bg-[var(--bg-app)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-default)]"
            >
              Back to feed
            </Link>
          </div>
        </div>

        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>
            Compatible with Feedly, NewsBlur, NetNewsWire, Inoreader, and most other readers.
          </p>
          <p>
            The raw XML at <code className="text-[var(--text-primary)]">/feed.xml</code> is intentional —
            that is how RSS works. Your reader parses it; you do not need to read the code.
          </p>
        </div>
      </main>
    </div>
  );
}
