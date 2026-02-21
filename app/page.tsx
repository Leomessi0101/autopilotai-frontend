"use client";

import { useState, useEffect, useRef } from "react";

const SITE_EXAMPLES = [
  { label: "Plumber NYC", color: "#0ea5e9", icon: "🔧" },
  { label: "Yoga Studio LA", color: "#8b5cf6", icon: "🧘" },
  { label: "Dog Groomer Austin", color: "#f59e0b", icon: "🐾" },
  { label: "Law Firm Boston", color: "#10b981", icon: "⚖️" },
  { label: "Bakery Chicago", color: "#ef4444", icon: "🍞" },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    location: "California",
    text: "Had zero idea how to build a website. AutopilotAI made mine in 2 minutes. Got my first client within a week.",
    revenue: "+$4,200/mo",
    initials: "SC",
    color: "#8b5cf6",
  },
  {
    name: "Mike Rodriguez",
    role: "Marketing Consultant",
    location: "Texas",
    text: "Spent $0 on design. Got 3 new clients the first month. ROI on $10/mo is genuinely absurd.",
    revenue: "+$8,500/mo",
    initials: "MR",
    color: "#f59e0b",
  },
  {
    name: "Lisa Thompson",
    role: "Plumbing Business Owner",
    location: "Ohio",
    text: "I'm not tech savvy at all. Created my whole site in 5 minutes. My phone hasn't stopped ringing.",
    revenue: "+$12,000/mo",
    initials: "LT",
    color: "#10b981",
  },
];

const FAQS = [
  {
    q: "Is it really free to start?",
    a: "Yes — create, edit, and preview everything for free. You only pay $10/month when you're ready to publish with your own domain. No credit card to start.",
  },
  {
    q: "Will my site look professional?",
    a: "Our AI is trained on thousands of premium agency sites. Every output includes conversion-optimized layouts, custom copy, and industry-specific design. Customers can't tell it wasn't hand-built.",
  },
  {
    q: "Can I edit it after AI creates it?",
    a: "Click any text to edit it. Drag images. Add sections. Or just type a new prompt and regenerate entirely. No coding, no friction.",
  },
  {
    q: "What if I don't like the result?",
    a: "Regenerate as many times as you want — it's free. Try different styles, tones, layouts. You only pay when you love it.",
  },
];

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeExample, setActiveExample] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholderTexts = [
    "I'm a fitness trainer in NYC...",
    "I run a pet grooming salon...",
    "I'm a freelance photographer...",
    "I own a restaurant in Miami...",
  ];

  useEffect(() => {
    setHeroVisible(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    const exampleInterval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % SITE_EXAMPLES.length);
    }, 2200);

    const placeholderInterval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(exampleInterval);
      clearInterval(placeholderInterval);
    };
  }, []);

  const handleTry = () => {
    window.location.href = `/upgrade?prompt=${encodeURIComponent(inputValue)}`;
  };

  return (
    <div className="page-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --green: #059669;
          --green-light: #4ade80;
          --blue: #0ea5e9;
          --purple: #8b5cf6;
          --amber: #f59e0b;
          --bg: #FAFAF8;
          --bg-dark: #111111;
          --text: #111111;
          --muted: #666;
          --border: #e5e5e5;
          --white: #ffffff;
          --serif: 'Instrument Serif', Georgia, serif;
          --sans: 'DM Sans', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        .page-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          overflow-x: hidden;
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-up { animation: fadeUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .anim-fade-in { animation: fadeIn 0.5s ease both; }
        .d1 { animation-delay: 0.08s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.34s; }
        .d4 { animation-delay: 0.48s; }
        .d5 { animation-delay: 0.6s; }
        .hidden-init { opacity: 0; }

        /* ── HEADER ── */
        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
          border-bottom: 1px solid transparent;
        }
        .header.scrolled {
          background: rgba(250, 250, 248, 0.92);
          backdrop-filter: blur(20px);
          border-color: var(--border);
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-family: var(--serif);
          font-size: 22px;
          color: var(--text);
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-link {
          padding: 8px 16px;
          font-size: 14px;
          color: #555;
          text-decoration: none;
          font-weight: 500;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--text); background: rgba(0,0,0,0.04); }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          background: var(--text);
          color: white;
          border-radius: 10px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: var(--sans);
          letter-spacing: -0.01em;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }

        .btn-green {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 13px 24px;
          font-size: 15px;
          font-weight: 700;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          border-radius: 12px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: var(--sans);
          letter-spacing: -0.01em;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          white-space: nowrap;
        }
        .btn-green:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(5,150,105,0.35);
          filter: brightness(1.06);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text);
          border-radius: 2px;
          transition: all 0.3s;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px; left: 0; right: 0;
          background: rgba(250,250,248,0.97);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 20px 24px 28px;
          z-index: 99;
          flex-direction: column;
          gap: 12px;
          animation: slideDown 0.25s ease;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu .nav-link {
          font-size: 16px;
          padding: 12px 16px;
          border-radius: 10px;
        }
        .mobile-menu .btn-primary { width: 100%; justify-content: center; padding: 14px; font-size: 15px; }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 24px 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-bg-orb-1 {
          position: absolute;
          top: 100px; right: -80px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(5,150,105,0.09) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-bg-orb-2 {
          position: absolute;
          bottom: 0; left: -100px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-grid {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .hero-title {
          font-family: var(--serif);
          font-size: clamp(44px, 5.5vw, 72px);
          line-height: 1.04;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 24px;
        }
        .hero-title em { font-style: italic; color: var(--green); }
        .hero-subtitle {
          font-size: 17px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 440px;
        }
        .hero-subtitle strong { color: var(--text); font-weight: 600; }

        .input-wrap {
          background: white;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 8px;
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .input-wrap:focus-within {
          border-color: var(--green);
          box-shadow: 0 4px 24px rgba(5,150,105,0.18);
        }
        .hero-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 15px;
          color: var(--text);
          padding: 10px 14px;
          outline: none;
          font-family: var(--sans);
          min-width: 0;
        }
        .hero-input::placeholder { color: #aaa; }
        .input-btn {
          flex-shrink: 0;
        }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .avatars { display: flex; }
        .avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 2.5px solid var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: white;
          margin-left: -10px;
        }
        .avatar:first-child { margin-left: 0; }
        .trust-text-title { font-weight: 600; font-size: 14px; color: var(--text); }
        .trust-text-sub { font-size: 12px; color: #888; }

        /* ── PREVIEW MOCKUP ── */
        .preview-wrap { position: relative; }
        .preview-float-label {
          position: absolute;
          top: -16px; left: 50%;
          transform: translateX(-50%);
          background: var(--text);
          color: white;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          z-index: 10;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .live-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 2s ease infinite;
        }
        .mockup-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06);
        }
        .browser-bar {
          background: #f2f2f2;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .browser-dots { display: flex; gap: 6px; }
        .browser-dot { width: 11px; height: 11px; border-radius: 50%; }
        .browser-url {
          flex: 1;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 12px;
          color: #666;
          margin-left: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
          white-space: nowrap;
        }
        .mockup-body {
          position: relative;
          height: 360px;
          overflow: hidden;
          background: white;
        }
        .mockup-slide {
          position: absolute;
          inset: 0;
          padding: 24px;
          transition: opacity 0.55s ease;
        }
        .mockup-tabs {
          background: #f7f7f7;
          border-top: 1px solid #eee;
          padding: 12px 14px;
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .mockup-tab {
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          font-family: var(--sans);
        }
        .preview-time-badge {
          position: absolute;
          bottom: -16px; right: 20px;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 8px;
          animation: float 4s ease-in-out infinite;
        }

        /* ── MARQUEE ── */
        .marquee-outer {
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          background: white;
          padding: 18px 0;
          overflow: hidden;
        }
        .marquee-track {
          animation: marquee 22s linear infinite;
          display: flex;
          gap: 0;
        }
        .marquee-item {
          padding: 0 36px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0;
        }
        .marquee-sep { margin-left: 36px; color: #ddd; }

        /* ── SECTIONS ── */
        .section { padding: 120px 24px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-inner-md { max-width: 900px; margin: 0 auto; }
        .section-inner-sm { max-width: 720px; margin: 0 auto; }
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 16px;
        }
        .section-heading {
          font-family: var(--serif);
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 400;
          letter-spacing: -0.03em;
          color: var(--text);
          line-height: 1.06;
          margin-bottom: 16px;
        }
        .section-heading em { font-style: italic; }
        .section-sub {
          font-size: 17px;
          color: var(--muted);
          max-width: 480px;
          line-height: 1.6;
        }
        .section-center { text-align: center; margin-bottom: 72px; }
        .section-center .section-sub { margin: 0 auto; }

        /* ── HOW IT WORKS ── */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .step-card {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s;
        }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 24px 60px rgba(0,0,0,0.09); }
        .step-ghost-num {
          font-family: var(--serif);
          font-size: 80px;
          line-height: 1;
          position: absolute;
          top: -18px; left: 18px;
          opacity: 0.06;
          user-select: none;
          color: var(--text);
        }
        .step-icon { font-size: 32px; margin-bottom: 18px; }
        .step-divider { width: 40px; height: 2.5px; border-radius: 2px; margin-bottom: 18px; }
        .step-title {
          font-family: var(--serif);
          font-size: 22px;
          font-weight: 400;
          color: var(--text);
          margin-bottom: 10px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .step-body { font-size: 14px; color: var(--muted); line-height: 1.75; }

        /* ── TESTIMONIALS ── */
        .section-dark {
          background: var(--bg-dark);
          position: relative;
          overflow: hidden;
        }
        .section-dark .section-heading { color: white; }
        .section-dark .section-sub { color: #888; }
        .section-dark .section-label { color: #4ade80; }
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .testi-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s;
        }
        .testi-card:hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 28px 60px rgba(0,0,0,0.3);
        }
        .testi-revenue {
          display: inline-block;
          background: rgba(74,222,128,0.15);
          color: #4ade80;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .testi-text {
          font-family: var(--serif);
          font-size: 17px;
          color: rgba(255,255,255,0.82);
          line-height: 1.65;
          margin-bottom: 24px;
          font-style: italic;
        }
        .testi-author { display: flex; align-items: center; gap: 13px; }
        .testi-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: white;
          flex-shrink: 0;
        }
        .testi-name { font-weight: 600; font-size: 14px; color: white; }
        .testi-role { font-size: 12px; color: #888; }

        /* ── FEATURES ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        .feature-list { display: flex; flex-direction: column; gap: 22px; margin-top: 36px; }
        .feature-item { display: flex; gap: 16px; align-items: flex-start; }
        .feature-icon-wrap {
          width: 44px; height: 44px;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .feature-item-title { font-weight: 600; font-size: 15px; color: var(--text); margin-bottom: 3px; }
        .feature-item-body { font-size: 14px; color: #888; line-height: 1.6; }
        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        .metric-card {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 20px;
          padding: 28px 26px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .metric-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.09); }
        .metric-value {
          font-family: var(--serif);
          font-size: 46px;
          font-weight: 400;
          line-height: 1;
          margin-bottom: 10px;
          letter-spacing: -0.03em;
        }
        .metric-label { font-size: 13px; color: var(--muted); line-height: 1.5; }

        /* ── PRICING ── */
        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          max-width: 760px;
          margin: 0 auto;
        }
        .pricing-free {
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 24px;
          padding: 40px 36px;
        }
        .pricing-popular {
          background: var(--bg-dark);
          border-radius: 24px;
          padding: 40px 36px;
          position: relative;
        }
        .pricing-popular::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #059669, #0ea5e9, #8b5cf6);
          border-radius: 26px;
          z-index: -1;
        }
        .pricing-tier-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .pricing-price {
          font-family: var(--serif);
          font-size: 58px;
          font-weight: 400;
          line-height: 1;
          margin-bottom: 4px;
          letter-spacing: -0.03em;
        }
        .pricing-desc { font-size: 14px; margin-bottom: 32px; }
        .pricing-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .check-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(5,150,105,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #059669;
          font-size: 10px;
          font-weight: 700;
        }
        .cross-icon {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(0,0,0,0.06);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: #ccc;
          font-size: 10px;
        }
        .pricing-btn {
          display: block;
          margin-top: 32px;
          padding: 14px 0;
          border-radius: 12px;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          font-family: var(--sans);
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .pricing-btn-outline {
          background: transparent;
          border: 1.5px solid #222;
          color: var(--text);
        }
        .pricing-btn-outline:hover { background: rgba(0,0,0,0.04); }
        .popular-chip {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          padding: 2px 10px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.06em;
          margin-left: 8px;
        }

        /* ── FAQ ── */
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: -0.01em;
          font-family: var(--sans);
          gap: 16px;
        }
        .faq-icon {
          font-size: 22px;
          color: #888;
          transition: transform 0.3s ease;
          flex-shrink: 0;
          line-height: 1;
        }
        .faq-icon.open { transform: rotate(45deg); }
        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease, padding 0.35s ease;
          font-size: 15px;
          color: var(--muted);
          line-height: 1.75;
          max-height: 0;
          opacity: 0;
          padding-bottom: 0;
        }
        .faq-answer.open { max-height: 240px; opacity: 1; padding-bottom: 24px; }

        /* ── FINAL CTA ── */
        .final-cta {
          padding: 120px 24px;
          background: var(--bg-dark);
          position: relative;
          overflow: hidden;
        }
        .final-cta-orb {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 400px;
          background: radial-gradient(ellipse, rgba(5,150,105,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-input-wrap {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 7px;
          display: flex;
          gap: 8px;
          max-width: 520px;
          margin: 0 auto 20px;
        }
        .cta-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 15px;
          color: white;
          padding: 12px 14px;
          font-family: var(--sans);
          min-width: 0;
        }
        .cta-input::placeholder { color: #666; }

        /* ── FOOTER ── */
        .footer {
          background: #0a0a0a;
          border-top: 1px solid #1f1f1f;
          padding: 40px 24px;
        }
        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        .footer-logo { font-family: var(--serif); font-size: 20px; color: white; text-decoration: none; }
        .footer-links { display: flex; gap: 28px; flex-wrap: wrap; }
        .footer-link {
          font-size: 13px;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: white; }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .header-nav { display: none; }
          .hamburger { display: flex; }

          .hero { padding: 90px 20px 60px; min-height: unset; }
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-title { font-size: clamp(38px, 9vw, 56px); }
          .hero-subtitle { font-size: 16px; max-width: 100%; }
          .input-wrap { flex-wrap: wrap; }
          .input-btn { width: 100%; }
          .input-btn .btn-green { width: 100%; justify-content: center; }
          .preview-float-label { font-size: 10px; padding: 5px 12px; }
          .mockup-body { height: 300px; }

          .section { padding: 80px 20px; }
          .steps-grid { grid-template-columns: 1fr; gap: 18px; }
          .step-card { padding: 32px 28px; }
          .testi-grid { grid-template-columns: 1fr; gap: 18px; }
          .features-grid { grid-template-columns: 1fr; gap: 48px; }
          .metrics-grid { grid-template-columns: 1fr 1fr; }
          .pricing-grid { grid-template-columns: 1fr; gap: 18px; }
          .pricing-free, .pricing-popular { padding: 32px 28px; }
          .section-heading { font-size: clamp(30px, 7vw, 48px); }

          .final-cta { padding: 80px 20px; }
          .cta-input-wrap { flex-wrap: wrap; }
          .cta-input-wrap .btn-green { width: 100%; justify-content: center; }

          .footer-inner { flex-direction: column; align-items: flex-start; }
          .footer-links { gap: 20px; }
        }

        @media (max-width: 540px) {
          .hero-badge { font-size: 10px; }
          .hero-title { font-size: clamp(34px, 10vw, 50px); }
          .trust-row { gap: 12px; }
          .metrics-grid { grid-template-columns: 1fr; }
          .testi-card { padding: 24px 22px; }
          .pricing-popular::before { display: none; }
          .pricing-popular { border: 2px solid #059669; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          <a href="/" className="logo">AutopilotAI</a>
          <nav className="header-nav">
            <a href="/login" className="nav-link">Sign in</a>
            <a href="/upgrade" className="btn-primary">Get started free</a>
          </nav>
          <button
            className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <a href="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Sign in</a>
        <a href="/upgrade" className="btn-primary" onClick={() => setMobileMenuOpen(false)}>Get started free →</a>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-orb-1" />
        <div className="hero-bg-orb-2" />

        <div className="hero-grid">
          {/* Left: copy */}
          <div>
            <div className={`hidden-init ${heroVisible ? "anim-fade-up d1" : ""}`}>
              <div className="hero-badge">
                <span>✦</span>
                AI Website Builder
              </div>
            </div>

            <h1 className={`hero-title hidden-init ${heroVisible ? "anim-fade-up d2" : ""}`}>
              Your professional
              <br />
              <em>website</em>,{" "}
              <br style={{ display: "none" }} />
              built in 60 seconds.
            </h1>

            <p className={`hero-subtitle hidden-init ${heroVisible ? "anim-fade-up d3" : ""}`}>
              Describe your business. AI builds a conversion-optimized,
              professional website. Edit anything. Publish for{" "}
              <strong>$10/month</strong> — or start free, forever.
            </p>

            <div className={`hidden-init ${heroVisible ? "anim-fade-up d4" : ""}`}>
              <div className="input-wrap">
                <input
                  ref={inputRef}
                  className="hero-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTry()}
                  placeholder={placeholderTexts[placeholderIndex]}
                />
                <div className="input-btn">
                  <button onClick={handleTry} className="btn-green">
                    Build my site →
                  </button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#888", marginBottom: 44 }}>
                No credit card · No design skills · Takes 2 minutes
              </p>

              <div className="trust-row">
                <div className="avatars">
                  {[
                    ["SC", "#059669"], ["MR", "#f59e0b"], ["LT", "#8b5cf6"],
                    ["JP", "#0ea5e9"], ["AW", "#ef4444"],
                  ].map(([initials, color], i) => (
                    <div key={i} className="avatar" style={{ background: color }}>
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="trust-text-title">2,847 businesses launched</div>
                  <div className="trust-text-sub">⭐⭐⭐⭐⭐ 4.9 avg rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: preview mockup */}
          <div className="preview-wrap">
            <div className="preview-float-label">
              <span className="live-dot" />
              LIVE PREVIEW — AI GENERATING
            </div>

            <div className="mockup-card">
              <div className="browser-bar">
                <div className="browser-dots">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div key={i} className="browser-dot" style={{ background: c }} />
                  ))}
                </div>
                <div className="browser-url">
                  <span style={{ color: "#22c55e", fontSize: 10 }}>🔒</span>
                  {SITE_EXAMPLES[activeExample].label.toLowerCase().replace(/\s+/g, "")}.com
                </div>
              </div>

              <div className="mockup-body">
                {SITE_EXAMPLES.map((ex, i) => (
                  <div
                    key={i}
                    className="mockup-slide"
                    style={{ opacity: activeExample === i ? 1 : 0 }}
                  >
                    <div style={{
                      background: `linear-gradient(135deg, ${ex.color}18, ${ex.color}06)`,
                      borderRadius: 12,
                      padding: "20px 22px",
                      marginBottom: 14,
                      borderLeft: `4px solid ${ex.color}`,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: ex.color, marginBottom: 7, textTransform: "uppercase" }}>
                        {ex.icon} Professional {ex.label.split(" ")[0]} Services
                      </div>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 400, color: "#111", lineHeight: 1.2, marginBottom: 9, letterSpacing: "-0.02em" }}>
                        The #1 Trusted {ex.label}{" "}
                        <em style={{ color: ex.color }}>You Can Rely On</em>
                      </div>
                      <div style={{ fontSize: 11, color: "#777", marginBottom: 13, lineHeight: 1.6 }}>
                        Serving customers since 2019. Licensed, insured & 5-star rated.
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ background: ex.color, color: "white", padding: "7px 14px", borderRadius: 7, fontSize: 11, fontWeight: 700 }}>Get Free Quote</div>
                        <div style={{ border: `1.5px solid ${ex.color}40`, color: ex.color, padding: "7px 14px", borderRadius: 7, fontSize: 11, fontWeight: 600 }}>See Our Work</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
                      {["Licensed & Insured", "5★ Reviews", "Same Day"].map((feat, fi) => (
                        <div key={fi} style={{ background: "#f8f8f8", borderRadius: 8, padding: "11px 8px", textAlign: "center" }}>
                          <div style={{ fontSize: 15, marginBottom: 4 }}>{["✅","⭐","⚡"][fi]}</div>
                          <div style={{ fontSize: 9, color: "#555", fontWeight: 600 }}>{feat}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14 }}>
                      {[80, 65, 90].map((w, pi) => (
                        <div key={pi} style={{ height: 4, background: "#f0f0f0", borderRadius: 4, marginBottom: 6, overflow: "hidden" }}>
                          <div style={{ width: `${w}%`, height: "100%", background: ex.color, borderRadius: 4, opacity: 0.4 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mockup-tabs">
                {SITE_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveExample(i)}
                    className="mockup-tab"
                    style={{
                      borderColor: activeExample === i ? ex.color : "#ddd",
                      background: activeExample === i ? `${ex.color}18` : "transparent",
                      color: activeExample === i ? ex.color : "#999",
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="preview-time-badge">
              <span style={{ fontSize: 16 }}>⚡</span> Built in 47 seconds
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-outer">
        <div style={{ overflow: "hidden" }}>
          <div className="marquee-track">
            {[
              "2,847 websites built",
              "$4.2M+ revenue generated",
              "4.9 ★ average rating",
              "No coding required",
              "Publish in under 5 minutes",
              "14-day free trial",
              "Cancel anytime",
              "2,847 websites built",
              "$4.2M+ revenue generated",
              "4.9 ★ average rating",
              "No coding required",
              "Publish in under 5 minutes",
              "14-day free trial",
              "Cancel anytime",
            ].map((item, i) => (
              <div
                key={i}
                className="marquee-item"
                style={{ color: i % 3 === 0 ? "#059669" : "#888" }}
              >
                {item}
                <span className="marquee-sep">◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-center">
            <div className="section-label">The process</div>
            <h2 className="section-heading">
              From zero to live in <em style={{ color: "#059669" }}>three steps</em>
            </h2>
            <p className="section-sub">No designers. No developers. No headaches.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: "01", title: "Describe your business", body: 'Spend 60 seconds telling us what you do. "I\'m a fitness trainer in NYC specializing in weight loss for busy professionals." That\'s all it takes.', icon: "✍️", accent: "#059669" },
              { n: "02", title: "AI builds your site", body: "Our AI writes your copy, designs your layout, and structures your pages for conversions — all tailored to your industry.", icon: "🤖", accent: "#0ea5e9" },
              { n: "03", title: "Edit, then publish", body: "Click any element to tweak it. Add your logo. Regenerate sections you don't love. When you're ready, hit publish.", icon: "🚀", accent: "#8b5cf6" },
            ].map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-ghost-num">{step.n}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-divider" style={{ background: step.accent }} />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section section-dark">
        <div style={{ position: "absolute", top: -80, left: "30%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="section-inner" style={{ position: "relative" }}>
          <div style={{ marginBottom: 60 }}>
            <div className="section-label">Proof it works</div>
            <h2 className="section-heading">
              Real businesses.{" "}
              <em style={{ color: "#4ade80" }}>Real results.</em>
            </h2>
            <p className="section-sub">Not cherry-picked. These are our last three featured reviews.</p>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testi-card">
                <div className="testi-revenue">{t.revenue}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: "#FAFAF8" }}>
        <div className="section-inner">
          <div className="features-grid">
            <div>
              <div className="section-label">What's included</div>
              <h2 className="section-heading">
                Everything built in.
                <br />
                <em style={{ color: "#0ea5e9" }}>Nothing left out.</em>
              </h2>
              <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, maxWidth: 420 }}>
                You shouldn't have to stitch together five tools to have a working website. AutopilotAI includes everything you need to get customers.
              </p>
              <div className="feature-list">
                {[
                  { icon: "✏️", title: "Click-to-edit anything", body: "Change text, images, colors, or layout without touching code." },
                  { icon: "📊", title: "Built-in analytics", body: "See visitor numbers, top pages, and where people click." },
                  { icon: "📬", title: "Lead capture forms", body: "Automatically collect emails and enquiries. No plugin needed." },
                  { icon: "🌐", title: "Custom domain", body: "Publish to yourcompany.com, not a subdomain nobody trusts." },
                ].map((f, i) => (
                  <div key={i} className="feature-item">
                    <div className="feature-icon-wrap">{f.icon}</div>
                    <div>
                      <div className="feature-item-title">{f.title}</div>
                      <div className="feature-item-body">{f.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="metrics-grid">
              {[
                { metric: "60s", label: "Average time to first website", color: "#059669" },
                { metric: "$10", label: "Per month to publish with custom domain", color: "#0ea5e9" },
                { metric: "100%", label: "Mobile responsive, guaranteed", color: "#8b5cf6" },
                { metric: "4.9★", label: "Average customer rating", color: "#f59e0b" },
              ].map((m, i) => (
                <div key={i} className="metric-card">
                  <div className="metric-value" style={{ color: m.color }}>{m.metric}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section" style={{ background: "white", borderTop: "1px solid var(--border)" }}>
        <div className="section-inner-md">
          <div className="section-center">
            <div className="section-label">Pricing</div>
            <h2 className="section-heading">
              Straightforward pricing.
              <br />
              <em style={{ color: "#059669" }}>No surprises.</em>
            </h2>
            <p className="section-sub">
              Create and edit everything for free. Pay only when you're ready to publish.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Free */}
            <div className="pricing-free">
              <div className="pricing-tier-label" style={{ color: "#888" }}>Free Forever</div>
              <div className="pricing-price">$0</div>
              <div className="pricing-desc" style={{ color: "#888" }}>Create and explore, always free</div>
              {([
                [true, "Build 1 website"],
                [true, "Unlimited edits"],
                [true, "10 AI content generations"],
                [true, "Mobile responsive"],
                [false, "Custom domain"],
                [false, "Publish publicly"],
              ] as [boolean, string][]).map(([yes, label], i) => (
                <div key={i} className="pricing-feature" style={{ color: yes ? "#111" : "#bbb" }}>
                  <div className={yes ? "check-icon" : "cross-icon"}>{yes ? "✓" : "✕"}</div>
                  {label}
                </div>
              ))}
              <a href="/upgrade" className="pricing-btn pricing-btn-outline">Start building free</a>
            </div>

            {/* Starter */}
            <div className="pricing-popular">
              <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
                <div className="pricing-tier-label" style={{ color: "#aaa", marginBottom: 0 }}>Starter</div>
                <span className="popular-chip">MOST POPULAR</span>
              </div>
              <div className="pricing-price" style={{ color: "white" }}>
                $10<span style={{ fontSize: 20, color: "#888" }}>/mo</span>
              </div>
              <div className="pricing-desc" style={{ color: "#888" }}>14-day free trial · cancel anytime</div>
              {[
                "Publish your website",
                "Custom domain (yourco.com)",
                "Unlimited AI generations",
                "20 AI images/month",
                "Advanced analytics",
                "Priority support",
              ].map((label, i) => (
                <div key={i} className="pricing-feature" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(5,150,105,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#4ade80", fontSize: 10, fontWeight: 700 }}>✓</div>
                  {label}
                </div>
              ))}
              <a href="/upgrade" className="pricing-btn btn-green">Start free trial →</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section" style={{ borderTop: "1px solid var(--border)", background: "#FAFAF8" }}>
        <div className="section-inner-sm">
          <h2 className="section-heading" style={{ textAlign: "center", marginBottom: 56 }}>Common questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className={`faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
              </button>
              <div className={`faq-answer ${openFaq === i ? "open" : ""}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="final-cta-orb" />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(38px, 5vw, 62px)", fontWeight: 400, letterSpacing: "-0.03em", color: "white", marginBottom: 20, lineHeight: 1.06 }}>
            Your customers are searching
            <br />
            <em style={{ color: "#4ade80" }}>right now.</em>
          </h2>
          <p style={{ fontSize: 17, color: "#888", marginBottom: 48, lineHeight: 1.65 }}>
            Don't let them land on a competitor's site. Get professional online in the next 10 minutes — free to start.
          </p>

          <div className="cta-input-wrap">
            <input
              className="cta-input"
              placeholder="Describe your business..."
            />
            <a href="/upgrade" className="btn-green">Build it free →</a>
          </div>

          <p style={{ fontSize: 13, color: "#555" }}>
            ✓ No credit card &nbsp;&nbsp; ✓ 2 minutes &nbsp;&nbsp; ✓ Try before you pay
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="/" className="footer-logo">AutopilotAI</a>
          <div className="footer-links">
            {["Terms", "Privacy", "Contact", "Twitter"].map((link) => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}