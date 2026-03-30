"use client";

import { useState, useEffect, useRef } from "react";

const BUSINESSES = [
  { type: "Plumber", city: "Denver", domain: "denverplumbingpro", color: "#00E5FF", icon: "🔧", time: "1m 12s" },
  { type: "Yoga Studio", city: "Austin", domain: "sunriseyogaatx", color: "#FF6B9D", icon: "🧘", time: "58s" },
  { type: "Law Firm", city: "Chicago", domain: "meyerlawgroup", color: "#7C6FFF", icon: "⚖️", time: "2m 04s" },
  { type: "Bakery", city: "Portland", domain: "sweetrootbakery", color: "#FF9A3C", icon: "🍞", time: "47s" },
  { type: "Dog Groomer", city: "Nashville", domain: "pawfectgrooming", color: "#4ADE80", icon: "🐾", time: "1m 33s" },
];

const IMAGE_STYLES = [
  { name: "Clean Corporate", desc: "Crisp, professional, modern.", bg: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)", accent: "#00E5FF" },
  { name: "Cinematic", desc: "Moody, dramatic, high-contrast.", bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", accent: "#E94560" },
  { name: "Minimal Illustration", desc: "Simple shapes, clean layout.", bg: "linear-gradient(135deg,#f0f4f8,#dde6ed,#c8d8e4)", accent: "#6EE7B7" },
  { name: "Social Thumbnail", desc: "Bold, scroll-stopping, urgent.", bg: "linear-gradient(135deg,#f7971e,#ffd200)", accent: "#ff6b35" },
  { name: "Product Showcase", desc: "Studio lighting, premium feel.", bg: "linear-gradient(135deg,#141414,#1f1f1f,#2a2a2a)", accent: "#c9a84c" },
];

const DEMO_PROMPT = "I run a plumbing business in Denver, CO. Licensed & insured, 5-star rated, available 24/7 for emergencies.";
const DEMO_STEPS = [
  "Analyzing Denver Plumbing Co.",
  "Writing homepage copy & headlines",
  "Designing layout & color scheme",
  "Adding SEO tags & mobile styles",
];

const COMPARE_ROWS = [
  { feature: "Time to launch", autopilot: "Under 60 seconds", diy: "3–7 days", agency: "4–8 weeks" },
  { feature: "Total cost", autopilot: "$10/month", diy: "$16–$40/month", agency: "$3,000–$15,000+" },
  { feature: "Custom copy written for you", autopilot: true, diy: false, agency: "Extra cost" },
  { feature: "No design skills needed", autopilot: true, diy: false, agency: true },
  { feature: "AI image generation", autopilot: true, diy: false, agency: false },
  { feature: "Email + ad copy tools", autopilot: true, diy: false, agency: false },
  { feature: "Lead capture built in", autopilot: true, diy: false, agency: "Extra cost" },
  { feature: "14-day free trial", autopilot: true, diy: false, agency: false },
];

export default function HomePage() {
  const [inputVal, setInputVal] = useState("");
  const [activeBiz, setActiveBiz] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeStyle, setActiveStyle] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live builder demo state
  const [demoPhase, setDemoPhase] = useState<"typing" | "building" | "done">("typing");
  const [demoCharIdx, setDemoCharIdx] = useState(0);
  const [demoStepsDone, setDemoStepsDone] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const phrases = [
    "I run a dog grooming salon in Nashville…",
    "I'm a freelance photographer in Miami…",
    "I own a restaurant in San Francisco…",
    "I'm a personal trainer in New York…",
    "I have a landscaping company in Denver…",
  ];

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    const bizInterval = setInterval(() => setActiveBiz(p => (p + 1) % BUSINESSES.length), 2800);
    return () => { window.removeEventListener("scroll", onScroll); clearInterval(bizInterval); };
  }, []);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    const speed = isDeleting ? 22 : 48;
    const t = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < phrase.length) setTypedText(phrase.slice(0, typedText.length + 1));
        else setTimeout(() => setIsDeleting(true), 2000);
      } else {
        if (typedText.length > 0) setTypedText(phrase.slice(0, typedText.length - 1));
        else { setIsDeleting(false); setPhraseIdx(p => (p + 1) % phrases.length); }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [typedText, isDeleting, phraseIdx]);

  // Demo: typing phase
  useEffect(() => {
    if (!mounted || demoPhase !== "typing") return;
    if (demoCharIdx < DEMO_PROMPT.length) {
      const t = setTimeout(() => setDemoCharIdx(i => i + 1), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => { setDemoPhase("building"); setDemoStepsDone(0); }, 900);
      return () => clearTimeout(t);
    }
  }, [mounted, demoPhase, demoCharIdx]);

  // Demo: building phase
  useEffect(() => {
    if (demoPhase !== "building") return;
    if (demoStepsDone < DEMO_STEPS.length) {
      const t = setTimeout(() => setDemoStepsDone(s => s + 1), 820);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setDemoPhase("done"), 400);
      return () => clearTimeout(t);
    }
  }, [demoPhase, demoStepsDone]);

  // Demo: done phase — restart
  useEffect(() => {
    if (demoPhase !== "done") return;
    const t = setTimeout(() => { setDemoPhase("typing"); setDemoCharIdx(0); setDemoStepsDone(0); }, 5500);
    return () => clearTimeout(t);
  }, [demoPhase]);

  const handleBuild = () => {
    window.location.href = inputVal.trim() ? `/register?prompt=${encodeURIComponent(inputVal)}` : "/register";
  };

  const biz = BUSINESSES[activeBiz];
  const style = IMAGE_STYLES[activeStyle];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --bg:#060608;--bg2:#0C0C10;--surface:#111116;--surface2:#18181F;
          --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.12);
          --text:#F0EEF8;--text2:#8A8899;--text3:#6B6A7A;
          --accent:#6EE7B7;--accent2:#818CF8;--accent3:#F472B6;
          --display:'Fraunces',Georgia,serif;--body:'DM Sans',sans-serif;
        }
        html{scroll-behavior:smooth}
        .root{background:var(--bg);color:var(--text);font-family:var(--body);min-height:100vh;overflow-x:hidden}
        .root::after{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity:0.5}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes glowPulse{0%,100%{opacity:0.4}50%{opacity:0.8}}
        @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes imgSwap{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmerLine{0%{width:0%}100%{width:100%}}
        @keyframes popIn{from{opacity:0;transform:scale(0.92) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes stepIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .fu1{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s both}
        .fu2{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.18s both}
        .fu3{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both}
        .fu4{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.42s both}
        .fu5{animation:fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.56s both}
        .preinit{opacity:0}

        /* ── NAV ─────────────────────────── */
        .nav{position:fixed;top:0;left:0;right:0;z-index:300;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 40px;transition:all 0.35s}
        .nav.scrolled{background:rgba(6,6,8,0.92);backdrop-filter:blur(24px);border-bottom:1px solid var(--border)}
        .nav-logo{font-family:var(--display);font-size:22px;font-weight:500;letter-spacing:-0.02em;color:var(--text);text-decoration:none;display:flex;align-items:center;gap:8px}
        .logo-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite}
        .nav-center{display:flex;gap:4px;align-items:center}
        .nav-link{font-size:13px;font-weight:500;color:var(--text2);text-decoration:none;padding:8px 16px;border-radius:8px;transition:color 0.2s,background 0.2s}
        .nav-link:hover{color:var(--text);background:rgba(255,255,255,0.05)}
        .nav-right{display:flex;gap:8px;align-items:center}
        .nav-signin{font-size:13px;font-weight:500;color:var(--text2);text-decoration:none;padding:9px 16px;border-radius:10px;transition:color 0.2s}
        .nav-signin:hover{color:var(--text)}
        .nav-cta{font-size:13px;font-weight:700;background:var(--accent);color:#060608;padding:10px 22px;border-radius:10px;text-decoration:none;transition:filter 0.2s,transform 0.15s,box-shadow 0.2s;letter-spacing:-0.01em}
        .nav-cta:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px rgba(110,231,183,0.32)}
        .nav-hamburger{display:none;flex-direction:column;gap:4px;cursor:pointer;padding:8px;background:none;border:none}
        .nav-hamburger span{width:20px;height:2px;background:var(--text2);border-radius:2px}
        .mobile-menu{display:none;position:fixed;top:64px;left:0;right:0;background:rgba(6,6,8,0.98);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);padding:20px;z-index:299;flex-direction:column;gap:4px}
        .mobile-menu.open{display:flex}
        .mobile-link{font-size:15px;font-weight:500;color:var(--text2);text-decoration:none;padding:12px 16px;border-radius:10px}
        .mobile-cta{display:block;margin-top:8px;padding:14px;border-radius:12px;text-align:center;text-decoration:none;font-size:14px;font-weight:700;background:var(--accent);color:#060608}

        /* ── HERO ─────────────────────────── */
        .hero{min-height:100vh;padding:110px 40px 80px;position:relative;display:flex;align-items:center;overflow:hidden}
        .hero-glow{position:absolute;top:-20%;left:50%;transform:translateX(-50%);width:800px;height:600px;background:radial-gradient(ellipse,rgba(110,231,183,0.08) 0%,transparent 65%);pointer-events:none;z-index:0;animation:glowPulse 4s ease-in-out infinite}
        .hero-grid-bg{position:absolute;inset:0;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 60% at 50% 40%,black 30%,transparent 100%)}
        .hero-inner{max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.05fr 0.95fr;gap:72px;align-items:center;position:relative;z-index:1}
        .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(110,231,183,0.08);border:1px solid rgba(110,231,183,0.2);border-radius:100px;padding:6px 14px;font-size:12px;font-weight:600;color:var(--accent);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:28px}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:pulse 2s ease infinite}
        .hero-h1{font-family:var(--display);font-size:clamp(48px,6vw,90px);font-weight:300;line-height:1.03;letter-spacing:-0.03em;color:var(--text);margin-bottom:24px}
        .hero-h1 em{font-style:italic;color:var(--accent);font-weight:300}
        .hero-h1 .dim{color:#4A4959}
        .hero-sub{font-size:17px;font-weight:300;color:var(--text2);line-height:1.75;max-width:460px;margin-bottom:28px;letter-spacing:-0.01em}
        .hero-sub strong{color:var(--text);font-weight:500}
        .hero-price-row{display:flex;align-items:center;gap:10px;margin-bottom:20px;font-size:13px;color:var(--text3)}
        .price-pill{background:rgba(110,231,183,0.12);border:1px solid rgba(110,231,183,0.25);border-radius:6px;padding:3px 9px;font-size:12px;font-weight:700;color:var(--accent)}
        .build-wrap{background:var(--surface);border:1px solid var(--border2);border-radius:18px;overflow:hidden;margin-bottom:14px;transition:border-color 0.25s,box-shadow 0.25s}
        .build-wrap:focus-within{border-color:rgba(110,231,183,0.4);box-shadow:0 0 0 4px rgba(110,231,183,0.06)}
        .build-input{width:100%;border:none;outline:none;font-family:var(--body);font-size:15px;font-weight:400;color:var(--text);padding:20px 22px 8px;background:transparent;letter-spacing:-0.01em}
        .build-input::placeholder{color:transparent}
        .build-bottom{display:flex;justify-content:space-between;align-items:center;padding:10px 12px 14px 22px}
        .build-placeholder{font-size:13px;color:var(--text3);pointer-events:none;font-style:italic}
        .cursor-blink{animation:blink 1s step-end infinite}
        .build-btn{background:var(--accent);color:#060608;border:none;cursor:pointer;font-family:var(--body);font-size:13px;font-weight:700;letter-spacing:0.02em;padding:12px 24px;border-radius:10px;transition:filter 0.2s,transform 0.15s,box-shadow 0.2s;white-space:nowrap}
        .build-btn:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 4px 20px rgba(110,231,183,0.35)}
        .hero-trust{display:flex;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--text3);margin-bottom:28px}
        .hero-trust span{display:flex;align-items:center;gap:5px}
        .trust-check{color:var(--accent);font-size:11px}
        .social-row{display:flex;align-items:center;gap:14px}
        .avs{display:flex}
        .av{width:30px;height:30px;border-radius:50%;border:2px solid var(--bg);font-size:9px;font-weight:700;color:white;display:flex;align-items:center;justify-content:center;margin-left:-8px;flex-shrink:0}
        .av:first-child{margin-left:0}
        .social-text{font-size:13px;font-weight:500;color:var(--text2)}
        .social-stars{color:#F59E0B;font-size:11px;margin-top:2px}

        /* ── HERO MOCKUP ─────────────────── */
        .mockup-col{position:relative}
        .mockup-frame{background:var(--surface);border:1px solid var(--border2);border-radius:20px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,0.5),0 40px 80px rgba(0,0,0,0.6)}
        .mbar{background:#0A0A0D;padding:12px 16px;display:flex;align-items:center;gap:10px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .mdots{display:flex;gap:5px}
        .mdot{width:9px;height:9px;border-radius:50%}
        .murl{flex:1;background:rgba(255,255,255,0.05);border-radius:6px;padding:5px 12px;font-size:10px;color:var(--text3);display:flex;align-items:center;gap:5px;font-family:monospace;overflow:hidden;white-space:nowrap}
        .murl-lock{color:var(--accent);font-size:8px}
        .murl-text{overflow:hidden;text-overflow:ellipsis}
        .mbody{height:320px;position:relative;overflow:hidden}
        .mslide{position:absolute;inset:0;padding:20px;transition:opacity 0.5s ease,transform 0.5s ease}
        .mcard{border-radius:12px;padding:18px;margin-bottom:12px}
        .mcard-eye{font-size:8px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px}
        .mcard-title{font-family:var(--display);font-size:15px;line-height:1.25;margin-bottom:8px}
        .mcard-body{font-size:10px;color:#888;margin-bottom:11px;line-height:1.6}
        .mcard-ctas{display:flex;gap:6px}
        .mcta-main{padding:7px 12px;border-radius:6px;font-size:10px;font-weight:700;color:white}
        .mcta-ghost{padding:7px 12px;border-radius:6px;font-size:10px;font-weight:600;border:1px solid;background:transparent}
        .mfeats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
        .mfeat{background:rgba(255,255,255,0.04);border-radius:8px;padding:9px 6px;text-align:center}
        .mfeat-text{font-size:8px;color:#666;font-weight:600}
        .mtabs{background:rgba(0,0,0,0.3);border-top:1px solid rgba(255,255,255,0.05);padding:10px 12px;display:flex;gap:5px;flex-wrap:wrap}
        .mtab{padding:4px 9px;border-radius:100px;font-size:9px;font-weight:700;cursor:pointer;border:1px solid;background:transparent;font-family:var(--body);transition:all 0.2s}
        .float-chip{position:absolute;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:9px 14px;font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:7px;box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;z-index:10}
        .chip-live{width:6px;height:6px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease infinite}
        .chip-top{top:-16px;left:50%;transform:translateX(-50%)}
        .chip-br{bottom:60px;right:-16px;animation:float 3.5s ease-in-out infinite}
        .chip-bl{bottom:110px;left:-20px;animation:float 4s ease-in-out 1s infinite;font-size:10px}

        /* ── STATS BAR ────────────────────── */
        .stats-bar{padding:32px 40px;background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .stats-bar-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
        .stat-item{text-align:center;padding:0 16px;position:relative}
        .stat-item:not(:last-child)::after{content:'';position:absolute;right:0;top:50%;transform:translateY(-50%);height:28px;width:1px;background:var(--border)}
        .stat-val{font-family:var(--display);font-size:clamp(26px,3vw,40px);font-weight:300;font-style:italic;line-height:1;letter-spacing:-0.03em;margin-bottom:5px}
        .stat-label{font-size:12px;color:var(--text3)}

        /* ── TICKER ───────────────────────── */
        .ticker{overflow:hidden;padding:11px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg2)}
        .ticker-track{display:flex;animation:ticker 28s linear infinite}
        .ticker-item{padding:0 24px;font-size:11px;font-weight:600;color:var(--text3);white-space:nowrap;letter-spacing:0.08em;text-transform:uppercase;display:flex;align-items:center}
        .ticker-item.hi{color:var(--accent)}
        .ticker-sep{margin:0 24px;color:var(--text3);opacity:0.3}

        /* ── PROBLEM ──────────────────────── */
        .problem{padding:120px 40px;background:var(--bg)}
        .problem-inner{max-width:1100px;margin:0 auto}
        .problem-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .section-eyebrow{font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);margin-bottom:20px}
        .section-h{font-family:var(--display);font-size:clamp(38px,4.8vw,62px);font-weight:300;line-height:1.1;letter-spacing:-0.03em;margin-bottom:20px}
        .section-h em{font-style:italic;color:var(--accent)}
        .section-body{font-size:16px;font-weight:300;color:var(--text2);line-height:1.8;max-width:440px}
        .prob-cards{display:flex;flex-direction:column;gap:12px}
        .prob-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px 22px;display:flex;align-items:center;gap:16px;transition:border-color 0.2s,transform 0.2s}
        .prob-card:hover{border-color:var(--border2);transform:translateX(4px)}
        .prob-emoji{font-size:22px;flex-shrink:0}
        .prob-label{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
        .prob-desc{font-size:12px;color:var(--text3);font-weight:300}
        .prob-x{margin-left:auto;flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(239,68,68,0.1);color:#EF4444;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}

        /* ── LIVE BUILDER DEMO ────────────── */
        .demo{padding:100px 40px;background:var(--bg2);border-top:1px solid var(--border);border-bottom:1px solid var(--border);position:relative;overflow:hidden}
        .demo-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:400px;background:radial-gradient(ellipse,rgba(110,231,183,0.06) 0%,transparent 65%);pointer-events:none;animation:glowPulse 5s ease-in-out infinite}
        .demo-inner{max-width:1000px;margin:0 auto;position:relative;z-index:1}
        .demo-header{text-align:center;margin-bottom:56px}
        .demo-layout{display:grid;grid-template-columns:1fr 1.1fr;gap:48px;align-items:start}
        .demo-left{display:flex;flex-direction:column;gap:12px;padding-top:8px}
        .demo-phase-label{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:4px}

        /* Demo input panel */
        .demo-input-panel{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden}
        .demo-input-bar{background:#0A0A0D;padding:10px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .demo-url{flex:1;background:rgba(255,255,255,0.04);border-radius:5px;padding:4px 10px;font-size:10px;color:var(--text3);font-family:monospace}
        .demo-input-body{padding:16px 18px 14px}
        .demo-input-label{font-size:10px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:var(--text3);margin-bottom:8px}
        .demo-typed-text{font-size:14px;color:var(--text);line-height:1.6;min-height:48px}
        .demo-cursor{display:inline-block;width:2px;height:14px;background:var(--accent);margin-left:1px;animation:blink 1s step-end infinite;vertical-align:text-bottom}
        .demo-generate-btn{margin-top:14px;width:100%;padding:11px;border-radius:10px;background:var(--accent);color:#060608;font-family:var(--body);font-size:13px;font-weight:700;border:none;cursor:default;transition:opacity 0.3s;letter-spacing:0.01em}

        /* Demo build steps */
        .demo-build-panel{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden}
        .demo-build-header{padding:14px 18px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px}
        .demo-build-title{font-size:12px;font-weight:600;color:var(--text2)}
        .demo-build-steps{padding:14px 18px;display:flex;flex-direction:column;gap:10px}
        .demo-step{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:400;opacity:0.3;transition:opacity 0.4s}
        .demo-step.active{opacity:1;animation:stepIn 0.35s ease both}
        .demo-step.done{opacity:1}
        .demo-step-icon{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;border:1px solid var(--border2)}
        .demo-step-icon.done-icon{background:rgba(110,231,183,0.15);border-color:rgba(110,231,183,0.3);color:var(--accent)}
        .demo-step-icon.active-icon{background:rgba(129,140,248,0.15);border-color:rgba(129,140,248,0.3)}
        .demo-step-spinner{width:8px;height:8px;border-radius:50%;border:1.5px solid rgba(129,140,248,0.3);border-top-color:var(--accent2);animation:spin 0.8s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .demo-step-label{color:var(--text2)}
        .demo-progress-bar{margin:6px 18px 16px;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
        .demo-progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:2px;transition:width 0.8s ease}

        /* Demo result preview */
        .demo-result{animation:popIn 0.5s cubic-bezier(0.16,1,0.3,1) both}
        .demo-site-frame{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
        .demo-site-nav{background:#0A0A0D;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06)}
        .demo-site-logo{font-family:var(--display);font-size:11px;font-weight:500;color:#00E5FF;letter-spacing:0.04em}
        .demo-site-links{display:flex;gap:10px}
        .demo-site-link{font-size:8px;color:#555;font-weight:500}
        .demo-site-hero{padding:18px 16px 14px;background:linear-gradient(135deg,#0a1628,#0f1f3a)}
        .demo-site-eyebrow{font-size:7px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#00E5FF;margin-bottom:6px}
        .demo-site-h1{font-family:var(--display);font-size:14px;line-height:1.25;color:white;margin-bottom:6px;font-style:italic}
        .demo-site-sub{font-size:8px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:10px}
        .demo-site-cta{display:inline-block;background:#00E5FF;color:#060608;font-size:8px;font-weight:700;padding:5px 11px;border-radius:5px;margin-right:6px}
        .demo-site-cta2{display:inline-block;border:1px solid rgba(0,229,255,0.3);color:#00E5FF;font-size:8px;font-weight:600;padding:5px 10px;border-radius:5px}
        .demo-site-services{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:12px 16px;background:var(--surface2)}
        .demo-service-card{background:rgba(255,255,255,0.04);border-radius:7px;padding:9px 8px}
        .demo-service-icon{font-size:14px;margin-bottom:4px}
        .demo-service-name{font-size:8px;font-weight:700;color:var(--text);margin-bottom:2px}
        .demo-service-desc{font-size:7px;color:#555;line-height:1.4}
        .demo-site-footer{padding:8px 16px;background:#0A0A0D;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.05)}
        .demo-site-domain{font-size:8px;color:#00E5FF;font-family:monospace}
        .demo-site-badge{font-size:7px;color:#555;display:flex;align-items:center;gap:4px}
        .demo-site-dot{width:5px;height:5px;border-radius:50%;background:#4ADE80;animation:pulse 2s ease infinite}
        .demo-chips{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
        .demo-chip{background:var(--surface);border:1px solid var(--border2);border-radius:10px;padding:6px 12px;font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:6px}

        /* ── PROCESS ──────────────────────── */
        .process{padding:120px 40px;background:var(--bg);border-top:1px solid var(--border)}
        .process-inner{max-width:1100px;margin:0 auto}
        .process-header{text-align:center;max-width:540px;margin:0 auto 72px}
        .steps{display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;align-items:stretch}
        .step{background:var(--surface);padding:44px 32px;position:relative;overflow:visible;transition:background 0.25s}
        .step:first-child{border-radius:20px 0 0 20px}
        .step:last-child{border-radius:0 20px 20px 0}
        .step:hover{background:var(--surface2)}
        .step-num{font-family:var(--display);font-size:96px;font-weight:300;position:absolute;top:-10px;right:14px;opacity:0.05;color:var(--text);user-select:none;line-height:1;pointer-events:none}
        .step-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:26px;border:1px solid var(--border2);position:relative;z-index:1}
        .step-title{font-family:var(--display);font-size:20px;font-weight:400;letter-spacing:-0.02em;margin-bottom:12px;position:relative;z-index:1;font-style:italic}
        .step-body{font-size:13px;font-weight:300;color:var(--text2);line-height:1.75;position:relative;z-index:1}
        .step-divider{display:flex;align-items:center;justify-content:center;background:var(--surface)}
        .step-divider-icon{font-size:22px;color:var(--text3)}

        /* ── COMPARE ──────────────────────── */
        .compare{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border)}
        .compare-inner{max-width:920px;margin:0 auto}
        .compare-header{text-align:center;max-width:540px;margin:0 auto 52px}
        .compare-table{width:100%;border-radius:20px;overflow:hidden;border:1px solid var(--border);border-collapse:separate;border-spacing:0}
        .compare-table th{padding:16px 22px;font-size:11px;font-weight:700;text-align:left;letter-spacing:0.05em;text-transform:uppercase;background:var(--surface2);border-bottom:1px solid var(--border2)}
        .compare-table th:first-child{color:var(--text3);width:32%}
        .compare-table th.ct-ap{color:var(--accent);background:rgba(110,231,183,0.05)}
        .compare-table th.ct-diy{color:var(--text3)}
        .compare-table th.ct-ag{color:var(--text3)}
        .compare-table td{padding:14px 22px;font-size:13px;border-bottom:1px solid var(--border);vertical-align:middle}
        .compare-table tr:last-child td{border-bottom:none}
        .compare-table td.ct-ap{background:rgba(110,231,183,0.025);color:var(--text);font-weight:500}
        .compare-table td.ct-diy,.compare-table td.ct-ag{color:var(--text3)}
        .compare-table td:first-child{color:var(--text2);font-weight:500}
        .cyes{color:var(--accent);font-weight:700}
        .cno{color:#EF4444;font-weight:700}
        .cmeh{color:var(--text3)}

        /* ── TOOLS ────────────────────────── */
        .tools{padding:120px 40px;background:var(--bg);border-top:1px solid var(--border)}
        .tools-inner{max-width:1100px;margin:0 auto}
        .tools-header{margin-bottom:52px;display:flex;justify-content:space-between;align-items:flex-end;gap:40px;flex-wrap:wrap}
        .tools-header-left{max-width:480px}
        .tools-header-right{font-size:14px;font-weight:300;color:var(--text2);max-width:280px;line-height:1.7}
        .tools-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px}
        .tool-card{background:var(--surface);padding:36px 30px 48px;position:relative;overflow:hidden;transition:background 0.25s}
        .tool-card:first-child{border-radius:20px 0 0 20px}
        .tool-card:last-child{border-radius:0 20px 20px 0}
        .tool-card:hover{background:var(--surface2)}
        .tool-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,var(--tc,transparent) 0%,transparent 50%);opacity:0;transition:opacity 0.3s}
        .tool-card:hover::before{opacity:1}
        .tool-icon-bg{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:20px;border:1px solid var(--border2);position:relative;z-index:1}
        .tool-tag{font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px;display:block;position:relative;z-index:1}
        .tool-name{font-family:var(--display);font-size:24px;font-weight:400;font-style:italic;color:var(--text);margin-bottom:10px;letter-spacing:-0.02em;position:relative;z-index:1}
        .tool-desc{font-size:13px;font-weight:300;color:var(--text3);line-height:1.65;position:relative;z-index:1}
        .tool-example{margin-top:14px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:11px;color:var(--text3);line-height:1.55;font-style:italic;position:relative;z-index:1}
        .tool-example-label{font-size:9px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;font-style:normal}

        /* ── AI IMAGES ────────────────────── */
        .ai-images{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border);position:relative;overflow:hidden}
        .ai-images-glow{position:absolute;top:-80px;right:-80px;width:600px;height:600px;pointer-events:none;background:radial-gradient(ellipse,rgba(129,140,248,0.07) 0%,transparent 65%);animation:glowPulse 5s ease-in-out infinite;border-radius:50%}
        .ai-images-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1}
        .ai-images-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
        .ai-pill{display:inline-flex;align-items:center;gap:8px;background:rgba(129,140,248,0.08);border:1px solid rgba(129,140,248,0.22);border-radius:100px;padding:6px 14px 6px 8px;font-size:12px;font-weight:600;color:var(--accent2);letter-spacing:0.04em;text-transform:uppercase;margin-bottom:24px}
        .ai-pill-icon{width:20px;height:20px;border-radius:50%;background:rgba(129,140,248,0.18);display:flex;align-items:center;justify-content:center;font-size:11px}
        .ai-h{font-family:var(--display);font-size:clamp(36px,4vw,56px);font-weight:300;line-height:1.1;letter-spacing:-0.03em;margin-bottom:18px}
        .ai-h em{font-style:italic;color:var(--accent2)}
        .ai-p{font-size:15px;font-weight:300;color:var(--text2);line-height:1.8;margin-bottom:28px;max-width:420px}
        .ai-p strong{color:var(--text);font-weight:500}
        .style-list{display:flex;flex-direction:column;gap:8px;margin-bottom:28px}
        .style-row{display:flex;align-items:center;gap:12px;padding:11px 15px;border-radius:12px;border:1px solid var(--border);background:var(--surface);cursor:pointer;transition:all 0.2s}
        .style-row.active{border-color:rgba(129,140,248,0.4);background:rgba(129,140,248,0.06)}
        .style-row:hover:not(.active){border-color:var(--border2);background:var(--surface2)}
        .style-dot{width:8px;height:8px;border-radius:50%;background:var(--border2);flex-shrink:0;transition:background 0.2s}
        .style-row.active .style-dot{background:var(--accent2)}
        .style-name{font-size:13px;font-weight:600;color:var(--text)}
        .style-desc{font-size:11px;color:var(--text3);font-weight:300;margin-left:auto}
        .use-chips{display:flex;gap:8px;flex-wrap:wrap}
        .use-chip{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:100px;border:1px solid var(--border);font-size:11px;font-weight:600;color:var(--text2);background:var(--surface)}
        .use-chip-dot{width:5px;height:5px;border-radius:50%}
        .ai-preview-wrap{position:relative}
        .ai-preview-frame{background:var(--surface);border:1px solid var(--border2);border-radius:20px;overflow:hidden;box-shadow:0 40px 80px rgba(0,0,0,0.5)}
        .ai-preview-bar{background:#0A0A0D;padding:11px 16px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(255,255,255,0.05)}
        .ai-tab{padding:5px 12px;border-radius:7px;font-size:10px;font-weight:600;color:var(--text3);font-family:var(--body)}
        .ai-tab.on{background:var(--surface2);color:var(--text)}
        .ai-preview-body{padding:20px}
        .ai-gen-image{border-radius:12px;overflow:hidden;height:190px;position:relative;margin-bottom:14px;animation:imgSwap 0.45s ease both}
        .ai-gen-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 55%)}
        .ai-gen-label{position:absolute;bottom:12px;left:14px;font-size:10px;font-weight:600;color:rgba(255,255,255,0.75);letter-spacing:0.03em}
        .ai-gen-badge{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.1);border-radius:100px;padding:3px 10px;font-size:8.5px;font-weight:700;color:white;letter-spacing:0.06em;text-transform:uppercase}
        .ai-prompt-bar{background:rgba(255,255,255,0.04);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px}
        .ai-prompt-text{font-size:11px;color:var(--text3);font-style:italic;flex:1}
        .ai-regen{font-size:10px;font-weight:700;color:var(--accent2);background:rgba(129,140,248,0.1);border:1px solid rgba(129,140,248,0.2);border-radius:6px;padding:4px 10px;cursor:pointer;font-family:var(--body);transition:background 0.2s;white-space:nowrap}
        .ai-float-chip{position:absolute;top:-14px;right:20px;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:8px 14px;font-size:11px;font-weight:600;color:var(--text);display:flex;align-items:center;gap:7px;box-shadow:0 8px 32px rgba(0,0,0,0.4);white-space:nowrap;z-index:10}

        /* ── PROOF ────────────────────────── */
        .proof{padding:120px 40px;background:var(--bg);border-top:1px solid var(--border)}
        .proof-inner{max-width:1100px;margin:0 auto}
        .proof-header{text-align:center;max-width:500px;margin:0 auto 60px}
        .proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .proof-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:32px;transition:border-color 0.2s,transform 0.2s}
        .proof-card:hover{border-color:var(--border2);transform:translateY(-3px)}
        .proof-stars{color:#F59E0B;font-size:13px;margin-bottom:14px;letter-spacing:2px}
        .proof-quote{font-family:var(--display);font-size:15px;font-style:italic;font-weight:300;color:var(--text);line-height:1.7;margin-bottom:22px;letter-spacing:-0.01em}
        .proof-person{display:flex;align-items:center;gap:10px}
        .proof-av{width:36px;height:36px;border-radius:50%;font-size:11px;font-weight:700;color:#060608;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .proof-name{font-size:13px;font-weight:600;color:var(--text)}
        .proof-role{font-size:11px;color:var(--text3);font-weight:300}
        .proof-badge{display:inline-block;margin-top:5px;font-size:10px;font-weight:700;padding:2px 9px;border-radius:100px}

        /* ── FEATURES ─────────────────────── */
        .features{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border)}
        .features-inner{max-width:1100px;margin:0 auto}
        .features-layout{display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center}
        .features-list{margin-top:40px;display:flex;flex-direction:column}
        .feat-row{padding:20px 0;border-bottom:1px solid var(--border);display:flex;gap:16px;align-items:flex-start;transition:padding-left 0.2s}
        .feat-row:first-child{border-top:1px solid var(--border)}
        .feat-row:hover{padding-left:6px}
        .feat-icon{width:36px;height:36px;border-radius:10px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
        .feat-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:2px}
        .feat-body{font-size:12px;font-weight:300;color:var(--text3);line-height:1.6}
        .metrics{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .metric{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:26px 22px;transition:border-color 0.2s,transform 0.2s}
        .metric:hover{border-color:var(--border2);transform:translateY(-2px)}
        .metric-val{font-family:var(--display);font-size:46px;font-weight:300;line-height:1;margin-bottom:8px;letter-spacing:-0.03em;font-style:italic}
        .metric-desc{font-size:12px;font-weight:300;color:var(--text3);line-height:1.5}

        /* ── PRICING ──────────────────────── */
        .pricing{padding:120px 40px;background:var(--bg);border-top:1px solid var(--border)}
        .pricing-inner{max-width:720px;margin:0 auto}
        .pricing-header{text-align:center;margin-bottom:60px}
        .pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .price-card{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:40px 34px;position:relative}
        .price-card-featured{background:var(--surface2);border-color:rgba(110,231,183,0.3);box-shadow:0 0 80px rgba(110,231,183,0.07),0 20px 60px rgba(0,0,0,0.4)}
        .price-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#060608;font-size:9px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 16px;border-radius:100px;white-space:nowrap}
        .price-tier{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text3);margin-bottom:18px}
        .price-amount{font-family:var(--display);font-size:60px;font-weight:300;line-height:1;margin-bottom:5px;font-style:italic;letter-spacing:-0.03em}
        .price-sub{font-size:13px;color:var(--text3);font-weight:300;margin-bottom:28px}
        .price-feats{display:flex;flex-direction:column;gap:9px}
        .pf{display:flex;align-items:center;gap:10px;font-size:13px;font-weight:300}
        .pf-on{color:var(--text)}.pf-off{color:var(--text3)}
        .pfc{width:18px;height:18px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700}
        .pfc-y{background:rgba(110,231,183,0.15);color:var(--accent)}
        .pfc-n{background:var(--surface);color:var(--text3)}
        .price-cta{display:block;margin-top:32px;padding:14px;border-radius:12px;text-align:center;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:0.02em;border:1px solid;transition:all 0.2s;font-family:var(--body);cursor:pointer}
        .price-cta-outline{border-color:var(--border2);color:var(--text2);background:transparent}
        .price-cta-outline:hover{background:var(--surface2);color:var(--text)}
        .price-cta-filled{background:var(--accent);color:#060608;border-color:var(--accent)}
        .price-cta-filled:hover{filter:brightness(1.1);transform:translateY(-1px);box-shadow:0 6px 20px rgba(110,231,183,0.35)}
        .price-guarantee{text-align:center;margin-top:28px;font-size:12px;color:var(--text3)}
        .price-guarantee strong{color:var(--text2)}

        /* ── FAQ ──────────────────────────── */
        .faq{padding:120px 40px;background:var(--bg2);border-top:1px solid var(--border)}
        .faq-inner{max-width:640px;margin:0 auto}
        .faq-title{text-align:center;margin-bottom:60px}
        .faq-item{border-bottom:1px solid var(--border)}
        .faq-btn{width:100%;background:none;border:none;padding:22px 0;display:flex;justify-content:space-between;align-items:center;cursor:pointer;text-align:left;font-size:15px;font-weight:500;color:var(--text);font-family:var(--body);gap:20px;letter-spacing:-0.01em}
        .faq-icon{font-size:20px;color:var(--text3);transition:transform 0.3s;flex-shrink:0}
        .faq-icon.open{transform:rotate(45deg);color:var(--accent)}
        .faq-body{overflow:hidden;max-height:0;opacity:0;transition:max-height 0.35s ease,opacity 0.3s,padding 0.3s;font-size:14px;font-weight:300;color:var(--text2);line-height:1.8}
        .faq-body.open{max-height:320px;opacity:1;padding-bottom:22px}

        /* ── FINAL CTA ────────────────────── */
        .final{padding:140px 40px;background:var(--bg);position:relative;overflow:hidden;border-top:1px solid var(--border)}
        .final-glow{position:absolute;bottom:-200px;left:50%;transform:translateX(-50%);width:900px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(110,231,183,0.1) 0%,transparent 65%);pointer-events:none;animation:glowPulse 5s ease-in-out infinite}
        .final-inner{max-width:600px;margin:0 auto;text-align:center;position:relative;z-index:1}
        .final-h{font-family:var(--display);font-size:clamp(40px,6.5vw,84px);font-weight:300;line-height:1.0;letter-spacing:-0.03em;color:var(--text);margin-bottom:22px}
        .final-h em{font-style:italic;color:var(--accent)}
        .final-sub{font-size:17px;font-weight:300;color:var(--text2);line-height:1.75;margin-bottom:44px}
        .final-btn{display:inline-block;background:var(--accent);color:#060608;text-decoration:none;font-family:var(--body);font-size:16px;font-weight:700;padding:18px 44px;border-radius:14px;transition:filter 0.2s,transform 0.15s,box-shadow 0.2s;letter-spacing:-0.01em;margin-bottom:20px}
        .final-btn:hover{filter:brightness(1.1);transform:translateY(-2px);box-shadow:0 8px 32px rgba(110,231,183,0.35)}
        .final-trust{display:flex;justify-content:center;gap:20px;flex-wrap:wrap;font-size:12px;color:var(--text3)}
        .final-trust span::before{content:'\\2713 ';color:var(--accent)}

        /* ── FOOTER ───────────────────────── */
        .footer{background:#030304;border-top:1px solid var(--border);padding:40px}
        .footer-inner{max-width:1100px;margin:0 auto}
        .footer-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:32px;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border)}
        .footer-brand{max-width:240px}
        .footer-logo{font-family:var(--display);font-size:20px;color:var(--text2);text-decoration:none;font-weight:300;font-style:italic;display:flex;align-items:center;gap:8px;margin-bottom:10px}
        .footer-tagline{font-size:13px;color:var(--text3);font-weight:300;line-height:1.6}
        .footer-cols{display:flex;gap:48px;flex-wrap:wrap}
        .footer-col{display:flex;flex-direction:column;gap:9px}
        .footer-col-title{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--text3);margin-bottom:3px}
        .footer-link{font-size:13px;color:var(--text3);text-decoration:none;transition:color 0.2s;font-weight:300}
        .footer-link:hover{color:var(--text2)}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
        .footer-copy{font-size:12px;color:var(--text3);font-weight:300}

        /* ── RESPONSIVE ───────────────────── */
        @media(max-width:900px){
          .nav{padding:0 20px}.nav-center,.nav-signin{display:none}
          .nav-hamburger{display:flex}
          .hero{padding:90px 20px 60px}
          .hero-inner{grid-template-columns:1fr;gap:48px}
          .stats-bar{padding:24px 20px}
          .stats-bar-inner{grid-template-columns:1fr 1fr;gap:20px}
          .stat-item:nth-child(2)::after{display:none}
          .problem{padding:80px 20px}.problem-layout{grid-template-columns:1fr;gap:40px}
          .demo{padding:60px 20px}.demo-layout{grid-template-columns:1fr;gap:28px}
          .process{padding:80px 20px}
          .steps{grid-template-columns:1fr}
          .step:first-child{border-radius:20px 20px 0 0}
          .step:last-child{border-radius:0 0 20px 20px}
          .step-divider{display:none}
          .compare{padding:80px 20px}
          .tools{padding:80px 20px}.tools-header{flex-direction:column}
          .tools-grid{grid-template-columns:1fr}
          .tool-card:first-child{border-radius:20px 20px 0 0}
          .tool-card:last-child{border-radius:0 0 20px 20px}
          .ai-images{padding:80px 20px}.ai-images-layout{grid-template-columns:1fr;gap:48px}
          .proof{padding:80px 20px}.proof-grid{grid-template-columns:1fr}
          .features{padding:80px 20px}.features-layout{grid-template-columns:1fr;gap:48px}
          .pricing{padding:80px 20px}.pricing-grid{grid-template-columns:1fr}
          .faq{padding:80px 20px}
          .final{padding:100px 20px}
          .footer{padding:32px 20px}.footer-top{flex-direction:column}
        }
        @media(max-width:560px){
          .metrics{grid-template-columns:1fr 1fr}
          .compare-table th:nth-child(4),.compare-table td:nth-child(4){display:none}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo"><div className="logo-dot" />AutopilotAI</a>
        <div className="nav-center">
          <a href="/features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
        </div>
        <div className="nav-right">
          <a href="/login" className="nav-signin">Sign in</a>
          <a href="/register" className="nav-cta">Start free →</a>
          <button className="nav-hamburger" onClick={() => setMobileMenuOpen(p => !p)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <a href="/features" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
        <a href="#pricing" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="#how-it-works" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <a href="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Sign in</a>
        <a href="/register" className="mobile-cta">Start building free →</a>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-glow" /><div className="hero-grid-bg" />
        <div className="hero-inner">
          <div>
            <div className={mounted ? "fu1" : "preinit"}>
              <div className="hero-eyebrow"><span className="eyebrow-dot" />AI Website Builder for Local Business</div>
            </div>
            <div className={mounted ? "fu2" : "preinit"}>
              <h1 className="hero-h1">
                Get online today.<br />
                <em>Get customers</em><br />
                <span className="dim">tomorrow.</span>
              </h1>
            </div>
            <div className={mounted ? "fu3" : "preinit"}>
              <p className="hero-sub">
                Type two sentences about your business. AutopilotAI writes your copy, designs your layout, and builds a <strong>professional, SEO-ready website</strong> — with lead capture, a custom domain, and marketing tools — in under 60 seconds.
              </p>
            </div>
            <div className={mounted ? "fu4" : "preinit"}>
              <div className="hero-price-row">
                <span className="price-pill">Free to build</span>
                <span>· $10/month to publish · Cancel anytime</span>
              </div>
              <div className="build-wrap">
                <input ref={inputRef} className="build-input" value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleBuild()}
                  placeholder="type here" />
                <div className="build-bottom">
                  {inputVal === "" ? (
                    <div className="build-placeholder">{typedText}<span className="cursor-blink">|</span></div>
                  ) : <div style={{ flex: 1 }} />}
                  <button className="build-btn" onClick={handleBuild}>Build my site free →</button>
                </div>
              </div>
              <div className="hero-trust">
                <span><span className="trust-check">✓</span>No credit card needed</span>
                <span><span className="trust-check">✓</span>No design skills required</span>
                <span><span className="trust-check">✓</span>14-day free trial on paid plan</span>
              </div>
              <div className="social-row">
                <div className="avs">
                  {[["LM","#6EE7B7"],["DK","#818CF8"],["RS","#F472B6"],["JP","#FB923C"],["AW","#4ADE80"]].map(([i,c],idx)=>(
                    <div key={idx} className="av" style={{background:c}}>{i}</div>
                  ))}
                </div>
                <div>
                  <div className="social-text">Trusted by 2,800+ local businesses</div>
                  <div className="social-stars">★★★★★ 4.9 / 5 from 340+ reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`mockup-col ${mounted ? "fu5" : "preinit"}`}>
            <div className="float-chip chip-top"><span className="chip-live" />AI generating live</div>
            <div className="mockup-frame">
              <div className="mbar">
                <div className="mdots">{["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} className="mdot" style={{background:c}}/>)}</div>
                <div className="murl"><span className="murl-lock">🔒</span>
                  <span className="murl-text" key={activeBiz} style={{animation:"slideIn 0.4s ease both"}}>{biz.domain}.com</span>
                </div>
              </div>
              <div className="mbody">
                {BUSINESSES.map((b,i)=>(
                  <div key={i} className="mslide" style={{opacity:activeBiz===i?1:0,transform:activeBiz===i?"none":"scale(0.97)",pointerEvents:activeBiz===i?"auto":"none"}}>
                    <div className="mcard" style={{background:`linear-gradient(135deg,${b.color}14,${b.color}05)`,borderLeft:`3px solid ${b.color}`}}>
                      <div className="mcard-eye" style={{color:b.color}}>{b.icon} {b.type} · {b.city}</div>
                      <div className="mcard-title">The Most Trusted {b.type} in {b.city} — <em style={{color:b.color}}>Guaranteed.</em></div>
                      <div className="mcard-body">Licensed & insured. 5-star rated. Serving {b.city} since 2019.</div>
                      <div className="mcard-ctas">
                        <div className="mcta-main" style={{background:b.color}}>Get Free Quote</div>
                        <div className="mcta-ghost" style={{borderColor:`${b.color}50`,color:b.color}}>See Our Work</div>
                      </div>
                    </div>
                    <div className="mfeats">{["✅ Licensed","⭐ 5-Star","⚡ Same Day"].map((f,fi)=><div key={fi} className="mfeat"><div className="mfeat-text">{f}</div></div>)}</div>
                  </div>
                ))}
              </div>
              <div className="mtabs">
                {BUSINESSES.map((b,i)=>(
                  <button key={i} className="mtab" onClick={()=>setActiveBiz(i)} style={{borderColor:activeBiz===i?b.color:"rgba(255,255,255,0.08)",background:activeBiz===i?`${b.color}18`:"transparent",color:activeBiz===i?b.color:"var(--text3)"}}>
                    {b.icon} {b.type}
                  </button>
                ))}
              </div>
            </div>
            <div className="float-chip chip-br">⚡ Built in {biz.time}</div>
            <div className="float-chip chip-bl">🔒 <span style={{color:"var(--text3)"}}>SEO ready</span></div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="stats-bar">
        <div className="stats-bar-inner">
          {[
            {val:"2,800+",label:"local businesses launched",color:"var(--accent)"},
            {val:"< 60s",label:"average build time",color:"var(--accent2)"},
            {val:"$10",label:"per month to go live",color:"var(--accent3)"},
            {val:"4.9★",label:"from 340+ verified reviews",color:"#FB923C"},
          ].map((s,i)=>(
            <div key={i} className="stat-item">
              <div className="stat-val" style={{color:s.color}}>{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div style={{overflow:"hidden"}}>
          <div className="ticker-track">
            {["Professional website in 60 seconds","Custom copy written by AI","$10/month — publish with your own domain","No code. No designer. No waiting","Lead capture forms included","SEO-optimized from day one","Mobile-perfect on every device","14-day free trial","Professional website in 60 seconds","Custom copy written by AI","$10/month — publish with your own domain","No code. No designer. No waiting","Lead capture forms included","SEO-optimized from day one","Mobile-perfect on every device","14-day free trial"].map((t,i)=>(
              <div key={i} className={`ticker-item ${i%4===0?"hi":""}`}>{t}<span className="ticker-sep">◆</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROBLEM ── */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-layout">
            <div>
              <div className="section-eyebrow">The real problem</div>
              <h2 className="section-h">Every day without<br />a website is a day<br /><em>you lose customers.</em></h2>
              <p className="section-body">
                Someone Googled your exact service in your exact city today. If you don't have a professional website, they called your competitor instead.<br /><br />
                You know you need one. The problem is every option either costs a fortune, takes forever, or makes you feel like a graphic designer — which you're not.
              </p>
            </div>
            <div className="prob-cards">
              {[
                {icon:"😩",label:"Squarespace / Wix",desc:"You spend a full weekend tweaking. Monday morning it still looks like a free template from 2014."},
                {icon:"💸",label:"Hire a web agency",desc:"Quote comes back: $7,500 upfront, 8-week timeline, and oh — copywriting is $800 extra."},
                {icon:"😅",label:"Learn to code",desc:"You opened VS Code. You watched 4 minutes of a YouTube tutorial. You closed the tab."},
                {icon:"🙈",label:"Do nothing",desc:"Three people Googled your exact service in your city yesterday. They called someone with a website."},
              ].map((p,i)=>(
                <div key={i} className="prob-card">
                  <div className="prob-emoji">{p.icon}</div>
                  <div><div className="prob-label">{p.label}</div><div className="prob-desc">{p.desc}</div></div>
                  <div className="prob-x">✕</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE BUILDER DEMO ── */}
      <section className="demo">
        <div className="demo-glow" />
        <div className="demo-inner">
          <div className="demo-header">
            <div className="section-eyebrow" style={{textAlign:"center"}}>Watch it happen</div>
            <h2 className="section-h" style={{textAlign:"center",fontSize:"clamp(34px,4.5vw,54px)"}}>
              Describe your business.<br /><em>Get a full website.</em>
            </h2>
            <p style={{fontSize:15,fontWeight:300,color:"var(--text2)",lineHeight:1.75,maxWidth:460,margin:"14px auto 0",textAlign:"center"}}>
              This is exactly what happens when you sign up. No templates. No drag-and-drop. Just type — and watch AutopilotAI build the whole thing.
            </p>
          </div>

          <div className="demo-layout">
            {/* Left column — input + build steps */}
            <div className="demo-left">
              {/* Input panel */}
              <div>
                <div className="demo-phase-label">
                  {demoPhase === "typing" ? "Step 1 — Describe your business" :
                   demoPhase === "building" ? "Step 2 — AI building your site" :
                   "Step 3 — Your site is ready"}
                </div>
                <div className="demo-input-panel">
                  <div className="demo-input-bar">
                    <div style={{display:"flex",gap:4}}>
                      {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:c}}/>)}
                    </div>
                    <div className="demo-url">autopilotai.dev/generate</div>
                  </div>
                  <div className="demo-input-body">
                    <div className="demo-input-label">Describe your business</div>
                    <div className="demo-typed-text">
                      {demoPhase === "typing"
                        ? <>{DEMO_PROMPT.slice(0, demoCharIdx)}{demoCharIdx < DEMO_PROMPT.length && <span className="demo-cursor" />}</>
                        : <>{DEMO_PROMPT}</>
                      }
                    </div>
                    <div className="demo-generate-btn"
                      style={{opacity: demoPhase === "typing" && demoCharIdx < DEMO_PROMPT.length ? 0.3 : 1}}>
                      {demoPhase === "building" ? "Building your website…" :
                       demoPhase === "done" ? "✓ Website ready — view it live" :
                       demoCharIdx >= DEMO_PROMPT.length ? "Generate my website →" : "Waiting for input…"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Build steps — only shown in building/done phase */}
              {demoPhase !== "typing" && (
                <div className="demo-build-panel" style={{animation:"fadeUp 0.4s ease both"}}>
                  <div className="demo-build-header">
                    <div style={{width:6,height:6,borderRadius:"50%",background:demoPhase==="done"?"#4ADE80":"var(--accent2)",animation:"pulse 2s ease infinite"}}/>
                    <div className="demo-build-title">
                      {demoPhase === "building" ? `Building… (${demoStepsDone}/${DEMO_STEPS.length} steps)` : "Build complete ✓"}
                    </div>
                  </div>
                  <div className="demo-progress-bar">
                    <div className="demo-progress-fill"
                      style={{width:`${demoPhase==="done" ? 100 : (demoStepsDone / DEMO_STEPS.length) * 100}%`}}/>
                  </div>
                  <div className="demo-build-steps">
                    {DEMO_STEPS.map((step, i) => {
                      const isDone = i < demoStepsDone;
                      const isActive = i === demoStepsDone && demoPhase === "building";
                      return (
                        <div key={i} className={`demo-step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
                          <div className={`demo-step-icon ${isDone ? "done-icon" : isActive ? "active-icon" : ""}`}>
                            {isDone ? "✓" : isActive ? <div className="demo-step-spinner" /> : <span style={{fontSize:8,color:"var(--text3)"}}>{i+1}</span>}
                          </div>
                          <span className="demo-step-label" style={{color: isDone || isActive ? "var(--text)" : "var(--text3)"}}>{step}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Chips on done */}
              {demoPhase === "done" && (
                <div className="demo-chips" style={{animation:"fadeUp 0.5s 0.2s ease both"}}>
                  <div className="demo-chip"><span className="chip-live"/>Live at denverplumbingpro.com</div>
                  <div className="demo-chip"><span style={{color:"var(--accent)"}}>✓</span>SEO optimized</div>
                  <div className="demo-chip"><span style={{color:"var(--accent2)"}}>✓</span>Mobile ready</div>
                </div>
              )}
            </div>

            {/* Right column — result preview */}
            <div>
              {demoPhase === "done" ? (
                <div className="demo-result">
                  <div className="demo-site-frame">
                    <div className="demo-site-nav">
                      <div className="demo-site-logo">🔧 DENVER PLUMBING PRO</div>
                      <div className="demo-site-links">
                        {["Services","About","Reviews","Contact"].map(l=><span key={l} className="demo-site-link">{l}</span>)}
                      </div>
                    </div>
                    <div className="demo-site-hero">
                      <div className="demo-site-eyebrow">📍 Denver, CO · Licensed & Insured</div>
                      <div className="demo-site-h1">Denver's Most Trusted Plumber — Available 24/7 for Emergencies.</div>
                      <div className="demo-site-sub">5-star rated. Serving Denver since 2019. Same-day service for residential and commercial jobs. No hidden fees — ever.</div>
                      <div>
                        <span className="demo-site-cta">Get a Free Quote</span>
                        <span className="demo-site-cta2">Call Now</span>
                      </div>
                    </div>
                    <div className="demo-site-services">
                      {[
                        {icon:"🚿",name:"Emergency Repairs",desc:"Burst pipes, leaks, clogs — 24/7 response"},
                        {icon:"🔥",name:"Water Heater Install",desc:"Gas & electric, same-day available"},
                        {icon:"🪠",name:"Drain Cleaning",desc:"Snaking & hydro-jetting, no mess"},
                      ].map((s,i)=>(
                        <div key={i} className="demo-service-card">
                          <div className="demo-service-icon">{s.icon}</div>
                          <div className="demo-service-name">{s.name}</div>
                          <div className="demo-service-desc">{s.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div className="demo-site-footer">
                      <div className="demo-site-domain">denverplumbingpro.com</div>
                      <div className="demo-site-badge"><div className="demo-site-dot"/>Live · SEO indexed</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Placeholder while building */
                <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,height:340,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
                  {demoPhase === "building" ? (
                    <>
                      <div style={{width:40,height:40,borderRadius:"50%",border:"2.5px solid var(--border2)",borderTop:"2.5px solid var(--accent)",animation:"spin 1s linear infinite"}}/>
                      <div style={{fontSize:13,color:"var(--text3)",fontWeight:400}}>Generating your website…</div>
                    </>
                  ) : (
                    <>
                      <div style={{fontSize:28,marginBottom:4}}>✍️</div>
                      <div style={{fontSize:13,color:"var(--text3)"}}>Website preview appears here</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="process" id="how-it-works">
        <div className="process-inner">
          <div className="process-header">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-h" style={{textAlign:"center",fontSize:"clamp(36px,4.5vw,56px)"}}>Sixty seconds of typing.<br /><em>A website that converts.</em></h2>
            <p className="section-body" style={{textAlign:"center",maxWidth:420,margin:"14px auto 0"}}>No design experience. No agency brief. No waiting. Just describe your business and go.</p>
          </div>
          <div className="steps">
            {[
              {n:"01",icon:"✍️",bg:"rgba(110,231,183,0.1)",title:"Describe your business",
               body:"Two sentences. Your type of business, your city, what makes you different. AutopilotAI reads it and figures everything else out — no brief, no 12-page questionnaire, no onboarding call."},
              {n:"02",icon:"🤖",bg:"rgba(129,140,248,0.1)",title:"AI builds the whole thing",
               body:"Your headline. Your services. Your trust badges. A contact form. SEO meta tags. Mobile layout. All written specifically for your industry and location — not copy-pasted from a template."},
              {n:"03",icon:"🚀",bg:"rgba(244,114,182,0.1)",title:"Edit anything, publish, get found",
               body:"Click any word to change it. Swap a photo. Reorder sections. Then hit publish — your site goes live on your own domain. Real customers in your city start finding you the same day."},
            ].map((s,i,arr)=>[
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-icon" style={{background:s.bg}}>{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>,
              i < arr.length-1 && <div key={`d${i}`} className="step-divider"><span className="step-divider-icon">›</span></div>
            ])}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="compare">
        <div className="compare-inner">
          <div className="compare-header">
            <div className="section-eyebrow">Why AutopilotAI</div>
            <h2 className="section-h" style={{textAlign:"center",fontSize:"clamp(34px,4.5vw,54px)"}}>
              How we stack up<br /><em>against every alternative.</em>
            </h2>
          </div>
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th className="ct-ap">AutopilotAI</th>
                <th className="ct-diy">DIY Builders</th>
                <th className="ct-ag">Web Agency</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row,i)=>(
                <tr key={i}>
                  <td>{row.feature}</td>
                  <td className="ct-ap">
                    {row.autopilot===true ? <span className="cyes">✓ Yes</span> : <span style={{color:"var(--accent)",fontWeight:500}}>{row.autopilot}</span>}
                  </td>
                  <td className="ct-diy">
                    {row.diy===true ? <span className="cyes" style={{color:"var(--text3)"}}>✓</span> : row.diy===false ? <span className="cno">✕ No</span> : <span className="cmeh">{row.diy}</span>}
                  </td>
                  <td className="ct-ag">
                    {row.agency===true ? <span className="cyes" style={{color:"var(--text3)"}}>✓</span> : row.agency===false ? <span className="cno">✕ No</span> : <span className="cmeh">{row.agency}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{textAlign:"center",marginTop:36}}>
            <a href="/register" style={{display:"inline-block",background:"var(--accent)",color:"#060608",fontFamily:"var(--body)",fontSize:14,fontWeight:700,padding:"13px 30px",borderRadius:12,textDecoration:"none"}}>
              Start building free →
            </a>
            <div style={{fontSize:12,color:"var(--text3)",marginTop:10}}>No credit card · No setup fee · Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section className="tools">
        <div className="tools-inner">
          <div className="tools-header">
            <div className="tools-header-left">
              <div className="section-eyebrow">More than a website</div>
              <h2 className="section-h">Keep the phone<br /><em>ringing.</em></h2>
            </div>
            <p className="tools-header-right">Your website gets you found. These three tools keep customers coming back — and turn cold leads into booked jobs. All included in every plan.</p>
          </div>
          <div className="tools-grid">
            {[
              {icon:"✉️",tag:"Email AI",name:"Email Campaigns",
               desc:"Write a 5-email welcome sequence in 30 seconds. Follow-up campaigns, re-engagement flows, monthly newsletters — all in your voice, not a robot's.",
               example:"Generated: Subject line options for a follow-up email to leads who didn't book. 7 variants. Ready to send.",
               color:"#6EE7B7",bg:"rgba(110,231,183,0.1)"},
              {icon:"📣",tag:"Ad Copy AI",name:"Ad Copy",
               desc:"Describe your offer. Get 10 Facebook headlines, 5 Google ad descriptions, and a full Instagram caption — split-test ready — in under 60 seconds.",
               example:"Generated: \"Denver's fastest plumber. Licensed & insured. Get a free quote in 2 minutes.\" — 9 more variants ready.",
               color:"#818CF8",bg:"rgba(129,140,248,0.1)"},
              {icon:"✏️",tag:"Content AI",name:"Content Writer",
               desc:"A 1,200-word blog post that ranks on Google. Service page copy. Social captions with hooks. Plus a matching AI-generated image — all in 30 seconds.",
               example:"Generated: \"5 Signs Your Denver Home Needs Emergency Plumbing (Before It's Too Late)\" — 1,247 words, SEO-optimized.",
               color:"#F472B6",bg:"rgba(244,114,182,0.1)"},
            ].map((tool,i)=>(
              <div key={i} className="tool-card" style={{"--tc":`${tool.color}12`} as any}>
                <div className="tool-icon-bg" style={{background:tool.bg}}>{tool.icon}</div>
                <span className="tool-tag" style={{color:tool.color}}>{tool.tag}</span>
                <div className="tool-name">{tool.name}</div>
                <p className="tool-desc">{tool.desc}</p>
                <div className="tool-example">
                  <div className="tool-example-label" style={{color:tool.color}}>Example output</div>
                  {tool.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI IMAGES ── */}
      <section className="ai-images">
        <div className="ai-images-glow" />
        <div className="ai-images-inner">
          <div className="ai-images-layout">
            <div>
              <div className="ai-pill">
                <div className="ai-pill-icon">✦</div>
                AI Image Generation
              </div>
              <h2 className="ai-h">Stop paying $50 a post<br />for ad creatives.<br /><em>Generate them yourself.</em></h2>
              <p className="ai-p">
                Every email, ad, or blog post you create in AutopilotAI can ship with a <strong>matching professional image</strong> — generated in one click. Five visual styles. No Canva subscription. No Photoshop. No freelancer.
              </p>
              <div className="style-list">
                {IMAGE_STYLES.map((s,i)=>(
                  <div key={i} className={`style-row ${activeStyle===i?"active":""}`} onClick={()=>setActiveStyle(i)}>
                    <div className="style-dot"/>
                    <span className="style-name">{s.name}</span>
                    <span className="style-desc">{s.desc}</span>
                  </div>
                ))}
              </div>
              <div className="use-chips">
                {[["Facebook Ads","#818CF8"],["Instagram Posts","#F472B6"],["Blog Headers","#6EE7B7"],["Google Ads","#FB923C"],["LinkedIn","#38BDF8"]].map(([label,color],i)=>(
                  <div key={i} className="use-chip"><div className="use-chip-dot" style={{background:color}}/>{label}</div>
                ))}
              </div>
            </div>
            <div className="ai-preview-wrap">
              <div className="ai-float-chip"><span style={{color:"var(--accent2)"}}>✦</span>AutopilotAI Imaging</div>
              <div className="ai-preview-frame">
                <div className="ai-preview-bar">
                  {["Content","Emails","Ads"].map((t,i)=>(
                    <div key={i} className={`ai-tab ${i===0?"on":""}`}>{t}</div>
                  ))}
                  <div style={{marginLeft:"auto",fontSize:10,color:"var(--text3)",display:"flex",alignItems:"center",gap:5}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80",display:"inline-block"}}/>Generate image
                  </div>
                </div>
                <div className="ai-preview-body">
                  <div className="ai-gen-image" key={activeStyle} style={{background:style.bg}}>
                    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {activeStyle===0&&<div style={{textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>🔧</div><div style={{fontSize:12,fontWeight:700,color:"#00E5FF",letterSpacing:"0.06em"}}>DENVER PLUMBING CO.</div><div style={{fontSize:9,color:"rgba(255,255,255,0.45)",marginTop:4}}>Available 24/7 · Licensed & Insured</div></div>}
                      {activeStyle===1&&<div style={{textAlign:"center"}}><div style={{fontSize:10,letterSpacing:"0.2em",color:"#E94560",textTransform:"uppercase",marginBottom:8}}>Instagram Reel</div><div style={{fontSize:18,fontWeight:700,color:"white",fontFamily:"Georgia,serif",fontStyle:"italic"}}>Transform your space.</div><div style={{width:40,height:2,background:"#E94560",margin:"10px auto"}}/></div>}
                      {activeStyle===2&&<div style={{textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:"rgba(110,231,183,0.2)",border:"2px solid #6EE7B7",margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>✦</div><div style={{fontSize:13,color:"#333",fontWeight:600}}>Minimal Blog Header</div></div>}
                      {activeStyle===3&&<div style={{textAlign:"center"}}><div style={{fontSize:10,fontWeight:800,letterSpacing:"0.2em",color:"#ff6b35",textTransform:"uppercase"}}>LIMITED OFFER</div><div style={{fontSize:22,fontWeight:900,color:"white",marginTop:6,lineHeight:1.1}}>50% OFF<br/>TODAY ONLY</div></div>}
                      {activeStyle===4&&<div style={{textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>📦</div><div style={{fontSize:11,fontWeight:600,color:"#c9a84c",letterSpacing:"0.1em",textTransform:"uppercase"}}>Premium Product</div><div style={{fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:4}}>Studio lighting · Hero shot</div></div>}
                    </div>
                    <div className="ai-gen-overlay"/>
                    <div className="ai-gen-label">Generated for your business</div>
                    <div className="ai-gen-badge">{style.name}</div>
                  </div>
                  <div className="ai-prompt-bar">
                    <span style={{fontSize:14,flexShrink:0}}>✦</span>
                    <div className="ai-prompt-text">"{style.name.toLowerCase()} image for a local business ad…"</div>
                    <button className="ai-regen">Regenerate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="proof">
        <div className="proof-inner">
          <div className="proof-header">
            <div className="section-eyebrow">Real results</div>
            <h2 className="section-h">Real business owners.<br /><em>Real results.</em></h2>
            <p style={{fontSize:13,color:"var(--text3)",marginTop:10,fontWeight:300}}>4.9 average from 340+ verified reviews</p>
          </div>
          <div className="proof-grid">
            {[
              {quote:"I went from zero online presence to getting 3 new plumbing jobs in the first week. The site looked more professional than ones my competitors paid thousands for. My wife thought I hired a designer.",
               name:"Marcus T.",role:"Plumber · Denver, CO",initials:"MT",color:"#6EE7B7",
               badge:"3 new jobs in week one",badgeBg:"rgba(110,231,183,0.12)",badgeColor:"#6EE7B7"},
              {quote:"I spent three days fighting Squarespace and still hated the result. AutopilotAI gave me something better in under five minutes. That's not an exaggeration. I'm embarrassed I waited so long.",
               name:"Sarah K.",role:"Yoga studio owner · Austin, TX",initials:"SK",color:"#818CF8",
               badge:"3 days → 5 minutes",badgeBg:"rgba(129,140,248,0.12)",badgeColor:"#818CF8"},
              {quote:"Sent the link to a corporate prospect on Monday. They signed the contract on Wednesday. One deal paid for two years of the subscription. I've recommended it to six other freelancers since.",
               name:"Rachel S.",role:"Freelance designer · San Francisco, CA",initials:"RS",color:"#F472B6",
               badge:"ROI in 48 hours",badgeBg:"rgba(244,114,182,0.12)",badgeColor:"#F472B6"},
            ].map((t,i)=>(
              <div key={i} className="proof-card">
                <div className="proof-stars">★★★★★</div>
                <p className="proof-quote">"{t.quote}"</p>
                <div className="proof-person">
                  <div className="proof-av" style={{background:t.color}}>{t.initials}</div>
                  <div>
                    <div className="proof-name">{t.name}</div>
                    <div className="proof-role">{t.role}</div>
                    <div className="proof-badge" style={{background:t.badgeBg,color:t.badgeColor}}>{t.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features">
        <div className="features-inner">
          <div className="features-layout">
            <div>
              <div className="section-eyebrow">Everything included</div>
              <h2 className="section-h">One tool.<br /><em>No plugins.</em><br />No surprises.</h2>
              <p className="section-body" style={{marginTop:16}}>
                This isn't a stripped-down starter that upsells you into oblivion. Everything you need to get clients online is already in your dashboard from day one.
              </p>
              <div className="features-list">
                {[
                  {icon:"✏️",title:"Click-to-edit everything",body:"Change any text, image, color, or section with a single click. Or re-describe and regenerate the whole site in seconds."},
                  {icon:"📬",title:"Lead capture forms built in",body:"Every site includes a contact form that sends enquiries straight to your inbox. No Mailchimp. No plugin. No setup."},
                  {icon:"🌐",title:"Your own custom domain",body:"A real domain like yourbusiness.com — not a branded subdomain that signals 'I used a free tool.'"},
                  {icon:"🖼️",title:"AI image generation (5 styles)",body:"Instantly create ad creatives, blog headers, and social posts in five professional visual styles. All included."},
                  {icon:"📊",title:"Built-in visitor analytics",body:"See how many people visit, which pages they hit, and where your leads come from — no Google Analytics setup required."},
                  {icon:"📱",title:"Guaranteed mobile-perfect",body:"Every single generated site is 100% responsive on every screen size — on the first generation, every time."},
                ].map((f,i)=>(
                  <div key={i} className="feat-row">
                    <div className="feat-icon">{f.icon}</div>
                    <div><div className="feat-title">{f.title}</div><div className="feat-body">{f.body}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="metrics">
              {[
                {val:"60s",label:"Median time from blank page to live website preview",color:"var(--accent)"},
                {val:"$10",label:"Per month to publish on your own custom domain",color:"var(--accent2)"},
                {val:"5",label:"Professional AI image styles included — not sold separately",color:"var(--accent3)"},
                {val:"4.9★",label:"Verified customer satisfaction from 340+ real reviews",color:"#FB923C"},
              ].map((m,i)=>(
                <div key={i} className="metric">
                  <div className="metric-val" style={{color:m.color}}>{m.val}</div>
                  <div className="metric-desc">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing" id="pricing">
        <div className="pricing-inner">
          <div className="pricing-header">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-h" style={{textAlign:"center"}}>Simple pricing.<br /><em>No surprises.</em></h2>
            <p className="section-body" style={{textAlign:"center",margin:"14px auto 0",maxWidth:380}}>Build and preview everything for free. Only pay when you're ready to go live with your own domain.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free forever</div>
              <div className="price-amount">$0</div>
              <div className="price-sub">Build & explore — no card needed, ever</div>
              <div className="price-feats">
                {([[true,"Build 1 website"],[true,"Unlimited edits"],[true,"10 AI generations"],[true,"Mobile responsive preview"],[false,"Publish publicly"],[false,"Custom domain"],[false,"AI image generation"],[false,"Analytics & lead capture"]] as [boolean,string][]).map(([y,l],i)=>(
                  <div key={i} className={`pf ${y?"pf-on":"pf-off"}`}><div className={`pfc ${y?"pfc-y":"pfc-n"}`}>{y?"✓":"✕"}</div>{l}</div>
                ))}
              </div>
              <a href="/register" className="price-cta price-cta-outline">Start building free</a>
            </div>
            <div className="price-card price-card-featured">
              <div className="price-badge">Most popular</div>
              <div className="price-tier">Starter</div>
              <div className="price-amount" style={{color:"var(--accent)"}}>$10<span style={{fontSize:20,color:"var(--text3)"}}>/mo</span></div>
              <div className="price-sub">14-day free trial · Cancel anytime</div>
              <div className="price-feats">
                {["Publish your website publicly","Custom domain included","Unlimited AI site generations","AI image generation (all 5 styles)","Email, ad & content AI tools","Analytics dashboard + lead capture","Priority email support"].map((l,i)=>(
                  <div key={i} className="pf pf-on"><div className="pfc pfc-y">✓</div>{l}</div>
                ))}
              </div>
              <a href="/register?plan=starter" className="price-cta price-cta-filled">Start 14-day free trial →</a>
            </div>
          </div>
          <div className="price-guarantee">
            <strong>Not satisfied? Full refund.</strong> 14-day money-back guarantee, no questions asked.
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq">
        <div className="faq-inner">
          <div className="faq-title">
            <div className="section-eyebrow" style={{textAlign:"center"}}>FAQ</div>
            <h2 className="section-h" style={{textAlign:"center",fontSize:"clamp(34px,4.5vw,52px)"}}>Questions we get a lot</h2>
          </div>
          {[
            {q:"Is it actually free to start — no catch?",a:"Yes. Build, edit, and preview your site as many times as you want at zero cost. No credit card. No time limit. You only pay $10/month when you decide to publish with your own custom domain."},
            {q:"Will the site look professional, or like a template?",a:"Professional — and nothing like a template. AutopilotAI writes custom copy specific to your business type and city, then designs a layout around that copy. Every site looks different. Most customers say it beats sites they've paid agencies $4,000–$8,000 to build."},
            {q:"What if the first result isn't quite right?",a:"Click any word to edit it directly. Swap photos. Reorder sections. Or type a new prompt and regenerate the entire site in seconds. Most people are happy on the first try — but there's no limit on how many times you can change it."},
            {q:"What exactly is included in the $10/month plan?",a:"Everything: publishing your site publicly, connecting a custom domain, unlimited AI generations, all five image styles, the email campaign tool, the ad copy tool, the content writer, visitor analytics, and lead capture forms. No upsells, no higher tiers, no add-ons."},
            {q:"Do I need a domain name already?",a:"No. The Starter plan includes connecting any custom domain you own. If you don't have one yet, we walk you through buying one for around $12/year. Or you can use a free subdomain to test first."},
            {q:"What if I want to cancel?",a:"Cancel from your dashboard any time. No cancellation fee. Your site stays live through the end of the billing period, then moves back to draft. All your content is saved permanently — nothing is deleted."},
          ].map((f,i)=>(
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                {f.q}<span className={`faq-icon ${openFaq===i?"open":""}`}>+</span>
              </button>
              <div className={`faq-body ${openFaq===i?"open":""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final">
        <div className="final-glow"/>
        <div className="final-inner">
          <h2 className="final-h">Someone in your city<br />is <em>Googling</em><br />your service right now.</h2>
          <p className="final-sub">Don't let them find your competitor's website instead of yours. Build yours in 60 seconds — for free.</p>
          <a href="/register" className="final-btn">Build my site free →</a>
          <div className="final-trust">
            <span>No credit card</span>
            <span>Ready in 60 seconds</span>
            <span>14-day free trial</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="/" className="footer-logo"><div className="logo-dot"/>AutopilotAI</a>
              <p className="footer-tagline">AI website builder for local businesses. Professional site in 60 seconds. $10/month to go live.</p>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <div className="footer-col-title">Product</div>
                <a href="/features" className="footer-link">Features</a>
                <a href="#pricing" className="footer-link">Pricing</a>
                <a href="#how-it-works" className="footer-link">How it works</a>
                <a href="/register" className="footer-link">Get started</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Account</div>
                <a href="/login" className="footer-link">Sign in</a>
                <a href="/register" className="footer-link">Create account</a>
                <a href="/dashboard" className="footer-link">Dashboard</a>
              </div>
              <div className="footer-col">
                <div className="footer-col-title">Legal</div>
                <a href="/privacy" className="footer-link">Privacy policy</a>
                <a href="/terms" className="footer-link">Terms of service</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-copy">© 2026 AutopilotAI · Built with AutopilotAI</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Made for local business owners everywhere.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
