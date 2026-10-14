"use client";

import React from "react";
import { Search, Sparkles, Crosshair, ArrowRight, Loader2 } from "lucide-react";
import { DEMO_PRESETS, DemoPreset } from "@/lib/services/presets";

interface CommandBarProps {
  userProduct: string;
  setUserProduct: (val: string) => void;
  competitor: string;
  setCompetitor: (val: string) => void;
  onLaunchScan: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: DemoPreset) => void;
  activePresetId?: string;
  loadingStep?: string;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  userProduct,
  setUserProduct,
  competitor,
  setCompetitor,
  onLaunchScan,
  isLoading,
  onSelectPreset,
  activePresetId,
  loadingStep,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-4">
      {/* 1-Click Demo Presets Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          1-Click Demos:
        </span>
        {DEMO_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              disabled={isLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                isActive
                  ? "bg-cyan-950/60 border-cyan-500/80 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                  : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
              } disabled:opacity-50`}
            >
              <span>{preset.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                {preset.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Mission Control Input Form */}
      <div className="p-3 lg:p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) onLaunchScan();
          }}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          {/* Your Product Input */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute -top-2.5 left-3 px-1.5 bg-zinc-900 text-[10px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">
              Your Product / Startup
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={userProduct}
                onChange={(e) => setUserProduct(e.target.value)}
                placeholder="e.g. Resend, Supabase, PostHog..."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center text-zinc-600">
            <Crosshair className="w-5 h-5 text-rose-500/80 animate-pulse" />
          </div>

          {/* Target Competitor Input */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute -top-2.5 left-3 px-1.5 bg-zinc-900 text-[10px] font-mono uppercase text-rose-400 font-semibold tracking-wider">
              Target Competitor to Snatch From
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={competitor}
                onChange={(e) => setCompetitor(e.target.value)}
                placeholder="e.g. SendGrid, Firebase, Mixpanel..."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || !userProduct.trim() || !competitor.trim()}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Scanning Radar...</span>
              </>
            ) : (
              <>
                <span>Launch Strike</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Live Loading Step Progress */}
        {isLoading && loadingStep && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs font-mono text-cyan-400 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{loadingStep}</span>
          </div>
        )}
      </div>
    </div>
  );
};
