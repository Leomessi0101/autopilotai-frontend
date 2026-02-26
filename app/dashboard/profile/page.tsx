"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardNavbar from "@/components/DashboardNavbar";
import {
  User, Building2, Globe, Briefcase, Mic2, Users,
  Mail, PenLine, Sparkles, CheckCircle, AlertCircle,
  ChevronRight, CreditCard,
} from "lucide-react";

interface ProfileForm {
  full_name: string; company_name: string; company_website: string; title: string;
  brand_tone: string; industry: string; brand_description: string; target_audience: string;
  signature: string; writing_style: string;
  use_emojis: boolean; use_hashtags: boolean;
  length_pref: string; creativity_level: number; cta_style: string;
}

const DEFAULT_FORM: ProfileForm = {
  full_name: "", company_name: "", company_website: "", title: "",
  brand_tone: "", industry: "", brand_description: "", target_audience: "",
  signature: "", writing_style: "",
  use_emojis: true, use_hashtags: true,
  length_pref: "medium", creativity_level: 5, cta_style: "balanced",
};

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName]                         = useState("U");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [loading, setLoading]                   = useState(true);
  const [saving, setSaving]                     = useState(false);
  const [toast, setToast]                       = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [form, setForm]                         = useState<ProfileForm>(DEFAULT_FORM);

  const token = typeof window !== "undefined" ? localStorage.getItem("autopilot_token") : null;

  useEffect(() => {
    if (!token) { router.push("/login"); return; }
    api.get("/api/auth/me")
      .then((res) => {
        if (res.data?.name) setName(res.data.name.charAt(0).toUpperCase());
        if (res.data?.subscription) setSubscriptionPlan(res.data.subscription);
      })
      .catch(() => { localStorage.removeItem("autopilot_token"); router.push("/login"); });
    api.get("/api/profile/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setForm((p) => ({ ...p, ...res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router, token]);

  const set = (field: keyof ProfileForm, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const showToast = (type: "ok" | "err", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 2800);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.post("/api/profile/update", form, { headers: { Authorization: `Bearer ${token}` } });
      showToast("ok", "Profile saved successfully");
    } catch {
      showToast("err", "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 36, height: 36, border: "2px solid #222", borderTop: "2px solid #059669", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#555" }}>Loading profile…</p>
      </div>
    </div>
  );

  const creativity = form.creativity_level;
  const creativityLabel = creativity <= 3 ? "Logical & structured" : creativity <= 7 ? "Balanced creativity" : "Creative & bold";

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

        .card { background: #111; border: 1px solid #1e1e1e; border-radius: 20px; overflow: hidden; }

        /* Responsive layout: single column on mobile, two on desktop */
        .profile-grid {
          display: flex; flex-direction: column; gap: 16;
        }
        @media (min-width: 860px) {
          .profile-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 20px;
            align-items: start;
          }
          .profile-sidebar {
            position: sticky;
            top: 80px;
          }
        }

        /* Form grid: 1 col on mobile, 2 on larger */
        .form-grid-2 { display: flex; flex-direction: column; gap: 16; }
        @media (min-width: 560px) {
          .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16; }
        }

        /* Toggle grid: 1 col on mobile, 2 on larger */
        .toggle-grid { display: flex; flex-direction: column; gap: 10; }
        @media (min-width: 560px) {
          .toggle-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12; }
        }

        .field {
          width: 100%; background: #0a0a0a; border: 1px solid #2a2a2a;
          border-radius: 12px; padding: 12px 15px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #e5e5e5;
          outline: none; transition: border-color .2s, box-shadow .2s;
          -webkit-appearance: none;
        }
        .field::placeholder { color: #444; }
        .field:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,.1); }
        textarea.field { resize: none; line-height: 1.65; }
        select.field { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23555' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 38px; }
        select.field option { background: #1a1a1a; color: white; }

        .label { display: flex; align-items: center; gap: 5; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #555; margin-bottom: 8px; }
        .section-label { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #444; }

        .toggle-track { width: 44px; height: 24px; background: #2a2a2a; border-radius: 100px; position: relative; cursor: pointer; transition: background .25s; flex-shrink: 0; -webkit-tap-highlight-color: transparent; }
        .toggle-track.on { background: #059669; }
        .toggle-thumb { position: absolute; width: 18px; height: 18px; border-radius: 50%; background: white; top: 3px; left: 3px; transition: transform .25s; box-shadow: 0 1px 4px rgba(0,0,0,.4); }
        .toggle-track.on .toggle-thumb { transform: translateX(20px); }

        .range-slider { width: 100%; accent-color: #059669; height: 4px; cursor: pointer; background: #2a2a2a; border-radius: 2px; outline: none; -webkit-appearance: none; appearance: none; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #059669; cursor: pointer; box-shadow: 0 0 0 3px rgba(5,150,105,.2); }

        .btn-save { padding: 14px 28px; border-radius: 12px; border: none; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #059669, #0ea5e9); color: white; transition: filter .2s, box-shadow .2s; -webkit-tap-highlight-color: transparent; }
        .btn-save:hover:not(:disabled) { filter: brightness(1.08); box-shadow: 0 10px 32px rgba(5,150,105,.3); }
        .btn-save:disabled { opacity: .5; cursor: not-allowed; }

        .btn-ghost { background: transparent; border: 1px solid #2a2a2a; border-radius: 10px; padding: 10px 16px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: border-color .18s, color .18s, background .18s; -webkit-tap-highlight-color: transparent; }
        .btn-ghost:hover { border-color: #444; color: #ccc; background: #141414; }

        .section-pad { padding: 22px 20px; }
        @media (min-width: 560px) { .section-pad { padding: 26px 28px; } }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
      `}</style>

      <DashboardNavbar name={name} subscriptionPlan={subscriptionPlan} />

      {/* TOAST */}
      {toast && (
        <div className="font-sans" style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 200, padding: "11px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 32px rgba(0,0,0,.5)", background: toast.type === "ok" ? "#052e16" : "#1c0a0a", border: `1px solid ${toast.type === "ok" ? "#166534" : "#7f1d1d"}`, color: toast.type === "ok" ? "#4ade80" : "#f87171", whiteSpace: "nowrap", maxWidth: "calc(100vw - 32px)" }}>
          {toast.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px 80px" }}>

        {/* HEADER */}
        <div className="a1" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="section-label" style={{ marginBottom: 8 }}>Settings</div>
              <h1 className="font-display" style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Profile & <em style={{ color: "#059669" }}>Preferences</em>
              </h1>
              <p className="font-sans" style={{ fontSize: 14, color: "#555", marginTop: 8, lineHeight: 1.6 }}>
                Personalise AutopilotAI to match your brand voice.
              </p>
            </div>
            <button className="btn-ghost" onClick={() => router.push("/billing")}>
              <CreditCard size={13} /> Billing <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* RESPONSIVE GRID */}
        <div className="a2 profile-grid">

          {/* ════ LEFT: FORM ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Personal info */}
            <div className="card">
              <div style={{ height: 3, background: "#0ea5e9" }} />
              <div className="section-pad">
                <SectionHeader icon={<User size={14} />} title="Personal Information" color="#0ea5e9" />
                <div className="form-grid-2">
                  <FieldGroup label="Full Name" icon={<User size={12} />}>
                    <input className="field" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="John Smith" />
                  </FieldGroup>
                  <FieldGroup label="Your Title" icon={<Briefcase size={12} />}>
                    <input className="field" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Founder, Marketing Director" />
                  </FieldGroup>
                  <FieldGroup label="Company Name" icon={<Building2 size={12} />}>
                    <input className="field" value={form.company_name} onChange={(e) => set("company_name", e.target.value)} placeholder="Acme Inc." />
                  </FieldGroup>
                  <FieldGroup label="Company Website" icon={<Globe size={12} />}>
                    <input className="field" value={form.company_website} onChange={(e) => set("company_website", e.target.value)} placeholder="https://" inputMode="url" />
                  </FieldGroup>
                </div>
              </div>
            </div>

            {/* Brand voice */}
            <div className="card">
              <div style={{ height: 3, background: "#8b5cf6" }} />
              <div className="section-pad">
                <SectionHeader icon={<Mic2 size={14} />} title="Brand Voice & Positioning" color="#8b5cf6" />
                <div className="form-grid-2" style={{ marginBottom: 14 }}>
                  <FieldGroup label="Industry" icon={<Building2 size={12} />}>
                    <input className="field" value={form.industry} onChange={(e) => set("industry", e.target.value)} placeholder="e.g. Fitness, SaaS, E-commerce" />
                  </FieldGroup>
                  <FieldGroup label="Brand Tone" icon={<Mic2 size={12} />}>
                    <input className="field" value={form.brand_tone} onChange={(e) => set("brand_tone", e.target.value)} placeholder="e.g. Confident, Approachable" />
                  </FieldGroup>
                </div>
                <FieldGroup label="Brand Description">
                  <textarea className="field" rows={4} value={form.brand_description} onChange={(e) => set("brand_description", e.target.value)} placeholder="Describe your business, mission, values, and how you want to be perceived." />
                </FieldGroup>
                <div style={{ marginTop: 14 }}>
                  <FieldGroup label="Target Audience" icon={<Users size={12} />}>
                    <input className="field" value={form.target_audience} onChange={(e) => set("target_audience", e.target.value)} placeholder="e.g. Entrepreneurs aged 25–45, gym owners" />
                  </FieldGroup>
                </div>
              </div>
            </div>

            {/* Email prefs */}
            <div className="card">
              <div style={{ height: 3, background: "#059669" }} />
              <div className="section-pad">
                <SectionHeader icon={<Mail size={14} />} title="Email Preferences" color="#059669" />
                <FieldGroup label="Default Email Signature">
                  <textarea className="field" rows={4} value={form.signature} onChange={(e) => set("signature", e.target.value)} placeholder={"Best regards,\nYour Name\nYour Title\nCompany"} />
                </FieldGroup>
                <div style={{ marginTop: 14 }}>
                  <FieldGroup label="Preferred Writing Style" icon={<PenLine size={12} />}>
                    <input className="field" value={form.writing_style} onChange={(e) => set("writing_style", e.target.value)} placeholder="e.g. Concise and direct, warm and conversational" />
                  </FieldGroup>
                </div>
              </div>
            </div>

            {/* AI behaviour */}
            <div className="card">
              <div style={{ height: 3, background: "#f59e0b" }} />
              <div className="section-pad">
                <SectionHeader icon={<Sparkles size={14} />} title="AI Behaviour" color="#f59e0b" />
                <div className="toggle-grid" style={{ marginBottom: 18 }}>
                  <ToggleRow label="Use Emojis" sub="Add emojis to generated content" value={form.use_emojis} onChange={(v) => set("use_emojis", v)} />
                  <ToggleRow label="Use Hashtags" sub="Include hashtags in social posts" value={form.use_hashtags} onChange={(v) => set("use_hashtags", v)} />
                </div>
                <div className="form-grid-2" style={{ marginBottom: 20 }}>
                  <FieldGroup label="Preferred Length">
                    <select className="field" value={form.length_pref} onChange={(e) => set("length_pref", e.target.value)}>
                      <option value="short">Short & punchy</option>
                      <option value="medium">Balanced</option>
                      <option value="long">Long form</option>
                    </select>
                  </FieldGroup>
                  <FieldGroup label="CTA Style">
                    <select className="field" value={form.cta_style} onChange={(e) => set("cta_style", e.target.value)}>
                      <option value="soft">Soft & friendly</option>
                      <option value="balanced">Balanced persuasive</option>
                      <option value="aggressive">Strong direct CTA</option>
                    </select>
                  </FieldGroup>
                </div>
                <FieldGroup label={`Creativity Level — ${creativityLabel}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                    <span className="font-sans" style={{ fontSize: 11, color: "#555", flexShrink: 0 }}>Logical</span>
                    <input type="range" min={1} max={10} value={form.creativity_level} onChange={(e) => set("creativity_level", Number(e.target.value))} className="range-slider" style={{ flex: 1 }} />
                    <span className="font-sans" style={{ fontSize: 11, color: "#555", flexShrink: 0 }}>Bold</span>
                    <span className="font-sans" style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: "rgba(5,150,105,.12)", border: "1px solid rgba(5,150,105,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#059669" }}>
                      {form.creativity_level}
                    </span>
                  </div>
                </FieldGroup>
              </div>
            </div>

            {/* Save button — full width on mobile */}
            <button className="btn-save" onClick={saveProfile} disabled={saving} style={{ width: "100%", justifyContent: "center" }}>
              {saving
                ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid white", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Saving…</>
                : <><CheckCircle size={14} /> Save Profile</>
              }
            </button>
          </div>

          {/* ════ RIGHT: SIDEBAR ════ */}
          <div className="profile-sidebar" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Profile completeness */}
            <ProfileScore form={form} />

            {/* Billing shortcut */}
            <div className="card" style={{ padding: "20px 20px" }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Subscription</div>
              <div className="font-display" style={{ fontSize: 22, color: "white", marginBottom: 6, letterSpacing: "-0.02em", textTransform: "capitalize" }}>
                {subscriptionPlan ?? "Free"}
              </div>
              <p className="font-sans" style={{ fontSize: 13, color: "#555", lineHeight: 1.55, marginBottom: 14 }}>
                Manage your plan, payment, and usage.
              </p>
              <button onClick={() => router.push("/billing")} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "white", color: "#111", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <CreditCard size={13} /> Open Billing
              </button>
            </div>

            {/* Tip */}
            <div className="card" style={{ padding: "18px 20px", background: "rgba(5,150,105,.04)", borderColor: "rgba(5,150,105,.15)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <Sparkles size={14} style={{ color: "#059669", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 4 }}>Better outputs</div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.65 }}>
                    A complete brand description and target audience dramatically improves AI output quality across all tools.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function SectionHeader({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 20 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
        {icon}
      </div>
      <span className="font-sans" style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{title}</span>
    </div>
  );
}

function FieldGroup({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">
        {icon && <span style={{ color: "#444" }}>{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function ToggleRow({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div>
        <div className="font-sans" style={{ fontSize: 13, fontWeight: 600, color: value ? "white" : "#888", marginBottom: 2 }}>{label}</div>
        <div className="font-sans" style={{ fontSize: 11, color: "#444" }}>{sub}</div>
      </div>
      <div className={`toggle-track ${value ? "on" : ""}`} onClick={() => onChange(!value)}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

function ProfileScore({ form }: { form: ProfileForm }) {
  const fields: (keyof ProfileForm)[] = ["full_name", "company_name", "company_website", "title", "brand_tone", "industry", "brand_description", "target_audience", "writing_style"];
  const filled = fields.filter((f) => String(form[f] ?? "").trim().length > 0).length;
  const pct    = Math.round((filled / fields.length) * 100);
  const color  = pct < 40 ? "#ef4444" : pct < 75 ? "#f59e0b" : "#059669";

  return (
    <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 18, padding: "18px 20px" }}>
      <div className="section-label" style={{ marginBottom: 14 }}>Profile completeness</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div className="font-display" style={{ fontSize: 30, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{pct}%</div>
        <div className="font-sans" style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}>
          {pct < 40 ? "Add your brand details for better AI output." : pct < 75 ? "Good start — fill in the gaps." : "Great profile! AI will generate better content."}
        </div>
      </div>
      <div style={{ height: 5, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width .5s ease" }} />
      </div>
      <div className="font-sans" style={{ fontSize: 11, color: "#444", marginTop: 8 }}>{filled} of {fields.length} fields filled</div>
    </div>
  );
}