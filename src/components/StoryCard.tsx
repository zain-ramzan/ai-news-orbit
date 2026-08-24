import Link from "next/link";
import type { NewsStory } from "@/lib/schema";
import { COUNTRY_FLAGS, formatRelativeDate } from "@/lib/format";

function VerificationBadge({ status }: { status: string }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
        Confirmed
      </span>
    );
  }
  if (status === "reported") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        Reported
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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

      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
        <span>{story.source_name}</span>
        {story.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-[var(--bg-surface)] px-1.5 py-0.5 text-[11px]"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
