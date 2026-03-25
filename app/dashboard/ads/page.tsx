"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  Megaphone, Copy, RotateCcw, ChevronRight,
  CheckCircle, AlertCircle, Wand2, Sparkles,
  Facebook, Search, Music, Target, TrendingUp, Globe, Eye,
  Image as ImageIcon, Lock, Download, Save,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { key: "meta",   label: "Meta",   sub: "Facebook & Instagram", icon: <Facebook size={14} />, color: "#1877F2" },
  { key: "google", label: "Google", sub: "Search Ads",           icon: <Search size={14} />,   color: "#EA4335" },
  { key: "tiktok", label: "TikTok", sub: "Short-form video",     icon: <Music size={14} />,    color: "#69C9D0" },
];

const OBJECTIVES = [
  { key: "Leads",          icon: <Target size={13} />,    color: "#059669" },
  { key: "Sales",          icon: <TrendingUp size={13} />, color: "#0ea5e9" },
  { key: "Traffic",        icon: <Globe size={13} />,      color: "#8b5cf6" },
  { key: "Brand Awareness",icon: <Eye size={13} />,        color: "#f59e0b" },
];

const IMAGE_STYLES = [
  { value: "clean",     label: "Clean Corporate",       desc: "Modern SaaS — crisp, premium." },
  { value: "cinematic", label: "Cinematic",             desc: "Moody, dramatic, high-contrast." },
  { value: "minimal",   label: "Minimal Illustration",  desc: "Simple shapes, soft composition." },
  { value: "social",    label: "Social Thumbnail",      desc: "Bold framing, attention-grabbing." },
  { value: "product",   label: "Product Showcase",      desc: "Hero lighting, premium scene." },
] as const;

type StyleValue = typeof IMAGE_STYLES[number]["value"];

interface ParsedAd { headline: string; primary: string; cta: string; }

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdsPage() {
  const router = useRouter();

  // Auth
  const [name, setName]                         = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  // Form
  const [platform, setPlatform]   = useState("meta");
  const [objective, setObjective] = useState("Leads");
  const [product, setProduct]     = useState("");
  const [audience, setAudience]   = useState("");

  // Image generation
  const [generateImage, setGenerateImage] = useState(false);
  const [imageStyle, setImageStyle]       = useState<StyleValue>("clean");
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

  // Output
  const [parsedAds, setParsedAds] = useState<ParsedAd[]>([]);
  const [rawResult, setRawResult] = useState("");
  const [imageUrl, setImageUrl]   = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [toast, setToast]     = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | "all" | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [savedImage, setSavedImage] = useState(false);

  const isPaid = subscriptionPlan?.toLowerCase() !== "free";

  // ── Auth ────────────────────────────────────────────────────────────────────
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

  function parseAds(text: string) {
    const blocks = text.split(/AD\s*\d+:/gi).map((b) => b.trim()).filter(Boolean);
    const ads = blocks.map((block) => ({
      headline: block.match(/Headline:\s*(.*)/i)?.[1]?.trim() || "Untitled Ad",
      primary:  block.match(/Primary text:\s*([\s\S]*?)CTA:/i)?.[1]?.trim() || block,
      cta:      block.match(/CTA:\s*(.*)/i)?.[1]?.trim() || "Learn More",
    }));
    setParsedAds(ads);
  }

  const handleGenerate = async () => {
    setError(""); setRawResult(""); setParsedAds([]); setImageUrl(null); setImageError(null); setSavedImage(false);
    if (!product.trim() || !audience.trim()) {
      setError("Please fill in both product and audience fields.");
      return;
    }
    try {
      setLoading(true);
      const payload: any = {
        platform, objective, product, audience,
        prompt: `Generate ad copy for ${platform} with objective ${objective}. Product: ${product}. Audience: ${audience}.`,
      };

      if (generateImage && isPaid) {
        payload.generate_image = true;
        payload.image_style = imageStyle;
      }

      const res = await api.post("/api/ads/generate", payload);
      const output: string = res.data.output || "";
      setRawResult(output);
      parseAds(output);

      if (res.data.image) {
        setImageUrl(res.data.image);
      } else if (res.data.error) {
        setImageError(res.data.error);
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyAd = async (text: string, idx: number | "all") => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
    showToast("ok", idx === "all" ? "All ads copied" : `Ad ${Number(idx) + 1} copied`);
  };

  const copyImageUrl = async () => {
    if (!imageUrl) return;
    await navigator.clipboard.writeText(imageUrl);
    setCopiedImage(true);
    setTimeout(() => setCopiedImage(false), 1800);
    showToast("ok", "Image URL copied");
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "ad-visual.png";
    a.click();
  };

  const saveImage = async () => {
    if (!imageUrl) return;
    try {
      await api.post("/api/images/save", {
        image_url: imageUrl,
        text_content: rawResult.slice(0, 500),
        image_style: IMAGE_STYLES.find(s => s.value === imageStyle)?.label || imageStyle,
      });
      setSavedImage(true);
      showToast("ok", "Image saved to My Work");
    } catch {
      showToast("err", "Failed to save image");
    }
  };

  const clearAll = () => {
    setProduct(""); setAudience(""); setParsedAds([]); setRawResult(""); setError("");
    setGenerateImage(false); setImageStyle("clean"); setImageUrl(null); setImageError(null);
    setSavedImage(false);
  };

  const activePlatform = PLATFORMS.find((p) => p.key === platform)!;
  const canGenerate    = product.trim().length > 0 && audience.trim().length > 0;

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
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 20px; overflow: hidden;
        }

        .field {
          width: 100%; background: #0a0a0a;
          border: 1px solid #2a2a2a; border-radius: 12px;
          padding: 13px 16px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e5e5e5;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .field::placeholder { color: #444; }
        .field:hover  { border-color: #333; }
        .field:focus  { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }

        .btn-generate {
          width: 100%; padding: 15px; border-radius: 14px; border: none;
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
          letter-spacing: -.01em; cursor: pointer;
          background: linear-gradient(135deg, #059669, #0ea5e9); color: white;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          transition: filter .2s, transform .2s, box-shadow .2s;
        }
        .btn-generate:hover:not(:disabled) {
          filter: brightness(1.08); transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(5,150,105,.28);
        }
        .btn-generate:disabled { background: #1e1e1e; color: #444; cursor: not-allowed; }

        .btn-ghost {
          background: transparent; border: 1px solid #2a2a2a; border-radius: 10px;
          padding: 9px 16px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600; color: #888; cursor: pointer;
          display: inline-flex; align-items: center; gap: 6px;
          transition: border-color .2s, color .2s, background .2s;
        }
        .btn-ghost:hover { border-color: #444; color: #ccc; background: #111; }
        .btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

        .label {
          display: block; font-family: 'DM Sans', sans-serif;
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

        /* ── Platform Buttons ── */
        .platform-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 16px 12px;
          background: #0d0d0d;
          border: 1px solid #232323;
          border-radius: 16px;
          cursor: pointer;
          transition: border-color .2s, background .2s, transform .15s, box-shadow .2s;
          min-width: 0;
        }
        .platform-btn:hover {
          border-color: #333;
          background: #141414;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,.3);
        }
        .platform-btn.active {
          background: #111;
          box-shadow: 0 4px 20px rgba(0,0,0,.4), inset 0 0 0 1px rgba(255,255,255,.04);
        }
        .platform-btn-icon {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: #1a1a1a;
          border: 1px solid #252525;
          transition: background .2s, border-color .2s;
        }
        .platform-btn.active .platform-btn-icon {
          background: rgba(255,255,255,.05);
        }
        .platform-btn-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #777;
          letter-spacing: -.01em;
          transition: color .2s;
        }
        .platform-btn.active .platform-btn-label { color: #eee; }
        .platform-btn:hover .platform-btn-label  { color: #aaa; }
        .platform-btn-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: #3a3a3a;
          font-weight: 500;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          transition: color .2s;
        }
        .platform-btn.active .platform-btn-sub { color: #555; }

        /* ── Objective Pills ── */
        .obj-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          background: #0d0d0d;
          border: 1px solid #222;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          transition: border-color .2s, background .2s, color .2s, transform .15s, box-shadow .2s;
          white-space: nowrap;
        }
        .obj-pill:hover {
          border-color: #333;
          color: #999;
          background: #141414;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,.25);
        }

        /* Toggle */
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

        /* Style pill */
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
        }
        .style-pill:hover  { border-color: #333; background: #111; }
        .style-pill.active { border-color: rgba(5,150,105,.5); background: rgba(5,150,105,.07); }

        /* Ad result card */
        .ad-card {
          background: #111; border: 1px solid #1e1e1e; border-radius: 18px;
          overflow: hidden; transition: border-color .2s, transform .2s;
        }
        .ad-card:hover { border-color: #2a2a2a; transform: translateY(-2px); }
        .ad-card-top { height: 3px; }
        .ad-card-body { padding: 22px; }
        .ad-card-footer {
          padding: 14px 22px; border-top: 1px solid #1a1a1a;
          background: #0d0d0d;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
        }
        .ad-cta-pill {
          flex: 1; padding: 10px; border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 800; text-align: center;
          letter-spacing: .03em;
        }

        /* Image preview */
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
        .preview-body { padding: 20px; }
        .preview-actions {
          padding: 14px 20px;
          border-top: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
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
            fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8,
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
              <Megaphone size={11} style={{ display: "inline", marginRight: 5, color: "#ef4444" }} />
              Ad Generator
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Ads that <em style={{ color: "#059669" }}>actually convert.</em>
            </h1>
            <p className="font-sans" style={{ fontSize: 15, color: "#555", marginTop: 8, lineHeight: 1.6, maxWidth: 480 }}>
              Platform-specific copy, tuned to your objective, product, and audience.
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

          {/* LEFT: INPUT */}
          <div className="card">
            <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />
            <div style={{ padding: "32px 36px" }}>

              {/* Platform */}
              <div style={{ marginBottom: 26 }}>
                <label className="label">Platform</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.key}
                      className={`platform-btn ${platform === p.key ? "active" : ""}`}
                      onClick={() => setPlatform(p.key)}
                      style={platform === p.key ? { borderColor: `${p.color}40` } : {}}
                    >
                      <div
                        className="platform-btn-icon"
                        style={platform === p.key ? { borderColor: `${p.color}30`, background: `${p.color}12` } : {}}
                      >
                        <span style={{ color: platform === p.key ? p.color : "#444" }}>{p.icon}</span>
                      </div>
                      <span className="platform-btn-label">{p.label}</span>
                      <span className="platform-btn-sub">{p.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Objective */}
              <div style={{ marginBottom: 26 }}>
                <label className="label">Objective</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {OBJECTIVES.map((o) => (
                    <button
                      key={o.key}
                      className={`obj-pill ${objective === o.key ? "active" : ""}`}
                      onClick={() => setObjective(o.key)}
                      style={objective === o.key ? {
                        borderColor: `${o.color}50`,
                        background: `${o.color}10`,
                        color: "white",
                        boxShadow: `0 0 0 1px ${o.color}20, 0 4px 16px ${o.color}15`,
                      } : {}}
                    >
                      <span style={{ color: objective === o.key ? o.color : "#444" }}>{o.icon}</span>
                      {o.key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">
                  What are you promoting? <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  className="field"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Premium custom mouthguards for fighters"
                />
              </div>

              {/* Audience */}
              <div style={{ marginBottom: 20 }}>
                <label className="label">
                  Target audience <span style={{ color: "#dc2626" }}>*</span>
                </label>
                <input
                  className="field"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. Combat athletes aged 18–35, amateur to semi-pro"
                />
                <p className="font-sans" style={{ fontSize: 12, color: "#444", marginTop: 7 }}>
                  The more specific your audience, the sharper the copy.
                </p>
              </div>

              {/* AI Image Toggle + Styles */}
              <div style={{ marginBottom: generateImage ? 22 : 32 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="font-sans" style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 3 }}>
                      Generate AI Image
                    </div>
                    <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>
                      {isPaid ? "Paired with your ads" : "Paid feature — upgrade to unlock"}
                    </div>
                  </div>
                  <div
                    className={`toggle-track ${generateImage ? "on" : ""}`}
                    onClick={() => {
                      if (!isPaid) { setShowUpgradeNotice(true); return; }
                      setGenerateImage((p) => !p);
                    }}
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
                      Upgrade <ChevronRight size={12} />
                    </button>
                  </div>
                )}
              </div>

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

              <div style={{ height: 1, background: "#1a1a1a", marginBottom: 28 }} />

              {/* Error */}
              {error && (
                <div className="font-sans" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              <button className="btn-generate" onClick={handleGenerate} disabled={loading || !canGenerate}>
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
                    Generating…
                  </>
                ) : (
                  <>
                    <Wand2 size={16} />
                    Generate Ads
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Active config summary */}
            <div className="card" style={{ padding: "20px 22px" }}>
              <div className="section-label">Current config</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <ConfigRow label="Platform" value={activePlatform.label} color={activePlatform.color} />
                <ConfigRow label="Objective" value={objective} color={OBJECTIVES.find(o => o.key === objective)?.color ?? "#888"} />
                <ConfigRow label="Product" value={product || "—"} color="#555" />
                <ConfigRow label="Audience" value={audience || "—"} color="#555" />
              </div>
            </div>

            {/* Tips */}
            <div className="card" style={{ padding: "22px 24px" }}>
              <div className="section-label">Ad principles</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  ["🎯", "Lead with benefit",  "Not features — what do they gain?"],
                  ["⚡", "Hook immediately",   "You have 1.5s to stop the scroll."],
                  ["📌", "One CTA only",       "Don't give them two choices."],
                  ["🔢", "Be specific",        "'Save $47' beats 'save money'."],
                ].map(([emoji, key, val]) => (
                  <div key={key as string} style={{ display: "flex", gap: 10 }}>
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
                  { label: "Copy all ads",  sub: "Full output to clipboard",  icon: <Copy size={13} />,    action: () => copyAd(rawResult, "all"), disabled: !rawResult },
                  { label: "My Work",       sub: "View saved ads",            icon: <Megaphone size={13} />, action: () => router.push("/dashboard/work"), disabled: false },
                  { label: "Reset",         sub: "Clear and start fresh",     icon: <RotateCcw size={13} />, action: clearAll, disabled: false },
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
            <div className="card" style={{ padding: "20px 22px", background: "rgba(5,150,105,.04)", borderColor: "rgba(5,150,105,.15)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Sparkles size={14} style={{ color: "#059669", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 5 }}>Pro tip</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                    Generate 3 variations and A/B test them. Even small headline changes can double your CTR.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── AD RESULTS + IMAGE PREVIEW ── */}
        {parsedAds.length > 0 && (
          <motion.div
            className="a3"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            style={{ marginTop: 28 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>
                  <CheckCircle size={11} style={{ display: "inline", marginRight: 5, color: "#059669" }} />
                  {parsedAds.length} ad variation{parsedAds.length !== 1 ? "s" : ""} generated
                </div>
                <div className="font-sans" style={{ fontSize: 13, color: "#555" }}>
                  {activePlatform.label} · {objective}
                </div>
              </div>
              <button className="btn-ghost" onClick={() => copyAd(rawResult, "all")}>
                {copiedIdx === "all" ? <><CheckCircle size={12} style={{ color: "#4ade80" }} /> Copied</> : <><Copy size={13} /> Copy all</>}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {parsedAds.map((ad, i) => {
                const objColor = OBJECTIVES.find(o => o.key === objective)?.color ?? "#059669";
                return (
                  <div key={i} className="ad-card">
                    <div className="ad-card-top" style={{ background: `linear-gradient(90deg, ${activePlatform.color}, ${objColor})` }} />
                    <div className="ad-card-body">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: `${activePlatform.color}18`,
                            border: `1px solid ${activePlatform.color}30`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: activePlatform.color,
                          }}>
                            {activePlatform.icon}
                          </div>
                          <span className="font-sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#444" }}>
                            Variation {i + 1}
                          </span>
                        </div>
                        <button
                          className="btn-ghost"
                          style={{ padding: "5px 10px", fontSize: 11 }}
                          onClick={() => copyAd(`${ad.headline}\n\n${ad.primary}\n\nCTA: ${ad.cta}`, i)}
                        >
                          {copiedIdx === i
                            ? <><CheckCircle size={11} style={{ color: "#4ade80" }} /> Copied</>
                            : <><Copy size={11} /> Copy</>
                          }
                        </button>
                      </div>

                      <div className="font-display" style={{ fontSize: 18, color: "white", lineHeight: 1.25, marginBottom: 10, letterSpacing: "-0.02em" }}>
                        {ad.headline}
                      </div>

                      <p className="font-sans" style={{ fontSize: 13, color: "#888", lineHeight: 1.75, marginBottom: 16, whiteSpace: "pre-wrap" }}>
                        {ad.primary}
                      </p>
                    </div>

                    <div className="ad-card-footer">
                      <div
                        className="ad-cta-pill font-sans"
                        style={{ background: `${objColor}18`, border: `1px solid ${objColor}30`, color: objColor }}
                      >
                        {ad.cta}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Image Preview */}
            {(imageUrl || imageError) && (
              <div style={{ marginTop: 40 }}>
                <div className="section-label" style={{ marginBottom: 12 }}>
                  <ImageIcon size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                  AI-Generated Visual
                </div>

                {imageUrl ? (
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
                      alt="Generated ad visual"
                      style={{ width: "100%", display: "block", maxHeight: 400, objectFit: "cover" }}
                    />

                    <div className="preview-actions">
                      <button className="btn-ghost" onClick={downloadImage} style={{ padding: "8px 14px" }}>
                        <Download size={13} /> Download
                      </button>
                      <button className="btn-ghost" onClick={copyImageUrl} style={{ padding: "8px 14px" }}>
                        {copiedImage ? <><CheckCircle size={13} style={{ color: "#4ade80" }} /> Copied</> : <><Copy size={13} /> Copy URL</>}
                      </button>
                      <button className="btn-ghost" onClick={saveImage} disabled={savedImage} style={{ padding: "8px 14px" }}>
                        {savedImage ? <><CheckCircle size={13} style={{ color: "#4ade80" }} /> Saved</> : <><Save size={13} /> Save to My Work</>}
                      </button>
                    </div>
                  </div>
                ) : imageError ? (
                  <div className="font-sans" style={{ color: "#f87171", fontSize: 14, padding: "16px", background: "#1c0a0a", borderRadius: 12, border: "1px solid #7f1d1d" }}>
                    <AlertCircle size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
                    {imageError}
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConfigRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <span className="font-sans" style={{ fontSize: 12, color: "#444", fontWeight: 600 }}>{label}</span>
      <span
        className="font-sans"
        style={{
          fontSize: 12, fontWeight: 700, color,
          maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}