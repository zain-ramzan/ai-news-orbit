import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoryCard } from "@/components/StoryCard";
import { StoryImage } from "@/components/StoryImage";
import {
  COUNTRY_FLAGS,
  formatRelativeDate,
  getRelatedStories,
  getStoryBySlug,
  getAllStories,
} from "@/lib/news";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllStories().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story not found" };
  return {
    title: story.headline,
    description: story.what_happened.slice(0, 160),
    openGraph: {
      title: story.headline,
      description: story.what_happened.slice(0, 160),
      type: "article",
      publishedTime: story.published_at,
    },
  };
}

function VerificationBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />
        Confirmed
      </span>
    );
  }
  if (status === "reported") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-900">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900/80" aria-hidden />
        Reported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-500 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
      <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden />
      Rumor
    </span>
  );
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  const related = getRelatedStories(story);
  const flag =
    story.country_code && story.country_code !== "GLOBAL"
      ? COUNTRY_FLAGS[story.country_code] ?? ""
      : "";

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Header />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← Back to feed
        </Link>

        <div className="mb-6 flex gap-4">
          <StoryImage story={story} size={96} />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <VerificationBadge status={story.verification_status} />
              <span>{story.category}</span>
              {story.organization.map((org) => (
                <span key={org} className="rounded-md bg-[var(--bg-surface)] px-1.5 py-0.5">
                  {org}
                </span>
              ))}
              {flag && (
                <span title={story.country ?? story.country_code}>
                  {flag}{" "}
                  <span className="sr-only">{story.country ?? story.country_code}</span>
                </span>
              )}
              <time dateTime={story.published_at}>{formatRelativeDate(story.published_at)}</time>
            </div>
          </div>
        </div>

        <h1 className="mb-8 text-3xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
          {story.headline}
        </h1>

        <section className="mb-8">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
            What happened
          </h2>
          <p className="text-[16px] leading-relaxed text-[var(--text-primary)]">
            {story.what_happened}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Why it matters
          </h2>
          <p className="text-[16px] leading-relaxed text-[var(--text-secondary)]">
            {story.why_it_matters}
          </p>
        </section>

        {story.product.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Products
            </h2>
            <div className="flex flex-wrap gap-2">
              {story.product.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--text-secondary)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Sources
          </h2>
          <div className="space-y-2">
            <a
              href={story.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 text-[15px] text-[var(--accent)] hover:underline"
            >
              <span>{story.source_name}</span>
              <span className="text-xs text-[var(--text-muted)]">↗</span>
            </a>
            {story.official_url && story.official_url !== story.source_url && (
              <a
                href={story.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 text-[15px] text-[var(--accent)] hover:underline"
              >
                <span>Official announcement</span>
                <span className="text-xs text-[var(--text-muted)]">↗</span>
              </a>
            )}
          </div>
          <a
            href={story.official_url || story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
          >
            Read source
            <span aria-hidden>↗</span>
          </a>
        </section>

        {story.tags.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2">
            {story.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?q=${encodeURIComponent(tag)}`}
                className="rounded-md border border-[var(--border-default)] px-2 py-1 text-xs text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-[var(--text-primary)]">
              Related developments
            </h2>
            <div>
              {related.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
