import { z } from "zod";

export const VerificationStatus = z.enum(["confirmed", "reported", "rumor"]);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

export const Category = z.enum([
  "Products",
  "Models",
  "Coding Agents",
  "Computer Use",
  "Enterprise",
  "Frameworks",
  "Protocols",
  "Research",
  "Funding",
  "Acquisitions",
  "Partnerships",
  "Benchmarks",
  "Infrastructure",
  "Open Source",
  "Security",
  "Safety",
  "Regulation",
]);
export type Category = z.infer<typeof Category>;

export const NewsStorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  headline: z.string().min(5).max(200),
  what_happened: z.string().min(20).max(2000),
  why_it_matters: z.string().min(20).max(2000),
  organization: z.array(z.string()).default([]),
  product: z.array(z.string()).default([]),
  category: Category,
  tags: z.array(z.string()).default([]),
  country: z.string().optional(),
  country_code: z.string().length(2).or(z.literal("GLOBAL")).optional(),
  image_url: z.string().url().optional().nullable(),
  published_at: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  discovered_at: z.string().datetime({ offset: true }).or(z.string()),
  source_name: z.string().min(1),
  source_url: z.string().url(),
  official_url: z.string().url().optional().nullable(),
  verification_status: VerificationStatus,
  confidence: z.enum(["high", "medium", "low"]).default("high"),
});

export type NewsStory = z.infer<typeof NewsStorySchema>;

export const DailyNewsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  generated_at: z.string(),
  key_agent_trends: z.array(z.string()).max(8).default([]),
  stories: z.array(NewsStorySchema),
});

export type DailyNews = z.infer<typeof DailyNewsSchema>;

export const IndexEntrySchema = z.object({
  id: z.string(),
  slug: z.string(),
  headline: z.string(),
  published_at: z.string(),
  category: z.string(),
  organization: z.array(z.string()),
  verification_status: VerificationStatus,
  country_code: z.string().optional(),
});

export type IndexEntry = z.infer<typeof IndexEntrySchema>;
