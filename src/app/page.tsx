"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CommandBar } from "@/components/CommandBar";
import { ThreatRadarColumn } from "@/components/ThreatRadarColumn";
import { ChurnFeedColumn } from "@/components/ChurnFeedColumn";
import { BattlecardDrawer } from "@/components/BattlecardDrawer";
import { SettingsModal } from "@/components/SettingsModal";
import { AgentActivityTerminal } from "@/components/AgentActivityTerminal";
import { BattleMatrixModal } from "@/components/BattleMatrixModal";
import { DEMO_PRESETS, DemoPreset } from "@/lib/services/presets";
import { CompetitorScan, Grievance, Battlecard, SystemStatus, BattleMatrix } from "@/lib/db/schema";
import { SupportedModel } from "@/lib/services/ai-gateway";
import { AgentEvent } from "@/lib/services/agent";

export default function Home() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [selectedModel, setSelectedModel] = useState<SupportedModel>("hybrid");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Command bar state
  const [userProduct, setUserProduct] = useState("MongoDB Atlas");
  const [competitor, setCompetitor] = useState("DynamoDB");
  const [activePresetId, setActivePresetId] = useState<string>("mongodb-dynamodb");

  // Agent execution pipeline state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);
  const [activeAgent, setActiveAgent] = useState<string>("Recon Scout");

  const [scan, setScan] = useState<CompetitorScan | null>(null);
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  // Battlecard drawer state
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [battlecard, setBattlecard] = useState<Battlecard | null>(null);
  const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | undefined>(undefined);
  const [lastCacheHit, setLastCacheHit] = useState<boolean | undefined>(undefined);

  // Battle matrix modal state
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [battleMatrix, setBattleMatrix] = useState<BattleMatrix | null>(null);
  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false);

  const handleOpenMatrix = async () => {
    setIsMatrixOpen(true);
    setIsLoadingMatrix(true);
    try {
      const res = await fetch("/api/matrix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProduct,
          competitor,
          selectedModel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBattleMatrix(data.matrix);
      }
    } catch (err) {
      console.error("Failed loading battle matrix:", err);
    } finally {
      setIsLoadingMatrix(false);
    }
  };

  // Fetch status on mount
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.warn("Failed fetching system status:", err));

    // Initialize with first preset (MongoDB Atlas vs DynamoDB)
    handleLaunchScan(
      DEMO_PRESETS[0].userProduct,
      DEMO_PRESETS[0].competitor,
      DEMO_PRESETS[0].companyProfile.primarySolutions
    );
  }, []);

  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePresetId(preset.id);
    setUserProduct(preset.userProduct);
    setCompetitor(preset.competitor);
    handleLaunchScan(preset.userProduct, preset.competitor, preset.companyProfile.primarySolutions);
  };

  const handleLaunchScan = async (
    targetProduct = userProduct,
    targetCompetitor = competitor,
    customSolutions?: any[]
  ) => {
    setIsLoading(true);
    setLoadingStep("Deploying Autonomous Multi-Agent Loop...");
    setAgentEvents([]);

    try {
      // Stream agent thoughts and tool calls via Server-Sent Events (SSE)
      const res = await fetch("/api/agent/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProduct: targetProduct,
          competitor: targetCompetitor,
          solutions: customSolutions,
          selectedModel,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Streaming agent pipeline failed to start");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          const trimmed = block.trim();
          if (trimmed.startsWith("data: ")) {
            try {
              const event: AgentEvent = JSON.parse(trimmed.slice(6));
              setAgentEvents((prev) => [...prev, event]);
              setActiveAgent(event.agentName);
              setLoadingStep(`[${event.agentName}] ${event.message.slice(0, 70)}...`);

              if (event.type === "scan_complete" && event.metadata?.scan) {
                setScan(event.metadata.scan);
              }

              if (event.type === "grievances_found" && event.metadata?.grievances) {
                setGrievances(event.metadata.grievances);
                if (event.metadata.grievances.length > 0) {
                  handleSelectGrievance(event.metadata.grievances[0], targetProduct, targetCompetitor);
                }
              }
            } catch (parseErr) {
              console.warn("Error parsing stream chunk:", parseErr);
            }
          }
        }
      }
    } catch (err) {
      console.error("Agent stream failed, falling back to batch scan:", err);
      // Fallback to batch /api/scan if stream was interrupted
      const fallbackRes = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProduct: targetProduct,
          competitor: targetCompetitor,
          solutions: customSolutions,
          selectedModel,
        }),
      });
      const data = await fallbackRes.json();
      if (data.success) {
        setScan(data.scan);
        setGrievances(data.grievances);
      }
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleSelectGrievance = async (
    grievance: Grievance,
    prod = userProduct,
    comp = competitor
  ) => {
    setSelectedGrievance(grievance);
    setIsGeneratingBattlecard(true);

    try {
      const res = await fetch("/api/battlecard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grievance,
          matchedSolution: grievance.matchedSolution,
          userProduct: prod,
          competitor: comp,
          selectedModel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBattlecard(data.battlecard);
        if (data.battlecard?.telemetry) {
          setLastLatencyMs(data.battlecard.telemetry.gatewayLatencyMs);
          setLastCacheHit(data.battlecard.telemetry.cacheHit);
        }
      }
    } catch (err) {
      console.error("Battlecard synthesis failed:", err);
    } finally {
      setIsGeneratingBattlecard(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col radar-grid">
      {/* Top Navbar */}
      <Navbar
        status={status}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lastLatencyMs={lastLatencyMs}
        lastCacheHit={lastCacheHit}
      />

      {/* Command & Control Bar */}
      <CommandBar
        userProduct={userProduct}
        setUserProduct={(val) => {
          setUserProduct(val);
          setActivePresetId("");
        }}
        competitor={competitor}
        setCompetitor={(val) => {
          setCompetitor(val);
          setActivePresetId("");
        }}
        onLaunchScan={() => handleLaunchScan()}
        isLoading={isLoading}
        onSelectPreset={handleSelectPreset}
        activePresetId={activePresetId}
        loadingStep={loadingStep}
      />

      {/* Autonomous Agent Execution Trace Terminal */}
      <AgentActivityTerminal
        events={agentEvents}
        isStreaming={isLoading}
        activeAgent={activeAgent}
      />

      {/* Main Mission Control Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Competitive Surface Radar (Defense) */}
          <div className="lg:col-span-5">
            <ThreatRadarColumn
              scan={scan}
              competitorName={competitor}
              onOpenMatrix={handleOpenMatrix}
            />
          </div>

          {/* Column 2: Live Churn & Grievance Stream (Offense & Strike) */}
          <div className="lg:col-span-7">
            <ChurnFeedColumn
              grievances={grievances}
              onSelectGrievance={(g) => handleSelectGrievance(g)}
              selectedGrievanceId={selectedGrievance?.id}
              isGeneratingBattlecard={isGeneratingBattlecard}
            />
          </div>
        </div>
      </main>

      {/* Side-by-Side Competitive Battle Matrix Modal */}
      <BattleMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        matrix={battleMatrix}
        isLoading={isLoadingMatrix}
      />

      {/* Conversion Battlecard Drawer (Slide-Over) */}
      <BattlecardDrawer
        battlecard={battlecard}
        grievance={selectedGrievance}
        onClose={() => setSelectedGrievance(null)}
        isLoading={isGeneratingBattlecard}
      />

      {/* Settings & Architecture Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={status}
      />
    </div>
  );
}
