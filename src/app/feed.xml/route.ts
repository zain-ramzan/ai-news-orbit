import { getAllStories } from "@/lib/news";

export async function GET() {
  const stories = getAllStories().slice(0, 50);
  const base = "https://ai-news-orbit.vercel.app";

  const items = stories
    .map((s) => {
      const desc = s.what_happened
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const title = s.headline
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `
    <item>
      <title>${title}</title>
      <link>${base}/news/${s.slug}</link>
      <guid isPermaLink="true">${base}/news/${s.slug}</guid>
      <pubDate>${new Date(s.published_at).toUTCString()}</pubDate>
      <description>${desc}</description>
      <category>${s.category}</category>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI News Orbit</title>
    <link>${base}</link>
    <description>Curated news on AI agents, frameworks, protocols, and enterprise deployments.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
