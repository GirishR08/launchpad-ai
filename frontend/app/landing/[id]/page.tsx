"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Loader2, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import { getAnalysis, getApiKey } from "../../../lib/storage";
import type { AnalysisResult } from "../../../lib/types";
import type { LandingPageData } from "../../api/landing/route";

export default function LandingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [landing, setLanding] = useState<LandingPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const r = getAnalysis(id);
    if (!r) { router.push("/"); return; }
    setAnalysis(r);

    const cached = sessionStorage.getItem(`landing_${id}`);
    if (cached) {
      setLanding(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const clientKey = getApiKey();
    fetch("/api/landing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idea: r.idea,
        summary: r.summary,
        pitch: r.pitches?.find((p) => p.type === "elevator")?.text ?? "",
        clientKey,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        sessionStorage.setItem(`landing_${id}`, JSON.stringify(data));
        setLanding(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, router]);

  const copyHtml = () => {
    if (!landing || !analysis) return;
    const html = buildHtml(landing, analysis.idea);
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#080c14" }}>
      <Loader2 size={32} className="animate-spin" style={{ color: "#4f8ef7" }} />
      <p className="text-sm" style={{ color: "#8899bb" }}>Generating your landing page…</p>
    </div>
  );

  if (error || !landing || !analysis) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" style={{ background: "#080c14" }}>
      <p className="text-red-400 text-sm">{error || "Not found"}</p>
      <Link href={`/analyze/${id}`} className="text-sm" style={{ color: "#4f8ef7" }}>← Back to analysis</Link>
    </div>
  );

  const primary = landing.primaryColor || "#6366f1";
  const accent = landing.accentColor || "#8b5cf6";

  return (
    <div className="min-h-screen" style={{ background: "#080c14", color: "#e2e8f0", fontFamily: "system-ui, sans-serif" }}>
      {/* Editor bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5" style={{ background: "#0e1420", borderBottom: "1px solid #1e2a42" }}>
        <Link href={`/analyze/${id}`} className="flex items-center gap-2 text-sm" style={{ color: "#8899bb" }}>
          <ArrowLeft size={14} /> Back to analysis
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(79,142,247,0.15)", color: "#4f8ef7", border: "1px solid rgba(79,142,247,0.3)" }}>
            Landing Page Preview
          </span>
          <button
            onClick={copyHtml}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
            style={{ background: copied ? "rgba(34,197,94,0.15)" : "rgba(79,142,247,0.15)", color: copied ? "#22c55e" : "#4f8ef7", border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(79,142,247,0.3)"}` }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied HTML!" : "Copy HTML"}
          </button>
          <a
            href="https://netlify.com/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg font-medium"
            style={{ background: "rgba(124,77,255,0.15)", color: "#a78bfa", border: "1px solid rgba(124,77,255,0.3)" }}
          >
            <ExternalLink size={12} /> Deploy Free
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="relative px-6 py-24 text-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 0%, ${primary}22 0%, #080c14 70%)` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(${primary} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        <div className="relative max-w-3xl mx-auto space-y-5">
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ background: `${primary}22`, color: primary, border: `1px solid ${primary}44` }}>
            {landing.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ color: "#f1f5f9" }}>
            {landing.headline}
          </h1>
          <p className="text-lg" style={{ color: "#94a3b8" }}>
            {landing.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              className="px-8 py-3.5 rounded-xl font-semibold text-white text-base shadow-lg transition-transform hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 4px 24px ${primary}44` }}
            >
              {landing.cta}
            </button>
            <p className="text-xs" style={{ color: "#64748b" }}>{landing.ctaSubtext}</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#f1f5f9" }}>
          Everything you need to <span style={{ color: primary }}>succeed</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {landing.features.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl transition-transform hover:-translate-y-0.5" style={{ background: "#0e1420", border: "1px solid #1e2a42" }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1.5" style={{ color: "#f1f5f9" }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8899bb" }}>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20" style={{ background: "#0a0f1a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#f1f5f9" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {landing.howItWorks.map((step, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto font-bold text-lg" style={{ background: `${primary}22`, color: primary, border: `1px solid ${primary}44` }}>
                  {step.step}
                </div>
                <h3 className="font-semibold" style={{ color: "#f1f5f9" }}>{step.title}</h3>
                <p className="text-sm" style={{ color: "#8899bb" }}>{step.description}</p>
                {i < landing.howItWorks.length - 1 && (
                  <div className="hidden md:block absolute" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#f1f5f9" }}>
          Loved by early adopters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {landing.testimonials.map((t, i) => (
            <div key={i} className="p-5 rounded-2xl space-y-4" style={{ background: "#0e1420", border: "1px solid #1e2a42" }}>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} style={{ color: "#fbbf24" }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed italic" style={{ color: "#94a3b8" }}>&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#f1f5f9" }}>{t.name}</p>
                <p className="text-xs" style={{ color: "#64748b" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EMAIL WAITLIST CTA */}
      <section className="px-6 py-20 text-center" style={{ background: `radial-gradient(ellipse at 50% 100%, ${primary}18 0%, #080c14 70%)` }}>
        <div className="max-w-xl mx-auto space-y-5">
          <Zap size={32} style={{ color: primary, margin: "0 auto" }} />
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#f1f5f9" }}>
            {submitted ? "You&apos;re on the list!" : "Get early access"}
          </h2>
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            {submitted ? "We&apos;ll notify you the moment we launch." : "Join hundreds of early adopters. No spam, ever."}
          </p>
          {!submitted && (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: "#0e1420", border: "1px solid #1e2a42", color: "#f1f5f9" }}
                onKeyDown={(e) => { if (e.key === "Enter" && email) setSubmitted(true); }}
              />
              <button
                onClick={() => email && setSubmitted(true)}
                className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
              >
                {landing.cta}
              </button>
            </div>
          )}
          <p className="text-xs" style={{ color: "#475569" }}>{landing.ctaSubtext}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10" style={{ color: "#f1f5f9" }}>
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {landing.faq.map((item, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid #1e2a42" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
                style={{ background: "#0e1420", color: "#f1f5f9" }}
              >
                <span className="text-sm font-medium pr-4">{item.question}</span>
                <span className="text-lg flex-shrink-0 transition-transform" style={{ transform: openFaq === i ? "rotate(45deg)" : "none", color: primary }}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-5 py-4 text-sm" style={{ background: "#090e18", color: "#8899bb" }}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: "1px solid #1e2a42" }}>
        <p className="text-sm font-medium" style={{ color: "#4f8ef7" }}>{landing.footerTagline}</p>
        <p className="text-xs mt-2" style={{ color: "#334155" }}>
          Built with{" "}
          <a href="https://frontend-girishr08s-projects.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: "#4f8ef7" }}>
            LaunchPad AI
          </a>
        </p>
      </footer>
    </div>
  );
}

function buildHtml(landing: LandingPageData, idea: string): string {
  const primary = landing.primaryColor || "#6366f1";
  const accent = landing.accentColor || "#8b5cf6";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${landing.headline}</title>
<meta name="description" content="${landing.subheadline}" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #080c14; color: #e2e8f0; }
  section { padding: 80px 24px; }
  .container { max-width: 960px; margin: 0 auto; }
  .hero { text-align: center; background: radial-gradient(ellipse at 50% 0%, ${primary}22 0%, #080c14 70%); }
  .badge { display: inline-block; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; background: ${primary}22; color: ${primary}; border: 1px solid ${primary}44; margin-bottom: 20px; }
  .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.15; color: #f1f5f9; margin-bottom: 16px; }
  .hero p { font-size: 1.1rem; color: #94a3b8; margin-bottom: 32px; }
  .cta-btn { display: inline-block; padding: 14px 32px; border-radius: 12px; font-weight: 700; color: #fff; background: linear-gradient(135deg, ${primary}, ${accent}); font-size: 1rem; border: none; cursor: pointer; text-decoration: none; box-shadow: 0 4px 24px ${primary}44; }
  .cta-sub { font-size: 12px; color: #64748b; margin-top: 12px; }
  h2 { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #f1f5f9; text-align: center; margin-bottom: 48px; }
  h2 span { color: ${primary}; }
  .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
  .feature-card { background: #0e1420; border: 1px solid #1e2a42; border-radius: 16px; padding: 20px; }
  .feature-icon { font-size: 2rem; margin-bottom: 12px; }
  .feature-card h3 { font-size: 1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
  .feature-card p { font-size: 0.875rem; color: #8899bb; line-height: 1.6; }
  .steps-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 40px; text-align: center; }
  .step-num { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-weight: 700; font-size: 1.1rem; background: ${primary}22; color: ${primary}; border: 1px solid ${primary}44; }
  .steps-grid h3 { font-size: 1rem; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
  .steps-grid p { font-size: 0.875rem; color: #8899bb; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
  .testimonial-card { background: #0e1420; border: 1px solid #1e2a42; border-radius: 16px; padding: 20px; }
  .stars { color: #fbbf24; font-size: 1rem; margin-bottom: 12px; }
  .testimonial-card p { font-size: 0.875rem; color: #94a3b8; font-style: italic; line-height: 1.6; margin-bottom: 16px; }
  .testimonial-card strong { font-size: 0.875rem; color: #f1f5f9; }
  .testimonial-card span { font-size: 0.75rem; color: #64748b; }
  .email-section { text-align: center; background: radial-gradient(ellipse at 50% 100%, ${primary}18 0%, #080c14 70%); }
  .email-form { display: flex; flex-wrap: wrap; gap: 12px; max-width: 480px; margin: 24px auto 0; justify-content: center; }
  .email-input { flex: 1; min-width: 220px; padding: 12px 16px; border-radius: 12px; background: #0e1420; border: 1px solid #1e2a42; color: #f1f5f9; font-size: 0.875rem; outline: none; }
  .faq-section { max-width: 640px; margin: 0 auto; }
  .faq-item { background: #0e1420; border: 1px solid #1e2a42; border-radius: 12px; overflow: hidden; margin-bottom: 12px; }
  .faq-q { width: 100%; padding: 16px 20px; text-align: left; background: none; border: none; color: #f1f5f9; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
  .faq-a { padding: 0 20px 16px; font-size: 0.875rem; color: #8899bb; line-height: 1.6; }
  footer { padding: 32px 24px; text-align: center; border-top: 1px solid #1e2a42; }
  footer p { font-size: 0.875rem; color: #4f8ef7; font-weight: 600; }
  footer small { font-size: 0.75rem; color: #334155; display: block; margin-top: 8px; }
  footer a { color: #4f8ef7; text-decoration: none; }
  @media (max-width: 640px) { .email-form { flex-direction: column; } .email-input, .cta-btn { width: 100%; } }
</style>
</head>
<body>
<section class="hero">
  <div class="container">
    <span class="badge">${landing.badge}</span>
    <h1>${landing.headline}</h1>
    <p>${landing.subheadline}</p>
    <a href="#waitlist" class="cta-btn">${landing.cta}</a>
    <p class="cta-sub">${landing.ctaSubtext}</p>
  </div>
</section>

<section>
  <div class="container">
    <h2>Everything you need to <span>succeed</span></h2>
    <div class="features-grid">
      ${landing.features.map(f => `<div class="feature-card"><div class="feature-icon">${f.icon}</div><h3>${f.title}</h3><p>${f.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section style="background: #0a0f1a;">
  <div class="container">
    <h2>How it works</h2>
    <div class="steps-grid">
      ${landing.howItWorks.map(s => `<div><div class="step-num">${s.step}</div><h3>${s.title}</h3><p>${s.description}</p></div>`).join("")}
    </div>
  </div>
</section>

<section>
  <div class="container">
    <h2>Loved by early adopters</h2>
    <div class="testimonials-grid">
      ${landing.testimonials.map(t => `<div class="testimonial-card"><div class="stars">★★★★★</div><p>"${t.quote}"</p><strong>${t.name}</strong><br/><span>${t.role}</span></div>`).join("")}
    </div>
  </div>
</section>

<section class="email-section" id="waitlist">
  <div class="container">
    <h2>Get early access</h2>
    <p style="color:#94a3b8; text-align:center;">Join hundreds of early adopters. No spam, ever.</p>
    <form class="email-form" onsubmit="return false">
      <input class="email-input" type="email" placeholder="you@example.com" />
      <button type="submit" class="cta-btn">${landing.cta}</button>
    </form>
    <p class="cta-sub">${landing.ctaSubtext}</p>
  </div>
</section>

<section>
  <div class="container faq-section">
    <h2>Frequently asked questions</h2>
    ${landing.faq.map((item, i) => `<div class="faq-item"><button class="faq-q" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">${item.question} <span>+</span></button><div class="faq-a" style="display:none">${item.answer}</div></div>`).join("")}
  </div>
</section>

<footer>
  <p>${landing.footerTagline}</p>
  <small>Built with <a href="https://frontend-girishr08s-projects.vercel.app">LaunchPad AI</a></small>
</footer>
</body>
</html>`;
}
