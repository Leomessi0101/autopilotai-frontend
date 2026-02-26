"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  FileText, Mail, Megaphone, ImageIcon, Zap,
  Copy, Download, X, Search, CheckCircle,
  ChevronRight, RotateCcw, ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkItem = {
  id: number;
  content_type: "content" | "email" | "ad" | "growth_pack" | "growth_pack_social" | "growth_pack_email" | "growth_pack_ads" | string;
  prompt: string;
  result: string;
  created_at?: string;
};

type ImageItem = {
  id: number;
  image_url: string;
  text_content?: string;
  image_style?: string;
  created_at?: string;
};

type FilterType = "all" | "content" | "email" | "ad";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function labelForType(type: string): string {
  if (type === "content")              return "Content";
  if (type === "email")                return "Email";
  if (type === "ad")                   return "Ad";
  if (type === "growth_pack")          return "Growth Pack";
  if (type === "growth_pack_social")   return "Social";
  if (type === "growth_pack_email")    return "Email";
  if (type === "growth_pack_ads")      return "Ads";
  if (type.startsWith("growth_pack_refine_")) return "Refine";
  if (type.startsWith("growth_pack_regen_"))  return "Regenerate";
  return "AI Output";
}

function typeColor(type: string): string {
  if (type === "content" || type.includes("social")) return "#8b5cf6";
  if (type === "email"   || type.includes("email"))  return "#0ea5e9";
  if (type === "ad"      || type.includes("ads"))    return "#ef4444";
  if (type.startsWith("growth_pack"))                return "#f59e0b";
  return "#555";
}

function typeIcon(type: string) {
  if (type === "content" || type.includes("social")) return <FileText size={12} />;
  if (type === "email"   || type.includes("email"))  return <Mail size={12} />;
  if (type === "ad"      || type.includes("ads"))    return <Megaphone size={12} />;
  if (type.startsWith("growth_pack"))                return <Zap size={12} />;
  return <FileText size={12} />;
}

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MyWorkPage() {
  const router = useRouter();

  const [name, setName]                         = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  const [items, setItems]           = useState<WorkItem[]>([]);
  const [images, setImages]         = useState<ImageItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<FilterType>("all");
  const [activeTab, setActiveTab]   = useState<"content" | "images">("content");

  const [selected, setSelected]           = useState<WorkItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [copied, setCopied]               = useState(false);

  // ── Auth + fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) { router.push("/login"); return; }

    api.get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => { localStorage.removeItem("autopilot_token"); router.push("/login"); });

    api.get("/api/work")
      .then((res) => setItems((res.data || []).reverse()))
      .finally(() => setLoading(false));

    api.get("/api/images/history")
      .then((res) => setImages(res.data || []))
      .finally(() => setImageLoading(false));
  }, [router]);

  // ── Growth pack grouping ────────────────────────────────────────────────────
  const growthPackGroups = useMemo(() => {
    const packs = items.filter((i) => i.content_type === "growth_pack");
    return packs.map((pack) => {
      const group = items.filter((i) => i.prompt === pack.prompt && String(i.content_type).startsWith("growth_pack"));
      return {
        pack,
        social:  group.find((x) => x.content_type === "growth_pack_social")  || null,
        email:   group.find((x) => x.content_type === "growth_pack_email")   || null,
        ads:     group.find((x) => x.content_type === "growth_pack_ads")     || null,
        refines: group.filter((x) => String(x.content_type).startsWith("growth_pack_refine_")),
        regens:  group.filter((x) => String(x.content_type).startsWith("growth_pack_regen_")),
      };
    });
  }, [items]);

  const normalItems = useMemo(
    () => items.filter((i) => !String(i.content_type).startsWith("growth_pack")),
    [items]
  );

  const filtered = normalItems.filter((item) => {
    const matchType   = filter === "all" || item.content_type === filter;
    const matchSearch = !search ||
      item.result.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalItems = normalItems.length + images.length + growthPackGroups.length;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans    { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .a1 { animation: fadeUp .5s ease .05s both; }
        .a2 { animation: fadeUp .5s ease .14s both; }
        .a3 { animation: fadeUp .5s ease .22s both; }

        .card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 18px; overflow: hidden;
        }

        /* Work row */
        .work-row {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 16px; padding: 20px 22px;
          cursor: pointer; transition: border-color .18s, background .18s;
          display: flex; align-items: flex-start; gap: 16px;
        }
        .work-row:hover { border-color: #2a2a2a; background: #141414; }

        /* Image grid card */
        .img-card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 14px; overflow: hidden; cursor: pointer;
          transition: border-color .18s, transform .18s;
        }
        .img-card:hover { border-color: #2a2a2a; transform: translateY(-2px); }

        /* Type badge */
        .type-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px; font-weight: 800;
          letter-spacing: .06em; text-transform: uppercase;
        }

        /* Tab */
        .tab-btn {
          padding: 8px 18px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          border: 1px solid #222; background: transparent;
          cursor: pointer; color: #555;
          transition: all .18s;
        }
        .tab-btn:hover { border-color: #333; color: #aaa; }
        .tab-btn.active { background: white; color: #111; border-color: white; }

        /* Filter chip */
        .filter-chip {
          padding: 7px 14px; border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          border: 1px solid #222; background: #0d0d0d;
          cursor: pointer; color: #555;
          transition: all .18s;
        }
        .filter-chip:hover { border-color: #333; color: #aaa; }
        .filter-chip.active { background: #1a1a1a; border-color: #333; color: white; }

        /* Search */
        .search-field {
          background: #0d0d0d; border: 1px solid #222;
          border-radius: 10px; padding: 10px 14px 10px 38px;
          font-family: 'DM Sans', sans-serif; font-size: 13px;
          color: #e5e5e5; outline: none; width: 100%;
          transition: border-color .2s;
        }
        .search-field::placeholder { color: #444; }
        .search-field:focus { border-color: #333; }

        /* Buttons */
        .btn-ghost {
          background: transparent; border: 1px solid #2a2a2a; border-radius: 9px;
          padding: 8px 14px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 600; color: #666;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
          transition: border-color .18s, color .18s, background .18s;
        }
        .btn-ghost:hover { border-color: #444; color: #ccc; background: #111; }
        .btn-solid {
          background: white; color: #111; border: none; border-radius: 9px;
          padding: 8px 16px; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 700;
          cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
          transition: background .18s;
        }
        .btn-solid:hover { background: #eee; }

        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,.75);
          z-index: 300; display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-box {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 20px; overflow: hidden;
          width: 100%; max-height: 85vh;
          display: flex; flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,.6);
        }
        .modal-header {
          padding: 20px 24px; border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          flex-shrink: 0;
        }
        .modal-body {
          padding: 24px; overflow-y: auto; flex: 1;
        }
        .modal-footer {
          padding: 16px 24px; border-top: 1px solid #1a1a1a;
          display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0;
          background: #0d0d0d;
        }

        /* Growth pack */
        .gp-card {
          background: #111; border: 1px solid #1e1e1e; border-radius: 18px; overflow: hidden;
        }
        .gp-section {
          background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 12px;
          padding: 16px; cursor: pointer; transition: border-color .18s;
          text-align: left; width: 100%;
        }
        .gp-section:hover { border-color: #2a2a2a; }
        .gp-section:disabled { opacity: .4; cursor: not-allowed; }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: #444; margin-bottom: 16px;
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* PAGE HEADER */}
        <div className="a1" style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div className="section-label" style={{ marginBottom: 10 }}>Workspace</div>
              <h1 className="font-display" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                My <em style={{ color: "#059669" }}>Work</em>
              </h1>
              <p className="font-sans" style={{ fontSize: 15, color: "#555", marginTop: 8 }}>
                {totalItems > 0 ? `${totalItems} saved item${totalItems !== 1 ? "s" : ""}` : "All your generated content in one place."}
              </p>
            </div>
            <button className="btn-ghost" onClick={() => router.push("/dashboard")}>
              Dashboard <ChevronRight size={13} />
            </button>
          </div>

          {/* Main tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
            <button className={`tab-btn ${activeTab === "content" ? "active" : ""}`} onClick={() => setActiveTab("content")}>
              Content & Ads
              {normalItems.length + growthPackGroups.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, color: activeTab === "content" ? "#888" : "#444" }}>
                  {normalItems.length + growthPackGroups.length}
                </span>
              )}
            </button>
            <button className={`tab-btn ${activeTab === "images" ? "active" : ""}`} onClick={() => setActiveTab("images")}>
              Images
              {images.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 11, color: activeTab === "images" ? "#888" : "#444" }}>
                  {images.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TAB: CONTENT & ADS
        ══════════════════════════════════════════ */}
        {activeTab === "content" && (
          <div className="a2">

            {/* Growth Packs */}
            {growthPackGroups.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div className="section-label" style={{ marginBottom: 16 }}>
                  <Zap size={11} style={{ display: "inline", marginRight: 5, color: "#f59e0b" }} />
                  Growth Packs
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {growthPackGroups.map((g) => (
                    <div key={g.pack.id} className="gp-card">
                      <div style={{ height: 3, background: "linear-gradient(90deg, #f59e0b, #059669)" }} />
                      <div style={{ padding: "22px 24px" }}>
                        {/* Top row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                          <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <span className="type-badge" style={{ background: "rgba(245,158,11,.12)", color: "#f59e0b", borderColor: "rgba(245,158,11,.25)" }}>
                                <Zap size={10} /> Growth Pack
                              </span>
                              {g.pack.created_at && (
                                <span className="font-sans" style={{ fontSize: 11, color: "#444" }}>{fmtDate(g.pack.created_at)}</span>
                              )}
                            </div>
                            <p className="font-sans" style={{ fontSize: 13, color: "#888", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {g.pack.prompt}
                            </p>
                          </div>
                          <button className="btn-ghost" onClick={() => setSelected(g.pack)}>
                            Open <ExternalLink size={11} />
                          </button>
                        </div>

                        {/* 3 section cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                          {[
                            { label: "Social", item: g.social, color: "#8b5cf6" },
                            { label: "Email",  item: g.email,  color: "#0ea5e9" },
                            { label: "Ads",    item: g.ads,    color: "#ef4444" },
                          ].map(({ label, item, color }) => (
                            <button
                              key={label}
                              className="gp-section"
                              disabled={!item}
                              onClick={() => item && setSelected(item)}
                            >
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <span className="font-sans" style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: item ? color : "#333" }}>
                                  {label}
                                </span>
                                {item && <ChevronRight size={11} style={{ color: "#444" }} />}
                              </div>
                              <p className="font-sans" style={{ fontSize: 12, color: item ? "#777" : "#333", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {item ? (item.result.slice(0, 120) + (item.result.length > 120 ? "…" : "")) : "Not generated"}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search + filters */}
            {normalItems.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#444" }} />
                  <input
                    className="search-field"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search content, emails, ads…"
                  />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {(["all", "content", "email", "ad"] as FilterType[]).map((t) => (
                    <button
                      key={t}
                      className={`filter-chip ${filter === t ? "active" : ""}`}
                      onClick={() => setFilter(t)}
                    >
                      {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Work items */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 32, height: 32, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
                <p className="font-sans" style={{ fontSize: 14, color: "#555" }}>Loading your work…</p>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState router={router} hasItems={normalItems.length > 0} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map((item) => (
                  <WorkRow key={item.id} item={item} onClick={() => setSelected(item)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: IMAGES
        ══════════════════════════════════════════ */}
        {activeTab === "images" && (
          <div className="a2">
            {imageLoading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ width: 32, height: 32, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
                <p className="font-sans" style={{ fontSize: 14, color: "#555" }}>Loading images…</p>
              </div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(139,92,246,.1)", border: "1px solid rgba(139,92,246,.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <ImageIcon size={22} style={{ color: "#8b5cf6" }} />
                </div>
                <p className="font-sans" style={{ fontSize: 15, fontWeight: 600, color: "#888", marginBottom: 6 }}>No saved images yet</p>
                <p className="font-sans" style={{ fontSize: 13, color: "#555" }}>
                  Generate images in the Content Generator and save them here.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {images.map((img) => (
                  <div key={img.id} className="img-card" onClick={() => setSelectedImage(img)}>
                    <img src={img.image_url} alt="AI Generated" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "12px 14px" }}>
                      {img.image_style && (
                        <div className="font-sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: "#555", marginBottom: 5 }}>
                          {img.image_style}
                        </div>
                      )}
                      <p className="font-sans" style={{ fontSize: 12, color: "#777", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {img.text_content || "No caption"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── WORK MODAL ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .2 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal-box"
              style={{ maxWidth: 680 }}
              initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .96, opacity: 0 }}
              transition={{ duration: .2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    className="type-badge"
                    style={{
                      background: `${typeColor(selected.content_type)}18`,
                      color: typeColor(selected.content_type),
                    }}
                  >
                    {typeIcon(selected.content_type)}
                    {labelForType(selected.content_type)}
                  </span>
                  {selected.created_at && (
                    <span className="font-sans" style={{ fontSize: 12, color: "#555" }}>{fmtDate(selected.created_at)}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888" }}
                >
                  <X size={14} />
                </button>
              </div>

              {selected.prompt && (
                <div style={{ padding: "14px 24px", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
                  <div className="font-sans" style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#444", marginBottom: 5 }}>Prompt</div>
                  <p className="font-sans" style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{selected.prompt}</p>
                </div>
              )}

              <div className="modal-body">
                <pre className="font-sans" style={{ fontSize: 14, color: "#ccc", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  {selected.result}
                </pre>
              </div>

              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setSelected(null)}>
                  Close
                </button>
                <button className="btn-solid" onClick={() => copyText(selected.result)}>
                  {copied ? <><CheckCircle size={12} style={{ color: "#059669" }} /> Copied</> : <><Copy size={12} /> Copy text</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── IMAGE MODAL ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .2 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="modal-box"
              style={{ maxWidth: 760 }}
              initial={{ scale: .96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .96, opacity: 0 }}
              transition={{ duration: .2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="type-badge" style={{ background: "rgba(139,92,246,.12)", color: "#8b5cf6" }}>
                    <ImageIcon size={10} /> AI Image
                  </span>
                  {selectedImage.image_style && (
                    <span className="font-sans" style={{ fontSize: 12, color: "#555" }}>Style: {selectedImage.image_style}</span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{ background: "#1a1a1a", border: "1px solid #222", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#888" }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="modal-body" style={{ padding: 0 }}>
                <img src={selectedImage.image_url} alt="Saved AI" style={{ width: "100%", maxHeight: "60vh", objectFit: "contain", display: "block", background: "#0d0d0d" }} />
                {selectedImage.text_content && (
                  <div style={{ padding: "18px 24px", borderTop: "1px solid #1a1a1a" }}>
                    <p className="font-sans" style={{ fontSize: 13, color: "#888", lineHeight: 1.65 }}>{selectedImage.text_content}</p>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setSelectedImage(null)}>
                  Close
                </button>
                <button
                  className="btn-solid"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = selectedImage.image_url;
                    a.download = "autopilotai-image.png";
                    a.click();
                  }}
                >
                  <Download size={12} /> Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function WorkRow({ item, onClick }: { item: WorkItem; onClick: () => void }) {
  const color = typeColor(item.content_type);
  const preview = item.result.slice(0, 180) + (item.result.length > 180 ? "…" : "");

  return (
    <div className="work-row" onClick={onClick}>
      {/* Color strip */}
      <div style={{ width: 3, borderRadius: 2, background: color, flexShrink: 0, alignSelf: "stretch", minHeight: 44 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span
            className="type-badge"
            style={{ background: `${color}15`, color }}
          >
            {typeIcon(item.content_type)}
            {labelForType(item.content_type)}
          </span>
          {item.created_at && (
            <span className="font-sans" style={{ fontSize: 11, color: "#444" }}>{fmtDate(item.created_at)}</span>
          )}
        </div>
        <p className="font-sans" style={{ fontSize: 13, color: "#777", lineHeight: 1.65, overflow: "hidden" }}>
          {preview || "(empty)"}
        </p>
      </div>
      <ChevronRight size={15} style={{ color: "#333", flexShrink: 0, marginTop: 2 }} />
    </div>
  );
}

function EmptyState({ router, hasItems }: { router: any; hasItems: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(5,150,105,.08)", border: "1px solid rgba(5,150,105,.18)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <FileText size={22} style={{ color: "#059669" }} />
      </div>
      <p className="font-sans" style={{ fontSize: 15, fontWeight: 600, color: "#888", marginBottom: 6 }}>
        {hasItems ? "No matching results" : "Nothing here yet"}
      </p>
      <p className="font-sans" style={{ fontSize: 13, color: "#555", marginBottom: 24 }}>
        {hasItems ? "Try a different search or filter." : "Everything you generate is saved here automatically."}
      </p>
      {!hasItems && (
        <button
          onClick={() => router.push("/dashboard")}
          style={{ background: "white", color: "#111", border: "none", borderRadius: 10, padding: "10px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
        >
          Start generating →
        </button>
      )}
    </div>
  );
}