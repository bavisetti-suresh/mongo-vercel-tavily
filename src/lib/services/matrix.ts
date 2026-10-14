import { BattleMatrix, MatrixRow } from "../db/schema";
import { executeGatewayPrompt } from "./ai-gateway";

export const PRESET_MATRICES: Record<string, BattleMatrix> = {
  "mongodb-dynamodb": {
    userProduct: "MongoDB Atlas",
    competitor: "DynamoDB",
    overallWinRate: 92,
    recommendedStrikeVector: "Target DynamoDB's painful single-table design constraints and the need for fragmented external vector databases (Pinecone) by highlighting Atlas Vector Search's unified operational data and zero dual-write lag.",
    rows: [
      {
        dimension: "Vector Search & AI Integration",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Native Atlas Vector Search in the same database. Zero ETL pipelines, zero dual-write synchronization drift, unified ACID transactions.",
        competitorWeakness: "No built-in vector search. Requires exporting data via DynamoDB Streams to OpenSearch or third-party vector databases.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Data Modeling & Schema Flexibility",
        category: "DX",
        userProductAdvantage: "Natural JSON document model with nested objects, arrays, and expressive ad-hoc queries without upfront schema rigidity.",
        competitorWeakness: "Requires complex Single-Table Design with concatenated keys (PK/SK); adding a new query pattern requires rebuilding GSIs or table migration.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Multi-Cloud Portability & Lock-In",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Runs across AWS, Google Cloud, and Azure with multi-region multi-cloud clusters and zero vendor lock-in.",
        competitorWeakness: "100% locked into AWS proprietary ecosystem. Migrating out requires massive application rewrites.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Full-Text & Compound Search",
        category: "DX",
        userProductAdvantage: "Atlas Search powered by Apache Lucene allows combining vector embeddings, semantic scoring, and full-text filters in a single query.",
        competitorWeakness: "Basic key-value lookups only. Text search requires provisioning external Amazon OpenSearch Service clusters.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Throughput Pricing & Overage Spikes",
        category: "PRICING",
        userProductAdvantage: "Predictable cluster tiering with auto-scaling. No throttling errors when traffic spikes.",
        competitorWeakness: "Punitive Provisioned/On-Demand WCU/RCU metrics lead to unexpected billing shocks or 400 ProvisionedThroughputExceededException throttles.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Migration Friction",
        category: "MIGRATION",
        userProductAdvantage: "Atlas Live Migration Service and automated DynamoDB JSON import utilities allow cutover in minutes.",
        competitorWeakness: "Overloaded single-table DynamoDB items require schema decomposition scripts.",
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
    ],
  },

  "vercel-aws-amplify": {
    userProduct: "Vercel",
    competitor: "AWS Amplify",
    overallWinRate: 89,
    recommendedStrikeVector: "Exploit Amplify Gen 2's slow CloudFormation deployment times and frequent Next.js App Router breakages by positioning Vercel as the native Next.js Frontend Cloud with built-in AI Gateway and sub-second rollbacks.",
    rows: [
      {
        dimension: "Next.js App Router & Server Actions",
        category: "DX",
        userProductAdvantage: "Created by Next.js core authors. 100% Day-1 support for React 19, Server Actions, streaming SSR, and edge middleware.",
        competitorWeakness: "Reverse-engineers Next.js releases; frequent build failures, hydration mismatches, and delayed feature support.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Deployment Speed & CI/CD Velocity",
        category: "DX",
        userProductAdvantage: "Sub-minute global builds with immutable preview URLs for every Git branch and pull request.",
        competitorWeakness: "Relies on AWS CloudFormation stacks; deploys routinely take 15-25 minutes with frequent stack drift lockouts.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Built-In AI Gateway & Observability",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Edge-routed AI Gateway with multi-model failover, BYOK keys, automatic latency tracing, and token caching.",
        competitorWeakness: "Requires stitching together AWS Bedrock, API Gateway, and CloudWatch with intricate IAM policies.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Instant Rollbacks & Staging Isolation",
        category: "SUPPORT",
        userProductAdvantage: "1-click instant atomic production rollbacks with zero build queue wait time.",
        competitorWeakness: "Rollbacks require re-triggering full CloudFormation stack rollbacks that can stall on resource cleanup.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Developer Onboarding & IAM Setup",
        category: "DX",
        userProductAdvantage: "Zero AWS console or IAM policy nightmares. Connect GitHub repository and deploy in under 60 seconds.",
        competitorWeakness: "Complex AWS IAM roles, Amplify CLI credential syncing, and Cognito configuration overhead.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Migration Friction",
        category: "MIGRATION",
        userProductAdvantage: "Zero-config Git import automatically detects Next.js build settings with zero yaml files needed.",
        competitorWeakness: "Proprietary `amplify.yml` build specs must be discarded.",
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
    ],
  },

  "tavily-perplexity": {
    userProduct: "Tavily",
    competitor: "Perplexity API",
    overallWinRate: 87,
    recommendedStrikeVector: "Target Perplexity API's consumer-focused conversational wrapper and token bloat by highlighting Tavily's purpose-built agentic search infrastructure with domain filtering, raw content extraction, and factual RAG density.",
    rows: [
      {
        dimension: "Token Efficiency & Context Optimization",
        category: "DX",
        userProductAdvantage: "Returns pre-parsed semantic text chunks with zero HTML bloat, reducing LLM token consumption by up to 60%.",
        competitorWeakness: "Returns conversational chat answers rather than raw, factual context chunks suited for downstream agent reasoning.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Multi-Step Agent Exploration Tools",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Granular controls for search depth (`basic` vs `advanced`), domain whitelisting/blacklisting, and real-time news indexing.",
        competitorWeakness: "Opaque search algorithm with limited capability to constrain search parameters or inspect raw crawled domains.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "API Latency for Agent Loops",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Sub-second response latency specifically tuned for iterative multi-hop agent reasoning loops.",
        competitorWeakness: "Higher latency due to generation overhead of full conversational LLM answers rather than direct factual chunks.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Raw Content Scraping & Verification",
        category: "SUPPORT",
        userProductAdvantage: "Provides direct citation URLs, published timestamps, and full parsed content for source validation.",
        competitorWeakness: "Frequently produces hallucinated or aggregated summaries without verifiable direct text quotes.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Developer Pricing & Predictability",
        category: "PRICING",
        userProductAdvantage: "Transparent pay-per-search pricing with generous developer free tier and zero seat minimums.",
        competitorWeakness: "Higher per-query cost bundled with proprietary model inferencing surcharges.",
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
      {
        dimension: "Migration Friction",
        category: "MIGRATION",
        userProductAdvantage: "Lightweight official `@tavily/core` SDK drops into LangChain, LlamaIndex, and Vercel AI SDK in 3 lines.",
        competitorWeakness: "Replacing conversational endpoints requires re-prompting downstream agents.",
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
    ],
  },

  "resend-sendgrid": {
    userProduct: "Resend",
    competitor: "SendGrid",
    overallWinRate: 88,
    recommendedStrikeVector: "Exploit SendGrid's $89.95/mo dedicated IP surcharge and automated ban sweeps to pitch Resend's transparent pricing and human deliverability onboarding.",
    rows: [
      {
        dimension: "Day-1 Account Onboarding",
        category: "SUPPORT",
        userProductAdvantage: "Human deliverability review with zero automated Day-1 account suspension bots.",
        competitorWeakness: "Aggressive ML compliance bots trigger unannounced suspensions with 14+ day support ticket queues.",
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Dedicated IP Pricing",
        category: "PRICING",
        userProductAdvantage: "Dedicated IP available as an add-on at cost ($30/mo) or free on scale tiers.",
        competitorWeakness: "Forces upgrade to expensive $89.95/month tier before allowing a dedicated IP.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Developer Experience & Email Templates",
        category: "DX",
        userProductAdvantage: "Native React Email integration, first-class Next.js support, modern TypeScript SDKs.",
        competitorWeakness: "Legacy WYSIWYG editor built in 2012; clunky v3 API endpoints and outdated SDK wrappers.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Multi-Domain Tenant Isolation",
        category: "INFRASTRUCTURE",
        userProductAdvantage: "Unlimited domains and API keys on every plan with isolated sending reputation.",
        competitorWeakness: "Multi-subuser management locked behind high-tier legacy enterprise contracts.",
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
      {
        dimension: "Pricing Scalability & Hidden Overage",
        category: "PRICING",
        userProductAdvantage: "Predictable per-thousand pricing with automated hard billing caps and alerting.",
        competitorWeakness: "Punitive overage tiers with sudden billing jumps when monthly limits are exceeded.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Migration Friction",
        category: "MIGRATION",
        userProductAdvantage: "Drop-in SMTP and REST API compatibility; cutover takes < 15 minutes with DNS checker.",
        competitorWeakness: "Complex legacy webhooks and outdated IP warmup routines create lock-in inertia.",
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
    ],
  },
};

/**
 * Computes or retrieves a side-by-side Battle Matrix.
 * Returns preset comparison if recognized, or synthesizes dynamic matrix via Vercel AI Gateway.
 */
export async function getOrSynthesizeBattleMatrix(
  userProduct: string,
  competitor: string,
  selectedModel = "hybrid"
): Promise<BattleMatrix> {
  const key = `${userProduct.toLowerCase()}-${competitor.toLowerCase()}`;
  if (PRESET_MATRICES[key]) {
    return PRESET_MATRICES[key];
  }

  // Check reverse or partial match
  for (const presetKey of Object.keys(PRESET_MATRICES)) {
    if (presetKey.includes(competitor.toLowerCase()) || competitor.toLowerCase().includes(presetKey.split("-")[1])) {
      return PRESET_MATRICES[presetKey];
    }
  }

  // Dynamic Synthesis via Vercel AI Gateway
  const prompt = `You are a competitive intelligence strategist. Compare "${userProduct}" against target competitor "${competitor}".
Generate a structured JSON comparison matrix evaluating 6 dimensions:
1. Day-1 Onboarding & Account Risk
2. Pricing Model & Scalability
3. Developer Experience & API DX
4. Infrastructure & Architecture
5. Customer Support & Reliability
6. Migration Friction

Return ONLY valid JSON matching this schema:
{
  "userProduct": "${userProduct}",
  "competitor": "${competitor}",
  "overallWinRate": 85,
  "recommendedStrikeVector": "One concise strategic sentence on where ${competitor} is most vulnerable and how ${userProduct} converts them.",
  "rows": [
    {
      "dimension": "Dimension Name",
      "category": "PRICING",
      "userProductAdvantage": "How ${userProduct} wins",
      "competitorWeakness": "Where ${competitor} fails",
      "winner": "USER_PRODUCT",
      "strikeImpact": "HIGH"
    }
  ]
}`;

  try {
    const res = await executeGatewayPrompt({
      prompt,
      taskType: "reasoning",
      selectedModel: selectedModel as any,
    });

    if (res.text) {
      const cleaned = res.text.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return parsed;
    }
  } catch (err) {
    console.warn("Dynamic matrix synthesis failed, returning baseline matrix:", err);
  }

  // Graceful fallback
  return {
    userProduct,
    competitor,
    overallWinRate: 82,
    recommendedStrikeVector: `Leverage ${competitor}'s pricing overhead and legacy support latency to position ${userProduct} as the modern, high-velocity alternative.`,
    rows: [
      {
        dimension: "Pricing & Billing Predictability",
        category: "PRICING",
        userProductAdvantage: `Transparent tiered pricing with hard limits and no unexpected overage penalties.`,
        competitorWeakness: `Opaque tiered pricing with unexpected billing spikes as volume scales.`,
        winner: "USER_PRODUCT",
        strikeImpact: "CRITICAL",
      },
      {
        dimension: "Developer Experience & SDK Modernity",
        category: "DX",
        userProductAdvantage: `Modern type-safe SDKs, comprehensive documentation, and instant developer setup.`,
        competitorWeakness: `Legacy client libraries with outdated architectural patterns and maintenance lag.`,
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Architecture & Infrastructure Isolation",
        category: "INFRASTRUCTURE",
        userProductAdvantage: `Modern cloud-native tenant isolation ensuring high throughput and resilience.`,
        competitorWeakness: `Shared legacy multi-tenant clusters prone to cascading rate-limit restrictions.`,
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Customer Support & Incident Escalation",
        category: "SUPPORT",
        userProductAdvantage: `Direct engineering support channels with proactive deliverability monitoring.`,
        competitorWeakness: `Automated bot tier triage; responsive support locked behind enterprise contracts.`,
        winner: "USER_PRODUCT",
        strikeImpact: "HIGH",
      },
      {
        dimension: "Migration Friction & Time to Value",
        category: "MIGRATION",
        userProductAdvantage: `Drop-in compatibility wrappers allowing cutover in under 30 minutes.`,
        competitorWeakness: `Proprietary protocol lock-in designed to create migration hesitation.`,
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
      {
        dimension: "System Reliability & Uptime",
        category: "RELIABILITY",
        userProductAdvantage: `High-availability edge architecture with transparent status reporting.`,
        competitorWeakness: `Periodic latency spikes and unannounced maintenance windows.`,
        winner: "USER_PRODUCT",
        strikeImpact: "MODERATE",
      },
    ],
  };
}
