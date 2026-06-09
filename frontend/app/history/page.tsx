"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2, ArrowRight, History, Rocket } from "lucide-react";
import Navbar from "../../components/Navbar";
import { getHistory, deleteAnalysis } from "../../lib/storage";
import type { AnalysisResult } from "../../lib/types";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const remove = (id: string) => {
    deleteAnalysis(id);
    setHistory(getHistory());
  };

  const scoreColor = (s: number) => s >= 70 ? "var(--green)" : s >= 50 ? "var(--amber)" : "var(--red)";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-4 transition-colors"
            style={{ color: "var(--muted)" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div className="flex items-center gap-2">
            <History size={20} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-bold">Analysis History</h1>
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            {history.length} saved {history.length === 1 ? "analysis" : "analyses"} · stored in your browser
          </p>
        </div>

        {history.length === 0 ? (
          <div className="glow-card p-12 text-center space-y-4">
            <Rocket size={40} style={{ color: "var(--muted)", margin: "0 auto" }} />
            <h2 className="font-semibold">No analyses yet</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Analyze your first startup idea to see it here.</p>
            <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((r) => (
              <div key={r.id} className="glow-card p-5 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{ background: `rgba(${r.viability.overall >= 70 ? "34,197,94" : r.viability.overall >= 50 ? "245,158,11" : "239,68,68"},0.15)`, color: scoreColor(r.viability.overall) }}
                >
                  {r.viability.overall}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">&ldquo;{r.idea}&rdquo;</div>
                  <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: "var(--muted)" }}>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span style={{ color: scoreColor(r.viability.overall) }}>
                      {r.viability.overall >= 70 ? "Strong" : r.viability.overall >= 50 ? "Moderate" : "Weak"} viability
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/analyze/${r.id}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(79,142,247,0.1)", color: "var(--accent)", border: "1px solid rgba(79,142,247,0.2)" }}
                  >
                    View <ArrowRight size={12} />
                  </Link>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: "var(--muted)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
