"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Mail,
  Megaphone,
  Briefcase,
  Globe,
  Zap,
  BarChart3,
  ChevronRight,
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function normalizeSlug(input: string) {
  let s = (input || "").trim().toLowerCase();
  s = s.replace(/\s+/g, "-");
  s = s.replace(/[^a-z0-9-]/g, "");
  s = s.replace(/-+/g, "-");
  s = s.replace(/^-+/, "").replace(/-+$/, "");
  return s;
}

function isValidSlug(slug: string) {
  return /^[a-z0-9-]{3,30}$/.test(slug);
}

export default function DashboardPage() {
  const router = useRouter();
  const [initial, setInitial] = useState("U");
  const [userName, setUserName] = useState<string | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [usage, setUsage] = useState<{ used: number; limit: number | null }>({ used: 0, limit: null });
  const [workCount, setWorkCount] = useState(0);
  const [loadingSite, setLoadingSite] = useState(true);
  const [existingSite, setExistingSite] = useState<null | { username: string; status: "draft" | "published" }>(null);

  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [username, setUsername] = useState("");
  const [creating, setCreating] = useState(false);

  const cleanedUsername = useMemo(() => normalizeSlug(username), [username]);
  const usernameValid = useMemo(() => isValidSlug(cleanedUsername), [cleanedUsername]);

  const [toast, setToast] = useState<null | { type: "ok" | "err" | "info"; msg: string }>(null);

  function showToast(type: "ok" | "err" | "info", msg: string, ms = 3000) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), ms);
  }

  useEffect(() => {
    const token = localStorage.getItem("autopilot_token");
    if (!token) { router.push("/login"); return; }

    async function load() {
      try {
        const [meRes, siteRes, workRes] = await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/dashboard/websites").catch(() => ({ data: { data: { websites: [] } } })),
          api.get("/api/work").catch(() => ({ data: [] })),
        ]);
        const me = meRes.data;
        if (me?.name) { setInitial(me.name.charAt(0).toUpperCase()); setUserName(me.name); }
        if (me?.subscription_plan) setSubscriptionPlan(me.subscription_plan);
        if (me?.used_generations != null || me?.monthly_limit != null) {
          setUsage({ used: me?.used_generations ?? 0, limit: me?.monthly_limit ?? null });
        }
        const websites = siteRes.data?.data?.websites || [];
        if (websites.length > 0) {
          const site = websites[0];
          setExistingSite({ username: site.username, status: site.publish_status || "draft" });
        }
        const workItems = Array.isArray(workRes.data) ? workRes.data : [];
        setWorkCount(workItems.length);
      } catch {
        localStorage.removeItem("autopilot_token");
        router.push("/login");
      } finally {
        setLoadingSite(false);
      }
    }
    load();
  }, [router]);

  async function generateWebsite() {
    if (!businessName.trim()) { showToast("err", "Enter your business name"); return; }
    if (!businessDescription.trim()) { showToast("err", "Describe your business so AI knows what to build"); return; }
    if (!usernameValid) { showToast("err", "Website address must be 3–30 characters (a–z, 0–9, hyphens)"); return; }

    setCreating(true);
    setToast(null);
    try {
      const res = await api.post("/api/dashboard/websites/create", {
        username: cleanedUsername,
        name: businessName.trim(),
        prompt: businessDescription.trim(),
      });
      if (res.data?.ok) {
        const newUsername = res.data.data?.username || cleanedUsername;
        setExistingSite({ username: newUsername, status: "draft" });
        setBusinessName(""); setBusinessDescription(""); setUsername("");
        showToast("ok", "Website created! Taking you to the editor...", 1500);
        setTimeout(() => router.push(`/r/${newUsername}?edit=1`), 1500);
      } else {
        throw new Error(res.data?.message || "Failed to create website");
      }
    } catch (err: any) {
      showToast("err", err?.response?.data?.detail || err?.message || "Failed to generate website. Try again.");
    } finally {
      setCreating(false);
    }
  }

  if (loadingSite) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" }}>Loading your workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "white" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');

        * { box-sizing: border-box; }
        .font-display { font-family: 'Instrument Serif', Georgia, serif; }
        .font-sans { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .anim-1 { animation: fadeUp 0.5s ease forwards; animation-delay: 0.05s; opacity: 0; }
        .anim-2 { animation: fadeUp 0.5s ease forwards; animation-delay: 0.12s; opacity: 0; }
        .anim-3 { animation: fadeUp 0.5s ease forwards; animation-delay: 0.2s; opacity: 0; }
        .anim-4 { animation: fadeUp 0.5s ease forwards; animation-delay: 0.28s; opacity: 0; }

        .stat-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 16px;
          padding: 20px 22px;
          transition: border-color 0.2s, background 0.2s;
        }
        .stat-card:hover {
          border-color: #2a2a2a;
          background: #141414;
        }

        .shortcut-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .shortcut-card:hover {
          border-color: #2a2a2a;
          background: #141414;
          transform: translateY(-2px);
        }

        .main-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 24px;
          overflow: hidden;
        }

        .input-field {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #e5e5e5;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-field::placeholder { color: #444; }
        .input-field:hover { border-color: #333; }
        .input-field:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }

        .input-field-mono {
          font-family: 'DM Mono', 'Fira Code', 'Courier New', monospace;
        }

        .input-field-error { border-color: #7f1d1d !important; box-shadow: 0 0 0 3px rgba(127,29,29,0.1) !important; }

        .textarea-field {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 14px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          color: #e5e5e5;
          outline: none;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          line-height: 1.6;
        }
        .textarea-field::placeholder { color: #444; }
        .textarea-field:hover { border-color: #333; }
        .textarea-field:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.1); }

        .btn-generate {
          width: 100%;
          padding: 16px;
          border-radius: 14px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #059669, #0ea5e9);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: filter 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: -0.01em;
        }
        .btn-generate:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 12px 40px rgba(5,150,105,0.3);
        }
        .btn-generate:disabled {
          background: #1e1e1e;
          color: #444;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #fff;
          color: #111;
          border: none;
          border-radius: 12px;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .btn-primary:hover { background: #eee; transform: translateY(-1px); }

        .btn-secondary {
          background: transparent;
          color: #888;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
        }
        .btn-secondary:hover { border-color: #444; color: #ccc; }

        .upgrade-banner {
          background: #111;
          border: 1px solid #2a1a00;
          border-radius: 20px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 32px;
        }

        .label-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 10px;
          display: block;
        }

        .section-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 16px;
        }

        .url-preview {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          display: flex; align-items: center; gap: 6px;
          margin-top: 8px;
          padding-left: 2px;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 12px;
        }

        .icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <DashboardNavbar name={initial} subscriptionPlan={subscriptionPlan} />

      {/* TOAST */}
      {toast && (
        <div
          className="font-sans"
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            padding: "12px 20px",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            background:
              toast.type === "ok" ? "#052e16" :
              toast.type === "err" ? "#1c0a0a" : "#0c1a2e",
            border: `1px solid ${toast.type === "ok" ? "#166534" : toast.type === "err" ? "#7f1d1d" : "#1e3a5f"}`,
            color:
              toast.type === "ok" ? "#4ade80" :
              toast.type === "err" ? "#f87171" : "#60a5fa",
            whiteSpace: "nowrap",
          }}
        >
          {toast.type === "ok" && <CheckCircle size={16} />}
          {toast.type === "err" && <AlertCircle size={16} />}
          {toast.type === "info" && <Clock size={16} />}
          {toast.msg}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* UPGRADE BANNER */}
        {subscriptionPlan === "free" && existingSite && (
          <div className="upgrade-banner anim-1">
            <div>
              <div className="font-sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", marginBottom: 6 }}>
                Free Plan
              </div>
              <div className="font-display" style={{ fontSize: 20, color: "white", marginBottom: 4 }}>
                Ready to go live?
              </div>
              <p className="font-sans" style={{ fontSize: 14, color: "#666" }}>
                Upgrade to Starter for $10/mo to publish with your own domain.
              </p>
            </div>
            <button
              onClick={() => router.push("/upgrade")}
              className="font-sans"
              style={{
                background: "#d97706",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "11px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "filter 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              Upgrade Now <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* GREETING */}
        <div className="anim-1" style={{ marginBottom: 32 }}>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(28px, 3.5vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {userName ? (
              <>Welcome back, <em style={{ color: "#059669" }}>{userName.split(" ")[0]}</em></>
            ) : (
              "Your workspace"
            )}
          </h1>
        </div>

        {/* STATS */}
        <div
          className="anim-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <StatCard
            icon={<Globe size={15} />}
            label="Website"
            value={existingSite ? (existingSite.status === "published" ? "Live" : "Draft") : "None"}
            sub={existingSite ? existingSite.username : "Create one below"}
            accentColor={existingSite ? (existingSite.status === "published" ? "#059669" : "#0ea5e9") : "#333"}
          />
          <StatCard
            icon={<BarChart3 size={15} />}
            label="Usage"
            value={usage.limit == null ? "∞" : `${usage.used} / ${usage.limit}`}
            sub="AI generations"
            accentColor="#8b5cf6"
          />
          <StatCard
            icon={<Briefcase size={15} />}
            label="Saved Work"
            value={String(workCount)}
            sub="items"
            accentColor="#0ea5e9"
          />
          <StatCard
            icon={<Zap size={15} />}
            label="Plan"
            value={subscriptionPlan ? (subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)) : "Free"}
            sub="current plan"
            accentColor="#f59e0b"
          />
        </div>

        {/* TOOLS */}
        <div className="anim-3" style={{ marginBottom: 36 }}>
          <div className="section-label">Tools</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <ShortcutCard
              icon={<FileText size={16} />}
              title="Content"
              sub="AI content generator"
              iconColor="#8b5cf6"
              onClick={() => router.push("/dashboard/content")}
            />
            <ShortcutCard
              icon={<Mail size={16} />}
              title="Emails"
              sub="Campaigns & copy"
              iconColor="#0ea5e9"
              onClick={() => router.push("/dashboard/email")}
            />
            <ShortcutCard
              icon={<Megaphone size={16} />}
              title="Ads"
              sub="All platforms"
              iconColor="#ef4444"
              onClick={() => router.push("/dashboard/ads")}
            />
            <ShortcutCard
              icon={<Briefcase size={16} />}
              title="My Work"
              sub="Saved creations"
              iconColor="#059669"
              badge={workCount > 0 ? workCount : undefined}
              onClick={() => router.push("/dashboard/work")}
            />
          </div>
        </div>

        {/* WEBSITE SECTION */}
        <div className="anim-4">
          <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Sparkles size={11} style={{ color: "#f59e0b" }} />
            Your Website
          </div>

          {existingSite ? (
            <ExistingSiteCard site={existingSite} router={router} />
          ) : (
            <WebsiteBuilderCard
              businessName={businessName}
              businessDescription={businessDescription}
              username={username}
              cleanedUsername={cleanedUsername}
              usernameValid={usernameValid}
              creating={creating}
              onBusinessNameChange={setBusinessName}
              onDescriptionChange={setBusinessDescription}
              onUsernameChange={setUsername}
              onGenerate={generateWebsite}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accentColor }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accentColor: string;
}) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
          }}
        >
          {icon}
        </div>
        <span
          className="font-sans"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#444" }}
        >
          {label}
        </span>
      </div>
      <div
        className="font-display"
        style={{ fontSize: 24, color: "white", lineHeight: 1, marginBottom: 4, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div className="font-sans" style={{ fontSize: 12, color: "#444" }}>{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SHORTCUT CARD
// ─────────────────────────────────────────────

function ShortcutCard({ icon, title, sub, iconColor, onClick, badge }: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  iconColor: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button className="shortcut-card" onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${iconColor}18`,
            border: `1px solid ${iconColor}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: iconColor,
          }}
        >
          {icon}
        </div>
        {badge != null && (
          <span
            className="font-sans"
            style={{
              background: "#1e1e1e",
              color: "#888",
              padding: "2px 8px",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="font-sans" style={{ fontWeight: 600, fontSize: 14, color: "white", marginBottom: 3 }}>{title}</div>
      <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>{sub}</div>
      <ChevronRight
        size={14}
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#333" }}
      />
    </button>
  );
}

// ─────────────────────────────────────────────
// EXISTING SITE CARD
// ─────────────────────────────────────────────

function ExistingSiteCard({ site, router }: {
  site: { username: string; status: "draft" | "published" };
  router: any;
}) {
  const isLive = site.status === "published";

  return (
    <div className="main-card">
      {/* Top accent bar */}
      <div
        style={{
          height: 3,
          background: isLive
            ? "linear-gradient(90deg, #059669, #0ea5e9)"
            : "linear-gradient(90deg, #333, #555)",
        }}
      />
      <div style={{ padding: "36px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            {/* Status pill */}
            <div
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 14px",
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                marginBottom: 20,
                background: isLive ? "rgba(5,150,105,0.12)" : "rgba(30,30,30,0.8)",
                border: isLive ? "1px solid rgba(5,150,105,0.3)" : "1px solid #2a2a2a",
                color: isLive ? "#4ade80" : "#888",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: isLive ? "#4ade80" : "#555",
                  animation: isLive ? "pulse-dot 2s ease infinite" : "none",
                  display: "inline-block",
                }}
              />
              {isLive ? "Published & Live" : "Draft"}
            </div>

            <h2
              className="font-display"
              style={{
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                color: "white",
                marginBottom: 10,
                lineHeight: 1.1,
              }}
            >
              {isLive ? (
                <>Your site is <em style={{ color: "#4ade80" }}>live</em></>
              ) : (
                <>Ready to <em style={{ color: "#0ea5e9" }}>edit</em></>
              )}
            </h2>
            <p
              className="font-sans"
              style={{ fontSize: 15, color: "#555", lineHeight: 1.6, maxWidth: 440, marginBottom: 28 }}
            >
              {isLive
                ? "Customers can find you right now. Keep your site fresh — edit anytime."
                : "Your website is built. Customize it, then hit publish to go live."}
            </p>

            {/* URL display */}
            <div
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 13,
                color: "#666",
                fontFamily: "monospace",
              }}
            >
              <Globe size={13} style={{ color: "#444" }} />
              autopilotai.dev/r/
              <span style={{ color: "#ccc" }}>{site.username}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
            <button
              className="btn-primary font-sans"
              onClick={() => router.push(`/r/${site.username}?edit=1`)}
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Website
            </button>
            <a
              href={`/r/${site.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary font-sans"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Live
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// WEBSITE BUILDER CARD
// ─────────────────────────────────────────────

function WebsiteBuilderCard({
  businessName, businessDescription, username, cleanedUsername,
  usernameValid, creating, onBusinessNameChange, onDescriptionChange,
  onUsernameChange, onGenerate,
}: {
  businessName: string;
  businessDescription: string;
  username: string;
  cleanedUsername: string;
  usernameValid: boolean;
  creating: boolean;
  onBusinessNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onUsernameChange: (v: string) => void;
  onGenerate: () => void;
}) {
  const canSubmit = businessName.trim().length > 0 && businessDescription.trim().length > 0 && usernameValid;

  return (
    <div className="main-card">
      <div style={{ height: 3, background: "linear-gradient(90deg, #059669, #0ea5e9)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        {/* LEFT — form */}
        <div style={{ padding: "36px 40px", borderRight: "1px solid #1a1a1a" }}>
          <div className="font-sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>
            AI Builder
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(24px, 2.5vw, 34px)",
              fontWeight: 400,
              letterSpacing: "-0.03em",
              color: "white",
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Build your website
            <br />
            <em style={{ color: "#059669" }}>in 60 seconds</em>
          </h2>
          <p className="font-sans" style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 32 }}>
            Describe your business — AI writes the copy, designs the layout, builds everything.
          </p>

          {/* Business name */}
          <div style={{ marginBottom: 20 }}>
            <label className="label-text">
              Business name <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              className="input-field"
              value={businessName}
              onChange={(e) => onBusinessNameChange(e.target.value)}
              placeholder="e.g. Joe's Plumbing, Apex Fitness"
              maxLength={80}
            />
            <p className="font-sans" style={{ fontSize: 12, color: "#444", marginTop: 6, paddingLeft: 2 }}>
              Appears in your nav, footer, and headings.
            </p>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 20 }}>
            <label className="label-text">
              Describe your business <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <textarea
                className="textarea-field"
                rows={5}
                value={businessDescription}
                onChange={(e) => onDescriptionChange(e.target.value)}
                maxLength={500}
                placeholder="e.g. We're a fitness studio offering personal training and nutrition coaching for busy professionals looking to lose weight..."
              />
              <div
                className="font-sans"
                style={{ position: "absolute", bottom: 12, right: 14, fontSize: 11, color: "#333" }}
              >
                {businessDescription.length}/500
              </div>
            </div>
            <p className="font-sans" style={{ fontSize: 12, color: "#444", marginTop: 6, paddingLeft: 2 }}>
              The AI uses this to write your copy — be specific.
            </p>
          </div>

          {/* URL slug */}
          <div style={{ marginBottom: 28 }}>
            <label className="label-text">
              Website address <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                className={`input-field input-field-mono ${username.length > 0 && !usernameValid ? "input-field-error" : ""}`}
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="my-business-name"
                maxLength={30}
                style={{ paddingRight: 140 }}
              />
              <div
                className="font-sans"
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  color: "#444",
                  pointerEvents: "none",
                  fontFamily: "monospace",
                }}
              >
                .autopilotai.dev
              </div>
            </div>
            {username.length > 0 && (
              <div
                className="url-preview font-sans"
                style={{ color: usernameValid ? "#059669" : "#ef4444" }}
              >
                {usernameValid ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
                {usernameValid
                  ? `autopilotai.dev/r/${cleanedUsername}`
                  : "3–30 characters, letters, numbers & hyphens only"}
              </div>
            )}
          </div>

          <button className="btn-generate" onClick={onGenerate} disabled={creating || !canSubmit}>
            {creating ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Building your website...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Generate Website
              </>
            )}
          </button>
        </div>

        {/* RIGHT — what you get */}
        <div style={{ padding: "36px 40px", background: "#0d0d0d" }}>
          <div className="font-sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: 12 }}>
            What you get
          </div>
          <h3
            className="font-display"
            style={{ fontSize: 24, fontWeight: 400, color: "white", marginBottom: 8, letterSpacing: "-0.02em" }}
          >
            A complete website,
            <br />
            <em style={{ color: "#0ea5e9" }}>ready to publish</em>
          </h3>
          <p className="font-sans" style={{ fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: 32 }}>
            Not a template. AI writes your copy, designs for your industry, and structures every page for conversions.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "⚡", title: "Built in ~60 seconds", sub: "Industry-specific copy and layout" },
              { icon: "✏️", title: "Click-to-edit anything", sub: "Change text, images, colors — no code" },
              { icon: "📱", title: "Mobile responsive", sub: "Looks perfect on every device" },
              { icon: "📊", title: "Conversion optimized", sub: "CTAs, forms, and trust signals built in" },
              { icon: "🌐", title: "Custom domain ready", sub: "Publish to yourcompany.com" },
            ].map((f, i) => (
              <div key={i} className="feature-pill">
                <div style={{ fontSize: 18, width: 32, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 2 }}>{f.title}</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555" }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="font-sans"
            style={{
              marginTop: 28,
              padding: "16px 18px",
              background: "rgba(5,150,105,0.06)",
              border: "1px solid rgba(5,150,105,0.15)",
              borderRadius: 12,
              fontSize: 13,
              color: "#4ade80",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ fontWeight: 700 }}>Free to build.</strong>
            {" "}Edit as much as you want before paying. Upgrade for $10/mo when you're ready to publish.
          </div>
        </div>
      </div>
    </div>
  );
}