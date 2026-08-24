"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferred(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getPreferred());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)]"
        aria-label="Toggle theme"
      >
        <span className="text-sm">◐</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 14.5A8.5 8.5 0 1 1 11.5 3 7 7 0 0 0 21 14.5z" />
        </svg>
      )}
    </button>
  );
}
