# ⚡ RadarStrike
### *Autonomous Competitor Intelligence & Real-Time Churn Capture Engine*

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbavisetti-suresh%2Fmongo-vercel-tavily&env=AI_GATEWAY_API_KEY,AI_GATEWAY_URL,TAVILY_API_KEY,MONGODB_URI,MONGODB_DB&project-name=radarstrike&repository-name=radarstrike)

---

## 🏆 The 10-Second Pitch
When competitors hike prices, deprecate features, or hit unexpected downtime, their users complain publicly on Reddit, X, and forums. **RadarStrike** combines real-time factual web intelligence, semantic vector search, and dynamic AI model routing to continuously monitor competitive surfaces, detect buyer churn intent in real time, and generate high-converting, non-spammy counter-attack battlecards and empathetic migration outreach.

---

## ⚡ Quick Start & Interactive Evaluation Guide

RadarStrike supports two evaluation paths:

### 🌟 Path A: Zero-Config Sandbox (Instant Run — No Keys Required)
RadarStrike includes a **built-in resilient sandbox** with real-world pre-warmed datasets and an in-memory vector similarity engine. You can clone and run it immediately without needing to configure or fund any API keys:

```bash
# 1. Clone & Install
git clone https://github.com/bavisetti-suresh/mongo-vercel-tavily.git
cd mongo-vercel-tavily
npm install

# 2. Run Diagnostics
npm run verify

# 3. Start Development Server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)**. All UI cards, 1-click intelligence presets, threat gauges, vector matches, and slide-over battlecards are 100% functional out of the box.

---

### 🚀 Path B: 100% Live Mode (Connecting Platform Credentials)
If you would like to run live web crawling, write live documents to MongoDB Atlas, and stream directly through Vercel AI Gateway:

1. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Add your credentials:
```env
# Vercel AI Gateway (All LLM Routing & Failovers)
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
AI_GATEWAY_URL=https://ai-gateway.vercel.sh/v1

# Tavily AI Search (Live Factual Web Intelligence)
TAVILY_API_KEY=tvly-your_key

# MongoDB Atlas (Persistent Storage & Vector Search)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=radarstrike
```

3. Run the automated diagnostic tool to verify all services connect:
```bash
npm run verify
```
Expected output:
```
==================================================
⚡ RadarStrike System & Credential Diagnostic
==================================================

1. Vercel AI Gateway (https://ai-gateway.vercel.sh/v1):
   🟢 CONNECTED - Model: openai/gpt-4o-mini (1014ms) - Response: "OK"

2. Tavily AI Real-Time Search:
   🟢 CONNECTED - Live web search active (2152ms, 1 result returned)

3. MongoDB Atlas & Vector Database:
   🟢 CONNECTED - Atlas cluster reached (732ms, 4 databases visible)

==================================================
🚀 Status: System is READY. Run `npm run dev` to launch UI.
==================================================
```

4. Launch the application:
```bash
npm run dev
```

---

## 🧪 Interactive Testing Walkthrough

Once the app is open at **[http://localhost:3000](http://localhost:3000)**, explore the following capabilities:

### 1. Test 1-Click Intelligence Presets (Command Bar)
* Click **Resend vs SendGrid** (Email Infrastructure)
* Click **Supabase vs Firebase** (Database & Auth)
* Click **PostHog vs Mixpanel** (Product Analytics)
* *Live Test:* Type any custom startup and competitor in the inputs and click **"Launch Strike"** to watch Tavily crawl the live web and persist to Atlas.

### 2. Inspect Column 1: Competitive Surface Radar (Defense)
* **Vulnerability Index:** Observe dynamic gauges for *Pricing Vulnerability*, *Reliability & Outage Risk*, and *Developer Satisfaction*.
* **Detected Moves & Changelogs:** Review extracted recent pricing plan changes and deprecations with verified source links.
* **Stealth & Emerging Challengers:** View newly discovered open-source or stealth alternatives gaining traction in the category.

### 3. Inspect Column 2: Live Churn & Grievance Stream (Offense)
* Review live developer complaints from Reddit (`r/SaaS`, `r/webdev`), Hacker News, and X.
* Notice urgency badges (`🔥 Critical Churn: Actively Leaving`, `⚡ High Intent`, `💸 Pricing Shock`).
* **MongoDB Atlas Vector Match:** See how each complaint is semantically paired to a specific product differentiator with a similarity confidence score (e.g. *94% Match: Zero-Surprise Transparent Pricing*).
* Click the **"Thread"** link to inspect the actual web source.

### 4. Open the Strike Engine Drawer (Conversion Battlecard)
* Click **"Synthesize Battlecard & Outreach"** on any grievance card.
* **Tab 1 — Internal Battlecard:** Review the competitor vulnerability analysis, our architectural advantage, sales talking points, and the objection handling matrix.
* **Tab 2 — Authentic Migration Offer:** Review the empathetic, technical, non-spammy outreach message with a 1-click **"Copy Message"** button ready to paste onto Reddit or DM to the prospect.
* **Telemetry Bar:** Notice the active model identifier (routed through Vercel AI Gateway), latency in milliseconds, and Edge Cache status.

### 5. Dynamic Model Switching & Circuit Breaker
* In the top navbar, use the **Model Selector** dropdown to switch between:
  * `⚡ Hybrid Auto-Route (Vercel Gateway)`
  * `OpenAI GPT-4o (Deep Strategy)`
  * `OpenAI GPT-4o Mini (Ultra-Fast)`
  * `Claude 3.5 Sonnet (If enabled on Gateway)`
* If a model encounters a rate limit or missing provider key, the **Gateway Circuit Breaker** automatically fails over to a secondary model on Vercel AI Gateway without breaking the session, displaying a `Failover Used` telemetry tag.

---

## 🛠️ System Architecture & Technology Stack

| Platform Layer | Role in RadarStrike | Implementation Details |
| :--- | :--- | :--- |
| **Vercel AI Gateway & AI SDK** | Intelligent LLM Control Plane | Integrated using official Vercel AI Gateway specs (`https://ai-gateway.vercel.sh/v1` via `@ai-sdk/openai`). Enforces model routing, circuit-breaker failovers, and live telemetry tracking (latency, tokens, cache hits). |
| **MongoDB Atlas** | Persistent Memory & Vector Search | Stores competitor profiles, scan history, solution knowledge bases, and churn leads in collections: `competitor_scans`, `grievances`, and `battlecards`. Performs **Atlas Vector Search** (`$vectorSearch` aggregation pipeline with in-memory cosine fallback). |
| **Tavily AI Search API** | Real-Time Live Web Intelligence | Targeted multi-query web retrieval (`@tavily/core`) crawling changelogs, pricing documentation, and dev forums (`site:reddit.com`, Hacker News) with verified citations and snippet extraction. |
| **Next.js 15 (App Router)** | Full-Stack Platform | React 19, Server Actions, TypeScript, Tailwind CSS, Lucide icons, glassmorphic dark-mode mission control UI. |

---

## 📂 Project Structure

```
├── scripts/
│   └── verify.mjs               # CLI diagnostic tool to verify all platform connections
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── battlecard/      # Generates internal battlecard & outreach via Vercel AI Gateway
│   │   │   ├── scan/            # Executes Tavily search, Atlas vector pairing & persistence
│   │   │   └── status/          # Real-time health check for Gateway, Atlas & Tavily
│   │   ├── globals.css          # Radar grid background, glowing cards & theme styles
│   │   ├── layout.tsx           # Dark theme shell with metadata
│   │   └── page.tsx             # Master Mission Control Dashboard orchestrator
│   ├── components/
│   │   ├── BattlecardDrawer.tsx # Slide-over battlecard & 1-click outreach message generator
│   │   ├── ChurnFeedColumn.tsx  # Live grievance stream with Atlas vector match pills
│   │   ├── CommandBar.tsx       # 1-click demo presets & custom scan search bar
│   │   ├── Navbar.tsx           # Platform status badges, model selector & latency meter
│   │   ├── SettingsModal.tsx    # System architecture & key configuration modal
│   │   └── ThreatRadarColumn.tsx# Competitor vulnerability index, moves & stealth radar
│   └── lib/
│       ├── db/
│       │   ├── mongodb.ts       # MongoDB Atlas singleton connection pool & fallback buffer
│       │   ├── schema.ts        # TypeScript data contracts
│       │   └── vector.ts        # Atlas Vector Search pipeline & cosine similarity matcher
│       └── services/
│           ├── ai-gateway.ts    # Vercel AI Gateway client, dynamic models & failover
│           ├── presets.ts       # Pre-warmed datasets for Resend, Supabase, PostHog
│           └── tavily.ts        # Parallel Tavily search agent for changelogs & churn
├── .env.example                 # Environment variable template
├── package.json                 # Project dependencies & scripts
└── tailwind.config.ts           # Mission control radar theme tokens
```

---

## 📜 Available Commands

```bash
# Verify credentials & connectivity
npm run verify

# Run development server
npm run dev

# Run production build & type checks
npm run build

# Start production server
npm start
```
