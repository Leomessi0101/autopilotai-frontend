"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type RestaurantData = {
  content_json: string | Record<string, any>;
};

export default function RestaurantPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("edit") === "1";

  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!username) return;

    fetch(`https://autopilotai-api.onrender.com/api/restaurants/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
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

  const menu: any[] = content.menu || [];
  const hours: Record<string, string> = content.hours || {};

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white relative">
      {/* EDIT MODE BANNER */}
      {editMode && (
        <div className="fixed top-4 right-4 z-50 rounded-full bg-[#e4b363] px-4 py-2 text-sm font-semibold text-black shadow">
          Edit mode active
        </div>
      )}

      {/* PROMO */}
      {content.promo?.text && (
        <div className="bg-[#e4b363] text-black text-center py-2 text-sm font-medium">
          {content.promo.text}
        </div>
      )}

      {/* HERO */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-[#e4b363]">
            RESTAURANT
          </span>

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
      {menu.length > 0 && (
        <section ref={menuRef} className="px-6 py-24 border-t border-white/10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-14">
              Our Menu
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {menu.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center text-white/30 text-sm">
                      Image coming soon
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <span className="text-[#e4b363]">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-[#b5b5b5] text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT MODE MENU CTA */}
            {editMode && (
              <div className="mt-16 text-center text-white/40">
                Menu editing coming next
              </div>
            )}
          </div>
        </section>
      )}

      {/* HOURS + CONTACT */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Opening Hours
            </h3>
            {Object.entries(hours).map(([day, time]) => (
              <div key={day} className="flex justify-between border-b border-white/10 pb-2 capitalize text-[#b5b5b5]">
                <span>{day}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Contact
            </h3>
            <p>📞 {content.contact?.phone}</p>
            <p>✉️ {content.contact?.email}</p>
            <p>📍 {content.contact?.address}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
