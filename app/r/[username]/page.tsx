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
  const [menu, setMenu] = useState<MenuCategory[]>([]);
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
      });
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
        <div className="fixed top-4 right-4 z-50 bg-[#e4b363] text-black px-4 py-2 rounded-full text-sm font-semibold">
          Edit mode active
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
        </div>
      </section>

      {/* MENU */}
      <section ref={menuRef} className="px-6 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Menu</h2>

          {menu.map((cat, cIdx) => (
            <div key={cIdx} className="mb-16">
              <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
                {cat.title}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {cat.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="border border-white/10 rounded-xl p-5 bg-black/40"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        className="h-40 w-full object-cover rounded mb-4"
                      />
                    ) : (
                      <div className="h-40 flex items-center justify-center text-white/30 border border-dashed border-white/20 rounded mb-4">
                        No image
                      </div>
                    )}

                    {editMode && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          const copy = [...menu];
                          copy[cIdx].items[iIdx].image = url;
                          setMenu(copy);
                        }}
                        className="mb-3 text-sm"
                      />
                    )}

                    <div className="flex justify-between mb-2">
                      <h4 className="font-semibold">{item.name}</h4>
                      <span className="text-[#e4b363]">{item.price}</span>
                    </div>
                    <p className="text-sm text-[#b5b5b5]">
                      {item.description}
                    </p>
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
