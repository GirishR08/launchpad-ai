"use client";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import type { ViabilityScore } from "../lib/types";

interface Props {
  score: ViabilityScore;
}

export default function ViabilityRadar({ score }: Props) {
  const data = [
    { subject: "Market", score: score.market },
    { subject: "Timing", score: score.timing },
    { subject: "Uniqueness", score: score.uniqueness },
    { subject: "Monetization", score: score.monetization },
    { subject: "Technical", score: score.technical },
    { subject: "Competition", score: score.competition },
  ];

  return (
    <div className="glow-card p-6 flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="text-5xl font-bold gradient-text">{score.overall}</div>
        <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>Viability Score / 100</div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="#1e2a42" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#5a6a8a", fontSize: 12 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#4f8ef7"
            fill="#4f8ef7"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{ background: "#0e1420", border: "1px solid #1e2a42", borderRadius: 8, color: "#e2e8f8" }}
            formatter={(val) => [`${Number(val)}/100`, "Score"]}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 w-full text-xs">
        {data.map((d) => (
          <div key={d.subject} className="text-center p-2 rounded-lg" style={{ background: "var(--surface2)" }}>
            <div className="font-semibold" style={{ color: "var(--text)" }}>{d.score}</div>
            <div style={{ color: "var(--muted)" }}>{d.subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
