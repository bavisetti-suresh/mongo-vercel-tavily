"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  MessageSquare,
  Cpu,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Battlecard, Grievance } from "@/lib/db/schema";

interface BattlecardDrawerProps {
  battlecard: Battlecard | null;
  grievance: Grievance | null;
  onClose: () => void;
  isLoading: boolean;
}

export const BattlecardDrawer: React.FC<BattlecardDrawerProps> = ({
  battlecard,
  grievance,
  onClose,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<"internal" | "external">("internal");
  const [copied, setCopied] = useState(false);

  if (!grievance) return null;

  const handleCopy = () => {
    if (!battlecard?.authenticMigrationOffer?.readyToPostMessage) return;
    navigator.clipboard.writeText(battlecard.authenticMigrationOffer.readyToPostMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[620px] bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Strike Engine
            </span>
            <span className="text-xs font-mono text-zinc-400">
              vs {grievance.competitor}
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Conversion Battlecard & Migration Outreach
          </h2>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Target Complaint Summary */}
      <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/80 text-xs space-y-1">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Target: {grievance.author} ({grievance.sourcePlatform})</span>
          {grievance.sourceUrl && (
            <a
              href={grievance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              Thread <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
        <p className="text-zinc-300 italic line-clamp-2">"{grievance.quote}"</p>
      </div>

      {/* Vercel AI Gateway Telemetry Bar */}
      {battlecard?.telemetry && (
        <div className="px-5 py-2.5 bg-gradient-to-r from-purple-950/30 via-zinc-900/40 to-cyan-950/30 border-b border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Routed: <strong className="text-zinc-200">{battlecard.telemetry.modelUsed}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3 h-3" />
              {battlecard.telemetry.gatewayLatencyMs}ms
            </span>
            {battlecard.telemetry.cacheHit && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px]">
                Cache Hit
              </span>
            )}
            {battlecard.telemetry.fallbackTriggered && (
              <span className="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-800 text-[10px]">
                Failover Used
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab("internal")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "internal"
              ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Internal Battlecard</span>
        </button>

        <button
          onClick={() => setActiveTab("external")}
          className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "external"
              ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
              : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Authentic Migration Offer</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-zinc-400 animate-pulse">
              Synthesizing counter-strategy via Vercel AI Gateway...
            </p>
          </div>
        ) : battlecard ? (
          activeTab === "internal" ? (
            /* TAB 1: Internal Battlecard */
            <div className="space-y-4">
              {/* Vulnerability Analysis */}
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                  Competitor Vulnerability Analysis
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {battlecard.internalStrategy.competitorVulnerability}
                </p>
              </div>

              {/* Architectural Advantage */}
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/30 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Our Architectural Advantage
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {battlecard.internalStrategy.ourArchitecturalAdvantage}
                </p>
              </div>

              {/* Key Talking Points */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Sales & Engineering Talking Points
                </span>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {battlecard.internalStrategy.keyTalkingPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objection Handling */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Objection Handling Matrix
                </span>
                {battlecard.internalStrategy.objectionHandling.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 text-xs"
                  >
                    <p className="font-semibold text-rose-300">
                      Objection: {item.objection}
                    </p>
                    <p className="text-zinc-300 border-t border-zinc-800/80 pt-1.5">
                      <strong className="text-emerald-400">Counter:</strong> {item.counterResponse}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* TAB 2: Authentic Migration Offer */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
                <h3 className="text-sm font-semibold text-emerald-300">
                  {battlecard.authenticMigrationOffer.headline}
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {battlecard.authenticMigrationOffer.empathicContext}
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-900/30 text-xs text-zinc-300">
                  <strong className="text-cyan-400">Technical Fix:</strong>{" "}
                  {battlecard.authenticMigrationOffer.technicalFix}
                </div>
              </div>

              {/* Ready-to-post message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    1-Click Personalized Outreach (Ready to Paste)
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
                  {battlecard.authenticMigrationOffer.readyToPostMessage}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center justify-between">
                <span className="text-zinc-400">Direct Migration Link:</span>
                <span className="font-mono text-cyan-400">
                  https://docs.{grievance.userProduct.toLowerCase()}.com/migrate
                </span>
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
