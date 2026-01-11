"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

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
  [key: string]: any;
};

/* ======================================================
   NORMALIZATION (CRITICAL – PREVENTS CRASHES)
====================================================== */

function normalizeContent(raw: any, username: string): ContentState {
  return {
    hero: {
      headline: raw?.hero?.headline || username,
      subheadline: raw?.hero?.subheadline || "",
      image: raw?.hero?.image || null,
    },
    menu: Array.isArray(raw?.menu) ? raw.menu : [],
    contact: {
      phone: raw?.contact?.phone || "",
      email: raw?.contact?.email || "",
    },
    location: {
      address: raw?.location?.address || "",
      city: raw?.location?.city || "",
    },
    hours: {
      mon_fri: raw?.hours?.mon_fri || "11:00 – 22:00",
      sat_sun: raw?.hours?.sat_sun || "12:00 – 23:00",
    },
    ...raw,
  };
}

/* ======================================================
   STABLE INPUTS (FIXES TYPING ISSUE)
====================================================== */

function StableInput({
  value,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <input
      {...props}
      value={local}
      onChange={(e) => {
        setLocal(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
}

function StableTextarea({
  value,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  onChange: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <textarea
      {...props}
      value={local}
      onChange={(e) => {
        setLocal(e.target.value);
        onChange(e.target.value);
      }}
    />
  );
}

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
  content: rawContent,
  editMode,
}: {
  username: string;
  content: any;
  editMode: boolean;
}) {
  const [content, setContent] = useState<ContentState>(() =>
    normalizeContent(rawContent, username)
  );

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
    <main className="min-h-screen bg-[#0b0b0b] text-white pb-32">
      {/* ================= EDIT BAR ================= */}
      {editMode && (
        <>
          <div className="hidden md:flex fixed top-4 right-4 z-50 gap-3">
            <button
              onClick={saveAll}
              className="bg-[#e4b363] text-black px-6 py-2 rounded-full font-semibold"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full font-semibold">
              Edit mode
            </div>
          </div>

          <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-black/80 border-t border-white/10 px-4 py-3">
            <button
              onClick={saveAll}
              className="w-full bg-[#e4b363] text-black py-3 rounded-full font-semibold"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </>
      )}

      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-6 text-center">
        {content.hero.image && (
          <>
            <img
              src={content.hero.image}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}

        <div className="relative z-10 max-w-3xl w-full">
          {editMode ? (
            <>
              <StableInput
                value={content.hero.headline}
                onChange={(v) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, headline: v },
                  }))
                }
                className="text-4xl md:text-5xl font-bold bg-transparent outline-none w-full text-center"
              />

              <StableTextarea
                value={content.hero.subheadline}
                onChange={(v) =>
                  setContent((c) => ({
                    ...c,
                    hero: { ...c.hero, subheadline: v },
                  }))
                }
                className="mt-6 text-lg bg-transparent outline-none w-full text-center resize-none"
                rows={3}
              />
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold">
                {content.hero.headline}
              </h1>
              <p className="mt-6 text-xl text-white/80">
                {content.hero.subheadline}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ================= MENU ================= */}
      <section
        ref={menuRef}
        className="px-6 py-24 border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto space-y-20">
          {content.menu.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-8">
              {editMode ? (
                <StableInput
                  value={cat.title}
                  onChange={(v) =>
                    setContent((c) => {
                      const copy = structuredClone(c);
                      copy.menu[cIdx].title = v;
                      return copy;
                    })
                  }
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
                    {editMode ? (
                      <>
                        <StableInput
                          value={item.name}
                          onChange={(v) =>
                            setContent((c) => {
                              const copy = structuredClone(c);
                              copy.menu[cIdx].items[iIdx].name = v;
                              return copy;
                            })
                          }
                          className="font-semibold bg-transparent outline-none w-full"
                        />

                        <StableTextarea
                          value={item.description}
                          onChange={(v) =>
                            setContent((c) => {
                              const copy = structuredClone(c);
                              copy.menu[cIdx].items[iIdx].description = v;
                              return copy;
                            })
                          }
                          className="mt-2 bg-transparent outline-none w-full resize-none text-sm text-white/70"
                          rows={2}
                        />

                        <StableInput
                          value={item.price}
                          onChange={(v) =>
                            setContent((c) => {
                              const copy = structuredClone(c);
                              copy.menu[cIdx].items[iIdx].price = v;
                              return copy;
                            })
                          }
                          className="mt-2 bg-transparent outline-none text-[#e4b363] font-semibold"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-[#e4b363] font-semibold">
                            {item.price}
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-white/70">
                          {item.description}
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 px-6 py-20 bg-black/60">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
          <div>
            <h4 className="font-semibold mb-3">Location</h4>
            {editMode ? (
              <>
                <StableInput
                  value={content.location.address}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      location: { ...c.location, address: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full mb-2"
                />
                <StableInput
                  value={content.location.city}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      location: { ...c.location, city: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full"
                />
              </>
            ) : (
              <>
                <p className="text-white/70">{content.location.address}</p>
                <p className="text-white/70">{content.location.city}</p>
              </>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            {editMode ? (
              <>
                <StableInput
                  value={content.contact.phone}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      contact: { ...c.contact, phone: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full mb-2"
                />
                <StableInput
                  value={content.contact.email}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      contact: { ...c.contact, email: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full"
                />
              </>
            ) : (
              <>
                <p className="text-white/70">{content.contact.phone}</p>
                <p className="text-white/70">{content.contact.email}</p>
              </>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-3">Opening Hours</h4>
            {editMode ? (
              <>
                <StableInput
                  value={content.hours.mon_fri}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      hours: { ...c.hours, mon_fri: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full mb-2"
                />
                <StableInput
                  value={content.hours.sat_sun}
                  onChange={(v) =>
                    setContent((c) => ({
                      ...c,
                      hours: { ...c.hours, sat_sun: v },
                    }))
                  }
                  className="bg-transparent outline-none w-full"
                />
              </>
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
      </footer>
    </main>
  );
}
