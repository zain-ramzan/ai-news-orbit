import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] py-8">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 text-sm text-[var(--text-muted)] sm:px-6">
        <span>© {new Date().getFullYear()} AI News Orbit</span>
        <Link href="/rss" className="hover:text-[var(--text-primary)] transition-colors">
          RSS
        </Link>
      </div>
    </footer>
  );
}
