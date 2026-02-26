"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Mail, Copy, ExternalLink, RotateCcw, ChevronRight,
  CheckCircle, AlertCircle, Wand2, Sparkles, ArrowRight,
  Send, UserCheck, Handshake, Heart, Briefcase,
} from "lucide-react";

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    icon: <Send size={13} />,
    label: "Cold Outreach",
    color: "#0ea5e9",
    prompt: "Professional cold outreach introducing myself and my value proposition clearly. Recipient:",
  },
  {
    icon: <ArrowRight size={13} />,
    label: "Follow-Up",
    color: "#8b5cf6",
    prompt: "Polite follow-up to a previous conversation or email. Remind them of the context and next step. Recipient:",
  },
  {
    icon: <UserCheck size={13} />,
    label: "Client Check-In",
    color: "#059669",
    prompt: "Warm client check-in to strengthen the relationship and offer additional support. Client name:",
  },
  {
    icon: <Briefcase size={13} />,
    label: "Sales Proposal",
    color: "#f59e0b",
    prompt: "Concise sales proposal with clear benefits, social proof, and a specific next step. Product/service:",
  },
  {
    icon: <Heart size={13} />,
    label: "Thank You",
    color: "#ef4444",
    prompt: "Genuine thank you note after a meeting, purchase, or referral. Keep it warm and specific. Recipient:",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmailPage() {
  const router = useRouter();

  // Auth
  const [name, setName]                         = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  // Form
  const [subject, setSubject]   = useState("");
  const [details, setDetails]   = useState("");

  // Output
  const [parsedSubject, setParsedSubject] = useState("");
  const [parsedBody, setParsedBody]       = useState("");
  const [rawResult, setRawResult]         = useState("");

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [copied, setCopied]   = useState(false);
  const [toast, setToast]     = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) { router.push("/login"); return; }
    api.get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => { localStorage.removeItem("autopilot_token"); router.push("/login"); });
  }, [router]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function showToast(type: "ok" | "err", msg: string, ms = 2500) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), ms);
  }

  function parseEmail(text: string) {
    const subjectMatch = text.match(/Subject:\s*(.*)/i);
    const body = text.replace(/Subject:.*\n?/i, "").trim();
    setParsedSubject(subjectMatch?.[1] || subject || "No subject");
    setParsedBody(body || text);
  }

  const handleGenerate = async () => {
    setError(""); setRawResult(""); setParsedSubject(""); setParsedBody("");
    if (!details.trim()) { setError("Please describe the email you'd like to create."); return; }
    try {
      setLoading(true);
      const res = await api.post("/api/email/generate", {
        subject: subject || undefined,
        prompt: details,
      });
      const output: string = res.data.output || "";
      setRawResult(output);
      parseEmail(output);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = async () => {
    if (!rawResult) return;
    await navigator.clipboard.writeText(rawResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    showToast("ok", "Copied to clipboard");
  };

  const openInEmailClient = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(parsedSubject || "No subject")}&body=${encodeURIComponent(parsedBody || rawResult || "")}`;
    window.location.href = mailto;
  };

  const clearAll = () => {
    setSubject(""); setDetails(""); setRawResult("");
    setParsedSubject(""); setParsedBody(""); setError("");
  };

  const hasOutput = !!(parsedBody || parsedSubject);
  const canGenerate = details.trim().length > 0;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .a1 { animation: fadeUp .5s ease .05s both; }
        .a2 { animation: fadeUp .5s ease .14s both; }
        .a3 { animation: fadeUp .5s ease .22s both; }

        .card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          overflow: hidden;
        }

        .field {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #e5e5e5;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .field::placeholder { color: #444; }
        .field:hover  { border-color: #333; }
        .field:focus  { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }
        textarea.field { resize: none; line-height: 1.65; }

        .btn-generate {
          width: 100%; padding: 15px;
          border-radius: 14px; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: -.01em;
          cursor: pointer;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: filter .2s, transform .2s, box-shadow .2s;
        }
        .btn-generate:hover:not(:disabled) {
          filter: brightness(1.08); transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(5,150,105,.28);
        }
        .btn-generate:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; }

        .btn-ghost {
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 9px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #888;
          cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: border-color .2s, color .2s, background .2s;
        }
        .btn-ghost:hover   { border-color: #444; color: #ccc; background: #111; }
        .btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

        .btn-solid {
          background: white; color: #111;
          border: none; border-radius: 10px; padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
          transition: background .2s, transform .15s;
        }
        .btn-solid:hover { background: #eee; transform: translateY(-1px); }

        .label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: .08em; text-transform: uppercase;
          color: #555; margin-bottom: 9px;
        }
        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #444; margin-bottom: 16px;
        }

        .template-chip {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px;
          border-radius: 100px;
          border: 1px solid #222;
          background: #0d0d0d;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; color: #888;
          transition: border-color .2s, color .2s, background .2s;
          white-space: nowrap;
        }
        .template-chip:hover { border-color: #333; color: #ccc; background: #141414; }

        /* Email preview chrome */
        .email-chrome {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          overflow: hidden;
        }
        .email-chrome-topbar {
          background: #0d0d0d;
          border-bottom: 1px solid #1a1a1a;
          padding: 10px 16px;
          display: flex; align-items: center; gap: 8px;
        }
        .email-chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
        .email-subject-bar {
          padding: 20px 28px 16px;
          border-bottom: 1px solid #1a1a1a;
        }
        .email-from-bar {
          padding: 14px 28px;
          border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center; gap: 14px;
        }
        .email-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700; color: white;
          flex-shrink: 0;
        }
        .email-body {
          padding: 28px;
        }
        .email-footer {
          padding: 16px 28px;
          border-top: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          background: #0d0d0d;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* TOAST */}
      {toast && (
        <div
          className="font-sans"
          style={{
            position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
            zIndex: 200, padding: "11px 18px", borderRadius: 12,
            fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,.5)",
            background: toast.type === "ok" ? "#052e16" : "#1c0a0a",
            border: `1px solid ${toast.type === "ok" ? "#166534" : "#7f1d1d"}`,
            color: toast.type === "ok" ? "#4ade80" : "#f87171",
            whiteSpace: "nowrap",
          }}
        >
          {toast.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* PAGE HEADER */}
        <div className="a1" style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>
              <Mail size={11} style={{ display: "inline", marginRight: 5, color: "#0ea5e9" }} />
              Email Writer
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Emails that actually <em style={{ color: "#059669" }}>get replies.</em>
            </h1>
            <p className="font-sans" style={{ fontSize: 15, color: "#555", marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
              Outreach, follow-ups, proposals, and client comms — written and ready to send.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-ghost" onClick={() => router.push("/dashboard/work")}>
              My Work <ChevronRight size={13} />
            </button>
            <button className="btn-ghost" onClick={clearAll}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="a2" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>

          {/* ════ LEFT: INPUT CARD ════ */}
          <div className="card">
            <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />
            <div style={{ padding: "32px 36px" }}>

              {/* Subject */}
              <div style={{ marginBottom: 22 }}>
                <label className="label">
                  Subject line{" "}
                  <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — AI will suggest one)</span>
                </label>
                <input
                  className="field"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Exploring a potential collaboration"
                />
              </div>

              {/* Details */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <label className="label" style={{ marginBottom: 0 }}>
                    Email details <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <span className="font-sans" style={{ fontSize: 11, color: "#333" }}>{details.length} / 600</span>
                </div>
                <textarea
                  className="field"
                  rows={8}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  maxLength={600}
                  placeholder="Describe the recipient, context, tone, key points, and desired CTA…&#10;&#10;Example: Cold outreach to a design agency owner. I'm a freelance dev. Warm, confident tone. CTA: 15-min call."
                />
                <p className="font-sans" style={{ fontSize: 12, color: "#444", marginTop: 7 }}>
                  One clear goal per email performs best.
                </p>
              </div>

              {/* Templates */}
              <div style={{ marginBottom: 28 }}>
                <div className="label" style={{ marginBottom: 10 }}>Quick starters</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      className="template-chip"
                      onClick={() => setDetails(t.prompt)}
                    >
                      <span style={{ color: t.color }}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: "#1a1a1a", margin: "0 0 28px" }} />

              {/* Error */}
              {error && (
                <div className="font-sans" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Generate */}
              <button className="btn-generate" onClick={handleGenerate} disabled={loading || !canGenerate}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    Writing your email…
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Generate Email
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ════ RIGHT: SIDEBAR ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Tips */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <div className="section-label">Writing principles</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  ["🎯", "Purpose first",    "State it in the opening sentence."],
                  ["💡", "Recipient value",  "What's in it for them — not you."],
                  ["📌", "One CTA",          "A single next step converts best."],
                  ["⏱️", "Respect their time", "Shorter is almost always better."],
                ].map(([emoji, key, val]) => (
                  <div key={key} style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 14, lineHeight: 1.5 }}>{emoji}</span>
                    <div>
                      <span className="font-sans" style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>{key}: </span>
                      <span className="font-sans" style={{ fontSize: 12, color: "#555" }}>{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <div className="section-label">Quick actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {[
                  { label: "Copy email",   sub: "Full email to clipboard",   icon: <Copy size={13} />,        action: copyEmail,                                   disabled: !rawResult },
                  { label: "Open in app",  sub: "Launch your email client",   icon: <ExternalLink size={13} />, action: openInEmailClient,                           disabled: !hasOutput },
                  { label: "My Work",      sub: "View saved emails",          icon: <Mail size={13} />,        action: () => router.push("/dashboard/work"),         disabled: false },
                  { label: "Reset",        sub: "Clear and start fresh",      icon: <RotateCcw size={13} />,   action: clearAll,                                    disabled: false },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="btn-ghost"
                    onClick={a.action}
                    disabled={a.disabled}
                    style={{ justifyContent: "flex-start", padding: "11px 14px", borderRadius: 12, width: "100%", gap: 10 }}
                  >
                    <span style={{ color: "#555" }}>{a.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: a.disabled ? "#444" : "#ccc" }}>{a.label}</div>
                      <div className="font-sans" style={{ fontSize: 11, color: "#444" }}>{a.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pro tip */}
            <div
              className="card"
              style={{ padding: "20px 22px", background: "rgba(5,150,105,.04)", borderColor: "rgba(5,150,105,.15)" }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Sparkles size={14} style={{ color: "#059669", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 5 }}>Pro tip</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                    Include a specific detail about the recipient in your prompt — personalised emails get 3× more replies.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── OUTPUT: EMAIL CHROME ── */}
        {hasOutput && (
          <motion.div
            className="a3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginTop: 28 }}
          >
            <div className="section-label" style={{ marginBottom: 16 }}>
              <CheckCircle size={11} style={{ display: "inline", marginRight: 5, color: "#059669" }} />
              Generated email
            </div>

            <div className="email-chrome">
              {/* macOS-style top bar */}
              <div className="email-chrome-topbar">
                <div className="email-chrome-dot" style={{ background: "#ff5f57" }} />
                <div className="email-chrome-dot" style={{ background: "#febc2e" }} />
                <div className="email-chrome-dot" style={{ background: "#28c840" }} />
                <div className="font-sans" style={{ marginLeft: 10, fontSize: 11, color: "#444", flex: 1 }}>
                  New Message
                </div>
                {/* Copy button inline */}
                <button className="btn-ghost" onClick={copyEmail} style={{ padding: "5px 12px", fontSize: 12 }}>
                  {copied
                    ? <><CheckCircle size={12} style={{ color: "#4ade80" }} /> Copied</>
                    : <><Copy size={12} /> Copy</>
                  }
                </button>
              </div>

              {/* Subject */}
              <div className="email-subject-bar">
                <div className="font-sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#444", marginBottom: 6 }}>Subject</div>
                <div className="font-display" style={{ fontSize: 22, color: "white", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                  {parsedSubject}
                </div>
              </div>

              {/* From */}
              <div className="email-from-bar">
                <div className="email-avatar">{name}</div>
                <div>
                  <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: "white" }}>
                    You — via AutopilotAI
                  </div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>To: recipient</div>
                </div>
              </div>

              {/* Body */}
              <div className="email-body">
                <p className="font-sans" style={{ fontSize: 14, color: "#bbb", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                  {parsedBody}
                </p>
              </div>

              {/* Footer actions */}
              <div className="email-footer">
                <button className="btn-ghost" onClick={copyEmail} style={{ padding: "9px 16px" }}>
                  <Copy size={13} /> Copy raw text
                </button>
                <button className="btn-solid" onClick={openInEmailClient}>
                  <ExternalLink size={13} /> Open in email app
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}