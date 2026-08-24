# AI News Orbit

Curated, continuously updated news on AI agents, agentic systems, coding agents, computer-use agents, frameworks, protocols, infrastructure, safety, and enterprise deployments.

## Repository

**https://github.com/zain-ramzan/ai-news-orbit**

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Zod validation
- GitHub Actions (daily news automation)
- Vercel hosting

## Local development

```bash
git clone https://github.com/zain-ramzan/ai-news-orbit.git
cd ai-news-orbit
npm install
npm run dev
```

```bash
npm run validate-data
npm run rebuild-index
npm run build
```

## Data

Daily files live under `data/news/YYYY/MM/YYYY-MM-DD.json`, plus `data/index.json` and `data/latest.json`.

## Daily automation

Workflow: `.github/workflows/daily-news.yml` (05:00 UTC + manual).

Required secret: `GROK_API_KEY` (Settings → Secrets → Actions).

## Deploy

Import this repo on Vercel. Pushes to `main` deploy automatically.
