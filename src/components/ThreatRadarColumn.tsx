"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, ExternalLink, Zap, TrendingUp, Layers, Eye, Swords } from "lucide-react";
import { CompetitorScan, CompetitorMove, StealthCompetitor } from "@/lib/db/schema";

interface ThreatRadarColumnProps {
  scan: CompetitorScan | null;
  competitorName: string;
  onOpenMatrix?: () => void;
}

export const ThreatRadarColumn: React.FC<ThreatRadarColumnProps> = ({ scan, competitorName, onOpenMatrix }) => {
  if (!scan) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/60 flex items-center justify-center text-zinc-500 mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-medium text-zinc-300">Defense Radar Inactive</h3>
        <p className="text-xs text-zinc-500 max-w-xs mt-1">
          Select a 1-click preset or enter a competitor above to scan their pricing shifts, feature deprecations, and stealth threats.
        </p>
      </div>
    );
  }

  const scores = scan.threatScores;

  return (
    <div className="space-y-5">
      {/* Column Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase font-mono">
            1. Competitive Surface Radar
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onOpenMatrix && (
            <button
              onClick={onOpenMatrix}
              className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 transition-colors shadow-sm"
              title="Open Head-to-Head Battle Matrix"
            >
              <Swords className="w-3 h-3" />
              <span>Battle Matrix</span>
            </button>
          )}
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            Target: {scan.targetCompetitor}
          </span>
        </div>
      </div>

      {/* Dynamic Vulnerability Index Card */}
      <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400 font-medium">Vulnerability Index</span>
          <span className="text-lg font-bold font-mono text-rose-400">
            {scores.overall}/100
          </span>
        </div>

        {/* Progress Bar & Gauges */}
        <div className="space-y-3">
          {/* Pricing Vulnerability */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Pricing Vulnerability</span>
              <span className="text-amber-400 font-mono font-medium">{scores.pricingVulnerability}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores.pricingVulnerability}%` }}
              />
            </div>
          </div>

          {/* Reliability Risk */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Reliability & Outage Risk</span>
              <span className="text-rose-400 font-mono font-medium">{scores.reliabilityRisk}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores.reliabilityRisk}%` }}
              />
            </div>
          </div>

          {/* Developer Satisfaction */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-zinc-400">Developer Satisfaction</span>
              <span className="text-cyan-400 font-mono font-medium">{scores.developerSatisfaction}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores.developerSatisfaction}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Competitor Moves */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          Detected Moves & Changelogs
        </h3>

        <div className="space-y-2.5">
          {scan.moves.map((move: CompetitorMove) => (
            <div
              key={move.id}
              className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                    move.severity === "CRITICAL"
                      ? "bg-rose-950/80 text-rose-400 border border-rose-800"
                      : move.severity === "HIGH"
                      ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                      : "bg-blue-950/80 text-blue-400 border border-blue-800"
                  }`}
                >
                  {move.category.replace("_", " ")}
                </span>
                <span className="text-[11px] text-zinc-500">{move.detectedAt}</span>
              </div>

              <h4 className="text-xs font-semibold text-zinc-200 leading-snug">
                {move.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {move.summary}
              </p>

              {move.sourceUrl && (
                <a
                  href={move.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors pt-1"
                >
                  <span>Verified Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stealth Entrants Radar */}
      {scan.stealthEntrants && scan.stealthEntrants.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            Stealth & Emerging Challengers
          </h3>

          <div className="space-y-2.5">
            {scan.stealthEntrants.map((stealth: StealthCompetitor, idx: number) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-purple-300">{stealth.name}</span>
                  <a
                    href={stealth.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-purple-400 hover:underline flex items-center gap-0.5"
                  >
                    Link <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-zinc-300 text-[11px]">{stealth.oneLiner}</p>
                <p className="text-zinc-400 text-[10px] italic border-t border-purple-900/30 pt-1">
                  Threat: {stealth.threatAssessment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
