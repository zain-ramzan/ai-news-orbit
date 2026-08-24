import fs from "fs";
import path from "path";
import { getAllStories, getAllStoryFiles, loadDailyNews } from "../src/lib/news";

const DATA = path.join(process.cwd(), "data");

const stories = getAllStories();
const index = stories.map((s) => ({
  id: s.id,
  slug: s.slug,
  headline: s.headline,
  published_at: s.published_at,
  category: s.category,
  organization: s.organization,
  verification_status: s.verification_status,
  country_code: s.country_code,
}));

fs.writeFileSync(path.join(DATA, "index.json"), JSON.stringify(index, null, 2));

const files = getAllStoryFiles();
const latestFile = files[0];
if (latestFile) {
  const daily = loadDailyNews(latestFile);
  fs.writeFileSync(
    path.join(DATA, "latest.json"),
    JSON.stringify(
      {
        date: daily?.date ?? null,
        story_count: daily?.stories.length ?? 0,
        updated_at: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

const searchIndex = stories.map((s) => ({
  id: s.id,
  slug: s.slug,
  text: [
    s.headline,
    s.what_happened,
    ...s.organization,
    ...s.product,
    ...s.tags,
    s.category,
  ]
    .join(" ")
    .toLowerCase(),
  published_at: s.published_at,
}));
fs.writeFileSync(path.join(DATA, "search-index.json"), JSON.stringify(searchIndex));

console.log(`Indexed ${stories.length} stories.`);
