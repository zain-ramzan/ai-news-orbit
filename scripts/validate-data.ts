import fs from "fs";
import path from "path";
import { DailyNewsSchema } from "../src/lib/schema";

const NEWS_DIR = path.join(process.cwd(), "data", "news");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.name.endsWith(".json")) out.push(p);
  }
  return out;
}

let failed = 0;
for (const file of walk(NEWS_DIR)) {
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf-8"));
    const result = DailyNewsSchema.safeParse(raw);
    if (!result.success) {
      console.error("INVALID", file, result.error.flatten());
      failed++;
    } else {
      console.log("OK", file, `(${result.data.stories.length} stories)`);
    }
  } catch (e) {
    console.error("ERROR", file, e);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} file(s) failed validation`);
  process.exit(1);
}
console.log("\nAll news files valid.");
