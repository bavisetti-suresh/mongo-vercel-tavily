"use client";

import React, { useState } from "react";
import {
  X,
  Swords,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { BattleMatrix } from "@/lib/db/schema";

interface BattleMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  matrix: BattleMatrix | null;
  isLoading: boolean;
}

export const BattleMatrixModal: React.FC<BattleMatrixModalProps> = ({
  isOpen,
  onClose,
  matrix,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (!matrix) return;

    let md = `# ⚔️ Competitive Battle Matrix: ${matrix.userProduct} vs ${matrix.competitor}\n\n`;
    md += `**Overall Win Rate:** ${matrix.overallWinRate}%\n`;
    md += `**Strategic Strike Vector:** ${matrix.recommendedStrikeVector}\n\n`;
    md += `| Dimension | ${matrix.userProduct} (Our Advantage) | ${matrix.competitor} (Vulnerability) | Impact |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;

    matrix.rows.forEach((row) => {
      md += `| **${row.dimension}** | ${row.userProductAdvantage} | ${row.competitorWeakness} | ${row.strikeImpact} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "CRITICAL":
        return "bg-rose-950/80 text-rose-300 border-rose-800";
      case "HIGH":
        return "bg-amber-950/80 text-amber-300 border-amber-800";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{matrix?.userProduct || "Our Product"}</span>
                  <span className="text-zinc-500 font-mono text-sm">vs</span>
                  <span className="text-rose-400">{matrix?.competitor || "Competitor"}</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Architectural Battle Matrix
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Head-to-head evaluation across 6 commercial and engineering dimensions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              disabled={isLoading || !matrix}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Matrix</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
              <p className="text-xs font-mono text-zinc-400 animate-pulse">
                Synthesizing architectural comparison matrix via Vercel AI Gateway...
              </p>
            </div>
          ) : matrix ? (
            <>
              {/* Strategic Strike Vector Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-cyan-950/30 border border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4" />
                    <span>Recommended Strike Vector</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                    {matrix.recommendedStrikeVector}
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block uppercase font-mono">Win Rate</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {matrix.overallWinRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
                <div className="grid grid-cols-12 bg-zinc-900/90 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 font-semibold p-3">
                  <div className="col-span-3">DIMENSION</div>
                  <div className="col-span-4 text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{matrix.userProduct} (OUR ADVANTAGE)</span>
                  </div>
                  <div className="col-span-4 text-rose-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{matrix.competitor} (LIABILITY)</span>
                  </div>
                  <div className="col-span-1 text-right">IMPACT</div>
                </div>

                <div className="divide-y divide-zinc-800/80">
                  {matrix.rows.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 p-3 text-xs gap-3 hover:bg-zinc-900/60 transition-colors items-start"
                    >
                      {/* Dimension */}
                      <div className="col-span-3 space-y-1">
                        <span className="font-semibold text-zinc-200 block">{row.dimension}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 inline-block uppercase">
                          {row.category}
                        </span>
                      </div>

                      {/* Our Advantage */}
                      <div className="col-span-4 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-zinc-300 leading-relaxed text-[11px]">
                        {row.userProductAdvantage}
                      </div>

                      {/* Competitor Weakness */}
                      <div className="col-span-4 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-zinc-300 leading-relaxed text-[11px]">
                        {row.competitorWeakness}
                      </div>

                      {/* Strike Impact */}
                      <div className="col-span-1 text-right">
                        <span
                          className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border inline-block ${getImpactBadge(
                            row.strikeImpact
                          )}`}
                        >
                          {row.strikeImpact}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            Powered by Vercel AI Gateway & Tavily Intelligence
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              disabled={isLoading || !matrix}
              className="sm:hidden px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
            >
              {copied ? "Copied" : "Copy Markdown"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
