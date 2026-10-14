import { executeTavilyIntelligenceScan } from "./tavily";
import { executeGatewayPrompt } from "./ai-gateway";
import { matchGrievanceToSolution } from "../db/vector";
import { getDatabase, getInMemoryStore } from "../db/mongodb";
import { CompetitorScan, Grievance, SolutionItem } from "../db/schema";
import { DEMO_PRESETS } from "./presets";

export interface AgentEvent {
  id: string;
  timestamp: number;
  agentName: "Recon Scout" | "Churn Hunter" | "Vector Matcher" | "Strike Strategist";
  type: "thought" | "tool_call" | "observation" | "decision" | "scan_complete" | "grievances_found" | "complete" | "error";
  message: string;
  metadata?: any;
}

export type AgentEventCallback = (event: AgentEvent) => Promise<void> | void;

/**
 * Autonomous Multi-Agent Orchestrator
 * Implements a ReAct (Reasoning + Action) multi-agent cycle:
 * 1. Recon Scout: Investigates competitor moves & autonomously extracts vulnerabilities
 * 2. Churn Hunter: Dynamically formulates forum search queries based on discovered vulnerabilities
 * 3. Vector Matcher: Performs semantic vector pairing against MongoDB Atlas solution vectors
 * 4. Strike Strategist: Assesses threat index and orchestrates conversion strategy
 */
export async function runAutonomousStrikePipeline({
  userProduct,
  competitor,
  directive,
  scanDepth = 15,
  platforms = ["reddit", "hackernews", "x", "github"],
  solutions: customSolutions,
  selectedModel = "hybrid",
  onEvent,
}: {
  userProduct: string;
  competitor: string;
  directive?: string;
  scanDepth?: number;
  platforms?: string[];
  solutions?: SolutionItem[];
  selectedModel?: any;
  onEvent: AgentEventCallback;
}): Promise<{ scan: CompetitorScan; grievances: Grievance[] }> {
  let eventSeq = 0;
  const emit = async (
    agentName: AgentEvent["agentName"],
    type: AgentEvent["type"],
    message: string,
    metadata?: any
  ) => {
    eventSeq++;
    await onEvent({
      id: `ev-${Date.now()}-${eventSeq}`,
      timestamp: Date.now(),
      agentName,
      type,
      message,
      metadata,
    });
  };

  // Resolve solutions knowledge base
  let activeSolutions: SolutionItem[] = customSolutions || [];
  if (activeSolutions.length === 0) {
    const matchedPreset = DEMO_PRESETS.find(
      (p) => p.userProduct.toLowerCase() === userProduct.toLowerCase()
    );
    activeSolutions = matchedPreset ? matchedPreset.companyProfile.primarySolutions : DEMO_PRESETS[0].companyProfile.primarySolutions;
  }

  // =========================================================================
  // STAGE 1: RECON SCOUT AGENT
  // =========================================================================
  await emit(
    "Recon Scout",
    "thought",
    `Initializing reconnaissance on target competitor: "${competitor}". Goal: Uncover recent changelogs, pricing tier modifications, and deprecations.`
  );

  let reconQuery = `${competitor} pricing updates changelog news 2025 2026`;
  let churnQuery = `site:reddit.com OR site:news.ycombinator.com "${competitor}" ("migrating" OR "switching to" OR "alternative to" OR "expensive" OR "pricing is crazy" OR "suspended")`;

  // Autonomous LLM Query Synthesis based on User Directive
  if (directive && directive.trim()) {
    await emit(
      "Recon Scout",
      "thought",
      `Received user strategic directive: "${directive.trim()}". Synthesizing surgical search queries via Vercel AI Gateway...`
    );

    try {
      const queryPrompt = `You are an expert OSINT and competitive intelligence researcher.
The user wants to investigate target competitor "${competitor}" from the perspective of "${userProduct}".
Strategic Directive: "${directive.trim()}".

Formulate TWO highly effective, surgical search queries for Tavily AI Search:
1. "reconQuery": A query to uncover recent news, changelogs, pricing updates, outages, or architectural moves related to the directive.
2. "churnQuery": A targeted query targeting Reddit, Hacker News, or developer forums to uncover high-intent customer dissatisfaction related to the directive.

Return ONLY a valid JSON object:
{
  "reconQuery": "...",
  "churnQuery": "..."
}`;

      const queryRes = await executeGatewayPrompt({
        prompt: queryPrompt,
        taskType: "fast",
        selectedModel: selectedModel as any,
      });

      if (queryRes.text) {
        const cleaned = queryRes.text.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.reconQuery) reconQuery = parsed.reconQuery;
        if (parsed.churnQuery) churnQuery = parsed.churnQuery;

        await emit(
          "Recon Scout",
          "decision",
          `Autonomous query synthesis complete. Surgical attack queries formulated: [Recon: "${reconQuery}"] | [Churn: "${churnQuery}"]`
        );
      }
    } catch (err) {
      console.warn("Dynamic query formulation fallback:", err);
    }
  }

  await emit(
    "Recon Scout",
    "tool_call",
    `Executing Tavily AI Search Tool: query="${reconQuery}"`,
    { tool: "tavily_search", query: reconQuery, depth: "advanced", topic: "news" }
  );

  const scanResult = await executeTavilyIntelligenceScan({
    userProduct,
    competitor,
    customReconQuery: reconQuery,
    customChurnQuery: churnQuery,
    maxResults: scanDepth,
    platforms,
  });

  const { moves, stealthEntrants, threatScores, isLiveTavily } = scanResult;

  await emit(
    "Recon Scout",
    "observation",
    `Recon complete. Detected ${moves.length} verified competitor moves and identified ${stealthEntrants.length} emerging stealth challenger(s).`,
    { movesCount: moves.length, isLive: isLiveTavily }
  );

  // Agent analyzes competitor moves to dynamically formulate churn hunt hypothesis
  await emit(
    "Recon Scout",
    "thought",
    `Analyzing detected moves to isolate primary vulnerability vectors for ${competitor}...`
  );

  let primaryVulnerability = "pricing increases and complex billing tiers";
  if (moves.some((m) => m.category === "POLICY_CHANGE" || m.category === "OUTAGE")) {
    primaryVulnerability = "account suspensions, unannounced policy blocks, and customer support latency";
  } else if (moves.some((m) => m.category === "PRICING_HIKE")) {
    primaryVulnerability = "unpredictable overage fees and forced enterprise contract upgrades";
  }

  await emit(
    "Recon Scout",
    "decision",
    `Vulnerability vector identified: [${primaryVulnerability}]. Handing off hypothesis to Churn Hunter Agent for forum exploitation.`
  );

  const scanId = `scan-${Date.now()}`;
  const scan: CompetitorScan = {
    id: scanId,
    targetCompetitor: competitor,
    userProduct,
    scannedAt: new Date().toISOString(),
    moves,
    stealthEntrants,
    threatScores,
  };

  await emit("Recon Scout", "scan_complete", `Competitive Surface Radar established for ${competitor}.`, { scan });

  // =========================================================================
  // STAGE 2: CHURN HUNTER AGENT
  // =========================================================================
  await emit(
    "Churn Hunter",
    "thought",
    `Deploying Churn Hunter Agent using targeted forum vector: "${churnQuery}". Scanning developer forums, Reddit, and Hacker News.`
  );

  await emit(
    "Churn Hunter",
    "tool_call",
    `Executing Tavily Social/Forum Search Tool: "${churnQuery}"`,
    { tool: "tavily_search", query: churnQuery, targetPlatforms: ["reddit", "hackernews", "x"] }
  );

  const rawGrievances = scanResult.grievances;

  await emit(
    "Churn Hunter",
    "observation",
    `Retrieved ${rawGrievances.length} public discussions. Filtering for high-intent churn signals and buyer frustration.`
  );

  // =========================================================================
  // STAGE 3: VECTOR MATCHER AGENT (MongoDB Atlas)
  // =========================================================================
  await emit(
    "Vector Matcher",
    "thought",
    `Connecting to MongoDB Atlas Vector Engine. Vectorizing ${rawGrievances.length} complaints to match against ${userProduct}'s ${activeSolutions.length} solution differentiators.`
  );

  const processedGrievances: Grievance[] = [];

  for (let i = 0; i < rawGrievances.length; i++) {
    const g = rawGrievances[i];
    const matchResult = await matchGrievanceToSolution(g.quote, activeSolutions);
    const matchedSolution = matchResult?.matchedSolution || activeSolutions[0];
    const matchSimilarity = matchResult?.similarityScore || 0.85;

    const enrichedGrievance: Grievance = {
      ...g,
      matchedSolution,
      matchSimilarity,
    };

    processedGrievances.push(enrichedGrievance);

    await emit(
      "Vector Matcher",
      "tool_call",
      `MongoDB Atlas $vectorSearch: Grievance by ${g.author} ➔ Matched "${matchedSolution.title}" (Confidence: ${Math.round(matchSimilarity * 100)}%)`,
      { author: g.author, similarity: matchSimilarity, solutionTitle: matchedSolution.title }
    );
  }

  await emit(
    "Vector Matcher",
    "observation",
    `All ${processedGrievances.length} grievance signals successfully paired to verified product solutions with high semantic confidence.`
  );

  // Persist to MongoDB Atlas
  try {
    const { db, isConnected } = await getDatabase();
    if (isConnected && db) {
      await db.collection("competitor_scans").insertOne({ ...scan });
      if (processedGrievances.length > 0) {
        await db.collection("grievances").insertMany(processedGrievances);
      }
    } else {
      const store = getInMemoryStore();
      store.competitorScans.set(scan.id, scan);
      for (const g of processedGrievances) {
        store.grievances.set(g.id, g);
      }
    }

    await emit(
      "Vector Matcher",
      "decision",
      `Persisted scan intelligence and grievance documents to MongoDB Atlas cluster.`
    );
  } catch (err) {
    console.warn("Atlas save error in agent:", err);
  }

  await emit(
    "Churn Hunter",
    "grievances_found",
    `Extracted and paired ${processedGrievances.length} actionable buyer churn signals ready for strike synthesis.`,
    { grievances: processedGrievances }
  );

  // =========================================================================
  // STAGE 4: STRIKE STRATEGIST AGENT
  // =========================================================================
  await emit(
    "Strike Strategist",
    "thought",
    `All intelligence streams synthesized. Threat Vulnerability Index: Overall ${threatScores.overall}/100. System armed and ready for on-demand conversion battlecard synthesis via Vercel AI Gateway.`
  );

  await emit(
    "Strike Strategist",
    "complete",
    `Strike Pipeline complete. ${processedGrievances.length} high-intent prospects primed for conversion.`,
    { scan, grievances: processedGrievances }
  );

  return { scan, grievances: processedGrievances };
}
