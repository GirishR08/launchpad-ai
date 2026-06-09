"use client";
import { useState } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";
import type { PitchVariant } from "../lib/types";

interface Props {
  pitches: PitchVariant[];
}

export default function PitchPanel({ pitches }: Props) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = pitches[active];

  const copy = () => {
    if (!current) return;
    navigator.clipboard.writeText(current.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glow-card p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare size={18} style={{ color: "var(--accent2)" }} />
        <h3 className="font-semibold">Your Pitch</h3>
      </div>
      <div className="flex gap-2 flex-wrap">
        {pitches.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
            style={{
              background: active === i ? "rgba(79,142,247,0.2)" : "var(--surface2)",
              color: active === i ? "var(--accent)" : "var(--muted)",
              border: `1px solid ${active === i ? "rgba(79,142,247,0.4)" : "var(--border)"}`,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      {current && (
        <div className="relative">
          <div
            className="p-4 rounded-xl text-sm leading-relaxed"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
          >
            {current.text}
          </div>
          <button
            onClick={copy}
            className="absolute top-3 right-3 p-1.5 rounded-lg transition-all"
            style={{ background: copied ? "rgba(34,197,94,0.2)" : "rgba(79,142,247,0.15)", color: copied ? "var(--green)" : "var(--accent)" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
