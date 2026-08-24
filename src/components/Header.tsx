import Link from "next/link";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-app)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-[var(--text-primary)]"
        >
          <LogoMark className="h-7 w-7 shrink-0" />
          <span>AI News Orbit</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <Link href="/?filter=confirmed" className="hover:text-[var(--text-primary)] transition-colors">
            Confirmed
          </Link>
          <Link href="/rss" className="hover:text-[var(--text-primary)] transition-colors">
            RSS
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
