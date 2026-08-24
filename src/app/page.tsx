import { Header } from "@/components/Header";
import { getLatestDaily, searchStories } from "@/lib/news";
import { NewsFeedClient } from "@/components/NewsFeedClient";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : undefined;
  const verification =
    typeof params.filter === "string"
      ? params.filter
      : typeof params.verification === "string"
        ? params.verification
        : undefined;

  const { stories, total } = searchStories(q, {
    category,
    verification:
      verification === "confirmed" || verification === "reported" || verification === "rumor"
        ? verification
        : undefined,
    limit: 30,
    offset: 0,
  });

  const latest = getLatestDaily();
  const hasFilters = Boolean(q || category || verification);

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            AI News Orbit
          </h1>
          <p className="text-[var(--text-secondary)]">
            Curated developments in agents, frameworks, protocols, and enterprise systems.
          </p>
        </div>

        <form action="/" method="get" className="mb-8">
          <div className="relative">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search agents, MCP, OpenAI, funding…"
              className="w-full rounded-[22px] border border-[var(--border-default)] bg-[var(--bg-surface)] px-5 py-3.5 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              aria-label="Search news"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
            >
              Search
            </button>
          </div>
          {verification && <input type="hidden" name="filter" value={verification} />}
          {category && <input type="hidden" name="category" value={category} />}
        </form>

        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { label: "Latest", href: "/" },
            { label: "Confirmed", href: "/?filter=confirmed" },
            { label: "Protocols", href: "/?category=Protocols" },
            { label: "Coding Agents", href: "/?category=Coding%20Agents" },
            { label: "Enterprise", href: "/?category=Enterprise" },
            { label: "Safety", href: "/?category=Safety" },
            { label: "Funding", href: "/?category=Funding" },
          ].map((chip) => {
            const active =
              (chip.label === "Latest" && !hasFilters) ||
              (chip.label === "Confirmed" && verification === "confirmed") ||
              (chip.href.includes(`category=${encodeURIComponent(chip.label)}`) &&
                category === chip.label);
            return (
              <a
                key={chip.label}
                href={chip.href}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[var(--text-primary)] text-[var(--bg-app)]"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                {chip.label}
              </a>
            );
          })}
        </div>

        {latest && !hasFilters && latest.key_agent_trends.length > 0 && (
          <section className="mb-10 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-[var(--text-muted)]">
              Key agent trends · {latest.date}
            </h2>
            <ul className="space-y-2">
              {latest.key_agent_trends.map((trend, i) => (
                <li key={i} className="flex gap-2 text-[15px] text-[var(--text-secondary)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasFilters && (
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            {total} result{total === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>
        )}

        {stories.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border-default)] px-6 py-16 text-center">
            <h2 className="mb-2 text-lg font-medium text-[var(--text-primary)]">No stories found</h2>
            <p className="mb-4 text-[var(--text-secondary)]">
              Try a different search or clear filters.
            </p>
            <a
              href="/"
              className="inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              View latest
            </a>
          </div>
        ) : (
          <NewsFeedClient
            initialStories={stories}
            initialTotal={total}
            query={q}
            category={category}
            verification={verification}
          />
        )}
      </main>
    </div>
  );
}
