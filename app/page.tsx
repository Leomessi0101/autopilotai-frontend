"use client";

import { useState, useEffect, useRef } from "react";

const BUSINESSES = [
  { type: "Plumber", city: "Denver", domain: "denverplumbingpro", color: "#2DD4BF", icon: "🔧", time: "1m 12s" },
  { type: "Yoga Studio", city: "Austin", domain: "sunriseyogaatx", color: "#F472B6", icon: "🧘", time: "58s" },
  { type: "Law Firm", city: "Chicago", domain: "meyerlawgroup", color: "#60A5FA", icon: "⚖️", time: "2m 04s" },
  { type: "Bakery", city: "Portland", domain: "sweetrootbakery", color: "#FB923C", icon: "🍞", time: "47s" },
  { type: "Dog Groomer", city: "Nashville", domain: "pawfectgrooming", color: "#A78BFA", icon: "🐾", time: "1m 33s" },
];

const TESTIMONIALS = [
  {
    name: "Lisa M.",
    biz: "Plumbing business, Ohio",
    quote: "My phone hasn't stopped ringing since I published. Three new jobs in the first 48 hours.",
    earned: "$2k added/mo",
    initials: "LM",
    hue: "#2DD4BF",
  },
  {
    name: "David K.",
    biz: "Marketing consultant, TX",
    quote: "I tried Squarespace for 3 days and gave up. AutopilotAI gave me a better site in 4 minutes.",
    earned: "$2.5k added/mo",
    initials: "DK",
    hue: "#60A5FA",
  },
  {
    name: "Rachel S.",
    biz: "Freelance designer, CA",
    quote: "Sent the link to a prospect on Monday. Signed the contract on Wednesday. Site paid for itself.",
    earned: "$4.2k added/mo",
    initials: "RS",
    hue: "#F472B6",
  },
];

const PROBLEMS = [
  { label: "Squarespace", issue: "You spend 3 days and still hate it", icon: "😩" },
  { label: "Wix", issue: "Bloated, slow, cookie-cutter templates", icon: "🐌" },
  { label: "Hiring an agency", issue: "$5,000 minimum. 6-week wait. Revisions cost extra.", icon: "💸" },
  { label: "DIY from scratch", issue: "Nobody has time for that", icon: "😅" },
];

const TOOLS = [
  {
    icon: "✉️",
    label: "Email Campaigns",
    desc: "AI writes cold outreach, newsletters, follow-ups — every tone, every audience. Copy that converts.",
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.1)",
    href: "/dashboard/email",
    tag: "Email Generator",
  },
  {
    icon: "📣",
    label: "Ad Copy",
    desc: "Facebook, Google, Instagram — ready-to-run ad headlines, hooks, and CTAs in seconds.",
    color: "#F472B6",
    bg: "rgba(244,114,182,0.1)",
    href: "/dashboard/ads",
    tag: "Ads Generator",
  },
  {
    icon: "✍️",
    label: "Content Generator",
    desc: "Blog posts, landing page copy, product descriptions, social captions. All on-brand, all instant.",
    color: "#FB923C",
    bg: "rgba(251,146,60,0.1)",
    href: "/dashboard/content",
    tag: "Content AI",
  },
];

export default function HomePage() {
  const [inputVal, setInputVal] = useState("");
  const [activeBiz, setActiveBiz] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const phrases = [
    "I run a dog grooming salon in Nashville…",
    "I'm a freelance photographer in Miami…",
    "I own a restaurant in San Francisco…",
    "I'm a personal trainer in New York…",
  ];

  useEffect(() => {
    setVisible(true);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    const bizInterval = setInterval(() => {
      setActiveBiz((p) => (p + 1) % BUSINESSES.length);
    }, 2600);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(bizInterval);
    };
  }, []);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    const speed = isDeleting ? 28 : 52;
    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText.length < phrase.length) {
          setTypedText(phrase.slice(0, typedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(phrase.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIdx((p) => (p + 1) % phrases.length);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, phraseIdx]);

  const handleBuild = () => {
    window.location.href = `/upgrade?prompt=${encodeURIComponent(inputVal)}`;
  };

  const biz = BUSINESSES[activeBiz];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --cream: #F5F0E8;
          --ink: #0D0D0D;
          --ink2: #1A1A1A;
          --sage: #2DD4BF;
          --muted: #666;
          --border: rgba(13,13,13,0.1);
          --card: #FFFFFF;
          --display: 'Bebas Neue', sans-serif;
          --head: 'Syne', sans-serif;
          --body: 'Syne', sans-serif;
          --serif: 'Instrument Serif', Georgia, serif;
        }

        html { scroll-behavior: smooth; }

        .root {
          background: var(--cream);
          color: var(--ink);
          font-family: var(--body);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .root::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0; opacity: 0.4;
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.85); opacity: 0.5; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes toolFloat { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(1deg); } }

        .fu1 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .fu2 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.22s both; }
        .fu3 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.36s both; }
        .fu4 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        .fu5 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.64s both; }
        .hidden { opacity: 0; }

        /* ── NAV ──────────────────────────────────────────────────── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          height: 62px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
          transition: all 0.3s;
        }
        .nav.scrolled {
          background: rgba(245,240,232,0.93);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: var(--display); font-size: 26px;
          letter-spacing: 0.04em; color: var(--ink); text-decoration: none;
        }
        .nav-logo span { color: var(--sage); }
        .nav-right { display: flex; gap: 10px; align-items: center; }
        .nav-ghost {
          font-size: 13px; font-weight: 600; color: var(--muted);
          text-decoration: none; padding: 8px 14px; border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-ghost:hover { color: var(--ink); background: rgba(0,0,0,0.05); }
        .nav-pill {
          background: var(--ink); color: var(--cream);
          font-size: 13px; font-weight: 700; padding: 9px 20px;
          border-radius: 100px; text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .nav-pill:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        /* ── HERO ─────────────────────────────────────────────────── */
        .hero {
          min-height: 100vh;
          padding: 100px 32px 80px;
          display: flex; align-items: center;
          position: relative;
        }
        .hero-layout {
          max-width: 1240px; margin: 0 auto; width: 100%;
          display: grid; grid-template-columns: 1.1fr 0.9fr;
          gap: 80px; align-items: center;
          position: relative; z-index: 1;
        }
        .hero-stamp {
          font-family: var(--display);
          font-size: clamp(100px, 14vw, 200px);
          line-height: 0.88; letter-spacing: -0.01em;
          color: var(--ink); margin-bottom: 32px; user-select: none;
        }
        .hero-stamp .line2 { -webkit-text-stroke: 2px var(--ink); color: transparent; }
        .hero-stamp .accent { color: var(--sage); -webkit-text-stroke: 0; display: block; }

        .hero-sub {
          font-size: 17px; font-weight: 400; color: #555;
          line-height: 1.7; max-width: 440px; margin-bottom: 36px;
        }
        .hero-sub strong { color: var(--ink); font-weight: 700; }

        .build-box {
          background: white; border: 2px solid var(--ink);
          border-radius: 20px; overflow: hidden;
          box-shadow: 6px 6px 0 var(--ink);
          margin-bottom: 20px; transition: box-shadow 0.2s;
        }
        .build-box:focus-within { box-shadow: 6px 6px 0 var(--sage); border-color: var(--sage); }
        .build-input {
          width: 100%; border: none; outline: none;
          font-family: var(--body); font-size: 15px; font-weight: 500;
          color: var(--ink); padding: 18px 22px 10px;
          background: transparent; resize: none;
        }
        .build-input::placeholder { color: transparent; }
        .input-bottom {
          display: flex; justify-content: space-between; align-items: center;
          padding: 10px 12px 12px;
        }
        .input-placeholder {
          font-size: 13px; color: #aaa; padding-left: 10px;
          pointer-events: none; font-style: italic;
        }
        .cursor { animation: blink 1s step-end infinite; }
        .build-btn {
          background: var(--ink); color: var(--cream);
          border: none; cursor: pointer; font-family: var(--body);
          font-size: 14px; font-weight: 800; letter-spacing: 0.04em;
          padding: 12px 24px; border-radius: 12px;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap; text-transform: uppercase;
        }
        .build-btn:hover { background: var(--sage); transform: translateY(-1px); }

        .hero-fine {
          font-size: 12px; color: #999; display: flex; gap: 20px;
          flex-wrap: wrap; margin-bottom: 36px;
        }
        .hero-fine span::before { content: '✓ '; color: var(--sage); font-weight: 700; }

        .social-proof {
          display: flex; align-items: center; gap: 14px;
          background: white; border: 1.5px solid var(--border);
          border-radius: 16px; padding: 14px 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .avatars { display: flex; }
        .av {
          width: 34px; height: 34px; border-radius: 50%;
          border: 2.5px solid var(--cream);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; color: white; margin-left: -9px;
        }
        .av:first-child { margin-left: 0; }
        .sp-text { font-size: 13px; font-weight: 600; }
        .sp-sub { font-size: 11px; color: #888; }
        .stars { color: #F59E0B; font-size: 11px; }

        /* ── MOCKUP ───────────────────────────────────────────────── */
        .mockup-outer { position: relative; }
        .mockup-screen {
          background: white; border: 2px solid var(--ink);
          border-radius: 24px; overflow: hidden;
          box-shadow: 10px 10px 0 var(--ink); position: relative;
        }
        .screen-top-bar {
          background: #1A1A1A; padding: 12px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .screen-dots { display: flex; gap: 6px; }
        .screen-dot { width: 10px; height: 10px; border-radius: 50%; }
        .screen-url {
          flex: 1; background: #2d2d2d; border-radius: 6px;
          padding: 5px 12px; font-size: 11px; color: #888;
          display: flex; align-items: center; gap: 6px;
          font-family: monospace; overflow: hidden; white-space: nowrap;
        }
        .screen-url-lock { color: var(--sage); font-size: 9px; }
        .screen-body { height: 340px; position: relative; overflow: hidden; }
        .screen-slide {
          position: absolute; inset: 0; padding: 22px;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .slide-header {
          border-radius: 14px; padding: 20px; margin-bottom: 14px;
        }
        .slide-eyebrow {
          font-size: 9px; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .slide-title {
          font-family: var(--serif); font-size: 18px; line-height: 1.25;
          margin-bottom: 10px; letter-spacing: -0.02em;
        }
        .slide-body { font-size: 11px; color: #777; margin-bottom: 13px; line-height: 1.6; }
        .slide-ctas { display: flex; gap: 8px; }
        .slide-btn-main { padding: 8px 14px; border-radius: 7px; font-size: 11px; font-weight: 800; color: white; }
        .slide-btn-ghost {
          padding: 8px 14px; border-radius: 7px;
          font-size: 11px; font-weight: 600; border: 1.5px solid; background: transparent;
        }
        .slide-features { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; }
        .slide-feat { background: #f8f8f8; border-radius: 9px; padding: 10px 7px; text-align: center; }
        .slide-feat-text { font-size: 9px; color: #666; font-weight: 600; }
        .screen-tabs {
          background: #FAFAFA; border-top: 1.5px solid #eee;
          padding: 10px 12px; display: flex; gap: 6px; flex-wrap: wrap;
        }
        .screen-tab {
          padding: 4px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 700; cursor: pointer;
          border: 1.5px solid; background: transparent;
          font-family: var(--body); transition: all 0.2s;
        }

        .float-badge {
          position: absolute; background: white;
          border: 1.5px solid var(--border); border-radius: 14px;
          padding: 10px 14px; box-shadow: 4px 4px 0 rgba(0,0,0,0.08);
          font-size: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap; z-index: 10;
        }
        .live-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulse 2s ease infinite; }
        .badge-top {
          top: -18px; left: 50%; transform: translateX(-50%);
          background: var(--ink); color: white; border-color: transparent; font-size: 11px;
        }
        .badge-bottom-right { bottom: -18px; right: -10px; animation: float 3.5s ease-in-out infinite; }
        .badge-bottom-left { bottom: 50px; left: -20px; animation: float 4s ease-in-out 1s infinite; }

        /* ── TICKER ───────────────────────────────────────────────── */
        .ticker-wrap {
          background: var(--ink); overflow: hidden;
          padding: 13px 0; border-top: 1px solid var(--cream);
          border-bottom: 1px solid var(--cream);
        }
        .ticker-track { display: flex; animation: ticker 28s linear infinite; }
        .ticker-item {
          padding: 0 32px; font-size: 12px; font-weight: 700;
          color: rgba(255,255,255,0.5); white-space: nowrap;
          letter-spacing: 0.06em; text-transform: uppercase;
          display: flex; align-items: center;
        }
        .ticker-item.bright { color: var(--sage); }
        .ticker-sep { margin-left: 32px; color: rgba(255,255,255,0.2); }

        /* ── PROBLEM ──────────────────────────────────────────────── */
        .problem { padding: 120px 32px; background: var(--ink); position: relative; overflow: hidden; }
        .problem-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .problem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .problem-eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--sage); margin-bottom: 20px;
        }
        .problem-heading {
          font-family: var(--display);
          font-size: clamp(48px, 6vw, 80px);
          line-height: 0.92; letter-spacing: 0.01em;
          color: white; margin-bottom: 28px;
        }
        .problem-heading .struck {
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.25);
          color: transparent; position: relative;
        }
        .problem-heading .struck::after {
          content: ''; position: absolute; left: 0; right: 0; top: 50%;
          height: 2px; background: #ef4444; transform: rotate(-2deg);
        }
        .problem-body { font-size: 16px; color: #888; line-height: 1.75; }
        .problem-list { display: flex; flex-direction: column; gap: 14px; }
        .problem-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 22px 24px;
          display: flex; align-items: center; gap: 18px;
          transition: background 0.2s, transform 0.2s;
        }
        .problem-item:hover { background: rgba(255,255,255,0.07); transform: translateX(4px); }
        .problem-emoji { font-size: 24px; flex-shrink: 0; }
        .problem-label { font-size: 14px; font-weight: 700; color: white; margin-bottom: 3px; }
        .problem-issue { font-size: 13px; color: #666; }

        /* ── PROCESS ──────────────────────────────────────────────── */
        .process { padding: 120px 32px; background: var(--cream); }
        .process-inner { max-width: 1100px; margin: 0 auto; }
        .section-tag {
          display: inline-block;
          font-size: 11px; font-weight: 800; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--sage); margin-bottom: 18px;
        }
        .section-h {
          font-family: var(--display);
          font-size: clamp(48px, 6vw, 80px);
          line-height: 0.92; letter-spacing: 0.01em; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: var(--muted); line-height: 1.65; max-width: 460px; }
        .section-center { text-align: center; margin-bottom: 72px; }
        .section-center .section-sub { margin: 0 auto; }

        .steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; margin-top: 64px; }
        .step {
          background: white; border: 2px solid var(--ink);
          border-radius: 24px; padding: 40px 32px;
          position: relative; overflow: hidden;
          box-shadow: 5px 5px 0 var(--ink);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .step:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink); }
        .step-num {
          font-family: var(--display); font-size: 90px; line-height: 1;
          position: absolute; top: -18px; right: 16px;
          opacity: 0.04; user-select: none; color: var(--ink); pointer-events: none;
        }
        .step-icon-wrap {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; margin-bottom: 22px;
          border: 1.5px solid rgba(0,0,0,0.08);
        }
        .step-line { width: 40px; height: 3px; border-radius: 2px; margin-bottom: 18px; }
        .step-title { font-family: var(--serif); font-size: 22px; font-weight: 400; margin-bottom: 10px; letter-spacing: -0.02em; }
        .step-body { font-size: 14px; color: var(--muted); line-height: 1.75; }

        /* ── TOOLS SECTION (NEW) ──────────────────────────────────── */
        .tools-section {
          padding: 0 32px 0;
          background: var(--cream);
          position: relative;
        }
        .tools-inner {
          max-width: 1100px; margin: 0 auto;
          border: 2px solid var(--ink);
          border-radius: 32px;
          background: var(--ink);
          overflow: hidden;
          box-shadow: 8px 8px 0 var(--sage);
          position: relative;
        }
        .tools-inner::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(45,212,191,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .tools-header {
          padding: 52px 56px 40px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: flex-end; justify-content: space-between; gap: 32px;
          flex-wrap: wrap;
        }
        .tools-eyebrow {
          font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--sage); margin-bottom: 14px;
        }
        .tools-heading {
          font-family: var(--display);
          font-size: clamp(40px, 5vw, 64px);
          line-height: 0.9; color: white; letter-spacing: 0.01em;
        }
        .tools-heading em {
          font-family: var(--serif); font-style: italic;
          -webkit-text-stroke: 1px rgba(255,255,255,0.5); color: transparent;
          font-size: clamp(44px, 5.5vw, 70px);
        }
        .tools-sub {
          font-size: 15px; color: #666; line-height: 1.65;
          max-width: 320px; align-self: flex-end;
        }
        .tools-grid {
          display: grid; grid-template-columns: repeat(3,1fr);
        }
        .tool-card {
          padding: 40px 36px;
          border-right: 1px solid rgba(255,255,255,0.06);
          position: relative; overflow: hidden;
          cursor: pointer; text-decoration: none; display: block;
          transition: background 0.25s;
        }
        .tool-card:last-child { border-right: none; }
        .tool-card::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, var(--tool-color, #fff) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .tool-card:hover { background: rgba(255,255,255,0.04); }
        .tool-card:hover::after { opacity: 0.04; }
        .tool-card:hover .tool-icon { animation: toolFloat 2s ease-in-out infinite; }
        .tool-icon-wrap {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          position: relative; z-index: 1;
          transition: transform 0.2s;
        }
        .tool-icon { font-size: 26px; }
        .tool-tag {
          display: inline-block; font-size: 10px; font-weight: 800;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 3px 10px; border-radius: 100px;
          margin-bottom: 14px; position: relative; z-index: 1;
          border: 1px solid;
        }
        .tool-label {
          font-family: var(--display); font-size: 28px; letter-spacing: 0.02em;
          color: white; margin-bottom: 12px;
          position: relative; z-index: 1; line-height: 1;
        }
        .tool-desc {
          font-size: 13px; color: #666; line-height: 1.65;
          position: relative; z-index: 1;
        }
        .tool-arrow {
          position: absolute; bottom: 32px; right: 32px;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: rgba(255,255,255,0.3);
          transition: all 0.2s; z-index: 1;
        }
        .tool-card:hover .tool-arrow {
          background: var(--tool-color, rgba(255,255,255,0.2));
          border-color: transparent; color: var(--ink); transform: translate(2px,-2px);
        }
        .tools-footer {
          padding: 20px 56px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          flex-wrap: wrap;
        }
        .tools-footer-note {
          font-size: 13px; color: #444;
        }
        .tools-footer-note strong { color: #888; }
        .tools-cta {
          font-size: 12px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--sage);
          text-decoration: none; display: flex; align-items: center; gap: 6px;
          transition: gap 0.2s;
        }
        .tools-cta:hover { gap: 10px; }

        /* ── TESTIMONIALS ─────────────────────────────────────────── */
        .testimonials { padding: 120px 32px; background: white; border-top: 2px solid var(--ink); }
        .testi-inner { max-width: 1100px; margin: 0 auto; }
        .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 22px; margin-top: 64px; }
        .testi-card {
          border: 2px solid var(--ink); border-radius: 24px; padding: 34px;
          box-shadow: 5px 5px 0 var(--ink); transition: transform 0.25s, box-shadow 0.25s;
          position: relative; background: white;
        }
        .testi-card:hover { transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink); }
        .testi-tag {
          display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: 0.08em;
          padding: 4px 12px; border-radius: 100px; margin-bottom: 18px; color: white;
        }
        .testi-quote {
          font-family: var(--serif); font-size: 17px;
          font-style: italic; color: var(--ink); line-height: 1.65; margin-bottom: 26px;
        }
        .testi-author { display: flex; align-items: center; gap: 12px; }
        .testi-av {
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 800; color: white; border: 2px solid var(--ink);
        }
        .testi-name { font-size: 14px; font-weight: 700; }
        .testi-biz { font-size: 12px; color: #888; }

        /* ── FEATURES ─────────────────────────────────────────────── */
        .features { padding: 120px 32px; background: var(--cream); }
        .features-inner { max-width: 1100px; margin: 0 auto; }
        .features-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .feat-list { display: flex; flex-direction: column; gap: 0; margin-top: 44px; }
        .feat-item {
          padding: 22px 0; border-bottom: 1.5px solid var(--border);
          display: flex; gap: 18px; align-items: flex-start; transition: padding 0.2s;
        }
        .feat-item:first-child { border-top: 1.5px solid var(--border); }
        .feat-item:hover { padding-left: 8px; }
        .feat-icon-box {
          width: 42px; height: 42px; border-radius: 11px;
          background: white; border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0; box-shadow: 3px 3px 0 var(--border);
        }
        .feat-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 3px; }
        .feat-body { font-size: 13px; color: #888; line-height: 1.6; }
        .metrics-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .metric {
          background: white; border: 2px solid var(--ink);
          border-radius: 20px; padding: 28px 24px;
          box-shadow: 5px 5px 0 var(--ink); transition: transform 0.2s, box-shadow 0.2s;
        }
        .metric:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 var(--ink); }
        .metric-val {
          font-family: var(--display); font-size: 52px; line-height: 1;
          margin-bottom: 10px; letter-spacing: 0.02em;
        }
        .metric-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

        /* ── PRICING ──────────────────────────────────────────────── */
        .pricing { padding: 120px 32px; background: white; border-top: 2px solid var(--ink); }
        .pricing-inner { max-width: 800px; margin: 0 auto; }
        .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 64px; }
        .price-card {
          border: 2px solid var(--ink); border-radius: 24px; padding: 44px 38px;
          box-shadow: 5px 5px 0 var(--ink); position: relative; background: var(--cream);
        }
        .price-card-dark {
          background: var(--ink); border-color: var(--ink); box-shadow: 5px 5px 0 var(--sage);
        }
        .price-popular-badge {
          position: absolute; top: -14px; left: 50%; transform: translateX(-50%);
          background: var(--sage); color: var(--ink);
          font-size: 10px; font-weight: 900; letter-spacing: 0.1em;
          padding: 4px 16px; border-radius: 100px; text-transform: uppercase;
          border: 2px solid var(--ink); white-space: nowrap;
        }
        .price-tier { font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin-bottom: 18px; }
        .price-tier-dark { color: #555; }
        .price-amount { font-family: var(--display); font-size: 72px; line-height: 1; margin-bottom: 6px; letter-spacing: 0.02em; }
        .price-amount-dark { color: white; }
        .price-period { font-size: 14px; color: #888; margin-bottom: 32px; }
        .price-period-dark { color: #555; }
        .price-feats { display: flex; flex-direction: column; gap: 11px; }
        .pf { display: flex; align-items: center; gap: 12px; font-size: 14px; }
        .pf-check {
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 800; flex-shrink: 0;
        }
        .pf-check-yes { background: rgba(45,212,191,0.2); color: var(--sage); }
        .pf-check-no { background: rgba(0,0,0,0.06); color: #ccc; }
        .price-cta {
          display: block; margin-top: 36px; padding: 15px;
          border-radius: 12px; text-align: center; text-decoration: none;
          font-size: 14px; font-weight: 800; letter-spacing: 0.04em;
          text-transform: uppercase; font-family: var(--body); cursor: pointer;
          border: 2px solid var(--ink); transition: all 0.2s;
        }
        .price-cta-ghost { background: transparent; color: var(--ink); }
        .price-cta-ghost:hover { background: var(--ink); color: var(--cream); }
        .price-cta-solid { background: var(--sage); color: var(--ink); border-color: var(--sage); }
        .price-cta-solid:hover { background: #1fc4b1; border-color: #1fc4b1; transform: translateY(-2px); }

        /* ── FAQ ──────────────────────────────────────────────────── */
        .faq { padding: 120px 32px; background: var(--cream); }
        .faq-inner { max-width: 680px; margin: 0 auto; }
        .faq-item { border-bottom: 2px solid var(--ink); }
        .faq-btn {
          width: 100%; background: none; border: none;
          padding: 24px 0; display: flex; justify-content: space-between;
          align-items: center; cursor: pointer; text-align: left;
          font-size: 16px; font-weight: 700; color: var(--ink);
          font-family: var(--body); gap: 16px;
        }
        .faq-plus { font-size: 24px; color: var(--sage); font-weight: 300; transition: transform 0.3s; flex-shrink: 0; line-height: 1; }
        .faq-plus.open { transform: rotate(45deg); }
        .faq-body {
          overflow: hidden; max-height: 0; opacity: 0;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s;
          font-size: 15px; color: var(--muted); line-height: 1.75; padding-bottom: 0;
        }
        .faq-body.open { max-height: 220px; opacity: 1; padding-bottom: 24px; }

        /* ── FINAL CTA ────────────────────────────────────────────── */
        .final { padding: 140px 32px; background: var(--ink); position: relative; overflow: hidden; }
        .final-orb {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(45,212,191,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .final-inner { max-width: 720px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .final-h {
          font-family: var(--display);
          font-size: clamp(52px, 8vw, 110px);
          line-height: 0.9; letter-spacing: 0.01em; color: white; margin-bottom: 24px;
        }
        .final-h .outline { -webkit-text-stroke: 2px white; color: transparent; }
        .final-h .teal { color: var(--sage); }
        .final-sub { font-size: 17px; color: #666; line-height: 1.7; margin-bottom: 52px; }
        .final-input-row {
          background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.12);
          border-radius: 18px; padding: 7px;
          display: flex; gap: 8px; max-width: 520px; margin: 0 auto 18px;
        }
        .final-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-size: 15px; color: white; padding: 13px 14px;
          font-family: var(--body); min-width: 0;
        }
        .final-input::placeholder { color: #555; }
        .final-btn {
          background: var(--sage); color: var(--ink); border: none; cursor: pointer;
          font-family: var(--body); font-size: 13px; font-weight: 800;
          letter-spacing: 0.06em; text-transform: uppercase;
          padding: 13px 22px; border-radius: 12px;
          transition: filter 0.2s, transform 0.15s; white-space: nowrap;
        }
        .final-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .final-fine { font-size: 12px; color: #555; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .final-fine span::before { content: '✓ '; color: var(--sage); }

        /* ── FOOTER ───────────────────────────────────────────────── */
        .footer { background: #080808; border-top: 1px solid #1f1f1f; padding: 36px 32px; }
        .footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 20px;
        }
        .footer-logo { font-family: var(--display); font-size: 22px; color: white; text-decoration: none; }
        .footer-logo span { color: var(--sage); }
        .footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
        .footer-link { font-size: 13px; color: #444; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: white; }

        /* ── MOBILE ───────────────────────────────────────────────── */
        @media (max-width: 960px) {
          .nav { padding: 0 20px; }
          .nav-ghost { display: none; }
          .hero { padding: 90px 20px 60px; min-height: unset; }
          .hero-layout { grid-template-columns: 1fr; gap: 52px; }
          .hero-stamp { font-size: clamp(72px, 18vw, 110px); }
          .problem { padding: 80px 20px; }
          .problem-grid { grid-template-columns: 1fr; gap: 48px; }
          .process { padding: 80px 20px; }
          .steps { grid-template-columns: 1fr; gap: 18px; margin-top: 48px; }
          .tools-section { padding: 0 20px; }
          .tools-header { padding: 36px 28px 28px; flex-direction: column; align-items: flex-start; }
          .tools-grid { grid-template-columns: 1fr; }
          .tool-card { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .tool-card:last-child { border-bottom: none; }
          .tool-card { padding: 28px 24px; }
          .tools-footer { padding: 16px 28px; flex-direction: column; align-items: flex-start; }
          .testimonials { padding: 80px 20px; }
          .testi-grid { grid-template-columns: 1fr; gap: 18px; }
          .features { padding: 80px 20px; }
          .features-layout { grid-template-columns: 1fr; gap: 52px; }
          .metrics-2 { grid-template-columns: 1fr 1fr; }
          .pricing { padding: 80px 20px; }
          .pricing-grid { grid-template-columns: 1fr; gap: 18px; }
          .price-card, .price-card-dark { padding: 36px 28px; }
          .faq { padding: 80px 20px; }
          .final { padding: 100px 20px; }
          .final-input-row { flex-wrap: wrap; }
          .final-btn { width: 100%; justify-content: center; }
          .footer { padding: 28px 20px; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 560px) {
          .metrics-2 { grid-template-columns: 1fr; }
          .pricing-grid { grid-template-columns: 1fr; }
          .screen-tabs { gap: 4px; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="nav-logo">Autopilot<span>AI</span></a>
        <div className="nav-right">
          <a href="/login" className="nav-ghost">Sign in</a>
          <a href="/upgrade" className="nav-pill">Start free →</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-layout">
          <div>
            <div className={visible ? "fu1" : "hidden"}>
              <h1 className="hero-stamp">
                <span>Your</span>
                <br /><span className="line2">website</span>
                <br /><span className="accent">in 60s.</span>
              </h1>
            </div>

            <p className={`hero-sub ${visible ? "fu2" : "hidden"}`}>
              Describe your business. AI builds a <strong>conversion-ready,
              professional website</strong> in under a minute. Edit anything.
              Publish for <strong>$10/mo</strong> — or explore free, forever.
            </p>

            <div className={visible ? "fu3" : "hidden"}>
              <div className="build-box">
                <input
                  ref={inputRef}
                  className="build-input"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBuild()}
                  placeholder="type here"
                />
                <div className="input-bottom">
                  {inputVal === "" ? (
                    <div className="input-placeholder">
                      {typedText}<span className="cursor">|</span>
                    </div>
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                  <button className="build-btn" onClick={handleBuild}>Generate site →</button>
                </div>
              </div>

              <div className="hero-fine">
                <span>No credit card</span>
                <span>No design skills needed</span>
                <span>Cancel anytime</span>
              </div>

              <div className="social-proof">
                <div className="avatars">
                  {[["LM","#2DD4BF"],["DK","#60A5FA"],["RS","#F472B6"],["JP","#FB923C"],["AW","#A78BFA"]].map(([i,c],idx) => (
                    <div key={idx} className="av" style={{ background: c }}>{i}</div>
                  ))}
                </div>
                <div>
                  <div className="sp-text">2,847 businesses launched</div>
                  <div className="stars">★★★★★ <span className="sp-sub">4.9 avg rating</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className={`mockup-outer ${visible ? "fu4" : "hidden"}`}>
            <div className="float-badge badge-top">
              <span className="live-dot" />
              AI GENERATING LIVE
            </div>
            <div className="mockup-screen">
              <div className="screen-top-bar">
                <div className="screen-dots">
                  {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
                    <div key={i} className="screen-dot" style={{background:c}} />
                  ))}
                </div>
                <div className="screen-url">
                  <span className="screen-url-lock">🔒</span>
                  <span key={activeBiz} style={{animation:"slideIn 0.4s ease both",animationDelay:"0.1s"}}>
                    {biz.domain}.com
                  </span>
                </div>
              </div>
              <div className="screen-body">
                {BUSINESSES.map((b,i) => (
                  <div key={i} className="screen-slide" style={{
                    opacity: activeBiz === i ? 1 : 0,
                    transform: activeBiz === i ? "none" : "scale(0.97)",
                    pointerEvents: activeBiz === i ? "auto" : "none"
                  }}>
                    <div className="slide-header" style={{ background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`, borderLeft: `4px solid ${b.color}` }}>
                      <div className="slide-eyebrow" style={{ color: b.color }}>{b.icon} {b.type} · {b.city}</div>
                      <div className="slide-title">
                        The Most Trusted {b.type} in {b.city} —
                        <em style={{ color: b.color }}> Guaranteed.</em>
                      </div>
                      <div className="slide-body">Licensed & insured. 5-star rated. Serving {b.city} since 2019.</div>
                      <div className="slide-ctas">
                        <div className="slide-btn-main" style={{ background: b.color }}>Get Free Quote</div>
                        <div className="slide-btn-ghost" style={{ borderColor: `${b.color}50`, color: b.color }}>See Our Work</div>
                      </div>
                    </div>
                    <div className="slide-features">
                      {["✅ Licensed","⭐ 5-Star","⚡ Same Day"].map((f,fi)=>(
                        <div key={fi} className="slide-feat"><div className="slide-feat-text">{f}</div></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="screen-tabs">
                {BUSINESSES.map((b,i)=>(
                  <button key={i} className="screen-tab" onClick={()=>setActiveBiz(i)} style={{
                    borderColor: activeBiz===i ? b.color : "#ddd",
                    background: activeBiz===i ? `${b.color}18` : "transparent",
                    color: activeBiz===i ? b.color : "#999"
                  }}>
                    {b.icon} {b.type}
                  </button>
                ))}
              </div>
            </div>
            <div className="float-badge badge-bottom-right">⚡ Built in {biz.time}</div>
            <div className="float-badge badge-bottom-left" style={{ fontSize: 11 }}>🔒 <span style={{ color: "#888" }}>SEO optimized</span></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div style={{ overflow: "hidden" }}>
          <div className="ticker-track">
            {["2,847 websites built","$4.2M+ revenue generated","4.9★ avg rating","No code required","Publish in under 5 minutes","14-day free trial","Cancel anytime",
              "AI email campaigns","AI ad copy generator","AI content writer","2,847 websites built","$4.2M+ revenue generated","4.9★ avg rating","No code required","Publish in under 5 minutes","14-day free trial","Cancel anytime",
              "AI email campaigns","AI ad copy generator","AI content writer"]
              .map((t,i) => (
              <div key={i} className={`ticker-item ${i%4===0?"bright":""}`}>
                {t}<span className="ticker-sep">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <section className="problem">
        <div className="problem-inner">
          <div className="problem-grid">
            <div>
              <div className="problem-eyebrow">Why you're here</div>
              <h2 className="problem-heading">
                BUILDING<br />A SITE<br />
                <span className="struck">SUCKS</span><br />
                RIGHT?
              </h2>
              <p className="problem-body">
                You've wasted hours on drag-and-drop builders.
                You've gotten quotes from agencies that start at $5,000.
                You just want something that looks great and gets you clients.
                <br /><br />
                AutopilotAI builds your whole site in the time it takes to make coffee.
              </p>
            </div>
            <div className="problem-list">
              {PROBLEMS.map((p, i) => (
                <div key={i} className="problem-item">
                  <div className="problem-emoji">{p.icon}</div>
                  <div>
                    <div className="problem-label">{p.label}</div>
                    <div className="problem-issue">{p.issue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="process">
        <div className="process-inner">
          <div className="section-center">
            <div className="section-tag">How it works</div>
            <h2 className="section-h">THREE STEPS.<br />ZERO HEADACHES.</h2>
            <p className="section-sub">No designers. No developers. No waiting.</p>
          </div>
          <div className="steps">
            {[
              { n:"01", icon:"✍️", color:"#2DD4BF", bg:"rgba(45,212,191,0.12)",
                title: "Tell us who you are",
                body: "60 seconds of typing. Your business type, your city, your vibe. That's all we need. Our AI figures out the rest." },
              { n:"02", icon:"🤖", color:"#60A5FA", bg:"rgba(96,165,250,0.12)",
                title: "AI builds your whole site",
                body: "Custom copy written for your industry. Conversion-optimized layout. Professional design. All generated in under a minute." },
              { n:"03", icon:"🚀", color:"#F472B6", bg:"rgba(244,114,182,0.12)",
                title: "Edit & go live",
                body: "Click any element to change it. Swap images. Tweak copy. Hit publish — your site is live at your own domain." },
            ].map((s,i)=>(
              <div key={i} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-icon-wrap" style={{ background: s.bg }}>{s.icon}</div>
                <div className="step-line" style={{ background: s.color }} />
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW: MORE THAN WEBSITES ────────────────────────────────── */}
      <section className="tools-section" style={{ paddingBottom: 120 }}>
        <div className="tools-inner">
          <div className="tools-header">
            <div>
              <div className="tools-eyebrow">Beyond the website</div>
              <h2 className="tools-heading">
                MORE THAN<br />
                <em>a website.</em>
              </h2>
            </div>
            <p className="tools-sub">
              Once your site is live, keep customers coming. AutopilotAI has AI tools for every part of your marketing — all in one place.
            </p>
          </div>

          <div className="tools-grid">
            {TOOLS.map((tool, i) => (
              <a
                key={i}
                href={tool.href}
                className="tool-card"
                style={{ ["--tool-color" as any]: tool.color }}
              >
                <div className="tool-icon-wrap" style={{ background: tool.bg }}>
                  <span className="tool-icon">{tool.icon}</span>
                </div>
                <div className="tool-tag" style={{ color: tool.color, borderColor: `${tool.color}30`, background: `${tool.color}10` }}>
                  {tool.tag}
                </div>
                <div className="tool-label">{tool.label.toUpperCase()}</div>
                <p className="tool-desc">{tool.desc}</p>
                <div className="tool-arrow">→</div>
              </a>
            ))}
          </div>

          <div className="tools-footer">
            <p className="tools-footer-note">
              All tools are <strong>included with your plan.</strong> No extra subscriptions. No add-ons.
            </p>
            <a href="/dashboard" className="tools-cta">
              Go to dashboard <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testi-inner">
          <div className="section-tag">Proof it works</div>
          <h2 className="section-h">REAL PEOPLE.<br />REAL REVENUE.</h2>
          <p className="section-sub" style={{ marginTop: 16 }}>Not cherry-picked case studies. These are the last three featured reviews.</p>
          <div className="testi-grid">
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} className="testi-card">
                <div className="testi-tag" style={{ background: t.hue }}>{t.earned}</div>
                <p className="testi-quote">"{t.quote}"</p>
                <div className="testi-author">
                  <div className="testi-av" style={{ background: t.hue }}>{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-biz">{t.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="features-inner">
          <div className="features-layout">
            <div>
              <div className="section-tag">Everything included</div>
              <h2 className="section-h">BUILT IN.<br /><em style={{ fontFamily:"'Instrument Serif',serif", WebkitTextStroke:"0" }}>Nothing extra.</em></h2>
              <p style={{ fontSize:16, color:"#666", lineHeight:1.7, maxWidth:400, marginTop:16 }}>
                One tool. No plugin shopping. No duct tape. Everything you need to get customers online is already here.
              </p>
              <div className="feat-list">
                {[
                  { icon:"✏️", title:"Click-to-edit anything", body:"Text, images, colors, layout — all editable with zero code." },
                  { icon:"📊", title:"Built-in analytics", body:"Visitor counts, top pages, click heatmaps — all native." },
                  { icon:"📬", title:"Lead capture forms", body:"Automatically collect enquiries and emails. No plugin needed." },
                  { icon:"🌐", title:"Custom domain", body:"Your real domain, not a branded subdomain nobody trusts." },
                  { icon:"📱", title:"Mobile perfect", body:"Every site is 100% responsive from the first generation." },
                ].map((f,i)=>(
                  <div key={i} className="feat-item">
                    <div className="feat-icon-box">{f.icon}</div>
                    <div>
                      <div className="feat-title">{f.title}</div>
                      <div className="feat-body">{f.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="metrics-2">
              {[
                { val:"60s", label:"Average time to first website", color:"#2DD4BF" },
                { val:"$10", label:"Per month to publish on your domain", color:"#60A5FA" },
                { val:"100%", label:"Mobile responsive, guaranteed", color:"#F472B6" },
                { val:"4.9★", label:"Average customer satisfaction rating", color:"#FB923C" },
              ].map((m,i)=>(
                <div key={i} className="metric">
                  <div className="metric-val" style={{ color:m.color }}>{m.val}</div>
                  <div className="metric-desc">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing">
        <div className="pricing-inner">
          <div className="section-center">
            <div className="section-tag">Pricing</div>
            <h2 className="section-h">HONEST PRICING.<br />NO GOTCHAS.</h2>
            <p className="section-sub">Build and edit everything free. Only pay when you're ready to go live.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free Forever</div>
              <div className="price-amount">$0</div>
              <div className="price-period">Create and explore, no card needed</div>
              <div className="price-feats">
                {([
                  [true,"Build 1 website"],
                  [true,"Unlimited edits"],
                  [true,"10 AI generations"],
                  [true,"Mobile responsive"],
                  [false,"Custom domain"],
                  [false,"Publish publicly"],
                ] as [boolean,string][]).map(([yes,label],i)=>(
                  <div key={i} className="pf" style={{ color: yes?"var(--ink)":"#bbb" }}>
                    <div className={`pf-check ${yes?"pf-check-yes":"pf-check-no"}`}>{yes?"✓":"✕"}</div>
                    {label}
                  </div>
                ))}
              </div>
              <a href="/upgrade" className="price-cta price-cta-ghost">Start building free</a>
            </div>

            <div className="price-card price-card-dark">
              <div className="price-popular-badge">MOST POPULAR</div>
              <div className="price-tier price-tier-dark">Starter</div>
              <div className="price-amount price-amount-dark">
                $10<span style={{ fontSize:22, color:"#555" }}>/mo</span>
              </div>
              <div className="price-period price-period-dark">14-day free trial — cancel anytime</div>
              <div className="price-feats">
                {[
                  "Publish your website",
                  "Custom domain included",
                  "Unlimited AI generations",
                  "20 AI images/month",
                  "Analytics dashboard",
                  "Priority support",
                ].map((label,i)=>(
                  <div key={i} className="pf" style={{ color:"rgba(255,255,255,0.85)" }}>
                    <div className="pf-check pf-check-yes">✓</div>
                    {label}
                  </div>
                ))}
              </div>
              <a href="/upgrade" className="price-cta price-cta-solid">Start free trial →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="faq-inner">
          <h2 className="section-h" style={{ textAlign:"center", marginBottom:56 }}>COMMON QUESTIONS</h2>
          {[
            { q:"Is it really free to start?",
              a:"Yes — build, edit, and preview everything for free, forever. You only pay $10/month when you're ready to publish with your own domain. No credit card required to start." },
            { q:"Will my site look professional?",
              a:"Our AI is trained on thousands of premium agency sites. Every output is conversion-optimized with custom copy and industry-specific design. Most customers say it looks better than sites they've paid thousands for." },
            { q:"Can I edit it after the AI builds it?",
              a:"Click any text to edit. Drag images. Add sections. Or just type a new prompt and regenerate entirely. No code, no friction, no waiting." },
            { q:"What if I don't like the first result?",
              a:"Regenerate as many times as you want — it's always free. Try different styles, tones, and layouts. You only pay when you love it." },
            { q:"Do I need a domain name?",
              a:"Your $10/month plan includes connecting your own domain. If you don't have one yet, we'll walk you through getting one for under $15/year." },
          ].map((faq,i)=>(
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                {faq.q}
                <span className={`faq-plus ${openFaq===i?"open":""}`}>+</span>
              </button>
              <div className={`faq-body ${openFaq===i?"open":""}`}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final">
        <div className="final-orb" />
        <div className="final-inner">
          <h2 className="final-h">
            YOUR NEXT<br />
            <span className="outline">CUSTOMER</span><br />
            IS <span className="teal">SEARCHING</span>
          </h2>
          <p className="final-sub">
            Right now. On Google. Looking for exactly what you offer.
            Don't let them land on a competitor's site.
          </p>
          <div className="final-input-row">
            <input
              className="final-input"
              placeholder="Describe your business..."
              onKeyDown={(e)=> e.key==="Enter" && handleBuild()}
            />
            <button className="final-btn" onClick={handleBuild}>Build it free →</button>
          </div>
          <div className="final-fine">
            <span>No credit card</span>
            <span>2-minute setup</span>
            <span>Try before you pay</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="/" className="footer-logo">Autopilot<span>AI</span></a>
          <div className="footer-links">
            {["Yes, AutopilotAI built this site too"].map(link=>(
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}