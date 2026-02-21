"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublicUpgradePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const subscribe = async (plan: "starter" | "pro") => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      router.push(`/register?plan=${plan}`);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "https://autopilotai-api.onrender.com"}/api/stripe/create-checkout-session?plan=${plan}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      window.location.href = data.checkout_url;
    } catch {
      alert("Could not start checkout. Try again.");
    }
  };

  const FAQS = [
    {
      q: "Can I try it free first?",
      a: "Yes. Create your free account, build your website, edit everything — upgrade only when you're ready to publish. No credit card required.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. Cancel from your dashboard anytime, no questions asked. You keep access through the end of your billing period.",
    },
    {
      q: "What happens if I downgrade?",
      a: "Your website stays live for the current billing period, then returns to draft mode. All your content is saved — nothing is deleted.",
    },
    {
      q: "Do I need to bring my own domain?",
      a: "No. We help you connect any domain you own, or you can purchase one directly. The Starter plan includes full custom domain support.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAFAF8",
        fontFamily: "'Georgia', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.6s ease forwards; }
        .anim-d1 { animation-delay: 0.05s; }
        .anim-d2 { animation-delay: 0.15s; }
        .anim-d3 { animation-delay: 0.25s; }

        .card-free {
          background: white;
          border: 1.5px solid #e5e5e5;
          border-radius: 24px;
          padding: 40px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .card-free:hover {
          border-color: #ccc;
          box-shadow: 0 12px 40px rgba(0,0,0,0.07);
        }

        .card-pro {
          background: white;
          border: 1.5px solid #e5e5e5;
          border-radius: 24px;
          padding: 40px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .card-pro:hover {
          border-color: #ccc;
          box-shadow: 0 12px 40px rgba(0,0,0,0.07);
        }

        .card-starter {
          background: #111;
          border-radius: 24px;
          padding: 40px;
          position: relative;
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-starter:hover {
          transform: translateY(-4px);
          box-shadow: 0 32px 100px rgba(0,0,0,0.25);
        }
        .card-starter::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #059669, #0ea5e9, #8b5cf6);
          border-radius: 26px;
          z-index: -1;
        }

        .btn-ghost {
          display: block;
          width: 100%;
          padding: 14px 0;
          background: transparent;
          border: 1.5px solid #222;
          border-radius: 12px;
          text-align: center;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          color: #111;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
        }
        .btn-ghost:hover { background: #f5f5f5; }

        .btn-ghost-dark {
          display: block;
          width: 100%;
          padding: 14px 0;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
          text-decoration: none;
        }
        .btn-ghost-dark:hover { background: rgba(255,255,255,0.13); }

        .btn-emerald {
          display: block;
          width: 100%;
          padding: 15px 0;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          border: none;
          border-radius: 12px;
          text-align: center;
          font-size: 15px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: -0.01em;
          transition: filter 0.2s, transform 0.2s, box-shadow 0.2s;
          text-decoration: none;
        }
        .btn-emerald:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(5,150,105,0.35);
        }

        .check-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(5,150,105,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #059669;
          font-size: 10px;
          font-weight: 800;
        }
        .check-icon-dark {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(74,222,128,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #4ade80;
          font-size: 10px;
          font-weight: 800;
        }
        .cross-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ccc;
          font-size: 10px;
        }

        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.35s ease;
        }

        .nav-link {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #555;
          text-decoration: none;
          padding: 8px 16px;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #111; }

        .cta-nav {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: white;
          text-decoration: none;
          background: #111;
          padding: 9px 20px;
          border-radius: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cta-nav:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }

        .badge-pill {
          display: inline-block;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 4px 12px;
          border-radius: 100px;
        }

        .popular-label {
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 5px 16px;
          border-radius: 100px;
          white-space: nowrap;
        }

        .divider { width: 40px; height: 2px; background: #111; margin-bottom: 20px; }
        .divider-light { width: 40px; height: 2px; background: rgba(255,255,255,0.3); margin-bottom: 20px; }

        /* Responsive */
        @media (max-width: 768px) {
          .plans-grid {
            grid-template-columns: 1fr !important;
          }
          .card-starter {
            order: -1;
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid #e5e5e5",
          background: "rgba(250,250,248,0.95)",
          backdropFilter: "blur(20px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
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
          <a
            href="/"
            className="font-display"
            style={{
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#111",
              textDecoration: "none",
            }}
          >
            AutopilotAI
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="/login" className="nav-link">Sign in</a>
            <a href="/register" className="cta-nav">Get started free</a>
          </div>
        </div>
      </header>

      <main style={{ padding: "0 24px" }}>

        {/* HERO */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            textAlign: "center",
            padding: "80px 0 64px",
          }}
        >
          <div className="animate-fadeUp anim-d1" style={{ marginBottom: 20 }}>
            <span className="badge-pill">Choose Your Plan</span>
          </div>

          <h1
            className="font-display animate-fadeUp anim-d2"
            style={{
              fontSize: "clamp(40px, 5vw, 64px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "#111",
              lineHeight: 1.05,
              marginBottom: 20,
            }}
          >
            Start free.
            <br />
            <em style={{ color: "#059669" }}>Publish when ready.</em>
          </h1>

          <p
            className="font-sans animate-fadeUp anim-d3"
            style={{
              fontSize: 17,
              color: "#666",
              lineHeight: 1.7,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Build and edit your entire website for free. Pay only when you're
            ready to go live with your own domain.
          </p>
        </div>

        {/* PLANS */}
        <div
          className="plans-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.08fr 1fr",
            gap: 20,
            maxWidth: 1000,
            margin: "0 auto",
            alignItems: "start",
            paddingBottom: 120,
          }}
        >
          {/* FREE */}
          <div className="card-free">
            <div className="divider" />
            <div
              className="font-sans"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Free Forever
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 52,
                fontWeight: 400,
                color: "#111",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                marginBottom: 6,
              }}
            >
              $0
            </div>
            <p
              className="font-sans"
              style={{ fontSize: 14, color: "#888", marginBottom: 32 }}
            >
              Create and explore, always free
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                [true, "Build 1 website"],
                [true, "Unlimited edits"],
                [true, "10 AI content generations"],
                [true, "Mobile responsive preview"],
                [false, "Publish publicly"],
                [false, "Custom domain"],
                [false, "AI image generation"],
              ].map(([yes, label], i) => (
                <div
                  key={i}
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13.5,
                    color: yes ? "#333" : "#bbb",
                  }}
                >
                  <div className={yes ? "check-icon" : "cross-icon"}>
                    {yes ? "✓" : "✕"}
                  </div>
                  {label as string}
                </div>
              ))}
            </div>

            <a href="/register" className="btn-ghost">
              Start building free
            </a>
          </div>

          {/* STARTER — POPULAR */}
          <div className="card-starter" style={{ marginTop: -8, marginBottom: -8 }}>
            <div className="popular-label">★ MOST POPULAR</div>
            <div className="divider-light" />
            <div
              className="font-sans"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Starter
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 52,
                fontWeight: 400,
                color: "white",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                marginBottom: 6,
              }}
            >
              $10
              <span
                className="font-sans"
                style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}
              >
                /mo
              </span>
            </div>
            <p
              className="font-sans"
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.45)",
                marginBottom: 8,
              }}
            >
            </p>

            <div
              className="font-sans"
              style={{
                display: "inline-block",
                background: "rgba(74,222,128,0.15)",
                color: "#4ade80",
                padding: "3px 12px",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 28,
              }}
            >
              Most businesses pick this
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                "Everything in Free",
                "Publish your website",
                "Custom domain (yourco.com)",
                "Unlimited AI content generations",
                "20 AI images / month",
                "Advanced analytics",
                "Priority support",
              ].map((label, i) => (
                <div
                  key={i}
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13.5,
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: i === 0 ? 400 : 400,
                  }}
                >
                  <div className="check-icon-dark">✓</div>
                  {label}
                </div>
              ))}
            </div>

            <button onClick={() => subscribe("starter")} className="btn-emerald">
              Start free trial →
            </button>
            <p
              className="font-sans"
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.3)",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              No credit card required
            </p>
          </div>

          {/* PRO */}
          <div className="card-pro">
            <div className="divider" />
            <div
              className="font-sans"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Pro
            </div>
            <div
              className="font-display"
              style={{
                fontSize: 52,
                fontWeight: 400,
                color: "#111",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                marginBottom: 6,
              }}
            >
              $20
              <span
                className="font-sans"
                style={{ fontSize: 20, color: "#aaa", fontWeight: 400 }}
              >
                /mo
              </span>
            </div>
            <p
              className="font-sans"
              style={{ fontSize: 14, color: "#888", marginBottom: 32 }}
            >
              For power users & agencies
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {[
                [true, "Everything in Starter"],
                [true, "3 websites"],
                [true, "50 AI images / month"],
                [true, "White-label option"],
                [true, "Dedicated support"],
                [true, "Early access to new features"],
              ].map(([yes, label], i) => (
                <div
                  key={i}
                  className="font-sans"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13.5,
                    color: "#333",
                  }}
                >
                  <div className="check-icon">✓</div>
                  {label as string}
                </div>
              ))}
            </div>

            <button
              onClick={() => subscribe("pro")}
              className="btn-ghost"
            >
              Get Pro
            </button>
            <p
              className="font-sans"
              style={{
                fontSize: 12,
                color: "#bbb",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              14-day free trial included
            </p>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto 80px",
            display: "flex",
            justifyContent: "center",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🔒", text: "Secure checkout via Stripe" },
            { icon: "↩️", text: "Cancel anytime" },
            { icon: "✉️", text: "Support within 24 hours" },
          ].map((item, i) => (
            <div
              key={i}
              className="font-sans"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#888",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div
          style={{
            maxWidth: 640,
            margin: "0 auto",
            paddingBottom: 120,
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "#111",
              marginBottom: 48,
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
                paddingBottom: openFaq === i ? 20 : 0,
              }}
            >
              <button
                className="font-sans"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  padding: "22px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 15,
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
                  fontSize: 14,
                  color: "#666",
                  lineHeight: 1.7,
                }}
              >
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid #e5e5e5",
          background: "#111",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
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
                style={{ color: "#666", textDecoration: "none", transition: "color 0.2s" }}
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