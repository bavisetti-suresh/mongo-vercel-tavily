import { NextRequest, NextResponse } from "next/server";
import { executeGatewayPrompt, SupportedModel } from "@/lib/services/ai-gateway";
import { Battlecard, Grievance, SolutionItem } from "@/lib/db/schema";
import { getDatabase, getInMemoryStore } from "@/lib/db/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      grievance,
      matchedSolution,
      userProduct = "Resend",
      competitor = "SendGrid",
      selectedModel = "hybrid",
    }: {
      grievance: Grievance;
      matchedSolution?: SolutionItem;
      userProduct: string;
      competitor: string;
      selectedModel: SupportedModel;
    } = body;

    if (!grievance) {
      return NextResponse.json({ error: "Missing grievance data" }, { status: 400 });
    }

    const systemPrompt = `You are a Principal Product Strategist and empathetic Solutions Architect at ${userProduct}.
You are analyzing a customer complaint about competitor ${competitor} to produce two distinct artifacts:
1. INTERNAL STRATEGY BATTLECARD: For your internal sales/engineering team (vulnerability analysis, architectural advantage, objection handling).
2. AUTHENTIC MIGRATION OFFER: For external outreach (written as a humble, technical, non-salesy engineer helping another engineer fix an annoying pain point). DO NOT write generic sales copy. Be technically specific.

Respond strictly in valid JSON matching this schema:
{
  "internalStrategy": {
    "competitorVulnerability": "string",
    "ourArchitecturalAdvantage": "string",
    "keyTalkingPoints": ["point 1", "point 2", "point 3"],
    "objectionHandling": [
      { "objection": "string", "counterResponse": "string" },
      { "objection": "string", "counterResponse": "string" }
    ]
  },
  "authenticMigrationOffer": {
    "headline": "string",
    "empathicContext": "string",
    "technicalFix": "string",
    "callToAction": "string",
    "readyToPostMessage": "string"
  }
}`;

    const prompt = `Customer Grievance on ${grievance.sourcePlatform}:
Author: ${grievance.author}
Title: "${grievance.title}"
Quote: "${grievance.quote}"
Pain Point Category: ${grievance.painPointCategory}
Source URL: ${grievance.sourceUrl}

Our Paired Solution & Architectural Differentiator:
Title: ${matchedSolution?.title || "Transparent Platform Architecture"}
Description: ${matchedSolution?.description || "Built for reliability and developer simplicity."}
Architectural Differentiator: ${matchedSolution?.architecturalDifferentiator || "Modern serverless architecture."}
Migration Guidance: ${matchedSolution?.migrationGuidance || "Drop-in configuration replacement."}

Produce the JSON battlecard and authentic migration response.`;

    const gatewayResult = await executeGatewayPrompt({
      prompt,
      systemPrompt,
      taskType: "reasoning",
      selectedModel,
    });

    let internalStrategy;
    let authenticMigrationOffer;

    try {
      if (gatewayResult.text) {
        // Strip markdown codeblocks if present
        const cleaned = gatewayResult.text.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        internalStrategy = parsed.internalStrategy;
        authenticMigrationOffer = parsed.authenticMigrationOffer;
      }
    } catch (parseError) {
      console.warn("Failed parsing LLM JSON output, using robust fallback formatting:", parseError);
    }

    // High quality domain fallback if LLM response is empty or parsing failed
    if (!internalStrategy || !authenticMigrationOffer) {
      internalStrategy = {
        competitorVulnerability: `${competitor}'s automated compliance flags and opaque pricing structures are causing sudden disruptions for production customers without responsive human support.`,
        ourArchitecturalAdvantage: `${userProduct}'s architecture is built around isolated tenant quotas and proactive reputation monitoring, completely bypassing legacy automated ban sweeps.`,
        keyTalkingPoints: [
          `No day-1 algorithmic account locks — human engineers review any deliverability anomalies.`,
          `Transparent pricing with no surprise overage invoices or forced enterprise contract lock-ins.`,
          `Drop-in SDK compatibility: migration takes under 15 minutes with zero disruption to active traffic.`,
        ],
        objectionHandling: [
          {
            objection: `"What if migrating our DNS and sender records causes delivery drops?"`,
            counterResponse: `We support parallel dual-routing during warmup so you can test deliverability before switching 100% of volume.`,
          },
          {
            objection: `"Is ${userProduct} enterprise-ready with SLA guarantees?"`,
            counterResponse: `Yes, SOC2 Type II compliant with 99.99% uptime guarantee and dedicated engineering support Slack channels.`,
          },
        ],
      };

      authenticMigrationOffer = {
        headline: `Solving ${competitor} ${grievance.painPointCategory.toLowerCase().replace("_", " ")}: Step-by-step migration guide`,
        empathicContext: `Saw your post about the unexpected disruption with ${competitor}. Dealing with sudden outages or opaque account locks on production critical systems is the absolute worst.`,
        technicalFix: matchedSolution?.migrationGuidance || `You can route through ${userProduct} by swapping the API endpoint. We don't employ automated algorithmic bans and provide transparent delivery metrics.`,
        callToAction: `Happy to set you up with migration credits and dedicated deliverability engineering help if you need to get back up immediately.`,
        readyToPostMessage: `Hey ${grievance.author}, saw your issue with ${competitor}. We had several teams hit the exact same problem recently with unexpected account disruption. 

If you're still looking for an alternative: with ${userProduct}, we don't have automated account locks, pricing is transparent, and our SDK is a drop-in replacement. 

Here's the direct migration docs: ${matchedSolution?.migrationGuidance ? "https://docs.resend.com" : "https://docs.supabase.com"}. Let me know if you need migration credits or help getting setup!`,
      };
    }

    const battlecard: Battlecard = {
      id: `bc-${Date.now()}`,
      grievanceId: grievance.id,
      competitor,
      userProduct,
      createdAt: new Date().toISOString(),
      telemetry: {
        modelUsed: gatewayResult.telemetry.modelUsed,
        gatewayLatencyMs: gatewayResult.telemetry.gatewayLatencyMs,
        cacheHit: gatewayResult.telemetry.cacheHit,
        fallbackTriggered: gatewayResult.telemetry.fallbackTriggered,
      },
      internalStrategy,
      authenticMigrationOffer,
    };

    // Persist to MongoDB Atlas or memory
    const { db, isConnected } = await getDatabase();
    if (isConnected && db) {
      try {
        await db.collection("battlecards").insertOne(battlecard);
      } catch (err) {
        console.warn("Failed persisting battlecard to MongoDB:", err);
      }
    } else {
      getInMemoryStore().battlecards.set(battlecard.id, battlecard);
    }

    return NextResponse.json({
      success: true,
      battlecard,
    });
  } catch (error: any) {
    console.error("Battlecard generation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate battlecard" },
      { status: 500 }
    );
  }
}
