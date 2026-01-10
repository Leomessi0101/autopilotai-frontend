"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type RestaurantData = {
  content_json: string | Record<string, any>;
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

export default function RestaurantPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState(false);
  const [menu, setMenu] = useState<MenuCategory[]>([]);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!username) return;

    fetch(`https://autopilotai-api.onrender.com/api/restaurants/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((res) => {
        setData(res);
        const parsed =
          typeof res.content_json === "string"
            ? JSON.parse(res.content_json)
            : res.content_json;

        setMenu(parsed.menu || []);
      })
      .catch(() => setError(true));
  }, [username]);

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

  if (!username || !data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Restaurant not found
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white relative">
      {editMode && (
        <div className="fixed top-4 right-4 z-50 rounded-full bg-[#e4b363] px-4 py-2 text-sm font-semibold text-black">
          Edit mode active
        </div>
      )}

      {/* HERO */}
      <section className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold">
            {content.hero?.headline || username}
          </h1>
          <p className="mt-6 text-xl text-[#b5b5b5]">
            {content.hero?.subheadline}
          </p>

          {menu.length > 0 && (
            <button
              onClick={() =>
                menuRef.current?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-10 rounded-full bg-[#e4b363] px-8 py-3 font-semibold text-black"
            >
              View Menu
            </button>
          )}
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-16">Our Menu</h2>

          {menu.map((cat, cIdx) => (
            <div key={cIdx} className="mb-16">
              <div className="flex items-center justify-between mb-6">
                {editMode ? (
                  <input
                    value={cat.title}
                    onChange={(e) => {
                      const copy = [...menu];
                      copy[cIdx].title = e.target.value;
                      setMenu(copy);
                    }}
                    className="bg-transparent border-b border-[#e4b363] text-2xl font-semibold outline-none"
                  />
                ) : (
                  <h3 className="text-2xl font-semibold text-[#e4b363]">
                    {cat.title}
                  </h3>
                )}

                {editMode && (
                  <button
                    onClick={() => {
                      const copy = [...menu];
                      copy.splice(cIdx, 1);
                      setMenu(copy);
                    }}
                    className="text-sm text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="rounded-xl border border-white/10 bg-black/40 p-5"
                  >
                    {editMode ? (
                      <>
                        <input
                          value={item.name}
                          placeholder="Item name"
                          onChange={(e) => {
                            const copy = [...menu];
                            copy[cIdx].items[iIdx].name = e.target.value;
                            setMenu(copy);
                          }}
                          className="w-full bg-transparent font-semibold mb-2 outline-none"
                        />

                        <textarea
                          value={item.description}
                          placeholder="Description"
                          onChange={(e) => {
                            const copy = [...menu];
                            copy[cIdx].items[iIdx].description = e.target.value;
                            setMenu(copy);
                          }}
                          className="w-full bg-transparent text-sm text-[#b5b5b5] outline-none mb-2"
                        />

                        <input
                          value={item.price}
                          placeholder="$12"
                          onChange={(e) => {
                            const copy = [...menu];
                            copy[cIdx].items[iIdx].price = e.target.value;
                            setMenu(copy);
                          }}
                          className="w-24 bg-transparent text-[#e4b363] outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between mb-2">
                          <h4 className="font-semibold">{item.name}</h4>
                          <span className="text-[#e4b363]">{item.price}</span>
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
                    const copy = [...menu];
                    copy[cIdx].items.push({
                      name: "",
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
                setMenu([...menu, { title: "New Category", items: [] }])
              }
              className="mt-10 rounded-full border border-[#e4b363] px-6 py-2 text-[#e4b363]"
            >
              + Add category
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
