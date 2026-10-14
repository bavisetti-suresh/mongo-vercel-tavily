export type ChurnIntent = "CRITICAL_CHURN" | "HIGH_INTENT" | "FRUSTRATED_PRICING" | "SEEKING_ALTERNATIVE" | "MILD_DISCONTENT";

export type ThreatSeverity = "CRITICAL" | "HIGH" | "MODERATE" | "LOW";

export interface SolutionItem {
  id: string;
  title: string;
  category: "PRICING" | "DELIVERABILITY" | "ARCHITECTURE" | "DEVELOPER_EXPERIENCE" | "SUPPORT" | "DATA_OWNERSHIP";
  description: string;
  architecturalDifferentiator: string;
  migrationGuidance: string;
  tags: string[];
  embedding?: number[];
}

export interface CompanyProfile {
  id: string;
  name: string;
  website: string;
  tagline: string;
  primarySolutions: SolutionItem[];
}

export interface CompetitorMove {
  id: string;
  competitor: string;
  title: string;
  summary: string;
  sourceUrl: string;
  category: "PRICING_HIKE" | "FEATURE_DEPRECATION" | "POLICY_CHANGE" | "OUTAGE" | "NEW_FEATURE";
  severity: ThreatSeverity;
  detectedAt: string;
}

export interface StealthCompetitor {
  name: string;
  url: string;
  oneLiner: string;
  threatAssessment: string;
}

export interface CompetitorScan {
  id: string;
  targetCompetitor: string;
  userProduct: string;
  scannedAt: string;
  moves: CompetitorMove[];
  stealthEntrants: StealthCompetitor[];
  threatScores: {
    overall: number; // 0-100
    pricingVulnerability: number; // 0-100 (how vulnerable competitor is to pricing attacks)
    reliabilityRisk: number; // 0-100
    developerSatisfaction: number; // 0-100
  };
}

export interface Grievance {
  id: string;
  competitor: string;
  userProduct: string;
  sourceUrl: string;
  sourcePlatform: "reddit" | "hackernews" | "x" | "forum" | "g2";
  author: string;
  title: string;
  quote: string;
  painPointCategory: "PRICING" | "ACCOUNT_SUSPENSION" | "COMPLEXITY" | "SUPPORT_FAILURE" | "API_BREAKAGE" | "VENDOR_LOCKIN" | "DEVELOPER_EXPERIENCE" | "RELIABILITY" | "ARCHITECTURE";
  churnIntent: ChurnIntent;
  sentimentScore: number; // -1.0 to 0.0
  publishedDate: string;
  matchedSolution?: SolutionItem;
  matchSimilarity?: number; // 0.0 to 1.0
  embedding?: number[];
}

export interface Battlecard {
  id: string;
  grievanceId: string;
  competitor: string;
  userProduct: string;
  createdAt: string;
  telemetry: {
    modelUsed: string;
    gatewayLatencyMs: number;
    cacheHit?: boolean;
    fallbackTriggered?: boolean;
  };
  // 1. Internal Battlecard (for team strategy)
  internalStrategy: {
    competitorVulnerability: string;
    ourArchitecturalAdvantage: string;
    keyTalkingPoints: string[];
    objectionHandling: {
      objection: string;
      counterResponse: string;
    }[];
  };
  // 2. Authentic Migration Offer (for prospect outreach)
  authenticMigrationOffer: {
    headline: string;
    empathicContext: string;
    technicalFix: string;
    callToAction: string;
    readyToPostMessage: string;
  };
}

export interface SystemStatus {
  vercelAiGateway: {
    status: "CONNECTED" | "BYOK_DIRECT" | "MOCK_READY";
    activeModel: string;
    gatewayEndpoint: string;
  };
  mongodbAtlas: {
    status: "CONNECTED" | "IN_MEMORY_FALLBACK";
    clusterName?: string;
    dbName: string;
  };
  tavilySearch: {
    status: "CONNECTED" | "MOCK_READY";
    apiTier?: string;
  };
}

export interface MatrixRow {
  dimension: string;
  category: "PRICING" | "RELIABILITY" | "DX" | "SUPPORT" | "INFRASTRUCTURE" | "MIGRATION";
  userProductAdvantage: string;
  competitorWeakness: string;
  winner: "USER_PRODUCT" | "COMPETITOR" | "TIE";
  strikeImpact: "HIGH" | "CRITICAL" | "MODERATE";
}

export interface BattleMatrix {
  userProduct: string;
  competitor: string;
  overallWinRate: number;
  recommendedStrikeVector: string;
  rows: MatrixRow[];
}
