import type { MetadataRoute } from "next";
import { getAllStories } from "@/lib/news";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agentsignal.vercel.app";
  const stories = getAllStories();

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...stories.map((s) => ({
      url: `${base}/news/${s.slug}`,
      lastModified: new Date(s.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
