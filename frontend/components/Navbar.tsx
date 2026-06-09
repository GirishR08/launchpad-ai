"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket, History, Settings, Key } from "lucide-react";
import { useState } from "react";
import { getApiKey, saveApiKey } from "../lib/storage";

export default function Navbar() {
  const path = usePathname();
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState("");
  const hasKey = typeof window !== "undefined" && !!getApiKey();

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-4"
      style={{ background: "rgba(8,12,20,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}
    >
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Rocket size={20} style={{ color: "var(--accent)" }} />
        <span className="gradient-text">LaunchPad AI</span>
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/history"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: path === "/history" ? "var(--accent)" : "var(--muted)", background: path === "/history" ? "rgba(79,142,247,0.1)" : "transparent" }}
        >
          <History size={15} />
          <span className="hidden sm:inline">History</span>
        </Link>
        <button
          onClick={() => setShowKey(!showKey)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: "var(--muted)" }}
          title="Set API Key"
        >
          <Key size={15} style={{ color: hasKey ? "var(--green)" : "var(--muted)" }} />
        </button>
      </div>
      {showKey && (
        <div className="absolute top-full right-4 mt-2 w-72 glow-card p-4 space-y-3 z-50">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Settings size={14} style={{ color: "var(--accent)" }} />
            Gemini API Key
          </div>
          <input
            type="password"
            defaultValue={typeof window !== "undefined" ? getApiKey() : ""}
            onChange={(e) => setTempKey(e.target.value)}
            placeholder="AIza..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
          />
          <button
            onClick={() => { saveApiKey(tempKey); setShowKey(false); }}
            className="btn-primary w-full px-3 py-2 text-sm"
          >
            Save Key
          </button>
        </div>
      )}
    </nav>
  );
}
