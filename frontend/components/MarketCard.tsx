"use client";
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Clock } from "lucide-react";
import type { MarketInsight } from "../lib/types";

interface Props {
  market: MarketInsight;
  summary: string;
}

export default function MarketCard({ market, summary }: Props) {
  const TrendIcon = market.trend === "growing" ? TrendingUp : market.trend === "declining" ? TrendingDown : Minus;
  const trendColor = market.trend === "growing" ? "var(--green)" : market.trend === "declining" ? "var(--red)" : "var(--amber)";
  const compColor = market.competition === "low" ? "var(--green)" : market.competition === "high" ? "var(--red)" : "var(--amber)";

  return (
    <div className="glow-card p-6 space-y-4">
      <h3 className="font-semibold">Market Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} style={{ color: "var(--accent)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Total Market</span>
          </div>
          <div className="font-bold text-lg">{market.tam}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendIcon size={14} style={{ color: trendColor }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Growth</span>
          </div>
          <div className="font-bold text-lg" style={{ color: trendColor }}>{market.trendLabel}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Users size={14} style={{ color: "var(--accent2)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Competition</span>
          </div>
          <div className="font-bold capitalize" style={{ color: compColor }}>{market.competition}</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} style={{ color: "var(--amber)" }} />
            <span className="text-xs" style={{ color: "var(--muted)" }}>Time to Market</span>
          </div>
          <div className="font-bold text-sm">{market.timeToMarket}</div>
        </div>
      </div>
      <div className="p-3 rounded-xl text-sm leading-relaxed" style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", color: "#a8c4f8" }}>
        {summary}
      </div>
    </div>
  );
}
