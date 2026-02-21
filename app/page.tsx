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
    bg: "from-violet-500 to-indigo-500",
  },
  {
    name: "Mike Rodriguez",
    role: "Marketing Consultant",
    location: "Texas",
    text: "Spent $0 on design. Got 3 new clients the first month. ROI on $10/mo is genuinely absurd.",
    revenue: "+$8,500/mo",
    initials: "MR",
    bg: "from-amber-500 to-orange-500",
  },
  {
    name: "Lisa Thompson",
    role: "Plumbing Business Owner",
    location: "Ohio",
    text: "I'm not tech savvy at all. Created my whole site in 5 minutes. My phone hasn't stopped ringing.",
    revenue: "+$12,000/mo",
    initials: "LT",
    bg: "from-emerald-500 to-teal-500",
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHeroVisible(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setActiveExample((prev) => (prev + 1) % SITE_EXAMPLES.length);
    }, 2200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleTry = () => {
    window.location.href = `/upgrade?prompt=${encodeURIComponent(inputValue)}`;
  };

  const placeholderTexts = [
    "I'm a fitness trainer in NYC...",
    "I run a pet grooming salon...",
    "I'm a freelance photographer...",
    "I own a restaurant in Miami...",
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen text-gray-900"
      style={{
        background: "#FAFAF8",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        * { box-sizing: border-box; }
        
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-8px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .animate-fadeUp { animation: fadeUp 0.7s ease forwards; }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        .anim-d1 { animation-delay: 0.1s; }
        .anim-d2 { animation-delay: 0.25s; }
        .anim-d3 { animation-delay: 0.4s; }
        .anim-d4 { animation-delay: 0.55s; }
        .opacity-0-init { opacity: 0; }

        .hero-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
        }

        .cta-btn {
          position: relative;
          overflow: hidden;
          background: #111;
          color: white;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
        }
        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .emerald-btn {
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
        }
        .emerald-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(5, 150, 105, 0.4);
          filter: brightness(1.08);
        }

        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }

        .testimonial-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.12);
        }

        .marquee-track {
          animation: marquee 20s linear infinite;
          display: flex;
          gap: 0;
        }

        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease;
        }

        .live-preview {
          background: white;
          border-radius: 16px;
          box-shadow: 0 40px 120px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .browser-bar {
          background: #f0f0f0;
          border-bottom: 1px solid #e0e0e0;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .badge-new {
          background: linear-gradient(135deg, #059669, #0ea5e9);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: white;
          padding: 4px 10px;
          border-radius: 100px;
        }

        .step-number {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 72px;
          line-height: 1;
          color: #111;
          opacity: 0.08;
          position: absolute;
          top: -16px;
          left: 20px;
          user-select: none;
        }

        .divider-line {
          width: 48px;
          height: 2px;
          background: #111;
        }

        .metric-block {
          border-left: 3px solid;
          padding-left: 20px;
        }

        .noise-bg {
          position: relative;
        }
        .noise-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        section { position: relative; }

        .pricing-popular {
          background: #111;
          color: white;
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

        .check-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(5, 150, 105, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #059669;
          font-size: 11px;
          font-weight: 700;
        }

        .cross-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #9ca3af;
          font-size: 11px;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s ease",
          backgroundColor: isScrolled ? "rgba(250,250,248,0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="font-display"
            style={{ fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em", color: "#111" }}
          >
            AutopilotAI
          </div>
          <nav
            className="font-sans"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <a
              href="/login"
              style={{
                padding: "8px 16px",
                fontSize: 14,
                color: "#555",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#111")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
            >
              Sign in
            </a>
            <a
              href="/upgrade"
              className="cta-btn font-sans"
              style={{
                padding: "9px 20px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 10,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Get started free
            </a>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 80,
          paddingBottom: 80,
          overflow: "hidden",
        }}
      >
        {/* Subtle background decorations */}
        <div
          style={{
            position: "absolute",
            top: 120,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left: copy */}
          <div>
            <div
              className={`font-sans opacity-0-init ${heroVisible ? "animate-fadeUp anim-d1" : ""}`}
              style={{ marginBottom: 24 }}
            >
              <span className="badge-new">AI Website Builder</span>
            </div>

            <h1
              className={`font-display opacity-0-init ${heroVisible ? "animate-fadeUp anim-d2" : ""}`}
              style={{
                fontSize: "clamp(44px, 5.5vw, 72px)",
                lineHeight: 1.05,
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "#111",
                marginBottom: 24,
              }}
            >
              Your professional
              <br />
              <em style={{ fontStyle: "italic", color: "#059669" }}>website</em>
              ,{" "}
              <br />
              built in 60 seconds.
            </h1>

            <p
              className={`font-sans opacity-0-init ${heroVisible ? "animate-fadeUp anim-d3" : ""}`}
              style={{
                fontSize: 18,
                color: "#555",
                lineHeight: 1.7,
                marginBottom: 40,
                maxWidth: 440,
                fontWeight: 400,
              }}
            >
              Describe your business. AI builds a conversion-optimized,
              professional website. Edit anything. Publish for{" "}
              <strong style={{ color: "#111", fontWeight: 600 }}>$10/month</strong>{" "}
              — or start free, forever.
            </p>

            {/* The try-it-now input — #1 conversion driver */}
            <div
              className={`opacity-0-init ${heroVisible ? "animate-fadeUp anim-d4" : ""}`}
              style={{
                background: "white",
                border: "2px solid #e5e5e5",
                borderRadius: 16,
                padding: 8,
                display: "flex",
                gap: 8,
                marginBottom: 20,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#059669";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(5,150,105,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e5e5";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
              }}
            >
              <input
                ref={inputRef}
                className="hero-input font-sans"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTry()}
                placeholder={placeholderTexts[placeholderIndex]}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  fontSize: 15,
                  color: "#111",
                  padding: "10px 14px",
                  outline: "none",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <button
                onClick={handleTry}
                className="emerald-btn font-sans"
                style={{
                  padding: "12px 24px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                Build my site →
              </button>
            </div>

            <p
              className={`font-sans opacity-0-init ${heroVisible ? "animate-fadeIn anim-d4" : ""}`}
              style={{ fontSize: 13, color: "#888", marginBottom: 48 }}
            >
              No credit card · No design skills · Takes 2 minutes
            </p>

            {/* Social proof strip */}
            <div
              className={`opacity-0-init ${heroVisible ? "animate-fadeUp anim-d4" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 20 }}
            >
              <div style={{ display: "flex" }}>
                {["SC", "MR", "LT", "JP", "AW"].map((initials, i) => (
                  <div
                    key={i}
                    className="font-sans"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: ["#059669", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"][i],
                      border: "2.5px solid #FAFAF8",
                      marginLeft: i === 0 ? 0 : -10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "white",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div
                  className="font-sans"
                  style={{ fontWeight: 600, fontSize: 14, color: "#111" }}
                >
                  2,847 businesses launched
                </div>
                <div className="font-sans" style={{ fontSize: 12, color: "#888" }}>
                  ⭐⭐⭐⭐⭐ 4.9 avg rating
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live preview mockup */}
          <div style={{ position: "relative" }}>
            {/* Floating label */}
            <div
              className="font-sans"
              style={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#111",
                color: "white",
                padding: "6px 16px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
                zIndex: 10,
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22c55e",
                  marginRight: 8,
                  animation: "pulse-slow 2s ease infinite",
                }}
              />
              LIVE PREVIEW — AI GENERATING
            </div>

            <div className="live-preview">
              {/* Browser chrome */}
              <div className="browser-bar">
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                </div>
                <div
                  className="font-sans"
                  style={{
                    flex: 1,
                    background: "white",
                    borderRadius: 6,
                    padding: "5px 12px",
                    fontSize: 12,
                    color: "#666",
                    marginLeft: 12,
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span style={{ color: "#22c55e", fontSize: 10 }}>🔒</span>
                  {SITE_EXAMPLES[activeExample].label
                    .toLowerCase()
                    .replace(/\s+/g, "")}.com
                </div>
              </div>

              {/* Fake website content — cycles through examples */}
              <div
                style={{
                  position: "relative",
                  height: 380,
                  overflow: "hidden",
                  background: "white",
                }}
              >
                {SITE_EXAMPLES.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: activeExample === i ? 1 : 0,
                      transition: "opacity 0.6s ease",
                      padding: 28,
                    }}
                  >
                    {/* Fake hero section */}
                    <div
                      style={{
                        background: `linear-gradient(135deg, ${ex.color}18, ${ex.color}08)`,
                        borderRadius: 12,
                        padding: "24px 28px",
                        marginBottom: 16,
                        borderLeft: `4px solid ${ex.color}`,
                      }}
                    >
                      <div
                        className="font-sans"
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          color: ex.color,
                          marginBottom: 8,
                          textTransform: "uppercase",
                        }}
                      >
                        {ex.icon} Professional {ex.label.split(" ")[0]} Services
                      </div>
                      <div
                        className="font-display"
                        style={{
                          fontSize: 22,
                          fontWeight: 400,
                          color: "#111",
                          lineHeight: 1.2,
                          marginBottom: 10,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        The #1 Trusted {ex.label} <br />
                        <em style={{ color: ex.color }}>You Can Rely On</em>
                      </div>
                      <div
                        className="font-sans"
                        style={{ fontSize: 11, color: "#666", marginBottom: 14, lineHeight: 1.6 }}
                      >
                        Serving customers since 2019. Fully licensed, insured, and
                        5-star rated. Get your free quote today.
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div
                          style={{
                            background: ex.color,
                            color: "white",
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          Get Free Quote
                        </div>
                        <div
                          style={{
                            border: `1.5px solid ${ex.color}40`,
                            color: ex.color,
                            padding: "8px 16px",
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 600,
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          See Our Work
                        </div>
                      </div>
                    </div>

                    {/* Fake feature rows */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                      {["Licensed & Insured", "5★ Reviews", "Same Day Service"].map((feat, fi) => (
                        <div
                          key={fi}
                          style={{
                            background: "#f9f9f9",
                            borderRadius: 8,
                            padding: "12px 10px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ fontSize: 16, marginBottom: 4 }}>
                            {["✅", "⭐", "⚡"][fi]}
                          </div>
                          <div
                            className="font-sans"
                            style={{ fontSize: 9, color: "#444", fontWeight: 600 }}
                          >
                            {feat}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Progress bars to suggest "building" */}
                    <div style={{ marginTop: 16 }}>
                      {[80, 65, 92].map((w, pi) => (
                        <div
                          key={pi}
                          style={{
                            height: 4,
                            background: "#f0f0f0",
                            borderRadius: 4,
                            marginBottom: 6,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${w}%`,
                              height: "100%",
                              background: ex.color,
                              borderRadius: 4,
                              opacity: 0.4,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Example selector tabs */}
              <div
                style={{
                  background: "#f9f9f9",
                  borderTop: "1px solid #eee",
                  padding: "12px 16px",
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                {SITE_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveExample(i)}
                    className="font-sans"
                    style={{
                      padding: "4px 12px",
                      borderRadius: 100,
                      border: "1px solid",
                      borderColor: activeExample === i ? ex.color : "#ddd",
                      background: activeExample === i ? `${ex.color}15` : "transparent",
                      color: activeExample === i ? ex.color : "#888",
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating badge - time */}
            <div
              className="font-sans"
              style={{
                position: "absolute",
                bottom: -16,
                right: 20,
                background: "white",
                border: "1.5px solid #e5e5e5",
                borderRadius: 12,
                padding: "10px 16px",
                fontSize: 12,
                fontWeight: 700,
                color: "#111",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16 }}>⚡</span> Built in 47 seconds
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO MARQUEE / TRUST ── */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          borderBottom: "1px solid #e5e5e5",
          background: "white",
          padding: "20px 0",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="marquee-track">
            {[
              "2,847 websites built",
              "$4.2M+ revenue generated for customers",
              "4.9 ★ average rating",
              "No coding required",
              "Publish in under 5 minutes",
              "14-day free trial",
              "Cancel anytime",
              "2,847 websites built",
              "$4.2M+ revenue generated for customers",
              "4.9 ★ average rating",
              "No coding required",
              "Publish in under 5 minutes",
              "14-day free trial",
              "Cancel anytime",
            ].map((item, i) => (
              <div
                key={i}
                className="font-sans"
                style={{
                  padding: "0 40px",
                  fontSize: 13,
                  fontWeight: 500,
                  color: i % 3 === 0 ? "#059669" : "#888",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 0,
                }}
              >
                {item}
                <span style={{ marginLeft: 40, color: "#ddd" }}>◆</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "#111",
                marginBottom: 16,
              }}
            >
              From zero to live in{" "}
              <em style={{ color: "#059669" }}>three steps</em>
            </h2>
            <p
              className="font-sans"
              style={{ fontSize: 17, color: "#666", maxWidth: 480, margin: "0 auto" }}
            >
              No designers. No developers. No headaches.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              {
                n: "01",
                title: "Describe your business",
                body: 'Spend 60 seconds telling us what you do. "I\'m a fitness trainer in NYC specializing in weight loss for busy professionals." That\'s all it takes.',
                icon: "✍️",
                accent: "#059669",
              },
              {
                n: "02",
                title: "AI builds your site",
                body: "Our AI writes your copy, designs your layout, and structures your pages for conversions — all tailored to your industry.",
                icon: "🤖",
                accent: "#0ea5e9",
              },
              {
                n: "03",
                title: "Edit, then publish",
                body: "Click any element to tweak it. Add your logo. Regenerate sections you don't love. When you're ready, hit publish.",
                icon: "🚀",
                accent: "#8b5cf6",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: 20,
                  padding: "40px 36px",
                  border: "1.5px solid #e5e5e5",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div className="step-number">{step.n}</div>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{step.icon}</div>
                <div className="divider-line" style={{ background: step.accent, marginBottom: 20 }} />
                <h3
                  className="font-display"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "#111",
                    marginBottom: 12,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-sans"
                  style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          padding: "120px 24px",
          background: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "30%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "white",
                marginBottom: 16,
              }}
            >
              Real businesses.{" "}
              <em style={{ color: "#4ade80" }}>Real results.</em>
            </h2>
            <p className="font-sans" style={{ fontSize: 17, color: "#888" }}>
              Not cherry-picked. These are our last three featured reviews.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-card"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 20,
                  padding: 36,
                }}
              >
                <div
                  className="font-sans"
                  style={{
                    display: "inline-block",
                    background: "rgba(74,222,128,0.15)",
                    color: "#4ade80",
                    padding: "4px 12px",
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 24,
                  }}
                >
                  {t.revenue}
                </div>
                <p
                  className="font-display"
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.6,
                    marginBottom: 28,
                    fontStyle: "italic",
                  }}
                >
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    className={`font-sans bg-gradient-to-br ${t.bg}`}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div
                      className="font-sans"
                      style={{ fontWeight: 600, fontSize: 14, color: "white" }}
                    >
                      {t.name}
                    </div>
                    <div className="font-sans" style={{ fontSize: 12, color: "#888" }}>
                      {t.role} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES / BENEFITS ── */}
      <section style={{ padding: "120px 24px", background: "#FAFAF8" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 400,
                  letterSpacing: "-0.03em",
                  color: "#111",
                  marginBottom: 24,
                  lineHeight: 1.05,
                }}
              >
                Everything built in.
                <br />
                <em style={{ color: "#0ea5e9" }}>Nothing left out.</em>
              </h2>
              <p
                className="font-sans"
                style={{
                  fontSize: 16,
                  color: "#666",
                  lineHeight: 1.7,
                  marginBottom: 40,
                  maxWidth: 420,
                }}
              >
                You shouldn't have to stitch together five tools to have a
                working website. AutopilotAI includes everything you need to get
                customers.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  {
                    icon: "✏️",
                    title: "Click-to-edit anything",
                    body: "Change text, images, colors, or layout without touching code.",
                  },
                  {
                    icon: "📊",
                    title: "Built-in analytics",
                    body: "See visitor numbers, top pages, and where people click.",
                  },
                  {
                    icon: "📬",
                    title: "Lead capture forms",
                    body: "Automatically collect emails and enquiries. No plugin needed.",
                  },
                  {
                    icon: "🌐",
                    title: "Custom domain",
                    body: "Publish to yourcompany.com, not a subdomain nobody trusts.",
                  },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        background: "white",
                        border: "1.5px solid #e5e5e5",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <div
                        className="font-sans"
                        style={{ fontWeight: 600, fontSize: 15, color: "#111", marginBottom: 4 }}
                      >
                        {f.title}
                      </div>
                      <div
                        className="font-sans"
                        style={{ fontSize: 14, color: "#888", lineHeight: 1.6 }}
                      >
                        {f.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: metrics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              {[
                {
                  metric: "60s",
                  label: "Average time to first website",
                  color: "#059669",
                },
                {
                  metric: "$10",
                  label: "Per month to publish with custom domain",
                  color: "#0ea5e9",
                },
                {
                  metric: "100%",
                  label: "Mobile responsive, guaranteed",
                  color: "#8b5cf6",
                },
                {
                  metric: "4.9★",
                  label: "Average customer rating",
                  color: "#f59e0b",
                },
              ].map((m, i) => (
                <div
                  key={i}
                  className="card-hover"
                  style={{
                    background: "white",
                    border: "1.5px solid #e5e5e5",
                    borderRadius: 20,
                    padding: 28,
                  }}
                >
                  <div
                    className="font-display"
                    style={{
                      fontSize: 44,
                      fontWeight: 400,
                      color: m.color,
                      lineHeight: 1,
                      marginBottom: 10,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {m.metric}
                  </div>
                  <div
                    className="font-sans"
                    style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        style={{
          padding: "120px 24px",
          background: "white",
          borderTop: "1px solid #e5e5e5",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(36px, 4vw, 56px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "#111",
                marginBottom: 16,
              }}
            >
              Straightforward pricing.
              <br />
              <em style={{ color: "#059669" }}>No surprises.</em>
            </h2>
            <p
              className="font-sans"
              style={{ fontSize: 17, color: "#666", maxWidth: 400, margin: "0 auto" }}
            >
              Create and edit everything for free. Pay only when you're ready to publish.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              maxWidth: 760,
              margin: "0 auto",
            }}
          >
            {/* Free */}
            <div
              style={{
                background: "#FAFAF8",
                border: "1.5px solid #e5e5e5",
                borderRadius: 24,
                padding: 40,
              }}
            >
              <div
                className="font-sans"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                Free Forever
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: 56,
                  fontWeight: 400,
                  color: "#111",
                  lineHeight: 1,
                  marginBottom: 4,
                  letterSpacing: "-0.03em",
                }}
              >
                $0
              </div>
              <div
                className="font-sans"
                style={{ fontSize: 14, color: "#888", marginBottom: 32 }}
              >
                Create and explore, always free
              </div>

              {[
                [true, "Build 1 website"],
                [true, "Unlimited edits"],
                [true, "10 AI content generations"],
                [true, "Mobile responsive"],
                [false, "Custom domain"],
                [false, "Publish publicly"],
              ].map(([yes, label], i) => (
                <div
                  key={i}
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                    fontSize: 14,
                    color: yes ? "#111" : "#bbb",
                  }}
                >
                  <div className={yes ? "check-icon" : "cross-icon"}>
                    {yes ? "✓" : "✕"}
                  </div>
                  {label}
                </div>
              ))}

              <a
                href="/upgrade"
                className="font-sans"
                style={{
                  display: "block",
                  marginTop: 32,
                  padding: "14px 0",
                  background: "transparent",
                  border: "1.5px solid #222",
                  borderRadius: 12,
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#111",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Start building free
              </a>
            </div>

            {/* Starter (popular) */}
            <div
              className="pricing-popular"
              style={{
                borderRadius: 24,
                padding: 40,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div
                  className="font-sans"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#aaa",
                    textTransform: "uppercase",
                  }}
                >
                  Starter
                </div>
                <div
                  className="font-sans"
                  style={{
                    background: "linear-gradient(135deg, #059669, #0ea5e9)",
                    color: "white",
                    padding: "2px 10px",
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                  }}
                >
                  MOST POPULAR
                </div>
              </div>
              <div
                className="font-display"
                style={{
                  fontSize: 56,
                  fontWeight: 400,
                  color: "white",
                  lineHeight: 1,
                  marginBottom: 4,
                  letterSpacing: "-0.03em",
                }}
              >
                $10
                <span style={{ fontSize: 20, color: "#888" }}>/mo</span>
              </div>
              <div
                className="font-sans"
                style={{ fontSize: 14, color: "#888", marginBottom: 32 }}
              >
                14-day free trial · cancel anytime
              </div>

              {[
                "Publish your website",
                "Custom domain (yourco.com)",
                "Unlimited AI generations",
                "100 AI images/month",
                "Advanced analytics",
                "Priority support",
              ].map((label, i) => (
                <div
                  key={i}
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 12,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(5,150,105,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#4ade80",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </div>
                  {label}
                </div>
              ))}

              <a
                href="/upgrade"
                className="emerald-btn font-sans"
                style={{
                  display: "block",
                  marginTop: 32,
                  padding: "14px 0",
                  borderRadius: 12,
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start free trial →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        style={{
          padding: "120px 24px",
          borderTop: "1px solid #e5e5e5",
          background: "#FAFAF8",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "#111",
              marginBottom: 56,
              textAlign: "center",
            }}
          >
            Common questions
          </h2>

          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: openFaq === i ? 24 : 0,
              }}
            >
              <button
                className="font-sans"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "24px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111",
                  letterSpacing: "-0.01em",
                }}
              >
                {faq.q}
                <span
                  style={{
                    fontSize: 20,
                    color: "#888",
                    transition: "transform 0.3s ease",
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    flexShrink: 0,
                    marginLeft: 16,
                  }}
                >
                  +
                </span>
              </button>
              <div
                className="faq-answer font-sans"
                style={{
                  maxHeight: openFaq === i ? 200 : 0,
                  opacity: openFaq === i ? 1 : 0,
                  fontSize: 15,
                  color: "#666",
                  lineHeight: 1.7,
                }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          padding: "120px 24px",
          background: "#111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(5,150,105,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "white",
              marginBottom: 20,
              lineHeight: 1.05,
            }}
          >
            Your customers are searching
            <br />
            <em style={{ color: "#4ade80" }}>right now.</em>
          </h2>
          <p
            className="font-sans"
            style={{
              fontSize: 17,
              color: "#888",
              marginBottom: 48,
              lineHeight: 1.6,
            }}
          >
            Don't let them land on a competitor's site. Get professional online in
            the next 10 minutes — free to start.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: 8,
              display: "flex",
              gap: 8,
              maxWidth: 520,
              margin: "0 auto 24px",
            }}
          >
            <input
              className="font-sans"
              placeholder="Describe your business..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 15,
                color: "white",
                padding: "12px 16px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <a
              href="/upgrade"
              className="emerald-btn font-sans"
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Build it free →
            </a>
          </div>

          <p className="font-sans" style={{ fontSize: 13, color: "#555" }}>
            ✓ No credit card &nbsp;&nbsp; ✓ 2 minutes &nbsp;&nbsp; ✓ Try before you pay
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #222",
          background: "#0d0d0d",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="font-display"
            style={{ fontSize: 20, color: "white", fontWeight: 400 }}
          >
            AutopilotAI
          </div>
          <div
            className="font-sans"
            style={{ display: "flex", gap: 32, fontSize: 13, color: "#666" }}
          >
            {["Terms", "Privacy", "Contact", "Twitter"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: "#666",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}