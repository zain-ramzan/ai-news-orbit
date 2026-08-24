import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>AI News Orbit — agentic AI intelligence</p>
        <div className="flex gap-4">
          <Link href="/rss" className="hover:text-[var(--text-primary)] transition-colors">
            RSS
          </Link>
          <a href="/feed.xml" className="hover:text-[var(--text-primary)] transition-colors">
            feed.xml
          </a>
        </div>
      </div>
    </footer>
  );
}
