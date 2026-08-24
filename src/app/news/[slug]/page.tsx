import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
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
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <Link
          href="/"
          className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:mb-8"
        >
          ← Back to feed
        </Link>

        <div className="mb-5 flex gap-3 sm:mb-6 sm:gap-4">
          <StoryImage story={story} />
          <div className="min-w-0 flex-1 self-center">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-muted)] sm:gap-2 sm:text-xs">
              <VerificationBadge status={story.verification_status} />
              <span>{story.category}</span>
              {story.organization.map((org) => (
                <span key={org} className="rounded-md bg-[var(--bg-surface)] px-1.5 py-0.5">
                  {org}
                </span>
              ))}
              {flag && <span title={story.country ?? story.country_code}>{flag}</span>}
              <time dateTime={story.published_at}>{formatRelativeDate(story.published_at)}</time>
            </div>
          </div>
        </div>

        <h1 className="mb-6 text-2xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:mb-8 sm:text-4xl">
          {story.headline}
        </h1>

        <section className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-sm">
            What happened
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--text-primary)] sm:text-[16px]">
            {story.what_happened}
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-sm">
            Why it matters
          </h2>
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[16px]">
            {story.why_it_matters}
          </p>
        </section>

        {story.product.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h2 className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-sm">
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

        <section className="mb-8 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4 sm:mb-10 sm:p-5">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:text-sm">
            Source
          </h2>
          <a
            href={story.official_url || story.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-xl bg-[var(--bg-app)] px-3.5 py-3 transition-colors hover:bg-[var(--bg-hover)]"
          >
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-[var(--text-primary)]">
                {story.source_name}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">Read original article</p>
            </div>
            <span className="inline-flex h-9 shrink-0 items-center rounded-full bg-[var(--accent)] px-3.5 text-sm font-medium text-white group-hover:bg-[var(--accent-hover)]">
              Open ↗
            </span>
          </a>
          {story.official_url && story.official_url !== story.source_url && (
            <a
              href={story.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-[var(--accent)] hover:underline"
            >
              Official announcement ↗
            </a>
          )}
        </section>

        {story.tags.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2 sm:mb-12">
            {story.tags.map((tag) => (
              <Link
                key={tag}
                href={`/?q=${encodeURIComponent(tag)}`}
                className="rounded-md border border-[var(--border-default)] px-2 py-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {related.length > 0 && (
          <section>
            <h2 className="mb-3 text-base font-semibold text-[var(--text-primary)] sm:mb-4 sm:text-lg">
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
    </div>
  );
}
