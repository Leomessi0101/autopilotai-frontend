"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Sparkles, Copy, Download, Save, RotateCcw, ChevronRight,
  ImageIcon, FileText, Linkedin, Twitter, Youtube, ShoppingBag,
  CheckCircle, AlertCircle, Wand2, ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

const IMAGE_STYLES = [
  { value: "clean",     label: "Clean Corporate",       desc: "Modern SaaS — crisp, premium." },
  { value: "cinematic", label: "Cinematic",             desc: "Moody, dramatic, high-contrast." },
  { value: "minimal",   label: "Minimal Illustration",  desc: "Simple shapes, soft composition." },
  { value: "social",    label: "Social Thumbnail",      desc: "Bold framing, attention-grabbing." },
  { value: "product",   label: "Product Showcase",      desc: "Hero lighting, premium scene." },
] as const;

type StyleValue = typeof IMAGE_STYLES[number]["value"];

const TEMPLATES = [
  { icon: <Twitter size={14} />,     label: "Twitter / X Thread",     prompt: "Write an engaging Twitter/X thread. Hook first line, clear value per tweet, strong close. Audience:",     color: "#1DA1F2" },
  { icon: <Linkedin size={14} />,    label: "LinkedIn Post",          prompt: "Write a professional LinkedIn post. Thought leadership tone, value-driven, end with question. Audience:",   color: "#0A66C2" },
  { icon: <FileText size={14} />,    label: "Instagram Caption",      prompt: "Write a short, confident Instagram caption with a benefit and CTA. Tone: bold. Audience:",                 color: "#E1306C" },
  { icon: <ShoppingBag size={14} />, label: "Product Description",    prompt: "Write a persuasive product description. Benefit-oriented, premium feel, clear CTA. Product:",             color: "#f59e0b" },
  { icon: <Youtube size={14} />,     label: "YouTube Script Intro",   prompt: "Write a high-energy YouTube intro hook for the first 10 seconds. Topic:",                                  color: "#ef4444" },
] as const;

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ContentPage() {
  const router = useRouter();

  // Auth / user
  const [name, setName]                     = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  // Form
  const [title, setTitle]                   = useState("");
  const [details, setDetails]               = useState("");
  const [generateImage, setGenerateImage]   = useState(false);
  const [imageStyle, setImageStyle]         = useState<StyleValue>("clean");

  // Output
  const [result, setResult]                 = useState("");
  const [imageUrl, setImageUrl]             = useState<string | null>(null);

  // UI state
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState("");
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
  const [toast, setToast]                   = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [copied, setCopied]                 = useState(false);

  const isPaid = useMemo(() => !!subscriptionPlan && subscriptionPlan !== "free", [subscriptionPlan]);

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

  const handleToggle = () => {
    if (!isPaid) { setShowUpgradeNotice(true); setGenerateImage(false); return; }
    setGenerateImage((p) => !p);
  };

  const handleGenerate = async () => {
    setError(""); setResult(""); setImageUrl(null);
    if (!details.trim()) { setError("Please describe what you want to create."); return; }
    try {
      setLoading(true);
      const res = await api.post("/api/content/generate", {
        title: title || undefined,
        prompt: details,
        generate_image: generateImage,
        image_style: imageStyle,
      });
      const output: string = res.data.output || "";
      const posts = output.split(/\n\s*\n/);
      const imageBlocked = res.data?.error?.toLowerCase()?.includes("paid") || res.data?.error?.toLowerCase()?.includes("upgrade");
      if (generateImage && !imageBlocked) {
        setResult(posts.slice(0, 1).join("\n\n"));
        setImageUrl(res.data.image || null);
      } else {
        setResult(posts.slice(0, 3).join("\n\n"));
        setImageUrl(null);
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    showToast("ok", "Copied to clipboard");
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement("a"); a.href = imageUrl; a.download = "autopilotai-image.png"; a.click();
  };

  const saveImage = async () => {
    if (!imageUrl) return;
    await api.post("/api/images/save", { image_url: imageUrl, text_content: result, image_style: imageStyle });
    showToast("ok", "Saved to My Work");
  };

  const clearAll = () => {
    setTitle(""); setDetails(""); setResult(""); setImageUrl(null);
    setError(""); setShowUpgradeNotice(false); setGenerateImage(false); setImageStyle("clean");
  };

  const canGenerate = details.trim().length > 0;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

        .a1 { animation: fadeUp .5s ease .05s both; }
        .a2 { animation: fadeUp .5s ease .14s both; }
        .a3 { animation: fadeUp .5s ease .22s both; }

        /* ── Cards ── */
        .card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          overflow: hidden;
        }
        .card-inset {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
        }

        /* ── Inputs ── */
        .field {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #e5e5e5;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          -webkit-appearance: none;
        }
        .field::placeholder { color: #444; }
        .field:hover  { border-color: #333; }
        .field:focus  { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }

        textarea.field { resize: none; line-height: 1.6; }

        /* ── Buttons ── */
        .btn-generate {
          width: 100%; padding: 15px;
          border-radius: 14px; border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          cursor: pointer; letter-spacing: -.01em;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: filter .2s, transform .2s, box-shadow .2s;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-generate:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
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
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
          transition: border-color .2s, color .2s, background .2s;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-ghost:hover { border-color: #444; color: #ccc; background: #111; }
        .btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

        .btn-solid {
          background: white; color: #111;
          border: none; border-radius: 10px;
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
          transition: background .2s, transform .15s;
          -webkit-tap-highlight-color: transparent;
        }
        .btn-solid:hover { background: #eee; transform: translateY(-1px); }

        /* ── Label ── */
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

        /* ── Toggle ── */
        .toggle-track {
          width: 44px; height: 24px;
          background: #2a2a2a;
          border-radius: 100px;
          position: relative; cursor: pointer;
          transition: background .25s;
          flex-shrink: 0;
        }
        .toggle-track.on { background: #059669; }
        .toggle-thumb {
          position: absolute;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: white;
          top: 3px; left: 3px;
          transition: transform .25s;
          box-shadow: 0 1px 4px rgba(0,0,0,.4);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(20px); }

        /* ── Style pill ── */
        .style-pill {
          border-radius: 10px;
          border: 1px solid #222;
          padding: 11px 14px;
          cursor: pointer;
          background: transparent;
          text-align: left;
          transition: border-color .2s, background .2s;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
        .style-pill:hover  { border-color: #333; background: #111; }
        .style-pill.active { border-color: rgba(5,150,105,.5); background: rgba(5,150,105,.07); }

        /* ── Template chip ── */
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
          -webkit-tap-highlight-color: transparent;
        }
        .template-chip:hover { border-color: #333; color: #ccc; background: #141414; }

        /* ── Output preview ── */
        .preview-post {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 20px;
          overflow: hidden;
        }
        .preview-header {
          padding: 16px 20px;
          border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center; gap: 12px;
        }
        .preview-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          flex-shrink: 0;
        }
        .preview-body { padding: 20px; }
        .preview-actions {
          padding: 14px 20px;
          border-top: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px;
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }

        /* ─────────────────────────────────────────────
           MOBILE RESPONSIVE — added only, nothing changed above
           ───────────────────────────────────────────── */

        /* Main padding */
        .main-wrapper { padding: 24px 16px 80px; }
        @media (min-width: 560px) { .main-wrapper { padding: 32px 24px 80px; } }
        @media (min-width: 900px) { .main-wrapper { padding: 40px 24px 80px; } }

        /* Page header: stack on mobile */
        .page-header {
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 680px) {
          .page-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 36px;
          }
        }
        .page-header-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        /* Main grid: single col on mobile, 2-col on desktop */
        .main-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 860px) {
          .main-grid {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 20px;
            align-items: start;
          }
        }

        /* Sidebar: horizontal scroll row on mobile, stack on desktop */
        .sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Input card inner padding */
        .input-card-pad { padding: 24px 20px; }
        @media (min-width: 560px) { .input-card-pad { padding: 32px 36px; } }

        /* Toast max width on mobile */
        .toast-wrap { max-width: calc(100vw - 32px); }

        /* Output grid: single col on mobile, 2-col when image present */
        .output-grid-single { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .output-grid-double { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 700px) {
          .output-grid-double { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* ── TOAST ── */}
      {toast && (
        <div
          className="font-sans toast-wrap"
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

      <main className="main-wrapper" style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── PAGE HEADER ── */}
        <div className="a1 page-header">
          <div>
            <div className="section-label" style={{ marginBottom: 10 }}>
              <Sparkles size={11} style={{ display: "inline", marginRight: 5, color: "#f59e0b" }} />
              Content Generator
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Create content that <em style={{ color: "#059669" }}>converts.</em>
            </h1>
            <p className="font-sans" style={{ fontSize: 15, color: "#555", marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
              AI-written captions, posts, and scripts — paired with generated images when you need them.
            </p>
          </div>
          <div className="page-header-actions">
            <button className="btn-ghost" onClick={() => router.push("/dashboard/work")}>
              My Work <ChevronRight size={13} />
            </button>
            <button className="btn-ghost" onClick={clearAll}>
              <RotateCcw size={13} /> Reset
            </button>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="a2 main-grid">

          {/* ════ LEFT: INPUT CARD ════ */}
          <div className="card">
            <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />
            <div className="input-card-pad">

              {/* Title */}
              <div style={{ marginBottom: 22 }}>
                <label className="label">Title / Topic <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input
                  className="field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product launch, mindset shift, new service"
                />
              </div>

              {/* Details */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <label className="label" style={{ marginBottom: 0 }}>What to write <span style={{ color: "#dc2626" }}>*</span></label>
                  <span className="font-sans" style={{ fontSize: 11, color: "#333" }}>{details.length} / 500</span>
                </div>
                <textarea
                  className="field"
                  rows={7}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  maxLength={500}
                  placeholder="Describe platform, tone, audience, goal, and any key details…&#10;&#10;Tip: the more specific you are, the better the output."
                />
              </div>

              {/* Quick templates */}
              <div style={{ marginBottom: 28 }}>
                <div className="label" style={{ marginBottom: 10 }}>Quick templates</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {TEMPLATES.map((t, i) => (
                    <button
                      key={i}
                      className="template-chip"
                      onClick={() => setDetails(t.prompt)}
                      style={{ "--chip-color": t.color } as React.CSSProperties}
                    >
                      <span style={{ color: t.color }}>{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: "#1a1a1a", margin: "0 0 28px" }} />

              {/* Image toggle */}
              <div style={{ marginBottom: generateImage ? 22 : 32 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 3 }}>
                      Generate AI Image
                    </div>
                    <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>
                      {isPaid ? "Paired with your caption" : "Paid feature — upgrade to unlock"}
                    </div>
                  </div>
                  <div
                    className={`toggle-track ${generateImage ? "on" : ""}`}
                    onClick={handleToggle}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>

                {showUpgradeNotice && !isPaid && (
                  <div
                    className="font-sans"
                    style={{
                      marginTop: 14,
                      padding: "14px 16px",
                      background: "rgba(217,119,6,.06)",
                      border: "1px solid rgba(217,119,6,.2)",
                      borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#d97706", marginBottom: 2 }}>Upgrade to unlock images</div>
                      <div style={{ fontSize: 12, color: "#555" }}>$10/mo gets you 20 images/month</div>
                    </div>
                    <button
                      onClick={() => router.push("/upgrade")}
                      style={{
                        background: "#d97706", color: "white", border: "none",
                        borderRadius: 9, padding: "8px 14px",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                      }}
                    >
                      Upgrade <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Image styles */}
              {generateImage && isPaid && (
                <div style={{ marginBottom: 28 }}>
                  <label className="label">Image Style</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {IMAGE_STYLES.map((s) => (
                      <button
                        key={s.value}
                        className={`style-pill ${imageStyle === s.value ? "active" : ""}`}
                        onClick={() => setImageStyle(s.value)}
                      >
                        <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: imageStyle === s.value ? "white" : "#aaa", marginBottom: 3 }}>
                          {s.label}
                        </div>
                        <div className="font-sans" style={{ fontSize: 11, color: "#555" }}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="font-sans" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Generate button */}
              <button className="btn-generate" onClick={handleGenerate} disabled={loading || !canGenerate}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ════ RIGHT: SIDEBAR ════ */}
          <div className="sidebar-col">

            {/* Tips */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <div className="section-label">Writing tips</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  ["🎯", "Audience", "Who exactly is this for?"],
                  ["💡", "Outcome",  "What should they do or feel?"],
                  ["🎨", "Tone",     "Calm, bold, luxury, casual…"],
                  ["🔥", "Hook",     "What makes it scroll-stopping?"],
                ].map(([emoji, key, val]) => (
                  <div key={key} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, lineHeight: 1.4 }}>{emoji}</span>
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
                  { label: "Copy caption", sub: "Copy generated text", icon: <Copy size={13} />, action: copyCaption, disabled: !result },
                  { label: "My Work",      sub: "View saved content",  icon: <FileText size={13} />, action: () => router.push("/dashboard/work"), disabled: false },
                  { label: "Reset form",   sub: "Clear and start fresh", icon: <RotateCcw size={13} />, action: clearAll, disabled: false },
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

            {/* Plan card */}
            <div
              className="card"
              style={{
                padding: "22px 24px",
                background: isPaid ? "rgba(5,150,105,.05)" : "#111",
                borderColor: isPaid ? "rgba(5,150,105,.2)" : "#1e1e1e",
              }}
            >
              <div className="section-label">Current plan</div>
              <div className="font-display" style={{ fontSize: 26, color: "white", marginBottom: 6, letterSpacing: "-0.02em" }}>
                {subscriptionPlan ? subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1) : "Free"}
              </div>
              <div className="font-sans" style={{ fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: isPaid ? 0 : 16 }}>
                {isPaid
                  ? "You have premium image generation and unlimited content."
                  : "Upgrade to unlock images and faster generation."}
              </div>
              {!isPaid && (
                <button
                  onClick={() => router.push("/upgrade")}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 10,
                    background: "white", color: "#111",
                    border: "none", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "background .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#eee")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
                >
                  Upgrade — $10/mo <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── OUTPUT ── */}
        {(result || imageUrl) && (
          <motion.div
            className="a3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginTop: 28 }}
          >
            <div className="section-label" style={{ marginBottom: 16 }}>
              <CheckCircle size={11} style={{ display: "inline", marginRight: 5, color: "#059669" }} />
              Generated output
            </div>

            <div className={imageUrl ? "output-grid-double" : "output-grid-single"}>

              {/* Caption preview */}
              <div className="preview-post">
                {/* Browser-style top bar */}
                <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />
                <div className="preview-header">
                  <div className="preview-avatar" />
                  <div style={{ flex: 1 }}>
                    <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                      autopilot.creator <span style={{ color: "#059669" }}>✔</span>
                    </div>
                    <div className="font-sans" style={{ fontSize: 11, color: "#444" }}>Generated with AutopilotAI</div>
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={copyCaption}
                    style={{ padding: "7px 12px" }}
                  >
                    {copied ? <><CheckCircle size={12} style={{ color: "#4ade80" }} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>

                <div className="preview-body">
                  <p className="font-sans" style={{ fontSize: 14, color: "#ccc", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{result}</p>
                </div>

                <div className="preview-actions">
                  <div style={{ display: "flex", gap: 16, fontSize: 18 }}>❤️ 💬 🔁</div>
                  <div className="font-sans" style={{ fontSize: 11, color: "#333" }}>Posted just now · AutopilotAI</div>
                </div>
              </div>

              {/* Image preview */}
              {imageUrl && (
                <div className="preview-post">
                  <div style={{ height: 3, background: "linear-gradient(90deg, #8b5cf6, #ec4899)" }} />
                  <div className="preview-header">
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(139,92,246,.15)", border: "1px solid rgba(139,92,246,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImageIcon size={15} style={{ color: "#8b5cf6" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "white" }}>AI Image</div>
                      <div className="font-sans" style={{ fontSize: 11, color: "#444" }}>Style: {IMAGE_STYLES.find(s => s.value === imageStyle)?.label}</div>
                    </div>
                  </div>

                  <img
                    src={imageUrl}
                    alt="AI Generated"
                    style={{ width: "100%", display: "block", maxHeight: 400, objectFit: "cover" }}
                  />

                  <div className="preview-actions">
                    <button className="btn-ghost" onClick={downloadImage} style={{ padding: "8px 14px" }}>
                      <Download size={13} /> Download
                    </button>
                    <button className="btn-solid" onClick={saveImage} style={{ padding: "8px 16px" }}>
                      <Save size={13} /> Save to My Work
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}