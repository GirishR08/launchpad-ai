"use client";
import { AlertTriangle, ExternalLink } from "lucide-react";
import type { Competitor } from "../lib/types";

interface Props {
  competitors: Competitor[];
}

export default function CompetitorGrid({ competitors }: Props) {
  return (
    <div className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle size={18} style={{ color: "var(--amber)" }} />
        <h3 className="font-semibold">Competitor Landscape</h3>
      </div>
      <div className="space-y-3">
        {competitors.map((c, i) => (
          <div
            key={i}
            className="p-4 rounded-xl"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(79,142,247,0.15)", color: "var(--accent)" }}
                >
                  {c.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  {c.url && (
                    <a
                      href={`https://${c.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1"
                      style={{ color: "var(--muted)" }}
                    >
                      {c.url} <ExternalLink size={9} />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{c.description}</p>
            <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <span className="text-xs font-semibold mt-0.5" style={{ color: "var(--green)" }}>YOUR EDGE:</span>
              <p className="text-xs" style={{ color: "#86efac" }}>{c.weakness}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
