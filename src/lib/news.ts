import fs from "fs";
import path from "path";
import { NewsStory, DailyNews, IndexEntry, NewsStorySchema, DailyNewsSchema } from "./schema";

const DATA_DIR = path.join(process.cwd(), "data");
const NEWS_DIR = path.join(DATA_DIR, "news");

export function getAllStoryFiles(): string[] {
  const files: string[] = [];
  if (!fs.existsSync(NEWS_DIR)) return files;

  const years = fs.readdirSync(NEWS_DIR).filter((y) => /^\d{4}$/.test(y));
  for (const year of years) {
    const yearPath = path.join(NEWS_DIR, year);
    const months = fs.readdirSync(yearPath).filter((m) => /^\d{2}$/.test(m));
    for (const month of months) {
      const monthPath = path.join(yearPath, month);
      const days = fs
        .readdirSync(monthPath)
        .filter((f) => f.endsWith(".json"))
        .map((f) => path.join(monthPath, f));
      files.push(...days);
    }
  }
  return files.sort().reverse();
}

export function loadDailyNews(filePath: string): DailyNews | null {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const parsed = DailyNewsSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("Invalid daily news file", filePath, parsed.error.flatten());
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.error("Failed to load", filePath, e);
    return null;
  }
}

export function getAllStories(): NewsStory[] {
  const files = getAllStoryFiles();
  const stories: NewsStory[] = [];
  for (const file of files) {
    const daily = loadDailyNews(file);
    if (daily) stories.push(...daily.stories);
  }
  return stories.sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
}

export function getStoryBySlug(slug: string): NewsStory | null {
  return getAllStories().find((s) => s.slug === slug) ?? null;
}

export function getLatestDaily(): DailyNews | null {
  const files = getAllStoryFiles();
  if (files.length === 0) return null;
  return loadDailyNews(files[0]);
}

export function getRelatedStories(story: NewsStory, limit = 4): NewsStory[] {
  const all = getAllStories().filter((s) => s.id !== story.id);
  const scored = all.map((s) => {
    let score = 0;
    if (s.category === story.category) score += 3;
    const orgOverlap = s.organization.filter((o) =>
      story.organization.some((so) => so.toLowerCase() === o.toLowerCase())
    ).length;
    score += orgOverlap * 4;
    const tagOverlap = s.tags.filter((t) => story.tags.includes(t)).length;
    score += tagOverlap * 2;
    const productOverlap = s.product.filter((p) =>
      story.product.some((sp) => sp.toLowerCase() === p.toLowerCase())
    ).length;
    score += productOverlap * 3;
    return { story: s, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.story);
}

export function searchStories(
  query: string,
  options: {
    category?: string;
    verification?: string;
    organization?: string;
    country?: string;
    limit?: number;
    offset?: number;
  } = {}
): { stories: NewsStory[]; total: number } {
  const q = query.trim().toLowerCase();
  let results = getAllStories();

  if (options.category) {
    results = results.filter((s) => s.category === options.category);
  }
  if (options.verification) {
    results = results.filter((s) => s.verification_status === options.verification);
  }
  if (options.organization) {
    const org = options.organization.toLowerCase();
    results = results.filter((s) =>
      s.organization.some((o) => o.toLowerCase().includes(org))
    );
  }
  if (options.country) {
    results = results.filter(
      (s) =>
        s.country_code === options.country ||
        s.country?.toLowerCase() === options.country?.toLowerCase()
    );
  }

  if (q) {
    results = results.filter((s) => {
      const haystack = [
        s.headline,
        s.what_happened,
        s.why_it_matters,
        ...s.organization,
        ...s.product,
        ...s.tags,
        s.category,
        s.source_name,
        s.country ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q) || q.split(/\s+/).every((term) => haystack.includes(term));
    });
  }

  const total = results.length;
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 30;
  return {
    stories: results.slice(offset, offset + limit),
    total,
  };
}

export function getIndex(): IndexEntry[] {
  const indexPath = path.join(DATA_DIR, "index.json");
  if (!fs.existsSync(indexPath)) {
    return getAllStories().map((s) => ({
      id: s.id,
      slug: s.slug,
      headline: s.headline,
      published_at: s.published_at,
      category: s.category,
      organization: s.organization,
      verification_status: s.verification_status,
      country_code: s.country_code,
    }));
  }
  return JSON.parse(fs.readFileSync(indexPath, "utf-8"));
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  UK: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  IN: "🇮🇳",
  CN: "🇨🇳",
  JP: "🇯🇵",
  EU: "🇪🇺",
  CA: "🇨🇦",
  AU: "🇦🇺",
  KR: "🇰🇷",
  GLOBAL: "",
};
