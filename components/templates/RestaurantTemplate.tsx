"use client";

import { useRef, useState } from "react";

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
};

/* ======================================================
   HELPERS
====================================================== */

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
  content: ContentState;
  editMode: boolean;
}) {
  const [content, setContent] = useState<ContentState>(initialContent);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ======================================================
     SAVE
  ====================================================== */

  async function saveAll() {
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
            menu: content.menu,
            hero: content.hero,
            contact: content.contact,
            location: content.location,
            hours: content.hours,
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
     RENDER
  ====================================================== */

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* MOBILE SAVE BAR */}
      {editMode && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-black/80 border-t border-white/10 px-4 py-3 md:hidden">
          <button
            onClick={saveAll}
            className="w-full bg-[#e4b363] text-black py-3 rounded-full font-semibold"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 text-center">
        {content.hero.image && (
          <>
            <img
              src={content.hero.image}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}

        <div className="relative z-10 max-w-2xl w-full">
          {editMode ? (
            <>
              <input
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value },
                  })
                }
                className="text-3xl font-bold bg-transparent outline-none w-full text-center"
              />
              <textarea
                value={content.hero.subheadline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheadline: e.target.value },
                  })
                }
                className="mt-4 bg-transparent outline-none w-full text-center resize-none"
              />
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold">{content.hero.headline}</h1>
              <p className="mt-4 text-white/80">
                {content.hero.subheadline}
              </p>
            </>
          )}
        </div>
      </section>

      {/* MENU */}
      <section
        ref={menuRef}
        className="px-6 py-20 max-w-4xl mx-auto space-y-16"
      >
        {content.menu.map((cat, cIdx) => (
          <div key={cIdx}>
            {editMode ? (
              <input
                value={cat.title}
                onChange={(e) => {
                  const copy = structuredClone(content);
                  copy.menu[cIdx].title = e.target.value;
                  setContent(copy);
                }}
                className="text-2xl font-semibold bg-transparent outline-none text-[#e4b363]"
              />
            ) : (
              <h3 className="text-2xl font-semibold text-[#e4b363]">
                {cat.title}
              </h3>
            )}

            <div className="mt-6 space-y-4">
              {cat.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="border border-white/10 rounded-xl p-4"
                >
                  {editMode ? (
                    <>
                      <input
                        value={item.name}
                        onChange={(e) => {
                          const copy = structuredClone(content);
                          copy.menu[cIdx].items[iIdx].name =
                            e.target.value;
                          setContent(copy);
                        }}
                        className="font-semibold bg-transparent outline-none w-full"
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const copy = structuredClone(content);
                          copy.menu[cIdx].items[iIdx].description =
                            e.target.value;
                          setContent(copy);
                        }}
                        className="mt-2 bg-transparent outline-none w-full resize-none text-sm text-white/70"
                      />
                      <input
                        value={item.price}
                        onChange={(e) => {
                          const copy = structuredClone(content);
                          copy.menu[cIdx].items[iIdx].price =
                            e.target.value;
                          setContent(copy);
                        }}
                        className="mt-2 bg-transparent outline-none text-[#e4b363] font-semibold"
                      />
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">{item.name}</div>
                      <p className="text-sm text-white/70">
                        {item.description}
                      </p>
                      <div className="text-[#e4b363] font-semibold">
                        {item.price}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {editMode && (
              <button
                onClick={() => {
                  const copy = structuredClone(content);
                  copy.menu[cIdx].items.push(emptyItem());
                  setContent(copy);
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
            onClick={() => {
              const copy = structuredClone(content);
              copy.menu.push(emptyCategory());
              setContent(copy);
            }}
            className="text-[#e4b363] font-semibold"
          >
            + Add category
          </button>
        )}
      </section>
    </main>
  );
}
