"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicUpgradePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState("U");
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const token =
      localStorage.getItem("autopilot_token") ||
      sessionStorage.getItem("autopilot_token");

    if (!token) { setAuthLoading(false); return; }

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://autopilotai-api.onrender.com"}/api/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(r => r.json())
      .then(data => {
        if (data?.name) {
          setIsLoggedIn(true);
          setUserName(data.name);
          setUserInitial(data.name.charAt(0).toUpperCase());
          setCurrentPlan((data.subscription || "free").toLowerCase());
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  const subscribe = async (plan: "starter" | "pro") => {
    const token =
      localStorage.getItem("autopilot_token") ||
      sessionStorage.getItem("autopilot_token");

    if (!token) { router.push(`/register?plan=${plan}`); return; }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://autopilotai-api.onrender.com"}/api/stripe/create-checkout-session?plan=${plan}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      window.location.href = data.checkout_url;
    } catch {
      alert("Could not start checkout. Try again.");
    }
  };

  const FAQS = [
    { q: "Can I try it free first?", a: "Yes. Create your free account, build your website, edit everything — upgrade only when you're ready to publish. No credit card required." },
    { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your dashboard anytime, no questions asked. You keep access through the end of your billing period." },
    { q: "What happens if I downgrade?", a: "Your website stays live for the current billing period, then returns to draft mode. All your content is saved — nothing is deleted." },
    { q: "Do I need to bring my own domain?", a: "No. We help you connect any domain you own, or you can purchase one directly. The Starter plan includes full custom domain support." },
  ];

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #060608;
          --bg2: #0C0C10;
          --surface: #111116;
          --surface2: #18181F;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --text: #F0EEF8;
          --text2: #8A8899;
          --text3: #555465;
          --accent: #6EE7B7;
          --accent2: #818CF8;
          --display: 'Fraunces', Georgia, serif;
          --body: 'DM Sans', sans-serif;
        }

        .root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--body);
          overflow-x: hidden;
        }

        /* Noise */
        .root::after {
          content: '';
          position: fixed; inset: 0; z-index: 9999; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.5;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes glowPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

        .fu1 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .fu2 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .fu3 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .fu4 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .fu5 { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
        .preinit { opacity: 0; }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 200;
          height: 60px; padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(6,6,8,0.9); backdrop-filter: blur(24px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: var(--display); font-size: 20px; font-weight: 400;
          color: var(--text); text-decoration: none; font-style: italic;
          display: flex; align-items: center; gap: 8px;
        }
        .logo-pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease infinite; flex-shrink: 0; }
        .nav-right { display: flex; gap: 8px; align-items: center; }
        .nav-link { font-size: 13px; font-weight: 500; color: var(--text2); text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: color 0.2s, background 0.2s; }
        .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
        .nav-cta {
          font-size: 13px; font-weight: 600; background: var(--accent); color: #060608;
          padding: 9px 18px; border-radius: 10px; text-decoration: none;
          transition: filter 0.2s, transform 0.15s; letter-spacing: -0.01em;
          display: flex; align-items: center; gap: 6px;
        }
        .nav-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .nav-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          color: #060608; font-size: 12px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .nav-user { display: flex; align-items: center; gap: 8px; }
        .nav-username { font-size: 13px; font-weight: 600; color: var(--text); }
        .nav-plan-badge {
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
          padding: 2px 7px; border-radius: 100px;
        }
        .badge-free { background: rgba(255,255,255,0.06); color: var(--text3); }
        .badge-paid { background: rgba(110,231,183,0.12); color: var(--accent); }

        /* ── LOGGED-IN BANNER ── */
        .plan-banner {
          background: rgba(110,231,183,0.05);
          border-bottom: 1px solid rgba(110,231,183,0.1);
          padding: 10px 24px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 13px; color: var(--accent); font-weight: 400;
        }
        .banner-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease infinite; flex-shrink: 0; }

        /* ── HERO ── */
        .hero {
          padding: 88px 40px 72px; text-align: center;
          position: relative; overflow: hidden;
        }
        .hero-glow {
          position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
          width: 700px; height: 500px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(110,231,183,0.07) 0%, transparent 65%);
          pointer-events: none; animation: glowPulse 4s ease-in-out infinite;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 60% 70% at 50% 30%, black 20%, transparent 100%);
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(110,231,183,0.08); border: 1px solid rgba(110,231,183,0.18);
          border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 600; color: var(--accent);
          letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 28px;
          position: relative; z-index: 1;
        }
        .eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease infinite; }
        .hero-h1 {
          font-family: var(--display); font-size: clamp(44px, 6vw, 80px);
          font-weight: 300; line-height: 1.0; letter-spacing: -0.03em;
          color: var(--text); margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .hero-h1 em { font-style: italic; color: var(--accent); }
        .hero-sub {
          font-size: 16px; font-weight: 300; color: var(--text2);
          line-height: 1.75; max-width: 440px; margin: 0 auto;
          position: relative; z-index: 1;
        }

        /* ── PLANS GRID ── */
        .plans-section { padding: 0 40px 100px; }
        .plans-grid {
          max-width: 1020px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.06fr 1fr;
          gap: 16px; align-items: start;
        }

        /* Free card */
        .card {
          border-radius: 24px; padding: 36px;
          border: 1px solid var(--border);
          background: var(--surface);
          position: relative;
          transition: border-color 0.25s, transform 0.25s;
        }
        .card:hover { border-color: var(--border2); transform: translateY(-2px); }

        /* Starter card */
        .card-star {
          border-radius: 26px; padding: 38px;
          position: relative;
          background: var(--surface2);
          margin-top: -10px; margin-bottom: -10px;
          transition: transform 0.25s;
        }
        .card-star::before {
          content: '';
          position: absolute; inset: -1.5px; border-radius: 27px; z-index: -1;
          background: linear-gradient(135deg, var(--accent), var(--accent2), #F472B6);
          opacity: 0.6;
        }
        .card-star:hover { transform: translateY(-3px); }
        .card-star::after {
          content: '';
          position: absolute; inset: 0; border-radius: 26px; z-index: 0;
          background: radial-gradient(ellipse at 60% 0%, rgba(110,231,183,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .card-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          font-size: 9px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 4px 14px; border-radius: 100px; white-space: nowrap;
        }
        .badge-popular { background: var(--accent); color: #060608; }
        .badge-current { background: rgba(110,231,183,0.15); color: var(--accent); border: 1px solid rgba(110,231,183,0.3); }

        .card-tier { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text3); margin-bottom: 18px; }
        .card-tier-star { color: rgba(255,255,255,0.35); }
        .card-price {
          font-family: var(--display); font-size: 58px; font-weight: 300;
          line-height: 1; letter-spacing: -0.03em; font-style: italic;
          color: var(--text); margin-bottom: 6px;
        }
        .card-price-accent { color: var(--accent); }
        .card-period { font-size: 13px; font-weight: 300; color: var(--text3); margin-bottom: 28px; }

        .card-highlight {
          display: inline-block;
          background: rgba(110,231,183,0.1); color: var(--accent);
          border: 1px solid rgba(110,231,183,0.2);
          padding: 3px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
          margin-bottom: 26px;
        }

        .feat-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .feat-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 300; }
        .feat-on { color: var(--text); }
        .feat-off { color: var(--text3); }
        .feat-check {
          width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 800;
        }
        .fc-y { background: rgba(110,231,183,0.12); color: var(--accent); }
        .fc-n { background: rgba(255,255,255,0.04); color: var(--text3); }
        .fc-y-bright { background: rgba(110,231,183,0.2); color: var(--accent); }

        /* Buttons */
        .btn {
          display: block; width: 100%; padding: 14px 0; border-radius: 12px;
          text-align: center; text-decoration: none; font-family: var(--body);
          font-size: 13px; font-weight: 700; letter-spacing: 0.01em;
          cursor: pointer; border: none; transition: all 0.2s;
        }
        .btn-outline {
          background: transparent; color: var(--text2);
          border: 1px solid var(--border2);
        }
        .btn-outline:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .btn-outline:disabled { opacity: 0.4; cursor: default; }
        .btn-accent {
          background: var(--accent); color: #060608;
          position: relative; z-index: 1;
        }
        .btn-accent:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 28px rgba(110,231,183,0.25); }
        .btn-ghost-muted {
          background: rgba(255,255,255,0.05); color: var(--text2);
          border: 1px solid var(--border);
        }
        .btn-ghost-muted:hover { background: rgba(255,255,255,0.08); color: var(--text); }

        /* ── TRUST ── */
        .trust { padding: 0 40px 80px; }
        .trust-inner {
          max-width: 700px; margin: 0 auto;
          display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;
        }
        .trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 300; color: var(--text3); }
        .trust-icon { font-size: 15px; }

        /* ── FAQ ── */
        .faq { padding: 0 40px 120px; }
        .faq-inner { max-width: 620px; margin: 0 auto; }
        .faq-header { text-align: center; margin-bottom: 56px; }
        .faq-h {
          font-family: var(--display); font-size: clamp(32px, 4vw, 48px);
          font-weight: 300; font-style: italic; letter-spacing: -0.03em; color: var(--text);
        }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-btn {
          width: 100%; background: none; border: none;
          padding: 20px 0; display: flex; justify-content: space-between; align-items: center;
          cursor: pointer; text-align: left; font-size: 14px; font-weight: 500;
          color: var(--text); font-family: var(--body); gap: 20px; letter-spacing: -0.01em;
        }
        .faq-icon { font-size: 18px; color: var(--text3); transition: transform 0.3s, color 0.2s; flex-shrink: 0; line-height: 1; }
        .faq-icon.open { transform: rotate(45deg); color: var(--accent); }
        .faq-body {
          overflow: hidden; max-height: 0; opacity: 0;
          transition: max-height 0.35s ease, opacity 0.3s, padding 0.3s;
          font-size: 14px; font-weight: 300; color: var(--text2); line-height: 1.8;
        }
        .faq-body.open { max-height: 200px; opacity: 1; padding-bottom: 20px; }

        /* ── FOOTER ── */
        .footer { background: #030304; border-top: 1px solid var(--border); padding: 32px 40px; }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-family: var(--display); font-size: 18px; color: var(--text2); text-decoration: none; font-weight: 300; font-style: italic; }
        .footer-links { display: flex; gap: 24px; }
        .footer-link { font-size: 12px; color: var(--text3); text-decoration: none; font-weight: 300; transition: color 0.2s; }
        .footer-link:hover { color: var(--text2); }

        /* ── MOBILE ── */
        @media (max-width: 900px) {
          .nav { padding: 0 20px; }
          .hero { padding: 72px 20px 56px; }
          .plans-section { padding: 0 20px 80px; }
          .plans-grid { grid-template-columns: 1fr; }
          .card-star { margin: 0; }
          .trust { padding: 0 20px 60px; }
          .trust-inner { gap: 20px; }
          .faq { padding: 0 20px 80px; }
          .footer { padding: 24px 20px; }
          .nav-username { display: none; }
        }
      `}</style>

      {/* LOGGED-IN BANNER */}
      {isLoggedIn && !authLoading && (
        <div className="plan-banner">
          <span className="banner-dot" />
          Signed in as <strong style={{ fontWeight: 600 }}>{userName}</strong>
          {currentPlan && currentPlan !== "free" && (
            <> · Plan: <strong style={{ fontWeight: 600, textTransform: "capitalize" }}>{currentPlan}</strong></>
          )}
        </div>
      )}

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <span className="logo-pulse" />
          AutopilotAI
        </a>
        <div className="nav-right">
          {authLoading ? (
            <div style={{ width: 100, height: 32, borderRadius: 10, background: "var(--surface2)" }} />
          ) : isLoggedIn ? (
            <>
              <div className="nav-user">
                <div className="nav-avatar">{userInitial}</div>
                <span className="nav-username">{userName?.split(" ")[0]}</span>
                <span className={`nav-plan-badge ${currentPlan && currentPlan !== "free" ? "badge-paid" : "badge-free"}`}>
                  {currentPlan || "free"}
                </span>
              </div>
              <a href="/dashboard" className="nav-cta">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Dashboard
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link">Sign in</a>
              <a href="/register" className="nav-cta">Get started free</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className={mounted ? "fu1" : "preinit"}>
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            {isLoggedIn && currentPlan && currentPlan !== "free" ? "Manage your plan" : "Choose your plan"}
          </div>
        </div>
        <h1 className={`hero-h1 ${mounted ? "fu2" : "preinit"}`}>
          {isLoggedIn ? (
            <>Your plan,<br /><em>your choice.</em></>
          ) : (
            <>Start free.<br /><em>Publish when ready.</em></>
          )}
        </h1>
        <p className={`hero-sub ${mounted ? "fu3" : "preinit"}`}>
          {isLoggedIn
            ? "Build and edit for free. Upgrade whenever you're ready to go live with your own domain."
            : "Build and edit your entire website for free. Pay only when you're ready to go live."}
        </p>
      </section>

      {/* PLANS */}
      <section className="plans-section">
        <div className={`plans-grid ${mounted ? "fu4" : "preinit"}`}>

          {/* FREE */}
          <div className="card" style={{ position: "relative" }}>
            {currentPlan === "free" && isLoggedIn && (
              <div className="card-badge badge-current">✓ Current plan</div>
            )}
            <div className="card-tier">Free forever</div>
            <div className="card-price">$0</div>
            <div className="card-period">Create and explore — always free</div>
            <div className="feat-list">
              {([
                [true,  "Build 1 website"],
                [true,  "Unlimited edits"],
                [true,  "10 AI generations"],
                [true,  "Mobile responsive preview"],
                [false, "Publish publicly"],
                [false, "Custom domain"],
                [false, "AI image generation"],
              ] as [boolean,string][]).map(([y,l],i) => (
                <div key={i} className={`feat-row ${y?"feat-on":"feat-off"}`}>
                  <div className={`feat-check ${y?"fc-y":"fc-n"}`}>{y?"✓":"✕"}</div>
                  {l}
                </div>
              ))}
            </div>
            {isLoggedIn ? (
              currentPlan === "free" ? (
                <button className="btn btn-outline" disabled>Current plan</button>
              ) : (
                <a href="/dashboard" className="btn btn-outline">Back to dashboard</a>
              )
            ) : (
              <a href="/register" className="btn btn-outline">Start building free</a>
            )}
          </div>

          {/* STARTER */}
          <div className="card-star" style={{ position: "relative" }}>
            {currentPlan === "starter" && isLoggedIn ? (
              <div className="card-badge badge-current">✓ Current plan</div>
            ) : (
              <div className="card-badge badge-popular">★ Most popular</div>
            )}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="card-tier card-tier-star">Starter</div>
              <div className="card-price card-price-accent">
                $10<span style={{ fontSize: 22, color: "var(--text3)", fontStyle: "normal" }}>/mo</span>
              </div>
              <div className="card-period">14-day free trial · cancel anytime</div>
              <div className="card-highlight">Most businesses pick this</div>
              <div className="feat-list">
                {[
                  "Everything in Free",
                  "Publish your website",
                  "Custom domain (yourco.com)",
                  "Unlimited AI generations",
                  "AI image generation",
                  "Advanced analytics",
                  "Priority support",
                ].map((l,i) => (
                  <div key={i} className="feat-row feat-on">
                    <div className="feat-check fc-y-bright">✓</div>
                    {l}
                  </div>
                ))}
              </div>
              {currentPlan === "starter" && isLoggedIn ? (
                <a href="/dashboard" className="btn btn-accent">Go to dashboard →</a>
              ) : (
                <button onClick={() => subscribe("starter")} className="btn btn-accent">
                  {isLoggedIn ? "Upgrade to Starter →" : "Start 14-day free trial →"}
                </button>
              )}
              {!(currentPlan === "starter" && isLoggedIn) && (
                <p style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 10, fontWeight: 300 }}>
                  No credit card required
                </p>
              )}
            </div>
          </div>

          {/* PRO */}
          <div className="card" style={{ position: "relative" }}>
            {currentPlan === "pro" && isLoggedIn && (
              <div className="card-badge badge-current">✓ Current plan</div>
            )}
            <div className="card-tier">Pro</div>
            <div className="card-price">
              $20<span style={{ fontSize: 22, color: "var(--text3)", fontStyle: "normal", fontFamily: "var(--body)", fontWeight: 300 }}>/mo</span>
            </div>
            <div className="card-period">For power users & agencies</div>
            <div className="feat-list">
              {[
                "Everything in Starter",
                "3 websites",
                "Extended AI image quota",
                "Dedicated support",
                "Early access to features",
              ].map((l,i) => (
                <div key={i} className="feat-row feat-on">
                  <div className="feat-check fc-y">✓</div>
                  {l}
                </div>
              ))}
            </div>
            {currentPlan === "pro" && isLoggedIn ? (
              <a href="/dashboard" className="btn btn-ghost-muted">Go to dashboard</a>
            ) : (
              <button onClick={() => subscribe("pro")} className="btn btn-ghost-muted">
                {isLoggedIn ? "Upgrade to Pro" : "Get Pro"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <div className={`trust ${mounted ? "fu5" : "preinit"}`}>
        <div className="trust-inner">
          {[
            { icon: "🔒", text: "Secure checkout via Stripe" },
            { icon: "↩️", text: "Cancel anytime, no questions" },
            { icon: "✉️", text: "Support within 24 hours" },
          ].map((item,i) => (
            <div key={i} className="trust-item">
              <span className="trust-icon">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <section className="faq">
        <div className="faq-inner">
          <div className="faq-header">
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 16 }}>FAQ</div>
            <h2 className="faq-h">Common questions</h2>
          </div>
          {FAQS.map((f,i) => (
            <div key={i} className="faq-item">
              <button className="faq-btn" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                {f.q}
                <span className={`faq-icon ${openFaq===i?"open":""}`}>+</span>
              </button>
              <div className={`faq-body ${openFaq===i?"open":""}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <a href="/" className="footer-logo">AutopilotAI</a>
          <div className="footer-links">
            {["Terms","Privacy","Contact"].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}