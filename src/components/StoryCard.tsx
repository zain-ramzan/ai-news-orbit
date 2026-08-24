import Link from "next/link";
import type { NewsStory } from "@/lib/schema";
import { COUNTRY_FLAGS, formatRelativeDate } from "@/lib/format";
import { StoryImage } from "./StoryImage";

function VerificationBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:px-2 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-white/90" aria-hidden />
        Confirmed
      </span>
    );
  }
  if (status === "reported") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-900 sm:px-2 sm:text-[11px]">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900/80" aria-hidden />
        Reported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-zinc-500 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white sm:px-2 sm:text-[11px]">
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
    <article className="group border-b border-[var(--border-default)] py-4 sm:py-6 last:border-0">
      <div className="flex gap-3 sm:gap-4">
        <Link href={`/news/${story.slug}`} className="shrink-0">
          <StoryImage story={story} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-[var(--text-muted)] sm:mb-2 sm:text-xs">
            <VerificationBadge status={story.verification_status} />
            <span className="hidden xs:inline sm:inline">{story.category}</span>
            {story.organization[0] && (
              <>
                <span aria-hidden className="text-[var(--border-strong)]">·</span>
                <span>{story.organization[0]}</span>
              </>
            )}
            {flag && (
              <>
                <span aria-hidden>·</span>
                <span title={story.country ?? story.country_code}>{flag}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <time dateTime={story.published_at}>{formatRelativeDate(story.published_at)}</time>
          </div>

          <h2 className="mb-1.5 text-[15px] font-semibold leading-snug tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors sm:mb-2 sm:text-lg">
            <Link href={`/news/${story.slug}`}>{story.headline}</Link>
          </h2>

          <p className="mb-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--text-secondary)] sm:mb-3 sm:text-[15px]">
            {story.what_happened}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--text-muted)] sm:gap-2 sm:text-xs">
            <span>{story.source_name}</span>
            {story.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="hidden rounded-md border border-[var(--border-default)] px-1.5 py-0.5 text-[10px] sm:inline"
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
