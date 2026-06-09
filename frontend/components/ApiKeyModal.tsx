"use client";
import { useState } from "react";
import { Key, X, ExternalLink } from "lucide-react";
import { saveApiKey, getApiKey } from "../lib/storage";

interface Props {
  onClose: () => void;
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ onClose, onSave }: Props) {
  const [key, setKey] = useState(getApiKey());

  const handleSave = () => {
    saveApiKey(key);
    onSave(key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md glow-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={18} style={{ color: "var(--accent)" }} />
            <h2 className="font-semibold">Gemini API Key</h2>
          </div>
          <button onClick={onClose} style={{ color: "var(--muted)" }}>
            <X size={18} />
          </button>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          LaunchPad AI uses Google Gemini for analysis. Get a free API key — no credit card required.
        </p>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
          style={{ background: "rgba(79,142,247,0.1)", color: "var(--accent)", border: "1px solid rgba(79,142,247,0.2)" }}
        >
          <ExternalLink size={14} />
          Get free key at aistudio.google.com
        </a>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="AIza..."
          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          Your key is stored only in your browser (localStorage). Never sent to our servers.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium" style={{ background: "var(--surface2)", color: "var(--muted)", border: "1px solid var(--border)" }}>
            Use Demo Mode
          </button>
          <button onClick={handleSave} disabled={!key} className="flex-1 btn-primary px-4 py-2.5 text-sm disabled:opacity-40">
            Save &amp; Analyze
          </button>
        </div>
      </div>
    </div>
  );
}
