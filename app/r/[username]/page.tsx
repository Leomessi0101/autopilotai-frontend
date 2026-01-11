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

/* ======================================================
   PAGE
====================================================== */

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

        setMenu(parsed.menu || []);
        setHeroImage(parsed.hero?.image || null);

        // 🔒 ownership check
        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;

          const tokenUserId = getUserIdFromToken(token);
          if (tokenUserId === res.user_id) {
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
      setHeroImage(url);
    } finally {
      setUploading(false);
    }
  }

  async function uploadMenuItemImage(
    file: File,
    cIdx: number,
    iIdx: number
  ) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const copy = structuredClone(menu);
      copy[cIdx].items[iIdx].image = url;
      setMenu(copy);
    } finally {
      setUploading(false);
    }
  }

  function removeMenuItemImage(cIdx: number, iIdx: number) {
    const copy = structuredClone(menu);
    delete copy[cIdx].items[iIdx].image;
    setMenu(copy);
  }

  /* ======================================================
     SAVE
  ====================================================== */

  async function saveAll() {
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
          body: JSON.stringify({
            menu,
            hero: {
              ...(content.hero || {}),
              image: heroImage,
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
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* EDIT BAR */}
      {editMode && (
        <div className="fixed top-4 right-4 z-50 flex gap-3">
          <button
            onClick={saveAll}
            disabled={saving}
            className="bg-[#e4b363] text-black px-5 py-2 rounded-full text-sm font-semibold"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold">
            Edit mode active
          </div>
        </div>
      )}

      {/* ======================================================
         HERO
      ====================================================== */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-6 overflow-hidden">
        {heroImage && (
          <>
            <img
              src={heroImage}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}

        <div className="relative z-10 text-center max-w-3xl">
          <h1 className="text-5xl font-bold tracking-tight">
            {content.hero?.headline || username}
          </h1>

          <p className="mt-6 text-xl text-white/80">
            {content.hero?.subheadline}
          </p>

          {menu.length > 0 && (
            <button
              onClick={() =>
                menuRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-10 bg-[#e4b363] text-black px-8 py-3 rounded-full font-semibold"
            >
              View Menu
            </button>
          )}

          {editMode && (
            <div className="mt-8 flex gap-4 justify-center items-center text-sm">
              <label className="cursor-pointer text-[#e4b363]">
                Drag or click to upload banner image
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
              {heroImage && (
                <button
                  onClick={() => setHeroImage(null)}
                  className="text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
         MENU
      ====================================================== */}
      <section
        ref={menuRef}
        className="px-6 py-24 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto space-y-20">
          {menu.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-8">
              <h3 className="text-2xl font-semibold text-[#e4b363]">
                {cat.title}
              </h3>

              <div className="space-y-6">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="border border-white/10 rounded-2xl bg-black/40 p-5"
                  >
                    <div className="flex gap-5">
                      {/* IMAGE */}
                      <label
                        className="w-32 h-32 rounded-xl border border-dashed border-white/30 flex items-center justify-center text-xs text-white/50 cursor-pointer hover:border-[#e4b363]"
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
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="font-semibold">
                              Drag image here
                            </div>
                            <div className="opacity-50">
                              or click to upload
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

                      {/* TEXT */}
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div className="font-semibold text-lg">
                            {item.name}
                          </div>
                          <div className="text-[#e4b363] font-semibold">
                            {item.price}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-white/70">
                          {item.description}
                        </p>
                        {item.image && editMode && (
                          <button
                            onClick={() =>
                              removeMenuItemImage(cIdx, iIdx)
                            }
                            className="mt-2 text-xs text-red-400"
                          >
                            Remove image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================
         FOOTER
      ====================================================== */}
      <footer className="border-t border-white/10 px-6 py-20 bg-black/60">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <h4 className="font-semibold mb-3">Location</h4>
            <p className="text-white/70">
              {content.location?.address || "Address not set"}
            </p>
            <p className="text-white/70">
              {content.location?.city}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            {content.contact?.phone && (
              <p className="text-white/70">{content.contact.phone}</p>
            )}
            {content.contact?.email && (
              <p className="text-white/70">{content.contact.email}</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-3">Opening Hours</h4>
            <p className="text-white/50">
              Mon – Fri: 11:00 – 22:00
            </p>
            <p className="text-white/50">
              Sat – Sun: 12:00 – 23:00
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
