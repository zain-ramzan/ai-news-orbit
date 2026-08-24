"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StoryCard } from "./StoryCard";
import type { NewsStory } from "@/lib/schema";

type Props = {
  initialStories: NewsStory[];
  initialTotal: number;
  query?: string;
  category?: string;
  verification?: string;
};

export function NewsFeedClient({
  initialStories,
  initialTotal,
  query = "",
  category,
  verification,
}: Props) {
  const [stories, setStories] = useState(initialStories);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(initialStories.length);

  const loadMore = useCallback(async () => {
    if (loading || offsetRef.current >= total) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        offset: String(offsetRef.current),
        limit: "20",
      });
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      if (verification) params.set("verification", verification);

      const res = await fetch(`/api/news?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more stories");
      const data = await res.json();
      setStories((prev) => {
        const ids = new Set(prev.map((s) => s.id));
        const next = data.stories.filter((s: NewsStory) => !ids.has(s.id));
        return [...prev, ...next];
      });
      setTotal(data.total);
      offsetRef.current += data.stories.length;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [loading, total, query, category, verification]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="divide-y-0">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-8" aria-hidden />

      {loading && (
        <div className="space-y-6 py-4" aria-live="polite" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-3 w-32" />
              <div className="skeleton h-6 w-full max-w-xl" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="py-6 text-center">
          <p className="mb-2 text-sm text-[var(--text-secondary)]">{error}</p>
          <button
            type="button"
            onClick={() => loadMore()}
            className="rounded-full bg-[var(--bg-surface)] px-4 py-2 text-sm font-medium hover:bg-[var(--bg-hover)]"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && offsetRef.current >= total && stories.length > 0 && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          End of results
        </p>
      )}
    </div>
  );
}
