import { CompanyProfile, SolutionItem } from "../db/schema";

export interface DemoPreset {
  id: string;
  label: string;
  userProduct: string;
  competitor: string;
  badge: string;
  description: string;
  companyProfile: CompanyProfile;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "mongodb-dynamodb",
    label: "MongoDB Atlas vs DynamoDB",
    userProduct: "MongoDB Atlas",
    competitor: "DynamoDB",
    badge: "Vector & Document DB",
    description: "Unified multi-model documents + native Atlas Vector Search vs rigid single-table DynamoDB and separate vector stores.",
    companyProfile: {
      id: "comp-mongodb",
      name: "MongoDB Atlas",
      website: "https://www.mongodb.com/atlas",
      tagline: "The multi-cloud developer data platform with built-in Atlas Vector Search, ACID transactions, and flexible JSON document models.",
      primarySolutions: [
        {
          id: "sol-mongo-1",
          title: "Unified Operational Data & Atlas Vector Search (Zero Dual-Write Drift)",
          category: "ARCHITECTURE",
          description: "Run generative AI and semantic vector search in the exact same database where your transactional data lives. No ETL sync pipelines or separate Pinecone cluster needed.",
          architecturalDifferentiator: "Single engine handles transactional ACID writes, full-text search, and HNSW vector indexing without distributed consistency lag.",
          migrationGuidance: "Export DynamoDB JSON items to MongoDB collection with standard mongoimport or Atlas Live Migration.",
          tags: ["vector", "pinecone", "sync", "etl", "rag", "drift", "ai"],
        },
        {
          id: "sol-mongo-2",
          title: "Flexible Native Document Model vs Rigid DynamoDB Single-Table Design",
          category: "DEVELOPER_EXPERIENCE",
          description: "Model your data naturally with JSON arrays, nested subdocuments, and dynamic schema validation without painful DynamoDB GSI / single-table design constraints.",
          architecturalDifferentiator: "Rich MQL query language, multi-document ACID transactions, and ad-hoc aggregations without provisioning secondary indexes for every new query.",
          migrationGuidance: "Simplify complex concatenated composite keys (PK/SK) into clean, human-readable MongoDB documents.",
          tags: ["schema", "singletable", "gsi", "query", "aggregations", "nosql"],
        },
        {
          id: "sol-mongo-3",
          title: "Transparent Multi-Cloud Deployment with True Cost Predictability",
          category: "PRICING",
          description: "Run seamlessly across AWS, Azure, and Google Cloud with no vendor lock-in. Eliminate unpredictable DynamoDB WCU/RCU throttle penalties and read amplification spikes.",
          architecturalDifferentiator: "Dedicated cluster auto-scaling and serverless options with automatic tiering, avoiding punitive on-demand throughput billing spikes.",
          migrationGuidance: "Zero lock-in: export standard BSON/JSON dumps anytime or migrate between cloud regions with zero downtime.",
          tags: ["pricing", "cost", "wcu", "rcu", "lockin", "multicloud", "throttling"],
        },
      ],
    },
  },
  {
    id: "vercel-aws-amplify",
    label: "Vercel vs AWS Amplify",
    userProduct: "Vercel",
    competitor: "AWS Amplify",
    badge: "Frontend Cloud & AI",
    description: "Next.js native edge compute, AI Gateway, and sub-minute deployments vs brittle Amplify Gen 2 CloudFormation stacks.",
    companyProfile: {
      id: "comp-vercel",
      name: "Vercel",
      website: "https://vercel.com",
      tagline: "The Frontend Cloud and AI platform for Next.js, React, and modern web applications.",
      primarySolutions: [
        {
          id: "sol-vercel-1",
          title: "Native Next.js 15 App Router & Server Actions Zero-Friction Hosting",
          category: "DEVELOPER_EXPERIENCE",
          description: "Built by the creators of Next.js. Instant build times, zero CloudFormation drift, seamless streaming SSR, and automatic edge middleware.",
          architecturalDifferentiator: "Purpose-built Edge Network and Fluid Compute engine engineered directly alongside the Next.js runtime.",
          migrationGuidance: "Import Git repository in 1 click; zero manual build spec yaml configuration required.",
          tags: ["nextjs", "builds", "amplify", "ssr", "cloudformation", "drift", "deploy"],
        },
        {
          id: "sol-vercel-2",
          title: "Built-In Vercel AI Gateway (Unified Routing, Multi-Model Failover & Observability)",
          category: "ARCHITECTURE",
          description: "One single API endpoint to access OpenAI, Anthropic, and open-source models with edge caching, automated circuit-breaking, and rate-limit mitigation.",
          architecturalDifferentiator: "Edge-routed AI Gateway with sub-millisecond connection reuse and Bring-Your-Own-Key security.",
          migrationGuidance: "Point LLM baseURL to `ai-gateway.vercel.sh` and retain existing OpenAI/Anthropic SDKs.",
          tags: ["ai", "gateway", "llm", "failover", "caching", "routing", "latency"],
        },
        {
          id: "sol-vercel-3",
          title: "Instant Global Previews & Automatic Production Rollbacks",
          category: "SUPPORT",
          description: "Every Git commit gets an isolated, shareable preview URL with comments, zero IAM role setup, and instant rollback capabilities.",
          architecturalDifferentiator: "Immutable deployment artifacts and atomic cutover prevent partial deploy failures or broken staging environments.",
          migrationGuidance: "Connect GitHub/GitLab org to Vercel for immediate automated PR preview environments.",
          tags: ["preview", "rollback", "iam", "ci/cd", "git", "speed"],
        },
      ],
    },
  },
  {
    id: "tavily-perplexity",
    label: "Tavily vs Perplexity API",
    userProduct: "Tavily",
    competitor: "Perplexity API",
    badge: "Search Intelligence",
    description: "Engineered specifically for autonomous LLM agents & factual RAG vs consumer-oriented search wrappers.",
    companyProfile: {
      id: "comp-tavily",
      name: "Tavily",
      website: "https://tavily.com",
      tagline: "The search engine built for AI agents and LLMs — delivering clean, verified, citation-backed web intelligence.",
      primarySolutions: [
        {
          id: "sol-tavily-1",
          title: "AI-Agent-Optimized Token Output (Clean Context, Zero HTML Bloat)",
          category: "DEVELOPER_EXPERIENCE",
          description: "Returns pre-parsed, highly relevant markdown chunks and factual answers directly consumable by LLM context windows without wasting tokens on navigation menus and cookie banners.",
          architecturalDifferentiator: "Agentic extraction engine optimizes for semantic density and information entropy rather than human SEO ranking.",
          migrationGuidance: "Replace Perplexity or Serper endpoint with `@tavily/core` SDK call; instant 60% token reduction.",
          tags: ["tokens", "context", "bloat", "rag", "html", "parsing", "agents"],
        },
        {
          id: "sol-tavily-2",
          title: "Deep Domain Filtering, Real-Time News Hooks & Raw Content Scraping",
          category: "ARCHITECTURE",
          description: "Filter searches by specific domains, query live news endpoints, or retrieve full raw content and screenshot data for multi-step agent reasoning loops.",
          architecturalDifferentiator: "Configurable search depths (`basic` vs `advanced`) with domain whitelisting and real-time freshness guarantees.",
          migrationGuidance: "Pass `include_domains` and `topic: 'news'` directly in search payload.",
          tags: ["filtering", "news", "freshness", "scraping", "domains", "depth"],
        },
        {
          id: "sol-tavily-3",
          title: "High-Throughput Sub-Second Latency & Developer-Friendly Pricing",
          category: "PRICING",
          description: "Sub-second response times designed for parallel agent loops with generous free credits and predictable per-query billing without seat minimums.",
          architecturalDifferentiator: "Distributed low-latency search index caching fresh web crawls at global edge nodes.",
          migrationGuidance: "Drop in SDK with API key; immediate speedup for multi-hop agent workflows.",
          tags: ["latency", "speed", "pricing", "credits", "developer", "limits"],
        },
      ],
    },
  },
  {
    id: "resend-sendgrid",
    label: "Resend vs SendGrid",
    userProduct: "Resend",
    competitor: "SendGrid",
    badge: "Email Infra",
    description: "Modern developer-first email API vs legacy Twilio SendGrid account suspensions & pricing hikes.",
    companyProfile: {
      id: "comp-resend",
      name: "Resend",
      website: "https://resend.com",
      tagline: "Email for developers — built with React, instant DNS verification, and transparent delivery logs.",
      primarySolutions: [
        {
          id: "sol-resend-1",
          title: "Zero-Surprise Transparent Pricing & Free Dedicated IP Options",
          category: "PRICING",
          description: "Generous free tier with 3,000 emails/mo, predictable $20/mo growth tier with unlimited domains, and dedicated IP add-on at cost without forced enterprise commitments.",
          architecturalDifferentiator: "Isolated tenant infrastructure with predictable billing caps. No sudden overage surprise bills.",
          migrationGuidance: "Change API key and SMTP host; our drop-in SDK matches SendGrid payload structures.",
          tags: ["pricing", "cost", "billing", "tier", "quota"],
        },
        {
          id: "sol-resend-2",
          title: "Instant Human Onboarding & Zero Automated Ban Suspensions",
          category: "SUPPORT",
          description: "No automated machine-learning account bans on day 1. Human review with dedicated engineer chat for any deliverability flags.",
          architecturalDifferentiator: "Real-time reputation warming with proactive bounce analysis rather than aggressive algorithmic account locks.",
          migrationGuidance: "Verify your domain via our 3-second DNS checker and immediately begin warmup sending.",
          tags: ["suspension", "banned", "account", "support", "blocked", "deliverability"],
        },
        {
          id: "sol-resend-3",
          title: "React Email Native SDK & Next.js App Router Integration",
          category: "DEVELOPER_EXPERIENCE",
          description: "Build emails using clean TypeScript and React components. Instant preview, type-safety, and seamless server action compatibility.",
          architecturalDifferentiator: "First-class SSR and React Email rendering engine eliminating legacy nested HTML table gymnastics.",
          migrationGuidance: "Import `resend` and `react-email`, replace string templates with TSX components.",
          tags: ["dx", "sdk", "react", "nextjs", "typescript", "templates", "complexity"],
        },
      ],
    },
  },
];
