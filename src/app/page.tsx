"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CommandBar } from "@/components/CommandBar";
import { ThreatRadarColumn } from "@/components/ThreatRadarColumn";
import { ChurnFeedColumn } from "@/components/ChurnFeedColumn";
import { BattlecardDrawer } from "@/components/BattlecardDrawer";
import { SettingsModal } from "@/components/SettingsModal";
import { DEMO_PRESETS, DemoPreset } from "@/lib/services/presets";
import { CompetitorScan, Grievance, Battlecard, SystemStatus } from "@/lib/db/schema";
import { SupportedModel } from "@/lib/services/ai-gateway";
import { ShieldCheck, Crosshair, Sparkles } from "lucide-react";

export default function Home() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [selectedModel, setSelectedModel] = useState<SupportedModel>("hybrid");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Command bar state
  const [userProduct, setUserProduct] = useState("Resend");
  const [competitor, setCompetitor] = useState("SendGrid");
  const [activePresetId, setActivePresetId] = useState<string>("resend-sendgrid");

  // Pipeline state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [scan, setScan] = useState<CompetitorScan | null>(null);
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  // Battlecard drawer state
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [battlecard, setBattlecard] = useState<Battlecard | null>(null);
  const [isGeneratingBattlecard, setIsGeneratingBattlecard] = useState(false);
  const [lastLatencyMs, setLastLatencyMs] = useState<number | undefined>(undefined);
  const [lastCacheHit, setLastCacheHit] = useState<boolean | undefined>(undefined);

  // Fetch status on mount
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.warn("Failed fetching system status:", err));

    // Initialize with first preset
    handleLaunchScan("Resend", "SendGrid", DEMO_PRESETS[0].companyProfile.primarySolutions);
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
    setLoadingStep("Deploying Tavily AI web crawlers to scan recent changelogs...");

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep("Hunting Reddit & dev forums for live churn & grievance discussions...");
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep("Matching complaints to solutions via MongoDB Atlas Vector Search...");
      }, 1400);

      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProduct: targetProduct,
          competitor: targetCompetitor,
          solutions: customSolutions,
          selectedModel,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();
      if (data.success) {
        setScan(data.scan);
        setGrievances(data.grievances);

        // Pre-select first grievance for immediate preview
        if (data.grievances.length > 0 && !selectedGrievance) {
          handleSelectGrievance(data.grievances[0], targetProduct, targetCompetitor);
        }
      }
    } catch (err) {
      console.error("Scan failed:", err);
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

      {/* Main Mission Control Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Column 1: Competitive Surface Radar (Defense) */}
          <div className="lg:col-span-5">
            <ThreatRadarColumn scan={scan} competitorName={competitor} />
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
