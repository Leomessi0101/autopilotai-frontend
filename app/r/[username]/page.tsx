"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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

function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id ?? null;
  } catch {
    return null;
  }
}

export default function RestaurantPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const editRequested = searchParams.get("edit") === "1";
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

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

        setMenu(parsed.menu || []);
        setHeroImage(parsed.hero?.image || null);

        // 🔒 FINAL OWNER CHECK (JWT → user_id)
        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;

          const tokenUserId = getUserIdFromToken(token);
          if (tokenUserId && tokenUserId === res.user_id) {
            setCanEdit(true);
          }
        }
      });
  }, [username, editRequested]);

  const editMode = editRequested && canEdit;

  const content = useMemo(() => {
    if (!data) return null;
    try {
      return typeof data.content_json === "string"
        ? JSON.parse(data.content_json)
        : data.content_json;
    } catch {
      return null;
    }
  }, [data]);

  async function saveMenu() {
    if (!username) return;

    const token = localStorage.getItem("autopilot_token");
    if (!token) return;

    setSaving(true);

    try {
      await fetch(
        `https://autopilotai-api.onrender.com/api/restaurants/${username}/menu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Keep existing behavior; backend currently saves menu from payload.menu
          // Extra hero field is harmless (ignored unless you later extend backend)
          body: JSON.stringify({
            menu,
            hero: { ...(content?.hero || {}), image: heroImage },
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

  async function uploadToWorker(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("https://upload.autopilotai.dev/upload", {
      method: "POST",
      body: form,
    });

    const out = await res.json();
    if (!out?.url) throw new Error("No URL returned");
    return out.url;
  }

  async function uploadMenuItemImage(file: File, cIdx: number, iIdx: number) {
    setUploading(true);
    try {
      const url = await uploadToWorker(file);
      const copy = structuredClone(menu);
      copy[cIdx].items[iIdx].image = url;
      setMenu(copy);
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleDroppedFile(file: File, cIdx: number, iIdx: number) {
    if (!file.type.startsWith("image/")) {
      alert("Please drop an image file.");
      return;
    }
    uploadMenuItemImage(file, cIdx, iIdx);
  }

  function removeMenuItemImage(cIdx: number, iIdx: number) {
    const copy = structuredClone(menu);
    delete copy[cIdx].items[iIdx].image;
    setMenu(copy);
  }

  async function uploadHero(file: File) {
    setUploading(true);
    try {
      const url = await uploadToWorker(file);
      setHeroImage(url);
    } catch {
      alert("Hero upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!username || !content) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {editMode && (
        <div className="fixed top-4 right-4 z-50 flex gap-3">
          <button
            onClick={saveMenu}
            disabled={saving}
            className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold">
            Edit mode active
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            alt=""
          />
        )}

        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl font-bold">
            {content.hero?.headline || username}
          </h1>

          <p className="mt-6 text-xl text-[#b5b5b5]">
            {content.hero?.subheadline}
          </p>

          {menu.length > 0 && (
            <button
              onClick={() => menuRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="mt-10 bg-[#e4b363] text-black px-8 py-3 rounded-full font-semibold"
            >
              View Menu
            </button>
          )}

          {editMode && (
            <div className="mt-8 flex flex-wrap gap-4 justify-center items-center">
              <label className="cursor-pointer text-sm text-[#e4b363]">
                {heroImage ? "Replace hero image" : "Upload hero image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    uploadHero(f);
                  }}
                />
              </label>

              {heroImage && (
                <button
                  onClick={() => setHeroImage(null)}
                  className="text-sm text-red-400"
                >
                  Remove
                </button>
              )}

              {uploading && (
                <span className="text-xs text-white/40">Uploading…</span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} className="px-6 py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Menu</h2>

          {/* Long page / real menu flow */}
          <div className="space-y-16">
            {menu.map((cat, cIdx) => (
              <div key={cIdx} className="space-y-6">
                {/* Category title */}
                <div className="flex items-end justify-between gap-4">
                  {editMode ? (
                    <input
                      value={cat.title}
                      onChange={(e) => {
                        const copy = structuredClone(menu);
                        copy[cIdx].title = e.target.value;
                        setMenu(copy);
                      }}
                      className="text-2xl font-semibold text-[#e4b363] bg-transparent border-b border-white/20 outline-none w-full"
                    />
                  ) : (
                    <h3 className="text-2xl font-semibold text-[#e4b363]">
                      {cat.title}
                    </h3>
                  )}
                </div>

                {/* Items (one per row) */}
                <div className="space-y-5">
                  {cat.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="border border-white/10 rounded-2xl bg-black/35 p-4 md:p-5"
                    >
                      <div className="flex gap-4 md:gap-5 items-start">
                        {/* 512x512 look image (square) */}
                        <div className="shrink-0">
                          <div
                            className={[
                              "w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden",
                              editMode
                                ? "border border-dashed border-white/20 bg-black/40 cursor-copy"
                                : "border border-white/10 bg-black/40",
                            ].join(" ")}
                            onDragOver={(e) => editMode && e.preventDefault()}
                            onDrop={(e) => {
                              if (!editMode) return;
                              e.preventDefault();
                              const file = e.dataTransfer.files?.[0];
                              if (file) handleDroppedFile(file, cIdx, iIdx);
                            }}
                            title={editMode ? "Drag & drop a 512×512 image" : undefined}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                className="w-full h-full object-cover"
                                alt=""
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-white/35">
                                <div className="text-xs font-semibold">No image</div>
                                {editMode && (
                                  <div className="text-[10px] mt-1 text-white/25">
                                    Drop 512×512
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Replace / Remove */}
                          {editMode && (
                            <div className="mt-2 flex items-center gap-3">
                              <label className="text-xs text-[#e4b363] cursor-pointer">
                                Replace
                                <input
                                  type="file"
                                  accept="image/*"
                                  hidden
                                  disabled={uploading}
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    uploadMenuItemImage(f, cIdx, iIdx);
                                  }}
                                />
                              </label>

                              {item.image && (
                                <button
                                  onClick={() => removeMenuItemImage(cIdx, iIdx)}
                                  className="text-xs text-red-400"
                                  type="button"
                                >
                                  Remove
                                </button>
                              )}

                              {uploading && (
                                <span className="text-[10px] text-white/40">
                                  Uploading…
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Text block */}
                        <div className="flex-1 min-w-0">
                          {editMode ? (
                            <>
                              <div className="flex items-start justify-between gap-3">
                                <input
                                  value={item.name}
                                  onChange={(e) => {
                                    const copy = structuredClone(menu);
                                    copy[cIdx].items[iIdx].name = e.target.value;
                                    setMenu(copy);
                                  }}
                                  className="font-semibold bg-transparent border-b border-white/20 w-full outline-none"
                                />

                                <input
                                  value={item.price}
                                  onChange={(e) => {
                                    const copy = structuredClone(menu);
                                    copy[cIdx].items[iIdx].price = e.target.value;
                                    setMenu(copy);
                                  }}
                                  className="text-[#e4b363] bg-transparent border-b border-white/20 w-24 text-right outline-none shrink-0"
                                />
                              </div>

                              <textarea
                                value={item.description}
                                onChange={(e) => {
                                  const copy = structuredClone(menu);
                                  copy[cIdx].items[iIdx].description = e.target.value;
                                  setMenu(copy);
                                }}
                                className="mt-3 text-sm bg-transparent border border-white/10 w-full p-2 rounded-xl outline-none"
                                rows={3}
                              />
                            </>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-3">
                                <h4 className="font-semibold text-lg truncate">
                                  {item.name}
                                </h4>
                                <span className="text-[#e4b363] font-semibold shrink-0">
                                  {item.price}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-[#b5b5b5] leading-relaxed">
                                {item.description}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add item */}
                {editMode && (
                  <button
                    onClick={() => {
                      const copy = structuredClone(menu);
                      copy[cIdx].items.push({
                        name: "New item",
                        description: "",
                        price: "",
                      });
                      setMenu(copy);
                    }}
                    className="text-sm text-[#e4b363]"
                    type="button"
                  >
                    + Add item
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add category */}
          {editMode && (
            <button
              onClick={() => setMenu([...menu, { title: "New category", items: [] }])}
              className="mt-12 text-sm text-[#e4b363]"
              type="button"
            >
              + Add category
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
