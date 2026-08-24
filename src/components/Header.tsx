import Link from "next/link";
import { LogoMark } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ReminderButton } from "./ReminderButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-app)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 font-semibold tracking-tight text-[var(--text-primary)]"
        >
          <LogoMark className="h-7 w-7 shrink-0" />
          <span className="truncate">AI News Orbit</span>
        </Link>
        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/?filter=confirmed"
            className="hidden text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:inline"
          >
            Confirmed
          </Link>
          <ReminderButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
