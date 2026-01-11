"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TEMPLATE_VERSION = 1;

/* ======================================================
   TYPES
====================================================== */

type MenuItem = {
  name: string;
  description: string;
  price: string;
  image?: string;
};

type MenuCategory = {
  title: string;
  items: MenuItem[];
};

type ContentState = {
  hero: {
    headline: string;
    subheadline: string;
    image: string | null;
  };
  menu: MenuCategory[];
  contact: {
    phone: string;
    email: string;
  };
  location: {
    address: string;
    city: string;
  };
  hours: {
    mon_fri: string;
    sat_sun: string;
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

function normalizeContent(raw: any, username: string): ContentState {
  // CRITICAL: this prevents client-side crashes from missing fields in older content_json
  const safe: ContentState = {
    ...raw,
    hero: {
      headline: str(raw?.hero?.headline || username),
      subheadline: str(raw?.hero?.subheadline || ""),
      image: raw?.hero?.image || null,
    },
    menu: Array.isArray(raw?.menu) ? raw.menu : [],
    contact: {
      phone: str(raw?.contact?.phone || ""),
      email: str(raw?.contact?.email || ""),
    },
    location: {
      address: str(raw?.location?.address || ""),
      city: str(raw?.location?.city || ""),
    },
    hours: {
      mon_fri: str(raw?.hours?.mon_fri || "11:00 – 22:00"),
      sat_sun: str(raw?.hours?.sat_sun || "12:00 – 23:00"),
    },
  };
  return safe;
}

function emptyItem(): MenuItem {
  return { name: "New item", description: "", price: "" };
}

function emptyCategory(): MenuCategory {
  return { title: "New category", items: [emptyItem()] };
}

/**
 * Deterministic stringify for dirty-check snapshots.
 * - Sorts object keys
 * - Preserves array order
 * This avoids false “dirty” signals due to key ordering.
 */
function stableStringify(value: any): string {
  const seen = new WeakSet();

  const stringifyInner = (v: any): any => {
    if (v === null || typeof v !== "object") return v;

    if (seen.has(v)) return null; // avoid circular crashes (should not happen here)
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
    // Fallback: never block UI if something unexpected happens
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}

/* ======================================================
   STABLE (BUFFERED) INPUTS – FIXES THE “ONE LETTER THEN CLICK” BUG
   These keep local typing state so React doesn't lose focus from big tree updates.
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

  // Sync local when external value changes (e.g. load/save/reset)
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
   UI PRIMITIVES
====================================================== */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-wide text-white/45 mb-2">
      {children}
    </div>
  );
}

function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        className
      )}
    />
  );
}

function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none resize-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        className
      )}
    />
  );
}

function StableInput({
  className,
  value,
  onChangeValue,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  value: string;
  onChangeValue: (v: string) => void;
}) {
  return (
    <StableInputBase
      {...props}
      value={value}
      onChangeValue={onChangeValue}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        className
      )}
    />
  );
}

function StableTextarea({
  className,
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
  return (
    <StableTextareaBase
      {...props}
      value={value}
      onChangeValue={onChangeValue}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none resize-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        className
      )}
    />
  );
}

function PillButton({
  children,
  onClick,
  disabled,
  variant = "soft",
  className,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "soft" | "danger" | "ghost";
  className?: string;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";
  const styles =
    variant === "primary"
      ? "bg-[#e4b363] text-black hover:brightness-110 disabled:opacity-60"
      : variant === "danger"
      ? "border border-red-500/25 bg-red-500/10 text-red-200 hover:bg-red-500/15 disabled:opacity-60"
      : variant === "ghost"
      ? "border border-white/10 bg-transparent text-white/70 hover:bg-white/5 disabled:opacity-60"
      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-60";

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={disabled}
      className={cx(base, styles, className)}
    >
      {children}
    </button>
  );
}

/* ======================================================
   COMPONENT
====================================================== */

export default function RestaurantTemplate({
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

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<null | { type: "ok" | "err"; msg: string }>(
    null
  );

  const menuRef = useRef<HTMLDivElement | null>(null);

  const hasMenu = useMemo(() => content.menu.length > 0, [content.menu.length]);

  /* ======================================================
     DIRTY STATE + TAB CLOSE PROTECTION (IMPORTANT)
     - Only active in editMode
     - Dirty = content differs from lastSavedSnapshot
     - beforeunload guard prevents accidental refresh/close
  ====================================================== */

  // Snapshot of the last saved content (server-aligned fields only)
  const lastSavedSnapshotRef = useRef<string>("");

  // We keep this state so UI can reflect it (and beforeunload can depend on it)
  const [isDirty, setIsDirty] = useState(false);

  // Defines exactly what we consider “saved”
  const buildSavePayload = (c: ContentState) => ({
    template_version: TEMPLATE_VERSION,
    menu: c.menu,
    hero: c.hero,
    contact: c.contact,
    location: c.location,
    hours: c.hours,
  });

  // Set initial snapshot on mount + whenever username changes (new site)
  useEffect(() => {
    const normalized = normalizeContent(initialContent, username);
    // Ensure state stays normalized if parent passed different content_json later
    setContent(normalized);

    const initialSnap = stableStringify(buildSavePayload(normalized));
    lastSavedSnapshotRef.current = initialSnap;
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]); // intentional: treat username as “site identity”

  // If initialContent changes for same username (rare, but possible), resync safely.
  // This prevents weirdness if gatekeeper refetches and passes updated content.
  useEffect(() => {
    const normalized = normalizeContent(initialContent, username);
    setContent(normalized);

    const initialSnap = stableStringify(buildSavePayload(normalized));
    lastSavedSnapshotRef.current = initialSnap;
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  // Compute dirty whenever content changes (only in editMode)
  useEffect(() => {
    if (!editMode) {
      setIsDirty(false);
      return;
    }
    const currentSnap = stableStringify(buildSavePayload(content));
    setIsDirty(currentSnap !== lastSavedSnapshotRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editMode]);

  // Tab close / refresh protection
  useEffect(() => {
    if (!editMode) return;

    const handler = (e: BeforeUnloadEvent) => {
      // Don't block if saving/uploading OR not dirty
      if (!isDirty) return;
      if (saving || uploading) return;

      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editMode, isDirty, saving, uploading]);

  /* ======================================================
     AUTOSAVE (DEBOUNCED) – SAFE + SIMPLE
     - Only runs in editMode
     - Only runs when dirty
     - Skips while uploading
     - Skips if already saving
  ====================================================== */

  const autosaveTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editMode) return;
    if (!isDirty) return;
    if (uploading) return; // avoid racing payload while image upload is mid-flight
    if (saving) return;

    // Debounce autosave
    if (autosaveTimerRef.current) {
      window.clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = window.setTimeout(() => {
      // Use a silent save: no “Saved” toast, but still updates snapshot on success
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
      setTimeout(() => setToast(null), 2000);
    } finally {
      setUploading(false);
    }
  }

  async function uploadMenuItemImage(file: File, cIdx: number, iIdx: number) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setContent((prev) => {
        const copy = structuredClone(prev);
        copy.menu[cIdx].items[iIdx].image = url;
        return copy;
      });
    } catch {
      setToast({ type: "err", msg: "Image upload failed" });
      setTimeout(() => setToast(null), 2000);
    } finally {
      setUploading(false);
    }
  }

  function removeMenuItemImage(cIdx: number, iIdx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      delete copy.menu[cIdx].items[iIdx].image;
      return copy;
    });
  }

  function removeHeroImage() {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, image: null } }));
  }

  /* ======================================================
     MENU EDIT HELPERS
  ====================================================== */

  function addCategory() {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu.push(emptyCategory());
      return copy;
    });
    setTimeout(() => menuRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }

  function removeCategory(cIdx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu.splice(cIdx, 1);
      return copy;
    });
  }

  function addItem(cIdx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu[cIdx].items.push(emptyItem());
      return copy;
    });
  }

  function removeItem(cIdx: number, iIdx: number) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu[cIdx].items.splice(iIdx, 1);
      return copy;
    });
  }

  /* ======================================================
     SAVE
  ====================================================== */

  async function saveAll(opts?: { silent?: boolean }) {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      if (!opts?.silent) {
        setToast({ type: "err", msg: "Not logged in" });
        setTimeout(() => setToast(null), 2000);
      }
      return;
    }

    // If nothing changed, don't spam backend
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
      const res = await fetch(
        `https://autopilotai-api.onrender.com/api/restaurants/${username}/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Save failed");

      // Update “last saved” snapshot on success
      lastSavedSnapshotRef.current = snap;
      setIsDirty(false);

      if (!opts?.silent) {
        setToast({ type: "ok", msg: "Saved" });
        setTimeout(() => setToast(null), 2000);
      }
    } catch {
      if (!opts?.silent) {
        setToast({ type: "err", msg: "Save failed" });
        setTimeout(() => setToast(null), 2500);
      } else {
        // Silent failures should still surface gently (optional):
        // We keep it minimal to avoid annoying spam.
        // If you want, we can add a tiny “Autosave failed” badge later.
      }
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Top progress */}
      {(saving || uploading) && (
        <div className="fixed inset-x-0 top-0 z-[80] h-1 bg-[#e4b363]/20">
          <div className="h-full w-1/2 bg-[#e4b363] animate-pulse" />
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90]">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold border shadow-lg shadow-black/30",
              toast.type === "ok"
                ? "bg-[#e4b363] text-black border-[#e4b363]/30"
                : "bg-red-500/15 text-red-100 border-red-500/25"
            )}
          >
            {toast.msg}
          </div>
        </div>
      )}

      {/* Desktop edit bar */}
      {editMode && (
        <div className="fixed top-4 right-4 z-[85] hidden md:flex gap-3 items-center">
          {/* Unsaved badge (subtle, but super useful) */}
          <div
            className={cx(
              "px-3 py-2 rounded-full text-xs font-semibold border shadow-lg shadow-black/30",
              isDirty
                ? "bg-white/5 text-white/80 border-white/15"
                : "bg-white/5 text-white/50 border-white/10"
            )}
            title={
              isDirty
                ? "You have unsaved changes (autosave will run). Closing the tab will warn you."
                : "All changes saved"
            }
          >
            {isDirty ? "Unsaved changes" : "All saved"}
          </div>

          <PillButton
            variant="primary"
            onClick={() => saveAll({ silent: false })}
            disabled={saving || uploading || !isDirty}
          >
            {saving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
          </PillButton>

          <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold border border-[#e4b363]/30 shadow-lg shadow-black/30">
            Edit mode
          </div>
        </div>
      )}

      {/* Mobile sticky save bar */}
      {editMode && (
        <div className="fixed bottom-0 inset-x-0 z-[85] md:hidden border-t border-white/10 bg-black/80 backdrop-blur px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="text-xs text-white/70 flex-1">
              Edit mode active{" "}
              <span className="text-white/40">
                {isDirty ? "• Unsaved changes" : "• All saved"}
              </span>
              <div className="text-[11px] text-white/40">
                {isDirty
                  ? "Autosave will run. Closing the tab will warn you."
                  : "Changes are saved."}
              </div>
            </div>
            <PillButton
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
         HERO
      ====================================================== */}
      <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center justify-center px-5 md:px-6 overflow-hidden">
        {content.hero.image && (
          <>
            <img
              src={content.hero.image}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />
          </>
        )}

        <div className="relative z-10 text-center max-w-3xl w-full">
          {editMode ? (
            <div className="mx-auto max-w-2xl">
              <FieldLabel>Headline</FieldLabel>
              <StableInput
                value={content.hero.headline}
                onChangeValue={(v: string) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline: v },
                  }))
                }
                placeholder="Restaurant name / headline"
                className="text-lg md:text-xl font-semibold text-center"
              />

              <div className="mt-4">
                <FieldLabel>Subheadline</FieldLabel>
                <StableTextarea
                  value={content.hero.subheadline}
                  onChangeValue={(v: string) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subheadline: v },
                    }))
                  }
                  placeholder="Short description / vibe / tagline"
                  rows={3}
                  className="text-center"
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <label className="w-full sm:w-auto cursor-pointer">
                  <span className="inline-flex w-full sm:w-auto items-center justify-center bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold">
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
                  <PillButton variant="ghost" onClick={removeHeroImage}>
                    Remove image
                  </PillButton>
                )}
              </div>

              <div className="mt-6 text-xs text-white/45">
                Tip: use a wide photo (at least 1600px wide) for a crisp banner.
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {content.hero.headline || username}
              </h1>

              {content.hero.subheadline && (
                <p className="mt-5 md:mt-6 text-lg md:text-xl text-white/80">
                  {content.hero.subheadline}
                </p>
              )}

              {hasMenu && (
                <PillButton
                  variant="primary"
                  onClick={() =>
                    menuRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-8 md:mt-10 px-7 md:px-8 py-3"
                >
                  View Menu
                </PillButton>
              )}
            </>
          )}
        </div>
      </section>

      {/* ======================================================
         MENU
      ====================================================== */}
      <section
        ref={menuRef}
        className="px-5 md:px-6 py-16 md:py-24 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-white/50">Menu</div>
              <h2 className="text-2xl md:text-3xl font-semibold mt-1">
                {editMode ? "Edit your menu" : "Explore our menu"}
              </h2>
            </div>

            {editMode && (
              <PillButton
                variant="soft"
                onClick={addCategory}
                className="hidden sm:inline-flex"
              >
                + Add category
              </PillButton>
            )}
          </div>

          {!content.menu.length && (
            <div className="mt-10 border border-white/10 rounded-2xl bg-black/40 p-6">
              <div className="text-white/80 font-semibold">No menu yet</div>
              <div className="text-sm text-white/50 mt-1">
                Add a category and start building your menu.
              </div>
              {editMode && (
                <PillButton
                  variant="primary"
                  onClick={addCategory}
                  className="mt-4"
                >
                  + Add first category
                </PillButton>
              )}
            </div>
          )}

          <div className="mt-10 md:mt-14 space-y-14 md:space-y-20">
            {content.menu.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-6">
                {/* Category header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {editMode ? (
                    <StableInput
                      value={cat.title}
                      onChangeValue={(v: string) =>
                        setContent((prev) => {
                          const copy = structuredClone(prev);
                          copy.menu[cIdx].title = v;
                          return copy;
                        })
                      }
                      className="text-[#e4b363] font-semibold text-lg md:text-xl"
                      placeholder="Category title"
                    />
                  ) : (
                    <h3 className="text-xl md:text-2xl font-semibold text-[#e4b363]">
                      {cat.title}
                    </h3>
                  )}

                  {editMode && (
                    <div className="flex gap-2">
                      <PillButton variant="soft" onClick={() => addItem(cIdx)}>
                        + Add item
                      </PillButton>
                      <PillButton
                        variant="danger"
                        onClick={() => removeCategory(cIdx)}
                      >
                        Remove
                      </PillButton>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="space-y-4 md:space-y-6">
                  {cat.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="border border-white/10 rounded-2xl bg-black/40 p-4 md:p-5"
                    >
                      <div className="flex flex-col md:flex-row gap-4 md:gap-5">
                        {/* IMAGE BOX */}
                        <div className="md:w-36">
                          <label
                            className={cx(
                              "w-full h-44 md:w-32 md:h-32 rounded-2xl border border-dashed border-white/25",
                              "flex items-center justify-center text-xs text-white/50",
                              editMode
                                ? "cursor-pointer hover:border-[#e4b363]/70"
                                : "cursor-default opacity-90"
                            )}
                            onDragOver={(e) => editMode && e.preventDefault()}
                            onDrop={(e) => {
                              if (!editMode) return;
                              e.preventDefault();
                              const f = e.dataTransfer.files?.[0];
                              if (f) uploadMenuItemImage(f, cIdx, iIdx);
                            }}
                            title={editMode ? "Drag & drop or click" : undefined}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                className="w-full h-full object-cover rounded-2xl"
                                alt=""
                              />
                            ) : (
                              <div className="text-center px-4">
                                <div className="font-semibold">Menu image</div>
                                <div className="opacity-60 mt-1">
                                  {editMode ? "Drag & drop or tap" : "No image"}
                                </div>
                              </div>
                            )}

                            {editMode && (
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) uploadMenuItemImage(f, cIdx, iIdx);
                                }}
                              />
                            )}
                          </label>

                          {editMode && item.image && (
                            <div className="mt-2 flex gap-2">
                              <label className="flex-1 cursor-pointer text-xs text-[#e4b363] border border-white/10 rounded-full px-3 py-2 text-center bg-white/5 hover:bg-white/10">
                                Replace
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) uploadMenuItemImage(f, cIdx, iIdx);
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => removeMenuItemImage(cIdx, iIdx)}
                                className="text-xs text-red-200 border border-red-500/20 rounded-full px-3 py-2 bg-red-500/10 hover:bg-red-500/15"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>

                        {/* TEXT */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              {editMode ? (
                                <>
                                  <FieldLabel>Name</FieldLabel>
                                  <StableInput
                                    value={item.name}
                                    onChangeValue={(v: string) =>
                                      setContent((prev) => {
                                        const copy = structuredClone(prev);
                                        copy.menu[cIdx].items[iIdx].name = v;
                                        return copy;
                                      })
                                    }
                                    placeholder="Item name"
                                    className="font-semibold"
                                  />
                                </>
                              ) : (
                                <div className="font-semibold text-lg">
                                  {item.name}
                                </div>
                              )}
                            </div>

                            <div className="sm:w-44">
                              {editMode ? (
                                <>
                                  <FieldLabel>Price</FieldLabel>
                                  <StableInput
                                    value={item.price}
                                    onChangeValue={(v: string) =>
                                      setContent((prev) => {
                                        const copy = structuredClone(prev);
                                        copy.menu[cIdx].items[iIdx].price = v;
                                        return copy;
                                      })
                                    }
                                    placeholder="$12"
                                    className="text-[#e4b363] font-semibold"
                                  />
                                </>
                              ) : (
                                <div className="text-[#e4b363] font-semibold text-lg sm:text-right">
                                  {item.price}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-3">
                            {editMode ? (
                              <>
                                <FieldLabel>Description</FieldLabel>
                                <StableTextarea
                                  value={item.description}
                                  onChangeValue={(v: string) =>
                                    setContent((prev) => {
                                      const copy = structuredClone(prev);
                                      copy.menu[cIdx].items[iIdx].description =
                                        v;
                                      return copy;
                                    })
                                  }
                                  placeholder="Short description (ingredients, style, etc.)"
                                  rows={3}
                                />
                              </>
                            ) : (
                              item.description && (
                                <p className="mt-2 text-sm text-white/70">
                                  {item.description}
                                </p>
                              )
                            )}
                          </div>

                          {editMode && (
                            <div className="mt-4 flex items-center justify-between gap-3">
                              <div className="text-xs text-white/45">
                                Tip: keep names short, descriptions 1–2 lines.
                              </div>

                              <PillButton
                                variant="danger"
                                onClick={() => removeItem(cIdx, iIdx)}
                              >
                                Delete item
                              </PillButton>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="sm:hidden">
                    <button
                      onClick={() => addItem(cIdx)}
                      className="w-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3 rounded-2xl text-sm font-semibold"
                    >
                      + Add item
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editMode && content.menu.length > 0 && (
            <div className="mt-12 sm:hidden">
              <button
                onClick={addCategory}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3 rounded-2xl text-sm font-semibold"
              >
                + Add category
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
         FOOTER
      ====================================================== */}
      <footer className="border-t border-white/10 px-5 md:px-6 py-16 md:py-20 bg-black/60 pb-28 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-white/50">Details</div>
              <h3 className="text-2xl md:text-3xl font-semibold mt-1">
                Contact & info
              </h3>
              {!editMode && (
                <div className="text-xs text-white/45 mt-2">
                  {content.contact.phone || content.contact.email
                    ? "Call or email us for reservations and inquiries."
                    : "Details will be added soon."}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-8 md:gap-10 text-sm">
            {/* Location */}
            <div className="border border-white/10 rounded-2xl bg-black/40 p-5">
              <h4 className="font-semibold mb-3">Location</h4>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Address</FieldLabel>
                    <StableInput
                      value={content.location.address}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          location: { ...prev.location, address: v },
                        }))
                      }
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <StableInput
                      value={content.location.city}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: v },
                        }))
                      }
                      placeholder="Chiang Mai"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white/70">
                    {content.location.address || "Address not set"}
                  </p>
                  <p className="text-white/70">{content.location.city}</p>
                </>
              )}
            </div>

            {/* Contact */}
            <div className="border border-white/10 rounded-2xl bg-black/40 p-5">
              <h4 className="font-semibold mb-3">Contact</h4>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <StableInput
                      value={content.contact.phone}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: v },
                        }))
                      }
                      placeholder="+66 000 000 000"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <StableInput
                      value={content.contact.email}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: v },
                        }))
                      }
                      placeholder="hello@restaurant.com"
                    />
                  </div>
                </div>
              ) : (
                <>
                  {content.contact.phone && (
                    <p className="text-white/70">{content.contact.phone}</p>
                  )}
                  {content.contact.email && (
                    <p className="text-white/70">{content.contact.email}</p>
                  )}
                  {!content.contact.phone && !content.contact.email && (
                    <p className="text-white/50">Contact not set</p>
                  )}
                </>
              )}
            </div>

            {/* Hours */}
            <div className="border border-white/10 rounded-2xl bg-black/40 p-5">
              <h4 className="font-semibold mb-3">Opening Hours</h4>

              {editMode ? (
                <div className="space-y-3">
                  <div>
                    <FieldLabel>Mon – Fri</FieldLabel>
                    <StableInput
                      value={content.hours.mon_fri}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          hours: { ...prev.hours, mon_fri: v },
                        }))
                      }
                      placeholder="11:00 – 22:00"
                    />
                  </div>
                  <div>
                    <FieldLabel>Sat – Sun</FieldLabel>
                    <StableInput
                      value={content.hours.sat_sun}
                      onChangeValue={(v: string) =>
                        setContent((prev) => ({
                          ...prev,
                          hours: { ...prev.hours, sat_sun: v },
                        }))
                      }
                      placeholder="12:00 – 23:00"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white/70">
                    Mon – Fri: {content.hours.mon_fri}
                  </p>
                  <p className="text-white/70">
                    Sat – Sun: {content.hours.sat_sun}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-10 text-xs text-white/35">
            Powered by AutopilotAI Website Builder
          </div>
        </div>
      </footer>
    </main>
  );
}
