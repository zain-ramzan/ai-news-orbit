import { getAllStories } from "@/lib/news";

export async function GET() {
  const stories = getAllStories().slice(0, 50);
  const base = "https://ai-news-orbit.vercel.app";

  const items = stories
    .map(
      (s) => `
    <item>
      <title><![CDATA[${s.headline}]]></title>
      <link>${base}/news/${s.slug}</link>
      <guid isPermaLink="true">${base}/news/${s.slug}</guid>
      <pubDate>${new Date(s.published_at).toUTCString()}</pubDate>
      <description><![CDATA[${s.what_happened}]]></description>
      <category>${s.category}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI News Orbit</title>
    <link>${base}</link>
    <description>Curated news on AI agents, frameworks, protocols, and enterprise deployments.</description>
    <language>en</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
