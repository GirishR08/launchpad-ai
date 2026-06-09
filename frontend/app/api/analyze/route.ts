import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.AI_API_KEY ?? "";

const PROMPT = (idea: string) => `You are a startup analyst AI. Analyze this startup idea and return ONLY valid JSON (no markdown, no explanation):

Idea: "${idea}"

Return this exact JSON structure:
{
  "viability": {
    "market": <0-100>,
    "competition": <0-100>,
    "monetization": <0-100>,
    "technical": <0-100>,
    "timing": <0-100>,
    "uniqueness": <0-100>,
    "overall": <weighted average 0-100>
  },
  "market": {
    "tam": "<e.g. $4.2B>",
    "trend": "<growing|stable|declining>",
    "trendLabel": "<e.g. ↑ 28% YoY>",
    "competition": "<low|medium|high>",
    "timeToMarket": "<e.g. 2-4 months>"
  },
  "names": [
    {"name": "<brand name>", "domain": "<domain.tld>"}
  ],
  "competitors": [
    {"name": "<company>", "description": "<what they do>", "weakness": "<your edge>", "url": "<domain>"}
  ],
  "pitches": [
    {"type": "twitter", "label": "Twitter / X (280 chars)", "text": "<pitch>"},
    {"type": "elevator", "label": "Elevator Pitch (30 sec)", "text": "<pitch>"},
    {"type": "investor", "label": "Investor Pitch (2 min)", "text": "<pitch>"}
  ],
  "actions": [
    {"step": 1, "title": "<title>", "description": "<description>", "timeframe": "<timeframe>"}
  ],
  "summary": "<2-3 sentence honest assessment>"
}

Generate exactly 20 names with mix of .com .io .ai .co .app suffixes. 5 competitors. 5 actions. Be specific and realistic.`;

async function runGroq(idea: string, key: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: PROMPT(idea) }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Groq error ${res.status}`);
  }
  const data = await res.json();
  return data.choices[0].message.content as string;
}

async function runGemini(idea: string, key: string) {
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(PROMPT(idea));
  return result.response.text();
}

function parseResult(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  return JSON.parse(jsonMatch[0]);
}

function classifyKey(key: string): "groq" | "gemini" | "unknown" {
  if (key.startsWith("gsk_")) return "groq";
  if (key.startsWith("AIza")) return "gemini";
  return "unknown";
}

export async function POST(req: NextRequest) {
  const { idea, clientKey } = await req.json();

  if (!idea || typeof idea !== "string" || idea.length > 500) {
    return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
  }

  const key = SERVER_KEY || clientKey;
  if (!key) {
    return NextResponse.json({ error: "No API key — paste a Groq key (free at console.groq.com) in Settings." }, { status: 401 });
  }

  try {
    const provider = classifyKey(key);
    const text = provider === "gemini"
      ? await runGemini(idea, key)
      : await runGroq(idea, key); // default to Groq for gsk_ keys and unknown

    const parsed = parseResult(text);
    return NextResponse.json(parsed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Analysis failed";
    if (msg.includes("API_KEY_INVALID") || msg.includes("API key not valid")) {
      return NextResponse.json({ error: "Invalid API key. Check it in Settings." }, { status: 401 });
    }
    if (msg.includes("429") || msg.includes("quota") || msg.includes("Too Many Requests")) {
      return NextResponse.json({ error: "Quota exceeded. Switch to a Groq key (free at console.groq.com) — no billing required." }, { status: 429 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
