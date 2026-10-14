"use client";

import React from "react";
import { MessageSquareWarning, Flame, AlertCircle, ExternalLink, Sparkles, Check, ArrowUpRight, Crosshair } from "lucide-react";
import { Grievance, ChurnIntent } from "@/lib/db/schema";

interface ChurnFeedColumnProps {
  grievances: Grievance[];
  onSelectGrievance: (grievance: Grievance) => void;
  selectedGrievanceId?: string;
  isGeneratingBattlecard?: boolean;
}

export const ChurnFeedColumn: React.FC<ChurnFeedColumnProps> = ({
  grievances,
  onSelectGrievance,
  selectedGrievanceId,
  isGeneratingBattlecard,
}) => {
  if (!grievances || grievances.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 flex items-center justify-center text-zinc-500 mb-3">
          <MessageSquareWarning className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-medium text-zinc-300">Live Churn Feed Waiting</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          When a scan runs, Tavily hunts Reddit, Hacker News, and dev forums for live buyers actively migrating or frustrated with your competitor.
        </p>
      </div>
    );
  }

  const getIntentBadge = (intent: ChurnIntent) => {
    switch (intent) {
      case "CRITICAL_CHURN":
        return {
          label: "🔥 Critical Churn (Actively Leaving)",
          style: "bg-rose-950/80 text-rose-300 border-rose-800",
        };
      case "HIGH_INTENT":
        return {
          label: "⚡ High Intent: Seeking Alternative",
          style: "bg-amber-950/80 text-amber-300 border-amber-800",
        };
      case "FRUSTRATED_PRICING":
        return {
          label: "💸 Pricing Shock Venting",
          style: "bg-red-950/80 text-red-300 border-red-800",
        };
      default:
        return {
          label: "⚠️ Discontent Signal",
          style: "bg-zinc-800 text-zinc-300 border-zinc-700",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Column Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-400">
            <Flame className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
            2. Live Churn & Grievance Stream
          </h2>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          {grievances.length} Live Signals
        </span>
      </div>

      {/* Feed Cards */}
      <div className="space-y-3">
        {grievances.map((grievance: Grievance) => {
          const isSelected = selectedGrievanceId === grievance.id;
          const badge = getIntentBadge(grievance.churnIntent);

          return (
            <div
              key={grievance.id}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50"
                  : "bg-zinc-900/80 hover:bg-zinc-900/95 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              {/* Header: Platform & Intent */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase">
                    {grievance.sourcePlatform}
                  </span>
                  <span className="text-xs text-zinc-400">by {grievance.author}</span>
                </div>

                <span
                  className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded border ${badge.style}`}
                >
                  {badge.label}
                </span>
              </div>

              {/* Title & Quote */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-zinc-200 leading-snug">
                  "{grievance.title}"
                </h3>
                <blockquote className="text-xs text-zinc-400 italic bg-zinc-950/60 p-2.5 rounded-lg border-l-2 border-amber-500/70">
                  {grievance.quote}
                </blockquote>
              </div>

              {/* MongoDB Atlas Semantic Vector Match Pill */}
              {grievance.matchedSolution && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-zinc-500 font-mono">Atlas Vector Match:</span>
                    <span className="text-emerald-400 font-medium truncate max-w-[260px]">
                      {grievance.matchedSolution.title}
                    </span>
                    <span className="text-[10px] font-mono px-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                      {Math.round((grievance.matchSimilarity || 0.88) * 100)}%
                    </span>
                  </div>

                  {grievance.sourceUrl && (
                    <a
                      href={grievance.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-zinc-400 hover:text-cyan-400 inline-flex items-center gap-0.5"
                    >
                      <span>Thread</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Action Button: Trigger Battlecard Synthesis */}
              <div className="mt-3">
                <button
                  onClick={() => onSelectGrievance(grievance)}
                  disabled={isGeneratingBattlecard && isSelected}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-zinc-950 font-semibold shadow-md"
                      : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                  }`}
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>
                    {isSelected
                      ? "Active Strike Target"
                      : "Synthesize Battlecard & Outreach"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
