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
  const [canEdit, setCanEdit] = useState(false);
  const [saving, setSaving] = useState(false);

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
          body: JSON.stringify({ menu }),
        }
      );

      alert("Menu saved");
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
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
            {saving ? "Saving…" : "Save Menu"}
          </button>
          <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold">
            Edit mode active
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold">
            {content.hero?.headline || username}
          </h1>
          <p className="mt-6 text-xl text-[#b5b5b5]">
            {content.hero?.subheadline}
          </p>
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} className="px-6 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Menu</h2>

          {menu.map((cat, cIdx) => (
            <div key={cIdx} className="mb-16">
              {editMode ? (
                <input
                  value={cat.title}
                  onChange={(e) => {
                    const copy = structuredClone(menu);
                    copy[cIdx].title = e.target.value;
                    setMenu(copy);
                  }}
                  className="text-2xl font-semibold text-[#e4b363] bg-transparent border-b border-white/20 mb-6 outline-none"
                />
              ) : (
                <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
                  {cat.title}
                </h3>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="border border-white/10 rounded-xl p-5 bg-black/40"
                  >
                    {editMode ? (
                      <>
                        <input
                          value={item.name}
                          onChange={(e) => {
                            const copy = structuredClone(menu);
                            copy[cIdx].items[iIdx].name = e.target.value;
                            setMenu(copy);
                          }}
                          className="font-semibold bg-transparent border-b border-white/20 w-full mb-2"
                        />

                        <input
                          value={item.price}
                          onChange={(e) => {
                            const copy = structuredClone(menu);
                            copy[cIdx].items[iIdx].price = e.target.value;
                            setMenu(copy);
                          }}
                          className="text-[#e4b363] bg-transparent border-b border-white/20 w-full mb-2"
                        />

                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const copy = structuredClone(menu);
                            copy[cIdx].items[iIdx].description =
                              e.target.value;
                            setMenu(copy);
                          }}
                          className="text-sm bg-transparent border border-white/10 w-full p-2 rounded"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="text-[#e4b363]">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-sm text-[#b5b5b5]">
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>

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
                  className="mt-4 text-sm text-[#e4b363]"
                >
                  + Add item
                </button>
              )}
            </div>
          ))}

          {editMode && (
            <button
              onClick={() =>
                setMenu([...menu, { title: "New category", items: [] }])
              }
              className="mt-10 text-sm text-[#e4b363]"
            >
              + Add category
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
