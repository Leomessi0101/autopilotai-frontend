"use client";

import { useEffect, useRef, useState } from "react";

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

function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
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
  const [uploading, setUploading] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* ======================================================
     IMAGE UPLOAD
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

  async function uploadHero(file: File) {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setContent({
        ...content,
        hero: { ...content.hero, image: url },
      });
    } finally {
      setUploading(false);
    }
  }

  async function uploadItemImage(
    file: File,
    cIdx: number,
    iIdx: number
  ) {
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
    <main className="min-h-screen bg-[#0b0b0b] text-white pb-24">
      {/* ================= SAVE BAR ================= */}
      {editMode && (
        <>
          {/* Desktop */}
          <div className="hidden md:flex fixed top-4 right-4 z-50 gap-3">
            <button
              onClick={saveAll}
              className="bg-[#e4b363] text-black px-6 py-2 rounded-full font-semibold shadow-lg"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <div className="bg-[#e4b363] text-black px-4 py-2 rounded-full font-semibold">
              Edit mode
            </div>
          </div>

          {/* Mobile */}
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
      <section className="relative min-h-[70vh] flex items-center justify-center px-6 text-center overflow-hidden">
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
              <input
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value },
                  })
                }
                className="text-4xl md:text-5xl font-bold bg-transparent outline-none w-full text-center"
              />
              <textarea
                value={content.hero.subheadline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheadline: e.target.value },
                  })
                }
                className="mt-4 text-lg bg-transparent outline-none w-full text-center resize-none"
              />

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <label className="cursor-pointer bg-[#e4b363] text-black px-6 py-2 rounded-full font-semibold">
                  {uploading ? "Uploading…" : "Upload hero image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && uploadHero(e.target.files[0])
                    }
                  />
                </label>
                {content.hero.image && (
                  <button
                    onClick={() =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, image: null },
                      })
                    }
                    className="border border-white/20 px-6 py-2 rounded-full"
                  >
                    Remove image
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold">
                {content.hero.headline}
              </h1>
              <p className="mt-4 text-white/80 text-lg">
                {content.hero.subheadline}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ================= MENU ================= */}
      <section ref={menuRef} className="px-6 py-24 max-w-4xl mx-auto space-y-20">
        {content.menu.map((cat, cIdx) => (
          <div key={cIdx} className="space-y-8">
            <div className="flex justify-between items-center">
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

              {editMode && (
                <button
                  onClick={() => {
                    const copy = structuredClone(content);
                    copy.menu.splice(cIdx, 1);
                    setContent(copy);
                  }}
                  className="text-red-400 text-sm"
                >
                  Remove category
                </button>
              )}
            </div>

            <div className="space-y-6">
              {cat.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="border border-white/10 rounded-2xl p-5 bg-black/40"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* IMAGE */}
                    <label
                      className={cx(
                        "w-full md:w-32 h-40 md:h-32 rounded-xl border border-dashed border-white/30 flex items-center justify-center text-xs text-white/50",
                        editMode &&
                          "cursor-pointer hover:border-[#e4b363]"
                      )}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="text-center">
                          Drag or click to upload
                        </div>
                      )}
                      {editMode && (
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) =>
                            e.target.files &&
                            uploadItemImage(
                              e.target.files[0],
                              cIdx,
                              iIdx
                            )
                          }
                        />
                      )}
                    </label>

                    {/* TEXT */}
                    <div className="flex-1">
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
                            className="text-lg font-semibold bg-transparent outline-none w-full"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const copy = structuredClone(content);
                              copy.menu[cIdx].items[iIdx].description =
                                e.target.value;
                              setContent(copy);
                            }}
                            className="mt-2 bg-transparent outline-none w-full resize-none text-white/70"
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

                          <button
                            onClick={() => {
                              const copy = structuredClone(content);
                              copy.menu[cIdx].items.splice(iIdx, 1);
                              setContent(copy);
                            }}
                            className="mt-3 text-xs text-red-400"
                          >
                            Remove item
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <div className="font-semibold">
                              {item.name}
                            </div>
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
                  </div>
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
                className="text-sm text-[#e4b363]"
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

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 px-6 py-20 bg-black/60">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-sm">
          {/* Location */}
          <div>
            <h4 className="font-semibold mb-3">Location</h4>
            {editMode ? (
              <>
                <input
                  value={content.location.address}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      location: {
                        ...content.location,
                        address: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full mb-2"
                  placeholder="Address"
                />
                <input
                  value={content.location.city}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      location: {
                        ...content.location,
                        city: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full"
                  placeholder="City"
                />
              </>
            ) : (
              <>
                <p className="text-white/70">
                  {content.location.address}
                </p>
                <p className="text-white/70">
                  {content.location.city}
                </p>
              </>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            {editMode ? (
              <>
                <input
                  value={content.contact.phone}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        phone: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full mb-2"
                  placeholder="Phone"
                />
                <input
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        email: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full"
                  placeholder="Email"
                />
              </>
            ) : (
              <>
                <p className="text-white/70">
                  {content.contact.phone}
                </p>
                <p className="text-white/70">
                  {content.contact.email}
                </p>
              </>
            )}
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold mb-3">Opening Hours</h4>
            {editMode ? (
              <>
                <input
                  value={content.hours.mon_fri}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hours: {
                        ...content.hours,
                        mon_fri: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full mb-2"
                  placeholder="Mon – Fri"
                />
                <input
                  value={content.hours.sat_sun}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hours: {
                        ...content.hours,
                        sat_sun: e.target.value,
                      },
                    })
                  }
                  className="bg-transparent outline-none w-full"
                  placeholder="Sat – Sun"
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
