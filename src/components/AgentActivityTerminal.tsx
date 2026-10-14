"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Terminal,
  Bot,
  Wrench,
  Eye,
  Crosshair,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Brain,
  Zap,
} from "lucide-react";
import { AgentEvent } from "@/lib/services/agent";

interface AgentActivityTerminalProps {
  events: AgentEvent[];
  isStreaming: boolean;
  activeAgent?: string;
}

export const AgentActivityTerminal: React.FC<AgentActivityTerminalProps> = ({
  events,
  isStreaming,
  activeAgent = "Recon Scout",
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll as new thoughts arrive
  useEffect(() => {
    if (scrollRef.current && isExpanded) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, isExpanded]);

  if (events.length === 0 && !isStreaming) return null;

  const getAgentColor = (name: AgentEvent["agentName"]) => {
    switch (name) {
      case "Recon Scout":
        return "text-purple-400 border-purple-800 bg-purple-950/60";
      case "Churn Hunter":
        return "text-amber-400 border-amber-800 bg-amber-950/60";
      case "Vector Matcher":
        return "text-emerald-400 border-emerald-800 bg-emerald-950/60";
      case "Strike Strategist":
        return "text-cyan-400 border-cyan-800 bg-cyan-950/60";
    }
  };

  const getEventIcon = (type: AgentEvent["type"]) => {
    switch (type) {
      case "thought":
        return <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case "tool_call":
        return <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "observation":
        return <Eye className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      case "decision":
        return <Crosshair className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case "complete":
      case "scan_complete":
      case "grievances_found":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      default:
        return <Bot className="w-3.5 h-3.5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 mb-6 transition-all">
      <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
              Autonomous Agent Execution Trace (ReAct Loop)
            </span>

            {isStreaming ? (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700 text-[10px] font-mono text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Reasoning: {activeAgent}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Pipeline Synced ({events.length} steps)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
              title={isExpanded ? "Collapse Activity Console" : "Expand Activity Console"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Streaming Logs Body */}
        {isExpanded && (
          <div
            ref={scrollRef}
            className="p-3.5 space-y-2 max-h-[220px] overflow-y-auto font-mono text-xs text-zinc-300"
          >
            {events.map((ev) => {
              const agentBadgeStyle = getAgentColor(ev.agentName);
              const icon = getEventIcon(ev.type);

              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-2.5 p-1.5 rounded hover:bg-zinc-900/50 transition-colors animate-in fade-in duration-150"
                >
                  <span className="text-zinc-600 text-[10px] pt-0.5 select-none shrink-0">
                    {new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>

                  <span
                    className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold shrink-0 ${agentBadgeStyle}`}
                  >
                    {ev.agentName}
                  </span>

                  <div className="flex items-center gap-1.5 pt-0.5">{icon}</div>

                  <p className="flex-1 text-[11px] leading-relaxed break-words">
                    {ev.type === "tool_call" ? (
                      <span className="text-amber-300">{ev.message}</span>
                    ) : ev.type === "observation" ? (
                      <span className="text-blue-300">{ev.message}</span>
                    ) : ev.type === "decision" ? (
                      <span className="text-cyan-300 font-semibold">{ev.message}</span>
                    ) : (
                      <span className="text-zinc-300">{ev.message}</span>
                    )}
                  </p>
                </div>
              );
            })}

            {isStreaming && (
              <div className="flex items-center gap-2 p-1.5 text-zinc-500 italic text-[11px]">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Agent contemplating next tool invocation...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
