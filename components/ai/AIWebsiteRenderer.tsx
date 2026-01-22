"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AIStructure } from "./aiStructure";

/* ======================================================
   PROPS
====================================================== */

type Props = {
  username: string;
  structure: AIStructure;
  content: any;
  editMode: boolean;
};

/* ======================================================
   UTILS
====================================================== */

function cx(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}

function hasValue(v: any) {
  return typeof v === "string" ? v.trim().length > 0 : v !== null && v !== undefined;
}

function safeStr(v: any, fallback: string) {
  const s = typeof v === "string" ? v : "";
  return s.trim() ? s : fallback;
}

function safeArr<T = any>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

function deepClone<T>(x: T): T {
  try {
    return JSON.parse(JSON.stringify(x));
  } catch {
    return x;
  }
}

function getApiBase() {
  return (
    (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

type Toast = { type: "ok" | "err" | "info"; msg: string };
function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const t = useCallback((next: Toast, ms = 2600) => {
    setToast(next);
    window.setTimeout(() => setToast(null), ms);
  }, []);
  return { toast, t };
}

type Tone = "warm" | "premium" | "bold" | "minimal";

/* ======================================================
   CONTENT NORMALIZERS (supports your mixed schemas)
====================================================== */

function normalizeServices(content: any): Array<{ title: string; description: string; image?: string | null }> {
  // supports:
  // A) content.services = [{title, description, image?}]
  // B) content.services = { title: "", items: [{title, description, image?}] }
  const a = safeArr(content?.services);
  if (a.length && typeof a[0] === "object") {
    return a.map((x: any) => ({
      title: safeStr(x?.title, "Service"),
      description: safeStr(x?.description, "Short description of this service."),
      image: typeof x?.image === "string" ? x.image : null,
    }));
  }

  const b = safeArr(content?.services?.items);
  if (b.length && typeof b[0] === "object") {
    return b.map((x: any) => ({
      title: safeStr(x?.title, "Service"),
      description: safeStr(x?.description, "Short description of this service."),
      image: typeof x?.image === "string" ? x.image : null,
    }));
  }

  // fallback from intent/services as strings (rare)
  const c = safeArr(content?.intent?.services);
  if (c.length) {
    return c.slice(0, 6).map((s: any) => ({
      title: safeStr(s, "Service"),
      description: "Delivered with care and expertise.",
      image: null,
    }));
  }

  return [];
}

function writeServicesBack(originalContent: any, normalized: Array<{ title: string; description: string; image?: string | null }>) {
  // Prefer keeping whichever schema already exists.
  const hasArray = Array.isArray(originalContent?.services);
  const hasObjItems = Array.isArray(originalContent?.services?.items);

  if (hasObjItems) {
    return {
      ...originalContent,
      services: {
        ...(originalContent.services || {}),
        title: safeStr(originalContent?.services?.title, "Services"),
        items: normalized.map((x) => ({ title: x.title, description: x.description, image: x.image || null })),
      },
    };
  }

  if (hasArray) {
    return {
      ...originalContent,
      services: normalized.map((x) => ({ title: x.title, description: x.description, image: x.image || null })),
    };
  }

  // default to object schema (newer)
  return {
    ...originalContent,
    services: {
      title: "Services",
      items: normalized.map((x) => ({ title: x.title, description: x.description, image: x.image || null })),
    },
  };
}

function getMissingContactFields(content: any) {
  const missing: string[] = [];
  const c = content?.contact || {};
  const loc = content?.location || {};
  if (!safeStr(c?.phone, "")) missing.push("phone number");
  if (!safeStr(c?.email, "")) missing.push("email address");
  if (!safeStr(c?.address, "") && !safeStr(loc?.city, "")) missing.push("address or city");
  return missing;
}

function ensureBuilderMeta(content: any) {
  const next = { ...(content || {}) };
  if (!next._builder || typeof next._builder !== "object") next._builder = {};
  if (!next._builder.sections || !Array.isArray(next._builder.sections)) next._builder.sections = null;
  if (!next._builder.tone) next._builder.tone = "warm";
  if (!next._builder.hidden || !Array.isArray(next._builder.hidden)) next._builder.hidden = [];
  return next;
}

/* ======================================================
   AUTOSAVE
====================================================== */

function useAutosave(username: string, enabled: boolean) {
  return useCallback(
    async (updated: any) => {
      if (!enabled) return;
      try {
        await fetch(`${getApiBase()}/api/restaurants/${username}/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("autopilot_token")}`,
          },
          body: JSON.stringify(updated),
        });
      } catch {
        // silent by design
      }
    },
    [username, enabled]
  );
}

/* ======================================================
   EDITABLE CONTROLS
====================================================== */

function EditableText({
  value,
  onSave,
  className,
  editMode,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  editMode: boolean;
  placeholder?: string;
}) {
  const display = value?.trim() ? value : (placeholder || "");
  return (
    <div
      contentEditable={editMode}
      suppressContentEditableWarning
      onBlur={(e) => onSave(e.currentTarget.innerText)}
      className={cx(
        editMode &&
          "outline outline-1 outline-dashed outline-indigo-400/40 rounded-lg px-2 py-1",
        !display && editMode && "opacity-60",
        className
      )}
    >
      {display}
    </div>
  );
}

function EditablePara({
  value,
  onSave,
  className,
  editMode,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  editMode: boolean;
  placeholder?: string;
}) {
  const display = value?.trim() ? value : (placeholder || "");
  return (
    <div
      contentEditable={editMode}
      suppressContentEditableWarning
      onBlur={(e) => onSave(e.currentTarget.innerText)}
      className={cx(
        editMode &&
          "outline outline-1 outline-dashed outline-indigo-400/40 rounded-lg px-2 py-2",
        !display && editMode && "opacity-60",
        className
      )}
    >
      {display}
    </div>
  );
}

/* ======================================================
   IMAGE UPLOAD (Drag-drop + R2 endpoint)
====================================================== */

function ImageSlot({
  username,
  value,
  onChange,
  editMode,
  label,
  className,
  heightClass = "h-56",
}: {
  username: string;
  value: string | null;
  onChange: (url: string | null) => void;
  editMode: boolean;
  label: string;
  className?: string;
  heightClass?: string;
}) {
  const { t } = useToast(); // local instance is fine; slot used inside page too
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    if (!editMode) return;
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      alert("You must be logged in to upload images.");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch(`${getApiBase()}/api/restaurants/${username}/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.detail || "Upload failed");
      }

      const data = await res.json();
      if (!data?.url) throw new Error("No URL returned");
      onChange(String(data.url));
    } catch (e: any) {
      alert(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={cx(
        "relative rounded-2xl overflow-hidden border",
        dragOver ? "border-indigo-500/60 ring-2 ring-indigo-500/20" : "border-black/10",
        "bg-black/5",
        className
      )}
      onDragOver={(e) => {
        if (!editMode) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!editMode) return;
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) uploadFile(f);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
        }}
      />

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt={label} className={cx("w-full object-cover", heightClass)} />
      ) : (
        <div className={cx("w-full flex items-center justify-center", heightClass)}>
          <div className="text-center px-6">
            <div className="text-sm font-semibold text-black/80">{label}</div>
            {editMode ? (
              <div className="mt-1 text-xs text-black/60">
                Drag & drop an image here, or click “Upload”.
              </div>
            ) : (
              <div className="mt-1 text-xs text-black/50">No image</div>
            )}
          </div>
        </div>
      )}

      {editMode && (
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={cx(
              "px-3 py-1.5 text-xs rounded-lg shadow border border-black/10 bg-white",
              uploading && "opacity-60 cursor-not-allowed"
            )}
          >
            {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={() => {
              const url = window.prompt("Paste image URL");
              if (url && url.trim()) onChange(url.trim());
            }}
            className={cx(
              "px-3 py-1.5 text-xs rounded-lg shadow border border-black/10 bg-white",
              uploading && "opacity-60 cursor-not-allowed"
            )}
          >
            Paste URL
          </button>

          {value && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => onChange(null)}
              className={cx(
                "px-3 py-1.5 text-xs rounded-lg shadow border border-black/10 bg-white",
                uploading && "opacity-60 cursor-not-allowed"
              )}
            >
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ======================================================
   THEME (Palette + Accent + Tone)
====================================================== */

function useTheme(
  structure: AIStructure,
  tone: Tone,
  editorView: "auto" | "light" | "dark"
) {
const paletteFromStructure =
  structure?.theme?.palette === "dark" ? "dark" : "light";

const palette =
  editorView === "dark"
    ? "dark"
    : editorView === "light"
    ? "light"
    : paletteFromStructure;

const accent = structure?.theme?.accent || "indigo";

  const accentMap: Record<string, { solid: string; soft: string; ring: string }> = {
    indigo: { solid: "bg-indigo-600 hover:bg-indigo-500", soft: "bg-indigo-500/10", ring: "ring-indigo-500/20" },
    emerald: { solid: "bg-emerald-600 hover:bg-emerald-500", soft: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
    orange: { solid: "bg-orange-orange-500 hover:bg-orange-400", soft: "bg-orange-500/10", ring: "ring-orange-500/20" },
    neutral: { solid: "bg-black hover:bg-black/90", soft: "bg-black/5", ring: "ring-black/10" },
  };
  const a = accentMap[accent] || accentMap.indigo;

  const base =
    palette === "dark"
      ? {
          page: "bg-[#05070d] text-white",
          surface: "bg-white/5 border-white/10",
          surface2: "bg-black/30 border-white/10",
          subtle: "text-white/70",
          heading: "text-white",
          outline: "border-white/10",
          chip: "bg-white/10 text-white border-white/10",
        }
      : {
          page: "bg-white text-black",
          surface: "bg-white border-black/10",
          surface2: "bg-black/5 border-black/10",
          subtle: "text-black/60",
          heading: "text-black",
          outline: "border-black/10",
          chip: "bg-white text-black border-black/10",
        };

  // Tone overlays (page-only background glow)
  const toneBg =
    tone === "warm"
      ? palette === "dark"
        ? "bg-[radial-gradient(circle_at_20%_0%,rgba(255,140,0,.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,.16),transparent_40%)]"
        : "bg-[radial-gradient(circle_at_20%_0%,rgba(255,140,0,.14),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,.10),transparent_40%)]"
      : tone === "premium"
      ? palette === "dark"
        ? "bg-[radial-gradient(circle_at_10%_0%,rgba(255,255,255,.10),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(99,102,241,.14),transparent_40%)]"
        : "bg-[radial-gradient(circle_at_10%_0%,rgba(0,0,0,.06),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(99,102,241,.10),transparent_40%)]"
      : tone === "bold"
      ? palette === "dark"
        ? "bg-[radial-gradient(circle_at_25%_0%,rgba(16,185,129,.18),transparent_45%),radial-gradient(circle_at_75%_10%,rgba(249,115,22,.16),transparent_40%)]"
        : "bg-[radial-gradient(circle_at_25%_0%,rgba(16,185,129,.12),transparent_45%),radial-gradient(circle_at_75%_10%,rgba(249,115,22,.10),transparent_40%)]"
      : ""; // minimal

  /**
   * Editor UI Fix
   * Many controls still use hardcoded Tailwind like bg-white / border-black/10.
   * This wrapper class makes those controls look correct in dark mode WITHOUT rewriting 1966 lines.
   */
  const editorUiFix =
    palette === "dark"
      ? [
          // Buttons / chips / small panels
          "[&_button]:text-white",
          "[&_button]:border-white/10",
          "[&_button]:bg-white/5",
          "[&_button:hover]:bg-white/10",
          // Inputs
          "[&_input]:bg-white/5",
          "[&_input]:text-white",
          "[&_input]:border-white/10",
          // Links
          "[&_a]:text-white",
          // Common text utility classes you used
          "[&_.text-black\\/50]:text-white/60",
          "[&_.text-black\\/60]:text-white/70",
          "[&_.text-black\\/80]:text-white/80",
        ].join(" ")
      : [
          // In light mode, ensure things stay clean & consistent
          "[&_button]:border-black/10",
          "[&_button:hover]:bg-black/5",
        ].join(" ");

  return {
    ...base,
    accentSolid: a.solid,
    accentSoft: a.soft,
    accentRing: a.ring,
    toneBg,
    editorUiFix,
    palette, // expose for UI if needed
  };
}


/* ======================================================
   SECTION REGISTRY
====================================================== */

type SectionKey =
  | "highlight"
  | "about"
  | "services"
  | "trust"
  | "process"
  | "testimonial"
  | "faq"
  | "gallery"
  | "cta"
  | "contact";

const SECTION_LABELS: Record<SectionKey, string> = {
  highlight: "Highlight",
  about: "About",
  services: "Services",
  trust: "Trust",
  process: "Process",
  testimonial: "Testimonial",
  faq: "FAQ",
  gallery: "Gallery",
  cta: "Call to action",
  contact: "Contact",
};

function defaultSectionsFromStructure(structure: any): SectionKey[] {
  const base = safeArr<string>(structure?.sections)
    .map((s) => String(s).toLowerCase())
    .filter((s) =>
      [
        "highlight",
        "about",
        "services",
        "trust",
        "process",
        "testimonial",
        "faq",
        "gallery",
        "cta",
        "contact",
      ].includes(s)
    ) as SectionKey[];

  // 🔒 Safety: hero is always rendered separately
  // 🔒 Safety: contact must exist (business requirement)
  if (!base.includes("contact")) {
    base.push("contact");
  }

  return base;
}



function buildDefaultContentIfMissing(content: any, username: string) {
  const next = ensureBuilderMeta(content && Object.keys(content).length ? content : {});

  // ---- BUSINESS NAME ----
  const businessName =
    safeStr(next.business_name, "") ||
    username
      .replace(/-/g, " ")
      .replace(/\b\w/g, (m) => m.toUpperCase());

  next.business_name = businessName;

  // ---- HERO ----
  if (!next.hero || typeof next.hero !== "object") next.hero = {};
  next.hero.headline = safeStr(next.hero.headline, businessName);
  next.hero.subheadline = safeStr(
    next.hero.subheadline,
    "A modern website that turns visitors into customers."
  );
  next.hero.cta_text = safeStr(next.hero.cta_text, "Get started");
  if (!("image" in next.hero)) next.hero.image = null;

  // ---- HIGHLIGHT ----
  if (!next.highlight || typeof next.highlight !== "object") next.highlight = {};
  next.highlight.headline = safeStr(
    next.highlight.headline,
    "Make a strong first impression."
  );
  next.highlight.subheadline = safeStr(
    next.highlight.subheadline,
    "Warm, trustworthy design — plus real copy your customers understand."
  );

  // ---- ABOUT ----
  if (!next.about || typeof next.about !== "object") next.about = {};
  if (!Array.isArray(next.about.paragraphs)) {
    next.about.paragraphs = [
      `At ${businessName}, we focus on clarity, quality, and a great customer experience.`,
      "If you want a simple website that looks premium and drives action, you’re in the right place.",
    ];
  }
  if (!("image" in next.about)) next.about.image = null;

  // ---- SERVICES ----
  const sv = normalizeServices(next);
  if (!sv.length) {
    Object.assign(
      next,
      writeServicesBack(next, [
        { title: "Quality service", description: "Reliable work with attention to detail.", image: null },
        { title: "Fast response", description: "Quick turnaround and clear communication.", image: null },
        { title: "Great experience", description: "Smooth process from start to finish.", image: null },
      ])
    );
  }

  // ---- TRUST ----
  if (!next.trust || typeof next.trust !== "object") next.trust = {};
  if (!Array.isArray(next.trust.items)) {
    next.trust.items = ["Clear pricing", "Fast response", "Trusted quality"];
  }

  // ---- PROCESS ----
  if (!next.process || typeof next.process !== "object") next.process = {};
  if (!Array.isArray(next.process.steps)) {
    next.process.steps = [
      { title: "Reach out", description: "Send a message with what you need." },
      { title: "Get a plan", description: "We reply with a simple next step." },
      { title: "Get results", description: "We deliver quickly — and you can edit anytime." },
    ];
  }

  // ---- TESTIMONIAL ----
  if (!next.testimonial || typeof next.testimonial !== "object") next.testimonial = {};
  next.testimonial.quote = safeStr(next.testimonial.quote, "“Professional, fast, and easy to work with.”");
  next.testimonial.author = safeStr(next.testimonial.author, "Happy customer");

  // ---- FAQ ----
  if (!next.faq || typeof next.faq !== "object") next.faq = {};
  if (!Array.isArray(next.faq.items)) {
    next.faq.items = [
      { q: "How fast can I get started?", a: "Usually the same day. Send a message and we’ll take it from there." },
      { q: "Can I change anything later?", a: "Yes — you can edit everything and it autosaves." },
      { q: "Do I need images?", a: "No. But adding real photos increases trust and conversions." },
    ];
  }

  // ---- GALLERY ----
  if (!next.gallery || typeof next.gallery !== "object") next.gallery = {};
  if (!Array.isArray(next.gallery.images)) next.gallery.images = [];

  // ---- CTA ----
  if (!next.cta || typeof next.cta !== "object") next.cta = {};
  next.cta.headline = safeStr(next.cta.headline, "Ready to take the next step?");
  next.cta.subheadline = safeStr(next.cta.subheadline, "Send a message — we respond quickly.");
  next.cta.button = safeStr(next.cta.button, next.hero.cta_text);

  // ---- CONTACT ----
  if (!next.contact || typeof next.contact !== "object") next.contact = {};
  next.contact.phone = safeStr(next.contact.phone, "");
  next.contact.email = safeStr(next.contact.email, "");
  next.contact.address = safeStr(next.contact.address, "");

  if (!next.location || typeof next.location !== "object") next.location = {};
  next.location.city = safeStr(next.location.city, "");

  // ---- AI TODOS ----
  if (!Array.isArray(next.ai_todos)) {
    next.ai_todos = [
      "Add your phone number and email in Contact.",
      "Add your address or city so customers know where you are.",
      "Upload a real hero image for higher trust and conversions.",
    ];
  }

  return next;
}

/* ======================================================
   LAYOUT SHELL
====================================================== */

function SectionShell({
  title,
  subtitle,
  children,
  theme,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  theme: any;
}) {
  return (
    <section className={cx("py-16 md:py-20", theme.page)}>
      <div className="max-w-6xl mx-auto px-6">
        {title ? (
          <div className="text-center">
            <h2 className={cx("text-3xl md:text-4xl font-semibold", theme.heading)}>
              {title}
            </h2>
            {subtitle ? (
              <p className={cx("mt-3 text-base md:text-lg", theme.subtle)}>
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className={cx(title ? "mt-10" : "")}>{children}</div>
      </div>
    </section>
  );
}




/* ======================================================
   HERO
====================================================== */

function Hero({
  username,
  structure,
  content,
  onUpdate,
  editMode,
  theme,
}: {
  username: string;
  structure: AIStructure;
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const variant = structure?.hero?.variant || "centered_text";
  const headline = safeStr(content?.hero?.headline, content?.business_name || "Your Business");
  const subheadline = safeStr(content?.hero?.subheadline, "Short description of what you do.");
  const ctaText = safeStr(content?.hero?.cta_text, safeStr(content?.cta?.button, "Get started"));
  const heroImage = typeof content?.hero?.image === "string" ? content.hero.image : null;

  const sharedInner = (
    <div className="relative z-10 max-w-6xl mx-auto px-6">
      <div className={cx("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs", theme.outline, theme.chip)}>
        <span className={cx("h-2 w-2 rounded-full", theme.accentSoft)} />
        <span className={cx("opacity-80", theme.subtle)}>
          {safeStr(content?.location?.city, "") ? `Serving ${content.location.city}` : "Built with AutopilotAI"}
        </span>
      </div>

      <div className="mt-6">
        <EditableText
          value={headline}
          placeholder="Business name"
          editMode={editMode}
          className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
          onSave={(v) => onUpdate({ ...content, hero: { ...(content.hero || {}), headline: v }, business_name: safeStr(content?.business_name, "") || v })}
        />
        <EditablePara
          value={subheadline}
          placeholder="Short description of what you do"
          editMode={editMode}
          className={cx("mt-5 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed", theme.subtle)}
          onSave={(v) => onUpdate({ ...content, hero: { ...(content.hero || {}), subheadline: v } })}
        />
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button className={cx("px-7 py-3 rounded-xl font-semibold transition shadow-sm", theme.accentSolid, "text-white")}>
          {ctaText}
        </button>

        {editMode ? (
          <div className={cx("px-5 py-3 rounded-xl border text-sm", theme.outline, theme.surface2, theme.subtle)}>
            Edit mode • Autosave on blur
          </div>
        ) : null}
      </div>
    </div>
  );

  if (variant === "image_background") {
    return (
      <section className={cx("relative overflow-hidden py-20 md:py-28 text-center", theme.toneBg)}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={cx("absolute inset-0", theme.page.includes("#05070d") ? "bg-black/55" : "bg-white/70")} />
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-indigo-500/18 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-orange-500/12 blur-3xl" />
        </div>

        {sharedInner}

        <div className="relative z-10 max-w-5xl mx-auto mt-10 px-6">
          <ImageSlot
            username={username}
            value={heroImage}
            onChange={(url) => onUpdate({ ...content, hero: { ...(content.hero || {}), image: url } })}
            editMode={editMode}
            label="Hero image"
            heightClass="h-64 md:h-72"
            className={cx("shadow-sm", theme.outline)}
          />
        </div>
      </section>
    );
  }

  if (variant === "split_image") {
    return (
      <section className={cx("py-16 md:py-20", theme.toneBg)}>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-left">{sharedInner}</div>
          <div className={cx("rounded-3xl overflow-hidden border shadow-sm", theme.outline, theme.surface2)}>
            <ImageSlot
              username={username}
              value={heroImage}
              onChange={(url) => onUpdate({ ...content, hero: { ...(content.hero || {}), image: url } })}
              editMode={editMode}
              label="Hero image"
              heightClass="h-72 md:h-[420px]"
              className="border-0 bg-transparent"
            />
          </div>
        </div>
      </section>
    );
  }

  // minimal + centered_text
  return (
    <section className={cx("relative py-16 md:py-20 text-center overflow-hidden", theme.toneBg)}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[860px] h-[860px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,black,transparent_35%),radial-gradient(circle_at_80%_30%,black,transparent_30%)]" />
      </div>

      {sharedInner}

      <div className="relative z-10 max-w-4xl mx-auto mt-10 px-6">
        <ImageSlot
          username={username}
          value={heroImage}
          onChange={(url) => onUpdate({ ...content, hero: { ...(content.hero || {}), image: url } })}
          editMode={editMode}
          label="Hero image"
          heightClass="h-64 md:h-72"
          className={cx("shadow-sm", theme.outline)}
        />
      </div>
    </section>
  );
}

/* ======================================================
   SECTIONS
====================================================== */

function HighlightSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const h = content?.highlight || {};
  return (
    <SectionShell title={SECTION_LABELS.highlight} subtitle="A warm line that explains your value fast." theme={theme}>
      <div className={cx("max-w-4xl mx-auto rounded-3xl border p-10 md:p-12", theme.outline, theme.surface2)}>
        <EditableText
          value={safeStr(h?.headline, "Make a strong first impression.")}
          editMode={editMode}
          className={cx("text-2xl md:text-3xl font-semibold text-center", theme.heading)}
          onSave={(v) => onUpdate({ ...content, highlight: { ...(content.highlight || {}), headline: v } })}
        />
        <EditablePara
          value={safeStr(h?.subheadline, "Warm, trustworthy design — plus real copy your customers understand.")}
          editMode={editMode}
          className={cx("mt-4 text-center text-lg leading-relaxed", theme.subtle)}
          onSave={(v) => onUpdate({ ...content, highlight: { ...(content.highlight || {}), subheadline: v } })}
        />
      </div>
    </SectionShell>
  );
}

function AboutSection({
  username,
  content,
  onUpdate,
  editMode,
  theme,
}: {
  username: string;
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const about = content?.about || {};
  const paragraphs = safeArr<string>(about?.paragraphs);

  return (
    <SectionShell title={SECTION_LABELS.about} subtitle="Tell a simple story customers trust." theme={theme}>
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className={cx("rounded-3xl border p-8", theme.outline, theme.surface2)}>
          <div className="space-y-5">
            {(paragraphs.length ? paragraphs : [
              "We focus on clarity, quality, and a great customer experience.",
              "If you want a simple website that looks premium and drives action, you’re in the right place.",
            ]).map((p, idx) => (
              <EditablePara
                key={idx}
                value={p}
                editMode={editMode}
                className={cx("text-base md:text-lg leading-relaxed", theme.subtle)}
                onSave={(v) => {
                  const base = paragraphs.length ? [...paragraphs] : [
                    "We focus on clarity, quality, and a great customer experience.",
                    "If you want a simple website that looks premium and drives action, you’re in the right place.",
                  ];
                  base[idx] = v;
                  onUpdate({ ...content, about: { ...(content.about || {}), paragraphs: base } });
                }}
              />
            ))}
          </div>

          {editMode ? (
            <div className="mt-6 flex gap-2">
              <button
                className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
                onClick={() => {
                  const next = paragraphs.length ? [...paragraphs] : [];
                  next.push("Add another paragraph…");
                  onUpdate({ ...content, about: { ...(content.about || {}), paragraphs: next } });
                }}
              >
                + Add paragraph
              </button>
              {paragraphs.length > 1 ? (
                <button
                  className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
                  onClick={() => {
                    const next = [...paragraphs];
                    next.pop();
                    onUpdate({ ...content, about: { ...(content.about || {}), paragraphs: next } });
                  }}
                >
                  − Remove last
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={cx("rounded-3xl border p-8", theme.outline, theme.surface2)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>About image (optional)</div>
          <div className="mt-4">
            <ImageSlot
              username={username}
              value={typeof about?.image === "string" ? about.image : null}
              onChange={(url) => onUpdate({ ...content, about: { ...(content.about || {}), image: url } })}
              editMode={editMode}
              label="About image"
              heightClass="h-64"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function ServicesSection({
  username,
  content,
  onUpdate,
  editMode,
  theme,
}: {
  username: string;
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const services = normalizeServices(content);
  const title = safeStr(content?.services?.title, "Services");

  return (
    <SectionShell title={SECTION_LABELS.services} subtitle="What you offer — clear, specific, and easy to understand." theme={theme}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <EditableText
          value={title}
          editMode={editMode}
          className={cx("text-xl md:text-2xl font-semibold", theme.heading)}
          onSave={(v) => {
            // write title back to object schema if present, else keep as is
            if (content?.services && typeof content.services === "object" && !Array.isArray(content.services)) {
              onUpdate({ ...content, services: { ...(content.services || {}), title: v } });
            } else {
              // if array schema, keep title elsewhere
              onUpdate({ ...content, services_title: v });
            }
          }}
        />

        {editMode ? (
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
              onClick={() => {
                const next = [...services, { title: "New service", description: "Describe the service.", image: null }];
                onUpdate(writeServicesBack(content, next));
              }}
            >
              + Add service
            </button>
            {services.length ? (
              <button
                className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
                onClick={() => {
                  const next = [...services];
                  next.pop();
                  onUpdate(writeServicesBack(content, next));
                }}
              >
                − Remove last
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {services.slice(0, 9).map((s, i) => (
          <div key={i} className={cx("rounded-3xl border p-6 shadow-sm", theme.outline, theme.surface2)}>
            <ImageSlot
              username={username}
              value={typeof s?.image === "string" ? s.image : null}
              onChange={(url) => {
                const next = [...services];
                next[i] = { ...next[i], image: url };
                onUpdate(writeServicesBack(content, next));
              }}
              editMode={editMode}
              label="Service image (optional)"
              heightClass="h-40"
            />

            <div className="mt-4">
              <EditableText
                value={safeStr(s?.title, "Service")}
                editMode={editMode}
                className={cx("text-lg font-semibold", theme.heading)}
                onSave={(v) => {
                  const next = [...services];
                  next[i] = { ...next[i], title: v };
                  onUpdate(writeServicesBack(content, next));
                }}
              />
              <EditablePara
                value={safeStr(s?.description, "Describe your service here.")}
                editMode={editMode}
                className={cx("mt-2 text-sm leading-relaxed", theme.subtle)}
                onSave={(v) => {
                  const next = [...services];
                  next[i] = { ...next[i], description: v };
                  onUpdate(writeServicesBack(content, next));
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function TrustSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const items = safeArr<string>(content?.trust?.items);
  const list = items.length ? items : ["Clear pricing", "Fast response", "Trusted quality"];

  return (
    <SectionShell title={SECTION_LABELS.trust} subtitle="Quick reasons people should choose you." theme={theme}>
      <div className="grid md:grid-cols-3 gap-6">
        {list.slice(0, 6).map((t, i) => (
          <div key={i} className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
            <EditableText
              value={t}
              editMode={editMode}
              className={cx("font-semibold", theme.heading)}
              onSave={(v) => {
                const next = list.slice();
                next[i] = v;
                onUpdate({ ...content, trust: { ...(content.trust || {}), items: next } });
              }}
            />
          </div>
        ))}
      </div>

      {editMode ? (
        <div className="mt-6 flex gap-2 justify-center">
          <button
            className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
            onClick={() => {
              const next = list.slice();
              next.push("New trust point");
              onUpdate({ ...content, trust: { ...(content.trust || {}), items: next } });
            }}
          >
            + Add point
          </button>
          {list.length > 3 ? (
            <button
              className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
              onClick={() => {
                const next = list.slice(0, -1);
                onUpdate({ ...content, trust: { ...(content.trust || {}), items: next } });
              }}
            >
              − Remove last
            </button>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  );
}

function ProcessSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const steps = safeArr<any>(content?.process?.steps);
  const list = steps.length ? steps : [
    { title: "Reach out", description: "Send a message with what you need." },
    { title: "Get a plan", description: "We reply with a simple next step." },
    { title: "Get results", description: "We deliver quickly — and you can edit anytime." },
  ];

  return (
    <SectionShell title={SECTION_LABELS.process} subtitle="A simple process customers trust." theme={theme}>
      <div className="grid md:grid-cols-3 gap-6">
        {list.slice(0, 6).map((s, i) => (
          <div key={i} className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
            <EditableText
              value={safeStr(s?.title, "Step")}
              editMode={editMode}
              className={cx("text-lg font-semibold", theme.heading)}
              onSave={(v) => {
                const next = list.slice();
                next[i] = { ...(next[i] || {}), title: v };
                onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
              }}
            />
            <EditablePara
              value={safeStr(s?.description, "Description")}
              editMode={editMode}
              className={cx("mt-2 text-sm leading-relaxed", theme.subtle)}
              onSave={(v) => {
                const next = list.slice();
                next[i] = { ...(next[i] || {}), description: v };
                onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
              }}
            />
          </div>
        ))}
      </div>

      {editMode ? (
        <div className="mt-6 flex gap-2 justify-center">
          <button
            className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
            onClick={() => {
              const next = list.slice();
              next.push({ title: "New step", description: "Describe the step." });
              onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
            }}
          >
            + Add step
          </button>
          {list.length > 3 ? (
            <button
              className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
              onClick={() => {
                const next = list.slice(0, -1);
                onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
              }}
            >
              − Remove last
            </button>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  );
}

function TestimonialSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const quote = safeStr(content?.testimonial?.quote, "“Professional, fast, and easy to work with.”");
  const author = safeStr(content?.testimonial?.author, "Happy customer");

  return (
    <SectionShell title={SECTION_LABELS.testimonial} subtitle="One strong quote adds instant trust." theme={theme}>
      <div className={cx("max-w-4xl mx-auto rounded-3xl border p-10 md:p-12", theme.outline, theme.surface2)}>
        <EditablePara
          value={quote}
          editMode={editMode}
          className={cx("text-xl md:text-2xl leading-relaxed", theme.heading)}
          onSave={(v) => onUpdate({ ...content, testimonial: { ...(content.testimonial || {}), quote: v } })}
        />
        <div className={cx("mt-6", theme.subtle)}>
          —{" "}
          <EditableText
            value={author}
            editMode={editMode}
            className="inline font-semibold"
            onSave={(v) => onUpdate({ ...content, testimonial: { ...(content.testimonial || {}), author: v } })}
          />
        </div>
      </div>
    </SectionShell>
  );
}

function FAQSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const faqs = safeArr<any>(content?.faq?.items);
  const list = faqs.length ? faqs : [
    { q: "How fast can I get started?", a: "Usually the same day. Send a message and we’ll take it from there." },
    { q: "Can I change anything later?", a: "Yes — you can edit everything and it autosaves." },
    { q: "Do I need images?", a: "No. But adding real photos increases trust and conversions." },
  ];

  return (
    <SectionShell title={SECTION_LABELS.faq} subtitle="Answer the questions customers actually ask." theme={theme}>
      <div className="max-w-4xl mx-auto space-y-4">
        {list.slice(0, 10).map((f, i) => (
          <div key={i} className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
            <EditableText
              value={safeStr(f?.q, "Question")}
              editMode={editMode}
              className={cx("text-lg font-semibold", theme.heading)}
              onSave={(v) => {
                const next = list.slice();
                next[i] = { ...(next[i] || {}), q: v };
                onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
              }}
            />
            <EditablePara
              value={safeStr(f?.a, "Answer")}
              editMode={editMode}
              className={cx("mt-2 text-sm leading-relaxed", theme.subtle)}
              onSave={(v) => {
                const next = list.slice();
                next[i] = { ...(next[i] || {}), a: v };
                onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
              }}
            />
          </div>
        ))}
      </div>

      {editMode ? (
        <div className="mt-6 flex gap-2 justify-center">
          <button
            className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
            onClick={() => {
              const next = list.slice();
              next.push({ q: "New question", a: "New answer" });
              onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
            }}
          >
            + Add FAQ
          </button>
          {list.length > 3 ? (
            <button
              className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
              onClick={() => {
                const next = list.slice(0, -1);
                onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
              }}
            >
              − Remove last
            </button>
          ) : null}
        </div>
      ) : null}
    </SectionShell>
  );
}

function GallerySection({
  username,
  content,
  onUpdate,
  editMode,
  theme,
}: {
  username: string;
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const imgs = safeArr<string>(content?.gallery?.images);
  const list = imgs.filter((x) => typeof x === "string" && x.trim());

  return (
    <SectionShell title={SECTION_LABELS.gallery} subtitle="Optional — real photos make the page feel alive." theme={theme}>
      <div className={cx("rounded-3xl border p-8", theme.outline, theme.surface2)}>
        {list.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((url, i) => (
              <div key={i} className="relative">
                <ImageSlot
                  username={username}
                  value={url}
                  onChange={(nextUrl) => {
                    const next = list.slice();
                    if (nextUrl) next[i] = nextUrl;
                    else next.splice(i, 1);
                    onUpdate({ ...content, gallery: { ...(content.gallery || {}), images: next } });
                  }}
                  editMode={editMode}
                  label={`Gallery image ${i + 1}`}
                  heightClass="h-44"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={cx("text-sm", theme.subtle)}>
            {editMode ? "Add a few images (optional)." : "No images."}
          </div>
        )}

        {editMode ? (
          <div className="mt-6 flex gap-2">
            <button
              className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
              onClick={() => {
                const next = list.slice();
                next.push("");
                onUpdate({ ...content, gallery: { ...(content.gallery || {}), images: next } });
              }}
            >
              + Add slot
            </button>
            {list.length ? (
              <button
                className="px-3 py-2 text-xs rounded-lg border bg-white hover:bg-black/5"
                onClick={() => {
                  const next = list.slice(0, -1);
                  onUpdate({ ...content, gallery: { ...(content.gallery || {}), images: next } });
                }}
              >
                − Remove last
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}

function CTASection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  const cta = content?.cta || {};
  return (
    <SectionShell title={SECTION_LABELS.cta} subtitle="A clear final action. Simple wins." theme={theme}>
      <div className={cx("rounded-3xl border p-10 md:p-12 text-center", theme.outline, theme.surface2)}>
        <EditableText
          value={safeStr(cta?.headline, "Ready to take the next step?")}
          editMode={editMode}
          className={cx("text-3xl md:text-4xl font-semibold", theme.heading)}
          onSave={(v) => onUpdate({ ...content, cta: { ...(content.cta || {}), headline: v } })}
        />
        <EditablePara
          value={safeStr(cta?.subheadline, "Send a message — we respond quickly.")}
          editMode={editMode}
          className={cx("mt-4 text-lg leading-relaxed", theme.subtle)}
          onSave={(v) => onUpdate({ ...content, cta: { ...(content.cta || {}), subheadline: v } })}
        />

        <div className="mt-8 flex justify-center">
          <button className={cx("px-7 py-3 rounded-xl font-semibold transition shadow-sm text-white", theme.accentSolid)}>
            {safeStr(cta?.button, safeStr(content?.hero?.cta_text, "Get started"))}
          </button>
        </div>
      </div>
    </SectionShell>
  );
}

function ContactSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: any;
}) {
  // You wanted this as the only "must fill"
  const phone = safeStr(content?.contact?.phone, "");
  const email = safeStr(content?.contact?.email, "");
  const address = safeStr(content?.contact?.address, safeStr(content?.location?.city, ""));

  return (
    <SectionShell title={SECTION_LABELS.contact} subtitle="This is the only part you must fill for a real business." theme={theme}>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <div className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Phone</div>
          <EditableText
            value={phone}
            placeholder={editMode ? "Add phone number" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, contact: { ...(content.contact || {}), phone: v } })}
          />
        </div>

        <div className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Email</div>
          <EditableText
            value={email}
            placeholder={editMode ? "Add email address" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, contact: { ...(content.contact || {}), email: v } })}
          />
        </div>

        <div className={cx("rounded-3xl border p-6", theme.outline, theme.surface2)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Address</div>
          <EditableText
            value={address}
            placeholder={editMode ? "Add address or city" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) =>
              onUpdate({
                ...content,
                contact: { ...(content.contact || {}), address: v },
                location: { ...(content.location || {}), city: v },
              })
            }
          />
        </div>
      </div>
    </SectionShell>
  );
}

/* ======================================================
   BUILDER PANEL (reorder/hide/add + tone + regenerate)
====================================================== */

function BuilderPanel({
  editMode,
  sections,
  setSections,
  tone,
  setTone,
  editorView,
  setEditorView,
  onRegenerate,
  theme,
}: {
  editMode: boolean;
  sections: Array<{ key: SectionKey; enabled: boolean }>;
  setSections: (next: Array<{ key: SectionKey; enabled: boolean }>) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  editorView: "auto" | "dark" | "light";
  setEditorView: (v: "auto" | "dark" | "light") => void;
  onRegenerate: (key: SectionKey) => void;
  theme: any;
}) {

  const [open, setOpen] = useState(true);

  if (!editMode) return null;

  const allAddable: SectionKey[] = ["highlight", "about", "services", "trust", "process", "testimonial", "faq", "gallery", "cta", "contact"];

  const present = new Set(sections.map((s) => s.key));
  const addable = allAddable.filter((k) => !present.has(k));
  const isPro = true; // pages come later; this is a UI hook only


  return (
    <div className="fixed top-4 left-4 z-50 w-[340px] max-w-[92vw]">
      <div className={cx("rounded-3xl border shadow-xl overflow-hidden", theme.outline, theme.surface2)}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <div className={cx("text-sm font-semibold", theme.heading)}>Builder</div>
            <div className={cx("text-xs mt-0.5", theme.subtle)}>Reorder • Toggle • Tone • Regenerate</div>
          </div>
          <button
            className="px-3 py-1.5 text-xs rounded-lg border bg-white hover:bg-black/5"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>

        {open && (
          <div className="px-4 pb-4">
            {/* Editor appearance */}
<div className="mt-2">
  <div className={cx("text-xs font-semibold", theme.subtle)}>
    Editor appearance
  </div>

  <div className="mt-2 grid grid-cols-3 gap-2">
    {(["auto", "light", "dark"] as const).map((v) => (
      <button
        key={v}
        className={cx(
          "px-2 py-2 rounded-xl text-xs font-semibold border transition",
          editorView === v
            ? cx("text-white", theme.accentSolid, "border-transparent")
            : "bg-white border-black/10 hover:bg-black/5"
        )}
        onClick={() => setEditorView(v)}
      >
        {v}
      </button>
    ))}
  </div>
</div>
            {/* Tone */}
            <div className="mt-2">
              <div className={cx("text-xs font-semibold", theme.subtle)}>Tone</div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {(["warm", "premium", "bold", "minimal"] as Tone[]).map((t) => (
                  <button
                    key={t}
                    className={cx(
                      "px-2 py-2 rounded-xl text-xs font-semibold border transition",
                      tone === t ? cx("text-white", theme.accentSolid, "border-transparent") : "bg-white border-black/10 hover:bg-black/5"
                    )}
                    onClick={() => setTone(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sections */}
            <div className="mt-4">
              <div className={cx("text-xs font-semibold", theme.subtle)}>Sections</div>
              <div className="mt-2 space-y-2">
                {sections.map((s, idx) => (
                  <div key={`${s.key}-${idx}`} className="flex items-center gap-2">
                    <button
                      className={cx(
                        "px-2 py-2 rounded-xl text-xs border bg-white hover:bg-black/5",
                        !s.enabled && "opacity-60"
                      )}
                      title="Toggle section"
                      onClick={() => {
                        const next = sections.slice();
                        next[idx] = { ...next[idx], enabled: !next[idx].enabled };
                        setSections(next);
                      }}
                    >
                      {s.enabled ? "On" : "Off"}
                    </button>

                    <div className={cx("flex-1 px-3 py-2 rounded-xl border text-xs", theme.outline, theme.surface)}>
                      <div className={cx("font-semibold", theme.heading)}>{SECTION_LABELS[s.key]}</div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        className="px-2 py-2 rounded-xl text-xs border bg-white hover:bg-black/5"
                        title="Move up"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const next = sections.slice();
                          const tmp = next[idx - 1];
                          next[idx - 1] = next[idx];
                          next[idx] = tmp;
                          setSections(next);
                        }}
                      >
                        ↑
                      </button>
                      <button
                        className="px-2 py-2 rounded-xl text-xs border bg-white hover:bg-black/5"
                        title="Move down"
                        disabled={idx === sections.length - 1}
                        onClick={() => {
                          if (idx === sections.length - 1) return;
                          const next = sections.slice();
                          const tmp = next[idx + 1];
                          next[idx + 1] = next[idx];
                          next[idx] = tmp;
                          setSections(next);
                        }}
                      >
                        ↓
                      </button>
                      <button
                        className={cx("px-2 py-2 rounded-xl text-xs border bg-white hover:bg-black/5")}
                        title="Regenerate this section with AI"
                        onClick={() => onRegenerate(s.key)}
                      >
                        ✨
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add section */}
              {addable.length ? (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {addable.map((k) => (
                    <button
                      key={k}
                      className="px-3 py-2 rounded-xl text-xs border bg-white hover:bg-black/5"
                      onClick={() => setSections([...sections, { key: k, enabled: true }])}
                    >
                      + {SECTION_LABELS[k]}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 space-y-1 text-[11px] text-black/50">
                <div>✨ = regenerate section. You can edit anything after.</div>
                <div>
                  Multiple pages are available on the <span className="font-semibold">Pro</span> plan.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   MAIN
====================================================== */

export default function AIWebsiteRenderer({ username, structure, content, editMode }: Props) {
  const { toast, t } = useToast();

  const [localContent, setLocalContent] = useState<any>(() =>
  content || {}
  );


  // Keep in sync if backend content changes
  useEffect(() => {
  if (content) {
    setLocalContent(content);
  }
}, [content]);


  const save = useAutosave(username, editMode);

    const plan =
    (structure as any)?.plan || {
      name: "free",
      max_pages: 1,
      can_publish: false,
    };

  const tone: Tone = (localContent?._builder?.tone as Tone) || "warm";

    // Editor-only view mode (does NOT affect the published site)
  const editorView =
  (localContent?._builder?.editorView as "auto" | "light" | "dark") || "auto";

      const theme = useTheme(structure, tone, editorView);

  const defaultSectionOrder = useMemo(() => defaultSectionsFromStructure(structure), [structure]);

  const [sections, setSectionsState] = useState<
  Array<{ key: SectionKey; enabled: boolean }>
>([]);

// initialize sections ONCE from AI structure
useEffect(() => {
  const aiSections = defaultSectionsFromStructure(structure);

  const initial = aiSections.map((k) => ({
    key: k,
    enabled: true,
  }));

  // ensure contact always exists
  if (!initial.some((s) => s.key === "contact")) {
    initial.push({ key: "contact", enabled: true });
  }

  setSectionsState(initial);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [structure]);


// initialize from content._builder.sections if present
useEffect(() => {
  const meta = localContent?._builder;
  const stored = meta?.sections;

if (editMode && Array.isArray(stored) && stored.length) {
  // Fallback: enable all AI sections by default
const fallback = defaultSectionOrder.map((key) => ({
  key,
  enabled: true,
}));

setSectionsState(fallback);
    const next: Array<{ key: SectionKey; enabled: boolean }> = stored
      .map((x: any) => ({
        key: String(x?.key || "").toLowerCase() as SectionKey,
        enabled: x?.enabled !== false,
      }))
      .filter((x) => Object.keys(SECTION_LABELS).includes(x.key));

    // Always ensure contact exists last
    const hasContact = next.some((s) => s.key === "contact");
    const final: Array<{ key: SectionKey; enabled: boolean }> = hasContact
      ? next
      : [...next, { key: "contact", enabled: true }];

    setSectionsState(final);
    return;
  }

  // else: default from structure
  const init: Array<{ key: SectionKey; enabled: boolean }> =
    defaultSectionOrder.map((k) => ({ key: k, enabled: true }));

  setSectionsState(init);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [structure?.sections, localContent?._builder?.sections]);

const setSections = useCallback(
  (next: Array<{ key: SectionKey; enabled: boolean }>) => {
    // Always force contact to exist at least once
    const hasContact = next.some((s) => s.key === "contact");
    const final: Array<{ key: SectionKey; enabled: boolean }> = hasContact
      ? next
      : [...next, { key: "contact", enabled: true }];

    setSectionsState(final);

    // persist to content builder meta
    const updated = ensureBuilderMeta(localContent);
    updated._builder.sections = final.map((s) => ({
      key: s.key,
      enabled: s.enabled,
    }));

    setLocalContent(updated);
    save(updated);
  },
  [localContent, save]
);


  const setTone = useCallback(
    (nextTone: Tone) => {
      const updated = ensureBuilderMeta(localContent);
      updated._builder.tone = nextTone;
      setLocalContent(updated);
      save(updated);
    },
    [localContent, save]
  );

  const setEditorView = useCallback(
  (next: "auto" | "light" | "dark") => {
    const updated = ensureBuilderMeta(localContent);
    updated._builder.editorView = next;
    setLocalContent(updated);
    save(updated);
  },
  [localContent, save]
);

  const update = useCallback(
    (next: any) => {
      const fixed = buildDefaultContentIfMissing(next, username);
      setLocalContent(fixed);
      save(fixed);
    },
    [save, username]
  );

  const missing = getMissingContactFields(localContent);
  const showContactHint = editMode && missing.length > 0;

  const [regenBusy, setRegenBusy] = useState<SectionKey | null>(null);

  const regenerateSection = useCallback(
    async (key: SectionKey) => {
      if (!editMode) return;

      const token = localStorage.getItem("autopilot_token");
      if (!token) {
        t({ type: "err", msg: "You must be logged in to regenerate sections." });
        return;
      }

      setRegenBusy(key);
      try {
        const res = await fetch(`${getApiBase()}/api/restaurants/${username}/regenerate-section`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            section: key,
            tone: (localContent?._builder?.tone as Tone) || "warm",
            content: localContent,
          }),
        });

        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j?.detail || "Regeneration failed");
        }

        const data = await res.json();
        const patch = data?.patch;
        const merged = { ...deepClone(localContent), ...(patch || {}) };
        update(merged);
        t({ type: "ok", msg: `Regenerated: ${SECTION_LABELS[key]}` });
      } catch (e: any) {
        t({ type: "err", msg: e?.message || "Regeneration failed" });
      } finally {
        setRegenBusy(null);
      }
    },
    [editMode, localContent, t, update, username]
  );

  const enabledSectionKeys = useMemo(() => sections.filter((s) => s.enabled).map((s) => s.key), [sections]);

  return (
    <main className={cx("min-h-screen", theme.page, theme.editorUiFix)}>
      {/* Toast */}
      {toast ? (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold shadow border",
              toast.type === "ok"
                ? "bg-white text-black border-black/10"
                : toast.type === "info"
                ? "bg-white text-black border-black/10"
                : "bg-red-500/10 text-red-700 border-red-500/30"
            )}
          >
            {toast.msg}
          </div>
        </div>
      ) : null}

      {/* Edit badge */}
      {editMode && (
        <div className="fixed top-4 right-4 z-50">
          <div className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow">
            Edit mode • Autosave
          </div>
        </div>
      )}

            {/* Free plan notice */}
      {editMode && !plan.can_publish && (
        <div className="max-w-6xl mx-auto mt-6 px-6">
          <div
            className={cx(
              "rounded-3xl border px-6 py-5 flex items-center justify-between gap-4",
              theme.outline,
              theme.surface2
            )}
          >
            <div>
              <div className={cx("font-semibold", theme.heading)}>
                Free plan — preview only
              </div>
              <div className={cx("text-sm mt-1", theme.subtle)}>
                Upgrade to publish your site and connect a custom domain.
              </div>
            </div>
            <a
              href="/pricing"
              className={cx(
                "px-4 py-2 rounded-xl text-sm font-semibold text-white",
                theme.accentSolid
              )}
            >
              Upgrade
            </a>
          </div>
        </div>
      )}


      {/* Builder panel */}
      <BuilderPanel
        editMode={editMode}
        sections={sections}
        setSections={setSections}
        tone={tone}
        setTone={setTone}
        editorView={editorView}
        setEditorView={setEditorView}
        onRegenerate={(k) => regenerateSection(k)}
        theme={theme}
      />

      {/* Contact hint */}
      {showContactHint && (
        <div className="max-w-6xl mx-auto mt-6 px-6">
          <div className={cx("rounded-3xl border px-6 py-5", theme.outline, theme.surface2)}>
            <div className={cx("font-semibold", theme.heading)}>Finish contact info</div>
            <div className={cx("mt-1 text-sm", theme.subtle)}>
              Add your <span className={cx("font-semibold", theme.heading)}>{missing.join(", ")}</span> to publish a real business site.
            </div>
          </div>
        </div>
      )}

      {/* HERO always */}
      <Hero
        username={username}
        structure={structure}
        content={localContent}
        onUpdate={update}
        editMode={editMode}
        theme={theme}
      />

      {/* Sections */}
      {enabledSectionKeys.includes("highlight") && (
        <HighlightSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("about") && (
        <AboutSection username={username} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("services") && (
        <ServicesSection username={username} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("trust") && (
        <TrustSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("process") && (
        <ProcessSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("testimonial") && (
        <TestimonialSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("faq") && (
        <FAQSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("gallery") && (
        <GallerySection username={username} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {enabledSectionKeys.includes("cta") && (
        <CTASection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {/* Contact always last if enabled */}
      {enabledSectionKeys.includes("contact") && (
        <ContactSection content={localContent} onUpdate={update} editMode={editMode} theme={theme} />
      )}

      {/* Footer */}
      <footer className={cx("py-10 text-center text-sm", theme.subtle)}>
        © {new Date().getFullYear()} {safeStr(localContent?.business_name, username)}
      </footer>

      {/* Regen busy overlay (simple + obvious) */}
      {editMode && regenBusy && (
        <div className="fixed inset-0 z-[70] bg-black/30 flex items-center justify-center">
          <div className="bg-white text-black rounded-2xl px-5 py-4 shadow border border-black/10">
            <div className="text-sm font-semibold">Regenerating…</div>
            <div className="text-xs opacity-70 mt-1">{SECTION_LABELS[regenBusy]}</div>
          </div>
        </div>
      )}
    </main>
  );
}
