# AgentSignal

**The signal in agentic AI.**

AgentSignal is a continuously updated public news platform dedicated to AI agents, agentic systems, coding agents, computer-use agents, multi-agent frameworks, protocols (MCP, A2A, …), infrastructure, safety, and enterprise deployments.

It is designed as a calm, searchable, historical archive — not a scraped feed or a noisy dashboard.

## Live

- **GitHub:** https://github.com/zain-ramzan/agent-signal
- **Production (Vercel):** connect the repo and deploy to `agentsignal.vercel.app` (or the nearest available name)

## Architecture

```text
/data/news/YYYY/MM/YYYY-MM-DD.json   # daily story batches + key trends
/data/index.json                     # lightweight story index
/data/latest.json                    # pointer to newest day
/data/search-index.json              # optional search text index

src/lib/schema.ts                    # Zod schemas
src/lib/news.ts                      # load, search, related, pagination
src/app/                             # Next.js App Router UI + API
scripts/                             # validate, rebuild-index, daily-ingest
.github/workflows/daily-news.yml     # scheduled research + commit
```

GitHub is the source of truth. Vercel builds from `main` on every push.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zod (runtime validation)
- GitHub Actions (daily automation)
- Vercel (hosting)

## Local development

```bash
git clone https://github.com/zain-ramzan/agent-signal.git
cd agent-signal
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run validate-data   # schema-check all daily JSON
npm run rebuild-index   # regenerate index.json / latest.json / search-index
npm run build           # production build
```

## Data format

Each daily file follows `DailyNewsSchema` (see `src/lib/schema.ts`):

- `date`, `generated_at`, `key_agent_trends[]`
- `stories[]` with stable `id` + `slug`, headline, what_happened, why_it_matters, organization, product, category, tags, country, sources, verification_status (`confirmed` | `reported` | `rumor`), confidence

Categories are controlled (Products, Models, Coding Agents, Computer Use, Enterprise, Frameworks, Protocols, Research, Funding, Acquisitions, Partnerships, Benchmarks, Infrastructure, Open Source, Security, Safety, Regulation).

## Daily automation

Workflow: `.github/workflows/daily-news.yml`

1. Runs on a morning UTC schedule (~05:00 UTC ≈ 07:00 Europe/Rome in summer) and on `workflow_dispatch`.
2. Installs dependencies.
3. If `GROK_API_KEY` secret is set, runs `scripts/daily-ingest.ts` (research → validate → write daily JSON).
4. Validates data and rebuilds indexes.
5. Commits only when there are real changes (avoids empty commits).
6. Vercel auto-deploys from the push.

### Required GitHub secret

| Secret          | Purpose                                      |
|-----------------|----------------------------------------------|
| `GROK_API_KEY`  | Authenticates the research agent (server-side only) |

Add under **Settings → Secrets and variables → Actions**.

Never expose this key to client-side code.

### Completing the Grok integration

`scripts/daily-ingest.ts` is intentionally a safe stub until the key is present and the research call is wired. To finish:

1. Add `GROK_API_KEY` to repository secrets.
2. Implement the API call inside `daily-ingest.ts` using the editorial prompt from the product brief (prioritize last 24h, official sources, dedupe, confirmed vs reported).
3. Parse the model output as JSON, validate with `DailyNewsSchema`, reject malformed URLs/dates, merge with existing archive, write `data/news/YYYY/MM/YYYY-MM-DD.json`.
4. Re-run `npm run rebuild-index`.

Manual fallback: edit or add a daily JSON file, run validate + rebuild-index, commit.

## Product principles

- Quality over quantity — a quiet day with strong stories is better than noise.
- Confirmed vs reported is always visible.
- Progressive loading (infinite scroll) so the archive stays fast after years of data.
- Search + lightweight filters; no analytics-dashboard clutter.
- ChatGPT-inspired calm UI: neutral surfaces, strong typography, restrained color, generous whitespace.
- Story pages explain *what happened* and *why it matters*, then send users to original sources.

## SEO & feeds

- `/sitemap.xml`, `/robots.txt`, Open Graph metadata
- `/feed.xml` RSS of recent stories

## License

MIT (application code). News summaries are original short-form intelligence; always link back to primary sources.

---

Built to be a durable public archive for the agentic AI ecosystem.
