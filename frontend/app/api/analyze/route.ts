import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Key lives on the server — never sent to the browser
const SERVER_KEY = process.env.GEMINI_API_KEY ?? "";

export async function POST(req: NextRequest) {
  const { idea, clientKey } = await req.json();

  if (!idea || typeof idea !== "string" || idea.length > 500) {
    return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
  }

  // Use server key if set, fall back to user-provided key
  const key = SERVER_KEY || clientKey;
  if (!key) {
    return NextResponse.json({ error: "No API key configured" }, { status: 401 });
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a startup analyst AI. Analyze this startup idea and return ONLY valid JSON (no markdown, no explanation):

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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
