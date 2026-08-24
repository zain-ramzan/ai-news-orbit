# AI News Orbit

**The daily intelligence channel for agentic AI.**

AI News Orbit is a continuously updated public news product focused exclusively on AI agents and the systems around them. It is built to feel like a real media product—fast, searchable, calm, and autonomous—not a demo or dashboard template.

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

## License & contact

Product and archive © AI News Orbit contributors.  
Issues and improvements: open a GitHub issue on this repository.
