"use client";

import React, { useEffect, useMemo, useRef } from "react";
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

/* ======================================================
   AUTOSAVE
====================================================== */

function useAutosave(username: string, content: any, enabled: boolean) {
  const latest = useRef(content);

  useEffect(() => {
    latest.current = content;
  }, [content]);

  async function save(updated: any) {
    if (!enabled) return;

    try {
      await fetch(
        `https://autopilotai-api.onrender.com/api/restaurants/${username}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("autopilot_token")}`,
          },
          body: JSON.stringify(updated),
        }
      );
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
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  editMode: boolean;
}) {
  return (
    <div
      contentEditable={editMode}
      suppressContentEditableWarning
      onBlur={(e) => onSave(e.currentTarget.innerText)}
      className={cx(
        editMode && "outline outline-1 outline-dashed outline-indigo-400/40",
        className
      )}
    >
      {value}
    </div>
  );
}

/* ======================================================
   HERO
====================================================== */

function Hero({
  structure,
  content,
  onSave,
  editMode,
}: {
  structure: AIStructure;
  content: any;
  onSave: (c: any) => void;
  editMode: boolean;
}) {
  return (
    <section className="py-24 text-center">
      <EditableText
        value={content.hero?.headline || "Your Business Name"}
        editMode={editMode}
        className="text-5xl font-bold mb-4"
        onSave={(v) =>
          onSave({
            ...content,
            hero: { ...content.hero, headline: v },
          })
        }
      />

      <EditableText
        value={content.hero?.subheadline || "Short description of what you do"}
        editMode={editMode}
        className="text-lg opacity-80 mb-6"
        onSave={(v) =>
          onSave({
            ...content,
            hero: { ...content.hero, subheadline: v },
          })
        }
      />

      <button className="px-6 py-3 rounded bg-black text-white">
        Get started
      </button>
    </section>
  );
}

/* ======================================================
   SERVICES
====================================================== */

function Services({
  content,
  onSave,
  editMode,
}: {
  content: any;
  onSave: (c: any) => void;
  editMode: boolean;
}) {
  const services = Array.isArray(content.services)
    ? content.services
    : [];

  if (!services.length) return null;

  return (
    <section className="py-20 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Services</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s: any, i: number) => (
          <div key={i} className="p-6 border rounded">
            <EditableText
              value={s.title || "Service"}
              editMode={editMode}
              className="font-semibold mb-2"
              onSave={(v) => {
                const next = [...services];
                next[i] = { ...next[i], title: v };
                onSave({ ...content, services: next });
              }}
            />
            <EditableText
              value={s.description || "Describe your service here."}
              editMode={editMode}
              className="opacity-70"
              onSave={(v) => {
                const next = [...services];
                next[i] = { ...next[i], description: v };
                onSave({ ...content, services: next });
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ======================================================
   CTA
====================================================== */

function CTA({
  content,
  onSave,
  editMode,
}: {
  content: any;
  onSave: (c: any) => void;
  editMode: boolean;
}) {
  return (
    <section className="py-24 text-center">
      <EditableText
        value={content.cta?.headline || "Ready to take the next step?"}
        editMode={editMode}
        className="text-3xl font-bold mb-4"
        onSave={(v) =>
          onSave({
            ...content,
            cta: { ...content.cta, headline: v },
          })
        }
      />

      <button className="px-6 py-3 rounded bg-black text-white">
        Get started
      </button>
    </section>
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
  const save = useAutosave(username, content, editMode);

  function update(next: any) {
    save(next);
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {editMode && (
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded text-xs z-50">
          Edit mode (auto-save)
        </div>
      )}

      <Hero
        structure={structure}
        content={content}
        onSave={update}
        editMode={editMode}
      />

      <Services
        content={content}
        onSave={update}
        editMode={editMode}
      />

      <CTA
        content={content}
        onSave={update}
        editMode={editMode}
      />

      <footer className="py-10 text-center opacity-60">
        © {new Date().getFullYear()} {username}
      </footer>
    </main>
  );
}
