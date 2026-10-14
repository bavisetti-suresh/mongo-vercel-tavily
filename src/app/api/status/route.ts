import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";
import { SystemStatus } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const { isConnected } = await getDatabase();
  const hasGatewayKey = Boolean(process.env.AI_GATEWAY_API_KEY);
  const hasTavilyKey = Boolean(process.env.TAVILY_API_KEY);

  const status: SystemStatus = {
    vercelAiGateway: {
      status: hasGatewayKey ? "CONNECTED" : "MOCK_READY",
      activeModel: hasGatewayKey
        ? "Active (Routing via Vercel AI Gateway)"
        : "Sandbox (Zero-Config Mode)",
      gatewayEndpoint: process.env.AI_GATEWAY_URL || "https://ai-gateway.vercel.sh/v1",
    },
    mongodbAtlas: {
      status: isConnected ? "CONNECTED" : "IN_MEMORY_FALLBACK",
      clusterName: isConnected ? "Atlas Production Cluster" : "Resilient In-Memory Buffer",
      dbName: process.env.MONGODB_DB || "radarstrike",
    },
    tavilySearch: {
      status: hasTavilyKey ? "CONNECTED" : "MOCK_READY",
      apiTier: hasTavilyKey ? "Live Web Search API" : "Pre-warmed Live Sandbox",
    },
  };

  return NextResponse.json(status);
}
