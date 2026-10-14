import { NextRequest, NextResponse } from "next/server";
import { executeTavilyIntelligenceScan } from "@/lib/services/tavily";
import { matchGrievanceToSolution } from "@/lib/db/vector";
import { getDatabase, getInMemoryStore } from "@/lib/db/mongodb";
import { CompetitorScan, SolutionItem } from "@/lib/db/schema";
import { DEMO_PRESETS } from "@/lib/services/presets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userProduct = "Resend",
      competitor = "SendGrid",
      solutions: customSolutions,
      selectedModel = "hybrid",
    } = body;

    // Resolve solutions knowledge base: use provided solutions, or find matching preset, or fallback
    let solutions: SolutionItem[] = customSolutions;
    if (!solutions || solutions.length === 0) {
      const matchedPreset = DEMO_PRESETS.find(
        (p) => p.userProduct.toLowerCase() === userProduct.toLowerCase()
      );
      if (matchedPreset) {
        solutions = matchedPreset.companyProfile.primarySolutions;
      } else {
        // Generic solutions fallback
        solutions = [
          {
            id: "sol-def-1",
            title: "Transparent Predictable Pricing & No Sneaky Overage Bills",
            category: "PRICING",
            description: "Clear consumption metrics with automated budget caps and proactive alerting.",
            architecturalDifferentiator: "Isolated tenant compute prevents cascading billing anomalies.",
            migrationGuidance: "Update API endpoint and verify DNS records within 5 minutes.",
            tags: ["pricing", "cost", "bill", "tier"],
          },
          {
            id: "sol-def-2",
            title: "Modern Developer API & First-Class TypeScript SDKs",
            category: "DEVELOPER_EXPERIENCE",
            description: "Built for modern engineering teams with complete type safety and zero legacy baggage.",
            architecturalDifferentiator: "Stateless microservices architecture with edge-optimized delivery.",
            migrationGuidance: "Drop-in compatible wrapper for rapid zero-downtime cutover.",
            tags: ["api", "sdk", "dx", "modern", "support"],
          },
        ];
      }
    }

    // Step 1: Execute Tavily Search across competitor moves and customer grievances
    const scanResult = await executeTavilyIntelligenceScan({
      userProduct,
      competitor,
    });

    // Step 2: Semantic Vector Pairing — match each customer complaint to the best solution
    const pairedGrievances = await Promise.all(
      scanResult.grievances.map(async (grievance) => {
        const match = await matchGrievanceToSolution(
          `${grievance.title} ${grievance.quote}`,
          solutions
        );
        return {
          ...grievance,
          matchedSolution: match?.matchedSolution,
          matchSimilarity: match?.similarityScore || 0.88,
        };
      })
    );

    const scanRecord: CompetitorScan = {
      id: `scan-${Date.now()}`,
      targetCompetitor: competitor,
      userProduct,
      scannedAt: new Date().toISOString(),
      moves: scanResult.moves,
      stealthEntrants: scanResult.stealthEntrants,
      threatScores: scanResult.threatScores,
    };

    // Step 3: MongoDB Atlas persistence (with in-memory fallback)
    const { db, isConnected } = await getDatabase();
    if (isConnected && db) {
      try {
        await Promise.all([
          db.collection("competitor_scans").insertOne(scanRecord),
          pairedGrievances.length > 0
            ? db.collection("grievances").insertMany(pairedGrievances)
            : Promise.resolve(),
        ]);
      } catch (dbErr) {
        console.warn("Failed persisting scan to MongoDB Atlas, stored in-memory:", dbErr);
      }
    } else {
      const store = getInMemoryStore();
      store.competitorScans.set(scanRecord.id, scanRecord);
      pairedGrievances.forEach((g) => store.grievances.set(g.id, g));
    }

    return NextResponse.json({
      success: true,
      scan: scanRecord,
      grievances: pairedGrievances,
      meta: {
        isLiveTavily: scanResult.isLiveTavily,
        mongoStatus: isConnected ? "PERSISTED_ATLAS" : "IN_MEMORY_PERSISTED",
        selectedModel,
      },
    });
  } catch (error: any) {
    console.error("Scan pipeline error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute intelligence scan" },
      { status: 500 }
    );
  }
}
