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
  {
    id: "supabase-firebase",
    label: "Supabase vs Firebase",
    userProduct: "Supabase",
    competitor: "Firebase",
    badge: "Database / Auth",
    description: "Open-source PostgreSQL + Row Level Security vs proprietary NoSQL vendor lock-in.",
    companyProfile: {
      id: "comp-supabase",
      name: "Supabase",
      website: "https://supabase.com",
      tagline: "The open source Firebase alternative with enterprise Postgres, pgvector, and Auth.",
      primarySolutions: [
        {
          id: "sol-supa-1",
          title: "Relational Postgres with Zero Document Read Amplification Pricing",
          category: "PRICING",
          description: "Flat predictable instance pricing instead of charging for every single Firestore document read/write that spikes during DDOS or crawler visits.",
          architecturalDifferentiator: "Dedicated PostgreSQL database compute with index optimization rather than per-document billing meters.",
          migrationGuidance: "Export Firestore JSON to Postgres schema with our automated migration CLI.",
          tags: ["pricing", "firestore", "reads", "expensive", "cost", "bill"],
        },
        {
          id: "sol-supa-2",
          title: "Standard SQL, pgvector, and True Portability (No Lock-In)",
          category: "DATA_OWNERSHIP",
          description: "100% standard Postgres. Run locally via Docker, self-host on AWS/Fly, or use Supabase Cloud. Export anytime with pg_dump.",
          architecturalDifferentiator: "Pure open source stack with standard relational integrity and built-in vector similarity search.",
          migrationGuidance: "Run standard SQL migrations; no proprietary cloud SDK locks.",
          tags: ["lockin", "proprietary", "export", "postgres", "sql", "vector"],
        },
        {
          id: "sol-supa-3",
          title: "Postgres Row Level Security (RLS) vs Complex Firebase Security Rules",
          category: "ARCHITECTURE",
          description: "Secure data at the database level using standard SQL policies rather than learning a proprietary rules scripting language.",
          architecturalDifferentiator: "ACID transactions with database-enforced security policies audited by the global Postgres ecosystem.",
          migrationGuidance: "Define SQL `CREATE POLICY` statements directly in database migrations.",
          tags: ["security", "rls", "rules", "architecture", "complexity"],
        },
      ],
    },
  },
  {
    id: "posthog-mixpanel",
    label: "PostHog vs Mixpanel",
    userProduct: "PostHog",
    competitor: "Mixpanel",
    badge: "Product Analytics",
    description: "All-in-one product OS (session replay, feature flags, surveys) vs siloed event tracking.",
    companyProfile: {
      id: "comp-posthog",
      name: "PostHog",
      website: "https://posthog.com",
      tagline: "The single platform for product analytics, session replay, feature flags, and A/B testing.",
      primarySolutions: [
        {
          id: "sol-ph-1",
          title: "1M Free Events Every Month with Generous Volume Discounts",
          category: "PRICING",
          description: "1,000,000 events/month free forever, plus transparent pay-as-you-go tiers that drop significantly as volume scales.",
          architecturalDifferentiator: "ClickHouse-backed hyper-optimized columnar analytics engine cutting storage overhead by 70%.",
          migrationGuidance: "Drop in posthog-js; send events alongside existing analytics until ready to cut over.",
          tags: ["pricing", "free", "events", "expensive", "bill", "seats"],
        },
        {
          id: "sol-ph-2",
          title: "Unified Session Replay & Product Analytics (No Tool Sprawl)",
          category: "DEVELOPER_EXPERIENCE",
          description: "Watch the exact user session right next to the dropped conversion funnel without needing separate subscriptions for FullStory or Hotjar.",
          architecturalDifferentiator: "Unified event and session ingestion pipeline correlating DOM mutations with analytical events.",
          migrationGuidance: "Single line snippet enables session recordings and event capture simultaneously.",
          tags: ["replay", "funnels", "sprawl", "integration", "session"],
        },
        {
          id: "sol-ph-3",
          title: "Open Source & EU Data Residency / Self-Hosting Support",
          category: "DATA_OWNERSHIP",
          description: "Full GDPR compliance with EU cloud hosting or self-hosted deployment options with direct ClickHouse access.",
          architecturalDifferentiator: "Open-source codebase with permissive licensing and transparent roadmap on GitHub.",
          migrationGuidance: "Switch API host to EU endpoint or private deployment with zero code changes.",
          tags: ["gdpr", "privacy", "opensource", "selfhosted", "eu"],
        },
      ],
    },
  },
];
