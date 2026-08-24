# AI News Orbit

**The daily intelligence channel for agentic AI.**

AI News Orbit is a continuously updated public news product focused exclusively on AI agents and the systems around them. It is built to feel like a real media product—fast, searchable, calm, and autonomous—not a demo or dashboard template.

**Live site:** [ai-news-orbit.vercel.app](https://ai-news-orbit.vercel.app)  
**Source:** [github.com/zain-ramzan/ai-news-orbit](https://github.com/zain-ramzan/ai-news-orbit)  
**RSS:** [/rss](https://ai-news-orbit.vercel.app/rss) · [/feed.xml](https://ai-news-orbit.vercel.app/feed.xml)

---

## What we cover

| Area | Examples |
|------|----------|
| **AI agents & agentic systems** | Autonomous workflows, multi-agent orchestration |
| **Coding & computer-use agents** | Dev agents, browser/desktop control, harnesses |
| **Frameworks & protocols** | MCP, A2A, tool protocols, interop |
| **Infrastructure** | Runtime, memory, observability, identity |
| **Enterprise** | Production deployments, ROI, vertical agents |
| **Safety & governance** | Evaluation, policy, risk, regulation |
| **Market** | Funding, acquisitions, partnerships, benchmarks |

Every story uses a consistent editorial shape:

1. **What happened** — factual summary  
2. **Why it matters** — why the ecosystem should care  
3. **Sources** — primary link, verification badge (Confirmed / Reported / Rumor)

---

## Product features

- **Daily feed** with search and category filters  
- **Story pages** with related developments  
- **Verification badges** and organization logos  
- **Light / dark mode**  
- **Add reminder** — Google Calendar, Microsoft Outlook, Apple Calendar (Mon–Fri 9:00 briefing)  
- **RSS** for readers and aggregators  
- **SEO** — metadata, sitemap, robots  
- **Historical archive** — every day is kept under `data/news/`

---

## Architecture

```
ai-news-orbit/
├── data/
│   ├── news/YYYY/MM/YYYY-MM-DD.json   # daily stories
│   ├── index.json                     # searchable index
│   └── latest.json                    # pointer to newest day
├── src/
│   ├── app/                           # Next.js App Router pages + API + RSS
│   ├── components/                    # UI (feed, cards, reminder, theme)
│   └── lib/                           # schema (Zod), news loaders, brands
├── scripts/
│   ├── daily-ingest.ts                # research agent entry (CI)
│   ├── validate-data.ts
│   └── rebuild-index.ts
└── .github/workflows/daily-news.yml   # scheduled ingest + commit
```

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Zod · GitHub Actions · Vercel

**Data flow**

1. Morning research (Grok automation + optional GitHub Action) gathers agentic AI news  
2. Stories are validated, deduplicated, and written as JSON under `data/news/`  
3. Indexes are rebuilt  
4. Commit lands on `main`  
5. Vercel redeploys → site updates with no manual publish step

---

## Daily automation

### Grok automation (primary)

A Grok **scheduled automation** runs **every day at 06:00 (Europe/Berlin)**:

- Researches the last ~24 hours of agentic AI news  
- Structures stories to the product schema  
- Pushes updates to `zain-ramzan/ai-news-orbit` on `main`

Name: `ai-news-orbit-daily-ingest`

### GitHub Actions (backup / CI)

Workflow: `.github/workflows/daily-news.yml`

| Trigger | Schedule |
|---------|----------|
| Cron | `0 6 * * *` (06:00 UTC daily) |
| Manual | `workflow_dispatch` |

**Secret required for the Action path**

| Secret | Where |
|--------|--------|
| `GROK_API_KEY` | Repo → Settings → Secrets and variables → Actions |

Without the secret, the Action skips live research and exits cleanly.

---

## Local development

```bash
git clone https://github.com/zain-ramzan/ai-news-orbit.git
cd ai-news-orbit
npm install
npm run dev
```

Useful scripts:

```bash
npm run validate-data   # Zod-check daily JSON
npm run rebuild-index   # rebuild index.json + latest.json
npm run build           # production build
```

---

## Story schema (summary)

Each story includes: `id`, `slug`, `headline`, `what_happened`, `why_it_matters`, `organization`, `product`, `category`, `tags`, `published_at`, `source_name`, `source_url`, `verification_status`, `confidence`, optional `image_url` / `country_code` / `official_url`.

Daily file:

```json
{
  "date": "YYYY-MM-DD",
  "generated_at": "ISO-8601",
  "key_agent_trends": ["..."],
  "stories": [ /* NewsStory[] */ ]
}
```

---

## Deploy

1. Import the repo on [Vercel](https://vercel.com)  
2. Framework preset: Next.js  
3. Every push to `main` (including automated news commits) triggers a production deploy  

No runtime secrets are required for the public site; content is static JSON in the repo.

---

## Editorial principles

- Prioritize the last 24 hours  
- Prefer primary sources  
- Deduplicate aggressively  
- Never invent events  
- Label uncertainty (Reported / Rumor) instead of overstating  
- Keep language clear and neutral

---

## License & contact

Product and archive © AI News Orbit contributors.  
Issues and improvements: open a GitHub issue on this repository.
