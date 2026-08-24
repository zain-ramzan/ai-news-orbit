import Link from "next/link";
import type { NewsStory } from "@/lib/schema";
import { COUNTRY_FLAGS, formatRelativeDate } from "@/lib/format";
import { StoryImage } from "./StoryImage";

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

export function StoryCard({ story }: { story: NewsStory }) {
  const flag =
    story.country_code && story.country_code !== "GLOBAL"
      ? COUNTRY_FLAGS[story.country_code] ?? ""
      : "";

  return (
    <article className="group border-b border-[var(--border-default)] py-6 last:border-0">
      <div className="flex gap-4">
        <Link href={`/news/${story.slug}`} className="shrink-0">
          <StoryImage story={story} size={96} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <VerificationBadge status={story.verification_status} />
            <span>{story.category}</span>
            {story.organization[0] && (
              <>
                <span aria-hidden>·</span>
                <span>{story.organization[0]}</span>
              </>
            )}
            {flag && (
              <>
                <span aria-hidden>·</span>
                <span title={story.country ?? story.country_code}>
                  {flag}{" "}
                  <span className="sr-only">{story.country ?? story.country_code}</span>
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <time dateTime={story.published_at}>{formatRelativeDate(story.published_at)}</time>
          </div>

          <h2 className="mb-2 text-lg font-semibold leading-snug tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors sm:text-xl">
            <Link href={`/news/${story.slug}`}>{story.headline}</Link>
          </h2>

          <p className="mb-3 line-clamp-2 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {story.what_happened}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>{story.source_name}</span>
            {story.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--border-default)] px-1.5 py-0.5 text-[11px] text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
