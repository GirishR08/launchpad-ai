import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AnalysisResult, ViabilityScore, Competitor, PitchVariant, MarketInsight, ActionStep } from "./types";

const DEMO_IDEAS: Record<string, Partial<AnalysisResult>> = {
  default: {
    viability: { market: 72, competition: 58, monetization: 81, technical: 75, timing: 88, uniqueness: 69, overall: 74 },
    market: { tam: "$8.2B", trend: "growing", trendLabel: "↑ 34% YoY", competition: "medium", timeToMarket: "3-6 months" },
    competitors: [
      { name: "Namelix", description: "AI business name generator", weakness: "No market analysis or domain checking integration", url: "namelix.com" },
      { name: "Squadhelp", description: "Crowdsourced naming marketplace", weakness: "Expensive ($300+), slow (weeks), no AI analysis", url: "squadhelp.com" },
      { name: "Lean Domain Search", description: "Domain-first name finder", weakness: "No AI, no market context, no competitor research", url: "leandomainsearch.com" },
      { name: "Looka", description: "AI branding tool", weakness: "Logo-focused, no business validation or name strategy", url: "looka.com" },
      { name: "BrandBucket", description: "Premium domain marketplace", weakness: "Expensive pre-bought domains, no custom idea analysis" },
    ],
    pitches: [
      { type: "twitter", label: "Twitter / X (280 chars)", text: "Stop spending weeks on startup research. LaunchPad AI gives you market analysis, 20 name ideas with live domain availability, competitor intel, and your investor pitch — in 30 seconds. Free to try." },
      { type: "elevator", label: "Elevator Pitch (30 sec)", text: "LaunchPad AI is the fastest way to go from startup idea to launch-ready. You type your idea, we instantly analyze the market, generate 20 brand names, check domain availability in real-time, map your competition, and write your pitch. What used to take a founder two weeks now takes 30 seconds." },
      { type: "investor", label: "Investor Pitch (2 min)", text: "Every year, 300 million people have a startup idea. 95% never act on it — not because the idea is bad, but because the pre-launch research is overwhelming and expensive. LaunchPad AI eliminates that barrier. Our AI analyzes market size, competition, and timing; generates optimized brand names; checks domain availability live; maps competitors; and writes your pitch deck — all in under a minute. We're targeting the $8B startup tools market with a $29/month SaaS model. Early beta users report saving 12+ hours per project." },
    ],
    actions: [
      { step: 1, title: "Register your domain today", description: "The best available domain from your results will be taken within weeks if your idea is viable. Secure it now for $12/year.", timeframe: "Today" },
      { step: 2, title: "Validate with 20 potential customers", description: "Post in 3 relevant Reddit communities (r/Entrepreneur, r/SaaS, r/startups). Aim for 5 conversations this week.", timeframe: "This week" },
      { step: 3, title: "Build a landing page", description: "Use your elevator pitch as the hero copy. Add an email waitlist. Target 100 signups before writing a line of code.", timeframe: "Week 2" },
      { step: 4, title: "Define your MVP scope", description: "Pick the single core feature your top 5 competitors are worst at. Build only that.", timeframe: "Week 3-4" },
      { step: 5, title: "Launch on Product Hunt", description: "Schedule your PH launch for a Tuesday. Build your hunter network now. Target top 5 product of the day.", timeframe: "Month 2-3" },
    ],
    summary: "Strong idea with a clear market gap. The timing is excellent — the startup tools space is growing rapidly and your differentiation angle is defensible. Focus on the domain angle and the speed advantage over existing tools.",
  },
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function analyzeIdea(
  idea: string,
  apiKey: string,
  onToken: (token: string) => void
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a startup analyst AI. Analyze this startup idea and return ONLY valid JSON (no markdown, no explanation):

Idea: "${idea}"

Return this exact JSON structure:
{
  "viability": {
    "market": <0-100 score for market size/demand>,
    "competition": <0-100 score for competitive advantage>,
    "monetization": <0-100 score for revenue potential>,
    "technical": <0-100 score for technical feasibility>,
    "timing": <0-100 score for market timing>,
    "uniqueness": <0-100 score for differentiation>,
    "overall": <weighted average 0-100>
  },
  "market": {
    "tam": "<estimated total addressable market, e.g. $4.2B>",
    "trend": "<growing|stable|declining>",
    "trendLabel": "<e.g. ↑ 28% YoY>",
    "competition": "<low|medium|high>",
    "timeToMarket": "<e.g. 2-4 months>"
  },
  "names": [
    {"name": "<brand name>", "domain": "<name.com or name.io>"},
    ... 18 more entries, mix of .com .io .ai .co .app suffixes
  ],
  "competitors": [
    {"name": "<company>", "description": "<what they do>", "weakness": "<specific gap your idea exploits>", "url": "<domain if known>"},
    ... 4 more
  ],
  "pitches": [
    {"type": "twitter", "label": "Twitter / X (280 chars)", "text": "<280 char pitch>"},
    {"type": "elevator", "label": "Elevator Pitch (30 sec)", "text": "<60-80 word pitch>"},
    {"type": "investor", "label": "Investor Pitch (2 min)", "text": "<200-250 word investor pitch with market size and business model>"}
  ],
  "actions": [
    {"step": 1, "title": "<action title>", "description": "<specific actionable description>", "timeframe": "<Today|This week|Week 2|Week 3-4|Month 2-3>"},
    ... 4 more steps
  ],
  "summary": "<2-3 sentence honest assessment of the idea's strengths and main risk>"
}

Be specific and realistic. Names should be creative and brandable. Competitors should be real companies if they exist.`;

  let fullText = "";
  let streamText = "Analyzing your idea";

  const streamResult = await model.generateContentStream(prompt);

  for await (const chunk of streamResult.stream) {
    const text = chunk.text();
    fullText += text;
    streamText += text.length > 0 ? "." : "";
    onToken(streamText);
  }

  try {
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const parsed = JSON.parse(jsonMatch[0]);

    return {
      id: generateId(),
      idea,
      createdAt: new Date().toISOString(),
      viability: parsed.viability,
      market: parsed.market,
      names: (parsed.names || []).slice(0, 20).map((n: { name: string; domain: string }) => ({
        name: n.name,
        domain: n.domain,
        available: null,
        checking: true,
      })),
      competitors: parsed.competitors || [],
      pitches: parsed.pitches || [],
      actions: parsed.actions || [],
      summary: parsed.summary || "",
    };
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}

export function getDemoAnalysis(idea: string): AnalysisResult {
  const base = DEMO_IDEAS.default;
  const ideaWords = idea.toLowerCase().split(" ");

  const nameVariations = [
    { name: `${ideaWords[0]?.charAt(0).toUpperCase()}${ideaWords[0]?.slice(1)}AI`, domain: `${ideaWords[0]}ai.com` },
    { name: `Launch${ideaWords[ideaWords.length - 1]?.charAt(0).toUpperCase()}${ideaWords[ideaWords.length - 1]?.slice(1)}`, domain: `launch${ideaWords[ideaWords.length - 1]}.io` },
    { name: `Smart${ideaWords[0]?.charAt(0).toUpperCase()}${ideaWords[0]?.slice(1)}`, domain: `smart${ideaWords[0]}.ai` },
    { name: "FlowBase", domain: "flowbase.com" },
    { name: "Nexify", domain: "nexify.io" },
    { name: "Launchly", domain: "launchly.co" },
    { name: "Buildfast", domain: "buildfast.ai" },
    { name: "Stackr", domain: "stackr.app" },
    { name: "Vaultly", domain: "vaultly.io" },
    { name: "Clarifai", domain: "clarifai.co" },
    { name: "Momentum", domain: "momentumhq.com" },
    { name: "Corepath", domain: "corepath.io" },
    { name: "Spark Labs", domain: "sparklabs.ai" },
    { name: "Novus", domain: "novus.co" },
    { name: "Pivotal", domain: "pivotalhq.com" },
    { name: "Orbit", domain: "orbitapp.io" },
    { name: "Beacon", domain: "beaconhq.ai" },
    { name: "Cascade", domain: "cascadeapp.co" },
    { name: "Velo", domain: "velo.app" },
    { name: "Apex", domain: "apexhq.io" },
  ];

  return {
    id: generateId(),
    idea,
    createdAt: new Date().toISOString(),
    viability: base.viability as ViabilityScore,
    market: base.market as MarketInsight,
    names: nameVariations.map((n) => ({ ...n, available: null, checking: true })),
    competitors: base.competitors as Competitor[],
    pitches: base.pitches as PitchVariant[],
    actions: base.actions as ActionStep[],
    summary: base.summary as string,
  };
}
