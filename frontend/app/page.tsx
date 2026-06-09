"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, ArrowRight, Zap, Globe, BarChart3, Users, MessageSquare, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import { getDemoAnalysis, analyzeIdea } from "../lib/gemini";
import { saveAnalysis, getApiKey } from "../lib/storage";
import ApiKeyModal from "../components/ApiKeyModal";

const EXAMPLES = [
  "AI scheduling tool for freelancers",
  "App that turns meeting recordings into action items",
  "Subscription box for independent bookstores",
];

const FEATURES = [
  { icon: BarChart3, label: "Viability Score", desc: "6-dimension AI scoring with radar chart" },
  { icon: Globe, label: "Live Domain Check", desc: "20 names + real-time availability via RDAP" },
  { icon: Users, label: "Competitor Map", desc: "5 real competitors + your edge over each" },
  { icon: MessageSquare, label: "Pitch Generator", desc: "Twitter, elevator, and investor pitches" },
  { icon: Zap, label: "Action Plan", desc: "5 concrete next steps with timeframes" },
  { icon: Sparkles, label: "Market Analysis", desc: "TAM, growth trend, competition level" },
];

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [pendingAnalyze, setPendingAnalyze] = useState(false);

  const runAnalysis = async (apiKey?: string) => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    try {
      let result;
      const key = apiKey || getApiKey();
      if (key) {
        result = await analyzeIdea(idea.trim(), key, () => {});
      } else {
        await new Promise((r) => setTimeout(r, 1800));
        result = getDemoAnalysis(idea.trim());
      }
      saveAnalysis(result);
      router.push(`/analyze/${result.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Analysis failed. Try demo mode.");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!idea.trim() || loading) return;
    const key = getApiKey();
    if (!key) {
      setPendingAnalyze(true);
      setShowKeyModal(true);
    } else {
      runAnalysis();
    }
  };

  const handleKeyModalSave = (key: string) => {
    setShowKeyModal(false);
    if (pendingAnalyze) {
      setPendingAnalyze(false);
      runAnalysis(key);
    }
  };

  const handleKeyModalClose = () => {
    setShowKeyModal(false);
    if (pendingAnalyze) {
      setPendingAnalyze(false);
      runAnalysis();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {showKeyModal && <ApiKeyModal onClose={handleKeyModalClose} onSave={handleKeyModalSave} />}

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{ background: "rgba(79,142,247,0.1)", border: "1px solid rgba(79,142,247,0.2)", color: "var(--accent)" }}>
          <Sparkles size={14} />
          Powered by Gemini AI · Live domain data from RDAP
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-4 max-w-3xl">
          From startup idea to{" "}
          <span className="gradient-text">launch-ready</span>
          {" "}in 30 seconds
        </h1>

        <p className="text-lg mb-10 max-w-xl" style={{ color: "var(--muted)" }}>
          AI market analysis, 20 name ideas with live domain availability, competitor intel, and your investor pitch — instantly.
        </p>

        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <input
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Describe your startup idea..."
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none bg-transparent"
              style={{ color: "var(--text)" }}
              disabled={loading}
            />
            <button
              onClick={handleSubmit}
              disabled={!idea.trim() || loading}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm whitespace-nowrap disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          {error && <p className="text-sm mt-3" style={{ color: "var(--red)" }}>{error}</p>}

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-xs" style={{ color: "var(--muted)" }}>Try:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex} onClick={() => setIdea(ex)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:pb-24 max-w-4xl mx-auto w-full">
        <h2 className="text-center text-xl font-semibold mb-8" style={{ color: "var(--muted)" }}>
          Everything you need to validate and launch
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glow-card p-4 space-y-2">
              <Icon size={20} style={{ color: "var(--accent)" }} />
              <div className="font-semibold text-sm">{label}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center pb-8 text-xs" style={{ color: "var(--muted)" }}>
        <div className="flex items-center justify-center gap-1 mb-1">
          <Rocket size={12} style={{ color: "var(--accent)" }} />
          <span className="gradient-text font-semibold">LaunchPad AI</span>
        </div>
        Built for DeveloperWeek NY 2026 · Powered by Gemini · Domain data by RDAP
      </footer>
    </div>
  );
}
