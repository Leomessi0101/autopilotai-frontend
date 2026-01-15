"use client";

import React, { useEffect, useState } from "react";
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

function getMissingFields(content: any) {
  const missing: string[] = [];

  if (!content?.contact?.phone) missing.push("phone number");
  if (!content?.contact?.email) missing.push("email address");
  if (!content?.location?.city && !content?.contact?.address)
    missing.push("address or city");

  return missing;
}

/* ======================================================
   AUTOSAVE
====================================================== */

function useAutosave(username: string, enabled: boolean) {
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
        editMode &&
          "outline outline-1 outline-dashed outline-indigo-400/40",
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
  content,
  onUpdate,
  editMode,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
}) {
  return (
    <section className="py-24 text-center">
      <EditableText
        value={content.hero?.headline || "Your Business Name"}
        editMode={editMode}
        className="text-5xl font-bold mb-4"
        onSave={(v) =>
          onUpdate({
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
          onUpdate({
            ...content,
            hero: { ...content.hero, subheadline: v },
          })
        }
      />

      <button className="px-6 py-3 rounded bg-black text-white">
        {content.hero?.cta_text || "Get started"}
      </button>
    </section>
  );
}

/* ======================================================
   SERVICES
====================================================== */

function Services({
  content,
  onUpdate,
  editMode,
}: {
  content: any;
  onUpdate: (c: any) => void;
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
                onUpdate({ ...content, services: next });
              }}
            />
            <EditableText
              value={s.description || "Describe your service here."}
              editMode={editMode}
              className="opacity-70"
              onSave={(v) => {
                const next = [...services];
                next[i] = { ...next[i], description: v };
                onUpdate({ ...content, services: next });
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
  onUpdate,
  editMode,
}: {
  content: any;
  onUpdate: (c: any) => void;
  editMode: boolean;
}) {
  return (
    <section className="py-24 text-center">
      <EditableText
        value={content.cta?.headline || "Ready to take the next step?"}
        editMode={editMode}
        className="text-3xl font-bold mb-4"
        onSave={(v) =>
          onUpdate({
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

/* ======================================================
   AI SUGGESTIONS PANEL
====================================================== */

function AISuggestions({
  todos,
}: {
  todos: string[];
}) {
  if (!Array.isArray(todos) || todos.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-[320px] rounded-2xl border border-black/10 bg-white shadow-xl p-4 z-50">
      <div className="mb-3 text-sm font-semibold text-gray-900">
        Suggestions
      </div>

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

    // Contact info
    if (text.includes("phone") || text.includes("email")) {
      return !(
        content?.contact?.phone ||
        content?.contact?.email
      );
    }

    // Address / city
    if (text.includes("address") || text.includes("city")) {
      return !(
        content?.contact?.address ||
        content?.location?.address ||
        content?.location?.city
      );
    }

    // Opening hours
    if (text.includes("hours")) {
      return !content?.hours;
    }

    // Menu items
    if (text.includes("menu")) {
      return !(
        Array.isArray(content?.menu) &&
        content.menu.length > 0
      );
    }

    // Default: keep todo
    return true;
  });
}


export default function AIWebsiteRenderer({
  username,
  structure,
  content,
  editMode,
}: Props) {
  const [localContent, setLocalContent] = useState<any>(content);
  const save = useAutosave(username, editMode);

  // keep in sync if backend content changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  function update(next: any) {
    setLocalContent(next);
    save(next);
  }

  const missingFields = getMissingFields(localContent);
  const showAIHint = editMode && missingFields.length > 0;

  return (
    <main className="min-h-screen bg-white text-black">
      {editMode && (
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded text-xs z-50">
          Edit mode (auto-save)
        </div>
      )}

      {showAIHint && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-xl border border-indigo-400/30 bg-indigo-50 text-indigo-900 px-5 py-4">
            <div className="font-semibold mb-1">AI suggestion</div>
            <div className="text-sm">
              To improve conversions, add your{" "}
              <span className="font-medium">
                {missingFields.join(", ")}
              </span>{" "}
              below.
            </div>
          </div>
        </div>
      )}

      <Hero
        content={localContent}
        onUpdate={update}
        editMode={editMode}
      />

      <Services
        content={localContent}
        onUpdate={update}
        editMode={editMode}
      />

      <CTA
        content={localContent}
        onUpdate={update}
        editMode={editMode}
      />

      <footer className="py-10 text-center opacity-60">
        © {new Date().getFullYear()} {username}
      </footer>
    
    {editMode && (
  <AISuggestions
   todos={filterTodos(localContent?.ai_todos || [], localContent)}
  />
)}
    </main>
  );
}
