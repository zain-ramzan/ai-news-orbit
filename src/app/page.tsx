import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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

  const chips = [
    { id: "latest", label: "Latest", href: "/", active: !hasFilters },
    {
      id: "confirmed",
      label: "Confirmed",
      href: "/?filter=confirmed",
      active: verification === "confirmed" && !category && !q,
    },
    {
      id: "protocols",
      label: "Protocols",
      href: "/?category=Protocols",
      active: category === "Protocols",
    },
    {
      id: "coding",
      label: "Coding Agents",
      href: "/?category=Coding%20Agents",
      active: category === "Coding Agents",
    },
    {
      id: "enterprise",
      label: "Enterprise",
      href: "/?category=Enterprise",
      active: category === "Enterprise",
    },
    {
      id: "safety",
      label: "Safety",
      href: "/?category=Safety",
      active: category === "Safety",
    },
    {
      id: "funding",
      label: "Funding",
      href: "/?category=Funding",
      active: category === "Funding",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)]">
      <Header />

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6">
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
        </form>

        <div className="mb-6 flex flex-wrap gap-2" role="list">
          {chips.map((chip) => (
            <a
              key={chip.id}
              href={chip.href}
              role="listitem"
              aria-current={chip.active ? "page" : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                chip.active
                  ? "bg-[var(--accent)] text-white shadow-sm ring-2 ring-[var(--accent)]/30"
                  : "border border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {chip.label}
            </a>
          ))}
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

      <Footer />
    </div>
  );
}
