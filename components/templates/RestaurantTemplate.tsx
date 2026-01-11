"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

function normalizeString(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function normalizeContent(raw: any, username: string): ContentState {
  // This is THE critical piece that prevents client-side crashes.
  // It guarantees all required objects exist with safe defaults.
  return {
    ...raw,
    hero: {
      headline: normalizeString(raw?.hero?.headline || username),
      subheadline: normalizeString(raw?.hero?.subheadline || ""),
      image: raw?.hero?.image || null,
    },
    menu: Array.isArray(raw?.menu) ? raw.menu : [],
    contact: {
      phone: normalizeString(raw?.contact?.phone || ""),
      email: normalizeString(raw?.contact?.email || ""),
    },
    location: {
      address: normalizeString(raw?.location?.address || ""),
      city: normalizeString(raw?.location?.city || ""),
    },
    hours: {
      mon_fri: normalizeString(raw?.hours?.mon_fri || "11:00 – 22:00"),
      sat_sun: normalizeString(raw?.hours?.sat_sun || "12:00 – 23:00"),
    },
  };
}

function emptyItem(): MenuItem {
  return { name: "New item", description: "", price: "" };
}

function emptyCategory(): MenuCategory {
  return { title: "New category", items: [emptyItem()] };
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
  content: any; // raw content_json (string already parsed by page.tsx)
  editMode: boolean;
}) {
  const [content, setContent] = useState<ContentState>(() =>
    normalizeContent(initialContent, username)
  );

  // If page.tsx re-fetches and passes new content (rare), keep in sync safely.

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveToast, setSaveToast] = useState<
    null | { type: "ok" | "err"; msg: string }
  >(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const hasMenu = useMemo(() => content.menu.length > 0, [content.menu.length]);

  /* ======================================================
     UI PRIMITIVES
  ====================================================== */

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[11px] uppercase tracking-wide text-white/45 mb-2">
      {children}
    </div>
  );

  const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        props.className
      )}
    />
  );

  const TextArea = (
    props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
  ) => (
    <textarea
      {...props}
      className={cx(
        "w-full bg-black/25 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/35 outline-none resize-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        props.className
      )}
    />
  );

  const PillButton = ({
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
  }) => {
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
  };

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
      setSaveToast({ type: "err", msg: "Hero upload failed" });
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
      setSaveToast({ type: "err", msg: "Image upload failed" });
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

  function updateCategoryTitle(cIdx: number, title: string) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu[cIdx].title = title;
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

  function updateItemField(
    cIdx: number,
    iIdx: number,
    field: keyof Omit<MenuItem, "image">,
    value: string
  ) {
    setContent((prev) => {
      const copy = structuredClone(prev);
      copy.menu[cIdx].items[iIdx][field] = value;
      return copy;
    });
  }

  /* ======================================================
     SAVE
  ====================================================== */

  async function saveAll() {
    const token = localStorage.getItem("autopilot_token");
    if (!token) {
      setSaveToast({ type: "err", msg: "Not logged in" });
      return;
    }

    setSaving(true);
    setSaveToast(null);

    try {
      const res = await fetch(
        `https://autopilotai-api.onrender.com/api/restaurants/${username}/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            menu: content.menu,
            hero: content.hero,
            contact: content.contact,
            location: content.location,
            hours: content.hours,
          }),
        }
      );

      if (!res.ok) throw new Error("Save failed");
      setSaveToast({ type: "ok", msg: "Saved" });
    } catch {
      setSaveToast({ type: "err", msg: "Save failed" });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveToast(null), 2500);
    }
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Top progress (upload/save) */}
      {(saving || uploading) && (
        <div className="fixed inset-x-0 top-0 z-[80] h-1 bg-[#e4b363]/20">
          <div className="h-full w-1/2 bg-[#e4b363] animate-pulse" />
        </div>
      )}

      {/* Toast */}
      {saveToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[90]">
          <div
            className={cx(
              "px-4 py-2 rounded-full text-sm font-semibold border shadow-lg shadow-black/30",
              saveToast.type === "ok"
                ? "bg-[#e4b363] text-black border-[#e4b363]/30"
                : "bg-red-500/15 text-red-100 border-red-500/25"
            )}
          >
            {saveToast.msg}
          </div>
        </div>
      )}

      {/* Desktop edit bar */}
      {editMode && (
        <div className="fixed top-4 right-4 z-[85] hidden md:flex gap-3">
          <PillButton
            variant="primary"
            onClick={saveAll}
            disabled={saving || uploading}
          >
            {saving ? "Saving…" : "Save changes"}
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
              Edit mode active
              <div className="text-[11px] text-white/40">
                Changes are local until you save
              </div>
            </div>
            <PillButton
              variant="primary"
              onClick={saveAll}
              disabled={saving || uploading}
              className="px-6"
            >
              {saving ? "Saving…" : "Save"}
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
              <Input
                value={content.hero.headline}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, headline: e.target.value },
                  }))
                }
                placeholder="Restaurant name / headline"
                className="text-lg md:text-xl font-semibold text-center"
              />

              <div className="mt-4">
                <FieldLabel>Subheadline</FieldLabel>
                <TextArea
                  value={content.hero.subheadline}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subheadline: e.target.value },
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
                    <Input
                      value={cat.title}
                      onChange={(e) => updateCategoryTitle(cIdx, e.target.value)}
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
                      <PillButton
                        variant="soft"
                        onClick={() => addItem(cIdx)}
                      >
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
                                  {editMode
                                    ? "Drag & drop or tap"
                                    : "No image"}
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
                                    if (f)
                                      uploadMenuItemImage(f, cIdx, iIdx);
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
                                  <Input
                                    value={item.name}
                                    onChange={(e) =>
                                      updateItemField(
                                        cIdx,
                                        iIdx,
                                        "name",
                                        e.target.value
                                      )
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
                                  <Input
                                    value={item.price}
                                    onChange={(e) =>
                                      updateItemField(
                                        cIdx,
                                        iIdx,
                                        "price",
                                        e.target.value
                                      )
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
                                <TextArea
                                  value={item.description}
                                  onChange={(e) =>
                                    updateItemField(
                                      cIdx,
                                      iIdx,
                                      "description",
                                      e.target.value
                                    )
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
                    <Input
                      value={content.location.address}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          location: { ...prev.location, address: e.target.value },
                        }))
                      }
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <Input
                      value={content.location.city}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value },
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
                    <Input
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value },
                        }))
                      }
                      placeholder="+66 000 000 000"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          contact: { ...prev.contact, email: e.target.value },
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
                    <Input
                      value={content.hours.mon_fri}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hours: { ...prev.hours, mon_fri: e.target.value },
                        }))
                      }
                      placeholder="11:00 – 22:00"
                    />
                  </div>
                  <div>
                    <FieldLabel>Sat – Sun</FieldLabel>
                    <Input
                      value={content.hours.sat_sun}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          hours: { ...prev.hours, sat_sun: e.target.value },
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
