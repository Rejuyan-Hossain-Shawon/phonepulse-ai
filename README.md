# PhonePulse AI — Smartphone Consumer & Market Intelligence

**Portfolio development edition (V2).** React + Express + MongoDB (optional) + optional local Python transformer. No paid API required to explore. Built to distinguish **real observations** from **synthetic demonstration data**.

## What is implemented

- Responsive dashboard, login/register with MongoDB, isolated user review records, demo sign-in
- Text analysis and review CSV import; brand/model detection, overall sentiment, keyword-based feature tags
- Optional **real pretrained transformer** for overall sentiment (requires Python service; otherwise transparent heuristic fallback)
- Dedicated **Regional Intelligence** with country/year/quarter/source filters and regional review counts
- **Sales & Market Share** demo charts using deterministic synthetic quarterly shipment-style records for eight countries and ten brands, with no claim these are real sales
- **Brands & Models** searchable illustrative catalog, model detail and review evidence
- **Feature Intelligence** camera/battery/gaming/heating/etc. keyword mentions with original reviews
- **Trends & Impactful Models** timestamp-based discussion volume and model mention rankings
- **Brand Comparison**, **Explorer**, **Alerts**, **Data Sources**, **YouTube Monitoring**, CSV export
- User-owned market CSV upload, explicit synthetic checkbox, separate uploaded vs synthetic market charts
- Tests for sentiment baseline, aggregation, market fixtures and market CSV validation

## Not implemented / important limitations

- **Not actual regional sales, market share or phone usage data.** Demo figures and reference specifications are illustrative.
- **No validated aspect-based sentiment, buying-intention classifier, multilingual evaluation, emotion model or AI-generated evidence-grounded summaries.** The app currently shows exploratory keyword-based aspects and simple overall sentiment. Optional transformer upgrades overall sentiment only.
- No guaranteed 24/7 hosting; scheduled YouTube collection works only while the backend is running, with valid key/permissions/quota and MongoDB.
- Admin user-management UI, email alerts, enterprise RBAC, production-grade auditing, verified regional subnational analytics and commercial connectors are future work.
- User-provided CSV market figures are not verified; mark synthetic accurately and include a proper source name. The app does not verify upload licenses.
- Demo-mode mutations exist in backend memory and **reset when the backend restarts**. To persist data, configure MongoDB and use a registered account.
- JWT in browser localStorage is a development convenience; review session storage/refresh and CSRF/XSS protections before production.

## Windows PowerShell quick start

1. Extract the ZIP into a path without `&` or unusual shell characters.
2. Open the **PhonePulse-AI** folder in VS Code.
3. Run:

```powershell
npm.cmd install
npm.cmd run install:all
Copy-Item server/.env.example server/.env
npm.cmd run dev
```

4. Open **http://127.0.0.1:5173** and select **Explore interactive demo**.

`npm.cmd run test` runs the backend tests. `npm.cmd run build` builds the React frontend.

### Persistent accounts / uploads

Create a separate free MongoDB Atlas database and database user, then set `MONGODB_URI` in `server/.env`. Set a long, random `JWT_SECRET` (keep it private). Restart the backend, register a normal account, and import your data. The app does not include credentials. Set `DEMO_MODE=false` if you want to disable demo mode; set secure production settings before deployment.

### Optional real transformer NLP

Python service (requires Python 3.10–3.12, preferably, and sufficient RAM; model download requires internet on first run):

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

In `server/.env`, set `AI_SERVICE_URL=http://127.0.0.1:8000` and restart Express. New text/review imports will use a pretrained sentiment model for **overall** sentiment when available, and transparently fall back to the baseline when it is not. Existing records are not automatically reanalyzed. Model confidence is **not calibrated**. The service is not suitable for untrusted public deployment without authentication and resource controls.

### YouTube comment monitoring

Obtain an authorized YouTube Data API key, set `YOUTUBE_API_KEY` in `server/.env`, configure MongoDB, and sign in with a registered account. Create a video monitor on the Monitoring page and manually fetch comments; the backend also checks monitors at the configured interval while running. This collects accessible **top-level comments**, not all comments, platforms or the population. API quotas and permissions apply. No key is included.

### Data import

**Reviews CSV:** `text` or `review` or `comment` or `content` column. Imports are analyzed using the active sentiment engine. Choose a country only when every row is genuinely from that country; otherwise use Unverified.

**Market CSV:** `country,brand,year,quarter,units,isSynthetic` (optional sourceName). Use the downloadable template in **Data Sources**. Select **Uploaded data** in Regional/Market pages to view it. Do not combine synthetic and real market sources in the same chart.

## Architecture

```
PhonePulse-AI/
  client/         React, Vite, Recharts, responsive pages
  server/         Express, optional MongoDB, YouTube collector, data APIs, tests
  ai-service/     Optional FastAPI pretrained sentiment inference
```

## Product integrity rules

- Market share = brand units / total units in the selected **market dataset**. Not automatically real market share.
- Discussion share = brand mentions / all recognized mentions in the selected review dataset. Not sales.
- Positive share = positive reviews / analyzed reviews in the selected set. Not a representative poll.
- Regional labels require user-provided/source metadata; language is not evidence of country.
- Never present synthetic fixtures or example specifications as verified market facts.
- Evaluate models on manually labeled, representative smartphone reviews before claiming high accuracy.
