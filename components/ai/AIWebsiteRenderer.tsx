"use client";

import React, { useMemo, useState, useEffect } from "react";
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

function str(v: any, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  const s = String(v);
  return s.trim().length ? s : fallback;
}

function asArray<T = any>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

/* ======================================================
   CONTENT NORMALIZATION
====================================================== */

function normalizeContent(raw: any, username: string) {
  const c = raw || {};

  return {
    hero: {
      headline:
        str(c?.hero?.headline) ||
        str(c?.hero_headline) ||
        username,
      subheadline:
        str(c?.hero?.subheadline) ||
        str(c?.hero_subheadline) ||
        "Describe what you do in one clear sentence.",
      cta_text:
        str(c?.hero?.cta_text) ||
        str(c?.cta_text) ||
        "Get started",
      cta_link:
        str(c?.hero?.cta_link) ||
        "#contact",
    },

    services: {
      title:
        str(c?.services?.title) ||
        "Our services",
      items:
        asArray(c?.services?.items).length > 0
          ? asArray(c?.services?.items)
          : asArray(c?.services),
    },

    cta: {
      headline:
        str(c?.cta?.headline) ||
        "Ready to take the next step?",
      text:
        str(c?.cta?.text) ||
        "",
    },
  };
}

/* ======================================================
   EDITABLE TEXT — INTENTIONALLY LOOSE TYPING (STABLE)
====================================================== */

function EditableText({
  value,
  onSave,
  editMode,
  tag = "div",
  className = "",
}: {
  value: string;
  onSave: (v: string) => void;
  editMode: boolean;
  tag?: any; // ✅ intentional — avoids JSX/TS edge cases
  className?: string;
}) {
  const [draft, setDraft] = useState(value);
  const Tag = tag;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  if (!editMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={cx(
        className,
        "outline-none cursor-text rounded px-1 -mx-1",
        "focus:ring-2 focus:ring-indigo-500/40"
      )}
      onInput={(e: any) =>
        setDraft(e.currentTarget.innerText)
      }
      onBlur={() => {
        const v = draft.trim();
        if (v && v !== value) {
          onSave(v);
        }
      }}
    >
      {draft}
    </Tag>
  );
}

/* ======================================================
   HERO
====================================================== */

function Hero({ c, editMode }: { c: any; editMode: boolean }) {
  return (
    <section className="pt-28 pb-20 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <EditableText
          tag="h1"
          value={c.hero.headline}
          editMode={editMode}
          onSave={(v) => (c.hero.headline = v)}
          className="text-4xl md:text-6xl font-semibold tracking-tight"
        />

        <EditableText
          tag="p"
          value={c.hero.subheadline}
          editMode={editMode}
          onSave={(v) => (c.hero.subheadline = v)}
          className="mt-5 text-lg md:text-xl text-white/70"
        />

        <div className="mt-8">
          <a
            href={c.hero.cta_link}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 text-white px-7 py-3.5 font-semibold hover:bg-indigo-400 transition"
          >
            {c.hero.cta_text}
            <span className="opacity-80">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   SERVICES
====================================================== */

function Services({ c, editMode }: { c: any; editMode: boolean }) {
  if (!c.services.items.length) return null;

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <EditableText
          tag="h2"
          value={c.services.title}
          editMode={editMode}
          onSave={(v) => (c.services.title = v)}
          className="text-3xl md:text-4xl font-semibold"
        />

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {c.services.items.map((s: any, i: number) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <EditableText
                tag="div"
                value={str(s.title, "Service")}
                editMode={editMode}
                onSave={(v) => (s.title = v)}
                className="text-lg font-semibold"
              />

              <EditableText
                tag="p"
                value={str(s.description, "Describe your service here.")}
                editMode={editMode}
                onSave={(v) => (s.description = v)}
                className="mt-2 text-sm text-white/65"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   CTA
====================================================== */

function CTA({ c, editMode }: { c: any; editMode: boolean }) {
  return (
    <section className="px-6 py-24 text-center">
      <div className="max-w-3xl mx-auto">
        <EditableText
          tag="h2"
          value={c.cta.headline}
          editMode={editMode}
          onSave={(v) => (c.cta.headline = v)}
          className="text-3xl md:text-4xl font-semibold"
        />

        <EditableText
          tag="p"
          value={c.cta.text}
          editMode={editMode}
          onSave={(v) => (c.cta.text = v)}
          className="mt-4 text-lg text-white/70"
        />

        <div className="mt-8">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 text-white px-7 py-3.5 font-semibold hover:bg-indigo-400 transition"
          >
            {c.hero.cta_text}
            <span className="opacity-80">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   FOOTER
====================================================== */

function Footer({ username }: { username: string }) {
  return (
    <footer className="px-6 py-12 text-center text-white/50 border-t border-white/10">
      © {new Date().getFullYear()} {username} • Powered by AutopilotAI
    </footer>
  );
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
  const c = useMemo(
    () => normalizeContent(content, username),
    [content, username]
  );

  return (
    <main className="min-h-screen bg-[#05070d] text-white relative">
      {editMode && (
        <div className="fixed top-4 right-4 z-50 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold backdrop-blur">
          Edit mode
        </div>
      )}

      <Hero c={c} editMode={editMode} />

      {structure.sections.includes("services") && (
        <Services c={c} editMode={editMode} />
      )}

      {structure.sections.includes("cta") && (
        <CTA c={c} editMode={editMode} />
      )}

      <Footer username={username} />
    </main>
  );
}
