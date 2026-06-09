# LaunchPad AI

**From startup idea to launch-ready in 30 seconds.**

AI-powered startup validator. Drop your idea, get market analysis, 20 brand names with live domain availability, a competitor map, and your investor pitch — instantly.

## What it does

1. **Viability Score** — 6-dimension AI analysis (market, timing, competition, monetization, technical, uniqueness) visualized as a radar chart
2. **Live Domain Checking** — 20 brand name suggestions with real-time .com/.io/.ai availability via RDAP API (no auth needed)
3. **Competitor Map** — 5 real competitors with your specific edge over each
4. **Pitch Generator** — Twitter pitch, 30-second elevator pitch, and full investor pitch with copy-to-clipboard
5. **Action Plan** — 5 concrete next steps with timeframes, from domain registration to Product Hunt launch
6. **Analysis History** — All past analyses saved in localStorage, accessible anytime

## Tech Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion
- **AI:** Google Gemini 1.5 Flash (free tier via Google AI Studio)
- **Domain checking:** RDAP.org public API (no auth, real-time data)
- **Charts:** Recharts RadarChart
- **Icons:** Lucide React
- **Deployment:** Vercel

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

For live AI analysis, get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey) (no credit card required) and paste it in the app settings. Without a key, a realistic demo analysis runs automatically.

## Demo

- Without API key: realistic demo analysis with pre-generated data
- With API key: live Gemini AI analysis + streaming output

## Built for

DeveloperWeek New York 2026 Hackathon · Also entered in Build with Gemini XPRIZE (Entrepreneurship category)
