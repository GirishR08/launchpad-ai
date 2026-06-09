import type { AnalysisResult, ViabilityScore, Competitor, PitchVariant, MarketInsight, ActionStep } from "./types";

type IdeaCategory = "saas" | "consumer" | "marketplace" | "health" | "finance" | "food" | "education" | "ai";

interface CategoryProfile {
  viability: ViabilityScore;
  market: MarketInsight;
  competitors: Competitor[];
}

const CATEGORY_PROFILES: Record<IdeaCategory, CategoryProfile> = {
  saas: {
    viability: { market: 78, competition: 54, monetization: 85, technical: 72, timing: 82, uniqueness: 65, overall: 73 },
    market: { tam: "$12.4B", trend: "growing", trendLabel: "↑ 28% YoY", competition: "high", timeToMarket: "3-6 months" },
    competitors: [
      { name: "Notion", description: "All-in-one workspace", weakness: "Too broad — users want focused, single-purpose tools", url: "notion.so" },
      { name: "Airtable", description: "Database-spreadsheet hybrid", weakness: "Steep learning curve, overkill for most small teams", url: "airtable.com" },
      { name: "Monday.com", description: "Work OS platform", weakness: "Expensive at scale, bloated for solo founders", url: "monday.com" },
      { name: "ClickUp", description: "Project management suite", weakness: "Feature overload — constant complaints of complexity", url: "clickup.com" },
      { name: "Linear", description: "Issue tracking for software teams", weakness: "Dev-only focus, no general business workflow support", url: "linear.app" },
    ],
  },
  consumer: {
    viability: { market: 81, competition: 48, monetization: 62, technical: 78, timing: 85, uniqueness: 71, overall: 71 },
    market: { tam: "$24.1B", trend: "growing", trendLabel: "↑ 19% YoY", competition: "high", timeToMarket: "4-8 months" },
    competitors: [
      { name: "TikTok", description: "Short-form video & discovery", weakness: "Algorithm-controlled — creators have zero ownership", url: "tiktok.com" },
      { name: "Instagram", description: "Photo/video social network", weakness: "Declining organic reach, pay-to-play for visibility", url: "instagram.com" },
      { name: "Substack", description: "Newsletter and podcast platform", weakness: "Text-only focus, limited interactive or community features", url: "substack.com" },
      { name: "Patreon", description: "Creator membership platform", weakness: "High fees (8-12%), no discovery or growth tools", url: "patreon.com" },
      { name: "Beehiiv", description: "Newsletter growth platform", weakness: "Email-only, no multi-channel content or community", url: "beehiiv.com" },
    ],
  },
  marketplace: {
    viability: { market: 83, competition: 51, monetization: 77, technical: 65, timing: 79, uniqueness: 68, overall: 70 },
    market: { tam: "$18.7B", trend: "growing", trendLabel: "↑ 22% YoY", competition: "high", timeToMarket: "6-12 months" },
    competitors: [
      { name: "Fiverr", description: "Freelance services marketplace", weakness: "Race to the bottom on price, no quality guarantee", url: "fiverr.com" },
      { name: "Upwork", description: "Enterprise freelance platform", weakness: "High fees (20%), commoditized, no niche specialization", url: "upwork.com" },
      { name: "Etsy", description: "Handmade goods marketplace", weakness: "Saturated, heavy SEO dependency, rising seller fees", url: "etsy.com" },
      { name: "Thumbtack", description: "Local services marketplace", weakness: "Poor repeat business model, no relationship building", url: "thumbtack.com" },
      { name: "TaskRabbit", description: "On-demand task marketplace", weakness: "Limited to physical tasks, no digital or remote services", url: "taskrabbit.com" },
    ],
  },
  health: {
    viability: { market: 86, competition: 62, monetization: 74, technical: 70, timing: 88, uniqueness: 73, overall: 76 },
    market: { tam: "$31.5B", trend: "growing", trendLabel: "↑ 41% YoY", competition: "medium", timeToMarket: "6-10 months" },
    competitors: [
      { name: "Headspace", description: "Meditation and mindfulness app", weakness: "Generic content, no personalization or adaptive programs", url: "headspace.com" },
      { name: "MyFitnessPal", description: "Calorie and fitness tracker", weakness: "Data entry fatigue — users quit within 2 weeks", url: "myfitnesspal.com" },
      { name: "Noom", description: "Psychology-based weight loss", weakness: "Expensive ($70/mo), coach quality inconsistent", url: "noom.com" },
      { name: "Fitbit / Google Fit", description: "Wearable health tracking", weakness: "Hardware-dependent, no actionable insights from data", url: "fitbit.com" },
      { name: "Calm", description: "Sleep and meditation app", weakness: "Content library only — no active behavior change features", url: "calm.com" },
    ],
  },
  finance: {
    viability: { market: 80, competition: 58, monetization: 88, technical: 67, timing: 76, uniqueness: 62, overall: 72 },
    market: { tam: "$45.2B", trend: "growing", trendLabel: "↑ 17% YoY", competition: "high", timeToMarket: "6-12 months" },
    competitors: [
      { name: "Mint / Credit Karma", description: "Personal finance tracking", weakness: "No actionable advice, just dashboards — users don't change behavior", url: "creditkarma.com" },
      { name: "YNAB", description: "Zero-based budgeting app", weakness: "Manual process, steep learning curve, $99/yr steep for tight budgets", url: "ynab.com" },
      { name: "Robinhood", description: "Commission-free investing", weakness: "No financial education, gamification encourages poor decisions", url: "robinhood.com" },
      { name: "Quickbooks", description: "SMB accounting software", weakness: "Complex UX, expensive, over-engineered for freelancers", url: "quickbooks.com" },
      { name: "Wave", description: "Free accounting for small business", weakness: "Limited features, poor customer support, no mobile-first design", url: "waveapps.com" },
    ],
  },
  food: {
    viability: { market: 74, competition: 71, monetization: 68, technical: 80, timing: 72, uniqueness: 60, overall: 69 },
    market: { tam: "$22.3B", trend: "stable", trendLabel: "↑ 8% YoY", competition: "high", timeToMarket: "4-8 months" },
    competitors: [
      { name: "DoorDash", description: "Food delivery platform", weakness: "Restaurant margins crushed, 30% commission unsustainable", url: "doordash.com" },
      { name: "Instacart", description: "Grocery delivery service", weakness: "High delivery fees, inventory inaccuracy frustrates users", url: "instacart.com" },
      { name: "Uber Eats", description: "Food and grocery delivery", weakness: "No community or local discovery — feels transactional", url: "ubereats.com" },
      { name: "Goldbelly", description: "Artisan food marketplace", weakness: "Premium positioning limits mass adoption", url: "goldbelly.com" },
      { name: "Munchery / Sprig (defunct)", description: "Meal kit delivery", weakness: "Unit economics fail at scale — both shut down", url: "" },
    ],
  },
  education: {
    viability: { market: 82, competition: 55, monetization: 70, technical: 75, timing: 86, uniqueness: 72, overall: 74 },
    market: { tam: "$19.8B", trend: "growing", trendLabel: "↑ 32% YoY", competition: "medium", timeToMarket: "3-7 months" },
    competitors: [
      { name: "Coursera", description: "University-backed online courses", weakness: "Passive video content, low completion rates (< 10%)", url: "coursera.org" },
      { name: "Duolingo", description: "Language learning app", weakness: "Gamification without depth — users plateau quickly", url: "duolingo.com" },
      { name: "Udemy", description: "Marketplace for online courses", weakness: "Quality inconsistency, constant discounting devalues content", url: "udemy.com" },
      { name: "Khan Academy", description: "Free K-12 and test prep", weakness: "No personalization, no career outcome tracking", url: "khanacademy.org" },
      { name: "Skillshare", description: "Creative skills platform", weakness: "Breadth over depth — no credential or job placement path", url: "skillshare.com" },
    ],
  },
  ai: {
    viability: { market: 88, competition: 44, monetization: 82, technical: 69, timing: 94, uniqueness: 76, overall: 79 },
    market: { tam: "$62.7B", trend: "growing", trendLabel: "↑ 67% YoY", competition: "medium", timeToMarket: "2-5 months" },
    competitors: [
      { name: "ChatGPT / OpenAI", description: "General-purpose LLM assistant", weakness: "Horizontal tool — no domain expertise or workflow integration", url: "openai.com" },
      { name: "Perplexity", description: "AI-powered search engine", weakness: "Search-only — no task execution or multi-step workflows", url: "perplexity.ai" },
      { name: "Copy.ai", description: "AI copywriting platform", weakness: "Generic outputs, no learning from brand voice over time", url: "copy.ai" },
      { name: "Jasper", description: "AI content platform for marketers", weakness: "Expensive ($49+/mo), requires heavy prompt engineering", url: "jasper.ai" },
      { name: "Zapier AI", description: "AI-powered workflow automation", weakness: "Integration complexity — non-technical users still struggle", url: "zapier.com" },
    ],
  },
};

function detectCategory(idea: string): IdeaCategory {
  const text = idea.toLowerCase();
  if (/health|fitness|wellness|workout|diet|mental|meditat|sleep|weight|exercise|medical|doctor|patient/.test(text)) return "health";
  if (/food|meal|recipe|restaurant|delivery|grocery|cook|eat|drink|cafe|kitchen/.test(text)) return "food";
  if (/finance|money|budget|invest|bank|payment|crypto|tax|accounting|expense|saving|loan/.test(text)) return "finance";
  if (/learn|course|teach|education|tutor|school|student|skill|training|quiz|study/.test(text)) return "education";
  if (/ai|machine learning|gpt|llm|chatbot|automation|intelligent|predict|generative/.test(text)) return "ai";
  if (/marketplace|connect|hire|freelance|book|rent|buy|sell|platform for|community/.test(text)) return "marketplace";
  if (/app|social|consumer|people|personal|lifestyle|hobby|entertainment|game/.test(text)) return "consumer";
  return "saas";
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function analyzeIdea(
  idea: string,
  clientKey: string,
  onToken: (token: string) => void
): Promise<AnalysisResult> {
  // Call server-side API route — key never exposed in browser network requests
  onToken("Analyzing your idea...");
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, clientKey }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? "Analysis failed. Please try again.");
  }

  const parsed = await res.json();
  onToken("Done.");

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
}

export function getDemoAnalysis(idea: string): AnalysisResult {
  const category = detectCategory(idea);
  const profile = CATEGORY_PROFILES[category];
  const words = idea.toLowerCase().split(" ").filter((w) => w.length > 2);
  const key = words[0] ?? "launch";
  const last = words[words.length - 1] ?? "app";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const names = [
    { name: `${cap(key)}AI`, domain: `${key}ai.com` },
    { name: `${cap(key)}ly`, domain: `${key}ly.io` },
    { name: `${cap(key)}Hub`, domain: `${key}hub.com` },
    { name: `Smart${cap(last)}`, domain: `smart${last}.ai` },
    { name: `${cap(last)}Base`, domain: `${last}base.com` },
    { name: `${cap(last)}HQ`, domain: `${last}hq.io` },
    { name: `Get${cap(key)}`, domain: `get${key}.com` },
    { name: `Try${cap(last)}`, domain: `try${last}.io` },
    { name: `${cap(key)}Flow`, domain: `${key}flow.ai` },
    { name: `${cap(key)}Stack`, domain: `${key}stack.co` },
    { name: "Nexify", domain: "nexify.io" },
    { name: "Launchly", domain: "launchly.co" },
    { name: "Buildfast", domain: "buildfast.ai" },
    { name: "Stackr", domain: "stackr.app" },
    { name: "Vaultly", domain: "vaultly.io" },
    { name: "Momentum", domain: "momentumhq.com" },
    { name: "Novus", domain: "novus.co" },
    { name: "Beacon", domain: "beaconhq.ai" },
    { name: "Orbit", domain: "orbitapp.io" },
    { name: "Apex", domain: `apex${key}.com` },
  ];

  const categoryLabels: Record<IdeaCategory, string> = {
    saas: "B2B SaaS tools", health: "digital health", food: "food tech",
    finance: "fintech", education: "edtech", ai: "AI tools",
    consumer: "consumer apps", marketplace: "marketplace platforms",
  };
  const label = categoryLabels[category];

  const pitches: PitchVariant[] = [
    {
      type: "twitter", label: "Twitter / X (280 chars)",
      text: `${idea.charAt(0).toUpperCase() + idea.slice(1)} — built for people who are tired of the current options. Faster, simpler, and actually designed for how you work. Currently in early access. Try it free. #${cap(key)} #startup`,
    },
    {
      type: "elevator", label: "Elevator Pitch (30 sec)",
      text: `We're building ${idea} — a ${label} product that solves a problem millions of people deal with daily but no one has properly fixed yet. Our approach is different: instead of bolting on features, we started from scratch with the user's actual workflow. We're in early access and already seeing strong retention from our first users.`,
    },
    {
      type: "investor", label: "Investor Pitch (2 min)",
      text: `The ${label} market is worth ${profile.market.tam} and growing ${profile.market.trendLabel}. Despite that, the tools available today are either too complex, too expensive, or just not designed for the modern user. We're building ${idea} — a focused product that removes the friction that current tools ignore. Our business model is straightforward: a subscription starting at $29/month, targeting the underserved segment that existing players have left behind. We're post-MVP with early traction and a clear path to $1M ARR within 18 months. The team has deep domain expertise and we're raising to accelerate growth and hire two engineers.`,
    },
  ];

  const actions: ActionStep[] = [
    { step: 1, title: "Register your best available domain", description: `Domains go fast once an idea gets traction. Pick the best available .com or .io from your results and register it today for $12/year at name.com.`, timeframe: "Today" },
    { step: 2, title: "Talk to 20 potential users this week", description: `Find them in subreddits, Slack groups, or LinkedIn. Ask: "What's the most painful part of [problem]?" Don't pitch — just listen. Aim for 5 real conversations.`, timeframe: "This week" },
    { step: 3, title: "Build a waitlist landing page", description: "Use your elevator pitch as hero copy. One CTA: email signup. Target 100 signups before writing any code. Tools: Carrd ($19/yr) or Framer (free tier).", timeframe: "Week 2" },
    { step: 4, title: "Scope your MVP to one core feature", description: `From your competitor research, identify the single biggest gap in existing tools. Build only that. Resist scope creep — every added feature delays launch by a week.`, timeframe: "Week 3-4" },
    { step: 5, title: "Launch on Product Hunt", description: "Schedule for a Tuesday. Start collecting hunters and supporters now — reach out to the community 2 weeks before launch. Target top 5 product of the day.", timeframe: "Month 2-3" },
  ];

  const summaryLines: Record<IdeaCategory, string> = {
    saas: `The B2B SaaS space is crowded but high-value — buyers pay real money to solve workflow problems. Your strongest advantage is focus: while incumbents keep adding features, you can win by doing one thing exceptionally well. Main risk is customer acquisition cost in a market where enterprise sales cycles are long.`,
    consumer: `Consumer apps live and die on retention. Your idea targets a large audience but success depends heavily on habit formation in the first 7 days. The growth path is clear (virality, influencer, community) but requires patience — most consumer apps take 12-18 months to find their distribution channel.`,
    marketplace: `Two-sided marketplaces are hard to start (chicken-and-egg) but powerful once they reach liquidity. Your best strategy is to start hyper-niche — one city, one category — and nail quality before expanding. The unit economics are attractive once supply and demand are balanced.`,
    health: `Digital health is one of the fastest-growing sectors and regulation (HIPAA etc.) creates a moat once you're compliant. Users are highly motivated but also skeptical — trust and clinical credibility matter. Consider a B2B2C distribution path through employers or insurers for faster revenue.`,
    finance: `Fintech is lucrative but regulated — depending on your jurisdiction you may need financial licenses. The good news: users have extremely high willingness to pay for tools that directly impact their money. Focus on one clear financial outcome (save $X, earn $Y) as your core value prop.`,
    food: `Food tech has brutal unit economics at scale — the graveyard of failed startups here is long. Your best bet is a niche-first approach that builds loyal users before competing with delivery giants. Consider a community or subscription model to improve margins vs. per-order economics.`,
    education: `Edtech has a massive market but a completion problem — most users don't finish what they start. Products that tie learning to a specific career outcome (get a job, earn a cert) dramatically outperform general learning platforms. Social accountability features also significantly improve retention.`,
    ai: `You're entering the fastest-growing tech sector of the decade. The AI tools space rewards speed and specificity — horizontal "AI for everything" tools are losing to vertical, workflow-specific products. Your timing is excellent; the main risk is that a larger player ships a similar feature in 6 months.`,
  };

  return {
    id: generateId(),
    idea,
    createdAt: new Date().toISOString(),
    viability: profile.viability,
    market: profile.market,
    names: names.map((n) => ({ ...n, available: null, checking: true })),
    competitors: profile.competitors,
    pitches,
    actions,
    summary: summaryLines[category],
  };
}
