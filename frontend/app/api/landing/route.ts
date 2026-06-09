import { NextRequest, NextResponse } from "next/server";

const SERVER_KEY = process.env.AI_API_KEY ?? "";

export interface LandingPageData {
  headline: string;
  subheadline: string;
  badge: string;
  features: { icon: string; title: string; description: string }[];
  howItWorks: { step: string; title: string; description: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  faq: { question: string; answer: string }[];
  cta: string;
  ctaSubtext: string;
  footerTagline: string;
  primaryColor: string;
  accentColor: string;
}

const PROMPT = (idea: string, summary: string, pitch: string) => `You are a world-class landing page copywriter. Generate compelling landing page copy for this startup idea.

Idea: "${idea}"
Summary: "${summary}"
Elevator pitch: "${pitch}"

Return ONLY valid JSON (no markdown):
{
  "headline": "<punchy 6-10 word hero headline that sells the transformation, not the tool>",
  "subheadline": "<1-2 sentence subheadline expanding on the headline, 20-30 words>",
  "badge": "<short 3-5 word badge shown above headline, e.g. 'Now in Early Access' or 'Used by 500+ founders'>",
  "features": [
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit, not feature>"},
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit>"},
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit>"},
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit>"},
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit>"},
    {"icon": "<single emoji>", "title": "<feature name>", "description": "<1 sentence benefit>"}
  ],
  "howItWorks": [
    {"step": "01", "title": "<step title>", "description": "<1-2 sentence description>"},
    {"step": "02", "title": "<step title>", "description": "<1-2 sentence description>"},
    {"step": "03", "title": "<step title>", "description": "<1-2 sentence description>"}
  ],
  "testimonials": [
    {"quote": "<fake but believable testimonial 1-2 sentences>", "name": "<realistic first + last name>", "role": "<job title, Company>"},
    {"quote": "<fake but believable testimonial>", "name": "<realistic name>", "role": "<job title, Company>"},
    {"quote": "<fake but believable testimonial>", "name": "<realistic name>", "role": "<job title, Company>"}
  ],
  "faq": [
    {"question": "<common objection as a question>", "answer": "<concise answer 1-2 sentences>"},
    {"question": "<pricing/cost question>", "answer": "<answer>"},
    {"question": "<trust/security question>", "answer": "<answer>"},
    {"question": "<how to get started question>", "answer": "<answer>"}
  ],
  "cta": "<action-oriented CTA button text, 3-5 words>",
  "ctaSubtext": "<reassurance text under CTA, e.g. 'Free forever. No credit card required.'>",
  "footerTagline": "<short tagline for footer>",
  "primaryColor": "<hex color matching the product's vibe, e.g. #6366f1>",
  "accentColor": "<complementary accent hex color>"
}

Make copy specific to THIS idea — not generic startup copy. Testimonials should sound real. FAQ should address real objections for this specific product.`;

async function callGroq(prompt: string, key: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
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

export async function POST(req: NextRequest) {
  const { idea, summary, pitch, clientKey } = await req.json();
  if (!idea) return NextResponse.json({ error: "Missing idea" }, { status: 400 });

  const key = SERVER_KEY || clientKey;
  if (!key) return NextResponse.json({ error: "No API key" }, { status: 401 });

  try {
    const text = await callGroq(PROMPT(idea, summary ?? "", pitch ?? ""), key);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed" }, { status: 500 });
  }
}
