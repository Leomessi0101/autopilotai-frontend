"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TEMPLATE_VERSION = 1;

/**
 * BusinessTemplate (Template Version 1)
 * - Light/Dark theme toggle stored in content_json (default: light)
 * - Stable buffered inputs to prevent cursor loss
 * - Dirty-state snapshot + beforeunload protection
 * - Autosave (debounced) + manual save (still exists)
 * - Cloudflare R2 uploads via Worker (same as Restaurant)
 *
 * IMPORTANT:
 * This template is “complete” UI-wise and editor-wise.
 * The save endpoint should be wired to a generic website save route later.
 * For now, SAVE_URL is a placeholder — it will show a friendly error until backend is wired.
 */

/* ======================================================
   TYPES
====================================================== */

type ThemeMode = "light" | "dark";

type ServiceItem = {
  title: string;
  description: string;
  icon?: string; // optional future (emoji, icon name, etc.)
};

type ContentState = {
  theme: ThemeMode;

  hero: {
    headline: string;
    subheadline: string;
    image: string | null;
    cta_text: string;
    cta_link: string;
  };

  trust: {
    enabled: boolean;
    items: { label: string; value: string }[]; // e.g. 500+ clients, 10 yrs, 24/7
  };

  about: {
    title: string;
    text: string;
    image: string | null;
  };

  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };

  process: {
    title: string;
    steps: { title: string; description: string }[];
  };

  testimonial: {
    enabled: boolean;
    quote: string;
    name: string;
    role: string;
  };

  contact: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    address: string;
    city: string;
  };

  footer: {
    note: string;
  };

  // allow future fields without breaking
  [key: string]: any;
};

/* ======================================================
   HELPERS
====================================================== */

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function str(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function isTheme(v: any): v is ThemeMode {
  return v === "light" || v === "dark";
}

function defaultContent(username: string): ContentState {
  return {
    theme: "light",

    hero: {
      headline: username ? `${username}` : "Your Business",
      subheadline:
        "A clean, modern website that explains what you do, builds trust, and converts visitors into customers.",
      image: null,
      cta_text: "Get a free quote",
      cta_link: "#contact",
    },

    trust: {
      enabled: true,
      items: [
        { label: "Clients served", value: "200+" },
        { label: "Years experience", value: "10+" },
        { label: "Avg response time", value: "< 2h" },
      ],
    },

    about: {
      title: "About us",
      text:
        "We help customers solve real problems with reliable service, clear communication, and high quality results.\n\nAdd your story here: who you are, what you specialize in, and why customers trust you.",
      image: null,
    },

    services: {
      title: "Services",
      subtitle: "Everything you need — delivered professionally and on time.",
      items: [
        { title: "Service one", description: "Briefly describe this service." },
        { title: "Service two", description: "Briefly describe this service." },
        { title: "Service three", description: "Briefly describe this service." },
      ],
    },

    process: {
      title: "How it works",
      steps: [
        {
          title: "1) Tell us what you need",
          description: "We’ll ask a few quick questions to understand the job.",
        },
        {
          title: "2) Get a clear plan",
          description: "You’ll receive a proposal with timeline and pricing.",
        },
        {
          title: "3) We deliver",
          description: "We do the work, keep you updated, and finalize fast.",
        },
      ],
    },

    testimonial: {
      enabled: true,
      quote:
        "They were fast, professional, and the result exceeded expectations. Communication was clear from start to finish.",
      name: "Happy Customer",
      role: "Local Business Owner",
    },

    contact: {
      title: "Contact",
      subtitle: "Reach out — we usually respond the same day.",
      phone: "+66 000 000 000",
      email: "hello@yourbusiness.com",
      address: "123 Main Street",
      city: "Chiang Mai",
    },

    footer: {
      note: "© " + new Date().getFullYear() + " Your Business. All rights reserved.",
    },
  };
}

function normalizeContent(raw: any, username: string): ContentState {
  const base = defaultContent(username);

  const safeTheme: ThemeMode = isTheme(raw?.theme) ? raw.theme : "light";

  const safe: ContentState = {
    ...base,
    ...raw,

    theme: safeTheme,

    hero: {
      ...base.hero,
      ...raw?.hero,
      headline: str(raw?.hero?.headline ?? base.hero.headline),
      subheadline: str(raw?.hero?.subheadline ?? base.hero.subheadline),
      image: raw?.hero?.image ?? base.hero.image,
      cta_text: str(raw?.hero?.cta_text ?? base.hero.cta_text),
      cta_link: str(raw?.hero?.cta_link ?? base.hero.cta_link),
    },

    trust: {
      ...base.trust,
      ...raw?.trust,
      enabled: typeof raw?.trust?.enabled === "boolean" ? raw.trust.enabled : base.trust.enabled,
      items: Array.isArray(raw?.trust?.items) ? raw.trust.items : base.trust.items,
    },

    about: {
      ...base.about,
      ...raw?.about,
      title: str(raw?.about?.title ?? base.about.title),
      text: str(raw?.about?.text ?? base.about.text),
      image: raw?.about?.image ?? base.about.image,
    },

    services: {
      ...base.services,
      ...raw?.services,
      title: str(raw?.services?.title ?? base.services.title),
      subtitle: str(raw?.services?.subtitle ?? base.services.subtitle),
      items: Array.isArray(raw?.services?.items) ? raw.services.items : base.services.items,
    },

    process: {
      ...base.process,
      ...raw?.process,
      title: str(raw?.process?.title ?? base.process.title),
      steps: Array.isArray(raw?.process?.steps) ? raw.process.steps : base.process.steps,
    },

    testimonial: {
      ...base.testimonial,
      ...raw?.testimonial,
      enabled:
        typeof raw?.testimonial?.enabled === "boolean"
          ? raw.testimonial.enabled
          : base.testimonial.enabled,
      quote: str(raw?.testimonial?.quote ?? base.testimonial.quote),
      name: str(raw?.testimonial?.name ?? base.testimonial.name),
      role: str(raw?.testimonial?.role ?? base.testimonial.role),
    },

    contact: {
      ...base.contact,
      ...raw?.contact,
      title: str(raw?.contact?.title ?? base.contact.title),
      subtitle: str(raw?.contact?.subtitle ?? base.contact.subtitle),
      phone: str(raw?.contact?.phone ?? base.contact.phone),
      email: str(raw?.contact?.email ?? base.contact.email),
      address: str(raw?.contact?.address ?? base.contact.address),
      city: str(raw?.contact?.city ?? base.contact.city),
    },

    footer: {
      ...base.footer,
      ...raw?.footer,
      note: str(raw?.footer?.note ?? base.footer.note),
    },
  };

  // Normalize services items
  safe.services.items = (safe.services.items || []).map((it: any) => ({
    title: str(it?.title || "Service"),
    description: str(it?.description || ""),
    icon: it?.icon ? str(it.icon) : undefined,
  }));

  // Normalize trust items
  safe.trust.items = (safe.trust.items || []).map((it: any) => ({
    label: str(it?.label || "Label"),
    value: str(it?.value || "Value"),
  }));

  // Normalize process steps
  safe.process.steps = (safe.process.steps || []).map((it: any) => ({
    title: str(it?.title || "Step"),
    description: str(it?.description || ""),
  }));

  return safe;
}

function emptyService(): ServiceItem {
  return { title: "New service", description: "Describe what this service includes." };
}

function emptyTrustItem() {
  return { label: "New metric", value: "100+" };
}

function emptyStep() {
  return { title: "New step", description: "Describe this step." };
}

/**
 * Deterministic stringify for dirty-check snapshots.
 * - Sorts object keys
 * - Preserves array order
 */
function stableStringify(value: any): string {
  const seen = new WeakSet();

  const stringifyInner = (v: any): any => {
    if (v === null || typeof v !== "object") return v;

    if (seen.has(v)) return null;
    seen.add(v);

    if (Array.isArray(v)) return v.map(stringifyInner);

    const out: Record<string, any> = {};
    Object.keys(v)
      .sort()
      .forEach((k) => {
        out[k] = stringifyInner(v[k]);
      });
    return out;
  };

  try {
    return JSON.stringify(stringifyInner(value));
  } catch {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}

/* ======================================================
   STABLE (BUFFERED) INPUTS
====================================================== */

function StableInputBase({
  value,
  onChangeValue,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChangeValue: (v: string) => void;
}) {
  const [local, setLocal] = useState<string>(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <input
      {...props}
      value={local}
      onChange={(e) => {
        const v = e.target.value;
        setLocal(v);
        onChangeValue(v);
      }}
    />
  );
}

function StableTextareaBase({
  value,
  onChangeValue,
  ...props
}: Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  value: string;
  onChangeValue: (v: string) => void;
}) {
  const [local, setLocal] = useState<string>(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <textarea
      {...props}
      value={local}
      onChange={(e) => {
        const v = e.target.value;
        setLocal(v);
        onChangeValue(v);
      }}
    />
  );
}

/* ======================================================
   UI PRIMITIVES (THEME-AWARE)
====================================================== */

function FieldLabel({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: ThemeMode;
}) {
  return (
    <div
      className={cx(
        "text-[11px] uppercase tracking-wide mb-2",
        theme === "light" ? "text-black/45" : "text-white/45"
      )}
    >
      {children}
    </div>
  );
}

function StableInput({
  theme,
  className,
  value,
  onChangeValue,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  theme: ThemeMode;
  value: string;
  onChangeValue: (v: string) => void;
}) {
  const base =
    theme === "light"
      ? cx(
          "w-full bg-white border border-black/10 rounded-xl px-3 py-2",
          "text-black placeholder:text-black/35 outline-none",
          "focus:border-black/20 focus:ring-2 focus:ring-black/10"
        )
      : cx(
          "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
          "text-white placeholder:text-white/35 outline-none",
          "focus:border-white/20 focus:ring-2 focus:ring-white/10"
        );

  return (
    <StableInputBase
      {...props}
      value={value}
      onChangeValue={onChangeValue}
      className={cx(base, className)}
    />
  );
}

function StableTextarea({
  theme,
  className,
  value,
  onChangeValue,
  ...props
}: Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "onChange"
> & {
  theme: ThemeMode;
  value: string;
  onChangeValue: (v: string) => void;
}) {
  const base =
    theme === "light"
      ? cx(
          "w-full bg-white border border-black/10 rounded-xl px-3 py-2",
          "text-black placeholder:text-black/35 outline-none resize-none",
          "focus:border-black/20 focus:ring-2 focus:ring-black/10"
        )
      : cx(
          "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
          "text-white placeholder:text-white/35 outline-none resize-none",
          "focus:border-white/20 focus:ring-2 focus:ring-white/10"
        );

  return (
    <StableTextareaBase
      {...props}
      value={value}
      onChangeValue={onChangeValue}
      className={cx(base, className)}
    />
  );
}

function PillButton({
  children,
  onClick,
  disabled,
  theme,
  variant = "soft",
  className,
  type,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  theme: ThemeMode;
  variant?: "primary" | "soft" | "danger" | "ghost";
  className?: string;
  type?: "button" | "submit";
  title?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition select-none";

  const styles =
    variant === "primary"
      ? theme === "light"
        ? "bg-black text-white hover:opacity-90 disabled:opacity-60"
        : "bg-white text-black hover:opacity-90 disabled:opacity-60"
      : variant === "danger"
      ? theme === "light"
        ? "border border-red-500/30 bg-red-500/10 text-red-700 hover:bg-red-500/15 disabled:opacity-60"
        : "border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/15 disabled:opacity-60"
      : variant === "ghost"
      ? theme === "light"
        ? "border border-black/10 bg-transparent text-black/70 hover:bg-black/5 disabled:opacity-60"
        : "border border-white/10 bg-transparent text-white/70 hover:bg-white/5 disabled:opacity-60"
      : theme === "light"
      ? "border border-black/10 bg-black/5 text-black/80 hover:bg-black/10 disabled:opacity-60"
      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-60";

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cx(base, styles, className)}
    >
      {children}
    </button>
  );
}

function Card({
  theme,
  className,
  children,
}: {
  theme: ThemeMode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border p-5",
        theme === "light"
          ? "bg-white border-black/10 shadow-sm"
          : "bg-black/40 border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
}

function Divider({ theme }: { theme: ThemeMode }) {
  return (
    <div
      className={cx(
        "h-px w-full",
        theme === "light" ? "bg-black/10" : "bg-white/10"
      )}
    />
  );
}

/* ======================================================
   COMPONENT
====================================================== */

export default function BusinessTemplate({
  username,
  content: initialContent,
  editMode,
}: {
  username: string;
  content: any; // already parsed content_json from page.tsx
  editMode: boolean;
}) {
  const [content, setContent] = useState<ContentState>(() =>
    normalizeContent(initialContent, username)
  );

  const theme = content.theme;

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<null | { type: "ok" | "err"; msg: string }>(
    null
  );

  const heroRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  /* ======================================================
     THEME TOKENS (CLASS STRINGS)
  ====================================================== */

  const tokens = useMemo(() => {
    if (theme === "light") {
      return {
        pageBg: "bg-[#f6f7fb] text-black",
        subtleBg: "bg-white",
        heroBg: "bg-gradient-to-b from-white to-[#f6f7fb]",
        mutedText: "text-black/60",
        softText: "text-black/45",
        strongText: "text-black",
        border: "border-black/10",
        accent: "text-black",
        badgeBg: "bg-black text-white",
        navBg: "bg-white/80 backdrop-blur border-black/10",
        sectionTitle: "text-black",
      };
    }
    return {
      pageBg: "bg-[#0b0b0b] text-white",
      subtleBg: "bg-black/40",
      heroBg: "bg-gradient-to-b from-black to-[#0b0b0b]",
      mutedText: "text-white/70",
      softText: "text-white/45",
      strongText: "text-white",
      border: "border-white/10",
      accent: "text-white",
      badgeBg: "bg-white text-black",
      navBg: "bg-black/60 backdrop-blur border-white/10",
      sectionTitle: "text-white",
    };
  }, [theme]);

  /* ======================================================
     DIRTY STATE + TAB CLOSE PROTECTION
  ====================================================== */

  const lastSavedSnapshotRef = useRef<string>("");
  const [isDirty, setIsDirty] = useState(false);

  const buildSavePayload = (c: ContentState) => ({
    template_version: TEMPLATE_VERSION,
    template: "business",
    theme: c.theme,

    hero: c.hero,
    trust: c.trust,
    about: c.about,
    services: c.services,
    process: c.process,
    testimonial: c.testimonial,
    contact: c.contact,
    footer: c.footer,
  });

  // Initial sync (site identity)
  useEffect(() => {
    const normalized = normalizeContent(initialContent, username);
    setContent(normalized);

    const snap = stableStringify(buildSavePayload(normalized));
    lastSavedSnapshotRef.current = snap;
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  // If initialContent changes, resync
  useEffect(() => {
    const normalized = normalizeContent(initialContent, username);
    setContent(normalized);

    const snap = stableStringify(buildSavePayload(normalized));
    lastSavedSnapshotRef.current = snap;
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  useEffect(() => {
    if (!editMode) {
      setIsDirty(false);
      return;
    }
    const currentSnap = stableStringify(buildSavePayload(content));
    setIsDirty(currentSnap !== lastSavedSnapshotRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editMode]);

  useEffect(() => {
    if (!editMode) return;

    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      if (saving || uploading) return;

      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editMode, isDirty, saving, uploading]);

  /* ======================================================
     AUTOSAVE (DEBOUNCED)
  ====================================================== */

  const autosaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editMode) return;
    if (!isDirty) return;
    if (uploading) return;
    if (saving) return;

    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = window.setTimeout(() => {
      void saveAll({ silent: true });
    }, 900);

    return () => {
      if (autosaveTimerRef.current) {
        window.clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editMode, isDirty, uploading]);

  /* ======================================================
     UPLOAD HELPERS
  ====================================================== */

  async function uploadFile(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("https://upload.autopilotai.dev/upload", {
      method: "POST",
      body: form,
    });

    const out = await res.json();
    if (!out?.url) throw new Error("Upload failed");
    return out.url;
  }

  async function uploadHeroImage(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setContent((prev) => ({
        ...prev,
        hero: { ...prev.hero, image: url },
      }));
    } catch {
      setToast({ type: "err", msg: "Hero upload failed" });
      setTimeout(() => setToast(null), 2200);
    } finally {
      setUploading(false);
    }
  }

  async function uploadAboutImage(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setContent((prev) => ({
        ...prev,
        about: { ...prev.about, image: url },
      }));
    } catch {
      setToast({ type: "err", msg: "About image upload failed" });
      setTimeout(() => setToast(null), 2200);
    } finally {
      setUploading(false);
    }
  }

  function removeHeroImage() {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, image: null } }));
  }

  function removeAboutImage() {
    setContent((prev) => ({ ...prev, about: { ...prev.about, image: null } }));
  }

  /* ======================================================
     SECTION EDIT HELPERS
  ====================================================== */

  function toggleTheme() {
    setContent((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }

  function addService() {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.services.items.push(emptyService());
      return copy;
    });
  }

  function removeService(idx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.services.items.splice(idx, 1);
      return copy;
    });
  }

  function moveService(idx: number, dir: -1 | 1) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      const next = idx + dir;
      if (next < 0 || next >= copy.services.items.length) return copy;
      const tmp = copy.services.items[idx];
      copy.services.items[idx] = copy.services.items[next];
      copy.services.items[next] = tmp;
      return copy;
    });
  }

  function addTrustItem() {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.trust.items.push(emptyTrustItem());
      return copy;
    });
  }

  function removeTrustItem(idx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.trust.items.splice(idx, 1);
      return copy;
    });
  }

  function moveTrustItem(idx: number, dir: -1 | 1) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      const next = idx + dir;
      if (next < 0 || next >= copy.trust.items.length) return copy;
      const tmp = copy.trust.items[idx];
      copy.trust.items[idx] = copy.trust.items[next];
      copy.trust.items[next] = tmp;
      return copy;
    });
  }

  function addStep() {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.process.steps.push(emptyStep());
      return copy;
    });
  }

  function removeStep(idx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.process.steps.splice(idx, 1);
      return copy;
    });
  }

  function moveStep(idx: number, dir: -1 | 1) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      const next = idx + dir;
      if (next < 0 || next >= copy.process.steps.length) return copy;
      const tmp = copy.process.steps[idx];
      copy.process.steps[idx] = copy.process.steps[next];
      copy.process.steps[next] = tmp;
      return copy;
    });
  }

  /* ======================================================
     SAVE
  ====================================================== */

  /**
   * IMPORTANT:
   * This template needs a generic “save website content” endpoint.
   * We do NOT use the restaurant /menu endpoint, because it would drop fields.
   *
   * When you wire backend later, update SAVE_URL to the correct route.
   *
   * Expected backend behavior:
   * - Validate ownership from JWT
   * - Merge/replace website.content_json
   */
  const SAVE_URL = `https://autopilotai-api.onrender.com/api/websites/${username}/content`;

  async function saveAll(opts?: { silent?: boolean }) {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      if (!opts?.silent) {
        setToast({ type: "err", msg: "Not logged in" });
        setTimeout(() => setToast(null), 2000);
      }
      return;
    }

    const payload = buildSavePayload(content);
    const snap = stableStringify(payload);

    if (snap === lastSavedSnapshotRef.current) {
      if (!opts?.silent) {
        setToast({ type: "ok", msg: "Already saved" });
        setTimeout(() => setToast(null), 1200);
      }
      setIsDirty(false);
      return;
    }

    setSaving(true);
    if (!opts?.silent) setToast(null);

    try {
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Friendly hint when not wired yet (404/405 are common)
        if (!opts?.silent && (res.status === 404 || res.status === 405)) {
          throw new Error("SAVE_NOT_WIRED");
        }
        throw new Error("Save failed");
      }

      lastSavedSnapshotRef.current = snap;
      setIsDirty(false);

      if (!opts?.silent) {
        setToast({ type: "ok", msg: "Saved" });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (e: any) {
      if (!opts?.silent) {
        if (e?.message === "SAVE_NOT_WIRED") {
          setToast({
            type: "err",
            msg: "Save endpoint not wired for BusinessTemplate yet (backend step).",
          });
          setTimeout(() => setToast(null), 3200);
        } else {
          setToast({ type: "err", msg: "Save failed" });
          setTimeout(() => setToast(null), 2500);
        }
      }
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     VIEW HELPERS
  ====================================================== */

  const showTrust = content.trust.enabled && content.trust.items.length > 0;
  const showTestimonial = content.testimonial.enabled && !!content.testimonial.quote;

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className={cx("min-h-screen", tokens.pageBg)}>
      {/* Top progress */}
      {(saving || uploading) && (
        <div className="fixed inset-x-0 top-0 z-[80] h-1 bg-black/10">
          <div
            className={cx(
              "h-full w-1/2 animate-pulse",
              theme === "light" ? "bg-black/70" : "bg-white"
            )}
          />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90]">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold border shadow-lg",
              theme === "light" ? "shadow-black/10" : "shadow-black/30",
              toast.type === "ok"
                ? theme === "light"
                  ? "bg-black text-white border-black/20"
                  : "bg-white text-black border-white/20"
                : theme === "light"
                ? "bg-red-500/10 text-red-700 border-red-500/20"
                : "bg-red-500/15 text-red-100 border-red-500/25"
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}

      {/* Top-left theme toggle (always visible) */}
      <div className="fixed top-4 left-4 z-[85] flex items-center gap-2">
        <PillButton
          theme={theme}
          variant="ghost"
          onClick={toggleTheme}
          disabled={saving || uploading}
          title="Toggle light/dark mode (stored in this website)"
          className="px-4"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </PillButton>

        {/* Small “All saved / Unsaved” badge in editMode */}
        {editMode && (
          <div
            className={cx(
              "px-3 py-2 rounded-full text-xs font-semibold border",
              theme === "light" ? "border-black/10 bg-white" : "border-white/10 bg-black/40"
            )}
            title={
              isDirty
                ? "You have unsaved changes (autosave runs). Closing the tab will warn you."
                : "All changes saved"
            }
          >
            <span className={theme === "light" ? "text-black/70" : "text-white/70"}>
              {isDirty ? "Unsaved changes" : "All saved"}
            </span>
          </div>
        )}
      </div>

      {/* Desktop edit bar */}
      {editMode && (
        <div className="fixed top-4 right-4 z-[85] hidden md:flex gap-3 items-center">
          <PillButton
            theme={theme}
            variant="primary"
            onClick={() => saveAll({ silent: false })}
            disabled={saving || uploading || !isDirty}
          >
            {saving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
          </PillButton>

          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold border shadow-lg",
              theme === "light"
                ? "bg-black text-white border-black/20 shadow-black/10"
                : "bg-white text-black border-white/20 shadow-black/30"
            )}
          >
            Edit mode
          </div>
        </div>
      )}

      {/* Mobile sticky save bar */}
      {editMode && (
        <div
          className={cx(
            "fixed bottom-0 inset-x-0 z-[85] md:hidden border-t px-4 py-3",
            theme === "light"
              ? "border-black/10 bg-white/80 backdrop-blur"
              : "border-white/10 bg-black/70 backdrop-blur"
          )}
        >
          <div className="max-w-5xl mx-auto flex items-center gap-3">
            <div className={cx("text-xs flex-1", theme === "light" ? "text-black/70" : "text-white/70")}>
              Edit mode active{" "}
              <span className={theme === "light" ? "text-black/45" : "text-white/40"}>
                {isDirty ? "• Unsaved changes" : "• All saved"}
              </span>
              <div className={cx("text-[11px]", theme === "light" ? "text-black/45" : "text-white/40")}>
                {isDirty
                  ? "Autosave will run. Closing the tab will warn you."
                  : "Your changes are saved."}
              </div>
            </div>

            <PillButton
              theme={theme}
              variant="primary"
              onClick={() => saveAll({ silent: false })}
              disabled={saving || uploading || !isDirty}
              className="px-6"
            >
              {saving ? "Saving…" : isDirty ? "Save" : "Saved"}
            </PillButton>
          </div>
        </div>
      )}

      {/* ======================================================
         NAV / HEADER
      ====================================================== */}
      <header
        className={cx(
          "sticky top-0 z-[60] border-b",
          tokens.navBg
        )}
      >
        <div className="max-w-5xl mx-auto px-5 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cx(
                "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black",
                theme === "light" ? "bg-black text-white" : "bg-white text-black"
              )}
            >
              B
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{content.hero.headline || username}</div>
              <div className={cx("text-xs", tokens.softText)}>Business website</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PillButton
              theme={theme}
              variant="ghost"
              onClick={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Top
            </PillButton>
            <PillButton
              theme={theme}
              variant="ghost"
              onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact
            </PillButton>
          </div>
        </div>
      </header>

      {/* ======================================================
         HERO
      ====================================================== */}
      <section ref={heroRef} className={cx("px-5 md:px-6 py-14 md:py-20", tokens.heroBg)}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <div>
            {editMode ? (
              <>
                <FieldLabel theme={theme}>Headline</FieldLabel>
                <StableInput
                  theme={theme}
                  value={content.hero.headline}
                  onChangeValue={(v) =>
                    setContent((prev) => ({ ...prev, hero: { ...prev.hero, headline: v } }))
                  }
                  placeholder="Business name / headline"
                  className="text-lg md:text-xl font-semibold"
                />

                <div className="mt-4">
                  <FieldLabel theme={theme}>Subheadline</FieldLabel>
                  <StableTextarea
                    theme={theme}
                    value={content.hero.subheadline}
                    onChangeValue={(v) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, subheadline: v },
                      }))
                    }
                    placeholder="Clear promise / value proposition"
                    rows={4}
                  />
                </div>

                <div className="mt-5 grid sm:grid-cols-2 gap-3">
                  <div>
                    <FieldLabel theme={theme}>CTA button text</FieldLabel>
                    <StableInput
                      theme={theme}
                      value={content.hero.cta_text}
                      onChangeValue={(v) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, cta_text: v },
                        }))
                      }
                      placeholder="Get a free quote"
                    />
                  </div>
                  <div>
                    <FieldLabel theme={theme}>CTA link</FieldLabel>
                    <StableInput
                      theme={theme}
                      value={content.hero.cta_link}
                      onChangeValue={(v) =>
                        setContent((prev) => ({
                          ...prev,
                          hero: { ...prev.hero, cta_link: v },
                        }))
                      }
                      placeholder="#contact or https://..."
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto cursor-pointer">
                    <span
                      className={cx(
                        "inline-flex w-full sm:w-auto items-center justify-center px-5 py-2 rounded-full text-sm font-semibold border",
                        theme === "light"
                          ? "bg-black text-white border-black/20 hover:opacity-90"
                          : "bg-white text-black border-white/20 hover:opacity-90"
                      )}
                    >
                      {uploading ? "Uploading…" : "Upload hero image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadHeroImage(f);
                      }}
                    />
                  </label>

                  {content.hero.image && (
                    <PillButton theme={theme} variant="ghost" onClick={removeHeroImage}>
                      Remove image
                    </PillButton>
                  )}
                </div>

                <div className={cx("mt-6 text-xs", tokens.softText)}>
                  Tip: clean, bright images work best for this corporate style.
                </div>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {content.hero.headline || username}
                </h1>
                <p className={cx("mt-5 text-lg md:text-xl", tokens.mutedText)}>
                  {content.hero.subheadline}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={content.hero.cta_link || "#contact"}
                    className={cx(
                      "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border transition",
                      theme === "light"
                        ? "bg-black text-white border-black/20 hover:opacity-90"
                        : "bg-white text-black border-white/20 hover:opacity-90"
                    )}
                  >
                    {content.hero.cta_text || "Get started"}
                  </a>

                  <button
                    className={cx(
                      "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border transition",
                      theme === "light"
                        ? "bg-white text-black border-black/10 hover:bg-black/5"
                        : "bg-black/40 text-white border-white/10 hover:bg-white/5"
                    )}
                    onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
                  >
                    Contact us
                  </button>
                </div>
              </>
            )}

            {showTrust && (
              <div className="mt-10">
                <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                  {editMode ? "Trust metrics" : "Trusted by customers"}
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {content.trust.items.map((it, idx) => (
                    <div
                      key={idx}
                      className={cx(
                        "rounded-2xl border p-4",
                        theme === "light" ? "bg-white border-black/10" : "bg-black/40 border-white/10"
                      )}
                    >
                      {editMode ? (
                        <div className="space-y-2">
                          <StableInput
                            theme={theme}
                            value={it.value}
                            onChangeValue={(v) =>
                              setContent((prev) => {
                                const copy = structuredClone(prev);
                                copy.trust.items[idx].value = v;
                                return copy;
                              })
                            }
                            className="font-bold"
                            placeholder="200+"
                          />
                          <StableInput
                            theme={theme}
                            value={it.label}
                            onChangeValue={(v) =>
                              setContent((prev) => {
                                const copy = structuredClone(prev);
                                copy.trust.items[idx].label = v;
                                return copy;
                              })
                            }
                            className={cx(theme === "light" ? "text-black/70" : "text-white/70")}
                            placeholder="Clients served"
                          />
                          <div className="flex gap-2 pt-1">
                            <PillButton
                              theme={theme}
                              variant="ghost"
                              onClick={() => moveTrustItem(idx, -1)}
                              disabled={idx === 0}
                              className="px-3 py-1 text-xs"
                            >
                              ↑
                            </PillButton>
                            <PillButton
                              theme={theme}
                              variant="ghost"
                              onClick={() => moveTrustItem(idx, 1)}
                              disabled={idx === content.trust.items.length - 1}
                              className="px-3 py-1 text-xs"
                            >
                              ↓
                            </PillButton>
                            <PillButton
                              theme={theme}
                              variant="danger"
                              onClick={() => removeTrustItem(idx)}
                              className="px-3 py-1 text-xs"
                            >
                              Remove
                            </PillButton>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-2xl font-bold">{it.value}</div>
                          <div className={cx("text-sm mt-1", tokens.softText)}>{it.label}</div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="mt-4 flex items-center gap-3">
                    <PillButton theme={theme} variant="soft" onClick={addTrustItem}>
                      + Add metric
                    </PillButton>
                    <label className="inline-flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={content.trust.enabled}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            trust: { ...prev.trust, enabled: e.target.checked },
                          }))
                        }
                      />
                      <span className={tokens.softText}>Show trust section</span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Hero image */}
          <div>
            <div
              className={cx(
                "rounded-3xl border overflow-hidden",
                theme === "light" ? "border-black/10 bg-white" : "border-white/10 bg-black/40"
              )}
            >
              <div className="aspect-[4/3] w-full relative">
                {content.hero.image ? (
                  <img src={content.hero.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={cx("text-center px-10", tokens.softText)}>
                      <div className="font-semibold">Hero image</div>
                      <div className="text-xs mt-2">
                        {editMode ? "Upload an image to elevate the page" : "No image set"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className={cx("text-xs", tokens.softText)}>
                    Recommended: 1600px wide, clean & bright.
                  </div>
                  {content.hero.image && (
                    <PillButton theme={theme} variant="ghost" onClick={removeHeroImage}>
                      Remove
                    </PillButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
         ABOUT
      ====================================================== */}
      <section className="px-5 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div>
            {editMode ? (
              <>
                <FieldLabel theme={theme}>About section title</FieldLabel>
                <StableInput
                  theme={theme}
                  value={content.about.title}
                  onChangeValue={(v) =>
                    setContent((prev) => ({ ...prev, about: { ...prev.about, title: v } }))
                  }
                  placeholder="About us"
                  className="text-lg font-semibold"
                />

                <div className="mt-4">
                  <FieldLabel theme={theme}>About text</FieldLabel>
                  <StableTextarea
                    theme={theme}
                    value={content.about.text}
                    onChangeValue={(v) =>
                      setContent((prev) => ({ ...prev, about: { ...prev.about, text: v } }))
                    }
                    rows={9}
                    placeholder="Write a clear, trustworthy story..."
                  />
                  <div className={cx("mt-2 text-xs", tokens.softText)}>
                    Tip: 2–3 short paragraphs. Focus on results and trust.
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center">
                  <label className="w-full sm:w-auto cursor-pointer">
                    <span
                      className={cx(
                        "inline-flex w-full sm:w-auto items-center justify-center px-5 py-2 rounded-full text-sm font-semibold border",
                        theme === "light"
                          ? "bg-black text-white border-black/20 hover:opacity-90"
                          : "bg-white text-black border-white/20 hover:opacity-90"
                      )}
                    >
                      {uploading ? "Uploading…" : "Upload about image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadAboutImage(f);
                      }}
                    />
                  </label>

                  {content.about.image && (
                    <PillButton theme={theme} variant="ghost" onClick={removeAboutImage}>
                      Remove image
                    </PillButton>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                  {content.about.title}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                  A team customers can rely on
                </h2>
                <p className={cx("mt-5 whitespace-pre-line leading-relaxed", tokens.mutedText)}>
                  {content.about.text}
                </p>
              </>
            )}
          </div>

          <div>
            <div
              className={cx(
                "rounded-3xl border overflow-hidden",
                theme === "light" ? "border-black/10 bg-white" : "border-white/10 bg-black/40"
              )}
            >
              <div className="aspect-[4/3] w-full">
                {content.about.image ? (
                  <img src={content.about.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={cx("text-center px-10", tokens.softText)}>
                      <div className="font-semibold">About image</div>
                      <div className="text-xs mt-2">
                        {editMode ? "Upload a team/work photo" : "No image set"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {editMode && (
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className={cx("text-xs", tokens.softText)}>
                    Use a real photo to increase trust.
                  </div>
                  {content.about.image && (
                    <PillButton theme={theme} variant="ghost" onClick={removeAboutImage}>
                      Remove
                    </PillButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
         SERVICES
      ====================================================== */}
      <section className={cx("px-5 md:px-6 py-16 md:py-20", theme === "light" ? "bg-white" : "bg-black/30")}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              {editMode ? (
                <>
                  <FieldLabel theme={theme}>Services section title</FieldLabel>
                  <StableInput
                    theme={theme}
                    value={content.services.title}
                    onChangeValue={(v) =>
                      setContent((prev) => ({
                        ...prev,
                        services: { ...prev.services, title: v },
                      }))
                    }
                    className="text-lg font-semibold"
                    placeholder="Services"
                  />
                  <div className="mt-3">
                    <FieldLabel theme={theme}>Subtitle</FieldLabel>
                    <StableInput
                      theme={theme}
                      value={content.services.subtitle}
                      onChangeValue={(v) =>
                        setContent((prev) => ({
                          ...prev,
                          services: { ...prev.services, subtitle: v },
                        }))
                      }
                      placeholder="Short supporting line"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                    {content.services.title}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2">
                    Built for clarity and conversions
                  </h2>
                  <p className={cx("mt-4", tokens.mutedText)}>{content.services.subtitle}</p>
                </>
              )}
            </div>

            {editMode && (
              <PillButton theme={theme} variant="soft" onClick={addService} className="hidden sm:inline-flex">
                + Add service
              </PillButton>
            )}
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {content.services.items.map((it, idx) => (
              <Card theme={theme} key={idx} className="p-5">
                {editMode ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">Service {idx + 1}</div>
                      <div className="flex items-center gap-2">
                        <PillButton
                          theme={theme}
                          variant="ghost"
                          onClick={() => moveService(idx, -1)}
                          disabled={idx === 0}
                          className="px-3 py-1 text-xs"
                        >
                          ↑
                        </PillButton>
                        <PillButton
                          theme={theme}
                          variant="ghost"
                          onClick={() => moveService(idx, 1)}
                          disabled={idx === content.services.items.length - 1}
                          className="px-3 py-1 text-xs"
                        >
                          ↓
                        </PillButton>
                        <PillButton
                          theme={theme}
                          variant="danger"
                          onClick={() => removeService(idx)}
                          className="px-3 py-1 text-xs"
                        >
                          Remove
                        </PillButton>
                      </div>
                    </div>

                    <div className="mt-4">
                      <FieldLabel theme={theme}>Title</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={it.title}
                        onChangeValue={(v) =>
                          setContent((prev) => {
                            const copy = structuredClone(prev);
                            copy.services.items[idx].title = v;
                            return copy;
                          })
                        }
                        placeholder="Service title"
                        className="font-semibold"
                      />
                    </div>

                    <div className="mt-4">
                      <FieldLabel theme={theme}>Description</FieldLabel>
                      <StableTextarea
                        theme={theme}
                        value={it.description}
                        onChangeValue={(v) =>
                          setContent((prev) => {
                            const copy = structuredClone(prev);
                            copy.services.items[idx].description = v;
                            return copy;
                          })
                        }
                        placeholder="What does this include? Who is it for?"
                        rows={4}
                      />
                      <div className={cx("mt-2 text-xs", tokens.softText)}>
                        Tip: one short paragraph. Focus on outcomes, not features.
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div
                        className={cx(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border",
                          theme === "light"
                            ? "bg-black text-white border-black/20"
                            : "bg-white text-black border-white/20"
                        )}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-lg font-semibold">{it.title}</div>
                        <p className={cx("mt-2 text-sm leading-relaxed", tokens.mutedText)}>
                          {it.description}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>

          {editMode && (
            <div className="mt-6 sm:hidden">
              <button
                onClick={addService}
                className={cx(
                  "w-full px-4 py-3 rounded-2xl text-sm font-semibold border transition",
                  theme === "light"
                    ? "bg-black/5 hover:bg-black/10 border-black/10"
                    : "bg-white/5 hover:bg-white/10 border-white/10"
                )}
              >
                + Add service
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
         PROCESS
      ====================================================== */}
      <section className="px-5 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              {editMode ? (
                <>
                  <FieldLabel theme={theme}>Process section title</FieldLabel>
                  <StableInput
                    theme={theme}
                    value={content.process.title}
                    onChangeValue={(v) =>
                      setContent((prev) => ({
                        ...prev,
                        process: { ...prev.process, title: v },
                      }))
                    }
                    className="text-lg font-semibold"
                    placeholder="How it works"
                  />
                </>
              ) : (
                <>
                  <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                    {content.process.title}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2">
                    Simple, transparent, fast
                  </h2>
                </>
              )}
            </div>

            {editMode && (
              <PillButton theme={theme} variant="soft" onClick={addStep} className="hidden sm:inline-flex">
                + Add step
              </PillButton>
            )}
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {content.process.steps.map((it, idx) => (
              <Card theme={theme} key={idx} className="p-5">
                {editMode ? (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold">Step {idx + 1}</div>
                      <div className="flex items-center gap-2">
                        <PillButton
                          theme={theme}
                          variant="ghost"
                          onClick={() => moveStep(idx, -1)}
                          disabled={idx === 0}
                          className="px-3 py-1 text-xs"
                        >
                          ↑
                        </PillButton>
                        <PillButton
                          theme={theme}
                          variant="ghost"
                          onClick={() => moveStep(idx, 1)}
                          disabled={idx === content.process.steps.length - 1}
                          className="px-3 py-1 text-xs"
                        >
                          ↓
                        </PillButton>
                        <PillButton
                          theme={theme}
                          variant="danger"
                          onClick={() => removeStep(idx)}
                          className="px-3 py-1 text-xs"
                        >
                          Remove
                        </PillButton>
                      </div>
                    </div>

                    <div className="mt-4">
                      <FieldLabel theme={theme}>Title</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={it.title}
                        onChangeValue={(v) =>
                          setContent((prev) => {
                            const copy = structuredClone(prev);
                            copy.process.steps[idx].title = v;
                            return copy;
                          })
                        }
                        placeholder="Step title"
                        className="font-semibold"
                      />
                    </div>

                    <div className="mt-4">
                      <FieldLabel theme={theme}>Description</FieldLabel>
                      <StableTextarea
                        theme={theme}
                        value={it.description}
                        onChangeValue={(v) =>
                          setContent((prev) => {
                            const copy = structuredClone(prev);
                            copy.process.steps[idx].description = v;
                            return copy;
                          })
                        }
                        placeholder="Describe this step"
                        rows={4}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={cx(
                        "text-xs font-semibold inline-flex px-3 py-1 rounded-full border",
                        theme === "light"
                          ? "border-black/10 bg-black/5 text-black/70"
                          : "border-white/10 bg-white/5 text-white/70"
                      )}
                    >
                      Step {idx + 1}
                    </div>
                    <div className="mt-4 text-lg font-semibold">{it.title}</div>
                    <p className={cx("mt-3 text-sm leading-relaxed", tokens.mutedText)}>
                      {it.description}
                    </p>
                  </>
                )}
              </Card>
            ))}
          </div>

          {editMode && (
            <div className="mt-6 sm:hidden">
              <button
                onClick={addStep}
                className={cx(
                  "w-full px-4 py-3 rounded-2xl text-sm font-semibold border transition",
                  theme === "light"
                    ? "bg-black/5 hover:bg-black/10 border-black/10"
                    : "bg-white/5 hover:bg-white/10 border-white/10"
                )}
              >
                + Add step
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
         TESTIMONIAL
      ====================================================== */}
      {showTestimonial && (
        <section className={cx("px-5 md:px-6 py-16 md:py-20", theme === "light" ? "bg-white" : "bg-black/30")}>
          <div className="max-w-5xl mx-auto">
            <Card theme={theme} className="p-8 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  {editMode ? (
                    <>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">Testimonial</div>
                        <label className="inline-flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={content.testimonial.enabled}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                testimonial: { ...prev.testimonial, enabled: e.target.checked },
                              }))
                            }
                          />
                          <span className={tokens.softText}>Show section</span>
                        </label>
                      </div>

                      <div className="mt-4">
                        <FieldLabel theme={theme}>Quote</FieldLabel>
                        <StableTextarea
                          theme={theme}
                          value={content.testimonial.quote}
                          onChangeValue={(v) =>
                            setContent((prev) => ({
                              ...prev,
                              testimonial: { ...prev.testimonial, quote: v },
                            }))
                          }
                          rows={4}
                          placeholder="Customer quote"
                        />
                      </div>

                      <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        <div>
                          <FieldLabel theme={theme}>Name</FieldLabel>
                          <StableInput
                            theme={theme}
                            value={content.testimonial.name}
                            onChangeValue={(v) =>
                              setContent((prev) => ({
                                ...prev,
                                testimonial: { ...prev.testimonial, name: v },
                              }))
                            }
                            placeholder="Customer name"
                          />
                        </div>
                        <div>
                          <FieldLabel theme={theme}>Role</FieldLabel>
                          <StableInput
                            theme={theme}
                            value={content.testimonial.role}
                            onChangeValue={(v) =>
                              setContent((prev) => ({
                                ...prev,
                                testimonial: { ...prev.testimonial, role: v },
                              }))
                            }
                            placeholder="Customer role"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                        Testimonial
                      </div>
                      <div className="mt-4 text-2xl md:text-3xl font-bold leading-tight">
                        “{content.testimonial.quote}”
                      </div>
                      <div className={cx("mt-6 text-sm", tokens.mutedText)}>
                        — {content.testimonial.name}
                        {content.testimonial.role ? `, ${content.testimonial.role}` : ""}
                      </div>
                    </>
                  )}
                </div>

                {!editMode && (
                  <div
                    className={cx(
                      "hidden md:flex w-14 h-14 rounded-2xl items-center justify-center text-2xl border",
                      theme === "light"
                        ? "bg-black text-white border-black/20"
                        : "bg-white text-black border-white/20"
                    )}
                  >
                    “
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* ======================================================
         CONTACT
      ====================================================== */}
      <section ref={contactRef} id="contact" className="px-5 md:px-6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
            <div>
              {editMode ? (
                <>
                  <FieldLabel theme={theme}>Contact section title</FieldLabel>
                  <StableInput
                    theme={theme}
                    value={content.contact.title}
                    onChangeValue={(v) =>
                      setContent((prev) => ({ ...prev, contact: { ...prev.contact, title: v } }))
                    }
                    className="text-lg font-semibold"
                    placeholder="Contact"
                  />

                  <div className="mt-4">
                    <FieldLabel theme={theme}>Subtitle</FieldLabel>
                    <StableTextarea
                      theme={theme}
                      value={content.contact.subtitle}
                      onChangeValue={(v) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, subtitle: v },
                        }))
                      }
                      rows={3}
                      placeholder="Short supportive line"
                    />
                  </div>

                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    <div>
                      <FieldLabel theme={theme}>Phone</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={content.contact.phone}
                        onChangeValue={(v) =>
                          setContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phone: v },
                          }))
                        }
                        placeholder="+66 000 000 000"
                      />
                    </div>
                    <div>
                      <FieldLabel theme={theme}>Email</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={content.contact.email}
                        onChangeValue={(v) =>
                          setContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: v },
                          }))
                        }
                        placeholder="hello@yourbusiness.com"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <div>
                      <FieldLabel theme={theme}>Address</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={content.contact.address}
                        onChangeValue={(v) =>
                          setContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, address: v },
                          }))
                        }
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <FieldLabel theme={theme}>City</FieldLabel>
                      <StableInput
                        theme={theme}
                        value={content.contact.city}
                        onChangeValue={(v) =>
                          setContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, city: v },
                          }))
                        }
                        placeholder="Chiang Mai"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={cx("text-sm font-semibold", tokens.sectionTitle)}>
                    {content.contact.title}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mt-2">
                    Let’s talk
                  </h2>
                  <p className={cx("mt-4", tokens.mutedText)}>{content.contact.subtitle}</p>

                  <div className="mt-8 space-y-3">
                    {content.contact.phone && (
                      <div className={cx("text-sm", tokens.mutedText)}>
                        <span className={cx("font-semibold", tokens.sectionTitle)}>Phone:</span>{" "}
                        {content.contact.phone}
                      </div>
                    )}
                    {content.contact.email && (
                      <div className={cx("text-sm", tokens.mutedText)}>
                        <span className={cx("font-semibold", tokens.sectionTitle)}>Email:</span>{" "}
                        {content.contact.email}
                      </div>
                    )}
                    {(content.contact.address || content.contact.city) && (
                      <div className={cx("text-sm", tokens.mutedText)}>
                        <span className={cx("font-semibold", tokens.sectionTitle)}>Address:</span>{" "}
                        {content.contact.address}
                        {content.contact.city ? `, ${content.contact.city}` : ""}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={content.hero.cta_link || "#contact"}
                      className={cx(
                        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border transition",
                        theme === "light"
                          ? "bg-black text-white border-black/20 hover:opacity-90"
                          : "bg-white text-black border-white/20 hover:opacity-90"
                      )}
                    >
                      {content.hero.cta_text || "Get a free quote"}
                    </a>
                    <button
                      className={cx(
                        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold border transition",
                        theme === "light"
                          ? "bg-white text-black border-black/10 hover:bg-black/5"
                          : "bg-black/40 text-white border-white/10 hover:bg-white/5"
                      )}
                      onClick={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Back to top
                    </button>
                  </div>
                </>
              )}
            </div>

            <div>
              <Card theme={theme} className="p-6 md:p-7">
                <div className="text-sm font-semibold">Quick notes</div>
                <p className={cx("mt-3 text-sm leading-relaxed", tokens.mutedText)}>
                  This block can later become a real contact form (with email delivery),
                  calendar booking, or WhatsApp/Line buttons — without changing the template structure.
                </p>
                <Divider theme={theme} />
                <div className={cx("mt-4 text-xs", tokens.softText)}>
                  Right now, we keep it clean and reliable: editable contact details + CTA.
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
         FOOTER
      ====================================================== */}
      <footer
        className={cx(
          "border-t px-5 md:px-6 py-12 md:py-14",
          theme === "light" ? "border-black/10 bg-white" : "border-white/10 bg-black/40",
          editMode ? "pb-28 md:pb-14" : ""
        )}
      >
        <div className="max-w-5xl mx-auto">
          {editMode ? (
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="text-sm font-semibold">Footer</div>
                <div className={cx("text-xs mt-2", tokens.softText)}>
                  Keep this short. Example: copyright, short tagline, or legal note.
                </div>
              </div>
              <div>
                <FieldLabel theme={theme}>Footer note</FieldLabel>
                <StableInput
                  theme={theme}
                  value={content.footer.note}
                  onChangeValue={(v) =>
                    setContent((prev) => ({ ...prev, footer: { ...prev.footer, note: v } }))
                  }
                  placeholder="© 2026 Your Business. All rights reserved."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className={cx("text-sm", tokens.softText)}>{content.footer.note}</div>
              <div className={cx("text-xs", tokens.softText)}>
                Powered by AutopilotAI Website Builder
              </div>
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
