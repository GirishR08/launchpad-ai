"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share2, Check, Rocket } from "lucide-react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import ViabilityRadar from "../../../components/ViabilityRadar";
import DomainGrid from "../../../components/DomainGrid";
import CompetitorGrid from "../../../components/CompetitorGrid";
import PitchPanel from "../../../components/PitchPanel";
import ActionPlan from "../../../components/ActionPlan";
import MarketCard from "../../../components/MarketCard";
import { getAnalysis } from "../../../lib/storage";
import type { AnalysisResult } from "../../../lib/types";

export default function AnalyzePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const r = getAnalysis(id);
    if (!r) { router.push("/"); return; }
    setResult(r);
  }, [id, router]);

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm mb-3 transition-colors"
              style={{ color: "var(--muted)" }}>
              <ArrowLeft size={14} /> New analysis
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text)" }}>
              &ldquo;{result.idea}&rdquo;
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
              Analyzed {new Date(result.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={share}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)" }}>
              {copied ? <Check size={14} style={{ color: "var(--green)" }} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>

        {/* Top row: Radar + Market */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ViabilityRadar score={result.viability} />
          <MarketCard market={result.market} summary={result.summary} />
        </div>

        {/* Domains */}
        <DomainGrid names={result.names} />

        {/* Competitors + Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompetitorGrid competitors={result.competitors} />
          <PitchPanel pitches={result.pitches} />
        </div>

        {/* Action Plan */}
        <ActionPlan actions={result.actions} />

        {/* CTA */}
        <div className="glow-card p-6 text-center space-y-3">
          <Rocket size={28} style={{ color: "var(--accent)", margin: "0 auto" }} />
          <h3 className="font-semibold text-lg">Ready to build?</h3>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            You have the market data, the name, and the pitch. Now ship it.
          </p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
            Validate another idea
          </Link>
        </div>
      </main>
    </div>
  );
}
