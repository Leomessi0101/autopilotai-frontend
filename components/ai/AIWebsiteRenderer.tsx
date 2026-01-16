"use client";

import React, { useEffect, useMemo, useState } from "react";
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

function safeStr(v: any, fallback: string) {
  const s = typeof v === "string" ? v : "";
  return s.trim() ? s : fallback;
}

function getMissingFields(content: any) {
  const missing: string[] = [];
  if (!content?.contact?.phone) missing.push("phone number");
  if (!content?.contact?.email) missing.push("email address");
  if (!content?.contact?.address && !content?.location?.city)
    missing.push("address or city");
  return missing;
}

function normalizeServices(content: any): Array<{ title: string; description: string }> {
  // supports BOTH shapes:
  // A) content.services = [{title, description}]
  // B) content.services = { title: "", items: [{title, description}] }
  const a = Array.isArray(content?.services) ? content.services : null;
  if (a && a.length) {
    return a.map((x: any) => ({
      title: safeStr(x?.title, "Service"),
      description: safeStr(x?.description, "Short description of this service."),
    }));
  }

  const b = Array.isArray(content?.services?.items) ? content.services.items : null;
  if (b && b.length) {
    return b.map((x: any) => ({
      title: safeStr(x?.title, "Service"),
      description: safeStr(x?.description, "Short description of this service."),
    }));
  }

  // if intent services were provided as strings (rare), support it:
  const c = Array.isArray(content?.intent?.services) ? content.intent.services : null;
  if (c && c.length) {
    return c.slice(0, 6).map((t: any) => ({
      title: safeStr(t, "Service"),
      description: "Delivered with care and expertise.",
    }));
  }

  return [];
}

/* ======================================================
   AUTOSAVE
====================================================== */

function getApiBase() {
  // Prefer a configured public env var (recommended):
  // NEXT_PUBLIC_API_BASE_URL=https://autopilotai-api.onrender.com
  // Fallback to your existing hardcoded URL to avoid breaking existing deployments.
  return (
    (process.env.NEXT_PUBLIC_API_BASE_URL || "").trim() ||
    "https://autopilotai-api.onrender.com"
  );
}

function useAutosave(username: string, enabled: boolean) {
  async function save(updated: any) {
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
      // silent fail (intentional)
    }
  }

  return save;
}

/* ======================================================
   EDITABLE TEXT
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
        editMode && "outline outline-1 outline-dashed outline-indigo-400/40 rounded-md px-1",
        !display && editMode && "opacity-70",
        className
      )}
    >
      {display}
    </div>
  );
}

/* ======================================================
   THEME
====================================================== */

function useThemeClasses(structure: AIStructure) {
  const palette = structure?.theme?.palette || "light";
  const accent = structure?.theme?.accent || "indigo";

  const accentMap: Record<string, { bg: string; text: string; ring: string }> = {
    indigo: { bg: "bg-indigo-600 hover:bg-indigo-500", text: "text-indigo-600", ring: "ring-indigo-500/30" },
    emerald: { bg: "bg-emerald-600 hover:bg-emerald-500", text: "text-emerald-600", ring: "ring-emerald-500/30" },
    orange: { bg: "bg-orange-500 hover:bg-orange-400", text: "text-orange-500", ring: "ring-orange-500/30" },
    neutral: { bg: "bg-black hover:bg-black/90", text: "text-black", ring: "ring-black/20" },
  };

  const a = accentMap[accent] || accentMap.indigo;

  if (palette === "dark") {
    return {
      page: "bg-[#05070d] text-white",
      card: "bg-white/5 border-white/10",
      subtle: "text-white/70",
      heading: "text-white",
      button: `${a.bg} text-white`,
      accentText: "text-indigo-300",
      ring: `ring-1 ${a.ring}`,
      surface: "bg-black/30 border-white/10",
      outline: "border-white/10",
    };
  }

  return {
    page: "bg-white text-black",
    card: "bg-white border-black/10",
    subtle: "text-black/60",
    heading: "text-black",
    button: `${a.bg} text-white`,
    accentText: a.text,
    ring: `ring-1 ${a.ring}`,
    surface: "bg-black/5 border-black/10",
    outline: "border-black/10",
  };
}

/* ======================================================
   HERO
====================================================== */

function Hero({
  structure,
  content,
  onUpdate,
  editMode,
  theme,
}: {
  structure: AIStructure;
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const variant = structure?.hero?.variant || "centered_text";

  const headline = safeStr(content?.hero?.headline, "Your Business Name");
  const subheadline = safeStr(content?.hero?.subheadline, "Short description of what you do.");
  const ctaText =
    safeStr(content?.hero?.cta_text, "") ||
    safeStr(content?.hero?.cta, "") ||
    safeStr(content?.cta?.button, "") ||
    safeStr(content?.primary_goal, "") ||
    "Get started";

  // Optional assets from /public
  const hasVideo = true; // we can’t detect reliably in-browser; if missing it just won’t load
  const hasImage = true;

  const HeroInner = (
    <div className="relative z-10 max-w-5xl mx-auto px-6">
      <EditableText
        value={headline}
        placeholder="Business name"
        editMode={editMode}
        className={cx("text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]")}
        onSave={(v) => onUpdate({ ...content, hero: { ...content.hero, headline: v } })}
      />
      <EditableText
        value={subheadline}
        placeholder="Short description of what you do"
        editMode={editMode}
        className={cx("mt-5 text-lg md:text-xl", theme.subtle)}
        onSave={(v) => onUpdate({ ...content, hero: { ...content.hero, subheadline: v } })}
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button className={cx("px-6 py-3 rounded-xl font-semibold transition", theme.button)}>
          {ctaText}
        </button>
        <div className={cx("px-6 py-3 rounded-xl border text-sm flex items-center justify-center", theme.outline, theme.surface, theme.subtle)}>
          Edit anytime • Autosave
        </div>
      </div>
    </div>
  );

  if (variant === "image_background") {
    return (
      <section className="relative overflow-hidden py-24 md:py-28 text-center">
        <div className="absolute inset-0">
          {/* Background video (optional) */}
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/hero-loop.mp4" type="video/mp4" />
          </video>

          {/* Background image fallback (optional) */}
          <div
            className="absolute inset-0 opacity-35 bg-center bg-cover"
            style={{ backgroundImage: `url(/hero-bg.jpg)` }}
          />

          {/* Overlay */}
          <div className={cx("absolute inset-0", theme.page.startsWith("bg-[#") ? "bg-black/60" : "bg-white/70")} />
          <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        {HeroInner}
      </section>
    );
  }

  if (variant === "split_image") {
    return (
      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            {HeroInner}
          </div>
          <div className={cx("relative rounded-3xl overflow-hidden border", theme.outline, theme.surface)}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-transparent" />
            <div className="aspect-[4/3]">
              <video
                className="w-full h-full object-cover opacity-70"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/hero-loop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <section className="py-20 md:py-24 text-center">
        {HeroInner}
      </section>
    );
  }

  // centered_text default
  return (
    <section className="relative py-20 md:py-24 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[760px] h-[760px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_20%_20%,black,transparent_35%),radial-gradient(circle_at_80%_30%,black,transparent_30%)]" />
      </div>
      {HeroInner}
    </section>
  );
}

/* ======================================================
   SECTIONS
====================================================== */

function SectionShell({
  title,
  children,
  theme,
}: {
  title?: string;
  children: React.ReactNode;
  theme: ReturnType<typeof useThemeClasses>;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {title ? (
          <h2 className={cx("text-3xl md:text-4xl font-semibold text-center", theme.heading)}>
            {title}
          </h2>
        ) : null}
        <div className={cx(title ? "mt-10" : "")}>{children}</div>
      </div>
    </section>
  );
}

function AboutSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const paragraphs: string[] = Array.isArray(content?.about?.paragraphs)
    ? content.about.paragraphs
    : [];

  const fallback = [
    "We help customers get real results with clear communication and reliable service.",
    "Our focus is quality, speed, and a great experience from the first click to the final outcome.",
  ];

  const displayParas = paragraphs.length ? paragraphs : fallback;

  return (
    <SectionShell title="About" theme={theme}>
      <div className={cx("max-w-3xl mx-auto space-y-5 text-lg", theme.subtle)}>
        {displayParas.map((p, idx) => (
          <EditableText
            key={idx}
            value={p}
            editMode={editMode}
            className="leading-relaxed"
            onSave={(v) => {
              const next = [...displayParas];
              next[idx] = v;
              onUpdate({ ...content, about: { ...content.about, paragraphs: next } });
            }}
          />
        ))}
      </div>
    </SectionShell>
  );
}

function ServicesSection({
  content,
  onUpdate,
  editMode,
  theme,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const services = normalizeServices(content);
  if (!services.length) return null;

  const title =
    safeStr(content?.services?.title, "") ||
    (Array.isArray(content?.services) ? "Services" : "Services");

  return (
    <SectionShell title={title} theme={theme}>
      <div className="grid md:grid-cols-3 gap-6">
        {services.slice(0, 9).map((s, i) => (
          <div
            key={i}
            className={cx(
              "p-6 rounded-2xl border shadow-sm",
              theme.outline,
              theme.surface
            )}
          >
            <EditableText
              value={s.title}
              editMode={editMode}
              className={cx("font-semibold text-lg", theme.heading)}
              onSave={(v) => {
                // Write back to whichever schema exists
                if (Array.isArray(content?.services)) {
                  const next = [...content.services];
                  next[i] = { ...next[i], title: v };
                  onUpdate({ ...content, services: next });
                  return;
                }

                const items = Array.isArray(content?.services?.items) ? [...content.services.items] : [];
                items[i] = { ...(items[i] || {}), title: v };
                onUpdate({ ...content, services: { ...(content.services || {}), title, items } });
              }}
            />

            <EditableText
              value={s.description}
              editMode={editMode}
              className={cx("mt-2", theme.subtle)}
              onSave={(v) => {
                if (Array.isArray(content?.services)) {
                  const next = [...content.services];
                  next[i] = { ...next[i], description: v };
                  onUpdate({ ...content, services: next });
                  return;
                }

                const items = Array.isArray(content?.services?.items) ? [...content.services.items] : [];
                items[i] = { ...(items[i] || {}), description: v };
                onUpdate({ ...content, services: { ...(content.services || {}), title, items } });
              }}
            />
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const items: string[] = Array.isArray(content?.trust?.items) ? content.trust.items : [
    "Fast response time",
    "Clear pricing",
    "Trusted quality",
  ];

  return (
    <SectionShell title="Why choose us" theme={theme}>
      <div className="grid md:grid-cols-3 gap-6">
        {items.slice(0, 6).map((t, i) => (
          <div key={i} className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
            <EditableText
              value={t}
              editMode={editMode}
              className={cx("font-semibold", theme.heading)}
              onSave={(v) => {
                const next = [...items];
                next[i] = v;
                onUpdate({ ...content, trust: { ...(content.trust || {}), items: next } });
              }}
            />
          </div>
        ))}
      </div>
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const steps: Array<{ title: string; description: string }> = Array.isArray(content?.process?.steps)
    ? content.process.steps
    : [
        { title: "Reach out", description: "Tell us what you need in a short message." },
        { title: "Get a plan", description: "We respond with a clear next step." },
        { title: "Get results", description: "We deliver quickly and keep it simple." },
      ];

  return (
    <SectionShell title="How it works" theme={theme}>
      <div className="grid md:grid-cols-3 gap-6">
        {steps.slice(0, 6).map((s, i) => (
          <div key={i} className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
            <EditableText
              value={safeStr(s?.title, "Step")}
              editMode={editMode}
              className={cx("font-semibold text-lg", theme.heading)}
              onSave={(v) => {
                const next = [...steps];
                next[i] = { ...next[i], title: v };
                onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
              }}
            />
            <EditableText
              value={safeStr(s?.description, "Description")}
              editMode={editMode}
              className={cx("mt-2", theme.subtle)}
              onSave={(v) => {
                const next = [...steps];
                next[i] = { ...next[i], description: v };
                onUpdate({ ...content, process: { ...(content.process || {}), steps: next } });
              }}
            />
          </div>
        ))}
      </div>
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const quote = safeStr(content?.testimonial?.quote, "“Professional, fast, and easy to work with.”");
  const author = safeStr(content?.testimonial?.author, "Happy customer");

  return (
    <SectionShell title="What customers say" theme={theme}>
      <div className={cx("max-w-3xl mx-auto p-8 rounded-3xl border", theme.outline, theme.surface)}>
        <EditableText
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const faqs: Array<{ q: string; a: string }> = Array.isArray(content?.faq?.items)
    ? content.faq.items
    : [
        { q: "How fast can I get started?", a: "Usually the same day. Send a message and we’ll take it from there." },
        { q: "Do you offer flexible options?", a: "Yes — we tailor solutions to what you actually need." },
        { q: "Can I make changes later?", a: "Absolutely. You can update details anytime." },
      ];

  return (
    <SectionShell title="FAQ" theme={theme}>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.slice(0, 8).map((f, i) => (
          <div key={i} className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
            <EditableText
              value={safeStr(f?.q, "Question")}
              editMode={editMode}
              className={cx("font-semibold text-lg", theme.heading)}
              onSave={(v) => {
                const next = [...faqs];
                next[i] = { ...next[i], q: v };
                onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
              }}
            />
            <EditableText
              value={safeStr(f?.a, "Answer")}
              editMode={editMode}
              className={cx("mt-2", theme.subtle)}
              onSave={(v) => {
                const next = [...faqs];
                next[i] = { ...next[i], a: v };
                onUpdate({ ...content, faq: { ...(content.faq || {}), items: next } });
              }}
            />
          </div>
        ))}
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  const headline = safeStr(content?.cta?.headline, "Ready to take the next step?");
  const subheadline = safeStr(content?.cta?.subheadline, "Send a message and we’ll respond quickly.");
  const button = safeStr(content?.cta?.button, safeStr(content?.hero?.cta_text, "Get started"));

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className={cx("rounded-3xl border p-10 md:p-12 text-center", theme.outline, theme.surface)}>
          <EditableText
            value={headline}
            editMode={editMode}
            className={cx("text-3xl md:text-4xl font-semibold", theme.heading)}
            onSave={(v) => onUpdate({ ...content, cta: { ...(content.cta || {}), headline: v } })}
          />
          <EditableText
            value={subheadline}
            editMode={editMode}
            className={cx("mt-4 text-lg", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, cta: { ...(content.cta || {}), subheadline: v } })}
          />
          <div className="mt-8 flex justify-center">
            <button className={cx("px-7 py-3 rounded-xl font-semibold transition", theme.button)}>
              {button}
            </button>
          </div>
        </div>
      </div>
    </section>
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
  theme: ReturnType<typeof useThemeClasses>;
}) {
  // This is intentionally left as the “only remaining part” for the user to fill.
  const phone = safeStr(content?.contact?.phone, "");
  const email = safeStr(content?.contact?.email, "");
  const address = safeStr(content?.contact?.address, safeStr(content?.location?.city, ""));

  return (
    <SectionShell title="Contact" theme={theme}>
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        <div className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Phone</div>
          <EditableText
            value={phone}
            placeholder={editMode ? "Add phone number" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, contact: { ...(content.contact || {}), phone: v } })}
          />
        </div>

        <div className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Email</div>
          <EditableText
            value={email}
            placeholder={editMode ? "Add email address" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, contact: { ...(content.contact || {}), email: v } })}
          />
        </div>

        <div className={cx("p-6 rounded-2xl border", theme.outline, theme.surface)}>
          <div className={cx("text-sm font-semibold", theme.heading)}>Address</div>
          <EditableText
            value={address}
            placeholder={editMode ? "Add address or city" : ""}
            editMode={editMode}
            className={cx("mt-2", theme.subtle)}
            onSave={(v) => onUpdate({ ...content, contact: { ...(content.contact || {}), address: v }, location: { ...(content.location || {}), city: v } })}
          />
        </div>
      </div>
    </SectionShell>
  );
}

/* ======================================================
   AI SUGGESTIONS PANEL
====================================================== */

function AISuggestions({ todos }: { todos: string[] }) {
  if (!Array.isArray(todos) || todos.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[320px] rounded-2xl border border-black/10 bg-white shadow-xl p-4 z-50">
      <div className="mb-3 text-sm font-semibold text-gray-900">Suggestions</div>

      <ul className="space-y-2 text-sm text-gray-700">
        {todos.map((t, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[2px] h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ======================================================
   AI TODO FILTERING (SMART)
====================================================== */

function filterTodos(todos: string[], content: any): string[] {
  if (!Array.isArray(todos)) return [];

  return todos.filter((t) => {
    const text = t.toLowerCase();

    if (text.includes("phone") || text.includes("email")) {
      return !(content?.contact?.phone || content?.contact?.email);
    }

    if (text.includes("address") || text.includes("city")) {
      return !(content?.contact?.address || content?.location?.city);
    }

    if (text.includes("hours")) {
      return !content?.hours;
    }

    if (text.includes("menu")) {
      return !(Array.isArray(content?.menu) && content.menu.length > 0);
    }

    return true;
  });
}

/* ======================================================
   MAIN
====================================================== */

export default function AIWebsiteRenderer({
  username,
  structure,
  content,
  editMode,
}: Props) {
  const theme = useThemeClasses(structure);

  const [localContent, setLocalContent] = useState<any>(content || {});
  const save = useAutosave(username, editMode);

  // keep in sync if backend content changes
  useEffect(() => {
    setLocalContent(content || {});
  }, [content]);

  function update(next: any) {
    setLocalContent(next);
    save(next);
  }

  const missingFields = getMissingFields(localContent);
  const showAIHint = editMode && missingFields.length > 0;

  const sections = useMemo(() => {
  const base = Array.isArray(structure?.sections)
    ? (structure.sections as string[])
    : [];

  // Always append contact as a renderer-only section
  if (base.includes("contact")) return base;

  return [...base, "contact"];
}, [structure]);


  return (
    <main className={cx("min-h-screen", theme.page)}>
      {/* top edit badge */}
      {editMode && (
        <div className="fixed top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs z-50 shadow">
          Edit mode (auto-save)
        </div>
      )}

      {/* missing contact info hint */}
      {showAIHint && (
        <div className="max-w-5xl mx-auto mt-6 px-6">
          <div className={cx("rounded-2xl border px-5 py-4", theme.outline, theme.surface)}>
            <div className={cx("font-semibold mb-1", theme.heading)}>Finish your contact info</div>
            <div className={cx("text-sm", theme.subtle)}>
              To improve conversions, add your{" "}
              <span className={cx("font-semibold", theme.heading)}>{missingFields.join(", ")}</span>.
            </div>
          </div>
        </div>
      )}

      {/* HERO always renders */}
      <Hero structure={structure} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />

      {/* Render sections driven by AI structure */}
      {sections.map((key, idx) => {
        if (key === "about") {
          return <AboutSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "services") {
          return <ServicesSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "trust") {
          return <TrustSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "process") {
          return <ProcessSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "testimonial") {
          return <TestimonialSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "faq") {
          return <FAQSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "cta") {
          return <CTASection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        if (key === "contact") {
          return <ContactSection key={`${key}-${idx}`} content={localContent} onUpdate={update} editMode={editMode} theme={theme} />;
        }
        // Unknown keys: ignore safely
        return null;
      })}

      {/* Footer */}
      <footer className={cx("py-10 text-center text-sm", theme.subtle)}>
        © {new Date().getFullYear()} {safeStr(localContent?.business_name, username)}
      </footer>

      {/* Suggestions */}
      {editMode && (
        <AISuggestions todos={filterTodos(localContent?.ai_todos || [], localContent)} />
      )}
    </main>
  );
}
