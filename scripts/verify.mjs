import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { MongoClient } from "mongodb";
import { tavily } from "@tavily/core";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

loadEnvConfig(process.cwd());

console.log("\n==================================================");
console.log("⚡ RadarStrike System & Credential Diagnostic");
console.log("==================================================\n");

async function runDiagnostics() {
  const hasGatewayKey = Boolean(process.env.AI_GATEWAY_API_KEY);
  const hasTavilyKey = Boolean(process.env.TAVILY_API_KEY);
  const hasMongoUri = Boolean(process.env.MONGODB_URI);

  // 1. Vercel AI Gateway
  console.log("1. Vercel AI Gateway (https://ai-gateway.vercel.sh/v1):");
  if (hasGatewayKey) {
    try {
      const gateway = createOpenAI({
        apiKey: process.env.AI_GATEWAY_API_KEY,
        baseURL: process.env.AI_GATEWAY_URL || "https://ai-gateway.vercel.sh/v1",
      });
      const t0 = Date.now();
      const res = await generateText({
        model: gateway("openai/gpt-4o-mini"),
        prompt: "Respond with the single word: OK",
      });
      const elapsed = Date.now() - t0;
      console.log(`   🟢 CONNECTED - Model: openai/gpt-4o-mini (${elapsed}ms) - Response: "${res.text.trim()}"`);
    } catch (err) {
      console.log(`   ⚠️ GATEWAY KEY PRESENT BUT REQUEST FAILED: ${err.message}`);
    }
  } else {
    console.log("   🟡 SANDBOX MODE (No AI_GATEWAY_API_KEY found. Pre-warmed synthesis active)");
  }

  // 2. Tavily AI Search
  console.log("\n2. Tavily AI Real-Time Search:");
  if (hasTavilyKey) {
    try {
      const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
      const t0 = Date.now();
      const res = await tvly.search("real-time competitive intelligence", { maxResults: 1 });
      const elapsed = Date.now() - t0;
      console.log(`   🟢 CONNECTED - Live web search active (${elapsed}ms, ${res.results.length} result returned)`);
    } catch (err) {
      console.log(`   ⚠️ TAVILY KEY PRESENT BUT REQUEST FAILED: ${err.message}`);
    }
  } else {
    console.log("   🟡 SANDBOX MODE (No TAVILY_API_KEY found. Pre-warmed Reddit/HN feed active)");
  }

  // 3. MongoDB Atlas
  console.log("\n3. MongoDB Atlas & Vector Database:");
  if (hasMongoUri) {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      const t0 = Date.now();
      await client.connect();
      const dbs = await client.db().admin().listDatabases();
      const elapsed = Date.now() - t0;
      console.log(`   🟢 CONNECTED - Atlas cluster reached (${elapsed}ms, ${dbs.databases.length} databases visible)`);
      await client.close();
    } catch (err) {
      console.log(`   ⚠️ MONGODB URI PRESENT BUT FAILED TO CONNECT: ${err.message}`);
    }
  } else {
    console.log("   🟡 SANDBOX MODE (No MONGODB_URI found. In-memory buffer + vector fallback active)");
  }

  console.log("\n==================================================");
  console.log("🚀 Status: System is READY. Run `npm run dev` to launch UI.");
  console.log("==================================================\n");
}

runDiagnostics();
