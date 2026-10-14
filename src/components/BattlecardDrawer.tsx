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
  Send,
  Download,
  Bell,
  Mail,
  SendHorizontal,
  Loader2,
  Share2,
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
  const [outreachFormat, setOutreachFormat] = useState<"forum" | "dm" | "email">("forum");
  const [copied, setCopied] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchAlert, setDispatchAlert] = useState<{ channel: string; score: number } | null>(null);

  if (!grievance) return null;

  // Generate multi-channel messages dynamically
  const getOutreachText = () => {
    if (!battlecard?.authenticMigrationOffer) return "";
    const baseMsg = battlecard.authenticMigrationOffer.readyToPostMessage;

    if (outreachFormat === "dm") {
      return `Hey ${grievance.author} — saw your post regarding ${grievance.competitor} issues. Completely understand the frustration with ${grievance.matchedSolution?.title || "their recent changes"}. We built ${grievance.userProduct} specifically to solve this with native architecture and zero surprise fees. Happy to share our migration guide or jump on a quick 10-min pair session if you're evaluating options: https://docs.${grievance.userProduct.toLowerCase()}.com/migrate`;
    }

    if (outreachFormat === "email") {
      return `Subject: Transitioning from ${grievance.competitor} to ${grievance.userProduct} — Technical Overview

Hi ${grievance.author},

Noticed your comments on ${grievance.sourcePlatform} regarding challenges with ${grievance.competitor}:
> "${grievance.quote.slice(0, 140)}..."

At ${grievance.userProduct}, we engineered our platform to address this exact architectural bottleneck:
• ${battlecard.internalStrategy.ourArchitecturalAdvantage}
• Zero vendor lock-in with predictable consumption pricing
• Rapid live cutover in under 15 minutes

Would you be open to reviewing our technical benchmarks or setting up a 15-minute architecture briefing this week?

Best regards,
Engineering & Growth Team
${grievance.userProduct}`;
    }

    return baseMsg;
  };

  const handleCopy = () => {
    const text = getOutreachText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchStrike = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grievance,
          battlecard,
          channel: "#churn-strikes",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchAlert({ channel: data.channel, score: data.leadScore });
        setTimeout(() => setDispatchAlert(null), 4000);
      }
    } catch (err) {
      console.error("Failed to dispatch strike:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleExportKillSheet = () => {
    if (!battlecard) return;
    const md = `# 🎯 EXECUTIVE KILL-SHEET: ${grievance.userProduct} vs ${grievance.competitor}
**Generated Date:** ${new Date().toLocaleDateString()}
**Prospect Signal:** ${grievance.author} (${grievance.sourcePlatform})
**Lead Urgency Score:** ${grievance.churnIntent === "CRITICAL_CHURN" ? "95/100 (Immediate Migration)" : "85/100 (Active Evaluation)"}

---

## 1. Grounded Competitor Vulnerability
${battlecard.internalStrategy.competitorVulnerability}

## 2. Our Architectural Superiority
${battlecard.internalStrategy.ourArchitecturalAdvantage}

## 3. Public Prospect Grievance (Verified Grounding)
> "${grievance.quote}"
*Source Link:* ${grievance.sourceUrl}

## 4. Key Engineering & Sales Talking Points
${battlecard.internalStrategy.keyTalkingPoints.map((p) => `• ${p}`).join("\n")}

## 5. Objection Handling Playbook
${battlecard.internalStrategy.objectionHandling
  .map((o) => `### Objection: "${o.objection}"\n**Counter-Response:** ${o.counterResponse}\n`)
  .join("\n")}

## 6. Recommended Outreach Template
\`\`\`
${getOutreachText()}
\`\`\`
`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `KillSheet-${grievance.userProduct}-vs-${grievance.competitor}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[640px] bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl flex flex-col transition-all">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Strike Dispatch Station
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Target: {grievance.competitor}
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">
            Conversion Battlecard & Outreach Engine
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
      <div className="p-4 bg-zinc-900/60 border-b border-zinc-800/80 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="font-mono text-zinc-300">Prospect: <strong className="text-cyan-400">{grievance.author}</strong> ({grievance.sourcePlatform})</span>
          {grievance.sourceUrl && (
            <a
              href={grievance.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              Public Thread <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
        <p className="text-zinc-300 italic line-clamp-2 bg-zinc-950/60 p-2 rounded border border-zinc-800/60">
          "{grievance.quote}"
        </p>
      </div>

      {/* Vercel AI Gateway Telemetry Bar */}
      {battlecard?.telemetry && (
        <div className="px-5 py-2 bg-gradient-to-r from-purple-950/30 via-zinc-900/40 to-cyan-950/30 border-b border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Gateway: <strong className="text-zinc-200">{battlecard.telemetry.modelUsed}</strong></span>
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

      {/* Dispatch Success Alert Toast */}
      {dispatchAlert && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>
              Dispatched to <strong>{dispatchAlert.channel}</strong>! Lead Urgency Score: <strong>{dispatchAlert.score}/100</strong>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 uppercase font-bold">LIVE STRIKE</span>
        </div>
      )}

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
                      Objection: "{item.objection}"
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

              {/* Multi-Format Channel Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Select Outreach Channel Format:
                  </span>
                  <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                    <button
                      onClick={() => setOutreachFormat("forum")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        outreachFormat === "forum"
                          ? "bg-zinc-800 text-white font-bold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Reddit / HN Reply
                    </button>
                    <button
                      onClick={() => setOutreachFormat("dm")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        outreachFormat === "dm"
                          ? "bg-zinc-800 text-white font-bold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      LinkedIn / X DM
                    </button>
                    <button
                      onClick={() => setOutreachFormat("email")}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        outreachFormat === "email"
                          ? "bg-zinc-800 text-white font-bold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Cold Email
                    </button>
                  </div>
                </div>

                {/* Ready-to-post message box */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all shadow-inner">
                  {getOutreachText()}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs flex items-center justify-between">
                <span className="text-zinc-400">Direct Migration Link:</span>
                <span className="font-mono text-cyan-400">
                  https://docs.{grievance.userProduct.toLowerCase().replace(/\s+/g, "")}.com/migrate
                </span>
              </div>
            </div>
          )
        ) : null}
      </div>

      {/* Bottom Dispatch & Export Station */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Outreach"}</span>
          </button>
          <button
            onClick={handleExportKillSheet}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 flex items-center justify-center gap-1.5 transition-colors border border-zinc-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Kill-Sheet</span>
          </button>
        </div>

        <button
          onClick={handleDispatchStrike}
          disabled={isDispatching}
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isDispatching ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Dispatching Alert...</span>
            </>
          ) : (
            <>
              <SendHorizontal className="w-3.5 h-3.5" />
              <span>Dispatch to #churn-strikes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
