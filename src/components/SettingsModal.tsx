"use client";

import React, { useState } from "react";
import { X, Key, Database, Globe, Cpu, Check, ExternalLink } from "lucide-react";
import { SystemStatus } from "@/lib/db/schema";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SystemStatus | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">
              System Architecture & Configuration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh] text-xs">
          {/* Vercel AI Gateway Section */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-purple-400" />
                Vercel AI Gateway
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                {status?.vercelAiGateway.status || "ACTIVE"}
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Routes requests to OpenAI, Anthropic, or Meta models through Vercel's edge network with caching, failover circuit breaker, and unified observability.
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500">
              Endpoint: <span className="text-zinc-300">{status?.vercelAiGateway.gatewayEndpoint || "https://ai-gateway.vercel.sh/v1"}</span>
            </div>
          </div>

          {/* MongoDB Atlas Section */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                MongoDB Atlas & Vector Search
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                {status?.mongodbAtlas.status || "ACTIVE"}
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Stores competitor intelligence, scans, and grievances. Executes vector similarity matching between live customer complaints and product solutions.
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500">
              Database: <span className="text-zinc-300">{status?.mongodbAtlas.dbName || "radarstrike"}</span>
            </div>
          </div>

          {/* Tavily Search Section */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                Tavily AI Search
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                {status?.tavilySearch.status || "ACTIVE"}
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Real-time factual web agent executing parallel multi-query searches across changelogs, pricing documentation, Reddit, and Hacker News.
            </p>
            <div className="pt-2 font-mono text-[10px] text-zinc-500">
              Mode: <span className="text-zinc-300">{status?.tavilySearch.apiTier || "Live Web Search"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-900/30 text-zinc-300 text-[11px]">
            💡 <strong>System Resilience Note:</strong> RadarStrike features zero-downtime in-memory buffers and edge failover circuits, ensuring the platform remains fully responsive even during network latency spikes or provider rate limits.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
