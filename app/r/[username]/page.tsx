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
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");

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
        setHeroHeadline(parsed.hero?.headline || username);
        setHeroSubheadline(parsed.hero?.subheadline || "");

        if (editRequested && res.user_id) {
          const token = localStorage.getItem("autopilot_token");
          if (!token) return;
          if (getUserIdFromToken(token) === res.user_id) {
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
              headline: heroHeadline,
              subheadline: heroSubheadline,
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

      {/* HERO */}
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
          {editMode ? (
            <>
              <input
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="text-5xl font-bold bg-transparent text-center outline-none w-full"
              />
              <textarea
                value={heroSubheadline}
                onChange={(e) => setHeroSubheadline(e.target.value)}
                className="mt-6 text-xl bg-transparent text-center outline-none w-full resize-none"
              />
            </>
          ) : (
            <>
              <h1 className="text-5xl font-bold">{heroHeadline}</h1>
              <p className="mt-6 text-xl text-white/80">
                {heroSubheadline}
              </p>
            </>
          )}
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} className="px-6 py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-20">
          {menu.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-8">
              {editMode ? (
                <input
                  value={cat.title}
                  onChange={(e) => {
                    const copy = structuredClone(menu);
                    copy[cIdx].title = e.target.value;
                    setMenu(copy);
                  }}
                  className="text-2xl font-semibold bg-transparent outline-none text-[#e4b363]"
                />
              ) : (
                <h3 className="text-2xl font-semibold text-[#e4b363]">
                  {cat.title}
                </h3>
              )}

              <div className="space-y-6">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="border border-white/10 rounded-2xl bg-black/40 p-5"
                  >
                    <div className="flex gap-5">
                      <div className="flex-1 space-y-2">
                        {editMode ? (
                          <>
                            <input
                              value={item.name}
                              onChange={(e) => {
                                const copy = structuredClone(menu);
                                copy[cIdx].items[iIdx].name =
                                  e.target.value;
                                setMenu(copy);
                              }}
                              className="text-lg font-semibold bg-transparent outline-none w-full"
                            />
                            <textarea
                              value={item.description}
                              onChange={(e) => {
                                const copy = structuredClone(menu);
                                copy[cIdx].items[iIdx].description =
                                  e.target.value;
                                setMenu(copy);
                              }}
                              className="text-sm bg-transparent outline-none w-full resize-none text-white/70"
                            />
                            <input
                              value={item.price}
                              onChange={(e) => {
                                const copy = structuredClone(menu);
                                copy[cIdx].items[iIdx].price =
                                  e.target.value;
                                setMenu(copy);
                              }}
                              className="text-[#e4b363] font-semibold bg-transparent outline-none"
                            />
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-lg">
                              {item.name}
                            </div>
                            <p className="text-sm text-white/70">
                              {item.description}
                            </p>
                            <div className="text-[#e4b363] font-semibold">
                              {item.price}
                            </div>
                          </>
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
    </main>
  );
}
