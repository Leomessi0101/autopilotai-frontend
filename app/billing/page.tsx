"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  CreditCard, Zap, CheckCircle, AlertCircle,
  TrendingUp, ChevronRight, User, RotateCcw,
  Sparkles,
} from "lucide-react";

type MeResponse = {
  name: string;
  email: string;
  subscription: string;
  used_generations: number;
  monthly_limit: number | null;
  remaining_generations: number | null;
  last_reset: string | null;
};

const PLAN_INFO: Record<string, { label: string; desc: string; color: string; features: string[] }> = {
  free: {
    label: "Free",
    desc: "Limited access to get started.",
    color: "#555",
    features: ["Basic content generation", "Email writer", "Ad generator", "5 saves per month"],
  },
  basic: {
    label: "Basic",
    desc: "Essential tools for individuals.",
    color: "#0ea5e9",
    features: ["All Free features", "100 generations/month", "Growth Pack access", "Priority support"],
  },
  growth: {
    label: "Growth",
    desc: "Unlimited for scaling businesses.",
    color: "#059669",
    features: ["Unlimited generations", "AI image creation", "Advanced analytics", "Priority processing"],
  },
  enterprise: {
    label: "Enterprise",
    desc: "Maximum performance, dedicated support.",
    color: "#8b5cf6",
    features: ["Everything in Growth", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
  },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BillingPage() {
  const router = useRouter();

  const [data, setData]                         = useState<MeResponse | null>(null);
  const [loading, setLoading]                   = useState(true);
  const [portalLoading, setPortalLoading]       = useState(false);
  const [name, setName]                         = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [toast, setToast]                       = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) { router.push("/login"); return; }

    api.get("/api/auth/me")
      .then((res) => {
        setData(res.data);
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [router]);

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const openStripePortal = async () => {
    try {
      setPortalLoading(true);
      const res = await api.post("/api/stripe/customer-portal");
      window.location.href = res.data.url;
    } catch {
      showToast("err", "Could not open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 36, height: 36, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" }}>Loading billing…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" }}>
          Unable to load billing info. Please try again.
        </p>
      </div>
    );
  }

  const planKey  = (data.subscription || "free").toLowerCase();
  const plan     = PLAN_INFO[planKey] || PLAN_INFO.free;
  const isFree   = planKey === "free";
  const usedPct  = data.monthly_limit
    ? Math.min(100, Math.round(((data.used_generations ?? 0) / data.monthly_limit) * 100))
    : 0;
  const usageColor = usedPct > 85 ? "#ef4444" : usedPct > 60 ? "#f59e0b" : "#059669";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fillBar { from { width: 0; } to { width: var(--w); } }

        .a1 { animation: fadeUp .5s ease .05s both; }
        .a2 { animation: fadeUp .5s ease .14s both; }
        .a3 { animation: fadeUp .5s ease .22s both; }

        .card { background: #111; border: 1px solid #1e1e1e; border-radius: 20px; overflow: hidden; }

        .btn-primary {
          padding: 13px 28px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #059669, #0ea5e9); color: white;
          transition: filter .2s, transform .2s, box-shadow .2s; width: 100%; justify-content: center;
        }
        .btn-primary:hover:not(:disabled) {
          filter: brightness(1.08); transform: translateY(-1px);
          box-shadow: 0 10px 32px rgba(5,150,105,.3);
        }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        .btn-white {
          padding: 13px 28px; border-radius: 12px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
          background: white; color: #111;
          transition: background .18s, transform .15s; width: 100%; justify-content: center;
        }
        .btn-white:hover:not(:disabled) { background: #eee; transform: translateY(-1px); }
        .btn-white:disabled { opacity: .5; cursor: not-allowed; }

        .btn-ghost {
          background: transparent; border: 1px solid #2a2a2a; border-radius: 10px;
          padding: 10px 18px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #888; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: border-color .18s, color .18s, background .18s;
        }
        .btn-ghost:hover { border-color: #444; color: #ccc; background: #141414; }

        .section-label {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase; color: #444;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* TOAST */}
      {toast && (
        <div className="font-sans" style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 200, padding: "11px 18px", borderRadius: 12,
          fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 32px rgba(0,0,0,.5)",
          background: toast.type === "ok" ? "#052e16" : "#1c0a0a",
          border: `1px solid ${toast.type === "ok" ? "#166534" : "#7f1d1d"}`,
          color: toast.type === "ok" ? "#4ade80" : "#f87171",
          whiteSpace: "nowrap",
        }}>
          {toast.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* HEADER */}
        <div className="a1" style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>Account</div>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Billing & <em style={{ color: "#059669" }}>Subscription</em>
            </h1>
            <p className="font-sans" style={{ fontSize: 15, color: "#555", marginTop: 8 }}>
              Manage your plan, usage, and payment details.
            </p>
          </div>
          <button className="btn-ghost" onClick={() => router.push("/dashboard/profile")}>
            <User size={13} /> Profile <ChevronRight size={13} />
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="a2" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* ════ LEFT ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Current plan card */}
            <div className="card">
              <div style={{ height: 3, background: plan.color }} />
              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 22 }}>
                  <div>
                    <div className="section-label" style={{ marginBottom: 10 }}>Current Plan</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="font-display" style={{ fontSize: 36, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {plan.label}
                      </span>
                      <span className="font-sans" style={{
                        padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 800,
                        letterSpacing: ".06em", textTransform: "uppercase",
                        background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}30`,
                      }}>
                        {isFree ? "Free tier" : "Active"}
                      </span>
                    </div>
                    <p className="font-sans" style={{ fontSize: 13, color: "#555", marginTop: 6 }}>{plan.desc}</p>
                  </div>

                  <div className="font-sans" style={{ fontSize: 13, color: "#555", textAlign: "right" }}>
                    <div style={{ marginBottom: 3, color: "#888" }}>Account</div>
                    <div style={{ color: "#ccc", fontWeight: 600 }}>{data.email}</div>
                  </div>
                </div>

                {/* Features */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 24 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle size={13} style={{ color: plan.color, flexShrink: 0 }} />
                      <span className="font-sans" style={{ fontSize: 13, color: "#888" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: "#1a1a1a", marginBottom: 22 }} />

                {/* CTA */}
                {isFree ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <p className="font-sans" style={{ fontSize: 12, color: "#555", marginBottom: 10 }}>
                        Upgrade to unlock unlimited generations, AI images, and more.
                      </p>
                    </div>
                    <button className="btn-primary" onClick={() => router.push("/pricing")}>
                      <Zap size={14} /> Upgrade Plan
                    </button>
                  </div>
                ) : (
                  <button className="btn-white" onClick={openStripePortal} disabled={portalLoading}>
                    {portalLoading
                      ? <><div style={{ width: 14, height: 14, border: "2px solid #aaa", borderTop: "2px solid #111", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Opening portal…</>
                      : <><CreditCard size={14} /> Manage Subscription & Payment</>
                    }
                  </button>
                )}
              </div>
            </div>

            {/* Usage card */}
            <div className="card">
              <div style={{ height: 3, background: `linear-gradient(90deg, ${usageColor}, ${usageColor}88)` }} />
              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${usageColor}18`, border: `1px solid ${usageColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrendingUp size={14} style={{ color: usageColor }} />
                  </div>
                  <span className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Usage This Month</span>
                </div>

                {data.monthly_limit === null ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                    <span className="font-display" style={{ fontSize: 42, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>
                      {data.used_generations ?? 0}
                    </span>
                    <span className="font-sans" style={{ fontSize: 14, color: "#555" }}>generations used</span>
                    <span className="font-sans" style={{ fontSize: 12, padding: "3px 10px", borderRadius: 100, background: "rgba(5,150,105,.12)", color: "#4ade80", border: "1px solid rgba(5,150,105,.25)", marginLeft: 6, fontWeight: 700 }}>
                      Unlimited
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                      <span className="font-display" style={{ fontSize: 42, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {data.used_generations ?? 0}
                      </span>
                      <span className="font-sans" style={{ fontSize: 14, color: "#555" }}>
                        of {data.monthly_limit} used
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${usedPct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{ height: "100%", background: usageColor, borderRadius: 4 }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="font-sans" style={{ fontSize: 12, color: "#555" }}>
                        {data.remaining_generations} remaining
                      </span>
                      <span className="font-sans" style={{ fontSize: 12, color: usedPct > 75 ? usageColor : "#555", fontWeight: usedPct > 75 ? 700 : 400 }}>
                        {usedPct}% used
                      </span>
                    </div>

                    {usedPct > 80 && (
                      <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.18)", display: "flex", alignItems: "center", gap: 10 }}>
                        <AlertCircle size={13} style={{ color: "#ef4444", flexShrink: 0 }} />
                        <span className="font-sans" style={{ fontSize: 12, color: "#f87171", lineHeight: 1.5 }}>
                          You're running low. <button onClick={() => router.push("/pricing")} style={{ color: "#fca5a5", fontWeight: 700, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>Upgrade to get more →</button>
                        </span>
                      </div>
                    )}
                  </>
                )}

                {data.last_reset && (
                  <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 7 }}>
                    <RotateCcw size={11} style={{ color: "#444" }} />
                    <span className="font-sans" style={{ fontSize: 12, color: "#444" }}>
                      Resets monthly · last reset {fmtDate(data.last_reset)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════ RIGHT SIDEBAR ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>

            {/* Account info */}
            <div className="card" style={{ padding: "20px 22px" }}>
              <div className="section-label" style={{ marginBottom: 14 }}>Account</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #059669, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  {name}
                </div>
                <div>
                  <div className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{data.name}</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>{data.email}</div>
                </div>
              </div>
              <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => router.push("/dashboard/profile")}>
                <User size={13} /> Edit Profile
              </button>
            </div>

            {/* Plan comparison shortcut — for free users */}
            {isFree && (
              <div className="card" style={{ padding: "20px 22px", background: "rgba(5,150,105,.04)", borderColor: "rgba(5,150,105,.18)" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <Sparkles size={14} style={{ color: "#059669", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>Unlock the full suite</div>
                    <div className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.65, marginBottom: 14 }}>
                      Upgrade for unlimited generations, AI images, Growth Packs, and priority processing.
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => router.push("/pricing")}
                      style={{ fontSize: 13, padding: "10px 20px" }}
                    >
                      <Zap size={13} /> View Plans
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manage (paid users) */}
            {!isFree && (
              <div className="card" style={{ padding: "20px 22px" }}>
                <div className="section-label" style={{ marginBottom: 12 }}>Manage</div>
                {[
                  { label: "Update payment method", sub: "Change card or billing details", action: openStripePortal },
                  { label: "Download invoices",      sub: "Get receipts from Stripe portal",  action: openStripePortal },
                  { label: "Cancel subscription",    sub: "Manage via Stripe portal",         action: openStripePortal },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="btn-ghost"
                    onClick={item.action}
                    style={{ width: "100%", justifyContent: "flex-start", padding: "11px 14px", borderRadius: 12, marginBottom: 7, gap: 10 }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{item.label}</div>
                      <div className="font-sans" style={{ fontSize: 11, color: "#444" }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Help */}
            <div className="card" style={{ padding: "20px 22px" }}>
              <div className="section-label" style={{ marginBottom: 10 }}>Support</div>
              <p className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.65, marginBottom: 12 }}>
                Billing questions? We're here to help.
              </p>
              <a
                href="mailto:contact@autopilotai.dev"
                className="font-sans"
                style={{ fontSize: 13, fontWeight: 600, color: "#0ea5e9", textDecoration: "none" }}
              >
                contact@autopilotai.dev →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}