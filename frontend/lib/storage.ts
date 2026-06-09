import type { AnalysisResult } from "./types";

const KEY = "launchpad_history";

export function saveAnalysis(result: AnalysisResult): void {
  if (typeof window === "undefined") return;
  const history = getHistory();
  const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function getAnalysis(id: string): AnalysisResult | null {
  return getHistory().find((h) => h.id === id) ?? null;
}

export function deleteAnalysis(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((h) => h.id !== id);
  localStorage.setItem(KEY, JSON.stringify(history));
}

export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("launchpad_gemini_key") || "";
}

export function saveApiKey(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("launchpad_gemini_key", key);
}
