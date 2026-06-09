"use client";
import { Zap } from "lucide-react";
import type { ActionStep } from "../lib/types";

interface Props {
  actions: ActionStep[];
}

const stepColors = [
  { bg: "rgba(79,142,247,0.15)", color: "#4f8ef7" },
  { bg: "rgba(124,77,255,0.15)", color: "#7c4dff" },
  { bg: "rgba(236,72,153,0.15)", color: "#ec4899" },
  { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
  { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
];

export default function ActionPlan({ actions }: Props) {
  return (
    <div className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={18} style={{ color: "#f59e0b" }} />
        <h3 className="font-semibold">Action Plan</h3>
      </div>
      <div className="space-y-3">
        {actions.map((a, i) => {
          const color = stepColors[i % stepColors.length];
          return (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl"
              style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{ background: color.bg, color: color.color }}
              >
                {a.step}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="font-medium text-sm">{a.title}</div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: color.bg, color: color.color }}
                  >
                    {a.timeframe}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{a.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
