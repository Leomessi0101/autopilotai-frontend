"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RestaurantData = {
  content_json: string | Record<string, any>;
};

export default function RestaurantPage() {
  const params = useParams();
  const username = params?.username as string | undefined;

  const [data, setData] = useState<RestaurantData | null>(null);
  const [error, setError] = useState(false);

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
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Restaurant not found</h1>
          <p className="text-gray-400">
            This restaurant page does not exist yet.
          </p>
        </div>
      </main>
    );
  }

  const hours: Record<string, string> = content.hours || {};
  const menu: any[] = content.menu || [];

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Promo bar */}
      {content.promo?.text && (
        <div className="bg-[#e4b363] text-black text-center py-2 text-sm font-medium">
          {content.promo.text}
        </div>
      )}

      {/* Hero */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <span className="mb-4 inline-block text-sm tracking-widest text-[#e4b363]">
            RESTAURANT
          </span>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            {content.hero?.headline || username}
          </h1>

          <p className="mt-6 text-xl text-[#b5b5b5]">
            {content.hero?.subheadline || "Amazing food, unforgettable taste"}
          </p>

          <div className="mt-10">
            <button className="rounded-full bg-[#e4b363] px-8 py-3 text-black font-semibold hover:opacity-90 transition">
              View Menu
            </button>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      {menu.length > 0 && (
        <section className="border-t border-white/10 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-14">
              Our Menu
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {menu.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 rounded-2xl overflow-hidden border border-white/10 hover:border-[#e4b363]/40 transition"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-48 w-full object-cover"
                    />
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">
                        {item.name}
                      </h3>
                      {item.price && (
                        <span className="text-[#e4b363] font-semibold">
                          {item.price}
                        </span>
                      )}
                    </div>

                    <p className="text-[#b5b5b5] text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOURS + CONTACT */}
      <section className="border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Opening Hours
            </h3>

            <ul className="space-y-3 text-[#b5b5b5]">
              {Object.entries(hours).map(([day, time]) => (
                <li
                  key={day}
                  className="flex justify-between border-b border-white/10 pb-2 capitalize"
                >
                  <span>{day}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-[#e4b363] mb-6">
              Contact Us
            </h3>

            <p className="text-[#b5b5b5] mb-3">
              📞 {content.contact?.phone || "+1 234 567 890"}
            </p>

            {content.contact?.email && (
              <p className="text-[#b5b5b5] mb-3">
                ✉️ {content.contact.email}
              </p>
            )}

            {content.contact?.address && (
              <p className="text-[#b5b5b5]">
                📍 {content.contact.address}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
