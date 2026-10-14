"use client";

import React from "react";
import { Radar, Cpu, Database, Globe, Sliders, Zap, CheckCircle2 } from "lucide-react";
import { SupportedModel } from "@/lib/services/ai-gateway";
import { SystemStatus } from "@/lib/db/schema";

interface NavbarProps {
  status: SystemStatus | null;
  selectedModel: SupportedModel;
  onModelChange: (model: SupportedModel) => void;
  onOpenSettings: () => void;
  lastLatencyMs?: number;
  lastCacheHit?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  status,
  selectedModel,
  onModelChange,
  onOpenSettings,
  lastLatencyMs,
  lastCacheHit,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
            <div className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Radar<span className="text-cyan-400">Strike</span>
              </h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                v1.0 Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Autonomous Competitor Intelligence & Churn Capture Engine
            </p>
          </div>
        </div>

        {/* Platform Infrastructure Live Indicators */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs">
          {/* Vercel AI Gateway Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-zinc-400">Gateway:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Vercel AI
            </span>
          </div>

          {/* MongoDB Atlas Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">Memory:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Atlas
            </span>
          </div>

          {/* Tavily Search Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400">Radar:</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tavily Live
            </span>
          </div>
        </div>

        {/* Dynamic Model Selector & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Telemetry pill */}
          {lastLatencyMs !== undefined && (
            <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 text-zinc-400">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{lastLatencyMs}ms</span>
              {lastCacheHit && (
                <span className="text-emerald-400 bg-emerald-950/60 px-1 rounded text-[10px]">
                  Hit
                </span>
              )}
            </div>
          )}

          {/* Model Switcher Dropdown */}
          <div className="relative flex items-center">
            <label htmlFor="model-select" className="sr-only">Model Selection</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value as SupportedModel)}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors cursor-pointer"
            >
              <option value="hybrid">⚡ Hybrid Auto-Route (Vercel Gateway)</option>
              <option value="gpt-4o">OpenAI GPT-4o (Deep Strategy)</option>
              <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Ultra-Fast)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (If enabled on Gateway)</option>
            </select>
          </div>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            title="Configure System Keys & Settings"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
