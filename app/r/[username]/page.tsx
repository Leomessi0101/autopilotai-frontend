"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/* ======================================================
   TYPES
====================================================== */

type RestaurantData = {
  content_json: string | Record<string, any>;
  user_id?: number;
};

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
  // allow extra unknown template fields safely
  [key: string]: any;
};

/* ======================================================
   HELPERS
====================================================== */

function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id ?? null;
  } catch {
    return null;
  }
}

function normalizeString(v: any): string {
  if (v === null || v === undefined) return "";
  return String(v);
}

function makeEmptyItem(): MenuItem {
  return { name: "New item", description: "", price: "" };
}

function makeEmptyCategory(): MenuCategory {
  return { title: "New category", items: [makeEmptyItem()] };
}

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ======================================================
   PAGE
====================================================== */

export default function RestaurantPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const editRequested = searchParams.get("edit") === "1";
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);

  // IMPORTANT: content is always fully shaped => no TS red lines on menu
  const [content, setContent] = useState<ContentState | null>(null);

  const [canEdit, setCanEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ======================================================
     FETCH WEBSITE
  ====================================================== */

  useEffect(() => {
    if (!username) return;

    fetch(`https://autopilotai-api.onrender.com/api/restaurants/${username}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);

        const parsed =
          typeof res.content_json === "string"
            ? JSON.parse(res.content_json)
            : res.content_json;

        const next: ContentState = {
          ...parsed,
          hero: {
            headline: normalizeString(parsed?.hero?.headline || username),
            subheadline: normalizeString(parsed?.hero?.subheadline || ""),
            image: parsed?.hero?.image || null,
          },
          menu: Array.isArray(parsed?.menu) ? parsed.menu : [],
          contact: {
            phone: normalizeString(parsed?.contact?.phone || ""),
            email: normalizeString(parsed?.contact?.email || ""),
          },
          location: {
            address: normalizeString(parsed?.location?.address || ""),
            city: normalizeString(parsed?.location?.city || ""),
          },
          hours: {
            mon_fri: normalizeString(parsed?.hours?.mon_fri || "11:00 – 22:00"),
            sat_sun: normalizeString(parsed?.hours?.sat_sun || "12:00 – 23:00"),
          },
        };

        setContent(next);

        // 🔒 ownership check
        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;

          const tokenUserId = getUserIdFromToken(token);
          if (tokenUserId === res.user_id) {
            setCanEdit(true);
          }
        }
      })
      .catch(() => {
        // keep UI stable if fetch fails
        setData(null);
        setContent(null);
      });
  }, [username, editRequested]);

  const editMode = editRequested && canEdit;

  const hasMenu = useMemo(() => {
    return !!content?.menu?.length;
  }, [content?.menu?.length]);

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
    if (!content) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setContent({ ...content, hero: { ...content.hero, image: url } });
    } finally {
      setUploading(false);
    }
  }

  async function uploadMenuItemImage(file: File, cIdx: number, iIdx: number) {
    if (!content) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const copy = structuredClone(content);
      copy.menu[cIdx].items[iIdx].image = url;
      setContent(copy);
    } finally {
      setUploading(false);
    }
  }

  function removeMenuItemImage(cIdx: number, iIdx: number) {
    if (!content) return;
    const copy = structuredClone(content);
    delete copy.menu[cIdx].items[iIdx].image;
    setContent(copy);
  }

  function removeHeroImage() {
    if (!content) return;
    setContent({ ...content, hero: { ...content.hero, image: null } });
  }

  /* ======================================================
     EDIT HELPERS (MENU)
  ====================================================== */

  function updateCategoryTitle(cIdx: number, title: string) {
    if (!content) return;
    const copy = structuredClone(content);
    copy.menu[cIdx].title = title;
    setContent(copy);
  }

  function addCategory() {
    if (!content) return;
    const copy = structuredClone(content);
    copy.menu.push(makeEmptyCategory());
    setContent(copy);
    setTimeout(() => menuRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function removeCategory(cIdx: number) {
    if (!content) return;
    const copy = structuredClone(content);
    copy.menu.splice(cIdx, 1);
    setContent(copy);
  }

  function addItem(cIdx: number) {
    if (!content) return;
    const copy = structuredClone(content);
    copy.menu[cIdx].items.push(makeEmptyItem());
    setContent(copy);
  }

  function removeItem(cIdx: number, iIdx: number) {
    if (!content) return;
    const copy = structuredClone(content);
    copy.menu[cIdx].items.splice(iIdx, 1);
    setContent(copy);
  }

  function updateItemField(
    cIdx: number,
    iIdx: number,
    field: keyof Omit<MenuItem, "image">,
    value: string
  ) {
    if (!content) return;
    const copy = structuredClone(content);
    (copy.menu[cIdx].items[iIdx][field] as string) = value;
    setContent(copy);
  }

  /* ======================================================
     SAVE
  ====================================================== */

  async function saveAll() {
    if (!username || !content) return;

    const token = localStorage.getItem("autopilot_token");
    if (!token) return;

    setSaving(true);

    try {
      // Keep backend contract SAFE: only send what the route is known to merge:
      // - menu always
      // - hero if provided
      // NOTE: If you later update backend to merge contact/location/hours,
      // we can include them here in one small change.
      await fetch(
        `https://autopilotai-api.onrender.com/api/restaurants/${username}/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            menu: content.menu,
            hero: {
              ...(content.hero || {}),
              image: content.hero.image,
            },
          }),
        }
      );
      alert("Saved");
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  /* ======================================================
     LOADING
  ====================================================== */

  if (!username || !content) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 text-center">
        Loading…
      </main>
    );
  }

  /* ======================================================
     UI COMPONENTS (INLINE)
  ====================================================== */

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-xs uppercase tracking-wide text-white/50 mb-2">
      {children}
    </div>
  );

  const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      className={classNames(
        "w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/40 outline-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        props.className
      )}
    />
  );

  const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
      {...props}
      className={classNames(
        "w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2",
        "text-white placeholder:text-white/40 outline-none resize-none",
        "focus:border-[#e4b363]/60 focus:ring-2 focus:ring-[#e4b363]/15",
        props.className
      )}
    />
  );

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Uploading indicator */}
      {(uploading || saving) && (
        <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-[#e4b363]/20">
          <div className="h-full w-1/2 bg-[#e4b363] animate-pulse" />
        </div>
      )}

      {/* EDIT BAR (desktop) */}
      {editMode && (
        <div className="fixed top-4 right-4 z-50 hidden md:flex gap-3">
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-black/30"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-black/30">
            Edit mode active
          </div>
        </div>
      )}

      {/* EDIT BAR (mobile sticky bottom) */}
      {editMode && (
        <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-white/10 bg-black/80 backdrop-blur px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="text-xs text-white/70 flex-1">
              Edit mode active
              <div className="text-[11px] text-white/40">
                Changes are local until you save
              </div>
            </div>
            <button
              onClick={saveAll}
              disabled={saving}
              className="bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold"
            >
              {saving ? "Saving…" : "Save"}
            </button>
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </>
        )}

        <div className="relative z-10 text-center max-w-3xl w-full">
          {editMode ? (
            <div className="mx-auto max-w-2xl">
              <FieldLabel>Headline</FieldLabel>
              <TextInput
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value },
                  })
                }
                placeholder="Restaurant name / headline"
                className="text-lg md:text-xl font-semibold text-center"
              />

              <div className="mt-4">
                <FieldLabel>Subheadline</FieldLabel>
                <TextArea
                  value={content.hero.subheadline}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, subheadline: e.target.value },
                    })
                  }
                  placeholder="Short description / vibe / tagline"
                  rows={3}
                  className="text-center"
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center justify-center">
                <label className="w-full sm:w-auto cursor-pointer bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold text-center">
                  {uploading ? "Uploading…" : "Upload hero image"}
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
                  <button
                    onClick={removeHeroImage}
                    className="w-full sm:w-auto px-5 py-2 rounded-full text-sm font-semibold border border-white/15 text-white/80"
                  >
                    Remove image
                  </button>
                )}
              </div>

              <div className="mt-6 text-xs text-white/45">
                Tip: Use a wide photo (at least 1600px wide) for a crisp banner.
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
                <button
                  onClick={() =>
                    menuRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-8 md:mt-10 bg-[#e4b363] text-black px-7 md:px-8 py-3 rounded-full font-semibold"
                >
                  View Menu
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* ======================================================
         MENU
      ====================================================== */}
      <section ref={menuRef} className="px-5 md:px-6 py-16 md:py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-white/50">Menu</div>
              <h2 className="text-2xl md:text-3xl font-semibold mt-1">
                {editMode ? "Edit your menu" : "Explore our menu"}
              </h2>
            </div>

            {editMode && (
              <button
                onClick={addCategory}
                className="hidden sm:inline-flex bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold"
              >
                + Add category
              </button>
            )}
          </div>

          {!content.menu.length && (
            <div className="mt-10 border border-white/10 rounded-2xl bg-black/40 p-6">
              <div className="text-white/80 font-semibold">No menu yet</div>
              <div className="text-sm text-white/50 mt-1">
                Add a category and start building your menu.
              </div>
              {editMode && (
                <button
                  onClick={addCategory}
                  className="mt-4 bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold"
                >
                  + Add first category
                </button>
              )}
            </div>
          )}

          <div className="mt-10 md:mt-14 space-y-14 md:space-y-20">
            {content.menu.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-6">
                {/* Category header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {editMode ? (
                    <TextInput
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
                      <button
                        onClick={() => addItem(cIdx)}
                        className="bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        + Add item
                      </button>
                      <button
                        onClick={() => removeCategory(cIdx)}
                        className="border border-red-500/30 bg-red-500/10 hover:bg-red-500/15 text-red-200 px-4 py-2 rounded-full text-sm font-semibold"
                      >
                        Remove
                      </button>
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
                            className={classNames(
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
                                    ? "Drag & drop or tap to upload"
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
                                  <TextInput
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
                                  <TextInput
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

                              <button
                                onClick={() => removeItem(cIdx, iIdx)}
                                className="text-sm font-semibold border border-red-500/25 bg-red-500/10 hover:bg-red-500/15 text-red-200 px-4 py-2 rounded-full"
                              >
                                Delete item
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {editMode && (
                  <button
                    onClick={() => addItem(cIdx)}
                    className="sm:hidden w-full bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-3 rounded-2xl text-sm font-semibold"
                  >
                    + Add item
                  </button>
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
         FOOTER (VIEW + EDIT UI)
      ====================================================== */}
      <footer className="border-t border-white/10 px-5 md:px-6 py-16 md:py-20 bg-black/60 pb-28 md:pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-sm text-white/50">Details</div>
              <h3 className="text-2xl md:text-3xl font-semibold mt-1">
                Contact & info
              </h3>
              {editMode && (
                <div className="text-xs text-white/45 mt-2">
                  These fields edit locally. Saving them requires backend merge support.
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
                    <TextInput
                      value={content.location.address}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          location: { ...content.location, address: e.target.value },
                        })
                      }
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <FieldLabel>City</FieldLabel>
                    <TextInput
                      value={content.location.city}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          location: { ...content.location, city: e.target.value },
                        })
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
                    <TextInput
                      value={content.contact.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, phone: e.target.value },
                        })
                      }
                      placeholder="+66 000 000 000"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextInput
                      value={content.contact.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          contact: { ...content.contact, email: e.target.value },
                        })
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
                    <TextInput
                      value={content.hours.mon_fri}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hours: { ...content.hours, mon_fri: e.target.value },
                        })
                      }
                      placeholder="11:00 – 22:00"
                    />
                  </div>
                  <div>
                    <FieldLabel>Sat – Sun</FieldLabel>
                    <TextInput
                      value={content.hours.sat_sun}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hours: { ...content.hours, sat_sun: e.target.value },
                        })
                      }
                      placeholder="12:00 – 23:00"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-white/70">Mon – Fri: {content.hours.mon_fri}</p>
                  <p className="text-white/70">Sat – Sun: {content.hours.sat_sun}</p>
                </>
              )}
            </div>
          </div>

          {/* small branding / template footer */}
          <div className="mt-10 text-xs text-white/35">
            Powered by AutopilotAI Website Builder
          </div>
        </div>
      </footer>
    </main>
  );
}
